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

## ⚠️ KRİTİK ÇALIŞMA KURALI — LAYOUT/KUTU YERLEŞİMİ

**Önce kaba ama garanti iskelet, sonra estetik. Sıra asla ters çevrilmez.**

Birden fazla kutu/div yan yana (veya art arda) duracaksa:
1. Önce SABİT ölçü ver (width/height fix, `box-sizing:border-box`, gerekirse `flex-shrink:0`).
   Amaç: içerik ne olursa olsun (uzun yazı, büyük görsel, kod kayması) o kutular
   YERİNDEN OYNAMAZ, TAŞMAZ, birbirini BOZMAZ. Bu iskelet bir kere kurulur ve
   bir daha bu yüzden uğraşılmaz.
2. "Daha akıllı/responsive/esnek" çözümler (auto-grow flex, grid minmax, vs.)
   bu ilk adımdan SONRA, isteğe bağlı bir incelik olarak denenir — eğer hiç
   denenmeyecekse de sorun değil, kaba iskelet zaten görevi yapar.
3. İçindeki hizalama/sıralama (yana kaysın, kendini düzeltsin, ortalansın vs.)
   ayrı bir konudur, kutuların kendisinin SABİT DURMASIYLA karıştırılmaz.

**Neden bu kural var:** Flexbox/grid'in "akıllı" responsive özellikleri ilk
denemede genelde taşma/bozulma yaratıyor, saatlerce debug'a yol açıyor.
Kaba sabit-ölçü çözümü ilk denemede çalışıyor ve bir şablon haline geliyor
(örnek: index.html'deki makale kutuları böyle çözüldü — önce sabit div
iskeleti kuruldu, "her koyduğumuz diğerini sıkıştırsın" kuralı netleşti,
sonra üstüne estetik eklendi, bir daha o kutulara dönülmedi).

## ✅ ÇÖZÜLDÜ — Pet Resume/Kart Bozulması: Kök Neden Bulundu (29 Haziran 2026)

**Durum: ÇALIŞIYOR, kullanıcı tarafından canlıda doğrulandı.**
Güvenli nokta: `guvenli-nokta-PET-CALISIYOR-DOGRULANMIS-29haziran2026` (tag + `index-yedek-PET-CALISIYOR-29haziran2026.html`).

**Neydi:** Pet'te "Devam Et" ile resume yapıldığında scroll kaldığı yere
gitmiyordu; ayrıca her Pet denemesinde kart derin cevapları (hayvan türü,
yaş, bütçe vb.) kaybediyor/sabitleniyor gibi görünüyordu. Kullanıcı bunu
"kronik, kanser gibi" olarak tanımladı çünkü görünüşte tekrar tekrar
çıkıyordu.

**Kök neden (asıl suçlu):** `index.html`'deki kategori-arası-veri-sızıntısı
temizleme kodu (commit `5611137`, "kime" cevabı her işlendiğinde
ait-olmadığı kategori alanlarını silen kod). Bu kod, Pet'in **iki kademeli**
dallanmasını (önce "Pet ❤️" seç → sonra "Kedi/Köpek/Kuş/Balık/Küçükpet" seç)
bilmiyordu: `KIME_SET_HARITASI['Pet ❤️']` sadece `'petler'` döner, ve
`OZEL_SETLER.petler` SADECE `[pet_tur]` — tek soru. Yani "kime" cevabı HER
yeniden işlendiğinde (resume'da otomatik tekrar-gönderim dahil), bu kod
`pet_tur` zaten cevaplanmış olsa bile `kedi_yas`, `kedi_karakter`,
`kedi_butce` gibi DERİN Pet cevaplarını "bu kategoriye ait değil" sanıp
**siliyordu**. Resume-scroll bu silinen alanları "cevapsız" bulup yanlış
yere gidiyordu; kart da bu temizlenmiş veriyle kaydedildiği için derin
bilgilerini kaybediyordu.

**Nasıl bulundu:** Kullanıcının net hatırlaması sayesinde — "Pet kartına
hayvan/hediye-tercihi detayı eklenmesini istedim, ondan SONRA bozuldu."
Bu işaret, bugünün commit geçmişinde tam o noktayı (`d07e408` hemen
ardından gelen `5611137`) gösterdi. Ders: kullanıcının "şu istekten sonra
bozuldu" hatırlaması, kod okumaktan daha hızlı ve daha güvenilir bir
teşhis aracı — sıradaki oturumda da benzer bir regresyon şüphesinde önce
bu soruyu sormak ("hangi istekten/değişiklikten sonra başladı?") zaman
kazandırır.

**Çözüm (commit `002b485`):** Kategori-temizleme kodu artık, kime Pet ise
ve `pet_tur` zaten cevaplanmışsa, `petAltSetiBul()` ile gerçek alt-seti
hesaplayıp onu koruyor (DALLANMA NOKTASI 2 ve resume-scroll'da zaten
kullanılan aynı fonksiyon). Bebek/Çocuk/normal akış etkilenmedi —
onların `OZEL_SETLER` girdileri zaten tüm alt-soruları tek seviyede
listeliyor, iki-kademeli sorun sadece Pet'e özgüydü.

**Genel ders — kategori-temizleme kodu yazılırken:** Eğer bir kategori
İKİ KADEMELİ dallanıyorsa (kime → ön-seçim → asıl alt-set), "hangi
alanları koru" hesabı SADECE ilk kademeye (`KIME_SET_HARITASI`) bakarak
yapılmamalı; ikinci kademe cevabı (`pet_tur` gibi) varsa gerçek aktif
alt-seti bulan fonksiyon (`petAltSetiBul`) çağrılmalı. Bu üç ayrı yerde
(DALLANMA NOKTASI 2, resume-scroll, kategori-temizleme) aynı mantığın
tekrarlanması gerektiğini unutmamak gerekiyor — yeni bir özel set
eklenirse bu üç yerin hepsi güncellenmeli.

---

## ✅ ÇÖZÜLDÜ — Profil Kartları (profil.html VE özet sayfası popup'ı) Pet/Bebek'te Eksik Bilgi Gösteriyordu (29 Haziran 2026, devam)

**Durum: ÇALIŞIYOR, kullanıcı tarafından canlıda doğrulandı.**
Güvenli nokta: `guvenli-nokta-PET-VE-PKB-TAMAMI-CALISIYOR-29haziran2026`
(tag + `index-yedek-PKB-VE-PET-RESUME-CALISIYOR-29haziran2026.html` +
`profil-yedek-CALISIYOR-29haziran2026.html`).

Yukarıdaki kategori-sızıntı kök-fix'i canlıya alındıktan sonra kullanıcı
**iki ayrı yerde** aynı görsel sorunu fark etti: Pet kartlarında "Amaç"
kutusu hep "—" gösteriyordu, "Hediye Tercihi" hiç görünmüyordu.

**Yer 1 — `profil.html`:** `getAktifSet()` Pet'i her zaman kaba `'petler'`
döndürüyordu (gerçek alt-tür kedi/köpek/kuş/balık/küçükpet hiç çözülmüyordu),
bu yüzden "Hediye Tercihi" kutusunun okuduğu `turKey` haritası `'petler'`
diye bir anahtar bulamıyordu. Ayrıca "Amaç" kutusu Pet'te zaten anlamsız
bir alan olduğu için koşulsuz gösteriliyordu. **Çözüm (commit `01c761a`,
`0b7aaa0`):** `getAktifSet()`'e `petAltSetiBul()` eklendi (pet_tur'dan
gerçek alt-seti çözer), Amaç kutusu Pet'te (kart + düzenle paneli) gizlendi.

