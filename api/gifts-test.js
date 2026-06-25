export const config = {
    maxDuration: 60
};

const SISTEM_PROMPT = 'Önce her hediye fikri için web\'de gerçekten satılan, bulunabilir ürün kategorilerini ARA ve sonuçları gör. Asla birbirine ilgisiz iki kriteri (örn. "deri" + "el bakımı") zorla tek bir üründe birleştirip hayali bir kategori uydurma — sadece gerçekten var olan, internette gerçekten satılan ürün kategorilerini öner. Her hediye için searchQuery Türkçe tam hediye adını kullan (örn: "ahşap kutu organizer", "deri cüzdan" — kısaltma, tam adı yaz, ama mutlaka gerçek/aratılabilir bir kategori olsun). searchQueryEn İngilizce arama kelimesi olsun (Unsplash görsel araması için). CİNSİYETE UYGUNLUK ZORUNLU: hediye, kişinin belirtilen cinsiyetine ve "kime" ilişkisine (örn. erkek iş arkadaşı, kadın anne) gerçekten uygun olmalı; klişe cinsiyetçi varsayımlardan kaçın ama açıkça uygunsuz/cinsiyetle çelişen bir ürün önerme. ÖNEMLİ — TEK BİR CEVABA SAPLANMA: "Kahve mi çay mı" gibi basit zevk/tercih soruları TEK BAŞINA bir hediye kategorisi belirleyici DEĞİLDİR. Bu cevabı asla doğrudan çay seti/kahve makinesi/fincan/termos gibi o içeceğe ait bir ürüne çevirme — bu küçük bir ipucudur, ana hediye konusu OLMAMALI; kişinin diğer ilgi alanlarına (hobi, mevsim, kişilik, tarz, vs.) odaklan. Aynı mantık diğer tek-kelimelik tercih sorularına da (örn. yaz/kış, tatlı/tuzlu) uygulanır. KLİŞELERDEN KAÇIN — bu kategoriler için ZORUNLU OLARAK ilk akla gelen tek ürüne saplanma: aksesuar/saat kriteri için mutlaka saat önerme; fotoğraf kriteri için albüm önerme; seyahat/gezi sevenler için sürekli valiz/bavul/seyahat çantası önerme; müzik sevenler için sürekli kulaklık/hoparlör/gitar önerme; Asya mutfağı sevenler için sürekli suşi seti/wok tava önerme; kitap sevenler için sürekli kitap ayracı önerme. Bunların yerine her seferinde o ilgi alanına dair FARKLI, daha yaratıcı ve beklenmedik ama gerçek/satılan bir ürün bul — klasik ürünler tamamen yasak değil, sadece HER ZAMAN aynısına gitme. Aynı hediye kategorisini kesinlikle tekrar etme. Her hediye birbirinden tamamen farklı ve özgün olsun. Sadece JSON array döndür. Başka hiçbir şey yazma, markdown kullanma.';

// Model talimatlara uymayıp yine de bu kategorilere saplanırsa, kod seviyesinde
// yakalayıp tekrar denetiyoruz — talimata güvenmek yerine sonucu denetlemek
// çok daha güvenilir.
const YASAKLI_TERIMLER = ['çay seti', 'çay takım', 'çay takımı', 'porselen çay', 'kahve makinesi', 'kahve seti', 'fincan seti', 'valiz', 'bavul', 'seyahat çantası', 'suşi', 'wok', 'kitap ayracı'];

// Tek bir kelime/temanın listede TEKRAR TEKRAR çıkması da bir klişe biçimi —
// "porselen çay seti" yasaklansa bile model "çay çeşitleri hediye paketi",
// "özel demleme çay kutusu" gibi farklı kelimelerle AYNI temaya saplanabiliyor.
// Bu yüzden anlamlı kelimeleri sayıp bir kelime 2+ hediyede geçiyorsa da
// klişe/tema baskınlığı olarak işaretliyoruz.
const ONEMSIZ_KELIMELER = new Set(['ve', 'ile', 'için', 'bir', 'set', 'seti', 'kutusu', 'kutu', 'paketi', 'paket', 'hediye', 'özel', 'kişiye', 'kişisel', 'gift']);

function temaBaskinligiBul(sugg) {
    if (!Array.isArray(sugg) || sugg.length < 2) return null;
    const sayac = {};
    sugg.forEach(function(g) {
        const adSQ = ((g && g.name ? g.name : '') + ' ' + (g && g.searchQuery ? g.searchQuery : '')).toLowerCase();
        const kelimeler = adSQ.split(/[^a-zçğıöşü0-9]+/i).filter(function(k) { return k.length > 3 && !ONEMSIZ_KELIMELER.has(k); });
        const benzersiz = Array.from(new Set(kelimeler));
        benzersiz.forEach(function(k) { sayac[k] = (sayac[k] || 0) + 1; });
    });
    const tekrarEden = Object.keys(sayac).find(function(k) { return sayac[k] >= 2; });
    return tekrarEden ? { kelime: tekrarEden, adet: sayac[tekrarEden] } : null;
}

