import { neon } from '@neondatabase/serverless';

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
        const { prompt, session_id } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Prompt required' });

        // Grok AI'dan hediye önerisi al
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
        const result = data.choices[0].message.content;

        // Önerilen hediyeleri veritabanına kaydet (session_id varsa)
        if (session_id && process.env.POSTGRES_URL) {
            try {
                const sql = neon(process.env.POSTGRES_URL);
                
                // Önerilen hediyeleri parse et
                let onerilenHediyeler = null;
                try {
                    onerilenHediyeler = JSON.parse(result);
                } catch (e) {
                    console.error('Hediye parse hatası:', e);
                }

                // Mevcut kayıt var mı kontrol et
                const existing = await sql`
                    SELECT id FROM quiz_logs WHERE session_id = ${session_id} LIMIT 1
                `;

                if (existing.length > 0) {
                    // Varsa, önerilen hediyeleri güncelle
                    await sql`
                        UPDATE quiz_logs 
                        SET onerilen_hediyeler = ${onerilenHediyeler ? JSON.stringify(onerilenHediyeler) : null},
                            ai_prompt = ${prompt},
                            updated_at = NOW()
                        WHERE session_id = ${session_id}
                    `;
                } else {
                    // Yoksa yeni kayıt oluştur (sadece prompt ve öneri ile)
                    await sql`
                        INSERT INTO quiz_logs (
                            session_id, ai_prompt, onerilen_hediyeler, quiz_tamamlandi
                        ) VALUES (
                            ${session_id}, ${prompt}, 
                            ${onerilenHediyeler ? JSON.stringify(onerilenHediyeler) : null},
                            false
                        )
                    `;
                }
            } catch (dbError) {
                // Veritabanı hatası kullanıcıyı engellemesin, sadece logla
                console.error('DB kayıt hatası (gifts.js):', dbError);
            }
        }

        return res.status(200).json({ result });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
