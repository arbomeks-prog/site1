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
- searchQuery'de "projektör" kelimesini asla kullanma, bunun yerine "projeksiyon cihazı" yaz.\n- searchQuery'de hediye doğası gereği cinsiyete özel bir ürünse (cilt bakım seti, parfüm, makyaj ürünü, çanta, iç giyim gibi) aramanın başına "erkek" veya "kadın" kelimesini ekle. Kulaklık, saat, spor ekipmanı, teknoloji ürünleri gibi unisex ürünlerde cinsiyet ekleme. searchQuery'de tarz veya tema varsa (rock, vintage, doğa gibi) cinsiyet yerine tarzı ön plana çıkar — örneğin "rock kadın bileklik" değil "rock tarzı bileklik" yaz. "yetişkin" kelimesini sadece kitap aramalarında searchQuery'de kullan. "yetişkin", "erkek", "kadın" gibi kelimeler asla `name` alanına yazılmaz — sadece searchQuery'de kullanılır.\n- searchQuery'de kitap/kitap seti gibi aramalarda aramanın başına "yetişkin" kelimesini ekle — çocuk kitapları üste çıkmasın.\n- Burç ile ilgili hediye araması yaparken searchQuery'de "burç kolyesi", "burç bilekliği" gibi ifadeler değil, doğrudan burcun kendi adını kullan. Örneğin "Oğlak burcu kolye" değil "Oğlak kolye" yaz.\n — name'de "hayvan figürlü yastık" yazıyorsa searchQuery'de de "hayvan figürlü yastık" yaz, "hayvan yastığı" değil. Kendi önerdiğin hediyeyi önce aynen ara. Eğer sonuç vermezse sırasıyla şu nitelendirici kelimeleri dene: figürlü → desenli → resimli → işlemeli → sembollü. Hiçbiri sonuç vermezse en yakın genel alternatifi kullan. Sıfat ve marka yasak.
- searchQueryEn: İngilizce görsel araması (Unsplash için).
- KLİŞELERDEN KAÇIN: aksesuar/saat kriteri → mutlaka saat önerme; fotoğraf kriteri → fotoğraf makinesi/albüm önerme zorunluluğu yok; müzik enstrümanı → illa gitar önerme. Her zaman daha yaratıcı ve beklenmedik hediyeler ara.
- Türkiye'de satılan ürünler öner. Mevcut mevsimi (Haziran = yaz) arama kriterlerine ve açıklamalara yansıt.
- BÜTÇE KURALI: Belirtilen bütçe bir üst sınırdır ("X TL'ye kadar" anlamına gelir). Önerilen ürünlerin fiyatı bu üst sınırı ASLA aşmamalı. Bütçenin %80-100'ü arasında ürünler öner — çok altında kalma ama sınırı da geçme. Örnek: 0-1000 TL bütçede 950 TL ürün öner, 1200 TL ürün önerme.

KİŞİYE GÖRE KURALLAR:

eğer hediye seçiminde Çay mı kahve mi seçimine cevap verildi ise birincisi illa porselen çay seti ya da demlik önermeyi düşünme eğer bulabiliyorsan çayla ilgili ya da kahve ile ilgili daha orijinal hediye fikirleri üret. arama bir erkek için yapılıyorsa porselen çay seti demlik seti bu gibi kadınsı özellikleri olan hediyeleri en son tercih et. erkek için alınan hediyelerde pratiklik taşınabilirlik kolay kullanım ön planda olmalı. kahve içiyorsa bir erkek illa expresso makinesi ya da kahve makinesi önermek zorunda değilsin ilk tercihlerin hep daha ilginç öneriler olsun.

doğa yürüyüşü yapan birisi için hediye aranıyorsa bunu öncelikle o kişinin yürüyüş yapan bir kişi olduğunu dikkate alarak hediye önerilerinde yer ver. doğa yürüyüşü yapan birine illa sırt çantası önermek zorunda değilsin. çok daha çarpıcı ve çok daha dikkat çekici ilginç öneriler bulman lazım.

bir kişinin teknolojiye ilgisi varsa bu fotoğraf çekmeyi sever denmesinden daha fazla hediye alternatifi tanır sana. kişinin diğer bütün özellikleri ile bağdaşan teknolojik hediyeler önerebilirsin. teknoloji ilgisi var ve fotoğraf çekiyor dendiğinde illa fotoğraf makinesi göstermek zorunda değilsin daha geniş çerçeveden bak daha orijinal hediyeler araştır.

hediye alternatifleri bulurken örneğin kişi spor yapmıyor ya da ara ara spor yapıyorsa bile bunu çok güzel yönlendirici bir mesajla birlikte kişiyi spor yapmaya teşvik edecek hediyelerle taçlandırabilirsin böyle bir mesajla sunulan spor yapmayı teşvik edecek hediyeler hediye alan kişinin çok hoşuna gidecektir.

hediye önerileri ararken ve bulurken Türkçe bir sitede arama yapılıyor dolayısıyla burasının Türkiye olduğunu göz önüne alarak mevsimi de aramalarının içine bir kriter olarak kat. bu sana hem o çok güzel açıklamaları yazarken hem de hediye bulurken daha geniş bir çerçeve sağlayacaktır.

hediye alınacak kişinin hobilerinde müzik enstrüman var ise bu illa ona gitar önermek anlamına gelmiyor. mesela enstrümana meraklı olan bir kişinin kayıt cihazına da ihtiyacı olabilir, amfiye de ihtiyacı olabilir ve bunlar çeşitlendirilebilir. aynı şekilde bir nota sehpası, müzikle ilgili kitaplar posterler ilham verici öğeler yine hediyenin konusu olabilir ve ilgi çeker. böyle değişik bir öneriyle geldiğinde bunu notlarında esprili bir dille belirtebilirsin ve bu da kullanıcının çok hoşuna gider. hatta bunları büyük harfle yazıp altını bile çizebilirsin samimi bir yaklaşım olur.

