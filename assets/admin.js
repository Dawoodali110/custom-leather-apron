/* Custom Leather Apron — admin dashboard */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  var DB = window.CLADB, CLA = window.CLA || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { return n == null || isNaN(n) ? '—' : '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var fmtDate = function (d, time) { var x = new Date(d); return x.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + (time ? ' · ' + x.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''); };
  var ago = function (d) { var s = (Date.now() - new Date(d)) / 1000; if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + 'm ago'; if (s < 86400) return Math.floor(s / 3600) + 'h ago'; if (s < 604800) return Math.floor(s / 86400) + 'd ago'; return fmtDate(d); };

  var ORDER_STATUS = [
    ['new', 'New'], ['awaiting_payment', 'Awaiting payment'], ['paid', 'Paid'], ['in_production', 'In production'],
    ['shipped', 'Shipped'], ['delivered', 'Delivered'], ['cancelled', 'Cancelled'], ['refunded', 'Refunded']];
  var MSG_STATUS = [['new', 'New'], ['replied', 'Replied'], ['closed', 'Closed']];
  var PAID = ['paid', 'in_production', 'shipped', 'delivered'];
  var STATUS_COLOR = { new: '#D07A34', awaiting_payment: '#C9A227', paid: '#2E6297', in_production: '#6A3FB0', shipped: '#14716F', delivered: '#2F7D3A', cancelled: '#A99C8F', refunded: '#A3261B' };
  var label = function (list, k) { var f = list.filter(function (x) { return x[0] === k; })[0]; return f ? f[1] : k; };
  var badge = function (k, list) { return '<span class="badge s-' + esc(k) + '">' + esc(label(list || ORDER_STATUS, k)) + '</span>'; };

  var state = { view: 'overview', orders: [], messages: [], subscribers: [], q: '', filter: 'all' };

  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('show'); }, 2200); }
  function csv(rows, cols, name) {
    var q = function (v) { v = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var out = [cols.map(function (c) { return c[1]; }).join(',')].concat(rows.map(function (r) { return cols.map(function (c) { return q(typeof c[0] === 'function' ? c[0](r) : r[c[0]]); }).join(','); })).join('\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([out], { type: 'text/csv' })); a.download = name + '-' + new Date().toISOString().slice(0, 10) + '.csv'; a.click();
  }

  // ---------- auth ----------
  function showLogin() { $('#login').classList.remove('hidden'); $('#app').classList.add('hidden'); $('#lg-email').focus(); }
  function showApp(user) {
    $('#login').classList.add('hidden'); $('#app').classList.remove('hidden');
    $('#who').textContent = user.demo ? 'Demo mode' : 'Signed in as ' + user.email;
    $('#mode').textContent = DB.live ? 'Live' : 'Demo'; $('#mode').className = 'mode ' + (DB.live ? 'live' : 'demo');
    $('#demo-bar').classList.toggle('hidden', DB.live);
    $('#logout').classList.toggle('hidden', !DB.live);
    var hash = location.hash.slice(1); if (['overview', 'orders', 'messages', 'subscribers', 'products', 'setup'].indexOf(hash) !== -1) state.view = hash;
    load();
  }
  $('#login-form').addEventListener('submit', function (e) {
    e.preventDefault(); var err = $('#lg-err'), btn = this.querySelector('button'); err.classList.add('hidden'); btn.disabled = true; btn.textContent = 'Signing in…';
    DB.admin.signIn($('#lg-email').value.trim(), $('#lg-pass').value).then(function (u) { showApp(u); }, function (x) {
      err.textContent = /invalid/i.test(x.message || '') ? 'Wrong email or password.' : (x.message || 'Could not sign in.'); err.classList.remove('hidden');
    }).then(function () { btn.disabled = false; btn.textContent = 'Sign in'; });
  });
  $('#logout').addEventListener('click', function () { DB.admin.signOut().then(showLogin); });

  // ---------- data ----------
  function load() {
    $('#view').innerHTML = '<div class="empty">Loading…</div>';
    Promise.all([DB.admin.list('orders'), DB.admin.list('messages'), DB.admin.list('subscribers')]).then(function (r) {
      state.orders = r[0]; state.messages = r[1]; state.subscribers = r[2];
      var newO = state.orders.filter(function (o) { return o.status === 'new'; }).length, newM = state.messages.filter(function (m) { return m.status === 'new'; }).length;
      $('#nb-orders').textContent = newO || ''; $('#nb-messages').textContent = newM || '';
      render();
    }, function (e) {
      if (DB.live && /JWT|permission|row-level|401|403/i.test(e.message || '')) { $('#view').innerHTML = '<div class="card empty"><b>No access</b>This account isn\'t on the admin list. Add its email to the <code>admins</code> table in Supabase.</div>'; return; }
      $('#view').innerHTML = '<div class="card empty"><b>Couldn\'t load data</b>' + esc(e.message || e) + '</div>';
    });
  }

  // ---------- navigation ----------
  function go(v) { state.view = v; state.q = ''; state.filter = 'all'; history.replaceState(null, '', '#' + v); render(); $('#side').classList.remove('open'); window.scrollTo(0, 0); }
  $$('.side-nav button').forEach(function (b) { b.addEventListener('click', function () { go(b.getAttribute('data-view')); }); });
  document.addEventListener('click', function (e) { var g = e.target.closest('[data-goto]'); if (g) go(g.getAttribute('data-goto')); });
  $('#menu-btn').addEventListener('click', function () { $('#side').classList.toggle('open'); });
  $('#refresh').addEventListener('click', function () { load(); toast('Refreshed'); });

  var TITLES = { overview: 'Overview', orders: 'Orders', messages: 'Messages', subscribers: 'Subscribers', products: 'Products', setup: 'Setup & database' };
  function render() {
    $$('.side-nav button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-view') === state.view); });
    $('#view-title').textContent = TITLES[state.view];
    ({ overview: vOverview, orders: vOrders, messages: vMessages, subscribers: vSubscribers, products: vProducts, setup: vSetup })[state.view]();
  }

  // ---------- overview ----------
  function vOverview() {
    var O = state.orders, active = O.filter(function (o) { return ['cancelled', 'refunded'].indexOf(o.status) === -1; });
    var paid = O.filter(function (o) { return PAID.indexOf(o.status) !== -1; });
    var sum = function (a) { return a.reduce(function (s, o) { return s + Number(o.total || 0); }, 0); };
    var since = Date.now() - 30 * 864e5, last30 = active.filter(function (o) { return new Date(o.created_at) >= since; });
    var todo = O.filter(function (o) { return o.status === 'new' || o.status === 'awaiting_payment'; }).length;
    var toShip = O.filter(function (o) { return o.status === 'paid' || o.status === 'in_production'; }).length;
    // daily series
    var days = [], map = {}; for (var i = 29; i >= 0; i--) { var d = new Date(Date.now() - i * 864e5); var k = d.toISOString().slice(0, 10); days.push(k); map[k] = 0; }
    last30.forEach(function (o) { var k = new Date(o.created_at).toISOString().slice(0, 10); if (k in map) map[k] += Number(o.total || 0); });
    var max = Math.max.apply(null, days.map(function (k) { return map[k]; }).concat([1]));
    var W = 600, H = 200, bw = W / 30;
    var bars = days.map(function (k, i) { var h = map[k] / max * (H - 10); return '<rect class="bar' + (map[k] ? ' hi' : '') + '" x="' + (i * bw + 2) + '" y="' + (H - h) + '" width="' + (bw - 4) + '" height="' + Math.max(h, 2) + '" rx="2"><title>' + k + ': ' + money(map[k]) + '</title></rect>'; }).join('');
    var ticks = '<div class="chart-x">' + [0, 10, 20, 29].map(function (i) { return '<span>' + new Date(days[i] + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + '</span>'; }).join('') + '</div>';
    // statuses
    var counts = {}; O.forEach(function (o) { counts[o.status] = (counts[o.status] || 0) + 1; });
    var statusRows = ORDER_STATUS.filter(function (s) { return counts[s[0]]; }).map(function (s) { return '<div class="sl-row"><span style="width:120px">' + s[1] + '</span><span class="track"><i style="width:' + (counts[s[0]] / O.length * 100) + '%;background:' + STATUS_COLOR[s[0]] + '"></i></span><b>' + counts[s[0]] + '</b></div>'; }).join('') || '<div class="empty">No orders yet</div>';
    // top products
    var tp = {}; active.forEach(function (o) { (o.items || []).forEach(function (it) { var k = it.name; tp[k] = tp[k] || { name: k, qty: 0, rev: 0, photo: it.photo }; tp[k].qty += it.qty; tp[k].rev += it.qty * it.price; }); });
    var top = Object.keys(tp).map(function (k) { return tp[k]; }).sort(function (a, b) { return b.rev - a.rev; }).slice(0, 5);
    var topHtml = top.length ? top.map(function (p) { return '<div class="line-item">' + (p.photo ? '<img src="' + esc(p.photo) + '" alt="">' : '') + '<div><b>' + esc(p.name) + '</b><small>' + p.qty + ' sold</small></div><b>' + money(p.rev) + '</b></div>'; }).join('') : '<div class="empty">No sales yet</div>';
    var recent = O.slice(0, 6);
    $('#view').innerHTML =
      '<div class="grid-kpi">' +
        kpi('Paid sales', money(sum(paid)), paid.length + ' paid orders', true) +
        kpi('Orders (30 days)', last30.length, money(sum(last30)) + ' order value') +
        kpi('Avg. order value', active.length ? money(sum(active) / active.length) : '—', 'Excl. cancelled & refunded') +
        kpi('Needs action', todo, 'New or awaiting payment') +
        kpi('To make & ship', toShip, 'Paid or in production') +
        kpi('Unread messages', state.messages.filter(function (m) { return m.status === 'new'; }).length, state.subscribers.length + ' newsletter subscribers') +
      '</div>' +
      '<div class="row2"><div class="card"><h2>Order value · last 30 days <small>' + money(sum(last30)) + '</small></h2><svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="Daily order value for the last 30 days">' + bars + '</svg>' + ticks + '</div>' +
      '<div class="card"><h2>Orders by status</h2><div class="status-list">' + statusRows + '</div></div></div>' +
      '<div class="row2"><div class="card"><h2>Recent orders <button type="button" class="btn sm" data-goto="orders">View all</button></h2>' + (recent.length ? orderTable(recent, true) : emptyOrders()) + '</div>' +
      '<div class="card"><h2>Top products</h2>' + topHtml + '</div></div>';
    bindOrderRows();
  }
  function kpi(t, v, s, accent) { return '<div class="kpi' + (accent ? ' accent' : '') + '"><span>' + t + '</span><b>' + v + '</b><small>' + s + '</small></div>'; }
  function emptyOrders() { return '<div class="empty"><b>No orders yet</b>' + (DB.live ? 'Orders placed at checkout will appear here.' : 'Place a test order on the website, or load sample data from the bar above.') + '</div>'; }

  // ---------- orders ----------
  function orderTable(list, compact) {
    return '<div class="table-wrap"><table class="t' + (compact ? ' compact' : '') + '"><thead><tr><th>Order</th><th>Date</th><th>Customer</th><th class="c-items">Items</th><th class="num">Total</th><th>Status</th></tr></thead><tbody>' +
      list.map(function (o) {
        var n = (o.items || []).reduce(function (s, i) { return s + i.qty; }, 0);
        return '<tr data-order="' + esc(o.id) + '" class="' + (o.status === 'new' ? 'unread' : '') + '"><td class="strong">' + esc(o.order_no) + '</td><td class="nowrap">' + fmtDate(o.created_at) + '<span class="sub">' + ago(o.created_at) + '</span></td>' +
          '<td>' + esc(o.first_name + ' ' + o.last_name) + '<span class="sub">' + esc(o.email) + '</span></td>' +
          '<td class="c-items"><div class="thumbs">' + (o.items || []).slice(0, 3).map(function (i) { return i.photo ? '<img src="' + esc(i.photo) + '" alt="">' : ''; }).join('') + '</div><span class="sub">' + n + ' item' + (n === 1 ? '' : 's') + '</span></td>' +
          '<td class="num strong">' + money(o.total) + (o.shipping == null ? '<span class="sub">+ shipping</span>' : '') + '</td><td>' + badge(o.status) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function bindOrderRows() { $$('[data-order]').forEach(function (r) { r.addEventListener('click', function () { openOrder(r.getAttribute('data-order')); }); }); }
  function vOrders() {
    var q = state.q.toLowerCase(), f = state.filter;
    var counts = { all: state.orders.length }; state.orders.forEach(function (o) { counts[o.status] = (counts[o.status] || 0) + 1; });
    var list = state.orders.filter(function (o) {
      return (f === 'all' || o.status === f) && (!q || [o.order_no, o.email, o.first_name, o.last_name, o.city, o.country, o.company].join(' ').toLowerCase().indexOf(q) !== -1);
    });
    $('#view').innerHTML = '<div class="toolbar"><input class="search" id="q" placeholder="Search order #, name, email, city…" value="' + esc(state.q) + '"><span class="spacer"></span><button type="button" class="btn" id="exp">Export CSV</button></div>' +
      '<div class="toolbar chips">' + [['all', 'All']].concat(ORDER_STATUS).filter(function (s) { return s[0] === 'all' || counts[s[0]]; }).map(function (s) { return '<button type="button" class="chip' + (f === s[0] ? ' on' : '') + '" data-f="' + s[0] + '">' + s[1] + '<em>' + (counts[s[0]] || 0) + '</em></button>'; }).join('') + '</div>' +
      (list.length ? orderTable(list) : (state.orders.length ? '<div class="card empty"><b>No matching orders</b>Try a different search or filter.</div>' : '<div class="card">' + emptyOrders() + '</div>'));
    bindOrderRows(); bindSearch(vOrders);
    $('#exp').addEventListener('click', function () {
      csv(list, [['order_no', 'Order'], [function (o) { return new Date(o.created_at).toISOString(); }, 'Date'], ['status', 'Status'], ['first_name', 'First name'], ['last_name', 'Last name'], ['email', 'Email'], ['phone', 'Phone'], ['company', 'Company'],
        ['address1', 'Address 1'], ['address2', 'Address 2'], ['city', 'City'], ['state', 'State'], ['zip', 'ZIP'], ['country', 'Country'],
        [function (o) { return (o.items || []).map(function (i) { return i.qty + ' x ' + i.name + ' (' + i.color + ')' + (i.engraving ? ' [' + i.engraving + ']' : ''); }).join('; '); }, 'Items'],
        ['subtotal', 'Subtotal'], ['shipping', 'Shipping'], ['total', 'Total'], ['tracking', 'Tracking'], ['notes', 'Customer notes'], ['admin_notes', 'Admin notes']], 'orders');
    });
  }
  function bindSearch(fn) {
    var q = $('#q'); if (q) { q.addEventListener('input', function () { state.q = q.value; var pos = q.selectionStart; fn(); var n = $('#q'); n.focus(); n.setSelectionRange(pos, pos); }); }
    $$('[data-f]').forEach(function (b) { b.addEventListener('click', function () { state.filter = b.getAttribute('data-f'); fn(); }); });
  }

  // ---------- drawer ----------
  function openDrawer(title, html) {
    $('#dr-title').textContent = title; $('#dr-body').innerHTML = html;
    $('#drawer').classList.add('open'); $('#drawer').setAttribute('aria-hidden', 'false'); $('#drawer-bg').classList.remove('hidden'); $('#dr-close').focus();
  }
  function closeDrawer() { $('#drawer').classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); $('#drawer-bg').classList.add('hidden'); }
  $('#dr-close').addEventListener('click', closeDrawer); $('#drawer-bg').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

  function mailto(to, subject, body) { return 'mailto:' + encodeURIComponent(to) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); }
  function openOrder(id) {
    var o = state.orders.filter(function (x) { return x.id === id; })[0]; if (!o) return;
    var addr = [o.first_name + ' ' + o.last_name, o.company, o.address1, o.address2, [o.city, o.state, o.zip].filter(Boolean).join(', '), o.country].filter(Boolean);
    var itemsTxt = (o.items || []).map(function (i) { return '- ' + i.qty + ' x ' + i.name + ' (' + i.color + ')' + (i.engraving ? ', engraving "' + i.engraving + '"' : '') + ' — ' + money(i.qty * i.price); }).join('\n');
    var payMail = mailto(o.email, 'Your order ' + o.order_no + ' — payment link', 'Hi ' + o.first_name + ',\n\nThank you for your order ' + o.order_no + '.\n\n' + itemsTxt + '\n\nSubtotal: ' + money(o.subtotal) + '\nShipping: ' + (o.shipping == null ? '[ADD SHIPPING]' : o.shipping == 0 ? 'Free' : money(o.shipping)) + '\nTotal: ' + (o.shipping == null ? '[ADD TOTAL]' : money(o.total)) + '\n\n' + ((o.items || []).some(function (i) { return i.engraving; }) ? 'Your engraving proof is attached — please reply to approve it.\n\n' : '') + 'Pay securely here: [PAYMENT LINK]\n\nWe start making your apron as soon as payment is complete.\n\nCustom Leather Apron');
    var shipMail = mailto(o.email, 'Your order ' + o.order_no + ' has shipped', 'Hi ' + o.first_name + ',\n\nGood news — your order ' + o.order_no + ' is on its way.\n\n' + (o.carrier ? 'Carrier: ' + o.carrier + '\n' : '') + 'Tracking number: ' + (o.tracking || '[TRACKING]') + '\n\nThank you for choosing Custom Leather Apron.');
    openDrawer('Order ' + o.order_no,
      '<div class="dr-sec"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' + badge(o.status) + '<span class="muted">' + fmtDate(o.created_at, true) + '</span></div></div>' +
      '<div class="dr-sec"><h3>Items</h3>' + (o.items || []).map(function (i) { return '<div class="line-item">' + (i.photo ? '<img src="' + esc(i.photo) + '" alt="">' : '') + '<div><b>' + esc(i.name) + '</b><small>' + esc(i.color) + ' · Qty ' + i.qty + ' × ' + money(i.price) + '</small>' + (i.engraving ? '<span class="eng">Engraving: “' + esc(i.engraving) + '”</span>' : '') + '</div><b>' + money(i.qty * i.price) + '</b></div>'; }).join('') +
        '<div class="totals"><div><span>Subtotal</span><span>' + money(o.subtotal) + '</span></div><div><span>Shipping</span><span>' + (o.shipping == null ? 'To be quoted' : o.shipping == 0 ? 'Free' : money(o.shipping)) + '</span></div><div class="grand"><span>Total</span><span>' + money(o.total) + (o.shipping == null ? ' + shipping' : '') + '</span></div></div></div>' +
      '<div class="dr-sec"><h3>Customer</h3><dl class="kv"><dt>Name</dt><dd>' + esc(o.first_name + ' ' + o.last_name) + '</dd><dt>Email</dt><dd><a href="mailto:' + esc(o.email) + '">' + esc(o.email) + '</a></dd>' + (o.phone ? '<dt>Phone</dt><dd><a href="tel:' + esc(o.phone) + '">' + esc(o.phone) + '</a></dd>' : '') + '<dt>Ship to</dt><dd>' + addr.map(esc).join('<br>') + '</dd>' + (o.notes ? '<dt>Notes</dt><dd>' + esc(o.notes) + '</dd>' : '') + '<dt>Newsletter</dt><dd>' + (o.newsletter ? 'Yes' : 'No') + '</dd></dl></div>' +
      '<div class="dr-sec"><h3>Fulfilment</h3><div class="f2"><label class="field">Status<select id="o-status">' + ORDER_STATUS.map(function (s) { return '<option value="' + s[0] + '"' + (s[0] === o.status ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('') + '</select></label>' +
        '<label class="field">Carrier<input id="o-carrier" value="' + esc(o.carrier || '') + '" placeholder="e.g. USPS, DHL"></label></div>' +
        '<label class="field">Tracking number<input id="o-tracking" value="' + esc(o.tracking || '') + '"></label>' +
        '<label class="field">Internal notes<textarea id="o-notes" rows="3" placeholder="Only visible to admins">' + esc(o.admin_notes || '') + '</textarea></label>' +
        '<div class="actions"><button type="button" class="btn primary" id="o-save">Save changes</button></div></div>' +
      '<div class="dr-sec"><h3>Actions</h3><div class="actions"><a class="btn" href="' + payMail + '">Email payment link</a><a class="btn" href="' + shipMail + '">Email shipping update</a><button type="button" class="btn" id="o-copy">Copy address</button><button type="button" class="btn" id="o-print">Print packing slip</button><button type="button" class="btn danger" id="o-del">Delete</button></div></div>');
    $('#o-save').addEventListener('click', function () {
      var b = this; b.disabled = true;
      DB.admin.update('orders', o.id, { status: $('#o-status').value, carrier: $('#o-carrier').value.trim() || null, tracking: $('#o-tracking').value.trim() || null, admin_notes: $('#o-notes').value.trim() || null })
        .then(function () { toast('Order saved'); closeDrawer(); load(); }, function (e) { toast('Save failed: ' + (e.message || e)); b.disabled = false; });
    });
    $('#o-copy').addEventListener('click', function () { navigator.clipboard.writeText(addr.join('\n')).then(function () { toast('Address copied'); }); });
    $('#o-print').addEventListener('click', function () { printSlip(o, addr); });
    $('#o-del').addEventListener('click', function () {
      var b = this; if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Click again to delete permanently'; return; }
      DB.admin.remove('orders', o.id).then(function () { toast('Order deleted'); closeDrawer(); load(); });
    });
  }
  function printSlip(o, addr) {
    var old = $('#slip'); if (old) old.remove();
    var d = document.createElement('div'); d.id = 'slip'; d.style.cssText = 'padding:32px;font-family:Inter,sans-serif;color:#000';
    d.innerHTML = '<img src="assets/img/logo-dark.png" style="height:60px"><h1 style="font-family:Georgia,serif">Packing slip — ' + esc(o.order_no) + '</h1><p>Date: ' + fmtDate(o.created_at) + '</p>' +
      '<h3>Ship to</h3><p>' + addr.map(esc).join('<br>') + '</p><table style="width:100%;border-collapse:collapse;margin-top:16px"><tr><th style="text-align:left;border-bottom:2px solid #000;padding:6px">Item</th><th style="text-align:left;border-bottom:2px solid #000;padding:6px">Colour</th><th style="text-align:left;border-bottom:2px solid #000;padding:6px">Engraving</th><th style="border-bottom:2px solid #000;padding:6px">Qty</th></tr>' +
      (o.items || []).map(function (i) { return '<tr><td style="padding:6px;border-bottom:1px solid #ccc">' + esc(i.name) + '</td><td style="padding:6px;border-bottom:1px solid #ccc">' + esc(i.color) + '</td><td style="padding:6px;border-bottom:1px solid #ccc">' + esc(i.engraving || '—') + '</td><td style="padding:6px;border-bottom:1px solid #ccc;text-align:center">' + i.qty + '</td></tr>'; }).join('') + '</table>' +
      (o.notes ? '<p><b>Customer notes:</b> ' + esc(o.notes) + '</p>' : '') + '<p style="margin-top:32px">Thank you for your order! Questions: sales@customleatherapron.com</p>';
    document.body.appendChild(d); window.print(); setTimeout(function () { d.remove(); }, 500);
  }

  // ---------- messages ----------
  function vMessages() {
    var q = state.q.toLowerCase(), f = state.filter;
    var counts = { all: state.messages.length }; state.messages.forEach(function (m) { counts[m.status] = (counts[m.status] || 0) + 1; });
    var list = state.messages.filter(function (m) { return (f === 'all' || m.status === f) && (!q || [m.name, m.email, m.topic, m.message, m.business].join(' ').toLowerCase().indexOf(q) !== -1); });
    $('#view').innerHTML = '<div class="toolbar"><input class="search" id="q" placeholder="Search name, email, message…" value="' + esc(state.q) + '"></div>' +
      '<div class="toolbar chips">' + [['all', 'All']].concat(MSG_STATUS).map(function (s) { return '<button type="button" class="chip' + (f === s[0] ? ' on' : '') + '" data-f="' + s[0] + '">' + s[1] + '<em>' + (counts[s[0]] || 0) + '</em></button>'; }).join('') + '</div>' +
      (list.length ? '<div class="table-wrap"><table class="t"><thead><tr><th>From</th><th>Topic</th><th>Message</th><th>Received</th><th>Status</th></tr></thead><tbody>' + list.map(function (m) {
        return '<tr data-msg="' + esc(m.id) + '" class="' + (m.status === 'new' ? 'unread' : '') + '"><td class="strong">' + esc(m.name) + '<span class="sub">' + esc(m.email) + '</span></td><td>' + esc(m.topic || '—') + (m.business ? '<span class="sub">' + esc(m.business) + (m.quantity ? ' · ' + esc(m.quantity) : '') + '</span>' : '') + '</td><td style="max-width:360px">' + esc((m.message || '').slice(0, 110)) + ((m.message || '').length > 110 ? '…' : '') + '</td><td>' + ago(m.created_at) + '</td><td>' + badge(m.status, MSG_STATUS) + '</td></tr>';
      }).join('') + '</tbody></table></div>' : '<div class="card empty"><b>No messages</b>Messages from the contact form will appear here.</div>');
    bindSearch(vMessages);
    $$('[data-msg]').forEach(function (r) { r.addEventListener('click', function () { openMsg(r.getAttribute('data-msg')); }); });
  }
  function openMsg(id) {
    var m = state.messages.filter(function (x) { return x.id === id; })[0]; if (!m) return;
    var reply = mailto(m.email, 'Re: ' + (m.topic || 'Your message'), 'Hi ' + m.name.split(' ')[0] + ',\n\nThanks for getting in touch.\n\n\n\n— Custom Leather Apron\n\n> ' + (m.message || '').split('\n').join('\n> '));
    openDrawer(m.name,
      '<div class="dr-sec"><div style="display:flex;align-items:center;gap:10px">' + badge(m.status, MSG_STATUS) + '<span class="muted">' + fmtDate(m.created_at, true) + '</span></div></div>' +
      '<div class="dr-sec"><dl class="kv"><dt>Email</dt><dd><a href="mailto:' + esc(m.email) + '">' + esc(m.email) + '</a></dd>' + (m.phone ? '<dt>Phone</dt><dd>' + esc(m.phone) + '</dd>' : '') + '<dt>Topic</dt><dd>' + esc(m.topic || '—') + '</dd>' +
        (m.business ? '<dt>Business</dt><dd>' + esc(m.business) + '</dd>' : '') + (m.quantity ? '<dt>Quantity</dt><dd>' + esc(m.quantity) + '</dd>' : '') + (m.order_no ? '<dt>Order #</dt><dd>' + esc(m.order_no) + '</dd>' : '') + (m.attachment_name ? '<dt>Logo file</dt><dd>' + esc(m.attachment_name) + ' <span class="muted">(customer will email it)</span></dd>' : '') + '</dl></div>' +
      '<div class="dr-sec"><h3>Message</h3><div class="msg-body">' + esc(m.message) + '</div></div>' +
      '<div class="dr-sec"><label class="field">Status<select id="m-status">' + MSG_STATUS.map(function (s) { return '<option value="' + s[0] + '"' + (s[0] === m.status ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('') + '</select></label><label class="field">Internal notes<textarea id="m-notes" rows="3">' + esc(m.admin_notes || '') + '</textarea></label>' +
        '<div class="actions"><a class="btn primary" href="' + reply + '" id="m-reply">Reply by email</a><button type="button" class="btn" id="m-save">Save</button><button type="button" class="btn danger" id="m-del">Delete</button></div></div>');
    $('#m-reply').addEventListener('click', function () { if (m.status === 'new') DB.admin.update('messages', m.id, { status: 'replied' }).then(load); });
    $('#m-save').addEventListener('click', function () { DB.admin.update('messages', m.id, { status: $('#m-status').value, admin_notes: $('#m-notes').value.trim() || null }).then(function () { toast('Saved'); closeDrawer(); load(); }); });
    $('#m-del').addEventListener('click', function () { var b = this; if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Click again to delete'; return; } DB.admin.remove('messages', m.id).then(function () { toast('Deleted'); closeDrawer(); load(); }); });
  }

  // ---------- subscribers ----------
  function vSubscribers() {
    var q = state.q.toLowerCase(), list = state.subscribers.filter(function (s) { return !q || s.email.toLowerCase().indexOf(q) !== -1; });
    $('#view').innerHTML = '<div class="toolbar"><input class="search" id="q" placeholder="Search email…" value="' + esc(state.q) + '"><span class="spacer"></span><button type="button" class="btn" id="exp">Export CSV</button></div>' +
      (list.length ? '<div class="table-wrap"><table class="t"><thead><tr><th>Email</th><th>Source</th><th>Subscribed</th><th></th></tr></thead><tbody>' + list.map(function (s) {
        return '<tr style="cursor:default"><td class="strong">' + esc(s.email) + '</td><td>' + esc(s.source || '—') + '</td><td>' + fmtDate(s.created_at) + '</td><td class="num"><button type="button" class="btn sm danger" data-unsub="' + esc(s.id) + '">Remove</button></td></tr>';
      }).join('') + '</tbody></table></div>' : '<div class="card empty"><b>No subscribers yet</b>Newsletter signups from the footer and checkout appear here.</div>');
    bindSearch(vSubscribers);
    $('#exp').addEventListener('click', function () { csv(list, [['email', 'Email'], ['source', 'Source'], [function (s) { return new Date(s.created_at).toISOString(); }, 'Subscribed']], 'subscribers'); });
    $$('[data-unsub]').forEach(function (b) { b.addEventListener('click', function () { if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Confirm'; return; } DB.admin.remove('subscribers', b.getAttribute('data-unsub')).then(function () { toast('Removed'); load(); }); }); });
  }

  // ---------- products ----------
  function vProducts() {
    var P = CLA.products || [], C = CLA.colors || {};
    var sold = {}; state.orders.filter(function (o) { return ['cancelled', 'refunded'].indexOf(o.status) === -1; }).forEach(function (o) { (o.items || []).forEach(function (i) { sold[i.id] = (sold[i.id] || 0) + i.qty; }); });
    $('#view').innerHTML = '<div class="card" style="margin-bottom:16px;background:#FBF7F2"><b>Products are set in the website code.</b> <span class="muted">To change a price, name, photo or colour, ask Claude — the change goes live on the site in a couple of minutes.</span></div>' +
      '<div class="table-wrap"><table class="t"><thead><tr><th></th><th>Product</th><th>Category</th><th>Colours</th><th class="num">Price</th><th class="num">Units ordered</th><th></th></tr></thead><tbody>' +
      P.map(function (p) {
        var img = p.photo || (p.photos && p.photos[p.color]) || '';
        return '<tr style="cursor:default"><td>' + (img ? '<img class="prod-img" src="' + esc(img) + '" alt="">' : '') + '</td><td class="strong">' + esc(p.name) + '<span class="sub">ID: ' + esc(p.id) + '</span></td><td>' + esc(p.cat) + '</td><td class="dots">' + (p.colors || [p.color]).map(function (k) { return C[k] ? '<i title="' + esc(C[k].name) + '" style="background:' + C[k].hex + '"></i>' : ''; }).join('') + '</td><td class="num strong">' + (p.price == null ? '<span class="badge s-awaiting_payment">No price</span>' : money(p.price)) + '</td><td class="num">' + (sold[p.id] || 0) + '</td><td class="num"><a class="btn sm" href="product.html?id=' + esc(p.id) + '" target="_blank" rel="noopener">View ↗</a></td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  // ---------- setup ----------
  function vSetup() {
    $('#view').innerHTML = '<div class="card setup" style="max-width:860px"><h2>' + (DB.live ? '✅ Database connected' : 'Connect your database (free, ~10 minutes)') + '</h2>' +
      (DB.live ? '<p>Orders, messages and newsletter signups from the website are saved to your Supabase database and appear here. Only emails listed in the <code>admins</code> table can sign in.</p>' :
      '<p class="muted">Right now this dashboard is in <b>demo mode</b>: it only shows activity from this browser. Connect a free Supabase database so every order from every customer is saved here.</p>') +
      '<ol>' +
        '<li>Create a free account at <a href="https://supabase.com" target="_blank" rel="noopener">supabase.com</a> and click <b>New project</b>.</li>' +
        '<li>Open <b>SQL Editor → New query</b>, paste everything from <a href="supabase/schema.sql" target="_blank">supabase/schema.sql</a>, and click <b>Run</b>.</li>' +
        '<li>In the same editor, run this with <b>your</b> admin email:<pre>insert into public.admins (email) values (\'you@example.com\');</pre></li>' +
        '<li>Go to <b>Authentication → Users → Add user</b>, create that same email with a strong password, and tick <b>Auto confirm</b>.</li>' +
        '<li>Go to <b>Authentication → Sign In / Providers</b> and turn <b>off</b> "Allow new users to sign up".</li>' +
        '<li>Go to <b>Project Settings → API</b> and copy the <b>Project URL</b> and the <b>anon public</b> key. Send both to Claude (never the <code>service_role</code> key) — they go into <code>assets/config.js</code>.</li>' +
      '</ol></div>';
  }

  // ---------- demo helpers ----------
  $('#seed').addEventListener('click', function () {
    var P = (CLA.products || []).filter(function (p) { return p.price != null; }), names = [['Maya', 'Lopez', 'Austin'], ['James', 'Carter', 'Denver'], ['Aisha', 'Khan', 'Toronto'], ['Liam', 'O\'Brien', 'Dublin'], ['Sofia', 'Rossi', 'Chicago'], ['Noah', 'Kim', 'Seattle'], ['Emma', 'Brown', 'Leeds'], ['Omar', 'Farouk', 'Dubai']];
    var st = ['new', 'new', 'awaiting_payment', 'paid', 'in_production', 'shipped', 'delivered', 'cancelled'];
    var orders = names.map(function (n, i) {
      var p = P[i % P.length], qty = 1 + (i % 3 === 0 ? 1 : 0), eng = i % 2 ? '' : n[0].toUpperCase();
      var price = p.price + (eng ? 15 : 0), sub = price * qty, ship = sub >= 99 ? 0 : 10;
      var d = new Date(Date.now() - i * 3.3 * 864e5);
      return { id: 'seed' + i, created_at: d.toISOString(), order_no: 'DEMO-' + (1001 + i), status: st[i], email: n[0].toLowerCase() + '@example.com', phone: null, first_name: n[0], last_name: n[1], company: i === 2 ? 'Sample Café' : null,
        address1: (100 + i * 7) + ' Sample Street', address2: null, city: n[2], state: null, zip: '00000', country: i > 5 ? 'Other' : 'United States',
        items: [{ id: p.id, name: p.name, color: (p.colors ? (CLA.colors[p.colors[0]] || {}).name : p.color) || '', engraving: eng, qty: qty, price: price, photo: p.photo || (p.photos && p.photos[p.color]) || '' }],
        subtotal: sub, shipping: ship, total: sub + ship, notes: null, newsletter: i % 3 === 0, tracking: st[i] === 'shipped' || st[i] === 'delivered' ? 'SAMPLE123' : null };
    });
    var messages = [{ id: 'm1', created_at: new Date(Date.now() - 36e5).toISOString(), status: 'new', name: 'Sample Customer', email: 'sample@example.com', topic: 'Team / bulk order', business: 'Sample Bistro', quantity: '11 – 25', message: 'This is sample data. Real messages from your contact form will appear here.' }];
    var subscribers = [{ id: 's1', created_at: new Date().toISOString(), email: 'sample@example.com', source: 'footer' }];
    DB.admin.demoSeed({ orders: orders, messages: messages, subscribers: subscribers }); load(); toast('Sample data loaded');
  });
  $('#clear-demo').addEventListener('click', function () { DB.admin.demoReset(); load(); toast('Demo data cleared'); });

  // ---------- start ----------
  if (!DB) { document.body.innerHTML = '<p style="padding:40px">Dashboard failed to load.</p>'; return; }
  DB.admin.session().then(function (u) { if (u) showApp(u); else showLogin(); }, showLogin);
});
