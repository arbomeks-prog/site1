import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { session_id, nickname, kisi_adi, tum_cevaplar } = req.body;

        if (!session_id || !nickname) {
            return res.status(400).json({ error: 'session_id ve nickname gereklidir' });
        }

        const sql = neon(process.env.DATABASE_URL);

        // Mevcut kaydı güncelle, yoksa atla
        const result = await sql`
            UPDATE quiz_logs
            SET nickname = ${nickname},
                kisi_adi = ${kisi_adi || null},
                tum_cevaplar = ${tum_cevaplar ? JSON.stringify(tum_cevaplar) : null}
            WHERE session_id = ${session_id}
            RETURNING id
        `;

        if (result.length === 0) {
            // Kayıt yoksa yeni ekle
            await sql`
                INSERT INTO quiz_logs (session_id, nickname, kisi_adi, tum_cevaplar, quiz_tamamlandi)
                VALUES (${session_id}, ${nickname}, ${kisi_adi || null}, ${tum_cevaplar ? JSON.stringify(tum_cevaplar) : null}, false)
            `;
        }

        res.status(200).json({ success: true });

    } catch (error) {
        console.error('save-profile hatası:', error);
        res.status(500).json({ error: 'Veritabanı hatası' });
    }
}
