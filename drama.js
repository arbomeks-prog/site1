// ============================================================
// drama.js — Dedektif Çakır Motor
// Her quiz sayfasına config.js'den SONRA ekle:
//   <script src="config.js"></script>
//   <script src="drama.js"></script>
// Sayfada şu HTML element'lerin bulunması gerekir:
//   #drama-overlay, #drama-inact-bar
// initDrama(SORU_ID) ile başlat.
// ============================================================

(function() {
    'use strict';

    // ── Ses Motoru ─────────────────────────────────────────
    let _audioCtx = null;
    function getAC() {
        if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return _audioCtx;
    }
    function playTone(freq, t, dur, type, vol) {
        try {
            const ctx = getAC();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.type = type || 'triangle';
            o.frequency.value = freq;
            g.gain.setValueAtTime(0, ctx.currentTime + t);
            g.gain.linearRampToValueAtTime(vol || 0.09, ctx.currentTime + t + 0.04);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + dur);
            o.start(ctx.currentTime + t);
            o.stop(ctx.currentTime + t + dur + 0.05);
        } catch(e) {}
    }
    function playDrama()  { [[440,0,.3],[330,.18,.3],[220,.38,.4],[165,.6,.5]].forEach(([f,t,d]) => playTone(f,t,d,'sawtooth',.07)); }
    function playPop()    { [[523,0,.15],[659,.12,.15],[784,.25,.2]].forEach(([f,t,d]) => playTone(f,t,d,'triangle',.08)); }
    function playPing()   { playTone(880, 0, .15, 'sine', .07); }
    function playWrong()  { [[220,0,.2],[196,.18,.25]].forEach(([f,t,d]) => playTone(f,t,d,'square',.07)); }

    // ── DOM Yardımcıları ───────────────────────────────────
    function shake(el) {
        if (!el) return;
        el.style.animation = 'none';
        el.offsetHeight; // reflow
        el.style.animation = 'dramaShake .55s ease';
    }

    // ── Popup Kapısı — asla üst üste açılmasın ────────────
    let _popupOpen = false;
    let _pendingCevap = null;   // { deger, btn, cb }

    function canOpen() { return !_popupOpen; }

    function openPopup(html, onClose) {
        if (!canOpen()) return false;
        _popupOpen = true;
        const overlay = document.getElementById('drama-overlay');
        if (!overlay) return false;
        overlay.querySelector('.drama-popup-inner').innerHTML = html;
        overlay.classList.add('drama-on');
        overlay._onClose = onClose || null;
        return true;
    }

    function closePopup() {
        const overlay = document.getElementById('drama-overlay');
        if (overlay) overlay.classList.remove('drama-on');
        _popupOpen = false;
        const cb = overlay && overlay._onClose;
        if (overlay) overlay._onClose = null;
        if (cb) cb();
    }

    // Global olarak açık bırak ki HTML onclick="Drama.closePopup()" çalışsın
    window.Drama = window.Drama || {};
    window.Drama.closePopup = closePopup;

    // ── İnaktivite Sistemi ─────────────────────────────────
    let _inactTimer     = null;
    let _inactCountdown = null;
    let _inactIdx       = 0;
    let _inactSecs      = 0;
    const cfg           = (typeof QUIZ_CONFIG !== 'undefined') ? QUIZ_CONFIG.dramaConfig : null;

    function resetInact() {
        clearTimeout(_inactTimer);
        clearInterval(_inactCountdown);
        document.getElementById('drama-inact-bar') && document.getElementById('drama-inact-bar').classList.remove('drama-inact-show');
        if (!cfg) return;
        _inactTimer = setTimeout(triggerInact, cfg.inaktivite.sure);
    }

    function triggerInact() {
        if (!cfg) return;
        const msgs = cfg.inaktivite.mesajlar;
        const m    = msgs[Math.min(_inactIdx, msgs.length - 1)];
        const bar  = document.getElementById('drama-inact-bar');
        if (!bar) return;
        bar.querySelector('.drama-inact-emo').textContent   = m.emo;
        bar.querySelector('.drama-inact-baslik').textContent = m.baslik;
        bar.querySelector('.drama-inact-metin').textContent  = m.metin;
        _inactSecs = cfg.inaktivite.geriSayim;
        bar.querySelector('.drama-inact-timer').textContent  = _inactSecs;
        bar.classList.add('drama-inact-show');
        playPing();
        _inactCountdown = setInterval(function() {
            _inactSecs--;
            const t = bar.querySelector('.drama-inact-timer');
            if (t) t.textContent = Math.max(0, _inactSecs);
            if (_inactSecs <= 0) {
                clearInterval(_inactCountdown);
                bar.classList.remove('drama-inact-show');
                shake(document.querySelector('.quiz-card') || document.body);
                _inactIdx++;
                _inactTimer = setTimeout(triggerInact, cfg.inaktivite.sure + 5000);
            }
        }, 1000);
    }

    window.Drama.dismissInact = function() {
        clearInterval(_inactCountdown);
        const bar = document.getElementById('drama-inact-bar');
        if (bar) bar.classList.remove('drama-inact-show');
        playPop();
        _inactIdx = 0;
        resetInact();
    };

    // ── Banner Sistemi — max 1 aynı anda ──────────────────
    let _activeBannerId = null;
    let _bannerTimeout  = null;
    let _bannerQueue    = [];
    let _bannerIndex    = 0;

    function showNextBanner() {
        if (!cfg) return;
        const bannerlar = cfg.bannerlar;
        if (!bannerlar || bannerlar.length === 0) return;

        // Öncekini kapat
        if (_activeBannerId !== null) {
            const prev = document.getElementById('drama-banner-' + _activeBannerId);
            if (prev) prev.classList.remove('drama-banner-show');
            _activeBannerId = null;
        }

        const b   = bannerlar[_bannerIndex % bannerlar.length];
        const bid = _bannerIndex % bannerlar.length;
        _bannerIndex++;

        const el = document.getElementById('drama-banner-' + bid);
        if (!el) { _bannerTimeout = setTimeout(showNextBanner, 20000); return; }

        const mesaj = b.mesajlar[Math.floor(Math.random() * b.mesajlar.length)];
        el.querySelector('.drama-banner-txt').textContent = mesaj;
        _activeBannerId = bid;
        el.classList.add('drama-banner-show');
        playPing();

        // 9 sn göster, sonra kapat, 16-22 sn sonra sıradaki
        _bannerTimeout = setTimeout(function() {
            el.classList.remove('drama-banner-show');
            _activeBannerId = null;
            _bannerTimeout = setTimeout(showNextBanner, 16000 + Math.random() * 6000);
        }, 9000);
    }

    window.Drama.closeBanner = function(bid) {
        clearTimeout(_bannerTimeout);
        const el = document.getElementById('drama-banner-' + bid);
        if (el) el.classList.remove('drama-banner-show');
        _activeBannerId = null;
        playPing();
        // Kapatılınca 20 sn sonra sıradaki
        _bannerTimeout = setTimeout(showNextBanner, 20000 + Math.random() * 8000);
    };

    // ── "Emin misin?" Popup ────────────────────────────────
    // cb(true) = devam et, cb(false) = değiştir
    function openEminMisin(cb) {
        if (!cfg || !canOpen()) { cb(true); return; }
        const pool = cfg.eminMisin;
        const p    = pool[Math.floor(Math.random() * pool.length)];
        playDrama();
        const html = `
            <span class="dp-emo">${p.emo}</span>
            <div class="dp-baslik">${p.baslik}</div>
            <div class="dp-metin">${p.metin}</div>
            <div class="dp-btns">
                <button class="dp-btn dp-btn-danger"  onclick="Drama._eminAct(false)">${p.degistirLabel}</button>
                <button class="dp-btn dp-btn-primary" onclick="Drama._eminAct(true)">${p.devamLabel}</button>
            </div>`;
        openPopup(html);
        window.Drama._eminAct = function(devam) { closePopup(); cb(devam); };
    }

    // ── Argo Popup ─────────────────────────────────────────
    function openArgoPop(ozelMetin, cb) {
        if (!cfg || !canOpen()) { cb(true); return; }
        const p = cfg.argoPop;
        playWrong();
        const html = `
            <span class="dp-emo">${p.emo}</span>
            <div class="dp-baslik">${p.baslik}</div>
            <div class="dp-metin">${ozelMetin}</div>
            <div class="dp-btns">
                <button class="dp-btn dp-btn-gold"    onclick="Drama._argoAct(true)">${p.devamLabel}</button>
                <button class="dp-btn dp-btn-outline" onclick="Drama._argoAct(false)">${p.degistirLabel}</button>
            </div>`;
        openPopup(html);
        window.Drama._argoAct = function(devam) { closePopup(); cb(devam); };
    }

    // ── Skip Sistemi ───────────────────────────────────────
    let _skipCount = 0;

    window.Drama.skip = function(onSkip, onStay) {
        if (!cfg || !canOpen()) return;
        _skipCount++;
        const s = _skipCount === 1 ? cfg.skip.ilkMesaj : cfg.skip.ikincMesaj;
        playDrama();
        const html = `
            <span class="dp-emo">${s.emo}</span>
            <div class="dp-baslik">${s.baslik}</div>
            <div class="dp-metin">${s.metin}</div>
            <div class="dp-btns">
                <button class="dp-btn dp-btn-outline" onclick="Drama._skipStay()">${s.kalLabel}</button>
                <button class="dp-btn dp-btn-danger"  onclick="Drama._skipGo()">${s.gecLabel}</button>
            </div>`;
        openPopup(html);
        window.Drama._skipGo   = function() { closePopup(); if (onSkip)  onSkip();  };
        window.Drama._skipStay = function() { closePopup(); _skipCount = 0; if (onStay) onStay(); };
    };

    // ── Ana Seçim İşleyici — quiz sayfalarından çağrılır ──
    // argoMesaj: null ise argo yok, string ise argo popup açılır
    // Önce argo > sonra %25 ihtimalle emin misin > sonra direkt commit
    window.Drama.handlePick = function(deger, btn, argoMesaj, onCommit) {
        if (_popupOpen) return; // Zaten popup açık, tıklamayı yut

        resetInact(); // hareket var, sayacı sıfırla

        if (argoMesaj) {
            openArgoPop(argoMesaj, function(devam) {
                if (devam) onCommit(deger, btn);
            });
            return;
        }

        // %25 ihtimalle "emin misin?" — ilk 2 soruda değil
        const soruNo = (typeof SORU_ID !== 'undefined') ? QuizHelper.getSoruNo(SORU_ID) : 99;
        if (soruNo > 2 && Math.random() < 0.25) {
            openEminMisin(function(devam) {
                if (devam) onCommit(deger, btn);
            });
            return;
        }

        onCommit(deger, btn);
    };

    // ── Milestone Banner (inline, quiz kartının üstünde) ──
    window.Drama.checkMilestone = function(soruNo) {
        if (!cfg) return;
        const msg = QuizHelper.getMilestone(soruNo);
        if (!msg) return;
        const el = document.getElementById('drama-milestone');
        if (!el) return;
        el.textContent = '✦ ' + msg;
        el.classList.add('drama-milestone-show');
        setTimeout(function() { el.classList.remove('drama-milestone-show'); }, 5000);
    };

    // ── Init ───────────────────────────────────────────────
    window.Drama.init = function(soruId) {
        // CSS enjekte et
        if (!document.getElementById('drama-styles')) {
            const style = document.createElement('style');
            style.id = 'drama-styles';
            style.textContent = `
                /* Overlay */
                #drama-overlay {
                    position:fixed;inset:0;z-index:900;
                    background:rgba(15,23,42,0.82);backdrop-filter:blur(8px);
                    display:flex;align-items:center;justify-content:center;padding:20px;
                    opacity:0;pointer-events:none;transition:opacity .3s;
                }
                #drama-overlay.drama-on { opacity:1;pointer-events:all; }
                .drama-popup-inner {
                    background:#fff;border-radius:20px;padding:28px 24px;
                    max-width:360px;width:100%;text-align:center;
                    box-shadow:0 20px 60px rgba(0,0,0,.25);
                    animation:dpPopIn .4s cubic-bezier(.34,1.56,.64,1);
                }
                @keyframes dpPopIn{from{transform:scale(.75);opacity:0}to{transform:scale(1);opacity:1}}
                .dp-emo   { font-size:2.8rem;display:block;margin-bottom:10px; }
                .dp-baslik{ font-size:1.2rem;font-weight:800;color:#1e293b;margin-bottom:8px; }
                .dp-metin { font-size:.86rem;color:#64748b;line-height:1.6;margin-bottom:20px;white-space:pre-line; }
                .dp-btns  { display:flex;flex-direction:column;gap:8px; }
                .dp-btn   { border:none;border-radius:12px;padding:12px 16px;font-size:.88rem;font-weight:600;cursor:pointer;transition:all .2s;font-family:inherit; }
                .dp-btn-primary { background:#1e40af;color:#fff; }
                .dp-btn-primary:hover { background:#2a5bc8; }
                .dp-btn-danger  { background:rgba(239,68,68,.1);color:#dc2626;border:1px solid rgba(239,68,68,.2); }
                .dp-btn-danger:hover { background:rgba(239,68,68,.18); }
                .dp-btn-outline { background:#f1f5f9;color:#64748b; }
                .dp-btn-outline:hover { background:#e2e8f0; }
                .dp-btn-gold    { background:rgba(232,168,56,.12);color:#92400e;border:1px solid rgba(232,168,56,.3); }
                .dp-btn-gold:hover { background:rgba(232,168,56,.2); }

                /* İnaktivite Bar */
                #drama-inact-bar {
                    position:fixed;bottom:0;left:0;right:0;z-index:800;
                    background:rgba(15,23,42,.97);border-top:1px solid rgba(255,255,255,.08);
                    padding:14px 20px;display:flex;align-items:center;gap:14px;
                    transform:translateY(100%);transition:transform .4s cubic-bezier(.4,0,.2,1);
                }
                #drama-inact-bar.drama-inact-show { transform:translateY(0); }
                .drama-inact-emo    { font-size:1.7rem;flex-shrink:0; }
                .drama-inact-texts  { flex:1; }
                .drama-inact-baslik { font-weight:700;color:#f1f5f9;font-size:.9rem; }
                .drama-inact-metin  { color:#94a3b8;font-size:.78rem;line-height:1.45; }
                .drama-inact-timer  { font-size:1.8rem;font-weight:900;color:#e8a838;min-width:28px;text-align:center;flex-shrink:0; }
                .drama-inact-btn    { background:#1e40af;border:none;border-radius:10px;padding:9px 16px;color:#fff;font-size:.82rem;font-weight:600;cursor:pointer;flex-shrink:0;transition:all .2s; }
                .drama-inact-btn:hover { background:#2a5bc8; }

                /* Floating Banners */
                .drama-banner {
                    position:fixed;z-index:700;max-width:240px;width:88%;
                    border-radius:12px;padding:9px 12px;
                    font-size:.78rem;font-weight:600;line-height:1.4;
                    box-shadow:0 6px 20px rgba(0,0,0,.2);
                    display:none;align-items:flex-start;gap:7px;
                    animation:dpBannerFloat 3s ease-in-out infinite;
                    transition:transform .2s;
                }
                .drama-banner.drama-banner-show { display:flex; }
                @keyframes dpBannerFloat{0%,100%{transform:translateY(0) rotate(-.4deg)}50%{transform:translateY(-5px) rotate(.4deg)}}
                .drama-banner-txt  { flex:1; }
                .drama-banner-x    { cursor:pointer;opacity:.6;font-size:.95rem;flex-shrink:0;line-height:1;transition:opacity .2s; }
                .drama-banner-x:hover { opacity:1; }
                /* Banner renkleri */
                .drama-banner-sari  { background:#fbbf24;color:#000; }
                .drama-banner-pembe { background:#ec4899;color:#fff; }
                .drama-banner-mor   { background:#8b5cf6;color:#fff; }
                .drama-banner-yesil { background:#34d399;color:#000; }
                /* Banner pozisyonları — 4 köşe */
                #drama-banner-0 { top:68px;left:12px; }
                #drama-banner-1 { top:68px;right:12px; }
                #drama-banner-2 { bottom:72px;left:12px; }
                #drama-banner-3 { bottom:72px;right:12px; }

                /* Milestone */
                #drama-milestone {
                    display:none;background:rgba(232,168,56,.1);
                    border:1px solid rgba(232,168,56,.25);border-radius:8px;
                    padding:8px 12px;font-size:.78rem;color:#92400e;
                    margin-bottom:10px;text-align:center;
                    animation:dpSlideDown .3s ease;
                }
                #drama-milestone.drama-milestone-show { display:block; }
                @keyframes dpSlideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}

                /* Shake */
                @keyframes dramaShake{
                    0%,100%{transform:translateX(0)}
                    20%{transform:translateX(-8px)}40%{transform:translateX(8px)}
                    60%{transform:translateX(-5px)}80%{transform:translateX(5px)}
                }
            `;
            document.head.appendChild(style);
        }

        // Kullanıcı etkileşiminde inaktivite sıfırla
        ['click','keydown','touchstart','scroll'].forEach(function(ev) {
            document.addEventListener(ev, resetInact, { passive: true });
        });

        // İlk inaktivite başlat
        resetInact();

        // Bannerlar: 10 sn sonra başlat
        setTimeout(showNextBanner, 10000);

        // Milestone kontrol
        if (typeof SORU_ID !== 'undefined') {
            const no = QuizHelper.getSoruNo(SORU_ID);
            window.Drama.checkMilestone(no);
        }
    };

})(); // IIFE bitti
