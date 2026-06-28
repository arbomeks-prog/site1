import { neon } from '@neondatabase/serverless';

const PANEL_SIFRE = 'kerutti2026';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { sifre } = req.body;
        if (!sifre || sifre.trim() !== PANEL_SIFRE) return res.status(401).json({ error: 'Yetkisiz' });

        const sql = neon(process.env.POSTGRES_URL);

        // Sadece quiz_logs temizlenir — tablo yapısı, kolonlar, kod aynı kalır.
        // page_views'a dokunulmaz.
        await sql`TRUNCATE TABLE quiz_logs`;

        res.status(200).json({ success: true, message: 'quiz_logs tablosu sıfırlandı. Bundan sonraki tüm veriler bugünden itibaren yeniden birikecek.' });

    } catch (error) {
        console.error('sifirla-gecmis hatası:', error);
        res.status(500).json({ error: 'Veritabanı hatası: ' + error.message });
    }
}
