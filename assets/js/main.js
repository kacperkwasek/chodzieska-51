/* Chodzieska 51 — skrypty strony. Dane: assets/js/data.js (window.CH51_DATA). */
(function () {
  'use strict';

  var D = window.CH51_DATA;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var ruchOgraniczony = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Pomocnicze ---------- */

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') node.textContent = attrs[k];
      else if (k === 'class') node.className = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c != null) node.append(c); });
    return node;
  }

  // Placeholder brakujących danych: [DO UZUPEŁNIENIA: co]
  function placeholder(co) {
    return el('span', { class: 'placeholder', text: '[DO UZUPEŁNIENIA' + (co ? ': ' + co : '') + ']' });
  }

  function wartoscLubPlaceholder(wartosc, co) {
    return wartosc == null ? placeholder(co) : document.createTextNode(String(wartosc));
  }

  var zl = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 });
  function cena(v, co) { return v == null ? placeholder(co) : document.createTextNode(zl.format(v)); }

  function data(v) {
    if (!v) return placeholder('data');
    var d = new Date(v + 'T00:00:00');
    return document.createTextNode(isNaN(d) ? v : d.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }));
  }

  // Sprzedany lokal: zamiast cen „Sprzedany”, bez przycisku zapytania (historia cen zostaje)
  function sprzedany(l) { return l.status === 'sprzedany'; }

  function zastap(node, nowa) { node.replaceChildren(nowa); }

  function lokal(id) { return D.lokale.filter(function (l) { return l.id === id; })[0]; }

  function przewinDo(target, focusEl) {
    zatrzymajPrzejazd();
    target.scrollIntoView({ behavior: ruchOgraniczony.matches ? 'auto' : 'smooth', block: 'start' });
    if (focusEl) focusEl.focus({ preventScroll: true });
  }

  /* ---------- Dane globalne: kontakt, spółka, pas zalet w hero ---------- */

  // telefon i e-mail jako linki, reszta jako tekst
  function wstawWartosc(n, pole, v) {
    if (pole === 'telefon') zastap(n, el('a', { href: 'tel:' + v.replace(/\s/g, ''), text: v }));
    else if (pole === 'email') zastap(n, el('a', { href: 'mailto:' + v, text: v }));
    else n.textContent = v;
  }

  // „100” albo „95–110”, gdy lokale się różnią
  function zakres(wartosci) {
    var min = Math.min.apply(null, wartosci), max = Math.max.apply(null, wartosci);
    return min === max ? String(min) : min + '–' + max;
  }

  function wypelnijDane() {
    var k = D.kontakt;
    $$('[data-kontakt]').forEach(function (n) {
      var pole = n.getAttribute('data-kontakt');
      if (k[pole] != null) wstawWartosc(n, pole, k[pole]); // null: zostaje placeholder z HTML
    });
    // data-telefon="pelny": „Zadzwoń: +48 …”, data-telefon="krotki": „Zadzwoń”
    if (k.telefon) $$('[data-telefon]').forEach(function (a) {
      a.href = 'tel:' + k.telefon.replace(/\s/g, '');
      a.textContent = a.getAttribute('data-telefon') === 'krotki' ? 'Zadzwoń' : 'Zadzwoń: ' + k.telefon;
    });

    $$('[data-spolka]').forEach(function (n) {
      var pole = n.getAttribute('data-spolka');
      if (D.spolka[pole] != null) wstawWartosc(n, pole, D.spolka[pole]);
    });
    if (D.spolka.nazwa) $$('[data-spolka-nazwa]').forEach(function (n) { n.textContent = D.spolka.nazwa; });

    // pas zalet w hero: liczby lokali, budynków, metraż i poziomy z data.js (pełny tekst jest w HTML)
    $('[data-lokale-liczba]').textContent = D.inwestycja.lokaleLiczba != null ? D.inwestycja.lokaleLiczba : D.lokale.length;
    if (D.inwestycja.budynki != null) $('[data-budynki]').textContent = D.inwestycja.budynki;
    $('[data-powierzchnia]').textContent = zakres(D.lokale.map(function (l) { return l.powierzchnia; }));
    $('[data-poziomy]').textContent = zakres(D.lokale.map(function (l) { return l.poziomy; }));

    if (D.kosztyDodatkowe) $('[data-koszty]').textContent = D.kosztyDodatkowe;

    var rok = $('#rok');
    if (rok) rok.textContent = new Date().getFullYear();
  }

  /* ---------- 2. Wariant sekcji O inwestycji (?intro=fakty) ---------- */

  function wariantIntro() {
    var wariant = new URLSearchParams(location.search).get('intro') === 'fakty' ? 'fakty' : 'zdanie';
    $$('[data-wariant]').forEach(function (n) { n.hidden = n.getAttribute('data-wariant') !== wariant; });
  }

  /* ---------- Nawigacja ---------- */

  function nawigacja() {
    var nav = $('#nav');
    var przycisk = $('.nav__menu-przycisk');
    var panel = $('#menu-panel');

    // Od 768 px nawigacja jest przezroczysta, dopóki hero jest na ekranie (pod nawigacją);
    // potem i przy otwartym menu: tło --tynk i linia (nav--tlo). Telefon: linia po przewinięciu (nav--linia).
    var scena = $('.hero__scena');
    var heroWidoczne = !!scena;
    function stanLinii() {
      nav.classList.toggle('nav--linia', window.scrollY > 8 || !panel.hidden);
      nav.classList.toggle('nav--tlo', !heroWidoczne || !panel.hidden);
    }
    window.addEventListener('scroll', stanLinii, { passive: true });
    if (scena && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (wpisy) {
        heroWidoczne = wpisy[0].isIntersecting;
        stanLinii();
      }, { rootMargin: '-' + nav.offsetHeight + 'px 0px 0px 0px' }).observe(scena);
    }
    stanLinii();

    function zamknij(przywrocFokus) {
      panel.hidden = true;
      przycisk.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-otwarte');
      stanLinii();
      if (przywrocFokus) przycisk.focus();
    }
    function otworz() {
      panel.hidden = false;
      przycisk.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-otwarte');
      stanLinii();
      var pierwszy = $('a', panel);
      if (pierwszy) pierwszy.focus();
    }
    przycisk.addEventListener('click', function () { panel.hidden ? otworz() : zamknij(false); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) zamknij(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) zamknij(true);
    });
    window.matchMedia('(min-width: 1280px)').addEventListener('change', function (m) { if (m.matches) zamknij(false); });
  }

  /* ---------- Galeria: karuzela na scroll-snap (bez przechwytywania przewijania strony) ---------- */

  function galeria() {
    var okno = $('#galeria-okno');
    if (!okno) return;
    var zdjecia = $$('.galeria__tor > li', okno);
    var wstecz = $('.galeria__strzalka[data-kierunek="-1"]');
    var dalej = $('.galeria__strzalka[data-kierunek="1"]');

    function maksimum() { return okno.scrollWidth - okno.clientWidth; }
    // pozycja przewinięcia, przy której zdjęcie i stoi przy lewej krawędzi (nie dalej niż koniec toru)
    function pozycja(i) { return Math.min(zdjecia[i].offsetLeft - zdjecia[0].offsetLeft, maksimum()); }

    function biezace() {
      var x = okno.scrollLeft;
      if (x >= maksimum() - 2) return zdjecia.length - 1;
      var najblizsze = 0;
      zdjecia.forEach(function (_, i) {
        if (Math.abs(pozycja(i) - x) < Math.abs(pozycja(najblizsze) - x)) najblizsze = i;
      });
      return najblizsze;
    }

    // Strzałki przy krawędziach panelu; na końcach znikają (bez zapętlania).
    function odswiez() {
      wstecz.disabled = okno.scrollLeft <= 2;
      dalej.disabled = okno.scrollLeft >= maksimum() - 2;
    }

    /* Przesuw do zdjęcia własną animacją. scroll-snap jest wyłączony na czas ruchu i włączany
       dopiero na miejscu (na punkcie dociągnięcia), więc nic nie szarpie w trakcie. */
    var animacja = 0;
    var cel = null; // cel trwającego przesuwu: kolejne kliknięcia liczą się od niego
    function przewin(x) {
      cancelAnimationFrame(animacja);
      x = Math.max(0, Math.min(maksimum(), Math.round(x)));
      var od = okno.scrollLeft, droga = x - od;
      okno.classList.add('bez-snap');
      if (ruchOgraniczony.matches || Math.abs(droga) < 1) { // bez płynnej animacji
        okno.scrollLeft = x;
        okno.classList.remove('bez-snap');
        cel = null;
        return;
      }
      cel = x;
      var czas = Math.min(650, 280 + Math.abs(droga) * 0.3), start = performance.now();
      function klatka(teraz) {
        var t = Math.min(1, (teraz - start) / czas);
        okno.scrollLeft = od + droga * (1 - Math.pow(1 - t, 3)); // wyhamowanie (ease-out)
        if (t < 1) { animacja = requestAnimationFrame(klatka); return; }
        animacja = 0;
        cel = null;
        okno.classList.remove('bez-snap');
      }
      animacja = requestAnimationFrame(klatka);
    }
    function idz(kierunek) {
      var x = cel !== null ? cel : okno.scrollLeft;
      var dokad = null;
      if (kierunek > 0) {
        for (var i = 0; i < zdjecia.length; i++) if (pozycja(i) > x + 2) { dokad = pozycja(i); break; }
      } else {
        for (var j = zdjecia.length - 1; j >= 0; j--) if (pozycja(j) < x - 2) { dokad = pozycja(j); break; }
      }
      if (dokad !== null) przewin(dokad);
    }

    wstecz.addEventListener('click', function () { idz(-1); });
    dalej.addEventListener('click', function () { idz(1); });
    okno.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); idz(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); idz(-1); }
      else if (e.key === 'Home') { e.preventDefault(); przewin(0); }
      else if (e.key === 'End') { e.preventDefault(); przewin(maksimum()); }
    });

    /* Przeciąganie myszą. Ruch < 5 px to kliknięcie (otwarcie podglądu). Przesunięcie liczy się
       od miejsca, w którym przekroczono próg (bez skoku o 5 px). Wciśnięcie myszy nie daje fokusu
       zdjęciu (fokus przewinąłby galerię do częściowo widocznego zdjęcia). Po puszczeniu galeria
       dojeżdża do najbliższego zdjęcia, a przy ruchu > 80 px co najmniej do sąsiedniego.
       Dotyk i poziomy gest gładzika zostają natywne (scroll-snap). */
    var drag = null;
    var bylyPrzeciagniecie = false;
    $$('img', okno).forEach(function (img) { img.draggable = false; });
    okno.addEventListener('mousedown', function (e) { if (e.button === 0) e.preventDefault(); });
    okno.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      cancelAnimationFrame(animacja);
      animacja = 0;
      cel = null;
      drag = { id: e.pointerId, x0: e.clientX, x: 0, start: 0, indeks: biezace(), ruch: false, dx: 0 };
    });
    okno.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.ruch) {
        if (Math.abs(e.clientX - drag.x0) < 5) return;
        drag.ruch = true;
        drag.x = e.clientX;
        drag.start = okno.scrollLeft;
        okno.classList.add('bez-snap', 'is-przeciagana');
        okno.setPointerCapture(e.pointerId);
      }
      drag.dx = e.clientX - drag.x0;
      okno.scrollLeft = drag.start - (e.clientX - drag.x);
    });
    function koniecPrzeciagania() {
      if (!drag) return;
      var d = drag;
      drag = null;
      if (!d.ruch) return;
      okno.classList.remove('is-przeciagana');
      bylyPrzeciagniecie = true;
      setTimeout(function () { bylyPrzeciagniecie = false; }, 50);
      var i = biezace();
      if (i === d.indeks && Math.abs(d.dx) > 80) i = Math.max(0, Math.min(zdjecia.length - 1, i + (d.dx < 0 ? 1 : -1)));
      przewin(pozycja(i));
    }
    okno.addEventListener('pointerup', koniecPrzeciagania);
    okno.addEventListener('pointercancel', koniecPrzeciagania);
    // kliknięcie kończące przeciąganie nie otwiera podglądu
    okno.addEventListener('click', function (e) {
      if (bylyPrzeciagniecie) { e.preventDefault(); e.stopPropagation(); bylyPrzeciagniecie = false; }
    }, true);

    var zaplanowane = false;
    okno.addEventListener('scroll', function () {
      if (zaplanowane) return;
      zaplanowane = true;
      requestAnimationFrame(function () { zaplanowane = false; odswiez(); });
    }, { passive: true });
    window.addEventListener('resize', odswiez);
    window.addEventListener('load', odswiez);
    odswiez();
  }

  /* ---------- 5. Lokale i ceny ---------- */

  var wybranyLokal = null;

  function wybierzLokal(id, opts) {
    wybranyLokal = id;
    var l = lokal(id);
    $$('.wybor__obszar').forEach(function (p) {
      p.classList.toggle('is-aktywny', p.getAttribute('data-lokal') === id);
      p.setAttribute('aria-pressed', String(p.getAttribute('data-lokal') === id));
    });
    $$('.przycisk-lokalu').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lokal') === id));
    });

    var panel = $('#panel-lokalu');
    var wiersz = function (dt, dd) { return el('div', null, [el('dt', { text: dt }), el('dd', null, [dd])]); };
    panel.replaceChildren.apply(panel, [
      el('h3', { text: 'Lokal ' + l.id }),
      el('dl', null, [
        wiersz('Powierzchnia', document.createTextNode(l.powierzchnia + ' m²')),
        wiersz('Poziomy', document.createTextNode(String(l.poziomy))),
        wiersz('Pokoje', wartoscLubPlaceholder(l.pokoje, 'pokoje')),
        wiersz('Ogród/taras', wartoscLubPlaceholder(l.ogrodTaras, 'ogród/taras')),
        sprzedany(l) ? wiersz('Cena', document.createTextNode('Sprzedany')) : wiersz('Cena za m²', cena(l.cenaM2, 'cena za m²')),
        sprzedany(l) ? null : wiersz('Cena całkowita', cena(l.cenaCalkowita, 'cena')),
        wiersz('Miejsca postojowe', wartoscLubPlaceholder(l.postojKomorka, 'miejsca postojowe')),
        wiersz('Status', document.createTextNode(l.status)),
      ]),
      el('div', { class: 'panel-lokalu__akcje' }, [
        sprzedany(l) ? null : el('a', { class: 'btn', href: '#kontakt', 'data-zapytaj': l.id, 'aria-label': 'Zapytaj o lokal ' + l.id, text: 'Zapytaj o lokal' }),
        przyciskKarty(l, 'btn btn--drugi'),
      ]),
    ].filter(Boolean));
    panel.classList.remove('is-nowy');
    void panel.offsetWidth; // restart animacji wejścia
    panel.classList.add('is-nowy');
    var przycisk = $('.btn', panel); // „Zapytaj o lokal” albo przy sprzedanym „Zobacz kartę lokalu”
    if (opts && opts.fokus && przycisk) przycisk.focus({ preventScroll: true });
  }

  function nakladkaLokali() {
    var svg = $('#wybor-nakladka');
    var k = D.render1.kadr;
    svg.setAttribute('viewBox', [k.x, k.y, k.szerokosc, k.wysokosc].join(' '));
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');

    var etykiety = document.createElementNS(SVGNS, 'g');
    D.lokale.forEach(function (l) {
      var p = document.createElementNS(SVGNS, 'polygon');
      p.setAttribute('points', l.obszar.map(function (pt) { return pt.join(','); }).join(' '));
      p.setAttribute('class', 'wybor__obszar');
      p.setAttribute('data-lokal', l.id);
      // kolor obszaru wg statusu (style.css): dostepny / rezerwacja / sprzedany
      p.setAttribute('data-status', l.status === 'dostępny' ? 'dostepny' : l.status);
      p.setAttribute('tabindex', '0');
      p.setAttribute('role', 'button');
      p.setAttribute('aria-pressed', 'false');
      p.setAttribute('aria-label', 'Lokal ' + l.id + ', ' + l.status);
      p.addEventListener('click', function () { wybierzLokal(l.id); });
      // Chrome nie przewija do elementów SVG po fokusie z klawiatury, więc robimy to sami
      p.addEventListener('focus', function () {
        setTimeout(function () {
          var r = svg.getBoundingClientRect();
          if (r.top < 0 || r.bottom > window.innerHeight) svg.scrollIntoView({ block: 'center', behavior: 'instant' });
        }, 0);
      });
      p.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); wybierzLokal(l.id, { fokus: true }); }
      });
      svg.appendChild(p);

      // etykieta z literą w środku obszaru
      var cx = 0, cy = 0;
      l.obszar.forEach(function (pt) { cx += pt[0]; cy += pt[1]; });
      cx /= l.obszar.length; cy /= l.obszar.length;
      var g = document.createElementNS(SVGNS, 'g');
      g.setAttribute('class', 'wybor__etykieta');
      g.setAttribute('aria-hidden', 'true');
      var r = document.createElementNS(SVGNS, 'rect');
      r.setAttribute('x', cx - 22); r.setAttribute('y', cy - 22);
      r.setAttribute('width', 44); r.setAttribute('height', 44);
      var t = document.createElementNS(SVGNS, 'text');
      t.setAttribute('x', cx); t.setAttribute('y', cy + 1);
      t.textContent = l.id;
      g.append(r, t);
      etykiety.appendChild(g);
    });
    svg.appendChild(etykiety);

    $$('.przycisk-lokalu').forEach(function (b) {
      b.addEventListener('click', function () { wybierzLokal(b.getAttribute('data-lokal')); });
    });
  }

  function cennik() {
    var tbody = $('#cennik-wiersze');
    D.lokale.forEach(function (l) {
      var historia = el('button', { type: 'button', class: 'link', text: 'Historia cen', 'aria-label': 'Historia cen lokalu ' + l.id });
      historia.addEventListener('click', function () { oknoHistorii(l, historia); });
      var td = function (node, cls) { return el('td', cls ? { class: cls } : null, [node]); };
      tbody.appendChild(el('tr', null, [
        el('th', { scope: 'row', text: l.id }),
        td(document.createTextNode(l.powierzchnia + ' m²'), 'liczba'),
        td(document.createTextNode(String(l.poziomy))),
        // w tabeli krótki placeholder: co uzupełnić, mówi nagłówek kolumny
        td(wartoscLubPlaceholder(l.pokoje)),
        td(wartoscLubPlaceholder(l.ogrodTaras)),
        sprzedany(l) ? el('td', { colspan: '2', text: 'Sprzedany' }) : td(cena(l.cenaM2), 'liczba'),
        sprzedany(l) ? null : td(cena(l.cenaCalkowita), 'liczba'),
        td(wartoscLubPlaceholder(l.postojKomorka)),
        el('td', null, [
          document.createTextNode(l.status),
          sprzedany(l) ? null : el('a', { class: 'cennik__zapytaj', href: '#kontakt', 'data-zapytaj': l.id, 'aria-label': 'Zapytaj o lokal ' + l.id, text: 'Zapytaj o lokal' }),
        ]),
        td(historia),
        td(przyciskKarty(l, 'link')),
      ]));
    });

    dostepnosc();
  }

  /* Liczba dostępnych lokali: zawsze ze statusów w data.js. Gdy 0: komunikat i bez przycisków zapytania. */
  function dostepnosc() {
    var x = D.lokale.filter(function (l) { return l.status === 'dostępny'; }).length;
    var n = D.lokale.length;
    var slowo = x === 1 ? 'Dostępny ' : 'Dostępne ';
    var brak = 'Wszystkie lokale zostały sprzedane.';
    $('#dostepnosc').textContent = x ? slowo + x + ' z ' + n : brak;
    $$('[data-dostepnosc]').forEach(function (e) { e.textContent = x ? slowo + x + ' z ' + n + ' lokali.' : brak; });
    document.body.classList.toggle('wszystkie-sprzedane', x === 0);
  }

  /* ---------- Karta lokalu ---------- */

  function przyciskKarty(l, klasa) {
    var b = el('button', { type: 'button', class: klasa, 'aria-label': 'Zobacz kartę lokalu ' + l.id, text: 'Zobacz kartę lokalu' });
    b.addEventListener('click', function () { otworzKarte(l.id, b); });
    return b;
  }

  function otworzKarte(id, wyzwalacz) {
    var l = lokal(id);
    var okno = $('#karta');
    if (!l || !okno) return;
    var tresc = $('#karta-tresc');
    $('#karta-tytul').textContent = 'Lokal ' + l.id;
    $('#karta-status').textContent = 'Status: ' + l.status;

    // 2–4. Zakładki poziomów z rzutem i listą pomieszczeń
    var zakladki = el('div', { class: 'karta__zakladki', role: 'tablist', 'aria-label': 'Poziomy lokalu' });
    var panele = [];
    var poziomy = l.poziomyLokalu || [];
    poziomy.forEach(function (p, i) {
      var tab = el('button', {
        type: 'button', role: 'tab', id: 'karta-tab-' + i, 'aria-controls': 'karta-poziom-' + i,
        'aria-selected': String(i === 0), tabindex: i === 0 ? '0' : '-1', text: p.nazwa,
      });
      zakladki.appendChild(tab);
      var suma = p.pomieszczenia.reduce(function (s, r) { return s + r.m2; }, 0);
      var rzut = p.rzut
        ? el('img', { class: 'karta__rzut', src: p.rzut, alt: p.podpisRzutu + ', lokal ' + l.id })
        : el('div', { class: 'karta__rzut karta__rzut--brak', text: p.podpisRzutu + ' – wkrótce' });
      var lista = el('dl', { class: 'karta__pomieszczenia' }, p.pomieszczenia.map(function (r) {
        return el('div', null, [el('dt', { text: r.nazwa }), el('dd', { text: r.m2 + ' m²' })]);
      }).concat([el('div', { class: 'karta__suma' }, [el('dt', { text: 'Razem na poziomie' }), el('dd', { text: suma + ' m²' })])]));
      var panel = el('div', { role: 'tabpanel', id: 'karta-poziom-' + i, 'aria-labelledby': 'karta-tab-' + i, tabindex: '0', class: 'karta__poziom' }, [rzut, lista]);
      panel.hidden = i !== 0;
      panele.push(panel);
    });
    function wybierz(i, fokus) {
      $$('[role="tab"]', zakladki).forEach(function (t, j) {
        t.setAttribute('aria-selected', String(i === j));
        t.tabIndex = i === j ? 0 : -1;
        panele[j].hidden = i !== j;
      });
      if (fokus) $$('[role="tab"]', zakladki)[i].focus();
    }
    zakladki.addEventListener('click', function (e) {
      var t = e.target.closest('[role="tab"]');
      if (t) wybierz($$('[role="tab"]', zakladki).indexOf(t));
    });
    zakladki.addEventListener('keydown', function (e) {
      var taby = $$('[role="tab"]', zakladki);
      var i = taby.indexOf(document.activeElement);
      var n = taby.length;
      var cel = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
      if (cel !== undefined) { e.preventDefault(); wybierz(cel, true); }
    });
    var sumaLokalu = poziomy.reduce(function (s, p) {
      return s + p.pomieszczenia.reduce(function (a, r) { return a + r.m2; }, 0);
    }, 0);

    // 5. Dane lokalu z data.js
    var wiersz = function (dt, dd) { return el('div', null, [el('dt', { text: dt }), el('dd', null, [dd])]); };
    var tekst = function (t) { return document.createTextNode(t); };
    var dane = el('dl', { class: 'karta__dane' }, [
      wiersz('Powierzchnia', tekst(l.powierzchnia + ' m²')),
      wiersz('Poziomy', tekst(String(l.poziomy))),
      wiersz('Pokoje', wartoscLubPlaceholder(l.pokoje, 'pokoje')),
      wiersz('Ogród', wartoscLubPlaceholder(l.ogrodTaras, 'ogród')),
      wiersz('Miejsca postojowe', wartoscLubPlaceholder(l.postojKomorka, 'miejsca postojowe')),
      sprzedany(l) ? wiersz('Cena', tekst('Sprzedany')) : wiersz('Cena za m²', cena(l.cenaM2, 'cena za m²')),
      sprzedany(l) ? null : wiersz('Cena całkowita', cena(l.cenaCalkowita, 'cena')),
    ]);

    // 6. Historia cen (istniejące okno), 7. PDF nieaktywny, 8. zapytanie (bez sprzedanych)
    var historia = el('button', { type: 'button', class: 'link karta__historia', text: 'Historia cen', 'aria-label': 'Historia cen lokalu ' + l.id });
    historia.addEventListener('click', function () { oknoHistorii(l, historia); });
    var akcje = el('div', { class: 'karta__akcje' }, [
      sprzedany(l) ? null : el('a', { class: 'btn', href: '#kontakt', 'data-zapytaj': l.id, 'aria-label': 'Zapytaj o lokal ' + l.id, text: 'Zapytaj o lokal' }),
      el('span', { class: 'karta__pdf' }, [
        l.kartaPdf
          ? el('a', { class: 'btn btn--drugi', href: l.kartaPdf, download: '', text: 'Pobierz kartę lokalu (PDF)' })
          : el('button', { type: 'button', class: 'btn btn--drugi', disabled: '', 'aria-describedby': 'karta-pdf-wkrotce', text: 'Pobierz kartę lokalu (PDF)' }),
        l.kartaPdf ? null : el('span', { class: 'drobny', id: 'karta-pdf-wkrotce', text: 'wkrótce' }),
      ]),
    ]);

    tresc.replaceChildren(
      el('h3', { class: 'karta__naglowek', text: 'Rzuty i pomieszczenia' }),
      zakladki,
      el('div', { class: 'karta__panele' }, panele),
      el('p', { class: 'karta__razem drobny', text: 'Suma pomieszczeń wszystkich poziomów: ' + sumaLokalu + ' m²' }),
      el('h3', { class: 'karta__naglowek', text: 'Dane lokalu' }),
      dane,
      el('p', null, [historia]),
      akcje
    );

    if (!okno.open) {
      otworzOkno(okno, wyzwalacz);
      okno.addEventListener('close', function () {
        if (/^#lokal-[a-d]$/i.test(location.hash)) history.replaceState(null, '', location.pathname + location.search + '#lokale');
      }, { once: true });
    }
    history.replaceState(null, '', '#lokal-' + l.id.toLowerCase()); // link do karty można wysłać
    okno.scrollTop = 0;
  }

  function karta() {
    var okno = $('#karta');
    if (!okno) return;
    // „Zapytaj o lokal” w karcie: zamknij kartę (bez powrotu fokusu), resztę robi obsługa [data-zapytaj]
    okno.addEventListener('click', function (e) {
      if (e.target.closest('[data-zapytaj]')) { okno.dataset.bezPowrotu = '1'; okno.close(); }
    });
    function zAdresu() {
      var m = /^#lokal-([a-d])$/i.exec(location.hash);
      if (!m) return;
      $('#lokale').scrollIntoView({ behavior: 'instant', block: 'start' });
      otworzKarte(m[1].toUpperCase(), null);
    }
    window.addEventListener('hashchange', zAdresu);
    zAdresu();
  }

  /* Hero: wideo w tle — 2 klipy na zmianę (1 → 2 → 1 …) na dwóch odtwarzaczach, które zmieniają się
     przenikaniem. Pierwszy klip wczytywany dopiero po załadowaniu strony (load + requestIdleCallback), każdy
     następny dopiero wtedy, gdy poprzedni już gra; naraz wczytane są najwyżej dwa klipy. Do zdarzenia canplay,
     przy błędzie i przy zablokowanym autoodtwarzaniu widać plakat (pierwsza klatka klipu 1).
     Wcale bez wideo przy prefers-reduced-motion, oszczędzaniu danych i wolnym łączu na telefonie. */
  // hero-<nazwa>-<wysokość>.<webm|mp4> w assets/video/ (tools/wideo.sh), po kolei. Nowe nagranie = nowa nazwa
  // (pliki mają cache 30 dni; ta sama nazwa pokazywałaby u części widzów stare nagranie).
  var WIDEO_KLIPY = ['parking', 'dron'];
  var WIDEO_WYSOKOSCI = [720, 1080, 1440]; // wersje każdego klipu
  var PRZENIKANIE = 0.7;                   // s; = transition .hero__wideo w style.css
  var ZAPAS = 0.3;                         // s; timeupdate przychodzi co ok. 0,25 s
  var WIDEO_KLUCZ = 'ch51-wideo';          // localStorage: 'zatrzymane' = użytkownik zatrzymał wideo

  function bezWideo() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    var lacze = navigator.connection;
    if (lacze && lacze.saveData) return true;
    if (lacze && window.innerWidth < 768 && /(^|-)[23]g$/.test(lacze.effectiveType || '')) return true; // slow-2g, 2g, 3g
    return false;
  }

  // Wersja: wysokość nagrania na ekranie (object-fit: cover, 16:9) × devicePixelRatio (najwyżej 2), z 10% tolerancji
  // na powiększenie (np. 1280×800 → 720p, 1440×900 → 1080p, 2560×1440 albo 1440×900 przy DPR 2 → 1440p).
  // Telefon (< 768 px): zawsze 720p — scena ma ok. 490 px wysokości, a liczy się waga pobrania.
  function wysokoscWideo() {
    if (window.innerWidth < 768) return WIDEO_WYSOKOSCI[0];
    var scena = $('.hero__media');
    var px = Math.max(scena.clientHeight, scena.clientWidth * 9 / 16) * Math.min(window.devicePixelRatio || 1, 2);
    for (var i = 0; i < WIDEO_WYSOKOSCI.length; i++) {
      if (px <= WIDEO_WYSOKOSCI[i] * 1.1) return WIDEO_WYSOKOSCI[i];
    }
    return WIDEO_WYSOKOSCI[WIDEO_WYSOKOSCI.length - 1];
  }

  function poZaladowaniu(fn) {
    function bezczynnie() {
      if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 2000 });
      else setTimeout(fn, 200);
    }
    if (document.readyState === 'complete') bezczynnie();
    else window.addEventListener('load', bezczynnie, { once: true });
  }

  function pamiec(wartosc) {
    try {
      if (wartosc === undefined) return localStorage.getItem(WIDEO_KLUCZ);
      if (wartosc === null) localStorage.removeItem(WIDEO_KLUCZ); else localStorage.setItem(WIDEO_KLUCZ, wartosc);
    } catch (e) { return null; } // tryb prywatny / zablokowane dane witryny: bez zapamiętywania
  }

  function wideoHero() {
    var filmy = $$('.hero__wideo');
    var przycisk = $('.hero__pauza');
    if (filmy.length < 2 || !przycisk || bezWideo()) return; // bez wideo nie ma też przycisku pauzy
    var zatrzymane = pamiec() === 'zatrzymane'; // wybór użytkownika (także z poprzedniej wizyty)
    var zablokowane = false;  // autoodtwarzanie zablokowane albo błąd pliku: zostaje plakat
    var wczytane = false;
    var naEkranie = true;
    var przejscie = false;
    var czekaNaNastepny = false;
    var wersja = '';          // np. '1080.webm', ustalana przy pierwszym wczytaniu
    var biezacy = filmy[0];   // odtwarzacz na wierzchu

    function inny(v) { return v === filmy[0] ? filmy[1] : filmy[0]; }
    function powinnoGrac() { return wczytane && !zablokowane && !zatrzymane && naEkranie; }

    function ustawKlip(v, i) { // i = indeks w WIDEO_KLIPY; samo ustawienie src przy preload="auto" zaczyna wczytywanie
      v.dataset.klip = i;
      v.preload = 'auto';
      v.src = 'assets/video/hero-' + WIDEO_KLIPY[i] + '-' + wersja;
    }
    function przygotujNastepny() {
      ustawKlip(inny(biezacy), (Number(biezacy.dataset.klip) + 1) % WIDEO_KLIPY.length);
    }
    function graj(v) {
      var gra = v.play();
      if (gra && gra.catch) gra.catch(function (e) {
        if (e && e.name === 'NotAllowedError') zablokuj(); // AbortError (pauza, zmiana src) nie jest blokadą
      });
    }
    function zablokuj() {
      zablokowane = true;
      filmy.forEach(function (v) { v.pause(); v.classList.remove('is-gotowe', 'is-wierzch'); });
      przycisk.hidden = true;
    }
    function zatrzymaj() { filmy.forEach(function (v) { v.pause(); }); }
    function wznow() {
      graj(biezacy);
      if (przejscie && !inny(biezacy).ended) graj(inny(biezacy));
    }

    // Następny klip na wierzch i w 0,7 s nad bieżącym (który gra dalej pod spodem), potem bieżący stoi
    // i dostaje kolejny klip. Jeśli następny jeszcze się nie wczytał, bieżący stoi na ostatniej klatce.
    function przenikaj() {
      if (przejscie || zablokowane) return;
      var stary = biezacy;
      var nowy = inny(stary);
      if (nowy.readyState < 3) { // HAVE_FUTURE_DATA
        if (!czekaNaNastepny) {
          czekaNaNastepny = true;
          nowy.addEventListener('canplay', function () { czekaNaNastepny = false; przenikaj(); }, { once: true });
        }
        return;
      }
      przejscie = true;
      biezacy = nowy;
      if (powinnoGrac()) graj(nowy);
      nowy.classList.add('is-wierzch', 'is-gotowe');
      stary.classList.remove('is-wierzch');
      setTimeout(function () {
        stary.pause();
        stary.classList.remove('is-gotowe');
        przejscie = false;
        przygotujNastepny();
      }, PRZENIKANIE * 1000 + 100);
    }

    filmy.forEach(function (v) {
      v.addEventListener('timeupdate', function () {
        if (v !== biezacy || przejscie || !v.duration) return;
        if (v.duration - v.currentTime <= (PRZENIKANIE + ZAPAS) * v.playbackRate) przenikaj();
      });
      v.addEventListener('ended', function () { if (v === biezacy) przenikaj(); });
      v.addEventListener('error', function () { if (v.getAttribute('src')) zablokuj(); });
    });

    function wczytaj() {
      if (wczytane) return;
      wczytane = true;
      var v = filmy[0];
      wersja = wysokoscWideo() + (v.canPlayType('video/webm; codecs="vp9"') ? '.webm' : '.mp4');
      filmy.forEach(function (f) { f.muted = true; }); // autoodtwarzanie w przeglądarkach wymaga wyciszenia
      v.addEventListener('canplay', function () {
        if (zablokowane) return;
        v.classList.add('is-wierzch', 'is-gotowe');
        przycisk.hidden = false;
      }, { once: true });
      v.addEventListener('playing', przygotujNastepny, { once: true }); // klip 2 dopiero, gdy klip 1 gra
      ustawKlip(v, 0);
      if (powinnoGrac()) graj(v);
    }

    function ustawPrzycisk() {
      przycisk.classList.toggle('is-zatrzymane', zatrzymane);
      przycisk.setAttribute('aria-label', zatrzymane ? 'Odtwórz wideo' : 'Zatrzymaj wideo');
    }
    przycisk.addEventListener('click', function () {
      zatrzymane = !zatrzymane;
      pamiec(zatrzymane ? 'zatrzymane' : null);
      ustawPrzycisk();
      if (zatrzymane) zatrzymaj();
      else if (!wczytane) wczytaj();
      else wznow();
    });
    ustawPrzycisk();

    if (zatrzymane) {
      przycisk.hidden = false; // zatrzymane w poprzedniej wizycie: plakat i „Odtwórz wideo”, wideo się nie wczytuje
    } else {
      poZaladowaniu(wczytaj);
    }

    // poza ekranem wideo stoi (mniej pracy procesora), po powrocie gra dalej, chyba że użytkownik je zatrzymał
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (wpisy) {
        naEkranie = wpisy[0].isIntersecting;
        if (!wczytane || zablokowane || zatrzymane) return;
        if (naEkranie) wznow(); else zatrzymaj();
      }).observe($('.hero__media'));
    }
  }

  /* Telefon: dolny pasek „Zadzwoń” / „Zapytaj o lokal”. Widoczny po przewinięciu poza hero,
     schowany, gdy widać Kontakt albo stopkę albo otwarte jest menu. */
  function pasekDolny() {
    var pasek = $('#pasek-dolny');
    if (!pasek || !('IntersectionObserver' in window)) return;
    var stan = { hero: true, kontakt: false, stopka: false };
    function odswiez() {
      var widoczny = !stan.hero && !stan.kontakt && !stan.stopka && !document.body.classList.contains('menu-otwarte');
      pasek.classList.toggle('is-widoczny', widoczny);
    }
    [['hero', '#gora'], ['kontakt', '#kontakt'], ['stopka', 'footer']].forEach(function (para) {
      new IntersectionObserver(function (wpisy) {
        stan[para[0]] = wpisy[0].isIntersecting;
        odswiez();
      }).observe($(para[1]));
    });
    new MutationObserver(odswiez).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  /* Skróty w prawym dolnym rogu: widoczne po przewinięciu poza hero i przy zamkniętym menu;
     „Zapytaj o lokal” (koperta) schowany, gdy widać Kontakt albo stopkę. Kliknięcie koperty obsługuje [data-zapytaj]. */
  function skroty() {
    var formularz = $('.skroty__btn--formularz'), gora = $('#na-gore');
    if (!gora) return;
    gora.addEventListener('click', function () {
      przewinDo($('#gora'), $('.przeskocz')); // fokus na początek strony: następny Tab trafia do nawigacji
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    });
    if (!('IntersectionObserver' in window)) return;
    var stan = { hero: true, kontakt: false, stopka: false };
    function odswiez() {
      var menu = document.body.classList.contains('menu-otwarte');
      gora.classList.toggle('is-ukryty', stan.hero || menu);
      formularz.classList.toggle('is-ukryty', stan.hero || menu || stan.kontakt || stan.stopka);
    }
    [['hero', '#gora'], ['kontakt', '#kontakt'], ['stopka', 'footer']].forEach(function (para) {
      new IntersectionObserver(function (wpisy) {
        stan[para[0]] = wpisy[0].isIntersecting;
        odswiez();
      }).observe($(para[1]));
    });
    new MutationObserver(odswiez).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    odswiez();
  }

  function oknoHistorii(l, wyzwalacz) {
    var okno = $('#okno-historia');
    $('#okno-historia-tytul').textContent = 'Historia cen lokalu ' + l.id;
    var tabela = el('table', null, [
      el('thead', null, [el('tr', null, [
        el('th', { scope: 'col', text: 'Data' }),
        el('th', { scope: 'col', text: 'Cena za m²' }),
        el('th', { scope: 'col', text: 'Cena całkowita' }),
      ])]),
      el('tbody', null, l.historiaCen.map(function (h) {
        return el('tr', null, [
          el('td', null, [data(h.data)]),
          el('td', null, [cena(h.cenaM2, 'cena za m²')]),
          el('td', null, [cena(h.cenaCalkowita, 'cena')]),
        ]);
      })),
    ]);
    $('#okno-historia-tresc').replaceChildren(tabela);
    otworzOkno(okno, wyzwalacz);
  }

  /* Wspólna obsługa okien modalnych (<dialog>): showModal więzi fokus, blokujemy przewijanie
     strony, a po zamknięciu fokus wraca na element, który okno otworzył. */
  var FOKUSOWALNE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  function wiezFokus(e) {
    if (e.key !== 'Tab') return;
    var elementy = $$(FOKUSOWALNE, e.currentTarget).filter(function (n) { return n.offsetParent !== null; });
    if (!elementy.length) return;
    var pierwszy = elementy[0], ostatni = elementy[elementy.length - 1];
    if (e.shiftKey && document.activeElement === pierwszy) { e.preventDefault(); ostatni.focus(); }
    else if (!e.shiftKey && document.activeElement === ostatni) { e.preventDefault(); pierwszy.focus(); }
  }

  function otworzOkno(okno, wyzwalacz) {
    if (!okno.dataset.fokus) { okno.addEventListener('keydown', wiezFokus); okno.dataset.fokus = '1'; }
    okno.showModal();
    document.body.classList.add('zablokowane');
    okno.addEventListener('close', function () {
      if (!document.querySelector('dialog[open]')) document.body.classList.remove('zablokowane');
      if (wyzwalacz && !okno.dataset.bezPowrotu && document.contains(wyzwalacz)) wyzwalacz.focus({ preventScroll: true });
      delete okno.dataset.bezPowrotu;
    }, { once: true });
  }

  /* ---------- Podgląd zdjęć na pełnym ekranie ---------- */

  function podglad() {
    var okno = $('#podglad');
    var zrodla = $$('[data-podglad]');
    if (!okno || !zrodla.length) return;
    var obraz = $('.podglad__obraz', okno), podpis = $('.podglad__podpis', okno), licznik = $('.podglad__licznik', okno);
    var biezacy = 0;

    function pokaz(i) {
      biezacy = (i + zrodla.length) % zrodla.length;
      var zrodlo = zrodla[biezacy];
      // największa dostępna wersja: ten sam srcset, sizes 100vw, bez lazy-loadingu
      var obrazek = zrodlo.querySelector('picture').cloneNode(true);
      $$('source, img', obrazek).forEach(function (n) { n.setAttribute('sizes', '100vw'); });
      var img = $('img', obrazek);
      img.removeAttribute('loading');
      img.draggable = false;
      obraz.replaceChildren(obrazek);
      var fig = zrodlo.closest('figure');
      var cap = fig && $('figcaption', fig);
      podpis.textContent = cap ? cap.textContent : img.alt;
      licznik.textContent = (biezacy + 1) + ' / ' + zrodla.length;
    }

    zrodla.forEach(function (przycisk, i) {
      przycisk.addEventListener('click', function () {
        pokaz(i);
        otworzOkno(okno, przycisk);
      });
    });
    $$('[data-kierunek]', okno).forEach(function (b) {
      b.addEventListener('click', function () { pokaz(biezacy + Number(b.getAttribute('data-kierunek'))); });
    });
    okno.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); pokaz(biezacy + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); pokaz(biezacy - 1); }
    });
    // kliknięcie w tło (poza zdjęciem, podpisem i przyciskami) zamyka
    okno.addEventListener('click', function (e) {
      if (e.target === okno || e.target.classList.contains('podglad__obraz') || e.target.classList.contains('podglad__scena')) okno.close();
    });
    // przesuwanie palcem
    var start = null;
    okno.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') start = { x: e.clientX, y: e.clientY }; });
    okno.addEventListener('pointerup', function (e) {
      if (!start) return;
      var dx = e.clientX - start.x, dy = e.clientY - start.y;
      start = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) pokaz(biezacy + (dx < 0 ? 1 : -1));
    });
  }

  function oknaZamykanie() {
    $$('dialog').forEach(function (d) {
      $$('[data-zamknij]', d).forEach(function (b) { b.addEventListener('click', function () { d.close(); }); });
      d.addEventListener('click', function (e) { if (e.target === d) d.close(); }); // kliknięcie w tło
    });
  }

  /* ---------- 6. Lokalizacja (Leaflet) ---------- */

  var KATEGORIE = {
    szkoly: 'Szkoła',
    sklepy: 'Sklep',
    komunikacja: 'Komunikacja',
    zielen: 'Rekreacja',
  };

  /*
   * Leaflet przy przerywaniu i usuwaniu kafelków (przesuwanie, zoom) podmienia ich src na obrazek data:,
   * który blokuje CSP (img-src bez data:). Ta warstwa robi to samo, ale z pustym GIF-em z własnej domeny.
   * Kod metod jak w Leaflet 1.9.4 (TileLayer._abortLoading, _removeTile, _tileReady), zmieniony tylko adres obrazka.
   */
  var PUSTY_KAFELEK = 'assets/img/pusty.gif';
  var IKONY = 'assets/icons/ikony.svg#'; // sprite z tools/ikony.py
  var KafelkiBezDataUri = window.L && L.TileLayer.extend({
    _abortLoading: function () {
      for (var i in this._tiles) {
        if (this._tiles[i].coords.z !== this._tileZoom) {
          var tile = this._tiles[i].el;
          tile.onload = L.Util.falseFn;
          tile.onerror = L.Util.falseFn;
          if (!tile.complete) {
            tile.src = PUSTY_KAFELEK;
            var coords = this._tiles[i].coords;
            L.DomUtil.remove(tile);
            delete this._tiles[i];
            this.fire('tileabort', { tile: tile, coords: coords });
          }
        }
      }
    },
    _removeTile: function (key) {
      var tile = this._tiles[key];
      if (!tile) { return; }
      tile.el.setAttribute('src', PUSTY_KAFELEK); // przerywa trwające pobieranie
      return L.GridLayer.prototype._removeTile.call(this, key);
    },
    _tileReady: function (coords, err, tile) {
      if (!this._map || (tile && tile.getAttribute('src') === PUSTY_KAFELEK)) { return; }
      return L.GridLayer.prototype._tileReady.call(this, coords, err, tile);
    },
  });

  function mapa() {
    var kontener = $('#mapa');
    if (!window.L || !kontener) return;
    var m = D.mapa;
    var srodek = m.wspolrzedne;

    var map = L.map(kontener, { scrollWheelZoom: false, zoomControl: true });

    // Widok startowy od razu z docelowego obszaru (bez setView + fitBounds, które przerywałoby ładowanie kafelków):
    // adres i punkty w promieniu ok. 1,6 km; dalsze (np. rezerwat, stacja) widać po oddaleniu.
    var blisko = [srodek];
    Object.keys(KATEGORIE).forEach(function (kat) {
      (m.poi[kat] || []).forEach(function (p) {
        if (L.latLng(srodek).distanceTo(p.wspolrzedne) < 1600) blisko.push(p.wspolrzedne);
      });
    });
    map.fitBounds(L.latLngBounds(blisko), { padding: [24, 24], maxZoom: m.zoom });
    new KafelkiBezDataUri('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">autorzy OpenStreetMap</a>',
    }).addTo(map);
    map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');

    var pinezka = L.divIcon({
      className: 'pinezka',
      html: '<svg class="ikona" aria-hidden="true" focusable="false"><use href="' + IKONY + 'pinezka"></use></svg>',
      iconSize: [44, 44],
      iconAnchor: [22, 41], // czubek pinezki Tabler map-pin (y ≈ 22,4 z 24)
      tooltipAnchor: [0, -38],
    });
    L.marker(srodek, { icon: pinezka, title: 'Chodzieska 51', alt: 'Chodzieska 51', zIndexOffset: 1000 })
      .addTo(map)
      .bindTooltip('Chodzieska 51', { direction: 'top' });

    var warstwy = {};
    Object.keys(KATEGORIE).forEach(function (kat) {
      warstwy[kat] = L.layerGroup((m.poi[kat] || []).map(function (p) {
        var ikona = L.divIcon({
          className: '',
          html: '<span class="poi"><svg class="ikona" aria-hidden="true" focusable="false"><use href="' + IKONY + kat + '"></use></svg></span>',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });
        return L.marker(p.wspolrzedne, { icon: ikona, title: p.nazwa, alt: p.nazwa, keyboard: true })
          .bindTooltip(p.nazwa, { direction: 'top', offset: [0, -14] })
          .bindPopup('<strong>' + p.nazwa.replace(/</g, '&lt;') + '</strong><br>' + KATEGORIE[kat]);
      })).addTo(map);
    });



    $$('.filtr').forEach(function (b) {
      b.addEventListener('click', function () {
        var kat = b.getAttribute('data-kategoria');
        var wl = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', String(wl));
        if (wl) warstwy[kat].addTo(map); else map.removeLayer(warstwy[kat]);
      });
    });

    var dl = $('#dojazdy');
    D.dojazdy.forEach(function (d) {
      dl.appendChild(el('div', null, [el('dt', { text: d.cel }), el('dd', null, [wartoscLubPlaceholder(d.czas, 'czas')])]));
    });
  }

  function mapaLeniwie() {
    var sekcja = $('#lokalizacja');
    if (!('IntersectionObserver' in window)) return mapa();
    var io = new IntersectionObserver(function (wpisy) {
      if (wpisy.some(function (w) { return w.isIntersecting; })) { io.disconnect(); mapa(); }
    }, { rootMargin: '400px 0px' });
    io.observe(sekcja);
  }

  /* ---------- Formularze ---------- */

  function pokazBlad(pole, blad, tekst) {
    blad.textContent = tekst || '';
    blad.hidden = !tekst;
    if (pole) {
      if (tekst) pole.setAttribute('aria-invalid', 'true');
      else pole.removeAttribute('aria-invalid');
    }
    return !tekst;
  }

  function poprawnyEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function poprawnyTelefon(v) {
    var cyfry = v.replace(/[\s\-()]/g, '');
    return /^(\+48|0048)?\d{9}$/.test(cyfry) || /^\+\d{8,15}$/.test(cyfry);
  }

  function formularzKontaktowy() {
    var form = $('#formularz-kontakt');
    var naglowek = $('#kontakt-naglowek');
    var wiadomosc = $('#k-wiadomosc');
    var probowano = false;

    var imie = $('#k-imie'), tel = $('#k-telefon'), email = $('#k-email');
    var zgodaKontakt = $('#k-zgoda-kontakt'), zgodaPolityka = $('#k-zgoda-polityka');
    var wszystkie = $('#k-zgody-wszystkie');
    var zgody = $$('[data-zgoda]', form);

    function wybrane(nazwa) {
      var r = $('input[name="' + nazwa + '"]:checked', form);
      return r ? r.value : '';
    }

    function waliduj() {
      var ok = true;
      var v = imie.value.trim();
      ok = pokazBlad(imie, $('#k-imie-blad'), !v ? 'Wpisz imię.' : v.length < 2 ? 'Imię powinno mieć co najmniej 2 litery.' : '') && ok;

      v = tel.value.trim();
      ok = pokazBlad(tel, $('#k-telefon-blad'), !v ? 'Wpisz numer telefonu.' : !poprawnyTelefon(v) ? 'Wpisz 9 cyfr numeru, np. 600 700 800 albo +48 600 700 800.' : '') && ok;

      v = email.value.trim();
      ok = pokazBlad(email, $('#k-email-blad'), !v ? 'Wpisz adres e-mail.' : !poprawnyEmail(v) ? 'Sprawdź adres e-mail. Powinien wyglądać tak: imie@domena.pl.' : '') && ok;

      var forma = wybrane('forma_kontaktu');
      ok = pokazBlad(null, $('#k-forma-blad'), !forma ? 'Wybierz, czy wolisz kontakt telefoniczny czy e-mailowy.' : '') && ok;
      $('#k-forma-grupa').toggleAttribute('data-blad', !forma);

      ok = pokazBlad(zgodaKontakt, $('#k-zgoda-kontakt-blad'), !zgodaKontakt.checked ? 'Zaznacz zgodę na kontakt, żebyśmy mogli odpowiedzieć na zapytanie.' : '') && ok;
      ok = pokazBlad(zgodaPolityka, $('#k-zgoda-polityka-blad'), !zgodaPolityka.checked ? 'Zaakceptuj politykę prywatności, żebyśmy mogli odpowiedzieć na zapytanie.' : '') && ok;
      return ok;
    }

    function stanWszystkich() {
      var ile = zgody.filter(function (z) { return z.checked; }).length;
      wszystkie.checked = ile === zgody.length;
      wszystkie.indeterminate = ile > 0 && ile < zgody.length;
    }
    wszystkie.addEventListener('change', function () {
      zgody.forEach(function (z) { z.checked = wszystkie.checked; });
      if (probowano) waliduj();
    });
    zgody.forEach(function (z) { z.addEventListener('change', stanWszystkich); });
    // zgody nigdy nie są zaznaczone z góry, także po odświeżeniu strony (przeglądarki przywracają stan pól)
    function odznaczZgody() { zgody.concat([wszystkie]).forEach(function (z) { z.checked = false; }); stanWszystkich(); }
    odznaczZgody();
    window.addEventListener('pageshow', odznaczZgody);

    form.addEventListener('change', function () { if (probowano) waliduj(); });
    form.addEventListener('input', function () { if (probowano) waliduj(); });

    // Formularz nie ma backendu: przechwytujemy wysyłkę i pokazujemy stan sukcesu bez wysyłania danych.
    // TODO: Pages Function functions/api/kontakt.js + Cloudflare Turnstile + dostawca e-mail (np. Resend).
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      probowano = true;
      if (!waliduj()) {
        var pierwszy = $('[aria-invalid="true"], [data-blad] input', form);
        if (pierwszy) pierwszy.focus();
        return;
      }
      var sukces = $('#kontakt-sukces');
      form.hidden = true;
      sukces.hidden = false;
      sukces.classList.add('is-nowy');
      sukces.focus();
    });

    // Przyciski "Zapytaj o lokal X": przewijają do formularza i wpisują do wiadomości
    // edytowalny tekst. Formularz nie wybiera lokalu, bo lokal może być już sprzedany.
    var AUTO = /^Dzień dobry, interesuje mnie lokal [A-Z]\.$/;
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-zapytaj]');
      if (!a) return;
      e.preventDefault();
      var id = a.getAttribute('data-zapytaj');
      if (form.hidden) { // ponowne zapytanie po wysłaniu
        form.reset();
        stanWszystkich();
        form.hidden = false;
        $('#kontakt-sukces').hidden = true;
        probowano = false;
      }
      if (id) {
        var tekst = 'Dzień dobry, interesuje mnie lokal ' + id + '.';
        var obecny = wiadomosc.value.trim();
        if (!obecny || AUTO.test(obecny)) wiadomosc.value = tekst;
        else if (obecny.indexOf(tekst) === -1) wiadomosc.value = tekst + '\n\n' + wiadomosc.value; // tekst użytkownika zostaje
      }
      // kursor na końcu wiadomości ustawiamy przed przewinięciem (zrobione później przerywa płynne przewijanie)
      if (id) wiadomosc.setSelectionRange(wiadomosc.value.length, wiadomosc.value.length);
      // desktop: cała sekcja (zdjęcie i formularz mieszczą się na ekranie); węższe układy: formularz stoi
      // pod zdjęciem i danymi kontaktowymi, więc przewijamy prosto do jego nagłówka
      var doFormularza = !window.matchMedia('(min-width: 1000px)').matches;
      przewinDo(doFormularza ? naglowek : $('#kontakt'), id ? wiadomosc : naglowek);
      history.replaceState(null, '', '#kontakt');
    });
  }

  function formularzPowiadomien() {
    var form = $('#formularz-powiadomienia');
    var email = $('#pow-email'), zgoda = $('#pow-zgoda');
    var probowano = false;

    function waliduj() {
      var v = email.value.trim();
      var ok = pokazBlad(email, $('#pow-email-blad'), !v ? 'Wpisz adres e-mail.' : !poprawnyEmail(v) ? 'Sprawdź adres e-mail. Powinien wyglądać tak: imie@domena.pl.' : '');
      ok = pokazBlad(zgoda, $('#pow-zgoda-blad'), !zgoda.checked ? 'Zaznacz zgodę, żebyśmy mogli wysłać powiadomienie.' : '') && ok;
      return ok;
    }
    form.addEventListener('input', function () { if (probowano) waliduj(); });
    form.addEventListener('change', function () { if (probowano) waliduj(); });
    // Wysyłka działa tak samo jak w sekcji Kontakt: brak backendu, tylko stan sukcesu.
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      probowano = true;
      if (!waliduj()) { $('[aria-invalid="true"]', form).focus(); return; }
      var sukces = $('#powiadomienia-sukces');
      form.hidden = true;
      sukces.hidden = false;
      sukces.classList.add('is-nowy');
      sukces.focus();
    });
  }

  /* ---------- Przewijanie do sekcji ---------- */
  /*
   * Jeden gest kółka / gładzika = jeden płynny przejazd do początku następnej (albo poprzedniej)
   * sekcji, wyrównany do dolnej krawędzi nawigacji, tak żeby sekcja wypełniała ekran.
   * Sekcje wyższe niż ekran przewijają się ekranami (z zakładką), więc nic nie jest pomijane.
   * Krótkie sekcje widoczne już w całości (np. pas CTA nad „Kolejnymi inwestycjami”) nie
   * zatrzymują przejazdu na kilkadziesiąt pikseli.
   * Zwykłe przewijanie zostaje: przy prefers-reduced-motion, przy dotyku, przy poziomym geście
   * gładzika, z Ctrl (zoom), gdy otwarte jest okno albo menu i nad elementem, który sam się
   * przewija w pionie (karta lokalu, panel menu, pole wiadomości). Galeria nie reaguje na pionowe
   * kółko, więc nie zatrzymuje przejazdu. Klawiatura i pasek przewijania działają jak zwykle.
   */
  var zatrzymajPrzejazd = function () {}; // ustawiane w przewijanieDoSekcji(); wołane przed przewijaniem programowym
  var CZAS_PRZEJAZDU = { min: 500, max: 1000, msNaPx: 0.45 }; // czas = 300 ms + 0,45 ms/px, w granicach
  var ZAKLADKA = 80;        // ile pikseli poprzedniego ekranu zostaje widać przy przewijaniu wysokiej sekcji
  var TOLERANCJA = 120;     // sekcja tylko o tyle wyższa od ekranu nie jest dzielona (to głównie jej dolny odstęp)

  function przewijanieDoSekcji() {
    var animacja = 0;
    var ustawionePrzezNas = -1;
    var koniecPrzejazdu = 0;
    var ostatnieKolko = 0;

    function maksimum() { return document.documentElement.scrollHeight - window.innerHeight; }
    function wysokoscNawigacji() { var n = $('#nav'); return n ? n.offsetHeight : 0; }

    function przewijaSieSam(el, deltaY) {
      for (; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
        var cs = getComputedStyle(el);
        if (!/(auto|scroll)/.test(cs.overflowY) || el.scrollHeight <= el.clientHeight) continue;
        if (deltaY > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
      }
      return false;
    }

    // Punkty zatrzymania: początek każdej sekcji pod nawigacją, a w wysokich sekcjach co ekran i jej koniec.
    function punkty() {
      var vh = window.innerHeight, nav = wysokoscNawigacji(), max = maksimum();
      var ekran = vh - nav;
      var krok = ekran - ZAKLADKA;
      var lista = [];
      $$('#gora, main > section, body > footer').forEach(function (sekcja, i) {
        var gora = sekcja.getBoundingClientRect().top + window.scrollY;
        var dol = gora + sekcja.offsetHeight;
        var start = i === 0 ? 0 : gora - nav;
        lista.push(start);
        if (sekcja.offsetHeight > ekran + TOLERANCJA) {
          for (var y = start + krok; y < dol - vh; y += krok) lista.push(y);
          lista.push(dol - vh);
        }
      });
      return lista.map(function (y) { return Math.round(Math.max(0, Math.min(max, y))); })
        .filter(function (y, i, a) { return a.indexOf(y) === i; })
        .sort(function (x, y) { return x - y; });
    }

    // Cel w danym kierunku: pierwszy punkt co najmniej 30% ekranu dalej, ale nie dalej niż ekran
    // (wtedy najdalszy punkt w zasięgu ekranu, żeby nie przeskoczyć treści).
    function cel(kierunek) {
      var y = window.scrollY, vh = window.innerHeight;
      var zasieg = vh - wysokoscNawigacji() + TOLERANCJA;
      var minimum = vh * 0.3;
      var p = punkty();
      if (kierunek < 0) p = p.slice().reverse();
      var dalej = p.filter(function (c) { return kierunek > 0 ? c > y + 1 : c < y - 1; });
      if (!dalej.length) return null;
      var odl = function (c) { return Math.abs(c - y); };
      var kandydat = dalej.filter(function (c) { return odl(c) >= minimum; })[0];
      if (kandydat === undefined) return dalej[dalej.length - 1];
      if (odl(kandydat) <= zasieg) return kandydat;
      var wZasiegu = dalej.filter(function (c) { return odl(c) <= zasieg; });
      return wZasiegu.length ? wZasiegu[wZasiegu.length - 1] : kandydat;
    }

    function wygladzenie(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; } // ease-in-out (sześcienne)

    function jedz(doY) {
      stop();
      var odY = window.scrollY, droga = doY - odY;
      if (Math.abs(droga) < 1) return;
      var czas = Math.max(CZAS_PRZEJAZDU.min, Math.min(CZAS_PRZEJAZDU.max, 300 + Math.abs(droga) * CZAS_PRZEJAZDU.msNaPx));
      var start = performance.now();
      function klatka(teraz) {
        // zewnętrzne przewinięcie (kotwica, klawiatura, pasek przewijania) przerywa przejazd
        if (ustawionePrzezNas >= 0 && Math.abs(window.scrollY - ustawionePrzezNas) > 2) { stop(); return; }
        var t = Math.min(1, (teraz - start) / czas);
        window.scrollTo({ top: odY + droga * wygladzenie(t), behavior: 'instant' });
        ustawionePrzezNas = window.scrollY;
        if (t < 1) animacja = requestAnimationFrame(klatka);
        else { stop(); koniecPrzejazdu = performance.now(); }
      }
      animacja = requestAnimationFrame(klatka);
    }
    function stop() {
      cancelAnimationFrame(animacja);
      animacja = 0;
      ustawionePrzezNas = -1;
    }

    zatrzymajPrzejazd = stop;
    // kliknięcie (np. link do sekcji, pasek przewijania), klawiatura i dotyk przejmują przewijanie
    ['mousedown', 'keydown', 'touchstart'].forEach(function (typ) {
      window.addEventListener(typ, function () { if (animacja) stop(); }, { passive: true, capture: true });
    });

    window.addEventListener('wheel', function (e) {
      if (e.defaultPrevented || e.ctrlKey || ruchOgraniczony.matches) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (document.querySelector('dialog[open]') || document.body.classList.contains('menu-otwarte')) return;
      if (przewijaSieSam(e.target, e.deltaY)) return;
      e.preventDefault();
      var teraz = performance.now();
      var przerwa = teraz - ostatnieKolko;
      ostatnieKolko = teraz;
      if (animacja) return; // w trakcie przejazdu kolejne zdarzenia tego samego gestu są pomijane
      // nowy gest: przerwa w zdarzeniach albo wyraźny obrót po zakończonym przejeździe
      // (bezwładność gładzika po przejeździe wysyła drobne zdarzenia, które nie startują kolejnego)
      var nowyGest = przerwa > 180 || (teraz - koniecPrzejazdu > 350 && Math.abs(e.deltaY) >= 20);
      if (!nowyGest) return;
      var doY = cel(e.deltaY > 0 ? 1 : -1);
      if (doY !== null) jedz(doY);
    }, { passive: false });
  }

  /* ---------- Start ---------- */

  function start() {
    if (!D) { console.error('Brak danych: assets/js/data.js'); return; }
    wypelnijDane();
    wariantIntro();
    nawigacja();
    nakladkaLokali();
    cennik();
    oknaZamykanie();
    formularzKontaktowy();
    formularzPowiadomien();
    galeria();
    podglad();
    karta();
    pasekDolny();
    skroty();
    wideoHero();
    przewijanieDoSekcji();
    mapaLeniwie();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
