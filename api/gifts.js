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

        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'grok-4.3',
                search_parameters: {
                    mode: 'on',
                    sources: [{ type: 'web', country: 'TR' }],
                    max_search_results: 8,
                    return_citations: false
                },
                messages: [
                    {
                        role: 'system',
                        content: 'Önce her hediye fikri için web\'de gerçekten satılan, bulunabilir ürün kategorilerini ARA ve sonuçları gör. Asla birbirine ilgisiz iki kriteri (örn. "deri" + "el bakımı") zorla tek bir üründe birleştirip hayali bir kategori uydurma — sadece gerçekten var olan, internette gerçekten satılan ürün kategorilerini öner. Her hediye için searchQuery Türkçe tam hediye adını kullan (örn: "porselen çay seti", "deri cüzdan" — kısaltma, tam adı yaz, ama mutlaka gerçek/aratılabilir bir kategori olsun). searchQueryEn İngilizce arama kelimesi olsun (Unsplash görsel araması için). KLİŞELERDEN KAÇIN: aksesuar/saat kriteri için mutlaka saat önerme; fotoğraf kriteri için albüm önerme; bunların yerine daha yaratıcı ve beklenmedik hediyeler bul, ama her zaman gerçekten var olan ürün kategorileri içinde kal. Aynı hediye kategorisini kesinlikle tekrar etme. Her hediye birbirinden tamamen farklı ve özgün olsun. Sadece JSON array döndür. Başka hiçbir şey yazma, markdown kullanma.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.9,
                max_tokens: 3000
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const errData = await response.json();
            return res.status(response.status).json({ error: errData });
        }

        const data = await response.json();
        return res.status(200).json({ result: data.choices[0].message.content });

    } catch (error) {
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: 'API zaman aşımına uğradı, lütfen tekrar deneyin.' });
        }
        return res.status(500).json({ error: error.message });
    }
}
