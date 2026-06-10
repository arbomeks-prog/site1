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
        const sql = neon(process.env.POSTGRES_URL);

        // Bugün toplam giren (tamamlayan + yarıda bırakan)
        const bugun_toplam = await sql`
            SELECT COUNT(DISTINCT session_id) as sayi
            FROM quiz_logs
            WHERE DATE(created_at) = CURRENT_DATE
        `;

        // Bugün tamamlayan
        const bugun_tamamlayan = await sql`
            SELECT COUNT(DISTINCT session_id) as sayi
            FROM quiz_logs
            WHERE DATE(created_at) = CURRENT_DATE
            AND quiz_tamamlandi = true
        `;

        // Toplam tamamlayan
        const toplam_tamamlayan = await sql`
            SELECT COUNT(DISTINCT session_id) as sayi
            FROM quiz_logs
            WHERE quiz_tamamlandi = true
        `;

        // Toplam giren
        const toplam_giren = await sql`
            SELECT COUNT(DISTINCT session_id) as sayi
            FROM quiz_logs
        `;

        // Kime dağılımı (tamamlayanlar)
        const kime_dagilim = await sql`
            SELECT iliski_durumu, COUNT(*) as sayi
            FROM quiz_logs
            WHERE quiz_tamamlandi = true
            AND iliski_durumu IS NOT NULL AND iliski_durumu != ''
            GROUP BY iliski_durumu
            ORDER BY sayi DESC
            LIMIT 10
        `;

        // Bütçe dağılımı
        const butce_dagilim = await sql`
            SELECT butce, COUNT(*) as sayi
            FROM quiz_logs
            WHERE quiz_tamamlandi = true
            AND butce IS NOT NULL AND butce != ''
            GROUP BY butce
            ORDER BY sayi DESC
            LIMIT 8
        `;

        // Son 7 gün günlük tamamlama
        const son_7_gun = await sql`
            SELECT DATE(created_at) as tarih, COUNT(DISTINCT session_id) as sayi
            FROM quiz_logs
            WHERE quiz_tamamlandi = true
            AND created_at >= NOW() - INTERVAL '7 days'
            GROUP BY DATE(created_at)
            ORDER BY tarih ASC
        `;

        // Yarıda bırakanlar — kaç soru cevapladı
        const yarim_detay = await sql`
            SELECT session_id, iliski_durumu, butce, cinsiyet, yas, ozel_not, updated_at
            FROM quiz_logs
            WHERE quiz_tamamlandi = false
            AND ozel_not IS NOT NULL
            ORDER BY updated_at DESC
            LIMIT 50
        `;

        // Kaçıncı soruda çıkmışlar
        const yarim_raw = await sql`
            SELECT ozel_not
            FROM quiz_logs
            WHERE quiz_tamamlandi = false
            AND ozel_not IS NOT NULL
        `;

        // ozel_not içindeki tum_cevaplar'dan cevap sayısını çıkar
        var soru_dagilim = {};
        yarim_raw.forEach(function(r) {
            try {
                var ozel = JSON.parse(r.ozel_not);
                var cv = ozel.tum_cevaplar || {};
                var sayi = Object.keys(cv).filter(function(k){ return cv[k] && cv[k] !== ''; }).length;
                var grup = sayi <= 3 ? '1-3' : sayi <= 7 ? '4-7' : sayi <= 14 ? '8-14' : sayi <= 20 ? '15-20' : '21+';
                soru_dagilim[grup] = (soru_dagilim[grup] || 0) + 1;
            } catch(e) {}
        });

        res.status(200).json({
            success: true,
            bugun_toplam: parseInt(bugun_toplam[0]?.sayi || 0),
            bugun_tamamlayan: parseInt(bugun_tamamlayan[0]?.sayi || 0),
            toplam_tamamlayan: parseInt(toplam_tamamlayan[0]?.sayi || 0),
            toplam_giren: parseInt(toplam_giren[0]?.sayi || 0),
            kime_dagilim,
            butce_dagilim,
            son_7_gun,
            yarim_detay,
            soru_dagilim: soru_dagilim
        });

    } catch (error) {
        console.error('panel hatası:', error);
        res.status(500).json({ error: 'Veritabanı hatası: ' + error.message });
    }
}
