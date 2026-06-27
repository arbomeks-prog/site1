# BudurBuldum — Proje Notları

Bu dosya her büyük iş bittiğinde güncellenir.
Yeni bir konuşmaya başlarken Claude bu dosyayı okumalı.

---

## ⚠️ KRİTİK ÇALIŞMA KURALI

**Repoya ASLA sormadan push yapma.**
- "yap" veya "push et" demeden hiçbir dosya repoya atılmaz
- Demo dosyaları sadece outputs klasöründe kalır
- Canlıya almak için açık onay şart
- Bu kural her oturumda geçerlidir, istisnası yoktur

## Repo Yapısı

- `index.html` → `quiz-kime.html` → quiz adımları → `ozet.html` → `hediyeler.html`
- `config.js` — ortak JS ve quiz branching mantığı
- `api/gifts.js` — xAI Grok API (grok-4.3), hediye önerileri
- `api/log-quiz.js` — quiz log
- `vercel.json` — redirect'ler ve Vercel config
- `_video-sablon.html` — video animasyonu şablonu (play butonu, ses, kayıt hazır)

---

## Video Animasyonu — sahne-demo.html

### Ne Yaptık (1 Haziran 2026)
Canvas tabanlı sosyal medya animasyon videosu. 30 adımda tamamlandı.

**Sahne sırası:**
1. Harf yağmuru — "Babana hediye aldın mı?" + "BudurBuldum dedin mi?"
2. Oğlan (mavi) soldan, Kız (pembe) sağdan yürüyüp taburelere oturur — yürürken gözyaşı
3. Düşünce balonları (5 çift) yürürken başlar
4. İkisi oturduğunda "Çıldıracağım" yazısı → çığlık resmi → ses-muzik.mp3
5. BUDUR BULDUM logosu iner → fon müziği başlar
6. Quiz kartları (10 soru) — her biri farklı yönde çıkar, kalpler fırlar
7. Hediye ızgarası (12 ürün, Pexels)
8. CTA bölümü

**Ses dosyaları:**
- `ses-muzik.mp3` — çığlık (2.5sn, volume 0.5)
- `mrstokes302-uh-oh-male-fx-mrstokes302-521215.mp3` — erkek yürüyüş (loop)
- `dragon-studio-woman-sobbing-372482.mp3` — kız yürüyüş
- `ses-dogru.mp3` + `ses-tik.mp3` — quiz highlight (volume 0.2)
- `prettyjohn1-motivational-526517.mp3` — fon müziği (volume 0.8, loop)

---

## Kritik Teknik Kurallar

### Play Butonu (HER VİDEODA ŞART)
```html
<!-- display:none başlar -->
<div id="startBtn" onclick="document.getElementById('startBtn').style.display='none'; baslatHerSey();"
     style="display:none; position:fixed; inset:0; align-items:center; justify-content:center; z-index:9999; pointer-events:all;">
  <div style="width:72px; height:72px; border-radius:50%; background:rgba(255,217,61,0.92); ...">
    <svg ...><polygon points="5,3 19,12 5,21"/></svg>
  </div>
</div>
```
```js
// Script'in EN SONUNDA göster
document.getElementById('startBtn').style.display = 'flex';
```

### touch-action (HER VİDEODA ŞART)
```css
/* YANLIŞ — butonu kırar */
* { touch-action: none; }

/* DOĞRU — sadece canvas */
canvas { touch-action: none; }
```

### Video Kayıt Sistemi (Chrome'da çalışır, Samsung browser'da çalışmaz)
```js
// AudioContext ile ses + video birleştir
const audioCtx = new AudioContext();
const dest = audioCtx.createMediaStreamDestination();
// Her ses elementi için:
const src = audioCtx.createMediaElementSource(el);
src.connect(dest);
src.connect(audioCtx.destination); // hoparlörden de çıksın

// crossOrigin ŞART — yoksa canvas tainted olur, Pexels görselleri kayda girmez
img.crossOrigin = 'anonymous';

// Hediye görselleri play'e basınca önceden yükle
// Kayıt CTA sonrası 20sn devam eder
```

