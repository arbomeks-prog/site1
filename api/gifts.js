export const config = {
    maxDuration: 60
};

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Prompt required' });

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 55000);

        const response = await fetch('https://api.x.ai/v1/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'grok-4.3',
                tools: [{ type: 'web_search' }],
                input: [
                    {
                        role: 'system',
                        content: `Önce her hediye fikri için web'de gerçekten satılan, bulunabilir ürün kategorilerini ARA ve sonuçları gör. Asla birbirine ilgisiz iki kriteri zorla tek bir üründe birleştirip hayali bir kategori uydurma — sadece gerçekten var olan, internette gerçekten satılan ürün kategorilerini öner. Önerdiğin hediyenin adını web'de aratınca gerçek bir ürün sayfası çıkmalı — çıkmıyorsa o hediyeyi önerme. Birleşik hayali kategoriler kesinlikle yasak. Aynı hediye kategorisini kesinlikle tekrar etme. Her hediye birbirinden tamamen farklı ve özgün olsun. Sadece JSON array döndür. Başka hiçbir şey yazma, markdown kullanma.

GENEL KURALLAR:
- searchQuery'de hediye doğası gereği cinsiyete özel bir ürünse aramanın başına erkek veya kadın kelimesini ekle. Unisex ürünlerde cinsiyet ekleme. searchQuery'de tarz veya tema varsa cinsiyet yerine tarzı ön plana çıkar. yetişkin kelimesini sadece roman, hikaye, edebiyat gibi kitap türlerinin searchQuery'sinde kullan. yetişkin, erkek, kadın gibi kelimeler asla name alanına yazılmaz.
- Burç aramasında searchQuery'de doğrudan burcun adını kullan — burcu ekini kaldır, sadece burcun adı yeterli.
- Önerdiğin hediyeyi searchQuery'de aynen ara. Sonuç vermezse sırasıyla: figürlü, desenli, resimli, işlemeli, sembollü dene. Renk ve boyut sıfatları ile marka adları yasak. Tarz ve tema kelimeleri yasak değil, searchQuery'de koru.
- searchQuery'de niteleyici kelimeyi düşürme — hediyenin tam adını yaz.
- Ürün isimlerinde doğal Türkçe kelime sıralaması kullan.
- name ve description alanlarına cinsiyet bilgisi yazma. Yiyecek, içecek, elektronik, spor ekipmanı gibi ürünlere cinsiyet ekleme.
- Emin olmadığın ürünlere seti ekleme — gerçekten set olarak satılıyorsa kullan.
- searchQuery tüm platformlara aynı anda gönderilir — tek bir searchQuery belirle. searchQueryEn alanına İngilizce görsel araması yaz.
- mevcutPlatformlar alanı için mutlaka şu 5 platformun hepsini kontrol et: trendyol.com, hepsiburada.com, amazon.com.tr, ciceksepeti.com, n11.com. Hangi platformda ürün sonucu çıkıyorsa onu listeye ekle. Emin olmadığın platformu da listeye ekle — sadece kesinlikle olmadığından emin olduğunu çıkar.
- Her kriter için o kriterin en klişe ve akla ilk gelen karşılığını önerme. Daha az bilinen, daha özgün alternatifler ara.
- Safe choice yapma. Risk al, cesur ve yaratıcı ol. İlk aklına geleni değil, ikinci ve üçüncü aklına geleni öner.
- Türkiye'de satılan ürünler öner. Mevcut mevsimi yaz olarak aramalara yansıt.
- BÜTÇE KURALI: Belirtilen bütçe üst sınırdır. Bütçenin yüzde seksen ile yüzde yüzü arasında öner, sınırı geçme.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.9,
                max_output_tokens: 3000
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const errData = await response.json();
            return res.status(response.status).json({ error: errData });
        }

        const data = await response.json();
        const msgItem = (data.output || []).find(item => item.type === 'message');
        const textPart = msgItem && msgItem.content ? msgItem.content.find(c => c.type === 'output_text') : null;
        const resultText = textPart ? textPart.text : '';
        const aramalar = (data.output || [])
            .filter(item => item.type === 'web_search_call')
            .map(item => {
                // xAI API'de arama terimi farklı alanlarda gelebiliyor
                if (item.query) return item.query;
                if (item.input) return item.input;
                if (item.arguments) { try { return JSON.parse(item.arguments).query || JSON.stringify(item.arguments); } catch(e) {} }
                return JSON.stringify(item);
            })
            .filter(Boolean);
        return res.status(200).json({ result: resultText, aramalar });

    } catch (error) {
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: 'API zaman aşımına uğradı, lütfen tekrar deneyin.' });
        }
        return res.status(500).json({ error: error.message });
    }
}