function klisesBul(sugg) {
    if (!Array.isArray(sugg)) return null;
    for (const g of sugg) {
        const adSQ = (g && g.name ? g.name : '') + ' ' + (g && g.searchQuery ? g.searchQuery : '');
        const text = adSQ.toLowerCase();
        const bulunan = YASAKLI_TERIMLER.find(function(f) { return text.includes(f); });
        if (bulunan) return { gift: g, terim: bulunan };
    }
    return null;
}

function metniDizeyeAyikla(data) {
    const msgItem = (data.output || []).find(item => item.type === 'message');
    const textPart = msgItem && msgItem.content ? msgItem.content.find(c => c.type === 'output_text') : null;
    return textPart ? textPart.text : '';
}

function metniDiziyeParseEt(resultText) {
    let sugg = [];
    try { sugg = JSON.parse(resultText); } catch (e) {
        const m = resultText.match(/\[[\s\S]*\]/);
        if (m) { try { sugg = JSON.parse(m[0]); } catch (e2) {} }
    }
    return Array.isArray(sugg) ? sugg : [];
}

async function grokIstegiYap(apiKey, inputMesajlari, controller, aramaAktif) {
    const body = {
        model: 'grok-4.3',
        input: inputMesajlari,
        temperature: 1.1,
        max_output_tokens: 3000
    };
    if (aramaAktif !== false) body.tools = [{ type: 'web_search' }];
    const response = await fetch('https://api.x.ai/v1/responses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(body),
        signal: controller.signal
    });
    return response;
}

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

        let inputMesajlari = [
            { role: 'system', content: SISTEM_PROMPT },
            { role: 'user', content: prompt }
        ];

        let response = await grokIstegiYap(apiKey, inputMesajlari, controller);
        if (!response.ok) {
            clearTimeout(timeout);
            const errData = await response.json();
            return res.status(response.status).json({ error: errData });
        }
        let data = await response.json();
        let resultText = metniDizeyeAyikla(data);
        let sugg = metniDiziyeParseEt(resultText);

        // İki tür sorun ayrı ayrı kontrol edilir: (1) tek bir hediyede yasaklı
        // klişe ifade, (2) listenin TAMAMINDA bir kelimenin/temanın (örn. "çay")
        // 2+ hediyede tekrarlanması. İkincisi daha köklü bir sorun olduğu için
        // önce o kontrol edilir; biri bulunursa modele net geri bildirimle
        // TEK SEFER tekrar sorulur.
        const tekrar = temaBaskinligiBul(sugg);
        const klise = klisesBul(sugg);
        let geriBildirim = null;
        if (tekrar) {
            geriBildirim = 'Listendeki hediyelerin ' + tekrar.adet + ' tanesinde "' + tekrar.kelime + '" kelimesi/teması tekrar ediyor — bu kabul edilemez, her hediye TAMAMEN farklı bir kategoriden olmalı. Aynı JSON array formatında, AYNI SAYIDA hediye ile TÜM listeyi yeniden ver; "' + tekrar.kelime + '" temasını EN FAZLA 1 hediyede kullan, diğerlerini tamamen başka ilgi alanlarına göre değiştir.';
        } else if (klise) {
            geriBildirim = 'Önerdiğin "' + (klise.gift.name || klise.terim) + '" hediyesini KABUL ETMİYORUM — çok klişe ve kişiye uygun değil. Aynı JSON array formatında, AYNI SAYIDA hediye ile TÜM listeyi yeniden ver; sadece bu hediyeyi (' + klise.terim + ' içeren) değiştir, diğerlerini aynen koru. Yeni hediye "' + klise.terim + '" veya benzer bir klişe İÇERMESİN.';
        }
        if (geriBildirim) {
            inputMesajlari.push({ role: 'assistant', content: resultText });
            inputMesajlari.push({ role: 'user', content: geriBildirim });
            response = await grokIstegiYap(apiKey, inputMesajlari, controller, false);
            if (response.ok) {
                data = await response.json();
                const ikinciDeneme = metniDizeyeAyikla(data);
                if (ikinciDeneme) resultText = ikinciDeneme;
            }
        }

        clearTimeout(timeout);
        return res.status(200).json({ result: resultText });

    } catch (error) {
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: 'API zaman aşımına uğradı, lütfen tekrar deneyin.' });
        }
        return res.status(500).json({ error: error.message });
    }
}