### ÖNEMLİ: Chrome 126+ MP4 + AAC Kaydedebiliyor ✅ TEST EDİLDİ ÇALIŞIYOR
Chrome 126'dan itibaren MediaRecorder MP4 + AAC destekliyor.
Codec açıkça belirtilmezse Chrome Opus koyar → Samsung native player sesi tanımaz.
**AAC codec açıkça belirtilmeli** — böylece Samsung, iPhone, her oynatıcıda ses çalışır.
```js
const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1.42E01E,mp4a.40.2')
  ? 'video/mp4;codecs=avc1.42E01E,mp4a.40.2'   // H.264 + AAC → evrensel ✅
  : MediaRecorder.isTypeSupported('video/mp4')
  ? 'video/mp4'
  : MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
  ? 'video/webm;codecs=vp9,opus'
  : 'video/webm';

const recorder = new MediaRecorder(videoStream, { mimeType });
// indirirken:
const isMP4 = mimeType.includes('mp4');
a.download = isMP4 ? 'video.mp4' : 'video.webm';
```
sahne-demo.html'e uygulandı (commit 8468af6). _video-sablon.html'e henüz uygulanmadı.

### JS Syntax Kontrol (HER DEĞİŞİKLİKTEN SONRA)
```bash
python3 -c "
html = open('dosya.html').read()
import re; m = re.search(r'<script>(.*?)</script>', html, re.DOTALL)
code = m.group(1); depth = 0
for i, line in enumerate(code.split('\n')):
    depth += line.count('{') - line.count('}')
    if depth < 0: print(f'Hata {i+1}: {line.strip()}'); break
else: print('OK depth:', depth)
"
```

### Sık Karşılaşılan Hatalar
- `function baslaQA()` satırı str_replace sırasında kaybolabiliyor — kontrol et
- `function update()` de kaybolabiliyor — kontrol et
- Samsung browser Türkçe TTS yok (`synthesis-failed`) — speechSynthesis kullanma
- `.webm` dosyası Samsung'da oynatılmıyor/paylaşılmıyor — cloudconvert.com ile mp4'e çevir

---

## Tarayıcı & Platform Uyumluluk Tablosu

### canvas.captureStream() + MediaRecorder (Video Kayıt)

| Platform | Durum | Format | Not |
|---|---|---|---|
| Chrome Android 126+ | ✅ Çalışır | MP4 veya WebM | En iyi seçenek |
| Chrome Android 49-125 | ✅ Çalışır | WebM | MP4 yok |
| Samsung Browser | ❌ Çalışmaz | - | 0 byte çıkar |
| Safari iOS | ⚠️ Sorunlu | MP4 | `onstop` tetiklenmiyor, donma sorunu var |
| Firefox Android | ✅ Çalışır | WebM | Test edilmedi |
| Chrome Desktop | ✅ Çalışır | MP4 veya WebM | |

### speechSynthesis (Metin Okuma)

| Platform | Durum | Not |
|---|---|---|
| Chrome Android | ✅ Çalışır | Türkçe var |
| Samsung Browser | ❌ Çalışmaz | Türkçe ses paketi yok — 13 ses var, Türkçe yok |
| Safari iOS | ✅ Çalışır | Türkçe var |
| Firefox | ✅ Çalışır | |

### Genel Site Uyumluluğu (Canvas Animasyon İzleme)

| Platform | Durum |
|---|---|
| Chrome Android | ✅ |
| Samsung Browser | ✅ |
| Safari iOS | ✅ |
| Firefox | ✅ |

### Sonuç
- **Video kayıt için:** Chrome Android kullan
- **Ekran kaydı için:** Samsung ekran kaydı en pratik — ses dahil kaydeder, MP4 çıkar, editörde düzenlenir
- **iOS'ta:** Test edilmedi — Safari'de canvas kayıt sorunlu



