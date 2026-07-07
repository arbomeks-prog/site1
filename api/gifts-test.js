export const config = {
    maxDuration: 60
};

export default async function handler(req, res) {
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
                // web_search YOK — hız testi
                input: [
                    {
                        role: 'system',
                        content: `Sadece JSON array döndür. Başka hiçbir şey yazma, markdown kullanma. Her hediye birbirinden tamamen farklı ve özgün olsun. Aynı hediye kategorisini kesinlikle tekrar etme.

GENEL KURALLAR:
- searchQuery'de hediye doğası gereği cinsiyete özel bir ürünse aramanın başına erkek veya kadın kelimesini ekle. Unisex ürünlerde cinsiyet ekleme.
- yetişkin, erkek, kadın gibi kelimeler asla name alanına yazılmaz.
- Önerdiğin hediyeyi searchQuery'de aynen ara. Renk ve boyut sıfatları ile marka adları yasak.
- searchQuery'de niteleyici kelimeyi düşürme — hediyenin tam adını yaz.
- Ürün isimlerinde doğal Türkçe kelime sıralaması kullan.
- name ve description alanlarına cinsiyet bilgisi yazma.
- Emin olmadığın ürünlere seti ekleme — gerçekten set olarak satılıyorsa kullan.
- searchQuery tüm platformlara aynı anda gönderilir — tek bir searchQuery belirle. searchQueryEn alanına İngilizce görsel araması yaz.
- mevcutPlatformlar için şu 5 platformdan gerçekçi tahmin yap: trendyol/hepsiburada/amazon/ciceksepeti/n11. Yaygın ürünlerde hepsini ekle, niş ürünlerde sadece muhtemelen olanları yaz.
- Her kriter için o kriterin en klişe ve akla ilk gelen karşılığını önerme. Daha özgün alternatifler bul.
- Trendyol, Hepsiburada, Amazon TR, N11 veya Çiçeksepeti'nde gerçekten satılan ürünler öner.
- "vinil" kelimesini kullanma — bunun yerine "plak" yaz.
- Müzik türüyle ilgili searchQuery formatı: tür + ürün adı. "albüm" kelimesi girmesin.
- Rap veya hip-hop için plak önerme.
- Safe choice yapma. Risk al, cesur ve yaratıcı ol. İlk aklına geleni değil, ikinci ve üçüncü aklına geleni öner.
- Kullanıcı profilinde yazılmayan özellikleri asla uydurma.
- Türkiye'de satılan ürünler öner. Mevcut mevsimi yaz olarak aramalara yansıt.
- BÜTÇE KURALI: Belirtilen bütçe üst sınırdır. Bütçenin %80-%100'ü arasında öner, sınırı geçme.`
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

        return res.status(200).json({ result: resultText });

    } catch (error) {
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: 'API zaman aşımına uğradı, lütfen tekrar deneyin.' });
        }
        return res.status(500).json({ error: error.message });
    }
}
