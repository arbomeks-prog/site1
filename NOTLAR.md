# BudurBuldum — Proje Notları

Bu dosya her büyük iş bittiğinde güncellenir.
Yeni bir konuşmaya başlarken Claude bu dosyayı okumalı.

## ⛔ HER SOHBET BAŞINDA — CLAUDE BUNU OKU

TAHMİN YAPMA. KODLARI OKU. ARAŞTIR.

Bir şeyden emin değilsen önce ilgili dosyayı oku, git geçmişine bak, sonra söyle.
"Sanırım", "muhtemelen", "olmalı" deme — Demirci saatlerini harcıyor, kafadan atılan bilgiye güvenemez.

Sohbet başında yapılacaklar (sırayla):
1. Bu dosyayı oku (NOTLAR.md)
2. AKTİF DURUM bölümünü bul, son oturumda ne yapıldığını öğren
3. Ondan sonra konuş

---

## ⚠️ KRİTİK ÇALIŞMA KURALI

**Repoya ASLA sormadan push yapma.**
- "yap" veya "push et" demeden hiçbir dosya repoya atılmaz
- Demo dosyaları sadece outputs klasöründe kalır
- Canlıya almak için açık onay şart
- Bu kural her oturumda geçerlidir, istisnası yoktur


---

## 📝 MAKALE YAZIM STANDARDI — BudurBuldum

Her yeni makale yazılırken bu listeye göre çalış. Push etmeden önce kontrol listesini uygula.

### Teknik zorunluluklar
- **Title:** Arama sorgusunu içermeli, BudurBuldum adı sonda. Örnek: "Doğum Günü Hediyesi Ne Alınır? Kişiye Özel Öneriler | BudurBuldum"
- **H1:** Güçlü, arama niyetiyle örtüşen, emoji olabilir, sayfada tek olmalı
- **Meta description:** 150-160 karakter, ana arama sorgusunu + BudurBuldum'u + ne yaptığımızı içermeli, Trendyol/Hepsiburada/Amazon/N11/Çiçeksepeti platformlarına değinebilir
- **Meta keywords:** En az 5-7 anahtar kelime, sayfanın konusunu ve BudurBuldum'u kapsamalı
- **Canonical tag:** Doğru URL ile

### İçerik zorunlulukları
- **En az 2000 kelime**
- H2'ler Google'ın "diğer sorular" ve "kullanıcıların yaptığı diğer aramalar" kutularındaki sorgulara cevap vermeli — bunları önceden Google'da araştır
- Her H2'nin hemen altına `class="makale-seo-inline"` ile arama sorgularını içeren yardımcı bir satır ekle (bu satır görünür ama küçük yazılır, arama motorları için ek anahtar kelime bağlamı sağlar)
- **BudurBuldum adı minimum 50-75 kez** doğal geçmeli
- Makale boyunca BudurBuldum'un ne yaptığı anlatılmalı: kişinin yemek zevkinden spor alışkanlığına kadar sorup kişiye özel 10 hediye önerisi bulduğumuz
- BudurBuldum'u rakiplerden ayıran fark en az bir H2 ile anlatılmalı ("BudurBuldum ile Diğer Sitelerin Farkı Ne?" gibi)
- Trendyol, Hepsiburada, Amazon, N11 ve Çiçeksepeti platform olarak geçmeli
- Bütçe filtresi, ücretsizlik, üyeliksizlik mutlaka belirtilmeli
- Slogan bir yere girmeli: **"Ne alacağını bil, sonra git al."**

### Makale akış yapısı (sırasıyla)
1. Giriş paragrafı: sorunu tanımla, BudurBuldum'u tanıt
2. Quiz bloğu: testi makale içine göm, CTA butonu ile teste yönlendir
3. Bilgilendirici H2 bölümleri: Google sorgularını karşıla
4. Highlight box: "BudurBuldum Nasıl Çalışır?" özeti
5. Resimler: en az 3-4 adet, akışın içine serpiştirilmiş
6. CTA kutusu: makale ortasında veya sonunda, teste yönlendiren
7. "BudurBuldum ile fark" bölümü
8. Kapanış: BudurBuldum'a yönlendiren güçlü son paragraf + slogan

