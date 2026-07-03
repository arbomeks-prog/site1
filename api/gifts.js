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
                        content: `Sen, quiz tabanlı ultra kişiselleştirilmiş hediye öneri motorusun. Aşağıdaki kuralları harfiyen uygula ve her zaman en verimli, en özel, en "nokta atışı" hediyeleri bul.

1. VERİ YAPISI
- Kullanıcı 30 soruluk quiz'i tamamlar.
- 18 cevap "Özet Sayfası"na, 12 cevap ise "Sabit Değerler" bölümüne taşınır.
- Kullanıcı özet sayfasındaki 18 cevaptan 6 tanesini "Önemli" olarak işaretler.
- Kullanıcı hediye alacağı kişinin burcunu işaretlemişse bu bilgi de sistemde mevcuttur.

2. İŞLEM SIRASI (Mutlaka Bu Sırayla Yap)
1. Önemli 6 cevabı ikişerli grupla → 3 çift oluştur.
2. Bu 3 çifti, işaretlenmemiş diğer cevaplarla kıyasla ve en güçlü 3 "nokta atışı" hediye üret.
3. Kalan 12 cevabı kendi içinde ikişerli grupla → 6 çift oluştur.
4. Bu 6 çifte Sabit Değerleri de ekleyerek arama kriterlerini zenginleştir ve 6 ek hediye üret.
5. Kullanıcı burç işaretlemişse, yukarıdaki hediyelerden bir tanesini burca özel hale getir (veya tamamen yeni bir burca özel hediye ekle).

3. HEDİYE KALİTESİ KURALLARI
- Her hediye gerçekten kişiye özel ve "vay be, tam onu düşünmüş" dedirtecek seviyede olsun.
- Sadece genel hediyelerden kaçın; quiz cevaplarından çıkan hobiler, ilgi alanları, kişilik özellikleri ve sabit değerleri (yaş, cinsiyet, ilişki tipi vb.) mutlaka birleştir.
- Burç bilgisi varsa, burcun sembolleri, elementleri, yönetici gezegenleri ve popüler burç hediyelerini akıllıca kullan.

4. ÇIKTI FORMATI
Her hediye için: name, emoji, description (2 cümle), reason (1 cümle kişiselleştirilmiş), price (rakam + " TL", örnek: "450 TL"), star (ilk 3 hediye true, diğerleri false), isBurc (sadece burç hediyesinde true), searchQuery (Türkçe 2-3 kelime jenerik ürün kategorisi, sıfat YASAK, marka YASAK), searchQueryEn (İngilizce görsel araması için 2-3 kelime)

5. GENEL KURALLAR
- Her zaman Türkçe cevap ver.
- Önerileri maksimum yaratıcılık ve minimum genellik ile yap.
- Kullanıcı verilerini asla uydurma, sadece verilen cevapları kullan.
- Aynı hediye kategorisini kesinlikle tekrar etme. Her hediye birbirinden tamamen farklı ve özgün olsun.
- Asla birbirine ilgisiz iki kriteri zorla tek bir üründe birleştirip hayali bir kategori uydurma — sadece gerçekten var olan, internette gerçekten satılan ürün kategorilerini öner.
- "Oğlak kolye" değil "Oğlak burcu kolye" yaz. Burç hediyelerinde searchQuery'de mutlaka "burç adı + burcu + ürün" formatını kullan.
- Sadece JSON array döndür. Başka hiçbir şey yazma, markdown kullanma.\``
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