- `babalar-gunu-tanitim-v7-4.html` — quiz + fotoğraf geçişleri + şiir animasyonu (FINAL)
- `ciglik-v7-10.html` — 3x4 ızgara Çığlık tablosu formatı

---

## GitHub Actions — Pexels Fotoğraf İndirme

Workflow hazır: `.github/workflows/pexels-indir.yml`
Script hazır: `pexels-indir.py`

**YAPILACAK:** Token'a workflow yetkisi ekle:
GitHub.com → Settings → Developer settings → Personal access tokens → token'ı bul → Edit → **workflow** kutusunu işaretle → Save

Token push'a hazır hale gelince:
```bash
git push https://ghp_TOKEN@github.com/arbomeks-prog/site1.git main
```
Sonra GitHub → Actions → "Pexels Fotoğraf İndir" → "Run workflow" butonuna bas.
Fotoğraflar `gorseller/` klasörüne iner, otomatik commit edilir.

---


- "yapay zeka destekli" yazma → "akıllı algoritma" kullan
- 72 quiz sayfasında JSON-LD schema var
- Search Console: 8 sayfa indexlendi

---

## Quiz Sayfası Standart Yapısı (Makale İçeriği Ekleme)

Her quiz sayfasının altına şu sırayla eklenir:

1. **Makale içeriği** (`#makale-icerik` div) — ilgili makalenin tüm içeriği
   - h2 başlıklar + makale-seo-inline gri sorgular
   - Fotoğraflar: float-sol / full-genişlik / float-sağ sırasıyla
   - highlight-box
   - bb-hakkinda (TAM METİN — kısaltma!)
   - "Teste Başla ↑" butonu

2. **Sıradaki adım butonları** — bir sonraki quiz sayfasına tıklanabilir linkler
   - Başlık: "🔀 Sıradaki Adım: [Soru Adı]"
   - Grid 2 sütun, her buton `<a href="sonraki-sayfa.html">` ile sarılı
   - Dallanma varsa: her dal kendi sayfasına link verir
   - Dallanma yoksa (tek yol): tüm butonlar aynı sayfaya link verir

3. **Pexels fotoğraf script** — her başlık için uygun sorgu

4. **Footer** — standart (sosyal medya ikonları dahil)

**bb-hakkinda tam metin (değişmez):**
Budur Buldum, akıllı bir hediye bulma, seçme ve satın alma platformudur. Hazır hediye satışı yapmıyoruz — bunun yerine bütçenize uygun, sevdiğiniz kişinin zevkleri ve özellikleriyle örtüşen, kaliteli ve özgün seçimler yapıyoruz. Hediye seçimlerimizin kalitesinden ödün vermemek için 30 soruluk bir test hazırladık. Bu testi tamamladığınızda; 2 adet nokta atışı, 4 adet çapraz sorgu ile belirlenmiş ve isterseniz kişinin burcuna özel seçilmiş 7 hediye sunuyoruz. Önerdiğimiz hediyelerin **Trendyol**, **Hepsiburada**, **Çiçeksepeti**, **N11** ve **Amazon Türkiye** üzerindeki sayfalarını doğrudan bağlantılarıyla hediye kutucuklarında belirtiyoruz. Budur Buldum, kişiye özel hediye bulmanız, seçmeniz ve satın almanız için tasarlanmış Türkiye'nin en kapsamlı ilk ve tek platformudur. Hemen başlayın.

---

## Çalışma Kuralları
- "yap" demeden harekete geçme
- Değişiklikten önce dosyayı oku
- Commit mesajları Türkçe ve açıklayıcı
- Her push sonrası syntax kontrol yap
- `sadece-degisen-dosyalar.zip` repoda duruyor — silinecek

---

## Makale XP Quiz Sistemi — FINAL (10 Haziran 2026)

**Dosyalar:**
- `makale-quiz-xp-v2.html` — aktif çalışma dosyası
- `makale-quiz-xp-v2-final.html` — final yedek
- `makale-quiz-xp-v2-20260610.html` — tarihli yedek
- `makale-quiz-xp-deneme.html` — orijinal demo (dokunma)

