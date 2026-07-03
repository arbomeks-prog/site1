export const config = {
    maxDuration: 60
};

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
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Prompt required' });

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 55000);

        const response = await fetch('https://api.x.ai/v1/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'grok-4.3',
                tools: [{ type: 'web_search' }],
                input: [
                    {
                        role: 'system',
                        content: `Önce her hediye fikri için web'de gerçekten satılan, bulunabilir ürün kategorilerini ARA ve sonuçları gör. Asla birbirine ilgisiz iki kriteri zorla tek bir üründe birleştirip hayali bir kategori uydurma — sadece gerçekten var olan, internette gerçekten satılan ürün kategorilerini öner. Aynı hediye kategorisini kesinlikle tekrar etme. Her hediye birbirinden tamamen farklı ve özgün olsun. Sadece JSON array döndür. Başka hiçbir şey yazma, markdown kullanma.

GENEL KURALLAR:
- searchQuery: Türkçe tam hediye adı (örn: "porselen çay seti") — gerçek/aratılabilir kategori olsun, sıfat ve marka yasak.
- searchQueryEn: İngilizce görsel araması (Unsplash için).
- KLİŞELERDEN KAÇIN: aksesuar/saat kriteri → mutlaka saat önerme; fotoğraf kriteri → fotoğraf makinesi/albüm önerme zorunluluğu yok; müzik enstrümanı → illa gitar önerme. Her zaman daha yaratıcı ve beklenmedik hediyeler ara.
- Türkiye'de satılan ürünler öner. Mevcut mevsimi (Haziran = yaz) arama kriterlerine ve açıklamalara yansıt.
- BÜTÇE KURALI: Belirtilen bütçe bir üst sınırdır ("X TL'ye kadar" anlamına gelir). Önerilen ürünlerin fiyatı bu üst sınırı ASLA aşmamalı. Bütçenin %80-100'ü arasında ürünler öner — çok altında kalma ama sınırı da geçme. Örnek: 0-1000 TL bütçede 950 TL ürün öner, 1200 TL ürün önerme.

KİŞİYE GÖRE KURALLAR:
- Çay/Kahve: Erkek için porselen çay seti, demlik, espresso makinesi gibi klişelerden uzak dur. Erkekte pratiklik, taşınabilirlik, kolay kullanım ön planda. Daha orijinal, niş alternatifler bul.
- Doğa yürüyüşü: Sırt çantası önerme zorunluluğu yok. Çarpıcı, beklenmedik öneriler sun.
- Teknoloji ilgisi: Fotoğraf makinesine takılma. Kişinin diğer özellikleriyle örtüşen teknolojik hediyeler bul.
- Spor yapmıyor/ara sıra yapıyor: Sporu teşvik eden hediyeyi güzel yönlendirici bir mesajla sun — hediye alan kişinin hoşuna gider.
- Müzik/Enstrüman: Gitar dışında kayıt cihazı, amfi, nota sehpası, müzik kitabı, poster gibi niş alternatifler düşün. Beklenmedik bir öneri yapıyorsan bunu description'da esprili, büyük harfli, samimi bir dille belirt.
- Kişilik dışadönük: Şaşalı, gösterişli, paylaşılabilir hediyeler tercih et. İçedönük: Kişisel, anlamlı, hatırlanabilir hediyeler öne çıkar.
- Burç hediyesi: Açıklamayı uzun ve kişisel tut — taşlar, yıldız haritası, burç sembolleri gibi detaylarla zenginleştir.
- Erkekler için kişisel bakım: Çok niş bir alan, detaylı ve rehber niteliğinde öneriler sun, alternatif ürünleri çeşitlendir.
- Sanat ilgisi: Müze kartı, sergi bileti, atölye hediye kartı, konser bileti gibi deneyim hediyelerine yönlen. Yönlendirici ol.
- Mutfak/Yemek türü: Sadece İtalyan → pasta makinesi, Türk → çorba kasesi gibi klişelere düşme. Baharat setlerinden niş aletlere kadar geniş yelpazede bak.
- Takı/Aksesuar ilgisi yüksekse ve bütçe de yüksekse: Takı/aksesuar önerilerini öne çıkar, niş ve kaliteli örnekler sun.
- Makyaj/Bakım ürünleri: Çay/kahve tercihinden önce gelir, öne çıkar. Detaylı ve rehber niteliğinde öner.
- Bitki bakımı + dışadönük + doğa yürüyüşü kombinasyonu: Dikey tarım, sulama ekipmanları, tohum seti, saksı standı gibi niş ürünler düşün.
- Favori mevsim: Tekstil ve giyim önerilerinde bu mevsimi kullan, özellikle mevcut mevsimle uyumluysa vurgula.
- Evde vakit geçiren + yaşlı/emekli profil: Bunu pozitif bir çerçevede değerlendir, ev konforu ve kişisel zevklere yönelik öneriler sun.
- Gıda sektörü çok geniş: Malzemesinden aletlerine, baharatından mutfak ekipmanlarına kadar kullan.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.9,
                max_output_tokens: 3000
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const errData = await response.json();
            return res.status(response.status).json({ error: errData });
        }

        const data = await response.json();
        const msgItem = (data.output || []).find(item => item.type === 'message');
        const textPart = msgItem && msgItem.content ? msgItem.content.find(c => c.type === 'output_text') : null;
        const resultText = textPart ? textPart.text : '';
        return res.status(200).json({ result: resultText });

    } catch (error) {
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: 'API zaman aşımına uğradı, lütfen tekrar deneyin.' });
        }
        return res.status(500).json({ error: error.message });
    }
}
