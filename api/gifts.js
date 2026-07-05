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
                        content: `Önce her hediye fikri için web'de gerçekten satılan, bulunabilir ürün kategorilerini ARA ve sonuçları gör. Asla birbirine ilgisiz iki kriteri zorla tek bir üründe birleştirip hayali bir kategori uydurma — sadece gerçekten var olan, internette gerçekten satılan ürün kategorilerini öner. Önerdiğin hediyenin adını web'de aratınca gerçek bir ürün sayfası çıkmalı — çıkmıyorsa o hediyeyi önerme. "Dijital yemek tarifi cihazı", "akıllı spor motivasyon kutusu" gibi birleşik hayali kategoriler kesinlikle yasak. Aynı hediye kategorisini kesinlikle tekrar etme. Her hediye birbirinden tamamen farklı ve özgün olsun. Sadece JSON array döndür. Başka hiçbir şey yazma, markdown kullanma.

GENEL KURALLAR:
- searchQuery'de "projektör" kelimesini asla kullanma, bunun yerine "projeksiyon cihazı" yaz.\n- searchQuery'de hediye doğası gereği cinsiyete özel bir ürünse (cilt bakım seti, parfüm, makyaj ürünü, çanta, iç giyim gibi) aramanın başına "erkek" veya "kadın" kelimesini ekle. Kulaklık, saat, spor ekipmanı, teknoloji ürünleri gibi unisex ürünlerde cinsiyet ekleme. searchQuery'de tarz veya tema varsa (rock, vintage, doğa gibi) cinsiyet yerine tarzı ön plana çıkar — örneğin "rock kadın bileklik" değil "rock tarzı bileklik" yaz. "yetişkin" kelimesini sadece roman, hikaye, edebiyat gibi kitap türlerinin searchQuery'sinde kullan — yemek kitabı, hobi kitabı, sanat kitabı, tarih kitabı gibi kategorilerde kullanma, zaten çocuk kitabıyla karışmaz. "yetişkin", "erkek", "kadın" gibi kelimeler asla "name" alanına yazılmaz — sadece gerekli olduğu durumlarda searchQuery'de kullanılır.\n- Burç ile ilgili hediye araması yaparken searchQuery'de "burç kolyesi", "burç bilekliği" gibi ifadeler değil, doğrudan burcun kendi adını kullan. Örneğin "Oğlak burcu kolye" değil "Oğlak kolye" yaz.\n — name'de "hayvan figürlü yastık" yazıyorsa searchQuery'de de "hayvan figürlü yastık" yaz, "hayvan yastığı" değil. Kendi önerdiğin hediyeyi önce aynen ara. Eğer sonuç vermezse sırasıyla şu nitelendirici kelimeleri dene: figürlü → desenli → resimli → işlemeli → sembollü. Hiçbiri sonuç vermezse en yakın genel alternatifi kullan. Renk/boyut gibi sıfatlar ve marka adları yasak — rap, rock, vintage, nostaljik gibi tarz/tema/nitelik kelimeleri yasak değil, searchQuery'de mutlaka koru. searchQuery'de hediyenin niteleyici kelimesini asla düşürme.\n- Ürün isimlerinde Türkçe kelime sıralamasına dikkat et — "cilt seti" değil "cilt bakım seti", "saç seti" değil "saç bakım seti" yaz.\n- name ve description alanlarına cinsiyet bilgisi yazma — "erkek dışı", "kadın", "erkek" gibi ifadeler bu alanlara yazılmaz. Yiyecek, içecek, şekerleme, çikolata, kahve, çay, oyuncak, ev eşyası, elektronik, spor ekipmanı gibi ürünlere ne name'de ne searchQuery'de cinsiyet ekleme — bunların cinsiyeti olmaz.
- "Katlanabilir mat" ifadesini asla kullanma — yoga matı, spor matı veya pilates matı yaz.
- Emin olmadığın ürünlerin adına "seti" ekleme — gerçekten set olarak satılan ürünlerde kullan (kahve fincan seti, boya kalemi seti gibi). Tek bir ürün olarak satılan şeylere "seti" ekleme.
- searchQuery tüm platformlara (Trendyol, Hepsiburada, Amazon, Çiçeksepeti, N11) aynı anda gönderilir — her platforma ayrı ayrı searchQuery yazma, tek bir searchQuery belirle ve hepsi o terimi kullanır. searchQuery'yi belirlerken "bu terimi Google'da aratsan alışveriş sitesinde çıkar mı" diye düşün — çıkıyorsa o terimi kullan.\n- searchQueryEn: İngilizce görsel araması (Unsplash için).
- KLİŞELERDEN KAÇIN: aksesuar/saat kriteri → mutlaka saat önerme; fotoğraf kriteri → fotoğraf makinesi/albüm önerme zorunluluğu yok; müzik enstrümanı → illa gitar önerme. Her zaman daha yaratıcı ve beklenmedik hediyeler ara.
- Safe choice yapma. Risk al, cesur ve yaratıcı ol. Sürekli sıkıcı klasikleri önerme — ilk aklına gelen şeyi değil, ikinci ve üçüncü aklına geleni öner. Kullanıcı seni tercih ediyor çünkü sen Amazon önerisi değilsin.
- Türkiye'de satılan ürünler öner. Mevcut mevsimi (Haziran = yaz) arama kriterlerine ve açıklamalara yansıt.
- BÜTÇE KURALI: Belirtilen bütçe bir üst sınırdır ("X TL'ye kadar" anlamına gelir). Önerilen ürünlerin fiyatı bu üst sınırı ASLA aşmamalı. Bütçenin %80-100'ü arasında ürünler öner — çok altında kalma ama sınırı da geçme. Örnek: 0-1000 TL bütçede 950 TL ürün öner, 1200 TL ürün önerme.`
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