**Nasıl çalışır:**
- Sol sütun: makale metni
- Sağ sütun: quiz soruları + cevaplar + her sorunun altında "Hediyeleri Gör" butonu
- Şıkka tıklayınca: altındaki "Hediyeleri Gör" butonu yanıp söner (flash) + son hamlede glare geçer
- "Hediyeleri Gör" butonuna cevap vermeden basarsa: sol tarafta popup açılır, sağdaki cevapları işaret eder, cevap verilince direkt hediyeler açılır
- "Hediyeleri Gör" butonuna cevap verdikten sonra basarsa: direkt hediyeler açılır
- Popup kapatma butonu Windows XP kırmızı stili
- Hediyeler 2x2 grid, tıklanınca alışveriş sitesine gider (affiliate)

---

## Makale CTA Butonu — Hook Sistemi (10 Haziran 2026)

**Dosya:** `cta-test.html` (test), makale sayfalarına entegre edilecek

**Mantık:**
- Makale paragrafları arasına turuncu büyük CTA butonu yerleştirilir
- Buton metni: "Kişiye özel sürpriz hediyeler için 120 saniye yeterli — tıkla →"
- Tıklayınca quiz-kime.html'e gider (ana quiz akışı)
- Altında 4 küçük Pexels görseli — makalenin konusundan FARKLI ürünler
- Amaç: "Başka kategorilerde de güzel hediyeler var, gel bak" mesajı vermek
- Örnek: Teknoloji makalesinde → deri cüzdan, kitap, parfüm, çiçek görselleri

**Hook mantığı (Reels hook gibi):**
1. XP soruları (sağ sütun) — "bu konuda hemen ürün gör" oltası
2. CTA butonu (paragraf arası) — "başka kategorilerde de var" oltası
3. Her ikisi aynı anda çalışıyor, farklı kullanıcı profillerini yakalıyor

**Görsel seçim kuralı:**
- Makalenin konusundan farklı ürün görselleri seç
- Merak uyandıran, çeşitli kategorilerden görseller
- Pexels API ile dinamik çekilir

---

## 🏗️ SİSTEM MİMARİSİ (28 Haziran 2026 itibarıyla)

### Genel Akış

```
index.html  (tek sayfalık ana uygulama)
    └── 31 iframe (her biri ayrı HTML quiz sayfası, ?embed=1 ile yüklenir)
         └── config.js  (her iframe bu dosyayı okur — soru metni, seçenekler, yönlendirmeler)
              └── localStorage: budurBuldumCevaplar (tüm cevaplar burada birikir)
                   └── ozet.html (cevap özeti, bütçe widget'ı config'den beslenir)
                        └── hediyeler.html (Grok API → hediye önerileri)
```

### index.html — Ne Yapar?

- 31 iframe'i sırayla içerir, her iframe bir quiz sorusu.
- Dallanma mantığını kendisi yönetir: `kime` cevabına göre hangi ek iframe'lerin görüneceğine karar verir.
- `SAYFA_SORU_MAP` objesi: hangi HTML dosyasının hangi SORU_ID'ye karşılık geldiğini tutar.
- İçinde **ayrı bir dallanma seti** var: bebek/çocuk/pet seçilince o türün özel soruları dinamik eklenir.
- **DOKUNULMAZ** — değişiklik için önce `index-calisma.html` kopyası alınır.

### config.js — Soru Setleri