**Yer 2 — Özet sayfasındaki "Hediyeleri Gör" → Bütçe Sabit/Esnek popup'ı
(`index.html` içinde, `pkb` ön-ekli kod):** Bu, profil.html'in **TAMAMEN
AYRI bir kopyası** — aynı hatayı ayrıca taşıyordu, hatta daha kötü: kendi
`pkbGetAktifSet()`'i kime değerini emoji'siz tam eşleşme (`k==='Pet'`) ile
arıyordu, gerçek değer `'Pet ❤️'` olduğu için bu HİÇBİR ZAMAN eşleşmiyordu
— Pet/Bebek/Çocuk hep "normal" sanılıyordu. Ayrıca kart HTML şablonunda
Hayvan/Hediye Tercihi kutuları baştan hiç yoktu, sadece Bütçe/Amaç/Öncelik
sabit kodluydu. **Çözüm (commit `eaa7186`):** `pkbGetAktifSet()` aynı
emoji-toleranslı + `petAltSetiBul()` mantığına getirildi, karta Hayvan ve
Hediye Tercihi kutuları eklendi, Amaç Pet'te gizlendi.

**Genel ders — kopya kod tehlikesi:** Bu proje, AYNI kart mantığının
(profil.html'deki `renderKartlar`) **iki yerde elle kopyalanmış** halini
barındırıyor: `profil.html`'in kendisi ve `index.html`'in `pkb` ön-ekli
kodu. Bu yüzden profil.html'de bir hata düzeltildiğinde, ozet sayfası
popup'ındaki kopyanın AYNI hatayı hâlâ taşıdığını unutmak çok kolay —
tam da bugün olan buydu. **Eğer kart görüntüleme mantığında ileride
yeni bir değişiklik gerekirse, ikisi de (profil.html VE index.html'in
pkb kodu) güncellenmeli; biri unutulursa kullanıcı "düzelttik ama hâlâ
bozuk" deneyimi yaşar.** Uzun vadede bu iki kopyayı tek bir paylaşılan
fonksiyona indirmek (örn. bir `kart.js` dosyası, ikisi de import etsin)
düşünülebilir — şimdilik bilinçli bir borç olarak not ediliyor.

---



## ✅ TAMAMLANDI — Özet Sayfası Bütçe Popup'ı → Gerçek Profil Kartına Dönüştü
**(Bu konuşmada karar verildi, AYNI gün canlıya alındı — ec34fa3. Pet'teki
eksik bilgi sorunu ise birkaç saat sonra ayrı bir oturumda ortaya çıktı,
yukarıdaki "Profil Kartları... Eksik Bilgi Gösteriyordu" notunda anlatılan
şekilde çözüldü.)**

Eski sade "Bütçe Sabit/Esnek" popup'ı (parent-butce-overlay, index.html
~satır 2107) kaldırılıp yerine **profil.html'deki GERÇEK kartın aynısı**
(renk kodlu border-left, avatar, kart-header, kart-detaylar: Bütçe/Amaç/
Öncelik) gösterildi.

**Kesinleşen tasarım kuralı (defalarca yanlış anlaşıldı, dikkat):**
- Kartın HİÇBİR mevcut elemanı (Yeni hediye bul / Düzenle / Bu kişiyi sil
  butonları, renkler, layout) DEĞİŞTİRİLMEYECEK veya KALDIRILMAYACAK.
- SADECE 2 ekleme yapılacak: (1) tarih ("🕐 ...") kartın en altından sağ üst
  köşeye taşınacak, (2) mevcut butonların ALTINA, ayrı bir blok olarak,
  yan yana 2 yeni buton eklenecek: "Bütçe Sabit" / "Bütçe Esnek".
- Onaylanan demo dosyası: `kart-akis-demo-v4-DUZELTILMIS.html` (outputs'ta).
  Yeni bir oturumda işe başlamadan önce bu dosyanın mantığı referans alınmalı.

**Veri kaynağı (kritik, mockup/demo veri KULLANILMAYACAK):**
Bu popup, "Hediyeleri Gör" tıklandığı an açılır — bu noktada henüz resmi bir
`budurBuldumAyraclar` kaydı YOKTUR (o kayıt ancak hediyeler.html yüklenip
geri mesaj gönderince oluşur, bkz. yukarıdaki "Profil Kartı Nasıl Oluşuyor"
notu). O yüzden kart, o anki ham `localStorage.budurBuldumCevaplar` verisinden
(gerçek `getButceKey`/`getAktifSet` fonksiyonlarıyla) anlık üretilecek.

**Butonların davranışı:**
- "Bütçe Sabit" / "Bütçe Esnek" → `budurBuldumButceEsnek` flag'i yazılır,
  AYNI ANDA `budurBuldumAyraclar`'a `tamamlandi:true` kaydı eklenir (yani
  kayıt artık burada, butona basılınca oluşur), sonra `hediyeler.html`'e
  yönlendirilir — şu anki `butceSecimYapVeGit()` mantığıyla aynı, sadece
  tetikleyici UI değişiyor.
