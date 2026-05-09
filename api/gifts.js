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

        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'grok-3-fast',
                messages: [
                    {
                        role: 'system',
                        content: 'Her hediye için searchQuery Türkçe, searchQueryEn İngilizce arama kelimesi olsun (Unsplash görsel araması için). searchQuery mümkün olduğunca genel ve kısa olsun (max 3 kelime, ürün kategorisi bazlı). Aynı hediye kategorisini tekrar etme. Çeşitli ve birbirinden farklı hediyeler öner. Sadece JSON array döndür. Başka hiçbir şey yazma, markdown kullanma.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.9,
                max_tokens: 3000
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            return res.status(response.status).json({ error: errData });
        }

        const data = await response.json();
        return res.status(200).json({ result: data.choices[0].message.content });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
