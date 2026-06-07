// ============================================================
// BudurBuldum - Merkezi Konfigürasyon Dosyası
// Tüm soru tanımları, sıralama, dallanma, sabit/kriter ayarları
// ID-tabanlı sistem: soruların sırası değişse bile referanslar bozulmaz
// ============================================================

const QUIZ_CONFIG = {

    // ==========================================
    // ANA SORU SETİ (Normal akış)
    // Sıralama burada belirlenir. Değiştirmek için sadece diziyi yeniden sırala.
    // ==========================================
    sorular: [
        { id:"kime",       soru:"Hediye kime alınıyor?",                     secenekler:["Sevgili","Arkadaş","Anne","Baba","Kardeş","Çocuk 🧒","Kendime","İş arkadaşı","Bebek ❤️","Pet ❤️"], sayfa:"hediye-kime-alinacak-testi.html" },
        { id:"cinsiyet",   soru:"Cinsiyeti nedir?",                          secenekler:["Kadın","Erkek","Kız Çocuğu","Erkek Çocuğu"], sayfa:"kadin-erkek-hediye-secimi-testi.html" },
        { id:"yas",        soru:"Yaş aralığı yaklaşık olarak nedir?",        secenekler:["0-2 (Bebek)","3-6 (Küçük Çocuk)","7-12 (Çocuk)","13-17 (Genç)","18-25","26-35","36-45","46-60","61-75","76+"], sayfa:"yasa-gore-hediye-bulma-testi.html" },
        { id:"tarz",       soru:"Tarzı nasıldır?",                           secenekler:["Minimalist","Renkli ve Eğlenceli","Klasik / Şık","Modern / Şık","Spor / Casual"], sayfa:"kisilik-tarzina-gore-hediye-testi.html" },
        { id:"hobiler",    soru:"Hobileri nelerdir?",                        secenekler:["Okumak","Spor yapmak","Müzik / Enstrüman","Seyahat","Yemek yapmak","Teknoloji","Sanat ve el işi","Bahçe / Bitki bakımı"], sayfa:"hobiye-gore-hediye-bulma-testi.html", maxSecim:2 },
        { id:"renk",       soru:"En çok sevdiği renk tonu hangisi?",         secenekler:["Pastel Tonlar","Koyu ve Şık Tonlar","Canlı ve Parlak Renkler","Doğal Tonlar"], sayfa:"sevdigi-renge-gore-hediye-testi.html" },
        { id:"amac",       soru:"Hediyeyi ne için alıyorsun?",               secenekler:["Doğum Günü","Yıl Dönümü","Sevgililer Günü","Özel Bir Başarı","Sadece sürpriz","Noel / Yılbaşı"], sayfa:"ne-icin-hediye-alinacak-testi.html" },
        { id:"ortam",      soru:"Kişi evde mi dışarıda mı zaman geçiriyor?", secenekler:["Daha çok evde","Daha çok dışarıda","İkisi de dengeli"], sayfa:"yasam-tarzina-gore-hediye-testi.html" },
        { id:"teknoloji",  soru:"Teknolojiye ilgisi var mı?",                secenekler:["Çok ilgili","Orta seviyede","Pek ilgilenmiyor"], sayfa:"teknoloji-ilgisine-gore-hediye-testi.html" },
        { id:"butce",      soru:"Bütçe aralığın nedir?",                     secenekler:["0-500 TL","500-1500 TL","1500-3000 TL","3000-5000 TL","5000-10000 TL","10000-30000 TL","30.000 TL+"], sayfa:"butceye-gore-hediye-bulma-testi.html" },
        { id:"mevsim",     soru:"Favori mevsimi hangisi?",                   secenekler:["İlkbahar","Yaz","Sonbahar","Kış"], sayfa:"mevsime-gore-hediye-secimi-testi.html" },
        { id:"tatli",      soru:"En sevdiği tatlı türü nedir?",              secenekler:["Çikolata","Pasta","Dondurma","Şekerleme","Hiçbiri"], sayfa:"tatli-zevkine-gore-hediye-testi.html" },
        { id:"spor",       soru:"Spor yapıyor mu?",                          secenekler:["Evet düzenli","Ara sıra","Hiç yapmıyor"], sayfa:"sporcu-icin-hediye-bulma-testi.html" },
        { id:"muzik",      soru:"Favori müzik türü?",                        secenekler:["Pop","Rock","Klasik","Rap / Hip-Hop","Türk Sanat Müziği","Diğer"], sayfa:"muzik-zevkine-gore-hediye-testi.html" },
        { id:"hayvan",     soru:"Hayvan sever mi?",                          secenekler:["Evet çok sever","Orta","Pek sevmez"], sayfa:"hayvan-sever-icin-hediye-testi.html" },
        { id:"seyahat",    soru:"Seyahat etmeyi sever mi?",                  secenekler:["Çok sever","Ara sıra","Pek sevmez"], sayfa:"seyahat-sevene-hediye-bulma-testi.html" },
        { id:"kitap",      soru:"Kitap okumayı sever mi?",                   secenekler:["Evet çok","Ara sıra","Hiç okumaz"], sayfa:"kitap-okuyucuya-hediye-testi.html" },
        { id:"kahve",      soru:"Kahve mi çay mı?",                          secenekler:["Kahve","Çay","İkisi de","Hiçbiri"], sayfa:"kahve-cay-icene-hediye-testi.html" },
        { id:"film",       soru:"En sevdiği film türü?",                     secenekler:["Romantik","Komedi","Bilim Kurgu","Dram","Aksiyon"], sayfa:"film-sevene-hediye-bulma-testi.html" },
        { id:"bitki",      soru:"Evde bitki bakımı yapıyor mu?",             secenekler:["Evet","Hayır","Deniyor"], sayfa:"bitki-sevene-hediye-testi.html" },
        { id:"oyun",       soru:"Oyun oynar mı?",                            secenekler:["Evet sık sık","Ara sıra","Hiç oynamaz"], sayfa:"oyun-oynayanlara-hediye-testi.html" },
        { id:"makyaj",     soru:"Makyaj / bakım ürünlerine ilgisi var mı?",  secenekler:["Çok var","Orta","Yok"], sayfa:"makyaj-bakim-sevene-hediye-testi.html" },
        { id:"aksesuar",   soru:"Takı / aksesuar takmayı sever mi?",         secenekler:["Evet","Ara sıra","Hiç sevmez"], sayfa:"aksesuar-saat-sevene-hediye-testi.html" },
        { id:"mutfak",     soru:"En sevdiği mutfak türü?",                   secenekler:["Türk","İtalyan","Asya","Fast Food","Sağlıklı"], sayfa:"yemek-icin-hediye-bulma-testi.html" },
        { id:"doga",       soru:"Doğa yürüyüşü yapar mı?",                  secenekler:["Evet sever","Ara sıra","Hiç yapmaz"], sayfa:"doga-yuruyusu-sevene-hediye-testi.html" },
        { id:"sanat",      soru:"Sanat eserlerine ilgisi var mı?",           secenekler:["Çok var","Orta","Yok"], sayfa:"sanat-sevene-hediye-bulma-testi.html" },
        { id:"foto",       soru:"Fotoğraf çekmeyi sever mi?",               secenekler:["Evet","Ara sıra","Hiç"], sayfa:"fotograf-cekmeyi-sevene-hediye-testi.html" },
        { id:"kisilik",    soru:"Kişilik tipi nasıl?",                       secenekler:["İçedönük","Dışadönük","Dengeli"], sayfa:"kisilik-tipine-gore-hediye-testi.html" },
        { id:"oncelik",    soru:"Hediye alırken en çok neye dikkat edersin?", secenekler:["Kullanışlı olsun","Güzel görünsün","Özel ve anlamlı olsun","Uygun fiyatlı olsun"], sayfa:"hediye-onceliklerine-gore-secim-testi.html" },
        { id:"dogum",      soru:"Doğum tarihi hakkında ne biliyorsunuz?",    secenekler:["Tarihini biliyorum","Bilmiyorum","Burcunu biliyorum"], sayfa:"dogum-tarihine-gore-hediye-testi.html", ozelTip:"dogum" },
    ],

    // ==========================================
    // ÖZEL SORU SETLERİ
    // ==========================================
    soruBebekler: [
        { id:"bebek_cinsiyet", soru:"Bebek kız mı erkek mi?",             secenekler:["Kız Bebek","Erkek Bebek","Henüz bilinmiyor"], sayfa:"bebek-kiz-mi-erkek-mi-hediye-testi.html" },
        { id:"bebek_yas",      soru:"Kaç aylık / yaşında?",               secenekler:["0-3 ay","3-6 ay","6-12 ay","1 yaş","2 yaş","3 yaş"], sayfa:"bebek-yasina-gore-hediye-testi.html" },
        { id:"bebek_amac",     soru:"Hediyeyi ne için alıyorsun?",        secenekler:["Yeni doğdu 🎀","Doğum günü 🎂","Baby shower 🛁","Sünnet 🌙","Sadece sürpriz 🎁"], sayfa:"bebek-hediyesi-ne-icin-alinacak-testi.html" },
        { id:"bebek_tarz",     soru:"Anne-baba tarzı nasıl?",             secenekler:["Minimalist / Sade","Renkli ve Neşeli","Organik / Doğal","Modern / Şık"], sayfa:"anne-baba-tarzina-gore-bebek-hediyesi-testi.html" },
        { id:"bebek_tur",      soru:"Ne tür hediye tercih edersin?",      secenekler:["Eğitici / Gelişim","Oyuncak / Eğlence","Giyim / Aksesuar","Pratik / Kullanışlı","Anı / Özel"], sayfa:"bebege-ne-tur-hediye-alinacak-testi.html" },
        { id:"bebek_butce",    soru:"Bütçe aralığın nedir?",              secenekler:["0-500 TL","500-1500 TL","1500-3000 TL","3000-5000 TL","5000+ TL"], sayfa:"butceye-gore-bebek-hediyesi-testi.html" },
    ],

    soruCocuklar: [
        { id:"cocuk_cinsiyet", soru:"Kız mı erkek mi?",                   secenekler:["Kız","Erkek"], sayfa:"cocuk-kiz-mi-erkek-mi-hediye-testi.html" },
        { id:"cocuk_yas",      soru:"Kaç yaşında?",                       secenekler:["4-5 yaş","6-7 yaş","8-9 yaş","10-11 yaş","12-13 yaş","14-15 yaş","16-17 yaş"], sayfa:"cocugun-yasina-gore-hediye-testi.html" },
        { id:"cocuk_amac",     soru:"Hediyeyi ne için alıyorsun?",        secenekler:["Doğum Günü","Yılbaşı / Bayram","Başarı Ödülü","Sürpriz"], sayfa:"cocuga-ne-icin-hediye-alinacak-testi.html" },
        { id:"cocuk_aktivite", soru:"En sevdiği aktivite nedir?",          secenekler:["Oyun / Video oyunları","Spor / Hareket","Sanat / El işi","Okuma / Öğrenme","Müzik","Teknoloji"], sayfa:"cocugun-aktivitesine-gore-hediye-testi.html" },
        { id:"cocuk_tema",     soru:"Favori tema / karakter kategorisi?",  secenekler:["Oyun / Minecraft / Roblox","Disney / Pixar / Prenses","Süper Kahraman / Marvel / DC","Anime / Manga","Spor / Futbol Takımı","Hayvanlar / Doğa","Müzik / Pop Yıldızı","Tema yok / Bilmiyorum"], sayfa:"cocugun-sevdigi-temaya-gore-hediye-testi.html" },
        { id:"cocuk_ortam",    soru:"Daha çok nerede vakit geçiriyor?",   secenekler:["Evde / İç mekan","Dışarıda / Aktif","İkisi de"], sayfa:"cocugun-yasam-alanina-gore-hediye-testi.html" },
        { id:"cocuk_tur",      soru:"Ne tür hediye tercih edersin?",      secenekler:["Oyuncak / Oyun","Eğitici / Kitap","Spor / Aktivite","Teknoloji / Gadget","Giyim / Aksesuar","Deneyim / Etkinlik"], sayfa:"cocuga-ne-tur-hediye-alinacak-testi.html" },
        { id:"cocuk_butce",    soru:"Bütçe aralığın nedir?",              secenekler:["0-500 TL","500-1500 TL","1500-3000 TL","3000-5000 TL","5000+ TL"], sayfa:"butceye-gore-cocuk-hediyesi-testi.html" },
    ],

    // Pet türü seçimi - ilk soru hep bu, sonra türe göre farklı set
    soruPetler: [
        { id:"pet_tur", soru:"Hangi hayvan?", secenekler:["Kedi 🐱","Köpek 🐶","Kuş 🐦","Tavşan 🐰","Hamster 🐹","Balık 🐟","Egzotik / Diğer 🦎"], sayfa:"evcil-hayvan-icin-hediye-testi.html" },
    ],

    // Kedi soruları
    soruKedi: [
        { id:"pet_tur",       soru:"Hangi hayvan?",               secenekler:["Kedi 🐱","Köpek 🐶","Kuş 🐦","Tavşan 🐰","Hamster 🐹","Balık 🐟","Egzotik / Diğer 🦎"], sayfa:"evcil-hayvan-icin-hediye-testi.html" },
        { id:"kedi_yas",      soru:"Kedi kaç yaşında?",           secenekler:["Yavru (0-1 yaş)","Genç (1-3 yaş)","Yetişkin (3-8 yaş)","Yaşlı (8+ yaş)"], sayfa:"kedinin-yasina-gore-hediye-testi.html" },
        { id:"kedi_karakter", soru:"Karakteri nasıl?",             secenekler:["Çok aktif ve oyuncu 🎯","Orta enerjili","Sakin ve uysal 😴","Biraz vahşi / yabani 🐯"], sayfa:"kedinin-karakterine-gore-hediye-testi.html" },
        { id:"kedi_ortam",    soru:"Nerede yaşıyor?",              secenekler:["Sadece iç mekanda","Hem ev hem dışarı","Dış mekan / bahçe"], sayfa:"kedinin-yasam-alanina-gore-hediye-testi.html" },
        { id:"kedi_tur",      soru:"Ne tür hediye düşünüyorsun?", secenekler:["Oyuncak / Eğlence 🎾","Kedi maması / ödül mama 🍖","Yatak / Kedi evi / Çizme","Aksesuar / Tasarım tasma","Sağlık / Bakım ürünleri","Kedi tırmalama aparatı"], sayfa:"kediye-ne-tur-hediye-alinacak-testi.html" },
        { id:"kedi_butce",    soru:"Bütçe aralığın nedir?",       secenekler:["0-300 TL","300-750 TL","750-1500 TL","1500-3000 TL","3000+ TL"], sayfa:"butceye-gore-kedi-hediyesi-testi.html" },
    ],

    // Köpek soruları
    soruKopek: [
        { id:"pet_tur",        soru:"Hangi hayvan?",               secenekler:["Kedi 🐱","Köpek 🐶","Kuş 🐦","Tavşan 🐰","Hamster 🐹","Balık 🐟","Egzotik / Diğer 🦎"], sayfa:"evcil-hayvan-icin-hediye-testi.html" },
        { id:"kopek_yas",      soru:"Köpek kaç yaşında?",          secenekler:["Yavru (0-1 yaş)","Genç (1-3 yaş)","Yetişkin (3-8 yaş)","Yaşlı (8+ yaş)"], sayfa:"kopegin-yasina-gore-hediye-testi.html" },
        { id:"kopek_irk",      soru:"Irk büyüklüğü nasıl?",        secenekler:["Küçük ırk (Chihuahua, Pomeranian vb.)","Orta ırk (Beagle, Cocker vb.)","Büyük ırk (Labrador, Golden vb.)","Çok büyük ırk (Kangal, Rottweiler vb.)"], sayfa:"kopegin-irkina-gore-hediye-testi.html" },
        { id:"kopek_karakter", soru:"Karakteri nasıl?",             secenekler:["Çok enerjik / Oyuncu 🎾","Orta enerjili","Sakin / Uysal 😌","Koruyucu / Bekçi 🛡️"], sayfa:"kopegin-karakterine-gore-hediye-testi.html" },
        { id:"kopek_tur",      soru:"Ne tür hediye düşünüyorsun?", secenekler:["Oyuncak / Çiğneme oyuncağı 🦴","Köpek maması / ödül mama 🍖","Yatak / Köşk / Yatacak yer","Tasma / Gezdirme seti / GPS","Giysi / Köpek kıyafeti 👕","Sağlık / Bakım / Bakım seti"], sayfa:"kopege-ne-tur-hediye-alinacak-testi.html" },
        { id:"kopek_butce",    soru:"Bütçe aralığın nedir?",       secenekler:["0-300 TL","300-750 TL","750-1500 TL","1500-3000 TL","3000+ TL"], sayfa:"butceye-gore-kopek-hediyesi-testi.html" },
    ],

    // Kuş soruları
    soruKus: [
        { id:"pet_tur",      soru:"Hangi hayvan?",               secenekler:["Kedi 🐱","Köpek 🐶","Kuş 🐦","Tavşan 🐰","Hamster 🐹","Balık 🐟","Egzotik / Diğer 🦎"], sayfa:"evcil-hayvan-icin-hediye-testi.html" },
        { id:"kus_tur",      soru:"Kuş türü nedir?",             secenekler:["Muhabbet kuşu 💚","Kanarya 🟡","Papağan (büyük) 🦜","Cennet papağanı / Sultan papağanı","Hint bülbülü / Sığırcık","Diğer / Bilmiyorum"], sayfa:"kus-turune-gore-hediye-testi.html" },
        { id:"kus_kafes",    soru:"Kafes durumu nasıl?",          secenekler:["Küçük kafes var","Orta kafes var","Büyük uçuş kafesi var","Kafes yok / Yeni alındı"], sayfa:"kus-kafesine-gore-hediye-testi.html" },
        { id:"kus_hediye",   soru:"Ne tür hediye düşünüyorsun?", secenekler:["Kuş yemi / Vitamin takviyesi 🌾","Kafes oyuncağı / Tünek","Kafes aksesuarı / Suluk-Yemlik","Yeni veya büyük kafes","Sağlık / Bakım / Tüy bakımı"], sayfa:"kusa-ne-tur-hediye-alinacak-testi.html" },
        { id:"kus_butce",    soru:"Bütçe aralığın nedir?",       secenekler:["0-200 TL","200-500 TL","500-1000 TL","1000-2500 TL","2500+ TL"], sayfa:"butceye-gore-kus-hediyesi-testi.html" },
    ],

    // Balık soruları
    soruBalik: [
        { id:"pet_tur",       soru:"Hangi hayvan?",               secenekler:["Kedi 🐱","Köpek 🐶","Kuş 🐦","Tavşan 🐰","Hamster 🐹","Balık 🐟","Egzotik / Diğer 🦎"], sayfa:"evcil-hayvan-icin-hediye-testi.html" },
        { id:"balik_tip",     soru:"Akvaryum türü nedir?",        secenekler:["Tropikal / Sıcak su 🌊","Soğuk su (Japon balığı vb.) ❄️","Deniz akvaryumu 🐠","Yeni başlıyorum / Henüz yok"], sayfa:"balik-tipine-gore-hediye-testi.html" },
        { id:"balik_boyut",   soru:"Akvaryum boyutu?",            secenekler:["Mini (30 litre altı) 🫙","Orta (30-100 litre) 🐟","Büyük (100-300 litre) 🌊","Çok büyük (300+ litre) 🦈"], sayfa:"balik-boyutuna-gore-hediye-testi.html" },
        { id:"balik_hediye",  soru:"Ne tür hediye düşünüyorsun?", secenekler:["Balık yemi / Özel besin 🌾","Akvaryum dekoru / Bitki / Taş","Filtre / Pompa / Teknik ekipman","Aydınlatma / LED ışık sistemi","İlaç / Sağlık / Su düzenleyici","Yeni akvaryum seti"], sayfa:"baliga-ne-tur-hediye-alinacak-testi.html" },
        { id:"balik_butce",   soru:"Bütçe aralığın nedir?",       secenekler:["0-200 TL","200-500 TL","500-1000 TL","1000-2500 TL","2500+ TL"], sayfa:"butceye-gore-balik-hediyesi-testi.html" },
    ],

    // Tavşan / Hamster / Egzotik soruları
    soruKucukPet: [
        { id:"pet_tur",          soru:"Hangi hayvan?",               secenekler:["Kedi 🐱","Köpek 🐶","Kuş 🐦","Tavşan 🐰","Hamster 🐹","Balık 🐟","Egzotik / Diğer 🦎"], sayfa:"evcil-hayvan-icin-hediye-testi.html" },
        { id:"kucukpet_yas",     soru:"Yaşı ne kadar?",              secenekler:["Yavru (0-6 ay)","Genç (6 ay - 2 yaş)","Yetişkin (2+ yaş)"], sayfa:"kucuk-evcil-hayvanin-yasina-gore-hediye-testi.html" },
        { id:"kucukpet_yuva",    soru:"Kafes / yuva durumu?",        secenekler:["Küçük kafes var","Büyük kafes var","Serbest dolaşıyor (tavşan vb.)","Kafes yok / Yeni alındı"], sayfa:"kucuk-evcil-hayvanin-yuvasina-gore-hediye-testi.html" },
        { id:"kucukpet_hediye",  soru:"Ne tür hediye düşünüyorsun?", secenekler:["Yem / Özel besin 🥕","Oyuncak / Aktivite 🎠","Kafes / Yuva aksesuarı","Sağlık / Bakım ürünü","Yeni kafes / Büyük yaşam alanı"], sayfa:"kucuk-evcil-hayvana-ne-tur-hediye-testi.html" },
        { id:"kucukpet_butce",   soru:"Bütçe aralığın nedir?",       secenekler:["0-200 TL","200-500 TL","500-1000 TL","1000-2500 TL","2500+ TL"], sayfa:"butceye-gore-kucuk-evcil-hayvan-hediyesi-testi.html" },
    ],

    // ==========================================
    // PROFİL BARI: Özet sayfasında üstte gösterilecek sabit bilgiler
    // Bu id'lerdeki cevaplar profil barına yazılır
    // ==========================================
    profilSabitler: [
        { id:"kime",     etiket:"Kime" },
        { id:"cinsiyet", etiket:"Cinsiyet" },
        { id:"dogum",    etiket:"Doğum" },
        { id:"yas",      etiket:"Yaş" },
        { id:"tarz",     etiket:"Tarz" },
        { id:"renk",     etiket:"Renk" },
        { id:"amac",     etiket:"Amaç" },
        { id:"ortam",    etiket:"Ortam" },
        { id:"butce",    etiket:"Bütçe" },
        { id:"mevsim",   etiket:"Mevsim" },
        { id:"kisilik",  etiket:"Kişilik" },
        { id:"oncelik",  etiket:"Öncelik" },
    ],

    // ==========================================
    // NEGATİF CEVAPLAR: Bu ifadeleri içeren cevaplar kriter listesinde gösterilmez
    // ==========================================
    negatifler: ["Pek ilgilenmiyor","Pek sevmez","Hiç yapmıyor","Hiç okumaz","Hiç oynamaz","Hiç sevmez","Hiç","Yok","Hayır","Emin değilim"],

    // ==========================================
    // ZORUNLU SORULAR: "Emin değilim" seçeneği gösterilmez
    // ==========================================
    zorunluSorular: ["kime","cinsiyet","dogum","amac","butce","oncelik","cocuk_cinsiyet","cocuk_amac","cocuk_butce","bebek_cinsiyet","bebek_amac","bebek_butce","pet_tur","pet_butce","kedi_butce","kedi_tur","kopek_butce","kopek_tur","kus_butce","kus_hediye","balik_butce","balik_hediye","kucukpet_butce","kucukpet_hediye"],

    // ==========================================
    // DALLANMA KURALLARI
    // Hangi cevaba göre hangi soruya (veya özel sete) gidileceği
    // ==========================================
    dallanma: {
        // "kime" sorusunun cevabına göre akış değişir
        kime: {
            "Bebek ❤️":     { set: "bebekler" },
            "Pet ❤️":       { set: "petler" },
            "Çocuk 🧒":    { set: "cocuklar" },
            "Bebek":        { set: "bebekler" },
            "Pet":          { set: "petler" },
            "Çocuk":        { set: "cocuklar" },
            // Anne/Baba seçilince cinsiyet sorusu atlanır
            "Anne":         { atla: ["cinsiyet"], cinsiyetOtomatik: "Kadın" },
            "Baba":         { atla: ["cinsiyet"], cinsiyetOtomatik: "Erkek" },
            // Kardeş seçilince doğum sorusu atlanır
            "Kardeş":       { atla: ["dogum"] },
        },

        // Kardeş + Kız/Erkek Çocuğu seçilirse çocuk akışına geç
        cinsiyet: {
            _kosul: function(cevaplar) {
                if (cevaplar.kime === "Kardeş" && (cevaplar.cinsiyet === "Kız Çocuğu" || cevaplar.cinsiyet === "Erkek Çocuğu")) {
                    return { set: "cocuklar", otomatikCevap: { cocuk_cinsiyet: cevaplar.cinsiyet === "Kız Çocuğu" ? "Kız" : "Erkek" } };
                }
                return null;
            }
        }
    },

    // ==========================================
    // CİNSİYET FİLTRELERİ: Kime'ye göre cinsiyet seçenekleri
    // ==========================================
    cinsiyetFiltreleri: {
        "Sevgili":       ["Kadın","Erkek"],
        "Arkadaş":       ["Kadın","Erkek"],
        "İş arkadaşı":   ["Kadın","Erkek"],
        "Kendime":       ["Kadın","Erkek"],
        "Kardeş":        ["Kadın","Erkek","Kız Çocuğu","Erkek Çocuğu"],
    },

    // ==========================================
    // YAŞ FİLTRELERİ: Kime + cinsiyet'e göre yaş seçenekleri
    // ==========================================
    yasFiltreleri: {
        "Sevgili":       ["18-25","26-35","36-45","46-60","61-75","76+"],
        "Arkadaş":       ["13-17 (Genç)","18-25","26-35","36-45","46-60","61-75","76+"],
        "İş arkadaşı":   ["13-17 (Genç)","18-25","26-35","36-45","46-60","61-75","76+"],
        "Kendime":       ["13-17 (Genç)","18-25","26-35","36-45","46-60","61-75","76+"],
        "Anne":          ["36-45","46-60","61-75","76+"],
        "Baba":          ["36-45","46-60","61-75","76+"],
        "Kardeş_cocuk":  ["4-5 yaş","6-7 yaş","8-9 yaş","10-11 yaş","12-13 yaş","14-15 yaş","16-17 yaş"],
        "Kardeş":        ["18-25","26-35","36-45","46-60","61-75","76+"],
    },

    // ==========================================
    // BURÇ VERİLERİ
    // ==========================================
    burclar: [
        {isim:"Koç",     sembol:"♈"}, {isim:"Boğa",    sembol:"♉"},
        {isim:"İkizler", sembol:"♊"}, {isim:"Yengeç",  sembol:"♋"},
        {isim:"Aslan",   sembol:"♌"}, {isim:"Başak",    sembol:"♍"},
        {isim:"Terazi",  sembol:"♎"}, {isim:"Akrep",    sembol:"♏"},
        {isim:"Yay",     sembol:"♐"}, {isim:"Oğlak",    sembol:"♑"},
        {isim:"Kova",    sembol:"♒"}, {isim:"Balık",    sembol:"♓"},
    ],

    burcOzellik: {
        'Koç':     'enerjik, cesur, lider ruhlu, maceraperest, rekabetci; spor, macera, liderlik, yenilik temalı hediyeler',
        'Boğa':    'konfor sever, estetik, luks, dogayla baglantili, iyi yemek sever; ev konforu, gurme, sanat, kaliteli el işi',
        'İkizler': 'merakli, sosyal, cok yonlu, iletisim sever; kitap, oyun, teknoloji, eğlenceli gadget, kurslar',
        'Yengeç':  'duygusal, ev sever, nostaljik, aile odakli; ev dekor, anlamlı anı, fotoğraf, sıcak & rahatlatıcı',
        'Aslan':   'gosteris sever, yaratici, lider, dikkat cekmekten hoslanir; premium, göz alıcı, kişisel marka',
        'Başak':   'duzenli, analitik, pratik, saglik bilincli; organizasyon, sağlık, verimlilik, kaliteli & işlevsel',
        'Terazi':  'estetik, denge arayan, sosyal, guzellik sever; sanat, tasarım, güzellik, sosyal deneyim',
        'Akrep':   'yogun, gizemli, tutkulu, derin; mistik, kişisel gelişim, güç, gizem temalı',
        'Yay':     'ozgur ruhlu, filozofik, seyahat sever, iyimser; seyahat, açık hava, felsefi, eğitim',
        'Oğlak':   'hirsli, disiplinli, kariyer odakli, geleneksel; profesyonel, prestijli, uzun ömürlü kaliteli ürünler',
        'Kova':    'yenilikci, ozgun, insancil, teknoloji sever; teknoloji, sürdürülebilir, yaratıcı, sosyal proje',
        'Balık':   'hayalci, sanatci ruhlu, empatik, spirituel; sanat, müzik, meditasyon, yaratıcı & romantik',
    },

};

