/* ══════════════════════════════════════════════════════════════════════
   BeamTech · Martins KI-Check – gemeinsame Logik
   Navigation mit Story-Fortschritt, Präsentationsleiste, Tastatur, Modal
   Tasten:  → / PageDown / Leertaste = weiter   ← / PageUp = zurück
            1–3 = Seite   Esc = Modal schließen   B = Bildschirm schwarz
══════════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    const STATIONEN = [
        { n: 1, href: 'start.html',        label: 'Start' },
        { n: 2, href: 'einstufung.html',   label: 'Gefährlich? & Pflichten' },
        { n: 3, href: 'status-board.html', label: 'Werkzeugkiste' }
    ];

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,
        c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // Keine Zeilenumbrüche zwischen „Art.“, „Abs.“ … und der Zahl
    const nb = s => String(s == null ? '' : s).replace(/(Art\.|Abs\.|Nr\.|lit\.|UAbs\.|Anhang|VO|i\. V\.) /g, '$1 ');

    // Zustand über Seitenwechsel im selben Tab (window.name statt Storage)
    function flags() { try { return JSON.parse(window.name || '{}') || {}; } catch (e) { return {}; } }
    function setFlag(k, v) { const f = flags(); f[k] = v; try { window.name = JSON.stringify(f); } catch (e) { /* egal */ } }

    let opts = {};
    let station = 1;

    /* ── Bausteine ─────────────────────────────────────────────────── */
    function ampel(st, o) {
        o = o || {};
        const s = STATUS[st];
        if (!s) return '';
        const d = o.delay != null ? ` style="--d:${o.delay}ms"` : '';
        return `<span class="ampel ampel--${st}${o.big ? ' ampel--big' : ''}"${d}>`
             + `<span class="ampel-l"><i></i><i></i><i></i></span><span>${esc(o.label || s.label)}</span></span>`;
    }

    // Kleine Fundstelle für die Prüfer (grau, Mono)
    const ref = (t, cls) => `<span class="ref${cls ? ' ' + cls : ''}">${nb(esc(t))}</span>`;

    function countUp(el, to, o) {
        o = o || {};
        const dur = o.dur || 1200, t0 = performance.now() + (o.delay || 0);
        el.textContent = '0';
        (function f(now) {
            const p = Math.min(1, Math.max(0, (now - t0) / dur));
            el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(f);
        })(performance.now());
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) el.textContent = to;
    }

    /* ── Modal ─────────────────────────────────────────────────────── */
    const modal = {
        ov: null, box: null, lastFocus: null,
        build() {
            this.ov = document.createElement('div');
            this.ov.className = 'modal-ov';
            this.ov.setAttribute('role', 'dialog');
            this.ov.setAttribute('aria-modal', 'true');
            this.ov.innerHTML = '<div class="modal"></div>';
            this.box = this.ov.firstChild;
            this.ov.addEventListener('click', e => {
                if (e.target === this.ov || e.target.closest('[data-close]')) this.close();
            });
            document.body.appendChild(this.ov);
        },
        open(html, o) {
            o = o || {};
            this.lastFocus = document.activeElement;
            this.box.innerHTML = html;
            this.box.scrollTop = 0;
            this.box.style.setProperty('--hc', o.color || '');
            this.ov.classList.add('is-open');
            const x = this.box.querySelector('.modal-x');
            if (x) setTimeout(() => x.focus({ preventScroll: true }), 50);
        },
        close() {
            if (!this.isOpen()) return;
            this.ov.classList.remove('is-open');
            if (this.lastFocus && this.lastFocus.focus) this.lastFocus.focus({ preventScroll: true });
        },
        isOpen() { return !!this.ov && this.ov.classList.contains('is-open'); }
    };

    // Einheitliches Modal: Kopf + max. 3 kurze Sätze + Fundstelle + Quelle
    function modalSimple(o) {
        return `<div class="modal-head">
                <div>
                    <div class="modal-kicker">${o.kicker || ''}</div>
                    <h3>${esc(o.title)}</h3>
                </div>
                <button class="modal-x" data-close aria-label="Schließen">✕</button>
            </div>
            <div class="modal-body">
                <ul class="mlist">${o.saetze.map(s => `<li>${nb(esc(s))}</li>`).join('')}</ul>
                ${o.ref ? ref(o.ref) : ''}
                ${o.quelle ? `<div class="msrc"><a href="${esc(o.quelle.url)}" target="_blank" rel="noopener">Quelle: ${esc(o.quelle.label)} <small>↗</small></a></div>` : ''}
            </div>`;
    }

    /* ── Gerüst: Navigation + Story-Fortschritt + Präsentationsleiste ── */
    function buildShell() {
        // Gruppenlogo: blaues Siegel, „1“ im Kranz aus 12 EU-Sternen
        let sterne = '';
        for (let s = 0; s < 12; s++) {
            const a = -Math.PI / 2 + s * Math.PI / 6, cx = 20 + 14.2 * Math.cos(a), cy = 20 + 14.2 * Math.sin(a);
            let d = '';
            for (let i = 0; i < 10; i++) {
                const w = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.8 : 2;
                d += (i ? 'L' : 'M') + (cx + r * Math.cos(w)).toFixed(2) + ' ' + (cy + r * Math.sin(w)).toFixed(2);
            }
            sterne += `<path style="--s:${s}" d="${d}Z"/>`;
        }
        const logo = `<span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><rect width="40" height="40" rx="10"/>${sterne}</svg><b>1</b></span>`;
        const links = STATIONEN.map((s, i) => {
            const cls = s.n === station ? 'is-active' : (s.n < station ? 'is-done' : '');
            return (i ? '<li class="sep" aria-hidden="true">·</li>' : '')
                + `<li><a href="${s.href}" class="${cls}"><span class="n">${s.n}</span>${esc(s.label)}</a></li>`;
        }).join('');

        const nav = document.getElementById('nav');
        nav.className = 'nav';
        nav.innerHTML = `<a class="brand" href="start.html" aria-label="Gruppe 1 – zur Startseite">${logo}<span class="brand-t"><b>Gruppe 1</b><small>Europarecht · KI-VO</small></span></a>
            <ol class="nav-steps">${links}</ol>
            <div class="story" id="story">
                <span class="story-av">MK</span>
                <span class="story-t" id="storyT"></span>
                <span class="story-bar"><i></i><i></i><i></i></span>
            </div>
            <div class="nav-progress"></div>`;

        // Fortschrittsbalken wächst von der vorherigen Seite aus
        const prog = nav.querySelector('.nav-progress');
        const from = flags().from;
        prog.style.setProperty('--p', ((from && from !== station ? from : station - 1) / 3 * 100) + '%');
        requestAnimationFrame(() => requestAnimationFrame(() => prog.style.setProperty('--p', (station / 3 * 100) + '%')));

        const dock = document.getElementById('dock');
        dock.className = 'dock';
        dock.innerHTML = `
            <div class="dock-foot"><b>Europarecht</b> · KI-VO · Quellenstand: ${QUELLENSTAND}</div>
            <div class="dock-ctrl">
                <button class="dock-btn" id="dockPrev"><span class="arr">←</span> Zurück</button>
                <div class="dock-pos">Seite <b>${station}</b>/3<span class="dock-sub" id="dockSub"></span></div>
                <button class="dock-btn dock-btn--next" id="dockNext">Weiter <span class="arr">→</span></button>
            </div>
            <div class="dock-keys"><kbd>←</kbd><kbd>→</kbd>&nbsp;Navigation</div>`;

        document.getElementById('dockPrev').addEventListener('click', prev);
        document.getElementById('dockNext').addEventListener('click', next);
        refreshDock();

        const bo = document.createElement('div');
        bo.className = 'blackout';
        document.body.appendChild(bo);
    }

    // Story-Fortschritt: Kapitel 0 (Start) bis 3
    function setKapitel(k) {
        const t = document.getElementById('storyT');
        if (!t) return;
        t.innerHTML = k === 0 ? 'Martins Fall' : `Kapitel <b>${k}</b> von 3`;
        document.querySelectorAll('.story-bar i').forEach((i, n) => i.classList.toggle('is-on', n < k));
    }

    function refreshDock() {
        const p = document.getElementById('dockPrev');
        const n = document.getElementById('dockNext');
        if (!p) return;
        p.disabled = station === 1;
        n.disabled = station === 3;
        if (station === 3) n.innerHTML = 'Ende <span class="arr">✓</span>';
    }

    function setSub(text) {
        const el = document.getElementById('dockSub');
        if (el) el.textContent = text || '';
    }

    function press(id) {
        const b = document.getElementById(id);
        if (!b) return;
        b.classList.add('is-pressed');
        setTimeout(() => b.classList.remove('is-pressed'), 140);
    }

    function go(target) {
        const s = typeof target === 'number' ? STATIONEN[target - 1] : null;
        const href = s ? s.href : target;
        if (!href) return;
        setFlag('from', station);
        modal.close();
        document.body.classList.add('is-leaving');
        setTimeout(() => { window.location.href = href; }, 230);
    }

    function next() {
        press('dockNext');
        if (modal.isOpen()) { modal.close(); return; }
        if (opts.onNext && opts.onNext() === true) return;
        if (station < 3) go(station + 1);
    }

    function prev() {
        press('dockPrev');
        if (modal.isOpen()) { modal.close(); return; }
        if (opts.onPrev && opts.onPrev() === true) return;
        if (station > 1) go(station - 1);
    }

    /* ── Tastatur / Presenter-Klicker ──────────────────────────────── */
    function onKey(e) {
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        const k = e.key;
        if (document.documentElement.classList.contains('is-black') && k !== 'F5') {
            e.preventDefault();
            document.documentElement.classList.remove('is-black');
            return;
        }
        if (k === 'Escape') { if (modal.isOpen()) { e.preventDefault(); modal.close(); } return; }
        if (k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'Spacebar') { e.preventDefault(); next(); return; }
        if (k === 'ArrowLeft'  || k === 'PageUp') { e.preventDefault(); prev(); return; }
        if (k === '1' || k === '2' || k === '3') { if (Number(k) !== station) go(Number(k)); return; }
        if (k === 'b' || k === 'B' || k === '.') document.documentElement.classList.add('is-black');
    }

    /* ── Offline-Fallback: Icons fehlen → sauber ausblenden ────────── */
    function checkIcons() {
        const test = () => {
            // Icons gelten als verfügbar, solange die Schrift registriert ist und nicht fehlschlug
            let ok = false;
            try { document.fonts.forEach(f => { if (/Font Awesome/i.test(f.family) && f.status !== 'error') ok = true; }); } catch (e) { ok = true; }
            document.documentElement.classList.toggle('no-fa', !ok);
        };
        [1800, 5000].forEach(t => setTimeout(test, t));
    }

    /* ── Überschriften einpassen (greift bei Ersatzschriften) ──────── */
    function fitHeadlines() {
        document.querySelectorAll('h1.display').forEach(h => {
            h.style.fontSize = '';
            let size = parseFloat(getComputedStyle(h).fontSize);
            const min = size * 0.6;
            while (h.scrollWidth > h.clientWidth + 1 && size > min) {
                size *= 0.96;
                h.style.fontSize = size + 'px';
            }
        });
    }

    /* ── EU-Sternenkranz (Motiv der Gruppen-PPT) ───────────────────── */
    function euRing() {
        const stern = (cx, cy, r) => {
            let d = '';
            for (let i = 0; i < 10; i++) {
                const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.4 : r;
                d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(2) + ' ' + (cy + rr * Math.sin(a)).toFixed(2);
            }
            return d + 'Z';
        };
        let paths = '';
        for (let s = 0; s < 12; s++) {
            const a = -Math.PI / 2 + s * Math.PI / 6;
            paths += `<path style="--s:${s}" d="${stern(50 + 40 * Math.cos(a), 50 + 40 * Math.sin(a), 7.5)}"/>`;
        }
        document.querySelectorAll('.hero-inner').forEach(h =>
            h.insertAdjacentHTML('beforeend', `<div class="eu-ring" aria-hidden="true"><svg viewBox="0 0 100 100">${paths}</svg></div>`));
    }

    /* ── Mauszeiger nach Inaktivität ausblenden (Beamer) ───────────── */
    function idleCursor() {
        let h;
        const wake = () => {
            document.body.classList.remove('is-idle');
            clearTimeout(h);
            h = setTimeout(() => document.body.classList.add('is-idle'), 3000);
        };
        document.addEventListener('mousemove', wake, { passive: true });
        wake();
    }

    function init(o) {
        opts = o || {};
        station = opts.station || 1;
        buildShell();
        euRing();
        setKapitel(opts.kapitel || 0);
        modal.build();
        document.addEventListener('keydown', onKey);

        // Interne Seitenlinks mit Ausblend-Übergang
        document.addEventListener('click', e => {
            const a = e.target.closest('a[href]');
            if (!a || a.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey) return;
            const href = a.getAttribute('href');
            if (!/^[\w-]+\.html(#.*)?$/.test(href)) return;
            e.preventDefault();
            go(href);
        });

        checkIcons();
        idleCursor();
        fitHeadlines();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHeadlines);
        window.addEventListener('resize', fitHeadlines);
        setFlag('from', null);
    }

    window.Praes = { init, ampel, ref, countUp, modal, modalSimple, setSub, setKapitel, go, esc, nb, fitHeadlines, flags };
})();