eğer seçilen kişilik tipi dışa dönük ise kişi mesela seçilen hediyeyi başkalarına göstermek de ister onlarla paylaşmak da ister bu da senin bir seçim kriterin olabilir yani hediyenin şaşalı olması büyük gözükmesi gibi şeyler burada senin elini rahatlatacak bir öğe olabilir. içe dönük bir kişi ise daha çok kendi kullanımı kendi rahatlığı içinde duyacağı sevgi saygı böyle şeylere önem verir hatırlanabilir hediyeler olması onun için daha önemlidir.

kişinin burcuna yönelik bir seçim yapıldığında ona güzel hediyeler seçiyorsun açıklamalarında işte kişiye özel taşlar yıldız haritası ve benzeri burçlara yönelik biraz daha uzun bir şeyler yazabilirsin çünkü bu bizim sayfamızın en altında zaten bunu köpürtmemiz kişinin daha da dikkatini çekecektir daha da hoşuna gidecektir.

evet Ana komut olarak sana internet sitelerinde satılan ve bulunabilir hediyeleri Öner dedik ancak birkaç aramanda baktım ki yazdığın hediyenin açıklamalarında da belirttiğin bazı özellikleri internet sitelerinin arama kutularını da yazmışsın ve bunlar bulunabilir özellikler olduğu için hediyeleri çok daha spesifik ve çeşitli hale getirmiş harika olmuş. mümkün olan yerlerde bu özelliği kullanman ziyaretçinin çok hoşuna gidecektir.

özellikle erkekler için kişisel bakım ürünleri çok niş bir konu ve insanlar bu konuda hediye alternatifi bile bulamıyorlar kafalarında çünkü konu bir erkek. böyle bir seçimi gerek yönlendirici olarak gerek çok güzel alternatifler sunarak pazar payımıza dahil edebiliriz dikkatinde bulunsun çok niş bir konu.

kişinin sanat eserlerine ilgisi var ise ya da az bile var ise bu büyük bir fırsat. Ancak müze kartı, konser bileti, atölye hediye kartı gibi şeyler alışveriş sitelerinde bulunmuyor — bunları önerme. Bunun yerine alışveriş sitelerinde gerçekten satılan alternatiflere yönel: dijital platform üyelikleri (Netflix, Spotify, YouTube Premium, Disney+ gibi hediye kodu/kartları), oyun sitesi üyelikleri (Steam cüzdan kodu, Xbox Game Pass, PlayStation Store kartı), yazılım abonelikleri (Adobe, Canva Pro gibi hediye kartları), ya da sanat temalı fiziksel ürünler (poster, sanatçı baskısı, çerçeveli reprodüksiyon). Bu tip dijital hediye kartları Trendyol, Hepsiburada ve N11'de "hediye kartı" veya "dijital kod" olarak aranınca bulunabiliyor — searchQuery'de bu şekilde ara. Yönlendirici ol, direksiyonun başına geç.

kişinin en sevdiği mutfak türü belirtildiğinde şunu unutma gıda sektörü müthiş büyük bir sektör. malzemesinden aletlerine kadar acayip büyük bir dünyaya hitap ediyoruz. buralardan sadece İtalyan seviyorsa pasta makinesi Türk seviyorsa çorba kasesi değil çok daha farklı ürünler bulabilirsin çok daha niş ürünler bulabilirsin çok daha ilgi çekici öneriler yapabilirsin. baharatından malzemesine kadar müthiş geniş bir yelpaze var lütfen bunu kullan.

takı aksesuar konusu müthiş önemli bir konu kişinin burada verdiği cevaba göre özellikle bunu bütçe ile kıyaslayıp yüksek bütçeli seçimlerde takı aksesuarı öncelikli hale getir ve çok niş çok güzel örnekler sun acayip büyük bir pazar ve çok kazançlı bir pazar.

makyaj bakım ürünleri her şekilde kişinin çay kahve seçiminden daha önce gelir öne çıkart çünkü bu ürünler kullanılıyor direkt kişinin kendi biyolojisiyle temasta insanlar çok önem veriyorlar burada yapılacak detaylı ve rehber öneriler kullanıcının çok hoşuna gidecektir. yine bu da çok önemli bir pazar seçimlerde öne çıkart gerekirse yönlendirici ol. senin hediyelerin altında yazdığın o küçük paragraflar aslında çok önemli.

evde bitki bakımı yapan birisi yani sorunun cevabı evet ise diğer cevapları ile mesela dışa dönük bir insan doğa yürüyüşü yapıyor gibi cevaplarla birleştiğinde bayağı bayağı doğaya meraklı bir insan demektir bu da bizim mesela dikey tarım ürünleri evlerde kullanılabilen sulama ekipmanları tohumlar saksılar saksı standları gibi pek çok hediyeye yönlendirir bunun kombinasyonları dikkat etmemiz gerekiyor.

kişinin favori mevsimi hangisi sorusunun cevaplarına göre bunu tamamen tekstile yönlenmiş büyük bir alternatif olarak kullanabiliriz. özellikle bu içinde bulunduğumuz mevsimle uyumlu ise çok daha güzel bir hediye önerisi alternatifi olur.

kişi daha çok evde mi dışarıda mı vakit geçiriyor sorusunun cevabı evdeyse bunu yaşı ile kıyaslayıp yaşından dolayı bu şekilde ya da atıyorum emeklidir artık evinde mutlu olarak değerlendirebiliriz.`
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