- **Mevcut butonların bu popup'taki davranışı (NETLEŞTİ):**
  - "Yeni hediye bul" → AKTİF, normal işlevini yapar (zaten hediyeler.html'e gider)
  - "Düzenle" → AKTİF, normal işlevini yapar (cevapları değiştirebilir) —
    kullanıcı merak edip basarsa kendisi için hazırlanan kartı görsün/değiştirsin
  - "🗑️ Bu kişiyi sil" → SADECE bu popup'ta PASİF/tıklanamaz (disabled).
    Sebep: ilk kullanımda kullanıcı yanlışlıkla basıp kartını silebilir.
    Silme işlevi SADECE `profil.html`'de aktif kalacak.
  - "Bütçe Sabit/Esnek" ile "Yeni hediye bul" ikisi de sonunda hediyeler.html'e
    gittiği için davranış çakışması yok, hangisine basılırsa basılsın fark etmiyor.

**Sıradaki adım (TAMAMLANDI):** Bu mantık `index.html`'in `pkb` ön-ekli
koduna (`parentKartButcePopupGoster`) işlendi, test edilip canlıya alındı.



- `index.html` → `quiz-kime.html` → quiz adımları → `ozet.html` → `hediyeler.html`
- `config.js` — ortak JS ve quiz branching mantığı
- `api/gifts.js` — xAI Grok API (grok-4.3), hediye önerileri
- `api/log-quiz.js` — quiz log
- `vercel.json` — redirect'ler ve Vercel config
- `_video-sablon.html` — video animasyonu şablonu (play butonu, ses, kayıt hazır)

## ⚠️ MİMARİ NOT — Profil Kartı NASIL Oluşuyor (İsim Şartı YOK)

**Profil kartı, isim verilmese de oluşur.** İki ayrı, birbirinden bağımsız
profil mekanizması var, ikisini birbirine karıştırmamak gerekiyor:

1. **Yerel (localStorage) ayraç sistemi — isim şartı YOK:**
   `hediyeler.html` yüklendiğinde, `hediyeler_goruntulendi` mesajı parent'a
   (`index.html`) gidince, `index.html` (satır ~1694-1712) `budurBuldumAyraclar`
   listesine `{ sessionId, kime, kisiAdi, cevaplar, tamamlandi:true }` kaydı
   ekler — `kisiAdi` boş string olsa BİLE bu kayıt eklenir. `profil.html`'deki
   `profilYukleSession()` aynı cihazda, nickname yokken, bu listeden okuyup
   kartları gösterir. **Yani aynı cihazda kart görmek için isim şartı yoktur.**

2. **Sunucu (Neon/quiz_logs) tarafındaki `save-profile` API'si — isim/nickname
   ŞART:** `hediyeler.html` satır ~600-610'da, SADECE `nickname` ya da
   `kisiAdi` varsa `/api/save-profile` çağrılır. Bu, kartın **farklı cihazdan
   da görülebilmesi** (nickname ile) veya kalıcı sunucu kaydı için gereken yol.
   İsimsiz geçilirse bu adım atlanır — ama kart yine de aynı cihazda (1.
   maddedeki yerel sistem sayesinde) görünür durmaya devam eder.

**Özet:** Aynı cihaz → isim şartı yok, kart her zaman oluşur (yerel).
Farklı cihaz / kalıcı sunucu kaydı → isim veya nickname şart.
Bu davranış DOĞRU ve KASITLIDIR, değiştirilmeyecek.

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



---

## 🟡 AKTİF DURUM — 28 Haziran 2026 (Gece Oturumu)

### Bugün Yapılanlar

**index.html HERO bölümü yenilendi** (`index-calisma.html` üzerinde çalışıldı, `index.html` dokunulmadı)

#### Çalışma sırası:
1. `index-calisma.html` oluşturuldu — `index.html`'in birebir kopyası (commit `050d75b`)
2. Hero CSS + HTML + JS üç aşamada güncellendi
3. Son push: commit `aaf79a5`

#### Yeni hero yapısı (3 sütun, `section.bb-hero`):

**Sol sütun (`hero-left`):**
- Slogan: "Hediyeyi unut." + sarı "Bana insanı anlat."
- Kalp çizgisi ayırıcı (`hero-left-divider`)
- Açıklama paragrafı ("tek sayfada" sarı vurgulu)
- 3 renkli daireli madde: Kişiye özel kart / Özelliklerini işaretle / En uygun hediyeleri bul
- Alt: sarı çerçeveli tıklanabilir kutu → `#blok-kime`'ye scroll

**Orta sütun (`hero-center`):**
- "Nasıl çalışır?" başlık + sarı çizgi
- 3'lü carousel: sol yan kart ← ana kart → sağ yan kart
- **KART YAPISI DOKUNULMADI** — ayraç sistemiyle birebir aynı dil:
  - `#1e293b` koyu arka plan
  - `#e8a838` sarı border (ana kart) / `#334155` gri border (yan kartlar)
  - Renkli avatar dairesi (AN/BA/SE, her kişi farklı renk)
  - kime + amac (Yıl Dönümü 🎂) + bütçe (sarı) + 2-kolonlu özellik tagları + sarı buton
  - Yan kartlar: aynı dil, küçük, soluk, amac+bütçe gösteriyor
- Ok butonları (manuel geçiş) + 3 nokta indikatör
- 3 adım: ikonlu, numaralı, açıklamalı (`hero-steps-row`)

**Sağ sütun (`hero-right`):**
- "Sana özel hediyeler, tek sayfada!" başlık + 🎁
- Yatay hediye kartları: fotoğraf (72×72) sol + isim/fiyat/badge/platform sağ
- "Popüler" (kırmızı) / "Yeni" (yeşil) badge
- Platform etiketleri: Trendyol/Amazon/Çiçeksepeti/Hepsiburada
- Alt: 3 güven ikonu (🔒 Bilgiler güvende / 🔄 Her zaman güncelle / 🔖 Tek kartta sakla)

**Senkron animasyon:**
- Kartlar 3 saniyede bir otomatik dönüyor (`setInterval 3000ms`)
- Manuel ok butonları da çalışıyor (`heroManuelGec`)
- Kart değişince sağdaki hediyeler + badge + platformlar aynı anda değişiyor
- Nokta indikatör aktif karta göre güncelleniyor

**Veriler (heroData):**
- Anne: Yıl Dönümü, 0-1000 TL, 6 özellik → Rose Gold Kol Saati + Aromaterapi Seti
- Baba: Doğum Günü, 1000-3000 TL, 6 özellik → Premium Alet Seti + Deri Kartlık
- Sevgili: Yıl Dönümü, 1000-3000 TL, 6 özellik → Minimal Kolye + Bluetooth Hoparlör

**Mobil:** Sağ sütun gizleniyor, tek kolon layout, sütun ayırıcılar border-bottom'a dönüşüyor.

#### Sonraki adım:
- `index-calisma.html` hanım onayından geçince `index.html` ile takas yapılacak
- Takas öncesi: `index-yedek-28haziran2026.html` yedeği alınacak

---

## 30 Haziran 2026 — Grok Prompt Orijinal Metin + searchQuery Düzeltmesi + Instagram Görseli

### 1. Grok Prompt — Orijinal Metin Testi

Sistem promptu daha önce özetlenerek yazılmıştı. Demirci'nin kendi yazdığı detaylı, uzun metnin hiç değiştirilmeden Grok'a gönderilmesi test edildi.

**Test süreci:**
- Ayrı demo API: `api/gifts-demo.js`
- Demo sayfaları: `demo-orijinal-prompt.html`, sonra tam quiz akışıyla `index-demo-prompt-testi.html` + `hediyeler-demo-prompt.html`
- Canlı site bozulmadan paralel test ortamı kuruldu
- Demirci hem Grok'a (X/Twitter) iki versiyonu karşılaştırarak danıştı, hem ~1 saat kendisi aynı profilleri hem canlı hem demo'da test etti
- Sonuç: Orijinal (uzun, insan dilinde) metin çok daha yaratıcı/beklenmedik hediyeler üretti (hap kutusu, katlanabilir şemsiye, katlanabilir baston). Grok da kendi görüşünde orijinal metinle "daha rahat ettiğini" belirtti.

**Canlıya alındı:**
- `api/gifts.js` içindeki "KİŞİYE GÖRE KURALLAR" bölümü Demirci'nin orijinal metniyle (özetlenmeden) değiştirildi.
- Genel kurallar ve bütçe kuralı (sert/sınırlayıcı versiyon) aynen korundu.
- **Yedek:** `api/gifts-yedek-30haziran2026.js`
- Commit: `d0edf9f`

### 2. searchQuery / name Uyumsuzluğu

**Tespit:** Grok hediye kartında (`name`/`description`) "hayvan figürlü yastık" gibi spesifik yazıyor ama `searchQuery`'de sadeleştirip "hayvan yastığı" yazıyor — kullanıcı linke tıklayınca tamamen farklı ürün (örn. evcil hayvan yatağı) çıkıyor.

**Kanıt:** "Fast food kolye" hediyesi gerçekten Hepsiburada'da bulunmuş (Tedz Collection Fast Food Arkadaşlık Kolyesi) — searchQuery'nin yaratıcı/spesifik olması çalışıyor, sorun sadece name-searchQuery tutarsızlığı.

**Çözüm (canlıya alındı):**
> searchQuery, name ile birebir kelime uyumlu olmalı. Kendi önerdiği hediyeyi önce aynen aramalı. Sonuç yoksa sırasıyla: figürlü → desenli → resimli → işlemeli → sembollü dene. Hiçbiri olmazsa en yakın genel alternatife geç.

Commit: `6f75b88`

### 3. Beyin Fırtınası — Karar Verilmedi, Not Olarak Duruyor

**A) 6 seçili kriterin kullanımı:**
- Şu an: 6 seçili kriter ikişerli gruplanıp sadece HEDİYE 1-2-3'e (nokta atışı) yansıyor, kalan 6 hediye seçilmeyen kriterlerden besleniyor.
- Sorun: Kullanıcının "önemli" diye seçtiği 6 kriter, üretilen 9 hediyenin 6'sında hiç görünmüyor.
- Tartışılan alternatif: 6 seçili kriterin her biri ayrı bir hediyeye tekli yansısın (6 hediye), kalan 12 şıktan 3'erli gruplanarak 4 hediye daha üretilsin.
- Risk: Tekli eşleme güvenli ama sığ olabilir (örn. "spor seviyor→spor hediyesi"). İkili eşlemenin değeri yaratıcı kombinasyondu (film+dondurma→dondurma kasesi).
- Demirci'nin gözlemi: Bazı ikili kombinasyonlar (dondurma kasesi gibi) mantık doğru ama "hediyelik değer" taşımıyor, sıradan ev eşyası gibi kalıyor.
- **Karar: Şimdilik dokunulmuyor.**

