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
                        content: 'Önce her hediye fikri için web\'de gerçekten satılan, bulunabilir ürün kategorilerini ARA ve sonuçları gör. Asla birbirine ilgisiz iki kriteri (örn. "deri" + "el bakımı") zorla tek bir üründe birleştirip hayali bir kategori uydurma — sadece gerçekten var olan, internette gerçekten satılan ürün kategorilerini öner. Her hediye için searchQuery Türkçe tam hediye adını kullan (örn: "ahşap kutu organizer", "deri cüzdan" — kısaltma, tam adı yaz, ama mutlaka gerçek/aratılabilir bir kategori olsun). searchQueryEn İngilizce arama kelimesi olsun (Unsplash görsel araması için). ÖNEMLİ — TEK BİR CEVABA SAPLANMA: "Kahve mi çay mı" gibi basit zevk/tercih soruları TEK BAŞINA bir hediye kategorisi belirleyici DEĞİLDİR. Bu cevabı asla doğrudan çay seti/kahve makinesi/fincan/termos gibi o içeceğe ait bir ürüne çevirme — bu küçük bir ipucudur, ana hediye konusu OLMAMALI; kişinin diğer ilgi alanlarına (hobi, mevsim, kişilik, tarz, vs.) odaklan. Aynı mantık diğer tek-kelimelik tercih sorularına da (örn. yaz/kış, tatlı/tuzlu) uygulanır. KLİŞELERDEN KAÇIN — bu kategoriler için ZORUNLU OLARAK ilk akla gelen tek ürüne saplanma: aksesuar/saat kriteri için mutlaka saat önerme; fotoğraf kriteri için albüm önerme; seyahat/gezi sevenler için sürekli valiz/bavul/seyahat çantası önerme; müzik sevenler için sürekli kulaklık/hoparlör/gitar önerme; Asya mutfağı sevenler için sürekli suşi seti/wok tava önerme; kitap sevenler için sürekli kitap ayracı önerme. Bunların yerine her seferinde o ilgi alanına dair FARKLI, daha yaratıcı ve beklenmedik ama gerçek/satılan bir ürün bul — klasik ürünler tamamen yasak değil, sadece HER ZAMAN aynısına gitme. Aynı hediye kategorisini kesinlikle tekrar etme. Her hediye birbirinden tamamen farklı ve özgün olsun. Sadece JSON array döndür. Başka hiçbir şey yazma, markdown kullanma.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 1.1,
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
