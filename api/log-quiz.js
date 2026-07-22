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

    try {
        const {
            session_id,
            event = null,
            cinsiyet,
            yas,
            iliski_durumu,
            butce,
            kime = null,
            ilgi_alanlari,
            ozel_not = '',
            tiklanan_hediyeler = null,
            quiz_tamamlandi = false,
            tur_no = null,
            hediye_sayisi = null,
            puan = null
        } = req.body;

        if (!session_id) {
            return res.status(400).json({ error: 'session_id gereklidir' });
        }

        const sql = neon(process.env.POSTGRES_URL);
        const ilgiAlanlariStr = Array.isArray(ilgi_alanlari)
            ? ilgi_alanlari.join(',')
            : (ilgi_alanlari || '');

        // Kolon yoksa ekle
        await sql`ALTER TABLE quiz_logs ADD COLUMN IF NOT EXISTS puan INTEGER`;
        await sql`ALTER TABLE quiz_logs ADD COLUMN IF NOT EXISTS event VARCHAR(50)`;
        await sql`ALTER TABLE quiz_logs ADD COLUMN IF NOT EXISTS kime VARCHAR(100)`;
        await sql`ALTER TABLE quiz_logs ADD COLUMN IF NOT EXISTS tur_no INTEGER`;
        await sql`ALTER TABLE quiz_logs ADD COLUMN IF NOT EXISTS hediye_sayisi INTEGER`;

        // quiz_basladi eventi — yeni kayıt oluştur
        if (event === 'quiz_basladi') {
            await sql`
                INSERT INTO quiz_logs (
                    session_id, event, kime, butce, tur_no, quiz_tamamlandi
                ) VALUES (
                    ${session_id}, ${event}, ${kime}, ${butce}, ${tur_no}, false
                )
                ON CONFLICT (session_id) DO UPDATE
                SET event = ${event}, kime = ${kime}, butce = ${butce},
                    tur_no = ${tur_no}, updated_at = NOW()
            `;
            return res.status(200).json({ success: true });
        }

        // tur_tamamlandi eventi — mevcut kaydı güncelle
        if (event === 'tur_tamamlandi') {
            const existing = await sql`SELECT id FROM quiz_logs WHERE session_id = ${session_id} LIMIT 1`;
            if (existing.length > 0) {
                await sql`
                    UPDATE quiz_logs
                    SET quiz_tamamlandi = true,
                        event = ${event},
                        kime = COALESCE(${kime}, kime),
                        butce = COALESCE(${butce}, butce),
                        tur_no = ${tur_no},
                        hediye_sayisi = ${hediye_sayisi},
                        updated_at = NOW()
                    WHERE session_id = ${session_id}
                `;
            } else {
                await sql`
                    INSERT INTO quiz_logs (
                        session_id, event, kime, butce, tur_no, hediye_sayisi, quiz_tamamlandi
                    ) VALUES (
                        ${session_id}, ${event}, ${kime}, ${butce}, ${tur_no}, ${hediye_sayisi}, true
                    )
                `;
            }
            return res.status(200).json({ success: true });
        }

        // Eski sistem / puan eventi
        const existing = await sql`SELECT id FROM quiz_logs WHERE session_id = ${session_id} LIMIT 1`;

        if (existing.length > 0) {
            await sql`
                UPDATE quiz_logs
                SET cinsiyet = COALESCE(${cinsiyet}, cinsiyet),
                    yas = COALESCE(${yas}, yas),
                    iliski_durumu = COALESCE(${iliski_durumu}, iliski_durumu),
                    butce = COALESCE(${butce}, butce),
                    ilgi_alanlari = COALESCE(${ilgiAlanlariStr || null}, ilgi_alanlari),
                    ozel_not = COALESCE(${ozel_not}, ozel_not),
                    tiklanan_hediyeler = COALESCE(${tiklanan_hediyeler ? JSON.stringify(tiklanan_hediyeler) : null}, tiklanan_hediyeler),
                    puan = COALESCE(${puan}, puan),
                    quiz_tamamlandi = ${quiz_tamamlandi},
                    updated_at = NOW()
                WHERE session_id = ${session_id}
            `;
        } else {
            await sql`
                INSERT INTO quiz_logs (
                    session_id, cinsiyet, yas, iliski_durumu, butce,
                    ilgi_alanlari, ozel_not, quiz_tamamlandi, tiklanan_hediyeler, puan
                ) VALUES (
                    ${session_id}, ${cinsiyet}, ${yas}, ${iliski_durumu}, ${butce},
                    ${ilgiAlanlariStr}, ${ozel_not}, ${quiz_tamamlandi},
                    ${tiklanan_hediyeler ? JSON.stringify(tiklanan_hediyeler) : null},
                    ${puan}
                )
            `;
        }

        res.status(200).json({ success: true, message: 'Log kaydedildi' });

    } catch (error) {
        console.error('Log hatası:', error);
        res.status(500).json({ error: 'Veritabanı hatası' });
    }
}
