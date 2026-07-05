export const config = { maxDuration: 60 };

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key yok' });

    const { soru } = req.body;
    if (!soru) return res.status(400).json({ error: 'Soru gerekli' });

    try {
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
                    { role: 'user', content: soru }
                ],
                temperature: 0.7,
                max_output_tokens: 1000
            })
        });

        const data = await response.json();
        const msgItem = (data.output || []).find(item => item.type === 'message');
        const textPart = msgItem?.content?.find(c => c.type === 'output_text');
        // Grok'un web arama terimlerini de al
        const aramalar = (data.output || [])
            .filter(item => item.type === 'web_search_call')
            .map(item => item.query || JSON.stringify(item));
        return res.status(200).json({ cevap: textPart?.text || 'Cevap alınamadı', aramalar });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