**B) Description'ların "satış dili" ile güçlendirilmesi** — tartışıldı, önceliklendirilmedi.

### 4. Bilinen Açık Bug — Tekrar Görülürse İncelenecek

Özet sayfasında (ozet.html) hediyelere bakarken sayfa kendiliğinden sıfırlanıp baştan başlama davranışı bir kez daha görüldü. Önceki gece benzer şey rapor edilmişti, ec34fa3'e geri dönülmüştü. Demirci'nin yanlışlıkla dokunma ihtimali var, kesin değil. **Sonraki görülmede ekran görüntüsü + hangi adımda olduğu not edilecek.**

### 5. Instagram Tanıtım Görseli

"En detaylı hediye bulma testi" — Demirci'nin orijinal metni (kısaltılmadan) kullanılarak hazırlandı.
- 4:5 oranı (1080x1350), gerçek PNG — Playwright ile render edildi, ekran görüntüsü/kırpma gerektirmiyor.
- Tasarım: koyu arka plan, turuncu/kırmızı vurgular, madde işaretli liste + kapanış + büyük "budurbuldum.com" + "👆 Linki bio'da".
- Not: Bebas Neue offline ortamda yüklenemedi (sandbox'ta fonts.googleapis.com erişimi yok), Arial Black ile değiştirildi.

### Git Commit Geçmişi (Bugün)
```
04c15d0 Demo: orijinal prompt testi - tam quiz akisiyla
d0edf9f Grok prompt: orijinal metin canli sisteme alindi (yedek: gifts-yedek-30haziran2026.js)
6f75b88 Prompt: searchQuery-name uyumu ve figürlu/desenli/resimli fallback kurali
```

### Geri Dönüş Noktaları
- `api/gifts-yedek-30haziran2026.js` — bugünkü değişiklikler öncesi gifts.js
- `index-demo-prompt-testi.html` + `hediyeler-demo-prompt.html` — orijinal prompt test ortamı (canlıyı etkilemez)
- `api/gifts-demo.js` — demo API (canlıyı etkilemez)

---

## Instagram Gönderileri Nasıl Yapılacak (Yöntem Notu — 30 Haziran 2026)

### Format kuralı
- **Story / Reels** → 9:16 oranı (1080x1920) — geçici içerik
- **Feed gönderisi (post)** → 4:5 oranı (1080x1350) — kalıcı, profilde duran içerik
- İkisi karıştırılmamalı, hangisi istenirse net belirtilmeli.

### Metin kuralı — ÇOK ÖNEMLİ
Demirci'nin yazdığı reklam/tanıtım metni **hiçbir kelimesi değiştirilmeden, kısaltılmadan, özetlenmeden** kullanılacak. Görsele konacak başlık dahil — örn. "EN DETAYLI TEST" gibi kısaltma YASAK, "EN DETAYLI HEDİYE BULMA TESTİ" gibi Demirci'nin yazdığı tam hali kullanılacak. Tasarımda (renk, kutu, boşluk) değişiklik yapılabilir ama metin asla kısaltılmaz.

### Üretim yöntemi — DOĞRU OLAN YOL
**HTML dosyası verip ekran görüntüsü aldırmak YANLIŞ** — tarayıcı arayüzü (adres çubuğu, sekmeler) görüntüye karışıyor, oranlar telefon ekranına göre bozuluyor, Demirci'nin kendi kırpması gerekiyor. Bu çok vakit kaybettirdi, bir daha yapılmayacak.

**DOĞRU YÖNTEM:** Playwright ile doğrudan PNG dosyası üretilecek:
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1080, "height": 1350})  # 4:5 için
    page.goto("file:///tam/yol/dosya.html")
    page.wait_for_timeout(300)
    page.screenshot(path="cikti.png")
    browser.close()
