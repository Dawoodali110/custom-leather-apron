/* Personalize page: pick a leather colour, type the engraving, preview it on the chest patch */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var esc = window.CLA.esc;
  var BASE = 119, FEE = 15;

  var COLORS = [
    { id: 'cognac', name: 'Cognac', hex: '#9A4A1F', src: 'assets/img/ai-logo-cognac.webp', bg: '#9A4A1F' },
    { id: 'dark', name: 'Dark brown', hex: '#4A1C10', src: 'assets/img/ai-logo-dark.webp', bg: '#4A1C10' },
    { id: 'black', name: 'Black', hex: '#171412', src: 'assets/img/ai-logo-black.webp', bg: '#171412' },
    { id: 'olive', name: 'Olive', hex: '#3F4A1E', src: 'assets/img/ai-logo-olive.webp', bg: '#3F4A1E' },
    { id: 'burgundy', name: 'Burgundy', hex: '#6E1712', src: 'assets/img/ai-logo-burgundy.webp', bg: '#6E1712' }
  ];
  var PATCH = [34.5, 19.9, 30.7, 16.6];
  var STARTS = [
    { img: 'chef', title: 'Chef', text: 'CHEF' }, { img: 'barber', title: 'Barber', text: 'BARBER' },
    { img: 'workshop', title: 'Workshop', text: 'WORKSHOP' }, { img: 'bbq', title: 'BBQ', text: 'BBQ MASTER' }, { img: 'custom', title: 'Your logo', text: 'YOUR LOGO' }
  ];
  var st = { color: 'cognac', text: '' };
  var find = function (id) { return COLORS.filter(function (c) { return c.id === id; })[0] || COLORS[0]; };

  function draw() {
    var c = find(st.color), t = st.text.toUpperCase();
    var fs = Math.min(3.6, PATCH[2] * 1.55 / Math.max(t.length || 9, 4), PATCH[3] * 1.5 * 0.55);
    var rivet = function (x, y) { return '<span style="position:absolute;' + x + ':5%;' + y + ':9%;width:5%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 35%,#F3D58A,#A87C2C)"></span>'; };
    $('#preview').innerHTML = '<div class="ph-wrap" style="aspect-ratio:1086/1448">' +
      '<img src="' + c.src + '" alt="' + esc(c.name + ' leather apron' + (t ? ' engraved ' + t : '')) + '">' +
      (t ? '<div class="ph-patch" style="left:' + PATCH[0] + '%;top:' + PATCH[1] + '%;width:' + PATCH[2] + '%;height:' + PATCH[3] + '%"><span class="ph-patch-bg" style="background:' + c.bg + '"></span>' +
        rivet('left', 'top') + rivet('right', 'top') + rivet('left', 'bottom') + rivet('right', 'bottom') +
        '<span class="ph-patch-text" style="font-size:' + fs.toFixed(2) + 'cqw">' + esc(t) + '</span></div>' : '') + '</div>';
    $('#color-name').textContent = c.name;
    $('#pz-colors').innerHTML = COLORS.map(function (x) {
      var on = x.id === st.color;
      return '<button type="button" class="swatch' + (on ? ' on' : '') + '" data-color="' + x.id + '" aria-label="' + x.name + '" aria-pressed="' + on + '" style="background:' + x.hex + '"></button>';
    }).join('');
    $('#pz-price').textContent = '$' + (BASE + (t ? FEE : 0)).toFixed(2);
    $('#pz-fee').textContent = t ? 'Includes $' + FEE + ' engraving' : 'Engraving adds $' + FEE;
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-color')) { st.color = b.getAttribute('data-color'); draw(); }
    if (b.hasAttribute('data-start')) {
      var s = STARTS[+b.getAttribute('data-start')]; st.text = s.text; $('#personal').value = s.text; draw();
      $('#builder').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  $('#personal').addEventListener('input', function () { st.text = this.value.trim(); draw(); });
  $('#logo-upload').addEventListener('change', function () {
    if (!this.files[0]) return;
    $('#logo-name').textContent = this.files[0].name;
    if (!st.text) { st.text = 'YOUR LOGO'; $('#personal').value = st.text; }
    draw();
  });
  $('#pz-add').addEventListener('click', function () {
    var c = find(st.color), logo = $('#logo-upload').files[0];
    window.CLA.addToCart({ id: 'custom-' + Date.now(), name: 'Personalized Crossback Apron', color: c.id, colorName: c.name, hex: c.hex, dark: c.bg,
      price: BASE + (st.text ? FEE : 0), qty: 1, text: st.text + (logo ? ' (logo: ' + logo.name + ')' : ''), photo: c.src });
  });
  $('#starts').innerHTML = STARTS.map(function (s, i) {
    return '<button type="button" class="start" data-start="' + i + '"><span><img src="assets/img/apron-' + s.img + '.jpg" alt="" loading="lazy" width="520" height="780"></span><b>' + s.title + '</b></button>';
  }).join('');
  var pre = new URLSearchParams(location.search).get('name');
  if (pre) { st.text = pre.slice(0, 14); $('#personal').value = st.text; }
  draw();
});
