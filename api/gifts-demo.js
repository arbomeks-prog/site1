export const config = {
    maxDuration: 60
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Prompt required' });

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 55000);

        const sistemPrompt = `Sen bir hediye uzmanısın ve aynı zamanda bir e-ticaret araştırmacısısın. Sana bir kişinin profili verilecek. Bu profile en uygun 11 hediye öner. Her hediye birbirinden farklı kategoriden olsun.

Her hediye için önce Trendyol.com'da web araması yap, gerçekten satılan bir ürün bul, o ürünün direkt linkini al.

Her hediye için şu alanları doldur: name, emoji, description (2 cümle), reason (1 cümle), price (rakam + " TL" formatında, Trendyol'daki gerçek fiyat), star (ilk 3 true diğerleri false), isBurc (sadece burçla ilgili hediyede true), productUrl (Trendyol'da bulduğun o ürünün direkt URL'i, trendyol.com ile başlamalı), searchQuery (Türkçe 2-3 kelime), searchQueryEn (İngilizce görsel araması). Sadece JSON array döndür, başka hiçbir şey yazma, markdown kullanma.`;

        const response = await fetch('https://api.x.ai/v1/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'grok-4.3',
                
                input: [
                    { role: 'system', content: sistemPrompt },
                    { role: 'user', content: prompt }
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