// ============================================================
// YARDIMCI FONKSİYONLAR
// Quiz sayfalarının ortak kullandığı fonksiyonlar
// ============================================================

const QuizHelper = {

    // localStorage'dan cevapları oku
    getCevaplar: function() {
        try {
            return JSON.parse(localStorage.getItem('budurBuldumCevaplar') || '{}');
        } catch(e) {
            return {};
        }
    },

    // localStorage'a cevap kaydet
    setCevap: function(id, deger) {
        const c = this.getCevaplar();
        c[id] = deger;
        localStorage.setItem('budurBuldumCevaplar', JSON.stringify(c));
        // Son cevaplanan soru sayfasını kaydet (yarıda çıkınca kaldığı yeri bilmek için)
        localStorage.setItem('budurBuldumSonSayfa', window.location.pathname.split('/').pop());
        // Ayraç listesini güncelle
        QuizHelper.ayracGuncelle(false);
        // Her cevap değişiminde database'e kaydet (debounce 2sn)
        clearTimeout(QuizHelper._logTimer);
        QuizHelper._logTimer = setTimeout(function() {
            try {
                var sid = localStorage.getItem('budurBuldumSessionId');
                if (!sid) {
                    sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2,9);
                    localStorage.setItem('budurBuldumSessionId', sid);
                }
                var cevaplar = QuizHelper.getCevaplar();
                fetch('/api/log-quiz', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        session_id: sid,
                        cinsiyet: cevaplar.cinsiyet || '',
                        yas: cevaplar.yas || '',
                        iliski_durumu: cevaplar.kime || '',
                        butce: cevaplar.butce || '',
                        ilgi_alanlari: '',
                        ozel_not: JSON.stringify({ tum_cevaplar: cevaplar, quiz_tamamlandi: false })
                    })
                }).catch(function(){});
            } catch(e) {}
        }, 2000);
    },

    // Tüm cevapları sıfırla
    resetCevaplar: function() {
        localStorage.removeItem('budurBuldumCevaplar');
        localStorage.removeItem('budurBuldumAktifSet');
        localStorage.removeItem('budurBuldumSecilenKime');
        localStorage.removeItem('budurBuldumSecilenBurc');
        localStorage.removeItem('budurBuldumSelectedCriteria');
    },

    // Ayraç listesini güncelle (her cevap değişiminde çağrılır)
    ayracGuncelle: function(tamamlandi) {
        try {
            var sid = localStorage.getItem('budurBuldumSessionId');
            if (!sid) return;
            var cv = this.getCevaplar();
            var sonSayfa = localStorage.getItem('budurBuldumSonSayfa') || '';
            var ayraclar = [];
            try { ayraclar = JSON.parse(localStorage.getItem('budurBuldumAyraclar') || '[]'); } catch(e) {}
            var idx = -1;
            for (var i = 0; i < ayraclar.length; i++) {
                if (ayraclar[i].sessionId === sid) { idx = i; break; }
            }
            var ayrac = {
                sessionId: sid,
                kime: cv.kime || '',
                amac: cv.amac || cv.bebek_amac || cv.cocuk_amac || '',
                butce: cv.butce || cv.bebek_butce || cv.cocuk_butce || '',
                cevaplar: cv,
                sonSayfa: sonSayfa,
                tamamlandi: tamamlandi || false
            };
            if (idx >= 0) { ayraclar[idx] = ayrac; } else { ayraclar.push(ayrac); }
            localStorage.setItem('budurBuldumAyraclar', JSON.stringify(ayraclar));
        } catch(e) {}
    },

    // Quiz tamamlandığında ayracı tamamlandı olarak işaretle
    ayracTamamlandi: function() {
        this.ayracGuncelle(true);
    },

    // Aktif soru setini belirle
    getAktifSet: function() {
        const saved = localStorage.getItem('budurBuldumAktifSet');
        if (saved) return saved;
        return 'normal';
    },

    setAktifSet: function(set) {
        localStorage.setItem('budurBuldumAktifSet', set);
    },

    // Sayfa guard: Bu soruya bu akıştan gelinmeli mi kontrol et.
    // kime cevabına göre set belirle, yanlış sayfadaysa doğru sete yönlendir.
    sayfaGuard: function(soruId) {
        const cevaplar = this.getCevaplar();
        const kime = cevaplar.kime || '';

        // kime'ye göre beklenen set
        let beklenenSet = 'normal';
        if (kime === 'Bebek ❤️' || kime === 'Bebek') beklenenSet = 'bebekler';
        else if (kime === 'Pet ❤️' || kime === 'Pet') beklenenSet = 'petler';
        else if (kime === 'Çocuk 🧒' || kime === 'Çocuk') beklenenSet = 'cocuklar';

        // Şu an hangi sette olduğumuzu soruId'den belirle
        let suankiSet = 'normal';
        if (QUIZ_CONFIG.soruBebekler.find(s => s.id === soruId)) suankiSet = 'bebekler';
        else if (QUIZ_CONFIG.soruCocuklar.find(s => s.id === soruId)) suankiSet = 'cocuklar';
        else if (QUIZ_CONFIG.soruKedi.find(s => s.id === soruId)) suankiSet = 'kedi';
        else if (QUIZ_CONFIG.soruKopek.find(s => s.id === soruId)) suankiSet = 'kopek';
        else if (QUIZ_CONFIG.soruKus.find(s => s.id === soruId)) suankiSet = 'kus';
        else if (QUIZ_CONFIG.soruBalik.find(s => s.id === soruId)) suankiSet = 'balik';
        else if (QUIZ_CONFIG.soruKucukPet.find(s => s.id === soruId)) suankiSet = 'kucukpet';
        else if (QUIZ_CONFIG.soruPetler.find(s => s.id === soruId)) suankiSet = 'petler';

        // Yanlış sette olduğumuzu anladık: normal sayfada ama cocuklar/bebekler/petler gerekiyor
        if (suankiSet === 'normal' && beklenenSet !== 'normal' && kime !== '') {
            this.setAktifSet(beklenenSet);
            let hedefSorular = this.getAktifSorular();
            window.location.href = hedefSorular[0].sayfa;
            return true; // yönlendirme yapıldı
        }

        // Doğru set'i localStorage'a yaz
        this.setAktifSet(suankiSet);
        return false;
    },

    // Aktif seti otomatik düzelt (soru id'sine göre)
    _autoFixSet: function(soruId) {
        if (QUIZ_CONFIG.soruBebekler.find(s => s.id === soruId)) this.setAktifSet('bebekler');
        else if (QUIZ_CONFIG.soruCocuklar.find(s => s.id === soruId)) this.setAktifSet('cocuklar');
        else if (QUIZ_CONFIG.soruKedi.find(s => s.id === soruId)) this.setAktifSet('kedi');
        else if (QUIZ_CONFIG.soruKopek.find(s => s.id === soruId)) this.setAktifSet('kopek');
        else if (QUIZ_CONFIG.soruKus.find(s => s.id === soruId)) this.setAktifSet('kus');
        else if (QUIZ_CONFIG.soruBalik.find(s => s.id === soruId)) this.setAktifSet('balik');
        else if (QUIZ_CONFIG.soruKucukPet.find(s => s.id === soruId)) this.setAktifSet('kucukpet');
        else if (QUIZ_CONFIG.soruPetler.find(s => s.id === soruId)) this.setAktifSet('petler');
        else this.setAktifSet('normal');
    },

    // Aktif soru seti dizisini döndür
    // soruId verilirse: o soruyu içeren seti otomatik belirle ve localStorage'a yaz
    getAktifSorular: function(soruId) {
        if (soruId) {
            // Soruyu hangi set içeriyor? Bul ve kaydet.
            if (QUIZ_CONFIG.soruBebekler.find(s => s.id === soruId))       { this.setAktifSet('bebekler');  return QUIZ_CONFIG.soruBebekler; }
            if (QUIZ_CONFIG.soruCocuklar.find(s => s.id === soruId))       { this.setAktifSet('cocuklar');  return QUIZ_CONFIG.soruCocuklar; }
            if (QUIZ_CONFIG.soruKedi.find(s => s.id === soruId))           { this.setAktifSet('kedi');      return QUIZ_CONFIG.soruKedi; }
            if (QUIZ_CONFIG.soruKopek.find(s => s.id === soruId))          { this.setAktifSet('kopek');     return QUIZ_CONFIG.soruKopek; }
            if (QUIZ_CONFIG.soruKus.find(s => s.id === soruId))            { this.setAktifSet('kus');       return QUIZ_CONFIG.soruKus; }
            if (QUIZ_CONFIG.soruBalik.find(s => s.id === soruId))          { this.setAktifSet('balik');     return QUIZ_CONFIG.soruBalik; }
            if (QUIZ_CONFIG.soruKucukPet.find(s => s.id === soruId))       { this.setAktifSet('kucukpet'); return QUIZ_CONFIG.soruKucukPet; }
            if (QUIZ_CONFIG.soruPetler.find(s => s.id === soruId))         { this.setAktifSet('petler');    return QUIZ_CONFIG.soruPetler; }
            if (QUIZ_CONFIG.sorular.find(s => s.id === soruId))            { this.setAktifSet('normal');    return QUIZ_CONFIG.sorular; }
        }
        const set = this.getAktifSet();
        switch(set) {
            case 'bebekler':  return QUIZ_CONFIG.soruBebekler;
            case 'cocuklar':  return QUIZ_CONFIG.soruCocuklar;
            case 'kedi':      return QUIZ_CONFIG.soruKedi;
            case 'kopek':     return QUIZ_CONFIG.soruKopek;
            case 'kus':       return QUIZ_CONFIG.soruKus;
            case 'balik':     return QUIZ_CONFIG.soruBalik;
            case 'kucukpet':  return QUIZ_CONFIG.soruKucukPet;
            case 'petler':    return QUIZ_CONFIG.soruPetler;
            default:          return QUIZ_CONFIG.sorular;
        }
    },

    // Mevcut sorunun sırasını (index) bul
    getCurrentIndex: function(soruId) {
        const sorular = this.getAktifSorular(soruId);
        return sorular.findIndex(s => s.id === soruId);
    },

    // Bu soru geçerli mi? (dallanma kurallarına göre atlanmalı mı?)
    soruGecerliMi: function(soruId) {
        const cevaplar = this.getCevaplar();
        const kime = cevaplar.kime || '';

        // Dallanma kurallarını kontrol et
        if (QUIZ_CONFIG.dallanma.kime && QUIZ_CONFIG.dallanma.kime[kime]) {
            const kural = QUIZ_CONFIG.dallanma.kime[kime];
            if (kural.atla && kural.atla.includes(soruId)) {
                return false;
            }
        }

        return true;
    },

    // Sonraki geçerli soruyu bul
    getSonrakiSayfa: function(mevcutSoruId) {
        const cevaplar = this.getCevaplar();

        // Dallanma kontrolü: özel sete geçiş var mı? (getAktifSorular'dan ÖNCE kontrol et)
        if (mevcutSoruId === 'kime') {
            const kime = cevaplar.kime || '';
            const kural = QUIZ_CONFIG.dallanma.kime && QUIZ_CONFIG.dallanma.kime[kime];
            if (kural && kural.set) {
                let setName = '';
                switch(kural.set) {
                    case 'bebekler': setName = 'bebekler'; break;
                    case 'cocuklar': setName = 'cocuklar'; break;
                    case 'petler':   setName = 'petler'; break;
                }
                if (setName) {
                    this.setAktifSet(setName);
                    const ozelSorular = this.getAktifSorular();
                    return ozelSorular[0].sayfa;
                }
            }
        }

        // Pet türü seçildi → türe özgü sete geç
        if (mevcutSoruId === 'pet_tur') {
            const petTur = cevaplar.pet_tur || '';
            let petSet = 'petler';
            if (petTur.includes('Kedi')) petSet = 'kedi';
            else if (petTur.includes('Köpek')) petSet = 'kopek';
            else if (petTur.includes('Kuş')) petSet = 'kus';
            else if (petTur.includes('Balık')) petSet = 'balik';
            else if (petTur.includes('Tavşan') || petTur.includes('Hamster') || petTur.includes('Egzotik')) petSet = 'kucukpet';
            this.setAktifSet(petSet);
            const petSorular = this.getAktifSorular();
            // İlk soru pet_tur, 2. soruya git
            return petSorular[1] ? petSorular[1].sayfa : 'ozet.html';
        }

        // Cinsiyet sorusunda Kardeş+Çocuk dallanması
        if (mevcutSoruId === 'cinsiyet' && QUIZ_CONFIG.dallanma.cinsiyet && QUIZ_CONFIG.dallanma.cinsiyet._kosul) {
            const sonuc = QUIZ_CONFIG.dallanma.cinsiyet._kosul(cevaplar);
            if (sonuc && sonuc.set === 'cocuklar') {
                this.setAktifSet('cocuklar');
                // Otomatik cevapları kaydet
                if (sonuc.otomatikCevap) {
                    Object.keys(sonuc.otomatikCevap).forEach(key => {
                        this.setCevap(key, sonuc.otomatikCevap[key]);
                    });
                }
                // Çocuk setinin 2. sorusuna git (1. otomatik cevaplandı)
                return QUIZ_CONFIG.soruCocuklar[1].sayfa;
            }
        }

        // Normal akış: set artık doğru yazılmış, şimdi sorular dizisini al
        const sorular = this.getAktifSorular(mevcutSoruId);
        const mevcutIdx = sorular.findIndex(s => s.id === mevcutSoruId);

        for (let i = mevcutIdx + 1; i < sorular.length; i++) {
            if (this.soruGecerliMi(sorular[i].id)) {
                return sorular[i].sayfa;
            }
        }

        // Son soru — özet sayfasına git
        return 'ozet.html';
    },

    // Önceki geçerli soruyu bul
    getOncekiSayfa: function(mevcutSoruId) {
        const sorular = this.getAktifSorular(mevcutSoruId);
        const mevcutIdx = sorular.findIndex(s => s.id === mevcutSoruId);

        // Özel setteki ilk sorudaysak, kime sorusuna geri dön
        if (mevcutIdx === 0 && this.getAktifSet() !== 'normal') {
            this.setAktifSet('normal');
            return 'hediye-kime-alinacak-testi.html';
        }

        for (let i = mevcutIdx - 1; i >= 0; i--) {
            if (this.soruGecerliMi(sorular[i].id)) {
                return sorular[i].sayfa;
            }
        }

        return 'index.html';
    },

    // Progress yüzdesini hesapla
    getProgress: function(soruId) {
        const sorular = this.getAktifSorular(soruId);
        const idx = sorular.findIndex(s => s.id === soruId);
        const aktifSet = this.getAktifSet();
        const offset = aktifSet !== 'normal' ? 1 : 0;
        const toplam = sorular.length + offset;
        const mevcut = idx + 1 + offset;
        return Math.round((mevcut / toplam) * 100);
    },

    // Soru numarasını hesapla (görünen)
    getSoruNo: function(soruId) {
        const sorular = this.getAktifSorular(soruId);
        const idx = sorular.findIndex(s => s.id === soruId);
        const aktifSet = this.getAktifSet();
        const offset = aktifSet !== 'normal' ? 1 : 0;
        return idx + 1 + offset;
    },

    // Toplam soru sayısı
    getToplamSoru: function() {
        const sorular = this.getAktifSorular();
        const aktifSet = this.getAktifSet();
        const offset = aktifSet !== 'normal' ? 1 : 0;
        return sorular.length + offset;
    },

    // Kalan soru sayısı (mevcut soru dahil)
    getKalanSoru: function(soruId) {
        const sorular = this.getAktifSorular(soruId);
        const idx = sorular.findIndex(s => s.id === soruId);
        const aktifSet = this.getAktifSet();
        const offset = aktifSet !== 'normal' ? 1 : 0;
        return (sorular.length + offset) - (idx + offset);
    },

    // Filtrelenmiş seçenekleri al
    getFiltrelenmisSecenekler: function(soruId) {
        const cevaplar = this.getCevaplar();
        const sorular = this.getAktifSorular(soruId);
        let soru = sorular.find(s => s.id === soruId);
        if (!soru) return [];

        // Cinsiyet filtresi
        if (soruId === 'cinsiyet') {
            const kime = cevaplar.kime || '';
            if (QUIZ_CONFIG.cinsiyetFiltreleri[kime]) {
                return QUIZ_CONFIG.cinsiyetFiltreleri[kime];
            }
        }

        // Yaş filtresi
        if (soruId === 'yas') {
            const kime = cevaplar.kime || '';
            const cinsiyet = cevaplar.cinsiyet || '';
            if (kime === 'Kardeş' && (cinsiyet === 'Kız Çocuğu' || cinsiyet === 'Erkek Çocuğu')) {
                return QUIZ_CONFIG.yasFiltreleri['Kardeş_cocuk'];
            }
            if (QUIZ_CONFIG.yasFiltreleri[kime]) {
                return QUIZ_CONFIG.yasFiltreleri[kime];
            }
        }

        return soru.secenekler;
    },

    // Anne/Baba seçildiğinde otomatik cinsiyet kaydet
    handleOtomatikCevaplar: function() {
        const cevaplar = this.getCevaplar();
        const kime = cevaplar.kime || '';
        const kural = QUIZ_CONFIG.dallanma.kime && QUIZ_CONFIG.dallanma.kime[kime];
        if (kural && kural.cinsiyetOtomatik) {
            this.setCevap('cinsiyet', kural.cinsiyetOtomatik);
        }
    },


    // Zorunlu soru mu?
    isZorunlu: function(soruId) {
        return QUIZ_CONFIG.zorunluSorular.includes(soruId);
    },
};

