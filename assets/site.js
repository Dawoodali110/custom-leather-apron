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
    olive: { name: 'Olive', hex: '#556131', dark: '#2F3719' },
    oxblood: { name: 'Oxblood', hex: '#8A2A18', dark: '#4E140A' }
  };
  var PRODUCTS = [
    { id: 'classic', name: 'Classic Leather Apron', price: 119, color: 'brown', colors: ['brown', 'black', 'tan', 'oxblood', 'olive'], photos: { brown: 'assets/img/product-classic-brown.webp', black: 'assets/img/product-classic-black.webp', tan: 'assets/img/product-classic-tan.webp', oxblood: 'assets/img/product-classic-oxblood.webp', olive: 'assets/img/product-classic-olive.webp' }, cat: 'chef', tags: ['best', 'custom', 'top'], desc: 'A timeless full-grain leather bib with cross-back straps, brass buckles, a deep double front pocket, a towel ring and reinforced corners — built for chefs, makers and everyday professionals.' },
    { id: 'barber', name: 'Barber Leather Apron', price: 129, color: 'black', colors: ['black'], photo: 'assets/img/product-barber.webp', cat: 'barber', tags: ['best', 'new', 'custom'], desc: 'Black full-grain leather with tan cross-back straps, slim clipper and trimmer sleeves, shear and comb pockets, and the embossed Barber patch.' },
    { id: 'workshop', name: 'Workshop Leather Apron', price: 139, color: 'black', colors: ['black'], photo: 'assets/img/product-workshop.webp', cat: 'workshop', tags: ['best', 'new', 'top'], desc: 'Waxed-canvas body with full-grain leather tool pockets, a hammer loop, pencil holder, towel ring and reinforced corners — made for woodworkers and makers.' },
    { id: 'chefpro', name: 'Chef Pro Apron', price: 149, color: 'brown', colors: ['brown', 'black'], photos: { brown: 'assets/img/product-chefpro-brown.webp', black: 'assets/img/product-chefpro-black.webp' }, cat: 'chef', tags: ['best', 'custom', 'top', 'new'], desc: 'Our heaviest full-bib chef apron: cross-back straps, deep utensil pockets, a knife sleeve, towel ring and the embossed Chef Collection patch.' },
    { id: 'artist', name: 'Artist Studio Apron', price: null, color: 'brown', colors: ['brown'], photo: 'assets/img/product-artist.webp', cat: 'artist', tags: ['new'], desc: 'Paint-friendly full-grain leather with wide brush pockets, a palette-knife slot, a towel ring and reinforced corners.' },
    { id: 'bbq', name: 'BBQ Pitmaster Apron', price: null, color: 'brown', colors: ['brown'], photo: 'assets/img/product-bbq.webp', cat: 'bbq', tags: ['new', 'custom'], desc: 'Heat-resistant leather bib with tool pockets for spatula, fork, brush and thermometer, a sauce-bottle sleeve, towel and tong rings, and reinforced corners.' }
  ];
  var COPY = {"classic": {"title": "Classic Leather Apron — Full-Grain, Personalized", "meta": "The Classic Leather Apron: full-grain leather, cross-back straps, solid brass buckles and a riveted chest patch engraved with your logo or name. Five colours.", "intro": "The apron that started it all. Full-grain leather, cross-back straps and solid brass hardware — with a riveted chest patch ready for your name or logo.", "long": ["Some tools earn their place on the hook by the door. The Classic Leather Apron is one of them. Cut from full-grain leather, it shrugs off splashes, sparks and spills — and grows richer in colour every time you put it on.", "Cross-back straps spread the weight across your shoulders instead of your neck, so it stays comfortable through a double shift. Solid brass buckles dial in the fit in seconds, and a side ring keeps a towel exactly where your hand expects it.", "Up front, a deep double pocket carries a phone, notebook, thermometer or tape measure, while riveted corners protect the places aprons wear out first. Then make it unmistakably yours: we engrave your logo, initials or business name on the chest patch."], "features": ["Full-grain leather in Brown, Black, Tan, Oxblood or Olive", "Cross-back straps with solid brass buckles", "Deep double front pocket with riveted corners", "Side towel ring for quick wipe-downs", "Riveted chest patch, ready for your engraving"], "best": "Chefs, baristas, bartenders, makers and serious home cooks."}, "barber": {"title": "Barber Leather Apron with Clipper & Shear Pockets", "meta": "A black full-grain leather barber apron with clipper, trimmer, shear and comb pockets, tan cross-back straps and an engravable patch. Built for the chair.", "intro": "Built for the chair. Black full-grain leather, tan cross-back straps and pockets cut for clippers, trimmers, shears and combs.", "long": ["Great barbering is about having the right tool in your hand without ever looking away from the mirror. The Barber Leather Apron keeps clippers, trimmers, shears and combs exactly where you reach for them — in structured leather sleeves that hold their shape all day.", "Hair brushes straight off the smooth black leather, so you look as sharp at your last cut as you did at your first. Tan cross-back straps take the strain off your neck, and brass hardware adds a quiet touch of polish to the shop floor.", "Engrave your shop name or logo on the chest patch and give the whole team a signature look clients remember."], "features": ["Black full-grain leather with contrast tan straps", "Slim sleeves for clippers and trimmers", "Dedicated shear and comb pockets", "Smooth finish that hair brushes right off", "Embossed Barber patch — or your own logo"], "best": "Barbers, hairstylists, groomers and tattoo artists."}, "workshop": {"title": "Leather Workshop Apron for Woodworking & Tools", "meta": "A heavy-duty workshop apron with leather tool pockets, a hammer loop, pencil holder and towel ring. Made for woodworkers, carpenters and makers. Add your logo.", "intro": "A heavy-duty work apron with leather tool pockets, a hammer loop and a pencil holder — made for woodworkers, carpenters and makers.", "long": ["Every trip back to the bench costs you momentum. The Workshop Leather Apron keeps your most-used tools on your body: screwdrivers, a tape measure, wrenches, pliers and a carpenter's pencil, each in its own leather pocket, with a hammer loop on the side.", "The tough, dark body takes on wood glue, stain and shavings without complaint, while full-grain leather reinforces the pockets and corners where tools rub hardest. Cross-back straps keep the load on your shoulders, not your neck, through long build days.", "A towel ring and lower D-ring handle rags and clips, and the chest patch can carry your workshop name or logo — perfect for small teams, makerspaces and gifts for the woodworker who has everything."], "features": ["Leather tool pockets for drivers, wrenches and pliers", "Side hammer loop and pencil holder", "Towel ring and lower D-ring", "Riveted, leather-reinforced corners", "Engravable Workshop patch"], "best": "Woodworkers, carpenters, blacksmiths, mechanics and DIY makers."}, "chefpro": {"title": "Chef Pro Leather Apron with Knife & Utensil Pockets", "meta": "The Chef Pro Leather Apron: full-bib leather with deep utensil pockets, a knife sleeve, towel ring and cross-back straps. Brown or black, personalized with your logo.", "intro": "Our hardest-working kitchen apron. A full leather bib with deep utensil pockets, a knife sleeve and a towel ring — in Brown or Black.", "long": ["Designed around the rhythm of a busy pass. Deep front pockets hold tongs, whisks, spatulas and spoons upright and within reach, while a dedicated knife sleeve keeps a paring knife or thermometer secure.", "The full bib covers you from chest to knee, so oil spatter and sauce splashes wipe away instead of soaking through. Cross-back straps distribute the weight evenly, and the towel ring means no more hunting for a side towel mid-service.", "Choose rich Brown or sharp Black, then add your restaurant's logo or your own name to the Chef Collection patch."], "features": ["Full-bib coverage in Brown or Black leather", "Deep pockets for tongs, whisks and spatulas", "Knife and thermometer sleeve", "Towel ring and cross-back straps", "Engraved Chef Collection patch — or your logo"], "best": "Professional chefs, line cooks, caterers and passionate home cooks."}, "artist": {"title": "Artist Leather Apron with Brush Pockets", "meta": "A full-grain leather artist apron with brush pockets, a palette-knife slot, paint tube pockets and a towel ring. For painters, potters and illustrators.", "intro": "A studio apron that loves paint as much as you do. Full-grain leather with brush pockets, a palette-knife slot and a towel ring.", "long": ["Paint, clay and charcoal belong on the canvas — not on your clothes. The Artist Studio Apron gives every tool a home: tall brush pockets keep bristles upright, a slim slot holds your palette knife, and smaller pockets carry tubes and a watercolour pan.", "Leather wipes clean in seconds and wears every splash as part of its story. A towel ring on the side keeps a rag ready for quick brush cleans, and riveted corners stand up to years of studio life.", "Engrave your name or studio mark on the patch — a beautiful gift for painters, potters, illustrators and art teachers."], "features": ["Tall brush pockets and palette-knife slot", "Pockets for paint tubes and a watercolour pan", "Side towel ring for brush cleaning", "Wipe-clean full-grain leather", "Engravable Artist Collection patch"], "best": "Painters, potters, illustrators, sculptors and art teachers."}, "bbq": {"title": "BBQ Leather Apron for Grilling — Personalized Gift", "meta": "A leather BBQ apron with pockets for spatula, fork, brush and thermometer, a sauce-bottle sleeve and towel ring. A personalized gift every grill master will use.", "intro": "Built for fire and smoke. A leather grilling apron with pockets for your spatula, fork, brush and thermometer — and a sleeve for the sauce.", "long": ["Leather is the original grilling armour. It handles heat, flare-ups and grease far better than cotton, and every cookout adds a little more character.", "Up front, tool pockets hold a spatula, meat fork, basting brush and probe thermometer, with a side sleeve for your squeeze bottle of sauce and a towel ring for the inevitable mess. A second ring keeps tongs or a bottle opener on hand.", "Engrave a name, nickname or backyard brand on the BBQ Collection patch for a gift that gets used every weekend."], "features": ["Pockets for spatula, fork, brush and thermometer", "Sauce-bottle sleeve and tong ring", "Towel ring for quick clean-ups", "Heat-tough leather with riveted corners", "Engravable BBQ Collection patch"], "best": "Pitmasters, backyard grillers, smokehouse crews and BBQ gift-givers."}};
  var SPECS = [["Leather", "Full-grain leather that softens and darkens with wear"], ["Hardware", "Solid brass buckles, rings and rivets"], ["Stitching", "Waxed thread, double-stitched at stress points"], ["Fit", "Adjustable cross-back straps — one size fits most adults"], ["Personalization", "Logo, name or initials engraved on the chest patch (+$15)"], ["Care", "Wipe clean with a damp cloth; condition every few months"], ["Warranty", "1-year craftsmanship warranty"]];
  var SITE = 'https://dawoodali110.github.io/custom-leather-apron/';
  var BRAND = 'Custom Leather Apron';
  var CAT_COPY = {"all": {"h1": "Shop Leather Aprons", "intro": "Handcrafted full-grain leather aprons for every trade — each one finished with solid brass hardware and ready for your logo or name.", "title": "Shop Leather Aprons — Chef, Barber, Workshop, BBQ & Artist", "meta": "Shop handcrafted full-grain leather aprons for chefs, barbers, woodworkers, artists and pitmasters. Personalize with your logo or name. Free shipping over $99."}, "chef": {"h1": "Leather Chef Aprons", "intro": "Kitchen-tough leather bibs with deep utensil pockets, knife sleeves and towel rings — built for the heat of service.", "title": "Leather Chef Aprons — Personalized Kitchen Aprons", "meta": "Leather chef aprons with utensil pockets, knife sleeves and towel rings. Full-grain leather, cross-back straps and your restaurant logo engraved on the chest."}, "barber": {"h1": "Leather Barber Aprons", "intro": "Sleek black leather with sleeves for clippers, trimmers, shears and combs. Hair brushes right off.", "title": "Leather Barber Aprons with Clipper Pockets", "meta": "Black full-grain leather barber aprons with clipper, trimmer, shear and comb pockets. Personalize with your barbershop logo."}, "workshop": {"h1": "Leather Workshop Aprons", "intro": "Heavy-duty work aprons with tool pockets, hammer loops and pencil holders for woodworkers and makers.", "title": "Leather Workshop & Woodworking Aprons", "meta": "Heavy-duty leather workshop aprons with tool pockets, hammer loop and pencil holder. Built for woodworkers, carpenters and makers."}, "artist": {"h1": "Leather Artist Aprons", "intro": "Studio aprons with tall brush pockets, a palette-knife slot and a towel ring. Paint wipes off; character stays.", "title": "Leather Artist Aprons for Painters & Potters", "meta": "Full-grain leather artist aprons with brush pockets, palette-knife slot and towel ring — for painters, potters and illustrators."}, "bbq": {"h1": "Leather BBQ Aprons", "intro": "Grilling aprons that handle heat and smoke, with pockets for your spatula, fork, brush and thermometer.", "title": "Leather BBQ & Grilling Aprons — Personalized Gifts", "meta": "Leather BBQ aprons with tool pockets, sauce-bottle sleeve and towel ring. A personalized gift every grill master will use."}};
  var CATS = [
    { id: 'all', label: 'All Aprons' }, { id: 'chef', label: 'Chef Aprons' }, { id: 'barber', label: 'Barber Aprons' },
    { id: 'workshop', label: 'Workshop Aprons' }, { id: 'artist', label: 'Artist Aprons' }, { id: 'bbq', label: 'BBQ Aprons' }
  ];
  var ENGRAVE_FEE = 15;

  function money(n) { return n == null ? 'Price on request' : '$' + n.toFixed(2); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // ---------- SEO helpers ----------
  function setMeta(attr, key, val) {
    var el = document.head.querySelector('meta[' + attr + '="' + key + '"]');
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute('content', val);
  }
  function setCanonical(url) {
    var el = document.head.querySelector('link[rel="canonical"]');
    if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el); }
    el.href = url;
  }
  function withBrand(t) { return t.length <= 42 ? t + ' | ' + BRAND : t; }
  function setSEO(o) {
    document.title = o.title;
    setMeta('name', 'description', o.desc);
    setMeta('property', 'og:title', o.title); setMeta('property', 'og:description', o.desc);
    setMeta('name', 'twitter:title', o.title); setMeta('name', 'twitter:description', o.desc);
    if (o.url) { setCanonical(o.url); setMeta('property', 'og:url', o.url); }
    if (o.image) { setMeta('property', 'og:image', o.image); setMeta('name', 'twitter:image', o.image); }
    if (o.type) setMeta('property', 'og:type', o.type);
  }
  function addJsonLd(obj, id) {
    var old = id && document.getElementById(id); if (old) old.remove();
    var sc = document.createElement('script'); sc.type = 'application/ld+json'; if (id) sc.id = id;
    sc.textContent = JSON.stringify(obj); document.head.appendChild(sc);
  }
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
    if (!item.silent) showAdded(item);
  }

  // ---------- "Added to cart" popup ----------
  var popTimer, lastFocus;
  function closeAdded() {
    var el = document.getElementById('added-pop'); if (!el) return;
    el.classList.remove('show'); clearTimeout(popTimer);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 250);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function showAdded(item) {
    var old = document.getElementById('added-pop'); if (old) old.parentNode.removeChild(old);
    lastFocus = document.activeElement;
    var count = cartCount();
    var sub = readCart().reduce(function (t, x) { return t + x.price * x.qty; }, 0);
    var away = sub >= 99 ? '<p class="ap-ship ok">✓ Your order qualifies for free shipping</p>' : '<p class="ap-ship">Add ' + money(99 - sub) + ' more for free shipping</p>';
    var thumb = item.photo ? '<img src="' + item.photo + '" alt="">' : apron(item.hex, item.dark, { mini: true });
    var el = document.createElement('div');
    el.id = 'added-pop'; el.className = 'added-pop'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'false'); el.setAttribute('aria-labelledby', 'ap-title');
    el.innerHTML =
      '<div class="ap-head"><span class="ap-check" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></span>' +
      '<b id="ap-title">Added to your cart</b><button type="button" class="ap-x" aria-label="Close">×</button></div>' +
      '<div class="ap-item"><div class="ap-thumb">' + thumb + '</div><div class="ap-info"><b>' + esc(item.name) + '</b>' +
      '<span>' + esc(item.colorName || '') + (item.text ? ' · Engraving: “' + esc(item.text) + '”' : '') + '</span>' +
      '<span>Qty ' + item.qty + ' · ' + money(item.price * item.qty) + '</span></div></div>' + away +
      '<div class="ap-actions"><a class="btn btn-outline-dark" href="cart.html">View Cart (' + count + ')</a><a class="btn btn-primary" href="checkout.html">Checkout</a></div>' +
      '<button type="button" class="ap-continue">Continue shopping</button>';
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('show'); });
    el.querySelector('.ap-x').addEventListener('click', closeAdded);
    el.querySelector('.ap-continue').addEventListener('click', closeAdded);
    el.addEventListener('mouseenter', function () { clearTimeout(popTimer); });
    el.addEventListener('mouseleave', function () { popTimer = setTimeout(closeAdded, 4000); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAdded(); });
    el.querySelector('.ap-actions .btn-primary').focus({ preventScroll: true });
    popTimer = setTimeout(closeAdded, 8000);
    $$('.badge[data-cart-count]').forEach(function (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); });
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
        '<a class="brand" href="index.html" aria-label="Custom Leather Apron — home"><img class="brand-logo" src="assets/img/logo-light.webp" alt="Custom Leather Apron" width="900" height="334"></a>' +
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
      ['scissors', 'Custom Engraving', 'Add your name or logo'], ['leaf', 'Full-Grain Leather', 'With solid brass hardware'],
      ['card', 'Proof Before Engraving', 'Approve your design first']
    ];
    el.innerHTML =
      '<footer class="site-footer"><div class="wrap" style="padding-top:32px">' +
        '<div class="newsletter">' +
          '<div style="display:flex;align-items:center;gap:24px;flex:1 1 420px;min-width:0"><span style="color:#D9954E">' + icon('mail', 40, ' stroke-width="1.4"') + '</span>' +
            '<div><div class="serif" style="font-weight:700;font-size:24px;color:#F4EFE8">Join Our Newsletter</div><div style="color:#D8CCBF;font-size:15px">Get exclusive offers, new arrivals, and craftsmanship stories.</div></div></div>' +
          '<form id="news-form"><label for="news-email" class="visually-hidden">Email address</label><input id="news-email" type="email" required placeholder="Enter your email address"><button type="submit">Subscribe ' + icon('arrow', 16) + '</button></form>' +
        '</div>' +
        '<div class="f-cols">' +
          '<div style="flex:1.4 1 280px;padding-left:0;gap:18px"><a class="brand" href="index.html" aria-label="Custom Leather Apron — home"><img class="brand-logo foot" src="assets/img/logo-light.webp" alt="Custom Leather Apron" width="900" height="334" loading="lazy"></a>' +
            '<p style="margin:0;font-size:15px;max-width:290px">Handcrafted full-grain leather aprons for chefs, barbers, woodworkers, artists and pitmasters — personalized with your logo or name and built to last for years.</p>' +
            '<div class="socials"><a href="#" aria-label="Instagram"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg></a><a href="#" aria-label="Facebook"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M15 3h-2a4 4 0 0 0-4 4v14M6 11h8"/></svg></a><a href="#" aria-label="YouTube"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor"/></svg></a><a href="#" aria-label="Pinterest"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M10 21l2-9M12 12a2.5 2.5 0 1 1 2.5 2.5"/></svg></a><a href="#" aria-label="TikTok"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M14 3v12a4 4 0 1 1-4-4M14 3c0 3 2 5 5 5"/></svg></a></div></div>' +
          '<div style="flex:1 1 160px;border-left:1px solid #3A2C22"><h4>Shop</h4>' + CATS.map(function (c) { return '<a href="shop.html?cat=' + c.id + '">' + c.label + '</a>'; }).join('') + '</div>' +
          '<div style="flex:1 1 170px"><h4>Quick Links</h4><a href="index.html">Home</a><a href="shop.html">Shop</a><a href="shop.html">Collections</a><a href="design-ai.html">Design with AI</a><a href="about.html">About Us</a><a href="contact.html">Contact Us</a></div>' +
          '<div style="flex:1.2 1 220px"><h4>Customer Support</h4>' +
            [['help', 'FAQs', 'index.html#faq'], ['truck', 'Shipping Policy', 'shipping.html'], ['ret', 'Returns &amp; Refunds', 'returns.html']].map(function (x) { return '<a class="ic" href="' + x[2] + '">' + icon(x[0]) + x[1] + '</a>'; }).join('') + '</div>' +
          '<div style="flex:1.3 1 240px;border-left:1px solid #3A2C22;padding-left:32px;gap:14px"><h4>Contact Us</h4>' +
            '<a class="ic" href="mailto:sales@customleatherapron.com">' + icon('mail') + 'sales@customleatherapron.com</a>' +
            '<a class="ic" href="contact.html">' + icon('help') + 'Contact form</a></div>' +
        '</div>' +
        '<div class="trust">' + trust.map(function (t) { return '<div><span style="color:#D9954E">' + icon(t[0], 34, ' stroke-width="1.3"') + '</span><div><b>' + t[1] + '</b><small>' + t[2] + '</small></div></div>'; }).join('') + '</div>' +
        '<div class="f-bottom"><span>© ' + new Date().getFullYear() + ' Custom Leather Apron. All rights reserved.</span>' +
          '<nav aria-label="Legal"><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms of Service</a><a href="returns.html">Refund Policy</a><a href="shipping.html">Shipping Policy</a></nav>' +
          '' +
      '</div></footer>';
    $('#news-form').addEventListener('submit', function (e) {
      e.preventDefault();
      this.innerHTML = '<div style="padding:13px 16px;color:#F4EFE8;background:#24180F;width:100%">Thanks for subscribing!</div>';
    });
  }

  // ---------- Product card ----------
  function photoOf(p, color) { return p.photos ? (p.photos[color] || p.photos[p.color]) : p.photo; }
  function card(p) {
    var c = COLORS[p.color];
    var badge = p.tags.indexOf('new') !== -1 ? 'New' : '';
    var dots = (p.colors || [p.color]).map(function (k) { return '<i style="background:' + COLORS[k].hex + '" title="' + COLORS[k].name + '"></i>'; }).join('');
    return '<a class="card" href="product.html?id=' + p.id + '">' +
      '<div class="img">' + (badge ? '<span class="badge-tag">' + badge + '</span>' : '') + '<span class="heart">' + icon('heart', 22) + '</span>' +
      (photoOf(p, p.color) ? '<img class="card-photo" src="' + photoOf(p, p.color) + '" alt="' + esc(p.name) + '" loading="lazy">' : apron(c.hex, c.dark)) +
      '<span class="card-cta">View options →</span></div>' +
      '<div class="card-info"><div class="name">' + esc(p.name) + '</div>' +
      '<div class="meta">' + (p.price == null ? 'Made to order' : 'Personalize with your name or logo') + '</div>' +
      '<div class="card-bottom"><div class="price">' + money(p.price) + '</div><div class="dots" aria-label="' + (p.colors || [p.color]).length + ' colours">' + dots + '</div></div></div></a>';
  }

  function initPersonalize() {
    var input = $('#pz-input'); if (!input) return;
    var BG = { cognac: '#9A4A1F', dark: '#4A1C10', black: '#171412', olive: '#3F4A1E', burgundy: '#6E1712' };
    var col = 'cognac', img = $('.pz-preview img'), patch = $('.pz-patch'), txt = $('#pz-text');
    function draw() {
      var t = input.value.trim().toUpperCase() || 'YOUR NAME';
      txt.textContent = t; txt.style.fontSize = Math.min(4.4, 46 / Math.max(t.length, 6)) + 'cqw';
      patch.style.backgroundColor = BG[col]; img.src = 'assets/img/ai-logo-' + col + '.webp';
      $('#pz-go').href = 'design-ai.html' + (input.value.trim() ? '?name=' + encodeURIComponent(input.value.trim()) : '');
    }
    input.addEventListener('input', draw);
    $$('[data-pz]').forEach(function (b) { b.addEventListener('click', function () {
      col = b.getAttribute('data-pz'); $$('[data-pz]').forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); draw(); }); });
    draw();
  }

  function initReveal() {
    var els = $$('.reveal'); if (!els.length) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    document.documentElement.classList.add('has-reveal');
    var io = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  // ---------- Pages ----------
  function initHome() {
    var tabs = [['best', 'Featured'], ['new', 'New Arrivals'], ['custom', 'Personalizable']];
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
        return (cur === 'all' || p.cat === cur) && (!color || p.color === color || (p.colors && p.colors.indexOf(color) !== -1) || (color === 'brown' && /cognac|chocolate|brown/.test(p.color))) && (p.price == null || p.price <= max);
      });
    }
    function draw() {
      var cc = CAT_COPY[cur] || CAT_COPY.all;
      if ($('#shop-h1')) { $('#shop-h1').textContent = cc.h1; $('#shop-intro').textContent = cc.intro; $('#shop-crumb').textContent = cur === 'all' ? 'Shop' : cc.h1; }
      setSEO({ title: withBrand(cc.title), desc: cc.meta, url: SITE + 'shop.html' + (cur === 'all' ? '' : '?cat=' + cur) });
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
        return PRODUCTS.indexOf(a) - PRODUCTS.indexOf(b);
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
    var wanted = new URLSearchParams(location.search).get('color');
    var st = { color: swatches.indexOf(wanted) !== -1 ? wanted : (swatches.indexOf(p.color) !== -1 ? p.color : swatches[0]), qty: 1, text: '', view: 0, tab: 'desc' };
    var cp = COPY[p.id] || {};
    var pUrl = SITE + 'product.html?id=' + p.id;
    var firstPhoto = p.photo || (p.photos && p.photos[p.color]);
    setSEO({ title: withBrand(cp.title || p.name), desc: cp.meta || p.desc, url: pUrl, image: firstPhoto ? SITE + firstPhoto.replace(/\.webp$/, '.webp') : SITE + 'assets/img/hero-banner.jpg', type: 'product' });
    var ld = { '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: cp.meta || p.desc, brand: { '@type': 'Brand', name: BRAND }, category: 'Aprons', material: 'Full-grain leather', url: pUrl,
      image: (p.photos ? Object.keys(p.photos).map(function (k) { return SITE + p.photos[k]; }) : (p.photo ? [SITE + p.photo] : [])) };
    if (p.colors) ld.color = p.colors.map(function (c) { return COLORS[c].name; }).join(', ');
    if (p.price != null) ld.offers = { '@type': 'Offer', price: p.price.toFixed(2), priceCurrency: 'USD', url: pUrl };
    addJsonLd(ld, 'ld-product');
    addJsonLd({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: SITE + 'shop.html' },
      { '@type': 'ListItem', position: 3, name: p.name, item: pUrl }] }, 'ld-crumbs');
    if ($('#p-long')) $('#p-long').innerHTML = (cp.long || [p.desc]).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
      (cp.features ? '<h3>Key features</h3><ul class="p-features">' + cp.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' : '') +
      (cp.best ? '<p class="p-best"><b>Perfect for:</b> ' + esc(cp.best) + '</p>' : '');
    if ($('#p-specs')) $('#p-specs').innerHTML = SPECS.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') +
      (p.colors ? '<dt>Colours</dt><dd>' + p.colors.map(function (c) { return COLORS[c].name; }).join(', ') + '</dd>' : '');
    $('#p-name').textContent = p.name; $('#p-crumb').textContent = p.name;
    $('#p-desc').textContent = cp.intro || p.desc;
    function price() { return p.price == null ? null : p.price + (st.text.trim() ? ENGRAVE_FEE : 0); }
    function draw() {
      var c = COLORS[st.color];
      $('#p-price').textContent = money(price());
      $('#p-color').textContent = c.name;
      var ph = photoOf(p, st.color);
      if (ph) {
        var v = VIEWS[st.view];
        $('#p-main').innerHTML = '<img class="pdp-photo" src="' + ph + '" alt="' + esc(p.name) + ' in ' + c.name + ', ' + v[0].toLowerCase() + '" style="transform:scale(' + v[1] + ');transform-origin:' + v[2] + '">';
        var zoomThumb = function (x, i) {
          return '<button type="button" aria-label="' + x[0] + '" data-view="' + i + '" class="' + (i === st.view ? 'on' : '') + '" style="overflow:hidden"><img src="' + ph + '" alt="" style="width:100%;height:100%;object-fit:contain;transform:scale(' + x[1] + ');transform-origin:' + x[2] + '"></button>';
        };
        if (p.photos && swatches.length > 1) {
          // one full-view thumbnail per colour photo, then detail zooms of the current colour
          $('#p-thumbs').innerHTML = swatches.map(function (id) {
            var on = id === st.color && st.view === 0;
            return '<button type="button" aria-label="' + COLORS[id].name + ' apron" data-thumbcolor="' + id + '" class="' + (on ? 'on' : '') + '" style="overflow:hidden"><img src="' + photoOf(p, id) + '" alt="" style="width:100%;height:100%;object-fit:contain"></button>';
          }).join('') + (swatches.length > 3 ? '' : VIEWS.slice(1, 3).map(function (x, i) { return zoomThumb(x, i + 1); }).join(''));
        } else {
          $('#p-thumbs').innerHTML = VIEWS.map(zoomThumb).join('');
        }
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
    $('#p-thumbs').addEventListener('click', function (e) {
      var t = e.target.closest('[data-thumbcolor]'); if (t) { st.color = t.getAttribute('data-thumbcolor'); st.view = 0; draw(); return; }
      var b = e.target.closest('[data-view]'); if (b) { st.view = +b.getAttribute('data-view'); draw(); }
    });
    $('#p-text').addEventListener('input', function () { st.text = this.value; draw(); });
    $('#p-dec').addEventListener('click', function () { st.qty = Math.max(1, st.qty - 1); draw(); });
    $('#p-inc').addEventListener('click', function () { st.qty = Math.min(20, st.qty + 1); draw(); });
    $$('.tabs button').forEach(function (b) { b.addEventListener('click', function () { st.tab = b.getAttribute('data-tab'); draw(); }); });
    function add(silent) {
      var c = COLORS[st.color];
      addToCart({ id: p.id, name: p.name, color: st.color, colorName: c.name, hex: c.hex, dark: c.dark, price: price() || 0, qty: st.qty, text: st.text.trim(), photo: photoOf(p, st.color) || '', silent: !!silent });
    }
    if (p.price == null) {
      var qtyBox = $('#p-qty') && $('#p-qty').closest('.qty'); if (qtyBox && qtyBox.parentElement) qtyBox.parentElement.classList.add('hidden');
      $('#p-add').classList.add('hidden');
      var q = $('#p-buy'); q.outerHTML = '<a id="p-quote" class="btn btn-primary" href="contact.html?topic=custom">Request a Quote</a><p class="p-quote-note">Price on request — tell us the colour and engraving you want and we\'ll send you a quote.</p>';
    } else {
    $('#p-add').addEventListener('click', function () { add(false); var b = this; b.innerHTML = icon('cart') + ' Added to Cart ✓'; setTimeout(function () { b.innerHTML = icon('cart') + ' Add to Cart'; }, 2500); });
    $('#p-buy').addEventListener('click', function () { add(true); location.href = 'checkout.html'; });
    }
    draw();
  }

  function initCart() {
    function draw() {
      var c = readCart();
      var count = c.reduce(function (s, x) { return s + x.qty; }, 0);
      var sub = c.reduce(function (s, x) { return s + x.price * x.qty; }, 0);
      var eng = c.reduce(function (s, x) { return s + (x.text ? ENGRAVE_FEE * x.qty : 0); }, 0);
      var ship = sub === 0 || sub >= 99 ? 0 : 10;
      $('#c-count').textContent = count + (count === 1 ? ' item' : ' items');
      $('#c-empty').classList.toggle('hidden', !!c.length); $('#c-main').classList.toggle('hidden', !c.length); $('#c-count-wrap').classList.toggle('hidden', !c.length);
      if (!c.length) { drawRecs([]); return; }
      $('#c-sub').textContent = money(sub);
      $('#c-eng').textContent = eng ? 'Included (' + money(eng) + ')' : '—';
      $('#c-ship').textContent = ship ? money(ship) : 'Free';
      $('#c-total').textContent = money(sub + ship);
      var pct = Math.min(100, Math.round(sub / 99 * 100));
      $('#c-progress').innerHTML = (sub >= 99 ? '<p><b>🎉 You\'ve unlocked free shipping!</b></p>' : '<p>You\'re <b>' + money(99 - sub) + '</b> away from <b>free shipping</b></p>') +
        '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div>';
      $('#c-items').innerHTML = c.map(function (x, i) {
        var link = x.id && x.id.indexOf('ai-') !== 0 ? 'product.html?id=' + x.id + '&color=' + x.color : 'design-ai.html';
        return '<div class="cart-line">' +
          '<a class="cl-thumb" href="' + link + '">' + (x.photo ? '<img src="' + x.photo + '" alt="">' : apron(x.hex, x.dark, { mini: true })) + '</a>' +
          '<div class="cl-info"><a href="' + link + '" class="cl-name">' + esc(x.name) + '</a>' +
            '<span>Colour: ' + esc(x.colorName) + '</span>' + (x.text ? '<span class="cl-eng">Engraving: “' + esc(x.text) + '”</span>' : '') +
            '<button type="button" class="link-btn cl-rm" data-rm="' + i + '">Remove</button></div>' +
          '<div class="cl-price"><span class="lbl">Price</span>' + money(x.price) + '</div>' +
          '<div class="cl-qty"><div class="qty"><button type="button" aria-label="Decrease quantity of ' + esc(x.name) + '" data-dec="' + i + '"' + (x.qty <= 1 ? ' disabled' : '') + '>−</button><span>' + x.qty + '</span><button type="button" aria-label="Increase quantity of ' + esc(x.name) + '" data-inc="' + i + '">+</button></div></div>' +
          '<div class="cl-total"><span class="lbl">Total</span>' + money(x.price * x.qty) + '</div></div>';
      }).join('');
      drawRecs(c);
    }
    function drawRecs(c) {
      var inCart = c.map(function (x) { return x.id; });
      var recs = PRODUCTS.filter(function (p) { return p.price != null && inCart.indexOf(p.id) === -1; }).slice(0, 4);
      $('#c-recs').classList.toggle('hidden', !recs.length);
      $('#c-recs-grid').innerHTML = recs.map(card).join('');
    }
    $('#c-items').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var c = readCart();
      if (b.hasAttribute('data-inc')) c[+b.getAttribute('data-inc')].qty = Math.min(20, c[+b.getAttribute('data-inc')].qty + 1);
      else if (b.hasAttribute('data-dec')) c[+b.getAttribute('data-dec')].qty = Math.max(1, c[+b.getAttribute('data-dec')].qty - 1);
      else if (b.hasAttribute('data-rm')) c.splice(+b.getAttribute('data-rm'), 1);
      writeCart(c); draw();
    });
    $('#c-clear').addEventListener('click', function () { writeCart([]); draw(); });
    draw();
  }

  function initContact() {
    var form = $('#contact-form'), topic = $('#cf-topic');
    function syncTopic() {
      var t = topic.value;
      $$('.bulk-only').forEach(function (el) { el.classList.toggle('hidden', t !== 'bulk'); });
      $$('.order-only').forEach(function (el) { el.classList.toggle('hidden', t !== 'support'); });
      $$('.topic').forEach(function (b) { var on = b.getAttribute('data-topic') === t; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    }
    $$('.topic').forEach(function (b) {
      b.addEventListener('click', function () { topic.value = b.getAttribute('data-topic'); syncTopic(); $('#cf-name').focus(); form.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    });
    var pre = new URLSearchParams(location.search).get('topic'); if (pre && topic.querySelector('option[value="' + pre + '"]')) topic.value = pre;
    topic.addEventListener('change', syncTopic); syncTopic();
    $('#cf-file').addEventListener('change', function () { $('#cf-file-name').textContent = this.files[0] ? this.files[0].name : 'Choose a PNG, JPG, SVG or PDF'; });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#cf-name').value.trim(), email = $('#cf-email').value.trim(), msg = $('#cf-msg').value.trim(), err = $('#cf-error');
      var problem = !name ? 'Please add your name.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Please enter a valid email address.' : !msg ? 'Please write a short message.' : '';
      if (problem) { err.textContent = problem; err.classList.remove('hidden'); return; }
      err.classList.add('hidden');
      var t = topic.options[topic.selectedIndex].text;
      var lines = ['Name: ' + name, 'Email: ' + email];
      if ($('#cf-phone').value.trim()) lines.push('Phone: ' + $('#cf-phone').value.trim());
      lines.push('Topic: ' + t);
      if (topic.value === 'bulk') { if ($('#cf-biz').value.trim()) lines.push('Business: ' + $('#cf-biz').value.trim()); lines.push('Quantity: ' + $('#cf-qty').value); }
      if (topic.value === 'support' && $('#cf-order').value.trim()) lines.push('Order number: ' + $('#cf-order').value.trim());
      lines.push('', msg);
      var hasFile = !!$('#cf-file').files[0];
      if (hasFile) lines.push('', '(I will attach my logo file: ' + $('#cf-file').files[0].name + ')');
      location.href = 'mailto:sales@customleatherapron.com?subject=' + encodeURIComponent(t + ' — ' + name) + '&body=' + encodeURIComponent(lines.join('\n'));
      form.classList.add('hidden'); $('#contact-done').classList.remove('hidden'); $('#cf-file-hint').classList.toggle('hidden', !hasFile);
    });
    $('#cf-again').addEventListener('click', function () { form.reset(); syncTopic(); $('#cf-file-name').textContent = 'Choose a PNG, JPG, SVG or PDF'; $('#contact-done').classList.add('hidden'); form.classList.remove('hidden'); });
  }

  function initCheckout() {
    var cart = readCart(), mailHref = '';
    if (!cart.length) { $('#co-main').classList.add('hidden'); $('#co-empty').classList.remove('hidden'); return; }
    var sub = cart.reduce(function (s, x) { return s + x.price * x.qty; }, 0);
    function shipCost() { return sub >= 99 ? 0 : ($('#co-country').value === 'United States' ? 10 : null); }
    function draw() {
      var sc = shipCost(), intl = $('#co-country').value !== 'United States';
      $('#co-items').innerHTML = cart.map(function (x) {
        return '<div class="co-item"><div class="thumb">' + (x.photo ? '<img src="' + x.photo + '" alt="">' : apron(x.hex, x.dark, { mini: true })) + '<span class="qty-badge">' + x.qty + '</span></div>' +
          '<div style="flex:1;min-width:0"><b>' + esc(x.name) + '</b><small>' + esc(x.colorName) + (x.text ? ' · Engraving: “' + esc(x.text) + '”' : '') + '</small></div><b>' + money(x.price * x.qty) + '</b></div>';
      }).join('');
      $('#co-sub').textContent = money(sub);
      $('#co-ship').textContent = sc === 0 ? 'Free' : sc == null ? 'Quoted before payment' : money(sc);
      $('#co-ship-price').textContent = $('#co-ship').textContent;
      $('#co-ship-eta').textContent = (intl ? '7–21' : '3–7') + ' business days after dispatch';
      var total = money(sub + (sc || 0)) + (sc == null ? ' + shipping' : '');
      $('#co-total').textContent = total; $('#co-btn-total').textContent = total;
    }
    $('#co-country').addEventListener('change', draw); draw();
    function v(id) { return $('#' + id).value.trim(); }
    $('#co-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var need = [['co-email', 'your email'], ['co-first', 'your first name'], ['co-last', 'your last name'], ['co-addr1', 'your address'], ['co-city', 'your city'], ['co-zip', 'your ZIP / postal code']];
      var miss = need.filter(function (n) { return !v(n[0]); })[0], err = $('#co-error');
      var msg = miss ? 'Please enter ' + miss[1] + '.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('co-email')) ? 'Please enter a valid email address.' : !$('#co-terms').checked ? 'Please agree to the Terms of Service to continue.' : '';
      if (msg) { err.textContent = msg; err.classList.remove('hidden'); if (miss) $('#' + miss[0]).focus(); return; }
      err.classList.add('hidden');
      var d = new Date(), id = 'CLA-' + String(d.getFullYear()).slice(2) + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2) + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
      var sc = shipCost();
      var lines = ['NEW ORDER ' + id, '',
        'Customer: ' + v('co-first') + ' ' + v('co-last') + (v('co-company') ? ' (' + v('co-company') + ')' : ''),
        'Email: ' + v('co-email') + (v('co-phone') ? '   Phone: ' + v('co-phone') : ''), '',
        'Ship to:', v('co-addr1') + (v('co-addr2') ? ', ' + v('co-addr2') : ''), v('co-city') + (v('co-state') ? ', ' + v('co-state') : '') + ' ' + v('co-zip'), $('#co-country').value, '',
        'Items:'].concat(cart.map(function (x) { return '- ' + x.qty + ' x ' + x.name + ' (' + x.colorName + ')' + (x.text ? ' — engraving: "' + x.text + '"' : '') + ' — ' + money(x.price * x.qty); }))
        .concat(['', 'Subtotal: ' + money(sub), 'Shipping: ' + (sc === 0 ? 'Free' : sc == null ? 'To be quoted' : money(sc)), 'Total: ' + money(sub + (sc || 0)) + (sc == null ? ' + shipping' : ''),
          v('co-notes') ? '\nNotes: ' + v('co-notes') : '', $('#co-news').checked ? 'Newsletter: yes' : '', '', 'Please send me the secure payment link for this order.']);
      mailHref = 'mailto:sales@customleatherapron.com?subject=' + encodeURIComponent('Order ' + id + ' — ' + v('co-first') + ' ' + v('co-last')) + '&body=' + encodeURIComponent(lines.join('\n'));
      location.href = mailHref;
      $('#co-done-name').textContent = v('co-first'); $('#co-done-id').textContent = id; $('#co-done-email').textContent = v('co-email');
      $('#co-main').classList.add('hidden'); $('#co-done').classList.remove('hidden'); window.scrollTo(0, 0);
      writeCart([]);
    });
    $('#co-resend').addEventListener('click', function () { if (mailHref) location.href = mailHref; });
  }

  function initPolicy() {
    var secs = $$('.policy-body section[id]');
    secs.forEach(function (sec, i) {
      var h = sec.querySelector('h2'); if (h && !h.querySelector('.sec-num')) h.insertAdjacentHTML('afterbegin', '<span class="sec-num">' + ('0' + (i + 1)).slice(-2) + '</span>');
    });
    var links = $$('.policy-box ol a'), bar = $('#read-bar');
    function onScroll() {
      var cur = secs[0];
      secs.forEach(function (sec) { if (sec.getBoundingClientRect().top <= 160) cur = sec; });
      links.forEach(function (a) { a.classList.toggle('active', cur && a.getAttribute('href') === '#' + cur.id); });
      if (bar) { var r = $('.policy-body').getBoundingClientRect(), total = r.height - window.innerHeight * 0.5; bar.style.width = Math.max(0, Math.min(100, (160 - r.top) / total * 100)) + '%'; }
    }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  // expose for the AI page
  window.CLA = { apronSVG: apron, addToCart: addToCart, icon: icon, money: money, esc: esc };

  document.addEventListener('DOMContentLoaded', function () {
    renderHeader(); renderFooter(); updateBadge();
    var page = document.body.getAttribute('data-page');
    if (page === 'home') { initHome(); initPersonalize(); }
    initReveal();
    if (page === 'shop') initShop();
    if (page === 'customize') initProduct();
    if (page === 'cart') initCart();
    if (page === 'contact') initContact();
    if (page === 'checkout') initCheckout();
    if (page === 'policy') initPolicy();
  });
})();
