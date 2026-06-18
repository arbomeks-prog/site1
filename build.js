#!/usr/bin/env node
// ============================================================
// BudurBuldum Build Script
// build-data.json + quiz-template.html → 71 quiz HTML dosyası
// Kullanım: node build.js
// ============================================================

const fs = require('fs');
const path = require('path');

// Config.js'i oku - soru tanımları burada
const { QUIZ_CONFIG } = require('./config.js');

// Dosyaları oku
const buildData = JSON.parse(fs.readFileSync(path.join(__dirname, 'build-data.json'), 'utf8'));
const template = fs.readFileSync(path.join(__dirname, 'quiz-template.html'), 'utf8');
const dogumExtra = fs.readFileSync(path.join(__dirname, 'burcuna-gore-hediye-bulma-testi.html'), 'utf8');

// Config.js'den IS_MULTI ve MAX_SECIM bilgisini al
const MULTI_SORULAR = { hobiler: 2 };

// Tüm soru setlerinden soru listesi oluştur
function getAllSorular() {
    const sets = ['sorular','soruBebekler','soruCocuklar','soruPetler','soruKedi','soruKopek','soruKus','soruBalik','soruKucukPet'];
    const all = {};
    sets.forEach(s => {
        if (QUIZ_CONFIG[s]) QUIZ_CONFIG[s].forEach(q => { all[q.id] = q; });
    });
    return all;
}

const tumSorular = getAllSorular();

// Statik seçenek HTML üret (SEO için)
function buildSeceneklerHtml(soruId, secenekler) {
    if (!secenekler || secenekler.length === 0) return '';
    return secenekler.map(s =>
        `<button class="w-full text-left p-3 text-sm option-btn" onclick="return false;"><span class="opt-check"></span>${s}</button>`
    ).join('\n                    ');
}

let created = 0;
let errors = 0;

for (const [soruId, data] of Object.entries(buildData)) {
    try {
        const isDogum = (soruId === 'dogum');
        const isMulti = soruId in MULTI_SORULAR;
        const maxSecim = isMulti ? MULTI_SORULAR[soruId] : 1;

        // Config'den soru bilgisini al
        const soruObj = tumSorular[soruId];
        const soruMetin = soruObj ? soruObj.soru : '';
        const secenekler = soruObj ? soruObj.secenekler : [];

        // Statik seçenek HTML
        const seceneklerHtml = isDogum ? '' : buildSeceneklerHtml(soruId, secenekler);

        let html = template;

        // Değişkenleri yerleştir
        html = html.replace(/\{\{TITLE\}\}/g, data.title);
        html = html.replace(/\{\{DESCRIPTION\}\}/g, data.desc);
        html = html.replace(/\{\{DOSYA\}\}/g, data.dosya);
        html = html.replace(/\{\{SORU_ID\}\}/g, soruId);
        html = html.replace(/\{\{IS_MULTI\}\}/g, isMulti.toString());
        html = html.replace(/\{\{MAX_SECIM\}\}/g, maxSecim.toString());
        html = html.replace(/\{\{IS_DOGUM\}\}/g, isDogum.toString());
        html = html.replace(/\{\{MAKALE_HTML\}\}/g, data.makaleHtml);
        html = html.replace(/\{\{RESIM_URL\}\}/g, data.resimUrl);
        html = html.replace(/\{\{RESIM_ALT\}\}/g, data.resimAlt);
        html = html.replace(/\{\{SORU_METIN\}\}/g, soruMetin);
        html = html.replace(/\{\{SECENEKLER_HTML\}\}/g, seceneklerHtml);

        // Dogum sayfası için ekstra CSS ve JS ekle
        if (isDogum) {
            html = html.replace('/* {{DOGUM_EXTRA_CSS}} */', `.burc-btn { transition:all 0.2s; cursor:pointer; padding:8px 6px; border-radius:12px; border:2px solid #e2e8f0; text-align:center; background:white; outline:none; }
        .burc-btn.selected { border-color:#6366f1; background:#eef2ff; font-weight:700; }
        .burc-btn .burc-sembol { font-size:20px; display:block; }
        .burc-btn .burc-isim { font-size:10px; color:#475569; }`);
            html = html.replace('/* {{DOGUM_EXTRA_JS}} */', dogumExtra);
        } else {
            html = html.replace('/* {{DOGUM_EXTRA_CSS}} */', '');
            html = html.replace('/* {{DOGUM_EXTRA_JS}} */', '');
        }

        // Dosyayı yaz
        const outPath = path.join(__dirname, data.dosya);
        fs.writeFileSync(outPath, html, 'utf8');
        created++;

    } catch (err) {
        console.error(`HATA: ${soruId} - ${err.message}`);
        errors++;
    }
}

console.log(`\n✅ Build tamamlandı!`);
console.log(`   ${created} dosya oluşturuldu`);
if (errors > 0) console.log(`   ⚠️  ${errors} hata oluştu`);
console.log(`   Çıktı: ${__dirname}/quiz-*.html`);