// Node.js ortamı için export (test amaçlı)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QUIZ_CONFIG, QuizHelper };
}

// ============================================================
// QUIZ UI — Devam butonu otomatik scroll
// Tüm quiz sayfaları config.js yüklediği için buraya eklendi
// ============================================================
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        var btn = document.getElementById('continue-btn');
        if (!btn) return;

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                if (m.attributeName === 'class' && !btn.classList.contains('hidden') && !btn.classList.contains('disabled-state')) {
                    setTimeout(function() {
                        var rect = btn.getBoundingClientRect();
                        if (rect.bottom > window.innerHeight - 20) {
                            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    }, 80);
                }
            });
        });

        observer.observe(btn, { attributes: true });
    });
}

// ============================================================
// SES SİSTEMİ — Tüm quiz sayfalarında ortak
// Web Audio API ile hafif ses efektleri
// ============================================================
var BudurSes = (function() {
    var ctx = null;
    var enabled = true;

    function getCtx() {
        if (!ctx) {
            try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
            catch(e) { enabled = false; }
        }
        return ctx;
    }

    // Kısa tık/seçim sesi
    function tikSes() {
        if (!enabled) return;
        var c = getCtx(); if (!c) return;
        var osc = c.createOscillator();
        var gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);
        osc.frequency.value = 600;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.12, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + 0.08);
    }

    // Başarı / devam sesi
    function basariSes() {
        if (!enabled) return;
        var c = getCtx(); if (!c) return;
        var osc = c.createOscillator();
        var gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.1, c.currentTime);
        osc.frequency.setValueAtTime(523, c.currentTime);
        osc.frequency.setValueAtTime(659, c.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + 0.25);
    }

    // Geri sesi
    function geriSes() {
        if (!enabled) return;
        var c = getCtx(); if (!c) return;
        var osc = c.createOscillator();
        var gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.08, c.currentTime);
        osc.frequency.setValueAtTime(440, c.currentTime);
        osc.frequency.setValueAtTime(330, c.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + 0.15);
    }

    // Tamamlama / final sesi (quiz bitti)
    function tamamSes() {
        if (!enabled) return;
        var c = getCtx(); if (!c) return;
        [523, 659, 784].forEach(function(freq, i) {
            var osc = c.createOscillator();
            var gain = c.createGain();
            osc.connect(gain);
            gain.connect(c.destination);
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.1, c.currentTime + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.12 + 0.2);
            osc.start(c.currentTime + i * 0.12);
            osc.stop(c.currentTime + i * 0.12 + 0.2);
        });
    }

    return {
        tik: tikSes,
        basari: basariSes,
        geri: geriSes,
        tamam: tamamSes,
        enabled: function() { return enabled; }
    };
})();
