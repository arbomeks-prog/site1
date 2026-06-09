import { neon } from '@neondatabase/serverless';

const PANEL_SIFRE = 'kerutti2026';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { sifre } = req.query;
    if (!sifre || sifre.trim() !== PANEL_SIFRE) return res.status(401).json({ error: 'Yetkisiz' });

    try {
        const sql = neon(process.env.DATABASE_URL);

        // Tablo yoksa oluştur
        await sql\`
            CREATE TABLE IF NOT EXISTS page_views (
                id SERIAL PRIMARY KEY,
                sayfa VARCHAR(50) NOT NULL,
                tarih DATE NOT NULL DEFAULT CURRENT_DATE,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        \`;

        // Bugünkü sayfa görüntülemeleri
        const bugun = await sql`
            SELECT sayfa, COUNT(*) as sayi
            FROM page_views
            WHERE tarih = CURRENT_DATE
            GROUP BY sayfa
            ORDER BY sayi DESC
        `;

        // Son 7 gün
        const yedi_gun = await sql`
            SELECT sayfa, COUNT(*) as sayi
            FROM page_views
            WHERE tarih >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY sayfa
            ORDER BY sayi DESC
        `;

        // Toplam
        const toplam = await sql`
            SELECT sayfa, COUNT(*) as sayi
            FROM page_views
            GROUP BY sayfa
            ORDER BY sayi DESC
        `;

        // Günlük trend (son 7 gün, her sayfa)
        const trend = await sql`
            SELECT tarih, sayfa, COUNT(*) as sayi
            FROM page_views
            WHERE tarih >= CURRENT_DATE - INTERVAL '6 days'
            GROUP BY tarih, sayfa
            ORDER BY tarih ASC, sayfa
        `;

        // Quiz tamamlayanlar bugün
        const quiz_bugun = await sql`
            SELECT COUNT(*) as sayi
            FROM quiz_logs
            WHERE DATE(created_at) = CURRENT_DATE
              AND quiz_tamamlandi = true
        `;

        // Kime dağılımı (tüm zamanlar)
        const kime_dagilim = await sql`
            SELECT iliski_durumu, COUNT(*) as sayi
            FROM quiz_logs
            WHERE quiz_tamamlandi = true
              AND iliski_durumu IS NOT NULL AND iliski_durumu != ''
            GROUP BY iliski_durumu
            ORDER BY sayi DESC
            LIMIT 10
        `;

        res.status(200).json({
            success: true,
            bugun: bugun,
            yedi_gun: yedi_gun,
            toplam: toplam,
            trend: trend,
            quiz_bugun: quiz_bugun[0]?.sayi || 0,
            kime_dagilim: kime_dagilim
        });

    } catch (error) {
        console.error('panel hatası:', error);
        res.status(500).json({ error: 'Veritabanı hatası' });
    }
}
