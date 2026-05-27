import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { session_id, nickname } = req.body;
        if (!session_id || !nickname) return res.status(400).json({ error: 'session_id ve nickname gereklidir' });

        const sql = neon(process.env.DATABASE_URL);
        await sql`DELETE FROM quiz_logs WHERE session_id = ${session_id} AND nickname = ${nickname}`;
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('delete-profile hatası:', error);
        res.status(500).json({ error: 'Veritabanı hatası' });
    }
}
