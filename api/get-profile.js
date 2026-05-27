import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { nickname } = req.query;

        if (!nickname) {
            return res.status(400).json({ error: 'nickname gereklidir' });
        }

        const sql = neon(process.env.DATABASE_URL);

        const rows = await sql`
            SELECT 
                session_id,
                kisi_adi,
                cinsiyet,
                yas,
                iliski_durumu,
                butce,
                ilgi_alanlari,
                tum_cevaplar,
                created_at,
                updated_at
            FROM quiz_logs
            WHERE nickname = ${nickname}
              AND quiz_tamamlandi = true
            ORDER BY updated_at DESC NULLS LAST
        `;

        res.status(200).json({ success: true, kisiler: rows });

    } catch (error) {
        console.error('get-profile hatası:', error);
        res.status(500).json({ error: 'Veritabanı hatası' });
    }
}
