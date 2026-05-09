import { neon } from '@neondatabase/serverless';
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const {
            session_id,
            cinsiyet,
            yas,
            iliski_durumu,
            butce,
            ilgi_alanlari,
            ozel_not = '',
            tiklanan_hediyeler = null
        } = req.body;
        if (!session_id) {
            return res.status(400).json({ error: 'session_id gereklidir' });
        }
        const sql = neon(process.env.POSTGRES_URL);
        const ilgiAlanlariStr = Array.isArray(ilgi_alanlari) 
            ? ilgi_alanlari.join(',') 
            : (ilgi_alanlari || '');
        // Aynı session varsa güncelle, yoksa yeni kayıt
        const existing = await sql`
            SELECT id FROM quiz_logs WHERE session_id = ${session_id} LIMIT 1
        `;
        if (existing.length > 0) {
            await sql`
                UPDATE quiz_logs 
                SET cinsiyet = ${cinsiyet},
                    yas = ${yas},
                    iliski_durumu = ${iliski_durumu},
                    butce = ${butce},
                    ilgi_alanlari = ${ilgiAlanlariStr},
                    ozel_not = ${ozel_not},
                    tiklanan_hediyeler = ${tiklanan_hediyeler ? JSON.stringify(tiklanan_hediyeler) : null},
                    updated_at = NOW()
                WHERE session_id = ${session_id}
            `;
        } else {
            await sql`
                INSERT INTO quiz_logs (
                    session_id, cinsiyet, yas, iliski_durumu, butce, 
                    ilgi_alanlari, ozel_not, quiz_tamamlandi, tiklanan_hediyeler
                ) VALUES (
                    ${session_id}, ${cinsiyet}, ${yas}, ${iliski_durumu}, ${butce},
                    ${ilgiAlanlariStr}, ${ozel_not}, true, 
                    ${tiklanan_hediyeler ? JSON.stringify(tiklanan_hediyeler) : null}
                )
            `;
        }
        res.status(200).json({ success: true, message: 'Log kaydedildi' });
    } catch (error) {
        console.error('Log hatası:', error);
        res.status(500).json({ error: 'Veritabanı hatası' });
    }
}