```
- Feed için viewport: 1080x1350 (4:5)
- Story için viewport: 1080x1920 (9:16)
- Çıktı doğrudan PNG — Demirci galeriye indirip kırpmadan, ekran görüntüsü almadan direkt Instagram'a yükleyebiliyor.

### Font kısıtı (sandbox ortamı)
Bu ortamda **internet erişimi sınırlı** (sadece belirli domainler: github, npm, pypi vb.), `fonts.googleapis.com` erişilemiyor. Yani Google Fonts (Bebas Neue, Nunito vb.) `<link>` ile çağrılırsa **yüklenmiyor**, tarayıcı sessizce varsayılan fonta düşüyor ve tasarım bambaşka görünüyor. Bu yüzden:
- Google Fonts linki KULLANILMAYACAK.
- Yerine sistemde hazır bulunan kalın/iddialı fontlar kullanılacak: `'Arial Black', Arial, sans-serif` (başlıklar için), `'Helvetica Neue', Arial, sans-serif` (gövde metni için).
- Görsel olarak Bebas Neue'nin yerini tam tutmaz ama kalın/dikkat çekici görünüm sağlıyor, kabul edilebilir seviyede.

### Boyut/taşma kontrolü
İçerik tasarlarken önce normal boyutlarla yazılıp sonra hedef kutuya (1350px ya da 1920px yüksekliğe) sığıp sığmadığı kontrol edilmeli. Eğer içerik kutudan daha uzunsa:
- **Çözüm 1:** Yazı boyutlarını küçültüp kutuya sığdırmak (genelde tercih edilen, okunabilirlik bozulmuyorsa sorun değil).
- **Çözüm 2:** Format değiştirip Story'ye (9:16, daha uzun kutu) geçmek — bu durumda orijinal yazı boyutları hiç küçültülmeden sığabilir.
- **YANLIŞ olan:** "Boşluk ekleyerek küçültmeden sığdırmak" — bu sadece içerik kutudan KISA olduğunda işe yarar. İçerik kutudan UZUNSA boşluk eklemek matematiksel olarak çözüm olmaz (boşluk sadece kutuyu büyütür, küçültmez). Bu konuda bir oturumda yanlış anlama olmuştu, not edildi.

### Genel akış (bundan sonra hep böyle yapılacak)
1. Demirci'nin tam/kısaltılmamış metnini al.
2. Format sor/teyit et (Story 9:16 mı, Feed 4:5 mü).
3. HTML+CSS ile tasarımı yap (Google Fonts kullanmadan, sistem fontlarıyla).
4. Playwright ile doğru viewport boyutunda PNG üret.
5. İçerik taşıyor mu kontrol et (gerekirse 4. adımdan önce font/spacing ayarla).
6. PNG'yi `/mnt/user-data/outputs/`'a koy, present_files ile göster.
7. Demirci'ye direkt galeriden Instagram'a yükleyebileceğini söyle — ekran görüntüsü veya kırpma gerekmiyor.

---

## ✅ CANLI — Hediye Kutuları Alta Yaslandı + Mini Profil Kartı (30 Haziran 2026)

**Durum: CANLI.** Commit: `1c34402`. Geri dönüş: `index-yedek-mini-kart-oncesi-30haziran2026.html`.
Demo dosyası referans için repoda duruyor: `index-demo-mini-kart.html` (artık index.html ile aynı içerikte, ayrıca dokunulmadı).

**Süreç:** Önce `index-demo-mini-kart.html` adıyla ayrı bir demo kopyasında geliştirildi,
birkaç tur ekran görüntüsüyle test edilip onaylandıktan sonra (üst boşluk ayarı dahil
birkaç ince ayar turu) doğrudan `index.html` üzerine kopyalanarak canlıya alındı.

**Ne değişti:**
- `.gift-col` (sağdaki hediye kutuları + "↑ BAŞA DÖN") artık `top:50%` ile dikeyde
  ortalanmıyor, `bottom:10px` ile ekranın altına, adres çubuğunun çıktığı yere kadar
  yaslı duruyor. Bu, üstte boş bir alan açtı.
- O boş alanda, "kime" sorusu cevaplandığı anda **mini bir profil kartı** beliriyor
  (`#sq-mini-kart`, gift-col içinde hediye kutularının üstünde, ilk eleman olarak).
  Başlıkta kime değeri yazıyor (örn. "Anne", "Baba" — emoji temizlenmiş hali).
- Kullanıcı her soruyu cevapladıkça (kime hariç, kime zaten başlığa yazılıyor), o
  cevabın değeri kartın içindeki listeye (`#sq-mini-kart-liste`) ekleniyor — kullanıcı
  cevaplarının kartta biriktiğini canlı görüyor. Liste otomatik en alta scroll oluyor
  ki en son cevap hep görünür kalsın.
- Kartın TAMAMI (başlık + liste) `max-height:21vh` ile sınırlı — cihaz ekranına göre
  orantılı büyüyor ama asla ekran dışına taşıp başlığı (örn. "Baba") kesmiyor. Başlık
  `flex-shrink:0` ile sabit, sadece liste kısmı kendi içinde scroll oluyor (`flex:1`).
  21vh değeri birkaç ekran görüntüsü turu sonrası netleşti (önce 90px → 170px → 30vh →
  24vh → 21vh, hep "başlık ekranın dışına taşmasın" dengesini ararken).

**Teknik fonksiyonlar (index.html içinde):**
- `sqMiniKartBaslat(kimeDegeri)` — kime cevaplanınca kartı açar, başlığı yazar.
- `sqMiniKartEkle(deger)` — her cevaptan sonra listeye yeni satır ekler, en alta kaydırır.
- Çağrı noktaları: kime dallanmasında (`cevaplananlar['kime']=true` sonrası),
  ana `soru_cevaplandi` postMessage handler'ında (kime hariç tüm sorular, tek merkezi
  nokta: localStorage yazımından hemen sonra), ve `dogumSec()` fonksiyonunda (burç
  sorusu ayrı bir fonksiyon olduğu için orada da ayrıca çağrılıyor).

**Genel ders:** Bu özellik önce izole bir demo dosyasında geliştirilip onaylandı, SONRA
canlıya kopyalandı. Demo dosyası ile canlı index.html arasındaki fark `git diff` ile
kontrol edilip sadece istenen eklemelerin olduğu doğrulandıktan sonra kopyalama yapıldı
— bu sıra (demo → onay → fark kontrolü → canlıya kopyalama) güvenli ve hızlı çalıştı,
gelecekte benzer büyük UI değişikliklerinde tekrar kullanılabilir bir model.

---

## 💡 BİRİKEN İŞ LİSTESİ — "Sürpriz Havuzu" (30 Haziran 2026, sohbet sonrası)

