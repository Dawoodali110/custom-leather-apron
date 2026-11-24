/* Design with AI page — preview-based designer (keyword parser, no external AI yet) */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var esc = window.CLA.esc;

  var COLORS = [
    { id: 'cognac', name: 'Cognac', hex: '#A0582A', dark: '#5A2F17' },
    { id: 'chestnut', name: 'Chestnut', hex: '#8A4A26', dark: '#4A2412' },
    { id: 'dark', name: 'Dark Brown', hex: '#4A2A18', dark: '#24130A' },
    { id: 'black', name: 'Black', hex: '#221C18', dark: '#0E0B09' },
    { id: 'olive', name: 'Olive', hex: '#4B5230', dark: '#262A16' },
    { id: 'navy', name: 'Navy', hex: '#2C3A4A', dark: '#141C25' },
    { id: 'burgundy', name: 'Burgundy', hex: '#7E1F1C', dark: '#45100E' }
  ];
  var FINISHES = [
    { id: 'matte', label: 'Classic Matte', fill: '#000', op: 0 },
    { id: 'vintage', label: 'Vintage Distressed', fill: '#1A0F08', op: 0.28 },
    { id: 'waxed', label: 'Waxed Pull-up', fill: '#FFE2B8', op: 0.1 },
    { id: 'polished', label: 'Smooth Polished', fill: '#FFFFFF', op: 0.16 }
  ];
  var FULL = 'M66 22 H134 L138 72 C144 84 158 88 172 90 L178 226 C126 236 74 236 22 226 L28 90 C42 88 56 84 62 72 Z';
  var BIB = 'M58 22 H142 L146 104 L172 108 L176 226 C126 236 74 236 24 226 L28 108 L54 104 Z';
  var WAIST = 'M24 110 H176 L178 226 C126 236 74 236 22 226 Z';
  var NECK = 'M78 22 C82 -2 118 -2 122 22', CROSS = 'M72 22 L124 -20 M128 22 L76 -20';
  var STYLES = [
    { id: 'classic', label: 'Classic', body: FULL, strap: NECK },
    { id: 'crossback', label: 'Crossback', body: FULL, strap: CROSS },
    { id: 'bib', label: 'Bib', body: BIB, strap: NECK },
    { id: 'waist', label: 'Waist', body: WAIST, strap: '' }
  ];
  var TABS = [
    { id: 'customize', label: 'Customize', icon: 'M4 7h9M17 7h3M4 17h3M11 17h9 M17 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0z M11 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0z' },
    { id: 'logo', label: 'Logo', icon: 'M3 4h18v16H3z M21 16l-5-5-8 9 M11 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z' },
    { id: 'text', label: 'Text', icon: 'M5 5h14M12 5v15M9 20h6' },
    { id: 'details', label: 'Details', icon: 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2' }
  ];
  var DETAILS = [['brass', 'Solid brass hardware'], ['towel', 'Towel loop'], ['pens', 'Pen & tool pockets'], ['ring', 'D-ring for tongs']];
  var PRESETS = [
    { prompt: 'Chef’s apron with large pockets', label: 'CHEF', img: 'chef', title: 'Chef Apron', color: 'black', finish: 'vintage', style: 'crossback', icon: 'M7 10a4 4 0 1 1 2.5-7 4 4 0 0 1 5 0A4 4 0 1 1 17 10v4H7z M7 17h10' },
    { prompt: 'Barber-style apron with a modern look', label: 'BARBER', img: 'barber', title: 'Barber Apron', color: 'black', finish: 'polished', style: 'crossback', icon: 'M9 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M8.5 7.5L20 18 M8.5 16.5L20 6' },
    { prompt: 'Workshop apron with tool holders', label: 'WORKSHOP', img: 'workshop', title: 'Workshop Apron', color: 'black', finish: 'waxed', style: 'crossback', icon: 'M3 21l9-9 M10 6l4-4 6 6-4 4z' },
    { prompt: 'BBQ apron with a rugged design', label: 'BBQ MASTER', img: 'bbq', title: 'BBQ Apron', color: 'black', finish: 'vintage', style: 'crossback', icon: 'M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-4 0-7z' },
    { prompt: 'A premium apron with my logo', label: 'CUSTOM', img: 'custom', title: 'Custom Logo Apron', color: 'black', finish: 'polished', style: 'crossback', icon: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z' }
  ];

  var st = { d: { color: 'cognac', finish: 'matte', style: 'crossback', text: '', photo: 'brown' }, past: [], future: [], tab: 'customize', details: { brass: true, pens: true }, spin: false };
  function find(arr, id) { return arr.filter(function (x) { return x.id === id; })[0] || arr[0]; }
  function commit(ch) {
    st.past.push(Object.assign({}, st.d)); if (st.past.length > 30) st.past.shift();
    st.future = []; Object.assign(st.d, ch); draw();
  }
  function parse(p) {
    var t = p.toLowerCase(), o = {};
    if (/black/.test(t)) o.color = 'black'; else if (/olive|green/.test(t)) o.color = 'olive'; else if (/navy|blue/.test(t)) o.color = 'navy';
    else if (/dark brown|chocolate/.test(t)) o.color = 'dark'; else if (/chestnut/.test(t)) o.color = 'chestnut'; else if (/brown|tan|cognac/.test(t)) o.color = 'cognac';
    if (/vintage|rugged|distress/.test(t)) o.finish = 'vintage'; else if (/wax|pull/.test(t)) o.finish = 'waxed'; else if (/polish|smooth|premium|modern/.test(t)) o.finish = 'polished';
    if (/cross/.test(t)) o.style = 'crossback'; else if (/waist|half/.test(t)) o.style = 'waist'; else if (/\bbib\b/.test(t)) o.style = 'bib';
    if (/logo/.test(t)) o.text = 'YOUR LOGO'; else if (/chef/.test(t)) o.text = 'CHEF'; else if (/barber/.test(t)) o.text = 'BARBER';
    else if (/workshop|tool/.test(t)) o.text = 'WORKSHOP'; else if (/bbq|grill/.test(t)) o.text = 'BBQ MASTER';
    return o;
  }
  function previewSVG(d, aria) {
    var c = find(COLORS, d.color), f = find(FINISHES, d.finish), s = find(STYLES, d.style);
    var waist = d.style === 'waist', py = waist ? 122 : 38, ky = waist ? 168 : 128;
    var txt = esc((d.text || 'YOUR LOGO').toUpperCase());
    return '<svg viewBox="0 -24 200 264" style="width:86%;max-width:420px;height:auto;transition:transform .8s' + (st.spin ? ';transform:rotateY(360deg)' : '') + '" role="img" aria-label="' + esc(aria) + '">' +
      (s.strap ? '<path d="' + s.strap + '" fill="none" stroke="' + c.dark + '" stroke-width="6" stroke-linecap="round"/>' : '') +
      '<path d="' + s.body + '" fill="' + c.hex + '"/>' +
      '<path d="' + s.body + '" fill="' + f.fill + '" fill-opacity="' + f.op + '"/>' +
      '<path d="' + s.body + '" fill="none" stroke="#F0D2A6" stroke-opacity=".4" stroke-width="1.4" stroke-dasharray="3 3" transform="translate(6 8) scale(.94)"/>' +
      '<path d="M24 112 L4 160 M176 112 L196 160" stroke="' + c.dark + '" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="62" y="' + py + '" width="76" height="34" rx="3" fill="' + c.dark + '" fill-opacity=".55" stroke="#F0D2A6" stroke-opacity=".45" stroke-dasharray="2 2"/>' +
      '<text x="100" y="' + (py + 20) + '" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-weight="700" font-size="9" fill="#F0D2A6">' + txt + '</text>' +
      '<rect x="40" y="' + ky + '" width="52" height="46" rx="3" fill="' + c.dark + '" fill-opacity=".45"/><rect x="108" y="' + ky + '" width="52" height="46" rx="3" fill="' + c.dark + '" fill-opacity=".45"/>' +
      (st.details.brass ? '<circle cx="44" cy="' + (ky + 4) + '" r="2.6" fill="#D4AE52"/><circle cx="88" cy="' + (ky + 4) + '" r="2.6" fill="#D4AE52"/><circle cx="112" cy="' + (ky + 4) + '" r="2.6" fill="#D4AE52"/><circle cx="156" cy="' + (ky + 4) + '" r="2.6" fill="#D4AE52"/>' : '') +
      (st.details.pens ? '<path d="M50 ' + (ky - 10) + ' v14 M56 ' + (ky - 14) + ' v18 M144 ' + (ky - 12) + ' v16" stroke="#2A2420" stroke-width="3" stroke-linecap="round"/>' : '') +
      (st.details.ring ? '<circle cx="66" cy="' + (ky + 64) + '" r="9" fill="none" stroke="#D4AE52" stroke-width="2.5"/>' : '') +
      (st.details.towel ? '<path d="M150 ' + (ky + 52) + ' q8 10 0 20" fill="none" stroke="#D4AE52" stroke-width="2.5"/>' : '') +
      '</svg>';
  }
  // ---- Photo preview ----
  // patch = [left%, top%, width%, height%] of the chest patch in each 1024x1536 photo
  var PHOTOS = {
    brown: { src: 'assets/img/apron-brown.webp', patch: [35.9, 26.7, 27.7, 12.1], bg: '#4B2716', baked: 'YOUR LOGO' },
    chef: { src: 'assets/img/apron-chef.jpg', patch: [36.7, 25.7, 27, 11.5], bg: '#1F1B18', baked: 'CHEF' },
    barber: { src: 'assets/img/apron-barber.jpg', patch: [36.1, 26.6, 28, 13.2], bg: '#1F1B18', baked: 'BARBER' },
    workshop: { src: 'assets/img/apron-workshop.jpg', patch: [36.5, 24.1, 27.4, 11.9], bg: '#1F1B18', baked: 'WORKSHOP' },
    bbq: { src: 'assets/img/apron-bbq.jpg', patch: [35.4, 24.3, 29.8, 15.8], bg: '#1F1B18', baked: 'BBQ MASTER' },
    custom: { src: 'assets/img/apron-custom.jpg', patch: [37, 22.3, 26, 5.6], bg: '#1F1B18', baked: '' },
    logo_cognac: { src: 'assets/img/ai-logo-cognac.webp', patch: [34.5, 19.9, 30.7, 16.6], bg: '#9A4A1F', baked: 'YOUR LOGO', ar: '1086/1448', tint: true },
    logo_dark: { src: 'assets/img/ai-logo-dark.webp', patch: [34.5, 19.9, 30.7, 16.6], bg: '#4A1C10', baked: 'YOUR LOGO', ar: '1086/1448' },
    logo_black: { src: 'assets/img/ai-logo-black.webp', patch: [34.5, 19.9, 30.7, 16.6], bg: '#171412', baked: 'YOUR LOGO', ar: '1086/1448' },
    logo_olive: { src: 'assets/img/ai-logo-olive.webp', patch: [34.5, 19.9, 30.7, 16.6], bg: '#3F4A1E', baked: 'YOUR LOGO', ar: '1086/1448' },
    logo_burgundy: { src: 'assets/img/ai-logo-burgundy.webp', patch: [34.5, 19.9, 30.7, 16.6], bg: '#6E1712', baked: 'YOUR LOGO', ar: '1086/1448' }
  };
  var COLOR_FILTER = { chestnut: 'brightness(.8) saturate(1.05)', navy: 'hue-rotate(185deg) saturate(.45) brightness(.6)' };
  var COLOR_PHOTO = { cognac: 'logo_cognac', chestnut: 'logo_cognac', navy: 'logo_cognac', dark: 'logo_dark', black: 'logo_black', olive: 'logo_olive', burgundy: 'logo_burgundy' };
  var FINISH_FILTER = { matte: '', vintage: 'contrast(1.1) sepia(.18)', waxed: 'saturate(1.2) contrast(1.05)', polished: 'brightness(1.07) contrast(1.08)' };
  function photoKey(d) {
    if (d.style !== 'crossback') return null;
    if (d.photo) return d.photo;
    return COLOR_PHOTO[d.color] || 'logo_cognac';
  }
  function photoState(d) {
    var k = photoKey(d); if (!k) return null;
    var P = PHOTOS[k], t = (d.text || '').toUpperCase().trim();
    var filt = (P.tint ? COLOR_FILTER[d.color] || '' : '') + ' ' + (FINISH_FILTER[d.finish] || '');
    filt = filt.trim();
    var show = !!t && t !== P.baked;
    var fs = Math.min(3.6, P.patch[2] * 1.55 / Math.max(t.length, 4), P.patch[3] * 1.5 * 0.55);
    return { k: k, P: P, t: t, filt: filt, show: show, fs: fs };
  }
  function previewPhoto(d, aria) {
    var s = photoState(d), P = s.P, r = P.patch;
    var rivet = function (x, y) { return '<span style="position:absolute;' + x + ':5%;' + y + ':9%;width:5%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 35%,#F3D58A,#A87C2C)"></span>'; };
    return '<div class="ph-wrap" style="' + (P.ar ? 'aspect-ratio:' + P.ar + ';' : '') + (st.spin ? 'transform:rotateY(360deg)' : '') + '">' +
      '<img src="' + P.src + '" alt="' + esc(aria) + '" style="' + (s.filt ? 'filter:' + s.filt : '') + '">' +
      (s.show ? '<div class="ph-patch" style="left:' + r[0] + '%;top:' + r[1] + '%;width:' + r[2] + '%;height:' + r[3] + '%">' +
        '<span class="ph-patch-bg" style="background:' + P.bg + (s.filt ? ';filter:' + s.filt : '') + '"></span>' +
        rivet('left', 'top') + rivet('right', 'top') + rivet('left', 'bottom') + rivet('right', 'bottom') +
        '<span class="ph-patch-text" style="font-size:' + s.fs.toFixed(2) + 'cqw">' + esc(s.t) + '</span></div>' : '') +
      '</div>';
  }
  function downloadPhoto() {
    var s = photoState(st.d), img = new Image();
    img.onload = function () {
      var c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
      var x = c.getContext('2d'); x.filter = s.filt || 'none'; x.drawImage(img, 0, 0);
      if (s.show) {
        var r = s.P.patch, px = r[0] / 100 * c.width, py = r[1] / 100 * c.height, pw = r[2] / 100 * c.width, ph = r[3] / 100 * c.height;
        x.fillStyle = s.P.bg; x.fillRect(px, py, pw, ph);
        x.filter = 'none'; x.fillStyle = '#E9C58E'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.font = '700 ' + (s.fs / 100 * c.width) + 'px "Playfair Display", Georgia, serif';
        x.fillText(s.t, px + pw / 2, py + ph / 2);
      }
      c.toBlob(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'my-apron-design.png'; a.click(); }, 'image/png');
    };
    img.src = s.P.src;
  }
  function ctrl(on) { return 'ctrl' + (on ? ' on' : ''); }

  function draw() {
    var d = st.d, c = find(COLORS, d.color), f = find(FINISHES, d.finish), s = find(STYLES, d.style);
    var aria = c.name + ' ' + s.label + ' leather apron, ' + f.label + ' finish' + (d.text ? ', engraved ' + d.text : '');
    $('#preview').innerHTML = photoKey(d) ? previewPhoto(d, aria) : previewSVG(d, aria);
    $('#color-name').textContent = c.name;
    $('#ai-price').textContent = '$' + (119 + (d.text ? 15 : 0)).toFixed(2);
    $('#ai-colors').innerHTML = COLORS.map(function (x) {
      var on = x.id === d.color;
      return '<button type="button" data-color="' + x.id + '" aria-label="' + x.name + '" aria-pressed="' + on + '" style="width:44px;height:44px;border-radius:50%;cursor:pointer;background:' + x.hex + ';border:3px solid #1F1813;box-shadow:0 0 0 ' + (on ? '2px #D07A34' : '1px #4A3A2E') + '"></button>';
    }).join('');
    $('#ai-finishes').innerHTML = FINISHES.map(function (x) {
      return '<button type="button" data-finish="' + x.id + '" aria-pressed="' + (x.id === d.finish) + '" class="' + ctrl(x.id === d.finish) + '" style="min-height:64px;padding:6px;font-size:13px;line-height:1.25">' + x.label + '</button>';
    }).join('');
    $('#ai-styles').innerHTML = STYLES.map(function (x) {
      return '<button type="button" data-style="' + x.id + '" aria-pressed="' + (x.id === d.style) + '" class="' + ctrl(x.id === d.style) + '" style="min-height:76px;padding:8px 4px;font-size:13px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px">' +
        '<svg aria-hidden="true" width="30" height="34" viewBox="0 -24 200 264" fill="none" stroke="currentColor" stroke-width="10" stroke-linejoin="round"><path d="' + x.strap + '"/><path d="' + x.body + '"/></svg>' + x.label + '</button>';
    }).join('');
    var vk = photoKey(d);
    var VARIANTS = [
      { photo: 'brown', color: 'cognac', label: 'Original brown apron with tools' },
      { photo: null, color: 'cognac', label: 'Cognac apron' },
      { photo: null, color: 'dark', label: 'Dark brown apron' },
      { photo: null, color: 'black', label: 'Black apron' },
      { photo: null, color: 'olive', label: 'Olive apron' },
      { photo: null, color: 'burgundy', label: 'Burgundy apron' }
    ];
    var curKey = photoKey(d);
    $('#variants').innerHTML = VARIANTS.map(function (v, i) {
      var key = v.photo || COLOR_PHOTO[v.color];
      var on = curKey === key && (v.photo ? d.photo === v.photo : !d.photo && d.color === v.color);
      return '<button type="button" data-variant="' + i + '" aria-label="' + v.label + '" aria-pressed="' + on + '" style="height:66px;border-radius:8px;background:#FFFFFF;cursor:pointer;padding:3px;overflow:hidden;border:' + (on ? '2px solid #D07A34' : '1px solid #4A3A2E') + '"><img src="' + PHOTOS[key].src + '" alt="" style="width:100%;height:100%;object-fit:contain"></button>';
    }).join('') + '<button type="button" id="add-variant" aria-label="Random variant" style="height:56px;border:1px solid #4A3A2E;border-radius:8px;background:transparent;color:#F4EFE8;font-size:24px;cursor:pointer">+</button>';
    st.VARIANTS = VARIANTS;
    $('#ai-tabs').innerHTML = TABS.map(function (t) {
      return '<button type="button" role="tab" data-tab="' + t.id + '" aria-selected="' + (t.id === st.tab) + '" class="ai-tab' + (t.id === st.tab ? ' on' : '') + '"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="' + t.icon + '"/></svg>' + t.label + '</button>';
    }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('[data-ai-panel]'), function (p) { p.classList.toggle('hidden', p.getAttribute('data-ai-panel') !== st.tab); });
    $('#ai-details').innerHTML = DETAILS.map(function (x) {
      var on = !!st.details[x[0]];
      return '<button type="button" role="checkbox" aria-checked="' + on + '" data-detail="' + x[0] + '" style="display:flex;align-items:center;gap:12px;min-height:44px;background:transparent;border:0;color:#F4EFE8;cursor:pointer;padding:0"><span style="width:20px;height:20px;border-radius:4px;' + (on ? 'background:#D07A34;border:1.5px solid #D07A34' : 'border:1.5px solid #6B5848') + '"></span>' + x[1] + '</button>';
    }).join('');
    if ($('#personal').value !== d.text) $('#personal').value = d.text;
  }

  // Events
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-color')) commit({ color: b.getAttribute('data-color'), photo: null });
    else if (b.hasAttribute('data-variant')) { var vv = st.VARIANTS[+b.getAttribute('data-variant')]; commit({ color: vv.color, style: 'crossback', photo: vv.photo }); }
    else if (b.hasAttribute('data-finish')) commit({ finish: b.getAttribute('data-finish') });
    else if (b.hasAttribute('data-style')) commit({ style: b.getAttribute('data-style'), photo: null });
    else if (b.hasAttribute('data-tab')) { st.tab = b.getAttribute('data-tab'); draw(); }
    else if (b.hasAttribute('data-detail')) { var k = b.getAttribute('data-detail'); st.details[k] = !st.details[k]; draw(); }
    else if (b.hasAttribute('data-preset')) {
      var p = PRESETS[+b.getAttribute('data-preset')];
      commit({ color: p.color, finish: p.finish, style: p.style, photo: p.img, text: p.label === 'CUSTOM' ? '' : p.label });
      $('#prompt').value = p.prompt; $('#status').textContent = 'Loaded “' + p.prompt + '”.';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    else if (b.id === 'add-variant') commit({ color: COLORS[Math.floor(Math.random() * COLORS.length)].id, finish: FINISHES[Math.floor(Math.random() * 4)].id, style: 'crossback', photo: null });
  });
  $('#generate').addEventListener('click', function () {
    var p = $('#prompt').value.trim();
    if (!p) { $('#status').textContent = 'Describe your apron first, or pick a prompt below.'; return; }
    var btn = this; btn.disabled = true; $('#status').textContent = 'Generating your design…';
    setTimeout(function () {
      var ch = parse(p); if ('color' in ch || 'style' in ch) ch.photo = null; commit(ch); btn.disabled = false;
      $('#status').textContent = Object.keys(ch).length ? 'Design generated from your description.' : 'Design generated — fine-tune it with the options on the right.';
    }, 700);
  });
  $('#undo').addEventListener('click', function () { if (!st.past.length) return; st.future.unshift(Object.assign({}, st.d)); st.d = st.past.pop(); draw(); });
  $('#redo').addEventListener('click', function () { if (!st.future.length) return; st.past.push(Object.assign({}, st.d)); st.d = st.future.shift(); draw(); });
  var textBefore = null;
  $('#personal').addEventListener('focus', function () { textBefore = st.d.text; });
  // record one undo step per edit without re-rendering (a re-render here would swallow the next click)
  $('#personal').addEventListener('change', function () { if (textBefore !== null && textBefore !== st.d.text) { var prev = Object.assign({}, st.d, { text: textBefore }); st.past.push(prev); st.future = []; } textBefore = st.d.text; });
  $('#personal').addEventListener('input', function () { st.d.text = this.value.trim(); draw(); });
  $('#spin').addEventListener('click', function () { st.spin = !st.spin; draw(); });
  $('#fs').addEventListener('click', function () { var el = $('#preview').parentElement; if (el.requestFullscreen) el.requestFullscreen(); });
  $('#download').addEventListener('click', function () {
    if (photoKey(st.d)) { downloadPhoto(); return; }
    var svg = $('#preview svg').outerHTML.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    a.download = 'my-apron-design.svg'; a.click();
  });
  $('#logo-upload').addEventListener('change', function () { if (this.files[0]) { $('#logo-name').textContent = this.files[0].name + ' — ready'; commit({ text: 'YOUR LOGO' }); } });
  $('#ref-upload').addEventListener('change', function () { if (this.files[0]) $('#status').textContent = 'Reference image added: ' + this.files[0].name; });
  $('#ai-add').addEventListener('click', function () {
    var c = find(COLORS, st.d.color), s = find(STYLES, st.d.style);
    window.CLA.addToCart({ id: 'ai-' + Date.now(), name: 'Custom ' + s.label + ' Apron', color: c.id, colorName: c.name + ', ' + find(FINISHES, st.d.finish).label, hex: c.hex, dark: c.dark, price: 119 + (st.d.text ? 15 : 0), qty: 1, text: st.d.text });
    location.href = 'cart.html';
  });

  $('#chips').innerHTML = PRESETS.map(function (p, i) {
    return '<button type="button" class="chip" data-preset="' + i + '"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E3A66A" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="' + p.icon + '"/></svg>' + p.prompt + '</button>';
  }).join('');
  $('#examples').innerHTML = PRESETS.map(function (p, i) {
    return '<button type="button" class="example" data-preset="' + i + '" aria-label="Use the ' + p.title + ' design">' +
      '<span class="ex-img"><img src="assets/img/apron-' + p.img + '.jpg" alt="' + p.title + ' in black leather with tan straps and brass rivets" loading="lazy" width="520" height="780"></span>' +
      '<span class="ex-cap"><b>' + p.title + '</b><span>Use this design →</span></span></button>';
  }).join('');
  draw();
});
