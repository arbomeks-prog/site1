import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { sayfa } = req.body;
        if (!sayfa) return res.status(400).json({ error: 'sayfa gereklidir' });

        const sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL);

        // Tablo yoksa oluştur
        await sql`
            CREATE TABLE IF NOT EXISTS page_views (
                id SERIAL PRIMARY KEY,
                sayfa VARCHAR(50) NOT NULL,
                tarih DATE NOT NULL DEFAULT CURRENT_DATE,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `;

        // Tek satır ekle
        await sql`
            INSERT INTO page_views (sayfa, tarih)
            VALUES (${sayfa}, CURRENT_DATE)
        `;

        res.status(200).json({ success: true });

    } catch (error) {
        console.error('log-view hatası:', error);
        res.status(500).json({ error: 'Veritabanı hatası' });
    }
}