**Vizyon (Demirci'nin kendi cümleleriyle, ÖNEMLİ — sapılmayacak ana fikir):**
Site sıradan bir "30 soruluk hediye testi" gibi hissettirmemeli. Statik quiz algısını
kıracak, kullanıcının her seferinde farklı, tahmin edilemez (Demirci'nin kendisinin bile
"bu sefer ne çıkacak" diye merak edeceği kadar rastgele) küçük sürprizlerle karşılaşacağı
**bir formata** dönüşmeli. Amaç: kullanıcı "hediye bulma sitesine giriyorum" değil,
"eğlenceli bir siteye giriyorum, hediye de buluyorum" hissiyle gelsin. Hediye bulmak bu
eğlencenin bir yan etkisi haline gelmeli. Mini profil kartı (yukarıdaki bölüm) bu
vizyonun ilk somut adımıydı ve çok beğenildi — "statik quiz algısını kırdı" dendi.

**Üretim ritmi kararı:** Her şeyi bir oturumda bitirmeye çalışmayacağız. Günlük/düzenli
küçük üretim ritmiyle (reklam/tanıtım materyali üretimiyle aynı mantık — günde 2 tane
gibi) bu listeden parça parça alıp demo'da test edip onaylanınca canlıya alacağız.
Zamanla büyüyen bir havuz — 1 ay sonra 60 farklı sürpriz olsa az değil, çok bile sayılmaz,
çünkü çeşitlilik arttıkça tahmin edilemezlik gücü artıyor.

**Tasarım prensipleri (her yeni sürpriz fikri eklenirken bunlara uysun):**
- Tamamen rastgele, öngörülemez — sabit bir maskot/karakter kimliği ZORUNLU DEĞİL,
  kaotik çeşitlilik bilinçli tercih (Disney karakterinden konuşan kutuya, Clippy tarzı
  düşünce balonundan klişe-küstah pop-up'a kadar her şey aynı havuzda olabilir).
- Çok sık olmasın — sıklık arttıkça sürpriz olmaktan çıkar, rutine döner. Kaba kural:
  30 sorulu ana akışta toplam 4-6 tetiklenme (rastgele dağılmış, art arda gelmesin).
- Görsel ağırlıklı, CSS animasyonlu (transform/opacity) — canvas/parçacık kütüphanesi
  gibi ağır şeylerden kaçın, mobil performans riski (NOTLAR'daki video/ses uyumluluk
  sorunları örnek alınmalı, agresif olmayalım).
- Sadece quiz soruları değil, SİTENİN HER KÖŞESİNE yayılabilir: butonlar (Devam Et,
  Başa Dön, Yeni hediye bul), popup'lar, loading anları — her tıklama potansiyel bir
  sürpriz anı.
- Zorunlu bekleme anları (loading/spinner gibi) sürprize çevrilebilir — zaten kullanıcı
  bekliyor, ekstra zaman kaybı yaratmadan eğlenceye dönüştürülebilir.

**Havuz için biriken somut fikirler (henüz YAPILMADI, sırayla denenecek):**

1. **Paraşütçü** — ekranın üst köşesinden çapraz süzülerek geçen bir figür (emoji ya da
   basit SVG), ortada kısa bir düşünce balonu beliriyor, alt köşeden çıkıp kayboluyor.
   Mesaj havuzu karışık: bazen bilgilendirici ("X soru kaldı"), bazen tamamen alakasız/
   gündelik ("naber, nasılsın" gibi) — amaç ciddi quiz modunu birden bozan bir samimiyet.
2. **Geçip giden diğer karakterler** (aynı paraşütçü kalıbı, farklı yüzler) — uçan kuş
   ("ben de hediye arıyorum" gibi bir laf), sessizce geçen kedi (sadece "miyav" sesi),
   sürüklenen bulut (içinde "az kaldı" yazısı), zıplayan kargo kutusu ("ben de geliyorum
   birazdan" — ürünle ilgili gönderme).
3. **Clippy-tarzı düşünce balonu asistanı** — belirli davranışlarda tetiklenir: kullanıcı
   bir soruda uzun süre cevap vermeden duruyorsa, geri gidip cevap değiştiriyorsa, ya da
   çok hızlı art arda cevap veriyorsa, küçük bir karakter belirip şakacı bir laf ediyor.
4. **Karşılama/yönlendirme pop-up'ı** — siteye ilk girişte (ya da rastgele), küstah-şakacı
   tonda bir pop-up çıkıp kullanıcıyı doğru yere yönlendiriyor (örnek replik: "kime
   alınıyor onu bilmiyorsan niye bizi meşgul ediyorsun" gibi), işaret oku basılacak yeri
   gösteriyor, sonra kayboluyor. Rastgele havuzdan farklı küstah/tatlı repliklerle.
5. **Mikro-tepkiler her tıklamada** — örnek: profil kartında "Devam Et"e basınca "ay yyyy
   yavaş ol, gidiyoruz aşağıya" gibi anlık, beklenmedik bir tepki (yazı + belki kısa ses
   efekti, konuşma sentezi DEĞİL, kayıtlı kısa ses dosyaları olabilir).
6. **"Geçmişe dönüş" hipnoz sahnesi** — şu an küçük/sessiz duran "10 HEDİYE HAZIRLANIYOR"
   yükleme anı (kart popup'ında, ayraç/resume akışında), tüm ekranı kaplayan, ortada
   büyük dönen hipnotize edici bir göz/spiral + altında büyüyüp küçülen "Geçmişe
   dönüyoruz... dönüyoruz... dönüyoruz..." yazısı, ~3 saniye sürüp normal akışa geçiyor.
   NOT: bu özel an (geçmişe dönüş) için sabit mi olacak yoksa o da rastgele havuzdan biri
   mi olacak — karar verilmedi, sırası gelince konuşulacak.
7. **Konfeti/parçacık patlaması, kartın parlaması, beklenmedik emoji animasyonları** —
   daha önce konuşulan, henüz detaylandırılmamış genel fikirler, havuza dahil.

**Sıradaki adım:** Bu listeden Demirci hangisini önce denemek isterse (ya da günlük
ritimde sırayla), her biri ÖNCE ayrı bir demo dosyasında yapılıp test edilecek, onay
alınınca (mini kart örneğindeki gibi) canlıya kopyalanacak. Hiçbiri tek oturumda hepsi
birden yapılmaya çalışılmayacak — küçük adımlarla, düzenli ritimde ilerlenecek.

**Önemli ek fikir — sürpriz = reklam materyali:** Her sürpriz canlıya alınıp
oturduktan sonra, kendi reklam/tanıtım hook'u haline gelebilir. Örnek: paraşütçü
özelliği oturunca, Instagram reklamında "Hiç paraşütçüden hediye aldın mı?" gibi bir
başlık kullanılabilir — meraklı kişi tıklayıp siteye girdiğinde gerçekten o paraşütçüyü
görür, reklam ile ürün arasında nadir bir tutarlılık/şaşırtma kombinasyonu oluşur. Yani
sürpriz havuzundaki her yeni özellik aynı zamanda potansiyel bir reklam materyali —
bu ikisi (sürpriz üretimi + reklam üretimi) birbirini besleyen, paralel ilerleyen iki
iş olarak düşünülmeli, ayrı ayrı değil.



---

## 1 Temmuz 2026 — Affiliate / API Araştırması + Platform Buton Demosu

### Affiliate Ağı Araştırması

Uzun bir araştırma oturumu yapıldı. Özet:

**GelirOrtakları:**
- Türkiye'nin en köklü affiliate ağı, 500+ yerli marka (Trendyol, Hepsiburada, Çiçeksepeti, N11 dahil)
- Ürün verisi XML/GoFeed sistemiyle sunuluyor — modern REST API değil, günlük güncellenen XML feed
- Yayıncı başvurusu ücretsiz, kriterler esnek (çalışan site + dürüst içerik yeterli)
- Trendyol gibi markalar GelirOrtakları paneli üzerinden ayrıca onaylanıyor
- Sonuç: Türk pazarı için doğru yer ama API değil XML — kendi Neon DB'ye günlük çekip indeksleme gerekir

**Admitad:**
- Modern REST API var (OAuth token, JSON), `api.admitad.com` üzerinden
- "products" endpoint'i mevcut ama canlı arama mı, feed mi — net doğrulanamadı (JS render sorunu)
- Türkiye sayfasında 196 reklamveren var ama hepsi global markalar (Trip.com, iHerb, AliExpress vs.)
- Trendyol / Hepsiburada Admitad'de bulunamadı — bunlar GelirOrtakları'nda
- Sonuç: API teknik altyapısı daha iyi ama bizim hedef markalar orada yok

**Trendyol direkt API:**
- Trendyol'un kendi API'si sadece pazaryerinde mağazası olan satıcılara (seller) açık
- Affiliate'lere özel ürün arama API'si yok — manuel link oluşturma paneli var
- Trendyol affiliate programı şu an sadece sosyal medya kanallarından başvuru kabul ediyor

**Amazon US Affiliate:**
- Türkiye'den başvuru yapılabilir
- Şart: 180 gün içinde 3 nitelikli satış — Türk kullanıcıyla zor
- Amazon TR ise davet bazlı, self-servis başvuru yok (GelirOrtakları üzerinden başvurulabiliyor)

**Sonuç:** Şu an için GelirOrtakları en mantıklı seçenek. Trafik gelince başvuru yapılacak.

---

### İngilizce Site Fikri — Önemli Vizyon Notu

Pazar araştırması yapıldı. Tüm İngilizce AI hediye bulma rakipleri (Pickify, GiftX, SmartGiftAI, Giftruly, Gift Goat, Finder of Gifts, GiftList Genie) **5-7 soruluk, 30 saniyelik** yüzeysel araçlar.

**Bizim gerçek farkımız iki şey:**
1. **Derinlik:** 21+ soru, kategoriye özel dallanan quiz sistemi — bu pazarda yok
2. **Kalıcı profil + sınırsız yeniden üretim döngüsü:** Profili bir kere oluştur, istediğin kadar "Yeni Hediye Bul"a bas, her seferinde farklı öneriler al — bu da pazarda yok (GiftX "öneriyi kaydet/paylaş" yapıyor, ama "aynı profilden sınırsız yeni öneri" değil)
3. **Yarım kalan aramaya dön / profil sayfası** — bu da pazarda yok
4. **Sürpriz havuzu / eğlence katmanı** — bu da pazarda yok

Freudly (71 soru) hediye bulucu değil, psikoloji/kişilik testi formatında — kategori karışıklığı yapılmamalı.

**Karar:** İngilizce versiyon ileride güçlü bir seçenek, ama önce Türkçe site oturmalı. Gelecek için not olarak duruyor.

---

### Platform Buton Demo (hediyeler.html)

**Sorun:** Hediye kartlarındaki platform etiketleri (Trendyol, Hepsiburada, Amazon, Çiçeksepeti, N11) küçük/flat görünüyor, kullanıcı tıklanabilir olduğunu anlamıyor.

**Çözüm önerisi:** `.plt-link` stilini quiz `option-btn`'e benzer — 3D görünümlü, alt border + gölge + hover/active efektli — düğme haline getir.

**Demo:** `hediyeler-demo-plt-btn.html` outputs'a konuldu, onay bekleniyor.
Değişiklik sadece şu 3 CSS satırı:
```css
.plt-link { font-size: 13px; font-weight: 700; padding: 9px 16px; border-radius: 12px; text-decoration: none; transition: all 0.15s ease; display: inline-block; border-bottom: 4px solid rgba(0,0,0,0.25); border-right: 3px solid rgba(0,0,0,0.15); box-shadow: 2px 3px 6px rgba(0,0,0,0.18); cursor: pointer; }
.plt-link:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 2px 4px 10px rgba(0,0,0,0.22); }
.plt-link:active { transform: translateY(2px); border-bottom-width: 2px; box-shadow: 1px 1px 3px rgba(0,0,0,0.15); }
```
Onaylanırsa `hediyeler.html`'deki eski 2 satır bu 3 satırla değiştirilecek, başka hiçbir şeye dokunulmayacak.

---

## 🟡 AKTİF DURUM — 1 Temmuz 2026 (Gece Oturumu)

### Bugün Yapılanlar

**1. Platform butonları güncellendi (hediyeler.html)**
- `.plt-link` stiline 3D efekt eklendi: `border-bottom`, `border-right`, `box-shadow`, hover/active animasyonu.
- `::after` ile buton boyutu değiştirmeden altına "tıkla · seç" yazısı eklendi (CSS only, HTML'e dokunulmadı).
- Commit: `3e1f9a8`

**2. Alışveriş platformu URL parametreleri eklendi (hediyeler.html)**
- Trendyol: `&st=SEARCH` — organik sıralama ağırlıklı, reklamlar aşağıya iniyor.
- Hepsiburada: `&listing=1` — benzer etki.
- Amazon: `&s=relevancerank` — alaka sıralaması.
- Test süreci: önce `hediyeler-calisma.html` + `index-calisma.html` ikilisiyle denendi, onaylanınca canlıya alındı.
- Commit: `5aa8a4f`

**3. Grok prompt kuralları güncellendi (api/gifts.js)**
- "projektör" yerine "projeksiyon cihazı" kullan.
- Cinsiyet ayrımı olan ürünlerde searchQuery'e "erkek"/"kadın" ekle.
- Kitap aramalarında searchQuery'e "yetişkin" ekle.
- Burç aramasında "burç kolyesi" değil doğrudan burç adını kullan (örn. "Oğlak kolye").
- Müze kartı/konser bileti/etkinlik girişi önerme — bunlar alışveriş sitelerinde yok. Bunların yerine: Netflix/Spotify/YouTube Premium hediye kartı, Steam/Xbox/PlayStation kodu, Adobe/Canva Pro aboneliği, sanat temalı fiziksel ürünler öner. searchQuery'de "hediye kartı" veya "dijital kod" olarak ara.
- Commit: `5aa8a4f`, `d437bd9`

### Test Dosyaları (repoda duruyor)
- `hediyeler-calisma.html` — URL parametre test ortamı (canlıya alındı, dosya silinmedi)
- `index-calisma.html` — hediyeler-calisma.html'e yönlendiriyor (test bitti, geri alınmadı)

### Bir Sonraki Oturuma Not
- `index-calisma.html` hâlâ `hediyeler-calisma.html`'e yönlendiriyor — gerekirse `hediyeler.html`'e geri alınabilir.

---

## 🟡 AKTİF DURUM — 1 Temmuz 2026 (Gece Oturumu Devamı)

### Prompt İnce Ayarları (api/gifts.js)

**Sorun → Çözüm sırası:**

1. **Backtick syntax hatası** — prompt içinde `name` kelimesi backtick ile yazılmıştı, JS'i patlattı. Düzeltildi. Commit: `bb0e75c`

2. **Hayali ürün yasağı güçlendirildi** — "Dijital Yemek Tarifi Cihazı" gibi birleşik hayali kategoriler örnek verilerek yasaklandı. Commit: `fba8be4`

3. **Cinsiyet bilgisi name/description'a yazılmasın** — "erkek dışı kadın cilt bakım seti" gibi garip ifadeler çıkıyordu. name ve description alanlarına cinsiyet bilgisi yazma kuralı eklendi. Commit: `5c1e5c2`

4. **Türkçe kelime sırası** — "cilt seti" değil "cilt bakım seti" yazılsın kuralı eklendi. Commit: `5c1e5c2`

5. **"Yetişkin" kelimesi daraltıldı** — sadece roman/hikaye/edebiyat aramalarında kullanılsın, yemek kitabı/hobi kitabı gibi kategorilerde kullanılmasın. Commit: `af0ed0f`

6. **Tarz/tema kelimeleri yasak değil** — "Sıfat ve marka yasak" kuralı Grok'un "rap" gibi tarz kelimelerini de atmasına yol açıyordu. Kural netleştirildi: renk/boyut sıfatları ve marka adları yasak, rap/rock/vintage gibi tarz kelimeleri searchQuery'de mutlaka korunmalı. Commit: `7898cfa`

### Genel Gözlemler (bu oturumdan)

- Grok bazen hediyeyi doğru buluyor ama searchQuery'yi standartlaştırıp tarzı düşürüyor — kural var ama dinlemiyor, sürekli takip gerekiyor.
- 9 hediye × 5 platform = 45 seçenek sunuluyor, biri tutmasa diğeri tutuyor. API olmadan mevcut en iyi çözüm bu.
- N11 mobilde siyah ekrana düşme sorunu bizimle ilgili değil, N11'in kendi yükleme davranışı.

---

## 🟡 AKTİF DURUM — 1 Temmuz 2026 (Sabah Oturumu Devamı)

### Dijital Saat + Fotoğraf Zemin Demosu (index-saat-demo.html)

**Saat animasyonu:**
- `soru-no` yazıları (`1. SORU`, `2. SORU` vb.) kaldırıldı, yerine sol üste dijital saat eklendi.
- Saat 02:00'dan geri sayıyor. Altında 30'dan başlayan soru sayacı var.
- Her `soru_cevaplandi` mesajında sayaç 1 azalıyor.
- Quiz'in ilk sorusu görününce (IntersectionObserver) saat başlıyor.
- Demo: `index-saat-demo.html`. Onay bekleniyor.

**Fotoğraf zemin:**
- Her sorunun üçerli fotoğraf grubundaki her fotoğraf ayrı ayrı `box-shadow:0 4px 14px rgba(0,0,0,0.45)` zeminine oturtu.
- `overflow:hidden` sorunu nedeniyle shadow dışarı çıkmıyordu — her fotoğraf `div`'i dış wrapper ile sarıldı, shadow o wrapper'da.
- Demo'da uygulandı, onay bekleniyor. Commit: `a08417f`

### Bütçe Listesi Senkronizasyonu

- `profil.html` artık `config.js`'i import ediyor — `BUTCE_OPT` dinamik olarak config'den okunuyor, elle güncellemeye gerek yok.
- `index.html` pkb bütçe listeleri de config ile eşitlendi.
- Commit: `42de3c0`

### Bekleyen (onay alınmadı)
- Dijital saat + fotoğraf zemin → index.html'e taşımak için onay bekleniyor.

---

## 🟡 AKTİF DURUM — 3 Temmuz 2026

### Bugün Yapılanlar

**1. Burç searchQuery kuralı düzeltildi (api/gifts.js)**
- Eski kural yanlıştı: "Oğlak burcu kolye" değil "Oğlak kolye" yaz diyordu.
- Doğrusu tam tersi — burç adı + "burcu" + ürün formatı Trendyol'da doğru sonuç veriyor.
- Yeni kural: "Oğlak kolye" değil "Oğlak burcu kolye", "Terazi duvar saati" değil "Terazi burcu duvar saati" yaz.
- Commit: `5966064` (yedek geri yüklenirken bu düzeltme de içinde kaldı)

**2. Sistem promptu boşaltma deneyi yapıldı**
- Tüm sistem promptu kaldırılıp sadece "Sadece JSON array döndür" bırakıldı.
- Sonuç: Grok kendi başına çok kötü hediye üretiyor — "dram filmleri seti" searchQuery ile Trendyol'da bıçak ve bikini çıktı.
- "Önce web'de gerçekten satılan ürünleri ARA" komutu olmayınca Grok kafadan üretiyor.
- Yedek: `gifts-yedek-prompt-oncesi-3temmuz2026.js` (repo kökünde)
- Prompt orijinal haline geri yüklendi. Commit: `5966064`

**3. Grok'un kendi seçim yapması deneyi (ozet-ozgur2 + hediyeler-ozgur2)**
- buildPrompt tamamen basitleştirildi — 6 kriter seçimi/gruplama kaldırıldı, tüm quiz cevapları düz metin olarak Grok'a gönderildi.
- ozet-ozgur2.html'de kriter seçim zorunluluğu kaldırıldı, buton her zaman aktif.
- Sonuç: Kötü. Grok yine aynı sorunları yaşadı — searchQuery kalitesi düştü, yanlış ürünler çıktı.
- Demo dosyaları repoda duruyor (hediyeler-ozgur2.html, ozet-ozgur2.html) — canlıya alınmadı.

### Önemli Öğrenme

- Grok sistem promptu olmadan çalışamıyor — her kural acı deneyimden çıkmış, gerekli.
- Grok kendi başına cevaplar arasındaki bağlantıyı kuramıyor (doğa+dışarıda+dışadönük → outdoor profili gibi).
- Kişiselleştirme ile çeşitlilik birbiriyle çelişiyor — ne kadar kişiselleştirirsen o kadar tek yöne gidiyor.
- Soruların tek boyutlu (evet/hayır seviyesi) olması bir kısıt ama daha derin soru = daha az kullanıcı tradeoff'u var.
- Scraping 5 site için imkansız; kısa vadede en doğru yol GelirOrtakları affiliate (trafik gelince).

### Konuşulan Ama Yapılmayan
- Doga sorusu "doğa yürüyüşü yapar mı" yerine daha geniş kapsamlı bir soruya dönüştürülmesi — soru başlığı netleşmedi, ertelendi.
- Chip listesini temizleme (güçlü kriterler vs. arka plan bağlamı) — trafik gelince kullanıcı verisiyle karar verilecek.
