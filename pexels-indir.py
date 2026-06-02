#!/usr/bin/env python3
"""
BudurBuldum — Pexels Fotoğraf İndirici
Çalıştır: python3 pexels-indir.py
Fotoğraflar gorseller/ klasörüne kaydedilir.
"""

import os
import re
import json
import time
import urllib.request
import urllib.parse

PEXELS_KEY = 'A9apBPB9nWNWqYz5kevuQshKmKzFIwWHXBnj8nO1zot6LKpm3sq7j7mB'
CIKTI_KLASOR = 'gorseller'
ESLESME_DOSYA = 'gorseller/eslesme.json'

os.makedirs(CIKTI_KLASOR, exist_ok=True)

def sorgu_dosya_adi(sorgu, orientation):
    temiz = re.sub(r'[^a-z0-9]+', '-', sorgu.lower().strip())[:50]
    return f"{temiz}-{orientation[:1]}.jpg"

def pexels_indir(sorgu, orientation='landscape'):
    dosya_adi = sorgu_dosya_adi(sorgu, orientation)
    dosya_yolu = os.path.join(CIKTI_KLASOR, dosya_adi)
    
    if os.path.exists(dosya_yolu):
        print(f"  ⏭ Zaten var: {dosya_adi}")
        return dosya_adi

    url = f"https://api.pexels.com/v1/search?query={urllib.parse.quote(sorgu)}&per_page=1&orientation={orientation}"
    req = urllib.request.Request(url, headers={'Authorization': PEXELS_KEY})
    
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
        
        if not data.get('photos'):
            print(f"  ❌ Bulunamadı: {sorgu}")
            return None
        
        foto = data['photos'][0]
        foto_url = foto['src']['large'] if orientation == 'landscape' else foto['src']['medium']
        
        urllib.request.urlretrieve(foto_url, dosya_yolu)
        print(f"  ✅ İndirildi: {dosya_adi}")
        time.sleep(0.3)  # API rate limit
        return dosya_adi
        
    except Exception as e:
        print(f"  ❌ Hata ({sorgu}): {e}")
        return None

# Tüm HTML dosyalarındaki sabit Pexels sorgularını bul
def sorgu_topla():
    sorgular = []
    pattern = re.compile(r"pexels\.com/v1/search\?query=([^&'\"\\]+)[^'\"\\]*orientation=([^'\"\\&)]+)")
    
    for dosya in os.listdir('.'):
        if not dosya.endswith('.html'):
            continue
        try:
            icerik = open(dosya, encoding='utf-8').read()
        except:
            continue
        
        for m in pattern.finditer(icerik):
            sorgu_raw = m.group(1).strip()
            orientation = m.group(2).strip().split("'")[0].split('"')[0]
            
            # Dinamik olanları atla
            if any(x in sorgu_raw for x in ['encodeURIComponent', '${', "'+", "+'", 'h2[', 'h.query', 'dc.q', 'cleanQuery']):
                continue
            
            sorgu = urllib.parse.unquote_plus(sorgu_raw.replace('+', ' '))
            if sorgu and (sorgu, orientation) not in [(s['sorgu'], s['orientation']) for s in sorgular]:
                sorgular.append({'sorgu': sorgu, 'orientation': orientation, 'dosya': dosya})
    
    return sorgular

print("🔍 Sorgular toplanıyor...")
sorgular = sorgu_topla()
print(f"  {len(sorgular)} sorgu bulundu\n")

eslesme = {}
for i, s in enumerate(sorgular, 1):
    print(f"[{i}/{len(sorgular)}] {s['sorgu']} ({s['orientation']})")
    dosya_adi = pexels_indir(s['sorgu'], s['orientation'])
    if dosya_adi:
        anahtar = f"{s['sorgu']}|{s['orientation']}"
        eslesme[anahtar] = dosya_adi

# Eşleşme tablosunu kaydet
with open(ESLESME_DOSYA, 'w', encoding='utf-8') as f:
    json.dump(eslesme, f, ensure_ascii=False, indent=2)

print(f"\n✅ Tamamlandı! {len(eslesme)} fotoğraf indirildi.")
print(f"📁 Klasör: {CIKTI_KLASOR}/")
print(f"📋 Eşleşme tablosu: {ESLESME_DOSYA}")
