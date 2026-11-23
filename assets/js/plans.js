---
# Front matter fence: Jekyll fills in the plans (_data/plans.yml), the
# web app's address and the flagship app's store links below.
---
{%- assign _flag = site.data.apps | where: "tier", "flagship" | first -%}
/* Daily Utility Apps: sign-up and pricing (owner, 23 Nov 2026).
   Website -> Pricing -> plan -> Log in /
   Sign up -> payment -> the web app. STATUS.md section 5zzzzzzzzzzz.

   - Prices in the visitor's own currency where Daily Utility sells in it
     (their country, then a time-zone guess first so prices rarely change
     after load), US dollars otherwise; a "Pay in" picker wins over both.
   - Monthly / Yearly, with the yearly saving worked out from the prices.
   - The sign-in popup (Google, Apple, email) on Log in and every plan
     button, and a one-off "Try Pro free for 3 days" offer.
   - Every link to the web app carries what was chosen (WEBAPP-HANDOFF.md).
   Without JavaScript, every link still goes straight to the web app. */
(function () {
  'use strict';

  var DATA = {{ site.data.plans | jsonify }};
  var WEBAPP = {{ site.cloud_url | jsonify }};
  var STORES = { android: {{ _flag.android_url | jsonify }}, ios: {{ _flag.ios_url | jsonify }} };
  var MARK = {{ '/assets/icons/mark-64.png' | relative_url | jsonify }};
  var TERMS = {{ '/terms-of-service' | relative_url | jsonify }};
  var PRIVACY = {{ '/privacy-policy' | relative_url | jsonify }};

  var TRIAL_DAYS = DATA.trial_days;
  var PLANS = {};
  DATA.plans.forEach(function (p) { PLANS[p.id] = p; });
  var CURRENCIES = DATA.currencies.slice().sort();
  var FALLBACK = DATA.fallback_currency;
  /* Time zone -> country, for the first guess before the lookup answers. */
  var TZ_COUNTRY = {
    'Europe/London': 'GB', 'Europe/Belfast': 'GB', 'Europe/Dublin': 'IE', 'Europe/Berlin': 'DE', 'Europe/Busingen': 'DE',
    'Europe/Paris': 'FR', 'Europe/Madrid': 'ES', 'Africa/Ceuta': 'ES', 'Atlantic/Canary': 'ES', 'Europe/Rome': 'IT',
    'Europe/Amsterdam': 'NL', 'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA'
  };

  var doc = document;
  var billing = 'monthly';
  try { if (sessionStorage.getItem('du-billing') === 'yearly') billing = 'yearly'; } catch (e) {}

  /* Google tag events (the site's Ads tag, default.html). Intentions, not
     results: the web app reports sign-ups and purchases. */
  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }

  /* ---------- Currency ---------- */
  function forCountry(cc) {
    var c = cc && DATA.country_currency[String(cc).toUpperCase()];
    return c && CURRENCIES.indexOf(c) !== -1 ? c : FALLBACK;
  }
  function tzCountry() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz.indexOf('Australia/') === 0) return 'AU';
      return TZ_COUNTRY[tz] || null;
    } catch (e) { return null; }
  }
  var manual = null, country = null;
  try {
    var saved = localStorage.getItem('du-currency');
    if (saved && CURRENCIES.indexOf(saved) !== -1) manual = saved;
    country = sessionStorage.getItem('du-country');
  } catch (e) {}
  var currency = manual || forCountry(country || tzCountry());

  function money(minor, cur) {
    var major = minor / 100;
    try {
      return new Intl.NumberFormat('en', { style: 'currency', currency: cur, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(major);
    } catch (e) { return cur + ' ' + major.toFixed(2); }
  }
  function amount(plan, cycle) {
    var p = PLANS[plan] && PLANS[plan].prices[cycle];
    return p && typeof p[currency] === 'number' ? p[currency] : null;
  }
  function priceText(plan, cycle) {
    var a = amount(plan, cycle);
    return a == null ? null : money(a, currency);
  }
  function value(plan, cycle) {
    var a = amount(plan, cycle);
    return a == null ? undefined : a / 100;
  }
  function perText(cycle) { return cycle === 'yearly' ? '/year' : '/month'; }
  function cycleWord(cycle) { return cycle === 'yearly' ? 'yearly' : 'monthly'; }
  function trialEnd() {
    var d = new Date(); d.setDate(d.getDate() + TRIAL_DAYS);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  /* What the visitor agrees to, in plain words: trial length, price, how
     often, that it renews, and how to avoid a charge. */
  function termsText(plan, cycle) {
    var price = priceText(plan, cycle) || currency + ' [price]';
    var every = cycle === 'yearly' ? 'year' : 'month';
    if (PLANS[plan].trial) {
      return 'Free for ' + TRIAL_DAYS + ' days, then ' + price + ' per ' + every +
        '. Your payment details are needed to start the trial. Renews automatically until you cancel; ' +
        'cancel before the trial ends and you won’t be charged.';
    }
    return price + ' per ' + every + ' from today. Renews automatically until you cancel.';
  }
  /* Yearly against twelve months, whole percent rounded down. */
  function saving(plan) {
    var m = amount(plan, 'monthly'), y = amount(plan, 'yearly');
    return m && y ? Math.floor((1 - y / (12 * m)) * 100) : 0;
  }

  /* Changes after the first paint glide in (a short rise and fade). None
     with reduced motion. */
  var painted = false;
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function setText(el, text) {
    if (el.textContent === text) return;
    el.textContent = text;
    if (painted && !still && el.animate) {
      el.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
        { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
  }

  function webappUrl(o) {
    var q = new URLSearchParams();
    q.set('mode', o.mode || 'signup');
    if (o.provider) q.set('provider', o.provider);
    if (o.email) q.set('email', o.email);
    if (o.plan) { q.set('plan', o.plan); q.set('billing', billing); q.set('currency', currency); }
    if (o.plan && o.trial && PLANS[o.plan] && PLANS[o.plan].trial) q.set('trial', String(TRIAL_DAYS));
    q.set('source', 'website');
    return WEBAPP + '?' + q.toString();
  }

  var modal, panel, lastFocus, offer, state = {};

  function render() {
    doc.querySelectorAll('[data-price]').forEach(function (el) {
      setText(el, priceText(el.getAttribute('data-price'), billing) || currency + ' –');
    });
    doc.querySelectorAll('[data-per]').forEach(function (el) { setText(el, perText(billing)); });
    doc.querySelectorAll('[data-terms]').forEach(function (el) { setText(el, termsText(el.getAttribute('data-terms'), billing)); });
    doc.querySelectorAll('[data-billed-in]').forEach(function (el) { setText(el, 'Billed ' + cycleWord(billing) + ' in ' + currency); });
    doc.querySelectorAll('.pcard').forEach(function (card) {
      var meta = card.querySelector('.pcard-meta'), priceEl = card.querySelector('[data-price]');
      if (!meta || !priceEl) return;
      var chip = meta.querySelector('.pcard-save');
      if (!chip) {
        chip = doc.createElement('span'); chip.className = 'pcard-save'; chip.hidden = true;
        meta.insertBefore(chip, meta.children[1] || null);
      }
      var pct = billing === 'yearly' ? saving(priceEl.getAttribute('data-price')) : 0;
      chip.hidden = pct < 1;
      if (pct >= 1) setText(chip, 'Save ' + pct + '%');
    });
    doc.querySelectorAll('[data-auth="plan"]').forEach(function (a) {
      a.setAttribute('href', webappUrl({ mode: 'signup', plan: a.getAttribute('data-plan'), trial: a.hasAttribute('data-trial') }));
    });
    doc.querySelectorAll('[data-billing]').forEach(function (i) { i.checked = i.value === billing; });
    doc.querySelectorAll('[data-currency]').forEach(function (s) { s.value = currency; });
    /* An open popup keeps its focus; only its prices and links change. */
    if (modal && !modal.hidden && state.plan) {
      modal.querySelector('[data-auth-plan]').innerHTML = planSummary(state.plan, state.trial);
      setProviderLinks();
    }
    if (offer && !offer.hidden) {
      offer.querySelector('[data-offer-plan]').innerHTML = planSummary('pro', true);
      offer.querySelector('[data-offer-go]').setAttribute('href', webappUrl({ mode: 'signup', plan: 'pro', trial: true }));
    }
  }

  function setCurrency(c) {
    if (CURRENCIES.indexOf(c) === -1 || c === currency) return;
    currency = c;
    render();
  }

  /* "Pay in": a currency picker, like the web app's. Codes and symbols
     only, never country names (STATUS.md 5f: "Australia" appears on the
     legal pages only). */
  function symbolOf(c) {
    try {
      var p = new Intl.NumberFormat('en', { style: 'currency', currency: c, currencyDisplay: 'symbol' }).formatToParts(0);
      for (var i = 0; i < p.length; i++) if (p[i].type === 'currency') return p[i].value;
    } catch (e) {}
    return '';
  }
  doc.querySelectorAll('[data-currency-pick]').forEach(function (box, n) {
    var id = 'cur-pick-' + n;
    box.innerHTML = '<label for="' + id + '">Pay in</label><select id="' + id + '" data-currency>' +
      CURRENCIES.map(function (c) {
        var s = symbolOf(c);
        return '<option value="' + c + '">' + c + (s && s !== c ? ' (' + s + ')' : '') + '</option>';
      }).join('') + '</select>';
    box.hidden = false;
    box.querySelector('select').addEventListener('change', function (e) {
      manual = e.target.value;
      try { localStorage.setItem('du-currency', manual); } catch (err) {}
      setCurrency(manual);
      track('select_currency', { currency: manual });
    });
  });

  doc.querySelectorAll('[data-billing]').forEach(function (input) {
    input.addEventListener('change', function () {
      if (!input.checked) return;
      billing = input.value;
      try { sessionStorage.setItem('du-billing', billing); } catch (e) {}
      render();
      track('select_billing', { billing: billing });
    });
  });

  render();
  painted = true;

  /* The visitor's country: only on pages that show prices, once per
     visit, never over a currency they picked. */
  if (!manual && !country && doc.querySelector('[data-price]') && window.fetch) {
    fetch('https://get.geojs.io/v1/ip/country.json', { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        var cc = d && d.country;
        if (!cc || !/^[A-Za-z]{2}$/.test(cc)) return;
        try { sessionStorage.setItem('du-country', cc.toUpperCase()); } catch (e) {}
        if (!manual) setCurrency(forCountry(cc));
      })
      .catch(function () {});
  }

  /* ---------- The sign-in popup ---------- */
  var ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var ICON_G = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.5 12.25c0-.8-.07-1.56-.2-2.3H12v4.35h5.9a5.05 5.05 0 0 1-2.2 3.3v2.75h3.55c2.08-1.92 3.25-4.74 3.25-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.75c-.98.66-2.24 1.05-3.73 1.05-2.87 0-5.3-1.94-6.17-4.55H2.17v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.83 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.17a11 11 0 0 0 0 9.86l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15A10.97 10.97 0 0 0 12 1 11 11 0 0 0 2.17 7.07l3.66 2.84C6.7 7.32 9.13 5.38 12 5.38z"/></svg>';
  var ICON_A = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 12.34c-.03-2.5 2.04-3.7 2.13-3.76-1.17-1.71-2.98-1.94-3.62-1.97-1.54-.16-3.02.9-3.8.9-.79 0-1.99-.88-3.28-.86-1.68.03-3.24.98-4.1 2.48-1.76 3.05-.45 7.56 1.25 10.03.83 1.2 1.83 2.56 3.13 2.51 1.26-.05 1.73-.81 3.25-.81s1.94.81 3.28.79c1.36-.02 2.22-1.22 3.04-2.44.96-1.4 1.35-2.76 1.37-2.83-.03-.01-2.62-1.01-2.65-4.04z"/><path d="M14.56 5.02c.69-.83 1.16-1.99 1.03-3.14-1 .04-2.2.66-2.92 1.49-.64.73-1.2 1.92-1.05 3.04 1.12.09 2.25-.56 2.94-1.39z"/></svg>';

  function trap(e, root) {
    var f = Array.prototype.filter.call(root.querySelectorAll('a[href],button:not([disabled]),input'), function (x) { return x.offsetParent !== null; });
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (doc.activeElement === first || doc.activeElement === root)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function build() {
    modal = doc.createElement('div');
    modal.className = 'auth-modal';
    modal.hidden = true;
    modal.innerHTML =
      '<div class="auth-backdrop" data-auth-close></div>' +
      '<div class="auth-panel" role="dialog" aria-modal="true" aria-labelledby="auth-title" aria-describedby="auth-sub" tabindex="-1">' +
        '<button class="auth-x" type="button" data-auth-close aria-label="Close">' + ICON_X + '</button>' +
        '<img class="auth-logo" src="' + MARK + '" alt="" width="40" height="40">' +
        '<h2 class="auth-title" id="auth-title"></h2>' +
        '<p class="auth-sub" id="auth-sub"></p>' +
        '<div class="auth-plan" data-auth-plan hidden></div>' +
        '<div class="auth-btns">' +
          '<a class="auth-btn" data-provider="google" href="#">' + ICON_G + '<span>Continue with Google</span></a>' +
          '<a class="auth-btn" data-provider="apple" href="#">' + ICON_A + '<span>Continue with Apple</span></a>' +
        '</div>' +
        '<div class="auth-or">or</div>' +
        '<form class="auth-form" novalidate>' +
          '<label class="visually-hidden" for="auth-email">Email address</label>' +
          '<input id="auth-email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="Email address" required>' +
          '<button class="btn btn--primary" type="submit">Continue with email</button>' +
        '</form>' +
        '<p class="auth-switch" data-auth-switch></p>' +
        '<p class="auth-legal">By continuing you agree to the <a href="' + TERMS + '">Terms</a> and <a href="' + PRIVACY + '">Privacy Policy</a>.</p>' +
        '<p class="auth-apps">Prefer the app? <a href="' + STORES.android + '" target="_blank" rel="noopener">Google Play</a>' +
          (STORES.ios ? ' · <a href="' + STORES.ios + '" target="_blank" rel="noopener">App Store</a>' : '') + '</p>' +
      '</div>';
    doc.body.appendChild(modal);
    panel = modal.querySelector('.auth-panel');

    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-auth-close]')) { close(); return; }
      var p = e.target.closest('[data-provider]');
      if (p) {
        track(state.mode === 'login' ? 'login_continue' : 'sign_up_continue', { method: p.getAttribute('data-provider'), plan: state.plan || 'free' });
        if (state.plan) track(state.trial ? 'begin_trial' : 'begin_checkout', { plan: state.plan, billing: billing, currency: currency, value: value(state.plan, billing) });
      }
      var sw = e.target.closest('[data-auth-mode]');
      if (sw) { e.preventDefault(); open({ mode: sw.getAttribute('data-auth-mode'), plan: state.plan, trial: state.trial }, true); }
    });
    modal.querySelector('.auth-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var input = modal.querySelector('#auth-email');
      var email = input.value.trim();
      if (!email || !input.checkValidity()) { input.setAttribute('aria-invalid', 'true'); input.focus(); return; }
      input.removeAttribute('aria-invalid');
      track(state.mode === 'login' ? 'login_continue' : 'sign_up_continue', { method: 'email', plan: state.plan || 'free' });
      if (state.plan) track(state.trial ? 'begin_trial' : 'begin_checkout', { plan: state.plan, billing: billing, currency: currency, value: value(state.plan, billing) });
      window.location.href = webappUrl({ mode: state.mode, provider: 'email', email: email, plan: state.plan, trial: state.trial });
    });
    doc.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'Tab') trap(e, panel);
    });
  }

  /* The plan, what is due today and later, and the terms. */
  function planSummary(plan, withTrial) {
    var P = PLANS[plan];
    var price = priceText(plan, billing) || currency + ' –';
    var per = perText(billing), end = trialEnd();
    var rows = withTrial
      ? '<div><dt>Due today</dt><dd>' + money(0, currency) + '</dd></div><div><dt>From ' + end + '</dt><dd>' + price + per + '</dd></div>'
      : '<div><dt>Due today</dt><dd>' + price + '</dd></div><div><dt>Then</dt><dd>' + price + per + '</dd></div>';
    var tail = withTrial
      ? 'Free for ' + TRIAL_DAYS + ' days, then billed ' + cycleWord(billing) + '. Payment details are needed to start. ' +
        'Renews automatically until you cancel. Cancel before ' + end + ' and you won’t be charged.'
      : 'Billed ' + cycleWord(billing) + ' from today. Renews automatically until you cancel.';
    return '<div class="auth-plan-head"><span>' + P.name + ' · ' + P.storage + '</span><span>Billed ' + cycleWord(billing) + '</span></div>' +
      '<dl>' + rows + '</dl><p>' + tail + '</p>';
  }

  function setProviderLinks() {
    modal.querySelectorAll('[data-provider]').forEach(function (a) {
      a.setAttribute('href', webappUrl({ mode: state.mode, provider: a.getAttribute('data-provider'), plan: state.plan, trial: state.trial }));
    });
  }

  function open(o, keepFocus) {
    if (!modal) build();
    state = { mode: o.mode === 'login' ? 'login' : 'signup', plan: PLANS[o.plan] ? o.plan : null, trial: !!o.trial && !!(PLANS[o.plan] && PLANS[o.plan].trial) };
    var title = modal.querySelector('#auth-title'), sub = modal.querySelector('#auth-sub'), box = modal.querySelector('[data-auth-plan]');
    if (state.plan) {
      var P = PLANS[state.plan];
      title.textContent = state.trial ? 'Try ' + P.name + ' free for ' + TRIAL_DAYS + ' days' : 'Get ' + P.name;
      sub.textContent = state.trial ? 'Log in or sign up to start.' : 'Log in or sign up, then pay.';
      box.innerHTML = planSummary(state.plan, state.trial);
      box.hidden = false;
    } else {
      title.textContent = state.mode === 'login' ? 'Log in to Daily Utility Cloud Storage' : 'Get Daily Utility Cloud Storage';
      sub.textContent = state.mode === 'login' ? 'Welcome back' : 'Sign up and get ' + DATA.free_gb + 'GB of storage. No card needed.';
      box.hidden = true;
    }
    modal.classList.toggle('auth-modal--plan', !!state.plan);
    setProviderLinks();
    modal.querySelector('[data-auth-switch]').innerHTML = state.mode === 'login'
      ? 'New here? <button type="button" data-auth-mode="signup">Sign up</button>'
      : 'Already have an account? <button type="button" data-auth-mode="login">Log in</button>';
    if (!keepFocus) lastFocus = doc.activeElement;
    modal.hidden = false;
    doc.documentElement.classList.add('auth-open');
    panel.focus();
  }

  function close() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    doc.documentElement.classList.remove('auth-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* Get started buttons go to the pricing page, where visitors choose a
     plan (or the free tier) before signing up. Counted on the way. */
  doc.addEventListener('click', function (e) {
    if (e.target.closest('[data-get-started]')) track('sign_up_start', { destination: 'pricing', transport_type: 'beacon' });
  });

  /* Every [data-auth] link opens the popup: Log in, plan buttons and the
     free sign-up. Without JavaScript they go straight to the web app. */
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('[data-auth]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    e.preventDefault();
    var kind = a.getAttribute('data-auth'), plan = a.getAttribute('data-plan'), trial = a.hasAttribute('data-trial');
    if (kind === 'plan') track('select_plan', { plan: plan, billing: billing, trial: trial, currency: currency, value: value(plan, billing) });
    else track(kind === 'login' ? 'login_start' : 'sign_up_start', {});
    var hdr = doc.getElementById('site-header');
    if (hdr && hdr.classList.contains('nav-open')) { var t = doc.getElementById('nav-toggle'); if (t) t.click(); }
    open({ mode: kind === 'login' ? 'login' : 'signup', plan: plan, trial: trial });
  });

  /* ---------- Offer: Pro free for 3 days ----------
     At most once per visitor, never once they have opened the sign-in
     popup, only on pages with plan cards: after 40 seconds there, or when
     a desktop pointer heads for the tabs. ?offer=show shows it at once. */
  var OFFER_KEY = 'du-offer-seen', offerLast, offerDone = false;
  function offerSeen() { try { return localStorage.getItem(OFFER_KEY) === '1'; } catch (e) { return true; } }
  function markOffer() { offerDone = true; try { localStorage.setItem(OFFER_KEY, '1'); } catch (e) {} }

  function buildOffer() {
    var P = PLANS.pro;
    offer = doc.createElement('div');
    offer.className = 'auth-modal offer-modal';
    offer.hidden = true;
    offer.innerHTML =
      '<div class="auth-backdrop" data-offer-close></div>' +
      '<div class="auth-panel" role="dialog" aria-modal="true" aria-labelledby="offer-title" aria-describedby="offer-sub" tabindex="-1">' +
        '<button class="auth-x" type="button" data-offer-close aria-label="Close">' + ICON_X + '</button>' +
        '<img class="auth-logo" src="' + MARK + '" alt="" width="40" height="40">' +
        '<h2 class="auth-title" id="offer-title">Try ' + P.name + ' free for ' + TRIAL_DAYS + ' days</h2>' +
        '<p class="auth-sub" id="offer-sub">' + P.storage + ' of storage for your photos, videos and files.</p>' +
        '<div class="auth-plan" data-offer-plan></div>' +
        '<div class="offer-actions">' +
          '<a class="btn btn--primary" href="#" data-offer-go>Try free for ' + TRIAL_DAYS + ' days</a>' +
          '<button class="offer-no" type="button" data-offer-close>No thanks</button>' +
        '</div>' +
      '</div>';
    doc.body.appendChild(offer);
    offer.addEventListener('click', function (e) {
      if (e.target.closest('[data-offer-close]')) { closeOffer(true); return; }
      var go = e.target.closest('[data-offer-go]');
      if (go && !(e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0)) {
        e.preventDefault();
        track('select_plan', { plan: 'pro', billing: billing, trial: true, source: 'offer', currency: currency, value: value('pro', billing) });
        closeOffer(false);
        open({ mode: 'signup', plan: 'pro', trial: true });
      }
    });
    doc.addEventListener('keydown', function (e) {
      if (offer.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeOffer(true); return; }
      if (e.key === 'Tab') trap(e, offer.querySelector('.auth-panel'));
    });
  }
  function showOffer(force) {
    if (!force && (offerDone || offerSeen())) return;
    if (modal && !modal.hidden) return;
    var hdr = doc.getElementById('site-header');
    if (hdr && hdr.classList.contains('nav-open')) return;
    if (!offer) buildOffer();
    markOffer();
    offer.querySelector('[data-offer-plan]').innerHTML = planSummary('pro', true);
    offer.querySelector('[data-offer-go]').setAttribute('href', webappUrl({ mode: 'signup', plan: 'pro', trial: true }));
    offerLast = doc.activeElement;
    offer.hidden = false;
    doc.documentElement.classList.add('auth-open');
    offer.querySelector('.auth-panel').focus();
    track('view_promotion', { promotion_id: 'pro-trial', plan: 'pro' });
  }
  function closeOffer(returnFocus) {
    if (!offer || offer.hidden) return;
    offer.hidden = true;
    doc.documentElement.classList.remove('auth-open');
    if (returnFocus && offerLast && offerLast.focus) offerLast.focus();
  }
  (function () {
    var force = false;
    try { force = new URLSearchParams(location.search).get('offer') === 'show'; } catch (e) {}
    if (force) { setTimeout(function () { showOffer(true); }, 300); return; }
    if (!doc.querySelector('[data-auth="plan"]') || offerSeen()) return;
    doc.addEventListener('click', function (e) { if (e.target.closest('[data-auth]')) offerDone = true; });
    var started = Date.now();
    setTimeout(function () { if (!doc.hidden) showOffer(); }, 40000);
    if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      doc.addEventListener('mouseout', function (e) {
        if (!e.relatedTarget && e.clientY <= 0 && Date.now() - started > 8000) showOffer();
      });
    }
  })();
})();
