/* Custom Leather Apron — shared site script */
(function () {
  'use strict';

  // ---------- Data ----------
  var COLORS = {
    brown: { name: 'Brown', hex: '#7A3E1C', dark: '#45200C' },
    black: { name: 'Black', hex: '#2A221D', dark: '#120E0B' },
    tan: { name: 'Tan', hex: '#B86A2E', dark: '#6E3A16' },
    cognac: { name: 'Cognac', hex: '#9A5528', dark: '#5A2F17' },
    chocolate: { name: 'Chocolate', hex: '#5C3420', dark: '#311A0E' },
    olive: { name: 'Olive', hex: '#6B6A45', dark: '#3A3922' }
  };
  var PRODUCTS = [
    { id: 'classic', name: 'Classic Leather Apron', price: 119, reviews: 128, color: 'cognac', cat: 'chef', tags: ['best', 'custom', 'top'], desc: 'A timeless, full-grain leather apron built for chefs, makers, and everyday professionals.' },
    { id: 'barber', name: 'Barber Leather Apron', price: 129, reviews: 94, color: 'black', cat: 'barber', tags: ['best', 'new', 'custom'], desc: 'Lightweight and sleek, with pockets sized for clippers, combs and shears.' },
    { id: 'workshop', name: 'Workshop Leather Apron', price: 139, reviews: 76, color: 'black', colors: ['black'], photo: 'assets/img/product-workshop.webp', cat: 'workshop', tags: ['best', 'new', 'top'], desc: 'Waxed-canvas body with full-grain leather tool pockets, a hammer loop, pencil holder, towel ring and reinforced corners — made for woodworkers and makers.' },
    { id: 'chefpro', name: 'Chef Pro Apron', price: 149, reviews: 67, color: 'chocolate', cat: 'chef', tags: ['best', 'custom', 'top', 'new'], desc: 'Our heaviest full-bib apron with a towel loop and reinforced pockets.' },
    { id: 'artist', name: 'Artist Studio Apron', price: null, reviews: 0, color: 'brown', colors: ['brown'], photo: 'assets/img/product-artist.webp', cat: 'artist', tags: ['new'], desc: 'Paint-friendly full-grain leather with wide brush pockets, a palette-knife slot, a towel ring and reinforced corners.' },
    { id: 'bbq', name: 'BBQ Pitmaster Apron', price: null, reviews: 0, color: 'black', cat: 'bbq', tags: ['new', 'custom'], desc: 'Heat-resistant bib with a D-ring for tongs and a rugged finish.' }
  ];
  var CATS = [
    { id: 'all', label: 'All Aprons' }, { id: 'chef', label: 'Chef Aprons' }, { id: 'barber', label: 'Barber Aprons' },
    { id: 'workshop', label: 'Workshop Aprons' }, { id: 'artist', label: 'Artist Aprons' }, { id: 'bbq', label: 'BBQ Aprons' }
  ];
  var ENGRAVE_FEE = 15;

  function money(n) { return n == null ? 'Price on request' : '$' + n.toFixed(2); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function product(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }

  // ---------- Apron illustration ----------
  var BODY = 'M66 22 H134 L138 72 C144 84 158 88 172 90 L178 226 C126 236 74 236 22 226 L28 90 C42 88 56 84 62 72 Z';
  function apron(hex, dark, opts) {
    opts = opts || {};
    var label = opts.label ? ' role="img" aria-label="' + esc(opts.label) + '"' : ' aria-hidden="true"';
    var s = '<svg class="apron" viewBox="0 0 200 240"' + label + (opts.style ? ' style="' + opts.style + '"' : '') + '>';
    if (!opts.mini) s += '<path d="M78 22 C82 2 118 2 122 22" fill="none" stroke="' + dark + '" stroke-width="5"/>';
    s += '<path d="' + BODY + '" fill="' + hex + '"/>';
    if (!opts.mini) {
      s += '<path d="' + BODY + '" fill="none" stroke="#F0D2A6" stroke-opacity="0.45" stroke-width="1.3" stroke-dasharray="3 3" transform="translate(6 7) scale(0.94)"/>' +
        '<path d="M28 96 L6 150 M172 96 L194 150" stroke="' + dark + '" stroke-width="4" stroke-linecap="round"/>';
    }
    s += '<rect x="54" y="124" width="92" height="58" rx="3" fill="' + dark + '" fill-opacity="0.5"/>';
    if (!opts.mini) {
      s += '<path d="M100 124 V182" stroke="#F0D2A6" stroke-opacity="0.45" stroke-dasharray="3 3"/>' +
        '<circle cx="58" cy="128" r="2.8" fill="#D4AE52"/><circle cx="142" cy="128" r="2.8" fill="#D4AE52"/>' +
        '<rect x="72" y="18" width="10" height="8" rx="1.5" fill="none" stroke="#D4AE52" stroke-width="2"/><rect x="118" y="18" width="10" height="8" rx="1.5" fill="none" stroke="#D4AE52" stroke-width="2"/>';
    }
    if (opts.text) s += '<text x="100" y="158" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-weight="700" font-size="11" fill="#F0D2A6">' + esc(String(opts.text).toUpperCase().slice(0, 16)) + '</text>';
    return s + '</svg>';
  }

  // ---------- Cart (localStorage) ----------
  var KEY = 'cla_cart_v1';
  function readCart() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function writeCart(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* storage unavailable */ } updateBadge(); }
  function cartCount() { return readCart().reduce(function (s, x) { return s + x.qty; }, 0); }
  function addToCart(item) {
    var c = readCart();
    var same = c.filter(function (x) { return x.id === item.id && x.color === item.color && (x.text || '') === (item.text || ''); })[0];
    if (same) same.qty = Math.min(20, same.qty + item.qty); else c.push(item);
    writeCart(c);
  }
  function updateBadge() { $$('[data-cart-count]').forEach(function (el) { el.textContent = cartCount(); }); }

  // ---------- Icons ----------
  var I = {
    truck: '<path d="M2 6h12v10H2z"/><path d="M14 9h4l3 3v4h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    shieldCheck: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 7.5L20 18M8.5 16.5L20 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6"/>',
    caret: '<path d="M6 9l6 6 6-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    leaf: '<path d="M20 4C10 4 4 9 4 16c0 1.5.3 2.8.8 4"/><path d="M20 4c0 9-5 15-12 15"/><path d="M4 20c3-6 7-9 12-11"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.3 0 4 1.6 4.5 4.5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.4M12 17h.01"/>',
    ret: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'
  };
  function icon(name, size, extra) {
    return '<svg aria-hidden="true" width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '>' + I[name] + '</svg>';
  }
  var LOGO = '<svg aria-hidden="true" width="46" height="46" viewBox="0 0 48 48" fill="none" stroke="#C98B4B" stroke-width="2.4" stroke-linejoin="round"><path d="M16 5c3 3 13 3 16 0 2 4 6 6 11 6-1 5 0 9 3 12-3 3-4 7-3 12-5 0-9 2-11 6-3-3-13-3-16 0-2-4-6-6-11-6 1-5 0-9-3-12 3-3 4-7 3-12 5 0 9-2 11-6z"/></svg>';

  // ---------- Header / Footer ----------
  function renderHeader() {
    var el = $('#site-header'); if (!el) return;
    var active = document.body.getAttribute('data-page');
    var links = [
      ['home', 'Home', 'index.html'], ['shop', 'Shop', 'shop.html', 1], ['collections', 'Collections', 'shop.html', 1],
      ['customize', 'Customize', 'product.html', 1], ['ai', 'Design with AI', 'design-ai.html'], ['about', 'About', 'about.html'], ['contact', 'Contact', 'contact.html']
    ];
    el.innerHTML =
      '<div class="topbar"><div class="wrap">' +
        '<div>' + icon('truck') + 'Free Shipping on Orders Over $99</div>' +
        '<div>' + icon('shield') + '1-Year Craftsmanship Warranty</div>' +
        '<div>' + icon('scissors') + 'Custom Engraving Available</div>' +
      '</div></div>' +
      '<header class="site-header"><nav class="nav" aria-label="Main">' +
        '<a class="brand" href="index.html">' + LOGO + '<span>Custom<br>Leather Apron</span></a>' +
        '<div class="nav-links" id="nav-links">' + links.map(function (l) {
          return '<a href="' + l[2] + '"' + (l[0] === active ? ' class="active" aria-current="page"' : '') + '>' + l[1] + (l[3] ? icon('caret', 12) : '') + '</a>';
        }).join('') + '</div>' +
        '<div class="nav-icons">' +
          '<button class="icon-btn menu-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav-links">' + icon('menu', 24) + '</button>' +
          '<a class="icon-btn" href="shop.html" aria-label="Search" style="color:inherit">' + icon('search', 22) + '</a>' +
          '<a class="icon-btn" href="contact.html" aria-label="Account" style="color:inherit">' + icon('user', 22) + '</a>' +
          '<a class="icon-btn" href="cart.html" aria-label="Cart" style="color:inherit">' + icon('cart', 24) + '<span class="badge" data-cart-count>0</span></a>' +
        '</div>' +
      '</nav></header>';
    var t = $('.menu-toggle', el);
    t.addEventListener('click', function () {
      var open = $('#nav-links').classList.toggle('open');
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function renderFooter() {
    var el = $('#site-footer'); if (!el) return;
    var trust = [
      ['truck', 'Free Shipping', 'On orders over $99'], ['shieldCheck', '1-Year Warranty', 'Against manufacturing defects'],
      ['scissors', 'Custom Engraving', 'Add your name or logo'], ['leaf', 'Sustainable Materials', 'Ethically sourced leather'],
      ['users', 'Trusted by Professionals', 'Chefs, barbers and makers']
    ];
    el.innerHTML =
      '<footer class="site-footer"><div class="wrap" style="padding-top:32px">' +
        '<div class="newsletter">' +
          '<div style="display:flex;align-items:center;gap:24px;flex:1 1 420px;min-width:0"><span style="color:#D9954E">' + icon('mail', 40, ' stroke-width="1.4"') + '</span>' +
            '<div><div class="serif" style="font-weight:700;font-size:24px;color:#F4EFE8">Join Our Newsletter</div><div style="color:#D8CCBF;font-size:15px">Get exclusive offers, new arrivals, and craftsmanship stories.</div></div></div>' +
          '<form id="news-form"><label for="news-email" class="visually-hidden">Email address</label><input id="news-email" type="email" required placeholder="Enter your email address"><button type="submit">Subscribe ' + icon('arrow', 16) + '</button></form>' +
        '</div>' +
        '<div class="f-cols">' +
          '<div style="flex:1.4 1 280px;padding-left:0;gap:18px"><a class="brand" href="index.html">' + LOGO + '<span>Custom<br>Leather Apron</span></a>' +
            '<p style="margin:0;font-size:15px;max-width:290px">Premium, handcrafted leather aprons for chefs, barbers, woodworkers, artists, and professionals. Customize it your way.</p>' +
            '<div class="socials"><a href="#" aria-label="Instagram"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg></a><a href="#" aria-label="Facebook"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M15 3h-2a4 4 0 0 0-4 4v14M6 11h8"/></svg></a><a href="#" aria-label="YouTube"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor"/></svg></a><a href="#" aria-label="Pinterest"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M10 21l2-9M12 12a2.5 2.5 0 1 1 2.5 2.5"/></svg></a><a href="#" aria-label="TikTok"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M14 3v12a4 4 0 1 1-4-4M14 3c0 3 2 5 5 5"/></svg></a></div></div>' +
          '<div style="flex:1 1 160px;border-left:1px solid #3A2C22"><h4>Shop</h4>' + CATS.map(function (c) { return '<a href="shop.html?cat=' + c.id + '">' + c.label + '</a>'; }).join('') + '</div>' +
          '<div style="flex:1 1 170px"><h4>Quick Links</h4><a href="index.html">Home</a><a href="shop.html">Shop</a><a href="shop.html">Collections</a><a href="design-ai.html">Design with AI</a><a href="about.html">About Us</a><a href="contact.html">Contact Us</a></div>' +
          '<div style="flex:1.2 1 220px"><h4>Customer Support</h4>' +
            [['help', 'FAQs'], ['truck', 'Shipping &amp; Delivery'], ['ret', 'Returns &amp; Exchanges'], ['shieldCheck', 'Warranty'], ['card', 'Payment Methods'], ['headset', 'Contact Support']].map(function (x) { return '<a class="ic" href="contact.html">' + icon(x[0]) + x[1] + '</a>'; }).join('') + '</div>' +
          '<div style="flex:1.3 1 240px;border-left:1px solid #3A2C22;padding-left:32px;gap:14px"><h4>Contact Us</h4>' +
            '<a class="ic" href="tel:+15551234567">' + icon('phone') + '+1 (555) 123-4567</a>' +
            '<a class="ic" href="mailto:support@customleatherapron.com">' + icon('mail') + 'support@customleatherapron.com</a>' +
            '<div class="ic">' + icon('pin') + 'Austin, TX, USA</div></div>' +
        '</div>' +
        '<div class="trust">' + trust.map(function (t) { return '<div><span style="color:#D9954E">' + icon(t[0], 34, ' stroke-width="1.3"') + '</span><div><b>' + t[1] + '</b><small>' + t[2] + '</small></div></div>'; }).join('') + '</div>' +
        '<div class="f-bottom"><span>© ' + new Date().getFullYear() + ' Custom Leather Apron. All rights reserved.</span>' +
          '<nav aria-label="Legal"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Refund Policy</a></nav>' +
          '<div class="pay" aria-label="Accepted payment methods"><span>Visa</span><span>Mastercard</span><span>Amex</span><span>PayPal</span><span>Apple Pay</span></div></div>' +
      '</div></footer>';
    $('#news-form').addEventListener('submit', function (e) {
      e.preventDefault();
      this.innerHTML = '<div style="padding:13px 16px;color:#F4EFE8;background:#24180F;width:100%">Thanks for subscribing!</div>';
    });
  }

  // ---------- Product card ----------
  function card(p) {
    var c = COLORS[p.color];
    return '<a class="card" href="product.html?id=' + p.id + '">' +
      '<div class="img"><span class="heart">' + icon('heart', 22) + '</span>' + (p.photo ? '<img class="card-photo" src="' + p.photo + '" alt="' + esc(p.name) + '" loading="lazy">' : apron(c.hex, c.dark)) + '</div>' +
      '<div><div class="name">' + esc(p.name) + '</div>' +
      '<div class="meta"><span class="stars" aria-hidden="true">★★★★★</span>' + (p.reviews ? '(' + p.reviews + ')' : 'New') + '</div>' +
      '<div class="price">' + money(p.price) + '</div></div></a>';
  }

  // ---------- Pages ----------
  function initHome() {
    var tabs = [['best', 'Best Sellers'], ['new', 'New Arrivals'], ['custom', 'Customizable'], ['top', 'Top Rated']];
    var cur = 'best';
    var pills = $('#featured-tabs'), grid = $('#featured-grid');
    function draw() {
      pills.innerHTML = tabs.map(function (t) { return '<button type="button" class="pill' + (t[0] === cur ? ' on' : '') + '" aria-pressed="' + (t[0] === cur) + '" data-tab="' + t[0] + '">' + t[1] + '</button>'; }).join('');
      grid.innerHTML = PRODUCTS.filter(function (p) { return p.tags.indexOf(cur) !== -1; }).slice(0, 4).map(card).join('');
    }
    pills.addEventListener('click', function (e) { var b = e.target.closest('[data-tab]'); if (b) { cur = b.getAttribute('data-tab'); draw(); } });
    draw();
    var hero = $('#hero-apron'); if (hero) hero.innerHTML = apron('#9A5528', '#5A2F17', { label: 'Brown leather apron with brass rivets' });
  }

  function initShop() {
    var params = new URLSearchParams(location.search);
    var cur = params.get('cat') || 'all';
    var color = null;
    var max = 300;
    function list() {
      return PRODUCTS.filter(function (p) {
        return (cur === 'all' || p.cat === cur) && (!color || p.color === color || (color === 'brown' && /cognac|chocolate|brown/.test(p.color))) && (p.price == null || p.price <= max);
      });
    }
    function draw() {
      $('#cats').innerHTML = CATS.map(function (c) {
        var n = c.id === 'all' ? PRODUCTS.length : PRODUCTS.filter(function (p) { return p.cat === c.id; }).length;
        var on = c.id === cur;
        return '<button type="button" class="check' + (on ? ' on' : '') + '" role="checkbox" aria-checked="' + on + '" data-cat="' + c.id + '"><span class="box">' + (on ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>' : '') + '</span>' + c.label + '<span class="count">(' + n + ')</span></button>';
      }).join('');
      var items = list();
      var sort = $('#sort').value;
      items = items.slice().sort(function (a, b) {
        if (sort === 'low') return (a.price || 9999) - (b.price || 9999);
        if (sort === 'high') return (b.price || 0) - (a.price || 0);
        if (sort === 'new') return (b.tags.indexOf('new') !== -1) - (a.tags.indexOf('new') !== -1);
        return b.reviews - a.reviews;
      });
      $('#shown').textContent = items.length;
      $('#shop-grid').innerHTML = items.length ? items.map(card).join('') : '<p style="color:var(--muted)">No aprons match these filters.</p>';
      $$('#colors .swatch').forEach(function (s) { s.classList.toggle('on', s.getAttribute('data-color') === color); s.setAttribute('aria-pressed', s.getAttribute('data-color') === color); });
    }
    $('#cats').addEventListener('click', function (e) { var b = e.target.closest('[data-cat]'); if (b) { cur = b.getAttribute('data-cat'); draw(); } });
    $('#colors').addEventListener('click', function (e) { var b = e.target.closest('[data-color]'); if (b) { var c = b.getAttribute('data-color'); color = color === c ? null : c; draw(); } });
    $('#price').addEventListener('input', function () { max = +this.value; $('#price-out').textContent = '$' + max; draw(); });
    $('#sort').addEventListener('change', draw);
    draw();
  }

  function initProduct() {
    var p = product(new URLSearchParams(location.search).get('id')) || PRODUCTS[0];
    var swatches = p.colors || ['brown', 'black', 'tan'];
    var VIEWS = [['Front view', '1', '50% 50%'], ['Logo patch detail', '2.3', '50% 20%'], ['Pocket detail', '1.9', '50% 55%'], ['Corner and stitching detail', '2.6', '12% 92%']];
    var st = { color: swatches.indexOf(p.color) !== -1 ? p.color : 'brown', qty: 1, text: '', view: 0, tab: 'desc' };
    document.title = p.name + ' — Custom Leather Apron';
    $('#p-name').textContent = p.name; $('#p-crumb').textContent = p.name;
    $('#p-reviews').textContent = p.reviews ? '(' + p.reviews + ' Reviews)' : '(New)';
    $('#p-desc').textContent = p.desc;
    $('#tab-rev').textContent = 'Reviews (' + p.reviews + ')';
    function price() { return p.price == null ? null : p.price + (st.text.trim() ? ENGRAVE_FEE : 0); }
    function draw() {
      var c = COLORS[st.color];
      $('#p-price').textContent = money(price());
      $('#p-color').textContent = c.name;
      if (p.photo) {
        var v = VIEWS[st.view];
        $('#p-main').innerHTML = '<img class="pdp-photo" src="' + p.photo + '" alt="' + esc(p.name) + ', ' + v[0].toLowerCase() + '" style="transform:scale(' + v[1] + ');transform-origin:' + v[2] + '">';
        $('#p-thumbs').innerHTML = VIEWS.map(function (x, i) {
          return '<button type="button" aria-label="' + x[0] + '" data-view="' + i + '" class="' + (i === st.view ? 'on' : '') + '" style="overflow:hidden"><img src="' + p.photo + '" alt="" style="width:100%;height:100%;object-fit:contain;transform:scale(' + x[1] + ');transform-origin:' + x[2] + '"></button>';
        }).join('');
      } else {
        $('#p-main').innerHTML = apron(c.hex, c.dark, { label: p.name + ' in ' + c.name, text: st.text });
        $('#p-thumbs').innerHTML = ['Front view', 'Back view', 'Hardware detail', 'Leather detail'].map(function (l, i) {
          return '<button type="button" aria-label="' + l + '" data-view="' + i + '" class="' + (i === st.view ? 'on' : '') + '">' + apron(c.hex, c.dark, { mini: true }) + '</button>';
        }).join('');
      }
      $('#p-swatches').innerHTML = swatches.map(function (id) {
        return '<button type="button" class="swatch' + (id === st.color ? ' on' : '') + '" aria-pressed="' + (id === st.color) + '" aria-label="' + COLORS[id].name + '" data-color="' + id + '" style="background:' + COLORS[id].hex + '"></button>';
      }).join('');
      $('#p-qty').textContent = st.qty;
      $$('.tabs button').forEach(function (b) { var on = b.getAttribute('data-tab') === st.tab; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
      $$('[data-panel]').forEach(function (el) { el.classList.toggle('hidden', el.getAttribute('data-panel') !== st.tab); });
    }
    $('#p-swatches').addEventListener('click', function (e) { var b = e.target.closest('[data-color]'); if (b) { st.color = b.getAttribute('data-color'); draw(); } });
    $('#p-thumbs').addEventListener('click', function (e) { var b = e.target.closest('[data-view]'); if (b) { st.view = +b.getAttribute('data-view'); draw(); } });
    $('#p-text').addEventListener('input', function () { st.text = this.value; draw(); });
    $('#p-dec').addEventListener('click', function () { st.qty = Math.max(1, st.qty - 1); draw(); });
    $('#p-inc').addEventListener('click', function () { st.qty = Math.min(20, st.qty + 1); draw(); });
    $$('.tabs button').forEach(function (b) { b.addEventListener('click', function () { st.tab = b.getAttribute('data-tab'); draw(); }); });
    function add() {
      var c = COLORS[st.color];
      addToCart({ id: p.id, name: p.name, color: st.color, colorName: c.name, hex: c.hex, dark: c.dark, price: price() || 0, qty: st.qty, text: st.text.trim() });
    }
    $('#p-add').addEventListener('click', function () { add(); this.innerHTML = icon('cart') + ' Added to Cart ✓'; });
    $('#p-buy').addEventListener('click', function () { add(); location.href = 'cart.html'; });
    draw();
  }

  function initCart() {
    function draw() {
      var c = readCart();
      var count = c.reduce(function (s, x) { return s + x.qty; }, 0);
      var sub = c.reduce(function (s, x) { return s + x.price * x.qty; }, 0);
      var ship = sub === 0 || sub >= 99 ? 0 : 10;
      $('#c-count').textContent = count;
      $('#c-sub').textContent = money(sub);
      $('#c-ship').textContent = ship ? money(ship) : 'Free';
      $('#c-total').textContent = money(sub + ship);
      $('#c-items').innerHTML = c.length ? c.map(function (x, i) {
        return '<div class="cart-row"><div class="thumb">' + apron(x.hex, x.dark, { mini: true }) + '</div>' +
          '<div style="flex:1 1 200px;min-width:0"><div style="font-weight:600">' + esc(x.name) + '</div><div style="font-size:14px;color:var(--muted)">Color: ' + esc(x.colorName) + (x.text ? ' · Engraving: “' + esc(x.text) + '”' : '') + '</div></div>' +
          '<div style="font-weight:600;width:90px">' + money(x.price) + '</div>' +
          '<div class="qty"><button type="button" aria-label="Decrease quantity" data-dec="' + i + '">−</button><span>' + x.qty + '</span><button type="button" aria-label="Increase quantity" data-inc="' + i + '">+</button></div>' +
          '<button type="button" class="icon-btn" aria-label="Remove ' + esc(x.name) + '" data-rm="' + i + '">' + icon('trash') + '</button></div>';
      }).join('') : '<div style="padding:56px 0;text-align:center;color:var(--muted)">Your cart is empty. <a href="shop.html">Browse aprons</a></div>';
      $('#c-checkout').disabled = !c.length;
    }
    $('#c-items').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var c = readCart();
      if (b.hasAttribute('data-inc')) c[+b.getAttribute('data-inc')].qty = Math.min(20, c[+b.getAttribute('data-inc')].qty + 1);
      else if (b.hasAttribute('data-dec')) c[+b.getAttribute('data-dec')].qty = Math.max(1, c[+b.getAttribute('data-dec')].qty - 1);
      else if (b.hasAttribute('data-rm')) c.splice(+b.getAttribute('data-rm'), 1);
      writeCart(c); draw();
    });
    $('#c-checkout').addEventListener('click', function () { $('#c-note').classList.remove('hidden'); });
    draw();
  }

  function initContact() {
    $('#contact-form').addEventListener('submit', function (e) {
      e.preventDefault();
      $('#contact-form').classList.add('hidden');
      $('#contact-done').classList.remove('hidden');
    });
  }

  // expose for the AI page
  window.CLA = { apronSVG: apron, addToCart: addToCart, icon: icon, money: money, esc: esc };

  document.addEventListener('DOMContentLoaded', function () {
    renderHeader(); renderFooter(); updateBadge();
    var page = document.body.getAttribute('data-page');
    if (page === 'home') initHome();
    if (page === 'shop') initShop();
    if (page === 'customize') initProduct();
    if (page === 'cart') initCart();
    if (page === 'contact') initContact();
  });
})();