- `sorular` → Normal akış, 30 soru (kime→cinsiyet→yas→tarz→hobiler→renk→amac→ortam→teknoloji→butce→mevsim→tatli→spor→muzik→hayvan→seyahat→kitap→kahve→film→bitki→oyun→makyaj→aksesuar→mutfak→doga→sanat→foto→kisilik→oncelik→dogum)
- `soruBebekler` → Bebek ❤️: bebek_cinsiyet, bebek_yas, bebek_amac, bebek_tarz, bebek_tur, bebek_butce
- `soruCocuklar` → Çocuk 🧒: cocuk_cinsiyet, cocuk_yas, cocuk_amac, cocuk_aktivite, cocuk_tema, cocuk_ortam, cocuk_tur, cocuk_butce
- `soruPetler` → Pet ❤️ ilk adım: sadece pet_tur sorusu
- `soruKedi` → Kedi: pet_tur, kedi_yas, kedi_karakter, kedi_ortam, kedi_tur, kedi_butce
- `soruKopek` → Köpek: pet_tur, kopek_yas, kopek_irk, kopek_karakter, kopek_tur, kopek_butce
- `soruKus` → Kuş: pet_tur, kus_tur, kus_kafes, kus_hediye, kus_butce
- `soruBalik` → Balık: pet_tur, balik_tur, balik_boyut, balik_hediye, balik_butce
- `soruKucukPet` → Tavşan/Hamster/Egzotik: pet_tur, kucukpet_yas, kucukpet_yuva, kucukpet_hediye, kucukpet_butce

### config.js — QuizHelper Metodları

Her quiz sayfası QuizHelper'ı kullanır:
- `getAktifSorular(soruId)` → hangi sette olduğunu bulur, o seti döner
- `getSonrakiSayfa(soruId)` → bir sonraki HTML dosyasını döner
- `getOncekiSayfa(soruId)` → geri butonu için
- `setCevap(soruId, deger)` → localStorage'a yazar
- `getFiltrelenmisSecenekler(soruId)` → önceki cevaba göre seçenekleri filtreler
- `setAktifSet(set)` → 'normal' / 'bebekler' / 'cocuklar' / 'petler' / 'kedi' / 'kopek' / 'kus' / 'balik' / 'kucukpet'

### Bütçe Widget'ı — İki Yerde, Aynı Kaynak

1. **10. soru (quiz akışı):** `butceye-gore-hediye-bulma-testi.html` → config.js `butce` seçenekleri
2. **Özet sayfası:** "BÜTÇEYİ DEĞİŞTİREBİLİRSİNİZ" → config.js `butceSoru.secenekler` dinamik render
→ İkisi de config.js'ten beslenir, **aynı seçenekler.**

### Önemli Dosyalar

| Dosya | Görevi |
|---|---|
| `index.html` | Ana uygulama, 31 iframe, dallanma |
| `config.js` | Tüm soru setleri + QuizHelper |
| `ozet.html` | Cevap özeti + bütçe değiştirme |
| `hediyeler.html` | Grok API, hediye kartları, paylaş |
| `api/gifts.js` | Grok API backend (xAI, web search aktif) |
| `NOTLAR.md` | Sistem dokümantasyonu — bu dosya |

### Bilinen Tuzaklar

- `butceye-gore-evcil-hayvan-hediyesi-testi.html` → SORU_ID="pet_butce" ama config'de bu id yok. Hiçbir akışta kullanılmıyor, ölü sayfa.
- index.html dallanması ile config.js dallanması **ayrı ama uyumlu** — birini değiştirince diğerini de kontrol et.
- Toplu script çalıştırmadan önce `hobiye-gore-hediye-bulma-testi.html` içinde `bb-hakkinda` var mı kontrol et. Yoksa dur.



---

## ⚠️ QUIZ SAYFASI YAPISI — DOKUNMA KURALLARI

Her quiz sayfası (örn. `butceye-gore-hediye-bulma-testi.html`) **iki ayrı bölümden** oluşur. Bunlar aynı HTML dosyasında iç içedir. Herhangi bir değişiklik yaparken hangisine dokunduğunu bil.

### Bölüm 1: QUIZ KISMI (üst) — index.html iframe'inde çalışır

```html
<!-- DOKUNULABILIR: sadece makale kartı içindeki kısa özet metin -->
<article>  ← küçük özet metin kartı (scroll'lu, 110px yükseklik)
    <h2>...</h2>
    <p>...</p>
</article>

<!-- DOKUNMA: JS tarafından yönetilir -->
<div id="options-container">  ← SEO için sabit HTML şıklar (onclick="return false;")
    <button>0-500 TL</button>   ← Google bunları görür
    ...
</div>
<!-- Sayfa yüklenince JS bu container'ı tamamen yeniden render eder -->
<!-- Gerçek şıklar config.js'ten gelir: QuizHelper.getFiltrelenmisSecenekler(SORU_ID) -->
```