### Resimler — Gazete Formatı (Zorunlu)
- **Pexels API** kullanılır — makale-babalar-gunu.html'deki JS yapısı referans alınır
- API key: `A9apBPB9nWNWqYz5kevuQshKmKzFIwWHXBnj8nO1zot6LKpm3sq7j7mB`
- Her H2 bölümüne bir resim — soldan-sağdan dönüşümlü (float:left / float:right)
- Resim genişliği: **180px**, yükseklik: **130px**, `object-fit:cover`, `border-radius:10px`
- Her section sonunda `<div style="clear:both;"></div>` ile float temizlenir
- **Resim CSS:** `.makale-resim img { width:100%; max-width:100%; height:auto; }` — mobilde taşma engellemek için zorunlu
- **Pexels sorgu kuralı:** Kutlayan, gülen, sarılan, hediye veren GERÇEK İNSAN görselleri seç. Paket/kutu fotoğrafı seçme. İyi sorgular: `birthday party celebration confetti happy people`, `couple birthday surprise romantic happy`, `mother daughter hug birthday love`
- figcaption: Emoji + coşkulu kısa cümle (örnek: "🎉 Doğum günü coşkusu tam burada başlıyor!")

### Push etmeden önce kontrol listesi
- [ ] Kelime sayısı 2000+
- [ ] BudurBuldum 50+ kez geçiyor
- [ ] H1 var ve doğru mu
- [ ] Title arama niyetiyle örtüşüyor mu
- [ ] Description 150-160 karakter arasında mı
- [ ] Keywords yazıldı mı
- [ ] Her H2'ye gazete formatında Pexels resmi eklendi mi
- [ ] Resim sorguları gerçek insan/kutlama içeriyor mu (paket/kutu değil)
- [ ] Mobilde resim taşmıyor mu (max-width:100% CSS var mı)
- [ ] CTA butonu var mı, doğru sayfaya link veriyor mu
- [ ] Kırık link yok mu
- [ ] Canonical doğru mu
- [ ] Slogan geçiyor mu

---

## 📅 12 Temmuz 2026 — SEO Düzeltmeleri & Makale Yeniden Yazımı

### Yapılanlar

**Toplu SEO düzeltmeleri:**
- 73 sayfaya H1 tag eklendi
- 32 sayfada duplicate meta description düzeltildi
- 54 kırık internal link düzeltildi — var olmayan makale linkleri doğru quiz sayfalarına yönlendirildi

**Doğum günü makalesi komple yeniden yazıldı:**
- 2147 kelime, BudurBuldum 75+ kez geçiyor
- Google "diğer sorular" ve "kullanıcıların yaptığı diğer aramalar" sorguları H2 olarak eklendi
- H1, title, description, keywords güncellendi
- N11 ve Çiçeksepeti platform listesine eklendi
- 11 bölüme Pexels API ile gazete formatında inline resimler eklendi
- Resim sorguları coşkulu doğum günü görselleri için optimize edildi

---

## 📅 11 Temmuz 2026 — Profil Kartı & Popup UX İyileştirmeleri

### Yapılanlar

**Profil kartları konumu:**
- `arayaclar-sarici` bloğu navbar altından hero section'dan sonraya taşındı
- `sqAyraclarYenidenCiz()` çağrısı div'den sonra yapılıyor (önceden div DOM'a gelmeden çağrılıyordu, kart görünmüyordu)

**İsim popup UX:**
- Popup yatayda %50 genişliğe indirildi, sağa yaslandı (sol tarafta profil kartı görünsün)
- Overlay yarı transparan yapıldı (backdrop-filter blur)
- Popup kapanınca: önce `window.scrollTo({top:0})` → kart görünür → 2sn bekle → yumuşak scroll (900ms) aşağıya

**Çift kart sorunu düzeltildi:**
- `sqAyracSenkronEt()` kime sorusunda popup kapanmadan önce çağrılıyordu → yeni sid yaratıp ikinci kart üretiyordu
- Düzeltme: `soruId !== 'kime'` ise çağır, kime için sadece `_sqIsimKaydetVeKapat` içinde çağır

### Kritik not
- `sqAyracSenkronEt()` kime sorusu için sadece popup kapanınca (`_sqIsimKaydetVeKapat`) çağrılmalı
- Diğer tüm sorular için normal akışta çağrılıyor

---

## ⛔ MAKALE DİL KURALI

**"Yapay zeka" kelimesini makalelerde ASLA kullanma.**

Bazı kullanıcılar bu kelimeye olumsuz tepki veriyor. Bunun yerine şunları kullan:
- akıllı algoritma
- akıllı öneri algoritması
- akıllı sistem
- öneri motoru

Bu kural tüm makale sayfaları için geçerlidir. Push etmeden önce `grep -n "yapay zeka"` ile kontrol et.
