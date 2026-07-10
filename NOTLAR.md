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