### Bölüm 2: MAKALE KISMI (alt) — SEO içeriği

```html
<div id="makale-icerik">  ← BURAYA DOKUNMA (toplu script tehlikesi)
    <h2>...</h2>
    <p>...</p>
    ...
    <div class="bb-hakkinda">...</div>  ← KESİNLİKLE DOKUNMA
</div>
```

### Altın Kural

**Toplu script çalıştırmadan önce:** `hobiye-gore-hediye-bulma-testi.html` içinde `bb-hakkinda` kelimesi var mı kontrol et. Yoksa dur.

**Tek bir sayfada değişiklik yaparken:** Hangi bölüme dokunuyorsun? Quiz kısmı mı, makale kısmı mı? İkisi aynı dosyada — birini değiştirirken diğerini silme.

**Config.js'teki seçenekler değişince** HTML'e dokunmana gerek yok — JS zaten config'den okuyor. Sabit HTML şıklar (`onclick="return false;"`) sadece Google için, onlara dokunma.

### Bu Hatanın Geçmişi

Makale içerikleri şimdiye kadar 4 kez toplu script'lerle silindi (GA4 ekleme, espri notu kaldırma gibi operasyonlarda). Her seferinde 61 quiz sayfası restore edilmek zorunda kalındı. Referans commit: `abc257d664`



---

## 🟡 AKTİF DURUM — 28 Haziran 2026

### Bugün Yapılanlar

1. **Pet bütçe seçenekleri güncellendi** (config.js)
   - `kedi_butce`, `kopek_butce`, `kus_butce`, `balik_butce`, `kucukpet_butce` seçenekleri "X TL'ye kadar" formatına getirildi
   - Yeni format: `500 TL'ye kadar`, `1000 TL'ye kadar`, `2000 TL'ye kadar`, `3000 TL'ye kadar`, `4000 TL'ye kadar`
   - Commit: `b3f3f8ebd330d95da5f66360d9b8e47680c174a7`
   - **Geri dönüş:** `bab5ff104b75af68e10d1957530245a3b13cad75`

2. **NOTLAR.md güncellendi**
   - Sistem mimarisi bölümü eklendi
   - Quiz sayfası yapısı ve dokunma kuralları eklendi
   - ANA ÇALIŞMA KURALLARI hafızaya eklendi

### Yarım Kalan / Sonraki Oturumda Devam

- `butceye-gore-evcil-hayvan-hediyesi-testi.html` → SORU_ID="pet_butce" ama config'de bu id yok. Ölü sayfa, akışta kullanılmıyor. Silinebilir veya öylece bırakılabilir — karar verilmedi.
- Ana `butce` seçenekleri hâlâ eski format (`0-500 TL`, `0-1000 TL`...). Pet bütçeleri "X TL'ye kadar" oldu ama ana akış farklı kaldı — **tutarsızlık var, karar verilmedi.**
- Bebek bütçesi (`bebek_butce`) ve çocuk bütçesi (`cocuk_butce`) seçenekleri de eski format — ona da dokunulmadı.

### Konuşulan Ama Henüz Yapılmayan

- Sistemin genel mimarisi ve büyüme vizyonu konuşuldu (arama motoru, profil sistemi, makale→quiz linkleri, SEO ağı)
- Quiz sayfalarının bağımsız sayfa olarak da çalışması gerektiği konuşuldu
- Her quiz sayfasının URL'inde "testi" yazıyor ama Google'ın gördüğü quiz deneyimi yetersiz — bu konu açıldı, çözüm konuşulmadı

### Bir Sonraki Oturuma Girmeden Önce Oku

1. Bu AKTİF DURUM bölümü
2. SİSTEM MİMARİSİ bölümü
3. `config.js` (soru setleri ve bütçe seçenekleri)

