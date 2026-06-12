# ⚠️ KRİTİK KORUMA NOTU — 12 Haziran 2026

## Quiz Sayfaları Makale İçerikleri

Tüm quiz sayfalarının altında (`</body>` sonrası, `</html>` öncesi veya `</body>` öncesinde) 
`<!-- MAKALE İÇERİĞİ — SEO -->` bloğu bulunmaktadır.

Bu içerikler **4 kez** toplu script'lerle yanlışlıkla silindi.

---

## ALTIN KURAL

**Herhangi bir toplu değişiklik yapmadan önce:**

```
hobiye-gore-hediye-bulma-testi.html içinde "bb-hakkinda" var mı kontrol et.
Yoksa DURMA — makale içerikleri silinmiş demektir.
```

---

## Silinen içeriklerin referans noktası

- Commit: `abc257d664` (8 Haziran 2026, GA4 eklemesinden hemen önce)
- O commit'te 64 sayfada makale vardı
- Restore tarihi: 12 Haziran 2026

---

## Makale İÇERMEYEN sayfalar (kasıtlı boş)

- `butceye-gore-*` sayfaları (8 adet) — bütçe sayfaları hep boş kalacak
- `sevdigi-renge-hediye-testi.html` (eski URL, kullanılmıyor)

---

## Toplu script çalıştırma kuralı

Bir script 10+ sayfayı aynı anda değiştiriyorsa:
1. Önce `hobiye-gore` sayfasında `bb-hakkinda` kontrolü yap
2. Değişikliği sadece 1 sayfada test et
3. Onay al, sonra toplu uygula
