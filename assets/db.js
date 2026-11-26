/* Custom Leather Apron — data layer shared by the website and the admin dashboard.
   Live mode: Supabase (when assets/config.js has a URL + anon key).
   Demo mode: this browser's localStorage, so the dashboard can be tried before setup. */
(function () {
  'use strict';
  var CFG = window.CLA_CONFIG || {};
  var LIVE = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY);
  var DEMO_KEY = 'cla_demo_db_v1';
  var clientPromise = null;

  function client() {
    if (!LIVE) return Promise.reject(new Error('Backend not configured'));
    if (!clientPromise) {
      clientPromise = import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm').then(function (m) {
        return m.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY, { auth: { persistSession: true, storageKey: 'cla_admin_auth' } });
      });
    }
    return clientPromise;
  }

  // ---------- demo store ----------
  function demoRead() { try { return JSON.parse(localStorage.getItem(DEMO_KEY)) || { orders: [], messages: [], subscribers: [] }; } catch (e) { return { orders: [], messages: [], subscribers: [] }; } }
  function demoWrite(db) { try { localStorage.setItem(DEMO_KEY, JSON.stringify(db)); } catch (e) { /* storage unavailable */ } }
  function uid() { return 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function now() { return new Date().toISOString(); }

  function demoInsert(table, row) {
    var db = demoRead();
    if (table === 'subscribers' && db.subscribers.some(function (s) { return s.email.toLowerCase() === row.email.toLowerCase(); })) return { ok: true, mode: 'demo', duplicate: true };
    row = Object.assign({ id: uid(), created_at: now() }, table === 'subscribers' ? {} : { status: 'new' }, row);
    db[table].unshift(row); demoWrite(db);
    return { ok: true, mode: 'demo' };
  }

  function liveInsert(table, row) {
    return client().then(function (sb) { return sb.from(table).insert(row); }).then(function (r) {
      if (r.error) {
        if (table === 'subscribers' && r.error.code === '23505') return { ok: true, mode: 'live', duplicate: true };
        throw r.error;
      }
      return { ok: true, mode: 'live' };
    });
  }

  function insert(table, row) {
    if (LIVE) return liveInsert(table, row);
    return Promise.resolve(demoInsert(table, row));
  }

  // ---------- admin (read / update) ----------
  var admin = {
    session: function () {
      if (!LIVE) return Promise.resolve({ email: 'demo@local', demo: true });
      return client().then(function (sb) { return sb.auth.getSession(); }).then(function (r) { return r.data.session ? { email: r.data.session.user.email } : null; });
    },
    signIn: function (email, password) {
      return client().then(function (sb) { return sb.auth.signInWithPassword({ email: email, password: password }); })
        .then(function (r) { if (r.error) throw r.error; return { email: r.data.user.email }; });
    },
    signOut: function () { return LIVE ? client().then(function (sb) { return sb.auth.signOut(); }) : Promise.resolve(); },
    list: function (table) {
      if (!LIVE) return Promise.resolve(demoRead()[table] || []);
      return client().then(function (sb) { return sb.from(table).select('*').order('created_at', { ascending: false }).limit(2000); })
        .then(function (r) { if (r.error) throw r.error; return r.data; });
    },
    update: function (table, id, patch) {
      patch = Object.assign({}, patch, { updated_at: now() });
      if (!LIVE) { var db = demoRead(); db[table] = db[table].map(function (x) { return x.id === id ? Object.assign({}, x, patch) : x; }); demoWrite(db); return Promise.resolve(true); }
      return client().then(function (sb) { return sb.from(table).update(patch).eq('id', id); }).then(function (r) { if (r.error) throw r.error; return true; });
    },
    remove: function (table, id) {
      if (!LIVE) { var db = demoRead(); db[table] = db[table].filter(function (x) { return x.id !== id; }); demoWrite(db); return Promise.resolve(true); }
      return client().then(function (sb) { return sb.from(table).delete().eq('id', id); }).then(function (r) { if (r.error) throw r.error; return true; });
    },
    demoReset: function () { demoWrite({ orders: [], messages: [], subscribers: [] }); },
    demoSeed: function (data) { demoWrite(data); }
  };

  window.CLADB = {
    live: LIVE,
    notifyEmail: CFG.NOTIFY_EMAIL || 'sales@customleatherapron.com',
    submitOrder: function (o) { return insert('orders', o); },
    submitMessage: function (m) { return insert('messages', m); },
    subscribe: function (email, source) { return insert('subscribers', { email: email, source: source || 'footer' }); },
    admin: admin
  };
})();
