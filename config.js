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
        { id:"kime",       soru:"Hediye kime alınıyor?",                     secenekler:["Sevgili","Arkadaş","Anne","Baba","Kardeş","Çocuk 🧒","Kendime","İş arkadaşı","Bebek ❤️","Pet ❤️"], sayfa:"quiz-kime.html" },
        { id:"cinsiyet",   soru:"Cinsiyeti nedir?",                          secenekler:["Kadın","Erkek","Kız Çocuğu","Erkek Çocuğu"], sayfa:"quiz-cinsiyet.html" },
        { id:"dogum",      soru:"Doğum tarihi hakkında ne biliyorsunuz?",    secenekler:["Tarihini biliyorum","Bilmiyorum","Burcunu biliyorum"], sayfa:"quiz-dogum.html", ozelTip:"dogum" },
        { id:"yas",        soru:"Yaş aralığı yaklaşık olarak nedir?",        secenekler:["0-2 (Bebek)","3-6 (Küçük Çocuk)","7-12 (Çocuk)","13-17 (Genç)","18-25","26-35","36-45","46-60","61-75","76+"], sayfa:"quiz-yas.html" },
        { id:"tarz",       soru:"Tarzı nasıldır?",                           secenekler:["Minimalist","Renkli ve Eğlenceli","Klasik / Şık","Modern / Şık","Spor / Casual"], sayfa:"quiz-tarz.html" },
        { id:"hobiler",    soru:"Hobileri nelerdir?",                        secenekler:["Okumak","Spor yapmak","Müzik / Enstrüman","Seyahat","Yemek yapmak","Teknoloji","Sanat ve el işi","Bahçe / Bitki bakımı"], sayfa:"quiz-hobiler.html", maxSecim:2 },
        { id:"renk",       soru:"En çok sevdiği renk tonu hangisi?",         secenekler:["Pastel Tonlar","Koyu ve Şık Tonlar","Canlı ve Parlak Renkler","Doğal Tonlar"], sayfa:"quiz-renk.html" },
        { id:"amac",       soru:"Hediyeyi ne için alıyorsun?",               secenekler:["Doğum Günü","Yıl Dönümü","Sevgililer Günü","Özel Bir Başarı","Sadece sürpriz","Noel / Yılbaşı"], sayfa:"quiz-amac.html" },
        { id:"ortam",      soru:"Kişi evde mi dışarıda mı zaman geçiriyor?", secenekler:["Daha çok evde","Daha çok dışarıda","İkisi de dengeli"], sayfa:"quiz-ortam.html" },
        { id:"teknoloji",  soru:"Teknolojiye ilgisi var mı?",                secenekler:["Çok ilgili","Orta seviyede","Pek ilgilenmiyor"], sayfa:"quiz-teknoloji.html" },
        { id:"butce",      soru:"Bütçe aralığın nedir?",                     secenekler:["0-500 TL","500-1500 TL","1500-3000 TL","3000-5000 TL","5000-10000 TL","10000-30000 TL","Limitsiz / VIP"], sayfa:"quiz-butce.html" },
        { id:"mevsim",     soru:"Favori mevsimi hangisi?",                   secenekler:["İlkbahar","Yaz","Sonbahar","Kış"], sayfa:"quiz-mevsim.html" },
        { id:"tatli",      soru:"En sevdiği tatlı türü nedir?",              secenekler:["Çikolata","Pasta","Dondurma","Şekerleme","Hiçbiri"], sayfa:"quiz-tatli.html" },
        { id:"spor",       soru:"Spor yapıyor mu?",                          secenekler:["Evet düzenli","Ara sıra","Hiç yapmıyor"], sayfa:"quiz-spor.html" },
        { id:"muzik",      soru:"Favori müzik türü?",                        secenekler:["Pop","Rock","Klasik","Rap / Hip-Hop","Türk Sanat Müziği","Diğer"], sayfa:"quiz-muzik.html" },
        { id:"hayvan",     soru:"Hayvan sever mi?",                          secenekler:["Evet çok sever","Orta","Pek sevmez"], sayfa:"quiz-hayvan.html" },
        { id:"seyahat",    soru:"Seyahat etmeyi sever mi?",                  secenekler:["Çok sever","Ara sıra","Pek sevmez"], sayfa:"quiz-seyahat.html" },
        { id:"kitap",      soru:"Kitap okumayı sever mi?",                   secenekler:["Evet çok","Ara sıra","Hiç okumaz"], sayfa:"quiz-kitap.html" },
        { id:"kahve",      soru:"Kahve mi çay mı?",                          secenekler:["Kahve","Çay","İkisi de","Hiçbiri"], sayfa:"quiz-kahve.html" },
        { id:"film",       soru:"En sevdiği film türü?",                     secenekler:["Romantik","Komedi","Bilim Kurgu","Dram","Aksiyon"], sayfa:"quiz-film.html" },
        { id:"bitki",      soru:"Evde bitki bakımı yapıyor mu?",             secenekler:["Evet","Hayır","Deniyor"], sayfa:"quiz-bitki.html" },
        { id:"oyun",       soru:"Oyun oynar mı?",                            secenekler:["Evet sık sık","Ara sıra","Hiç oynamaz"], sayfa:"quiz-oyun.html" },
        { id:"makyaj",     soru:"Makyaj / bakım ürünlerine ilgisi var mı?",  secenekler:["Çok var","Orta","Yok"], sayfa:"quiz-makyaj.html" },
        { id:"aksesuar",   soru:"Saat / aksesuar takmayı sever mi?",         secenekler:["Evet","Ara sıra","Hiç sevmez"], sayfa:"quiz-aksesuar.html" },
        { id:"mutfak",     soru:"En sevdiği mutfak türü?",                   secenekler:["Türk","İtalyan","Asya","Fast Food","Sağlıklı"], sayfa:"quiz-mutfak.html" },
        { id:"doga",       soru:"Doğa yürüyüşü yapar mı?",                  secenekler:["Evet sever","Ara sıra","Hiç yapmaz"], sayfa:"quiz-doga.html" },
        { id:"sanat",      soru:"Sanat eserlerine ilgisi var mı?",           secenekler:["Çok var","Orta","Yok"], sayfa:"quiz-sanat.html" },
        { id:"foto",       soru:"Fotoğraf çekmeyi sever mi?",               secenekler:["Evet","Ara sıra","Hiç"], sayfa:"quiz-foto.html" },
        { id:"kisilik",    soru:"Kişilik tipi nasıl?",                       secenekler:["İçedönük","Dışadönük","Dengeli"], sayfa:"quiz-kisilik.html" },
        { id:"oncelik",    soru:"Hediye alırken en çok neye dikkat edersin?", secenekler:["Kullanışlı olsun","Güzel görünsün","Özel ve anlamlı olsun","Uygun fiyatlı olsun"], sayfa:"quiz-oncelik.html" },
    ],

    // ==========================================
    // ÖZEL SORU SETLERİ
    // ==========================================
    soruBebekler: [
        { id:"bebek_cinsiyet", soru:"Bebek kız mı erkek mi?",             secenekler:["Kız Bebek","Erkek Bebek","Henüz bilinmiyor"], sayfa:"quiz-bebek-cinsiyet.html" },
        { id:"bebek_yas",      soru:"Kaç aylık / yaşında?",               secenekler:["0-3 ay","3-6 ay","6-12 ay","1 yaş","2 yaş","3 yaş"], sayfa:"quiz-bebek-yas.html" },
        { id:"bebek_amac",     soru:"Hediyeyi ne için alıyorsun?",        secenekler:["Yeni doğdu 🎀","Doğum günü 🎂","Baby shower 🛁","Sünnet 🌙","Sadece sürpriz 🎁"], sayfa:"quiz-bebek-amac.html" },
        { id:"bebek_tarz",     soru:"Anne-baba tarzı nasıl?",             secenekler:["Minimalist / Sade","Renkli ve Neşeli","Organik / Doğal","Modern / Şık"], sayfa:"quiz-bebek-tarz.html" },
        { id:"bebek_tur",      soru:"Ne tür hediye tercih edersin?",      secenekler:["Eğitici / Gelişim","Oyuncak / Eğlence","Giyim / Aksesuar","Pratik / Kullanışlı","Anı / Özel"], sayfa:"quiz-bebek-tur.html" },
        { id:"bebek_butce",    soru:"Bütçe aralığın nedir?",              secenekler:["0-500 TL","500-1500 TL","1500-3000 TL","3000-5000 TL","5000+ TL"], sayfa:"quiz-bebek-butce.html" },
    ],

    soruCocuklar: [
        { id:"cocuk_cinsiyet", soru:"Kız mı erkek mi?",                   secenekler:["Kız","Erkek"], sayfa:"quiz-cocuk-cinsiyet.html" },
        { id:"cocuk_yas",      soru:"Kaç yaşında?",                       secenekler:["4-5 yaş","6-7 yaş","8-9 yaş","10-11 yaş","12-13 yaş","14-15 yaş","16-17 yaş"], sayfa:"quiz-cocuk-yas.html" },
        { id:"cocuk_amac",     soru:"Hediyeyi ne için alıyorsun?",        secenekler:["Doğum Günü","Yılbaşı / Bayram","Başarı Ödülü","Sürpriz"], sayfa:"quiz-cocuk-amac.html" },
        { id:"cocuk_aktivite", soru:"En sevdiği aktivite nedir?",          secenekler:["Oyun / Video oyunları","Spor / Hareket","Sanat / El işi","Okuma / Öğrenme","Müzik","Teknoloji"], sayfa:"quiz-cocuk-aktivite.html" },
        { id:"cocuk_tema",     soru:"Favori tema / karakter kategorisi?",  secenekler:["Oyun / Minecraft / Roblox","Disney / Pixar / Prenses","Süper Kahraman / Marvel / DC","Anime / Manga","Spor / Futbol Takımı","Hayvanlar / Doğa","Müzik / Pop Yıldızı","Tema yok / Bilmiyorum"], sayfa:"quiz-cocuk-tema.html" },
        { id:"cocuk_ortam",    soru:"Daha çok nerede vakit geçiriyor?",   secenekler:["Evde / İç mekan","Dışarıda / Aktif","İkisi de"], sayfa:"quiz-cocuk-ortam.html" },
        { id:"cocuk_tur",      soru:"Ne tür hediye tercih edersin?",      secenekler:["Oyuncak / Oyun","Eğitici / Kitap","Spor / Aktivite","Teknoloji / Gadget","Giyim / Aksesuar","Deneyim / Etkinlik"], sayfa:"quiz-cocuk-tur.html" },
        { id:"cocuk_butce",    soru:"Bütçe aralığın nedir?",              secenekler:["0-500 TL","500-1500 TL","1500-3000 TL","3000-5000 TL","5000+ TL"], sayfa:"quiz-cocuk-butce.html" },
    ],

    // Pet türü seçimi - ilk soru hep bu, sonra türe göre farklı set
    soruPetler: [
        { id:"pet_tur", soru:"Hangi hayvan?", secenekler:["Kedi 🐱","Köpek 🐶","Kuş 🐦","Tavşan 🐰","Hamster 🐹","Balık 🐟","Egzotik / Diğer 🦎"], sayfa:"quiz-pet-tur.html" },
    ],

    // Kedi soruları
    soruKedi: [
        { id:"pet_tur",       soru:"Hangi hayvan?",               secenekler:["Kedi 🐱","Köpek 🐶","Kuş 🐦","Tavşan 🐰","Hamster 🐹","Balık 🐟","Egzotik / Diğer 🦎"], sayfa:"quiz-pet-tur.html" },
        { id:"kedi_yas",      soru:"Kedi kaç yaşında?",           secenekler:["Yavru (0-1 yaş)","Genç (1-3 yaş)","Yetişkin (3-8 yaş)","Yaşlı (8+ yaş)"], sayfa:"quiz-kedi-yas.html" },
        { id:"kedi_karakter", soru:"Karakteri nasıl?",             secenekler:["Çok aktif ve oyuncu 🎯","Orta enerjili","Sakin ve uysal 😴","Biraz vahşi / yabani 🐯"], sayfa:"quiz-kedi-karakter.html" },
        { id:"kedi_ortam",    soru:"Nerede yaşıyor?",              secenekler:["Sadece iç mekanda","Hem ev hem dışarı","Dış mekan / bahçe"], sayfa:"quiz-kedi-ortam.html" },
        { id:"kedi_tur",      soru:"Ne tür hediye düşünüyorsun?", secenekler:["Oyuncak / Eğlence 🎾","Kedi maması / ödül mama 🍖","Yatak / Kedi evi / Çizme","Aksesuar / Tasarım tasma","Sağlık / Bakım ürünleri","Kedi tırmalama aparatı"], sayfa:"quiz-kedi-tur.html" },
        { id:"kedi_butce",    soru:"Bütçe aralığın nedir?",       secenekler:["0-300 TL","300-750 TL","750-1500 TL","1500-3000 TL","3000+ TL"], sayfa:"quiz-kedi-butce.html" },
    ],

    // Köpek soruları
    soruKopek: [
        { id:"pet_tur",        soru:"Hangi hayvan?",               secenekler:["Kedi 🐱","Köpek 🐶","Kuş 🐦","Tavşan 🐰","Hamster 🐹","Balık 🐟","Egzotik / Diğer 🦎"], sayfa:"quiz-pet-tur.html" },
        { id:"kopek_yas",      soru:"Köpek kaç yaşında?",          secenekler:["Yavru (0-1 yaş)","Genç (1-3 yaş)","Yetişkin (3-8 yaş)","Yaşlı (8+ yaş)"], sayfa:"quiz-kopek-yas.html" },
        { id:"kopek_irk",      soru:"Irk büyüklüğü nasıl?",        secenekler:["Küçük ırk (Chihuahua, Pomeranian vb.)","Orta ırk (Beagle, Cocker vb.)","Büyük ırk (Labrador, Golden vb.)","Çok büyük ırk (Kangal, Rottweiler vb.)"], sayfa:"quiz-kopek-irk.html" },
        { id:"kopek_karakter", soru:"Karakteri nasıl?",             secenekler:["Çok enerjik / Oyuncu 🎾","Orta enerjili","Sakin / Uysal 😌","Koruyucu / Bekçi 🛡️"], sayfa:"quiz-kopek-karakter.html" },
        { id:"kopek_tur",      soru:"Ne tür hediye düşünüyorsun?", secenekler:["Oyuncak / Çiğneme oyuncağı 🦴","Köpek maması / ödül mama 🍖","Yatak / Köşk / Yatacak yer","Tasma / Gezdirme seti / GPS","Giysi / Köpek kıyafeti 👕","Sağlık / Bakım / Bakım seti"], sayfa:"quiz-kopek-tur.html" },
        { id:"kopek_butce",    soru:"Bütçe aralığın nedir?",       secenekler:["0-300 TL","300-750 TL","750-1500 TL","1500-3000 TL","3000+ TL"], sayfa:"quiz-kopek-butce.html" },
    ],

    // Kuş soruları
    soruKus: [
        { id:"pet_tur",      soru:"Hangi hayvan?",               secenekler:["Kedi 🐱","Köpek 🐶","Kuş 🐦","Tavşan 🐰","Hamster 🐹","Balık 🐟","Egzotik / Diğer 🦎"], sayfa:"quiz-pet-tur.html" },
        { id:"kus_tur",      soru:"Kuş türü nedir?",             secenekler:["Muhabbet kuşu 💚","Kanarya 🟡","Papağan (büyük) 🦜","Cennet papağanı / Sultan papağanı","Hint bülbülü / Sığırcık","Diğer / Bilmiyorum"], sayfa:"quiz-kus-tur.html" },
        { id:"kus_kafes",    soru:"Kafes durumu nasıl?",          secenekler:["Küçük kafes var","Orta kafes var","Büyük uçuş kafesi var","Kafes yok / Yeni alındı"], sayfa:"quiz-kus-kafes.html" },
        { id:"kus_hediye",   soru:"Ne tür hediye düşünüyorsun?", secenekler:["Kuş yemi / Vitamin takviyesi 🌾","Kafes oyuncağı / Tünek","Kafes aksesuarı / Suluk-Yemlik","Yeni veya büyük kafes","Sağlık / Bakım / Tüy bakımı"], sayfa:"quiz-kus-hediye.html" },
        { id:"kus_butce",    soru:"Bütçe aralığın nedir?",       secenekler:["0-200 TL","200-500 TL","500-1000 TL","1000-2500 TL","2500+ TL"], sayfa:"quiz-kus-butce.html" },
    ],

    // Balık soruları
    soruBalik: [
        { id:"pet_tur",       soru:"Hangi hayvan?",               secenekler:["Kedi 🐱","Köpek 🐶","Kuş 🐦","Tavşan 🐰","Hamster 🐹","Balık 🐟","Egzotik / Diğer 🦎"], sayfa:"quiz-pet-tur.html" },
        { id:"balik_tip",     soru:"Akvaryum türü nedir?",        secenekler:["Tropikal / Sıcak su 🌊","Soğuk su (Japon balığı vb.) ❄️","Deniz akvaryumu 🐠","Yeni başlıyorum / Henüz yok"], sayfa:"quiz-balik-tip.html" },
        { id:"balik_boyut",   soru:"Akvaryum boyutu?",            secenekler:["Mini (30 litre altı) 🫙","Orta (30-100 litre) 🐟","Büyük (100-300 litre) 🌊","Çok büyük (300+ litre) 🦈"], sayfa:"quiz-balik-boyut.html" },
        { id:"balik_hediye",  soru:"Ne tür hediye düşünüyorsun?", secenekler:["Balık yemi / Özel besin 🌾","Akvaryum dekoru / Bitki / Taş","Filtre / Pompa / Teknik ekipman","Aydınlatma / LED ışık sistemi","İlaç / Sağlık / Su düzenleyici","Yeni akvaryum seti"], sayfa:"quiz-balik-hediye.html" },
        { id:"balik_butce",   soru:"Bütçe aralığın nedir?",       secenekler:["0-200 TL","200-500 TL","500-1000 TL","1000-2500 TL","2500+ TL"], sayfa:"quiz-balik-butce.html" },
    ],

    // Tavşan / Hamster / Egzotik soruları
    soruKucukPet: [
        { id:"pet_tur",          soru:"Hangi hayvan?",               secenekler:["Kedi 🐱","Köpek 🐶","Kuş 🐦","Tavşan 🐰","Hamster 🐹","Balık 🐟","Egzotik / Diğer 🦎"], sayfa:"quiz-pet-tur.html" },
        { id:"kucukpet_yas",     soru:"Yaşı ne kadar?",              secenekler:["Yavru (0-6 ay)","Genç (6 ay - 2 yaş)","Yetişkin (2+ yaş)"], sayfa:"quiz-kucukpet-yas.html" },
        { id:"kucukpet_yuva",    soru:"Kafes / yuva durumu?",        secenekler:["Küçük kafes var","Büyük kafes var","Serbest dolaşıyor (tavşan vb.)","Kafes yok / Yeni alındı"], sayfa:"quiz-kucukpet-yuva.html" },
        { id:"kucukpet_hediye",  soru:"Ne tür hediye düşünüyorsun?", secenekler:["Yem / Özel besin 🥕","Oyuncak / Aktivite 🎠","Kafes / Yuva aksesuarı","Sağlık / Bakım ürünü","Yeni kafes / Büyük yaşam alanı"], sayfa:"quiz-kucukpet-hediye.html" },
        { id:"kucukpet_butce",   soru:"Bütçe aralığın nedir?",       secenekler:["0-200 TL","200-500 TL","500-1000 TL","1000-2500 TL","2500+ TL"], sayfa:"quiz-kucukpet-butce.html" },
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

    // ==========================================
    // ESPRİ NOTLARI (Kendime seçildiğinde)
    // ==========================================
    espriNotlari: {
        yas:       "Sormak ayıp ama sormadan da olmaz 😅",
        hobiler:   "Kendine karşı dürüst ol 😄",
        tarz:      "Aynaya bak, tarzın ne? 🪞",
        butce:     "Kendine de mi kıyamıyorsun? 😁",
        amac:      "Bu sefer bahane yok, sadece sen varsın 🎁",
        mevsim:    "En sevdiğin mevsim, en iyi hediye ipucu! 🌸",
        teknoloji: "Teknoloji meraklısı mısın yoksa 'telefonum yeter' mi? 😄",
        kahve:     "Kahve mi çay mı — hayatın en zor sorusu 😂",
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
    },

    // Tüm cevapları sıfırla
    resetCevaplar: function() {
        localStorage.removeItem('budurBuldumCevaplar');
        localStorage.removeItem('budurBuldumAktifSet');
        localStorage.removeItem('budurBuldumSecilenKime');
        localStorage.removeItem('budurBuldumSecilenBurc');
        localStorage.removeItem('budurBuldumSelectedCriteria');
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
    getAktifSorular: function() {
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
        const sorular = this.getAktifSorular();
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
        const sorular = this.getAktifSorular();
        const cevaplar = this.getCevaplar();
        const mevcutIdx = sorular.findIndex(s => s.id === mevcutSoruId);

        // Dallanma kontrolü: özel sete geçiş var mı?
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

        // DUMMY — bir sonraki if yoksa syntax hatası olmasın
            }
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

        // Normal akış: sonraki geçerli soruyu bul
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
        const sorular = this.getAktifSorular();
        const mevcutIdx = sorular.findIndex(s => s.id === mevcutSoruId);

        // Özel setteki ilk sorudaysak, kime sorusuna geri dön
        if (mevcutIdx === 0 && this.getAktifSet() !== 'normal') {
            this.setAktifSet('normal');
            return 'quiz-kime.html';
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
        let sorular = this.getAktifSorular();
        let idx = sorular.findIndex(s => s.id === soruId);
        if (idx === -1) {
            this._autoFixSet(soruId);
            sorular = this.getAktifSorular();
            idx = sorular.findIndex(s => s.id === soruId);
        }
        const aktifSet = this.getAktifSet();
        const offset = aktifSet !== 'normal' ? 1 : 0;
        const toplam = sorular.length + offset;
        const mevcut = idx + 1 + offset;
        return Math.round((mevcut / toplam) * 100);
    },

    // Soru numarasını hesapla (görünen)
    getSoruNo: function(soruId) {
        let sorular = this.getAktifSorular();
        let idx = sorular.findIndex(s => s.id === soruId);
        // Fallback: soru bulunamazsa seti otomatik düzelt
        if (idx === -1) {
            this._autoFixSet(soruId);
            sorular = this.getAktifSorular();
            idx = sorular.findIndex(s => s.id === soruId);
        }
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

    // Filtrelenmiş seçenekleri al
    getFiltrelenmisSecenekler: function(soruId) {
        const cevaplar = this.getCevaplar();
        let soru = this.getAktifSorular().find(s => s.id === soruId);
        // Fallback: aktif sette bulunamazsa tüm setlerde ara
        if (!soru) {
            const tumSetler = [].concat(QUIZ_CONFIG.sorular, QUIZ_CONFIG.soruBebekler, QUIZ_CONFIG.soruCocuklar, QUIZ_CONFIG.soruPetler);
            soru = tumSetler.find(s => s.id === soruId);
            // Aktif seti düzelt
            if (soru) {
                if (QUIZ_CONFIG.soruBebekler.find(s => s.id === soruId)) this.setAktifSet('bebekler');
                else if (QUIZ_CONFIG.soruCocuklar.find(s => s.id === soruId)) this.setAktifSet('cocuklar');
                else if (QUIZ_CONFIG.soruPetler.find(s => s.id === soruId)) this.setAktifSet('petler');
                else this.setAktifSet('normal');
            }
        }
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

    // Espri notu al
    getEspriNotu: function(soruId) {
        const cevaplar = this.getCevaplar();
        if (cevaplar.kime === 'Kendime' && QUIZ_CONFIG.espriNotlari[soruId]) {
            return QUIZ_CONFIG.espriNotlari[soruId];
        }
        return '';
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
