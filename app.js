/* The Daily Purr: a cat fact a day from Angus, Leo and Ollie. Everything runs on the phone. */
(() => {
'use strict';
const P = window.PURR, FACTS = P.FACTS, CATS = P.CATS, IDS = ['angus', 'leo', 'ollie'];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
const fill = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : ''));

/* ---------- Seeded randomness, so each day's content stays the same all day ---------- */
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hash = s => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
const shuffle = (arr, r) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pickBy = (arr, seed) => arr[hash(seed) % arr.length];

/* ---------- Days ----------
   A day number for each calendar date. It's based on the date itself, not the clock, so it never skips or repeats
   when the clocks change. (The "- 1" keeps it matching the numbers saved by the first version during British Summer Time.) */
const dayNum = dt => Math.round(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()) / 864e5) - 1;
const dateOf = n => { const t = new Date((n + 1) * 864e5); return new Date(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()); };
const today = () => dayNum(new Date());
const weekStart = n => n - ((dateOf(n).getDay() + 6) % 7); // the Monday
const monthStart = n => { const d = dateOf(n); return dayNum(new Date(d.getFullYear(), d.getMonth(), 1)); };
const monthName = n => dateOf(n).toLocaleDateString('en-GB', { month: 'long' });
const day = today();

/* ---------- Facts ---------- */
P.QUIZ_FOR.forEach(([phrase, q]) => { const f = FACTS.find(x => x.t.includes(phrase)); if (f && !f.q) f.q = q; });
// One fixed shuffle of every fact; each day the three cats take the next three
const ORDER = shuffle(FACTS.map((_, i) => i), rng(hash('daily-purr')));
const dailyFact = (cat, d) => ORDER[(d * 3 + IDS.indexOf(cat)) % ORDER.length];
const mains = new Set(IDS.map(c => dailyFact(c, day)));
function factIdx(cat, k) {
  if (!k) return dailyFact(cat, day);
  // Extra facts: walk through the shuffle from a different starting point, skipping today's main ones
  let pos = (day * 7 + IDS.indexOf(cat) * 41 + k * 13) % ORDER.length;
  while (mains.has(ORDER[pos])) pos = (pos + 1) % ORDER.length;
  return ORDER[pos];
}

/* ---------- Special days ---------- */
const SPECIAL_FIELDS = [['her', 'Your birthday'], ['al', 'Angus & Leo’s birthday'], ['ol', 'Ollie’s birthday'], ['alg', 'Angus & Leo’s gotcha day'], ['olg', 'Ollie’s gotcha day']];
function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  return new Date(y, Math.floor((h + l - 7 * m + 114) / 31) - 1, ((h + l - 7 * m + 114) % 31) + 1);
}
const CALENDAR = { '1-1': 'newYear', '2-14': 'valentines', '8-8': 'catDay', '9-1': 'ginger', '10-27': 'blackCat', '10-29': 'nationalCatDay', '10-31': 'halloween', '11-5': 'bonfire', '12-24': 'christmasEve', '12-25': 'christmas', '12-26': 'boxingDay', '12-31': 'newYearsEve' };
const AGE = { angus: n => `I am ${n} today. `, leo: n => `I’m ${n} today!! `, ollie: n => `I’M ${n}!!! ` };
const AGE_TOGETHER = { angus: n => `We are ${n} today. `, leo: n => `we’re ${n}!! `, ollie: n => `THEY’RE ${n}!!! ` };
const YEARS = { angus: n => `${n} ${n === 1 ? 'year' : 'years'} ago today: `, leo: n => `${n} ${n === 1 ? 'year' : 'years'} ago today… `, ollie: n => `${n} ${n === 1 ? 'YEAR' : 'YEARS'} AGO TODAY!!! ` };
// Put the age (or years) where the line asks for it, or at the start if it doesn't
const withAge = (line, a) => (line.includes('{age}') ? line.replace('{age}', a) : a + line);
function specialFor(n) {
  const sp = store.get('dp_special', {}), dt = dateOf(n), D = dt.getDate(), M = dt.getMonth() + 1, Y = dt.getFullYear();
  const is = o => o && +o.d === D && +o.m === M;
  const yrs = o => (o && +o.y > 1900 && +o.y <= Y ? Y - +o.y : 0);
  const S = P.SPECIAL, name = store.get('dp_name', '').trim(), seed = c => `${n}|${c}`;
  if (is(sp.her)) return { emoji: '🎂', title: fill(S.herBirthday.title, { name: name ? ', ' + name : '' }), line: c => pickBy(S.herBirthday.lines[c], seed(c)), confetti: true };
  const al = is(sp.al), ol = is(sp.ol);
  if (al || ol) {
    const cats = al && ol ? IDS : al ? ['angus', 'leo'] : ['ollie'], src = al ? sp.al : sp.ol;
    const who = al && ol ? 'boys' : al ? 'Angus & Leo' : 'Ollie', n2 = yrs(src);
    return { emoji: '🎂', title: fill(S.catBirthday.title, { who }), cats, kind: 'birthday', confetti: true,
      line: c => {
        if (al && !ol) return withAge(pickBy(S.catBirthday.together[c], seed(c)), n2 ? AGE_TOGETHER[c](n2) : '');
        if (cats.includes(c)) return withAge(pickBy(S.catBirthday.self[c], seed(c)), n2 ? AGE[c](n2) : '');
        return fill(pickBy(S.catBirthday.other[c], seed(c)), { who });
      } };
  }
  const alg = is(sp.alg), olg = is(sp.olg);
  if (alg || olg) {
    const cats = alg && olg ? IDS : alg ? ['angus', 'leo'] : ['ollie'], src = alg ? sp.alg : sp.olg;
    const who = alg && olg ? 'Everyone' : alg ? 'Angus & Leo' : 'Ollie', n2 = yrs(src);
    return { emoji: '🏡', title: fill(S.gotcha.title, { who }), cats, kind: 'gotcha', confetti: true,
      line: c => cats.includes(c) ? withAge(pickBy(S.gotcha.self[c], seed(c)).replace('{years}', '{age}'), n2 ? YEARS[c](n2) : '') : fill(pickBy(S.gotcha.other[c], seed(c)), { who }) };
  }
  let key = CALENDAR[`${M}-${D}`];
  const e = easter(Y), mum = new Date(e.getFullYear(), e.getMonth(), e.getDate() - 21);
  if (dayNum(e) === n) key = 'easter';
  if (dayNum(mum) === n) key = 'mothersDay';
  if (!key) return null;
  return { emoji: S[key].emoji, title: S[key].title, line: c => pickBy(S[key].lines[c], seed(c)), confetti: key === 'christmas' || key === 'newYear' };
}
let special = specialFor(day);
const catOfDay = d => { const s = d === day ? special : specialFor(d); return s && s.cats ? s.cats[hash('b' + d) % s.cats.length] : IDS[hash('cat' + d) % 3]; };

/* ---------- Fusses (for jealousy and Employee of the Month) ---------- */
let fuss = store.get('dp_fuss', {}); // { dayNumber: { angus: 3, ... } }
function addFuss(id) {
  const t = fuss[day] || (fuss[day] = {}); t[id] = (t[id] || 0) + 1;
  Object.keys(fuss).forEach(k => { if (+k < day - 70) delete fuss[k]; });
  store.set('dp_fuss', fuss);
}
function fussSum(from, to) { const o = { angus: 0, leo: 0, ollie: 0 }; for (const k in fuss) if (+k >= from && +k <= to) IDS.forEach(i => { o[i] += fuss[k][i] || 0; }); return o; }
// Is someone being neglected this week? Returns the speaker and the figures, or null
function jealousy() {
  const wk = fussSum(weekStart(day), day), top = IDS.slice().sort((a, b) => wk[b] - wk[a])[0];
  const low = IDS.filter(i => i !== top).sort((a, b) => wk[a] - wk[b])[0];
  return wk[top] - wk[low] >= 5 ? { by: low, top, n: wk[top], m: wk[low] } : null;
}
const jealousLine = j => fill(pickBy(P.JEALOUS[j.by], `${day}|${j.by}|${j.n}`), { top: CATS[j.top].name, n: j.n, m: j.m });

/* ---------- Complaints data (used by moods and Employee of the Month too) ---------- */
const COMPS = P.COMPLAINTS;
const CORDER = shuffle(COMPS.map((_, i) => i), rng(hash('complaints')));
const complaintFor = d => COMPS[CORDER[((d % CORDER.length) + CORDER.length) % CORDER.length]];
const rulings = () => store.get('dp_rulings', {});
const appeals = () => store.get('dp_appeals', {});
const mgmtAll = () => store.get('dp_mcomps', []); // everything Management has filed: complaints and praise
const isPraise = m => m.kind === 'praise';
const mcomps = () => mgmtAll().filter(m => !isPraise(m));
const praises = () => mgmtAll().filter(isPraise);
// For a cat-v-cat complaint that's been ruled on: who won and who lost (after any appeal)
function outcome(d) {
  const r = rulings()[d], c = complaintFor(d);
  if (!r || c.against === 'management' || r === 'apologise' || r === 'deny') return null;
  let win = r === 'upheld' ? c.from : c.against, lose = r === 'upheld' ? c.against : c.from;
  if (appeals()[d] === 'allowed') [win, lose] = [lose, win];
  return { win, lose, firstLoser: r === 'upheld' ? c.against : c.from };
}
const hasAppeal = d => hash('appeal' + d) % 10 < 7;

/* ---------- Moods ---------- */
function moodOf(id) {
  const E = P.MOOD_EVENTS;
  if (special && special.cats && special.cats.includes(id)) return E[special.kind][id];
  const latest = mgmtAll().filter(m => m.d === day && m.against === id).pop();
  if (latest) return isPraise(latest) ? E.praised[id] : E.accused[id];
  for (const d of [day, day - 1]) { const o = outcome(d); if (o && o.lose === id) return E.sulking[id]; if (o && o.win === id) return E.smug[id]; }
  return pickBy(P.MOODS[id], 'mood' + day + id);
}

/* ---------- What the cat says ---------- */
function compose(cat, idx, seedStr) {
  const r = rng(hash(seedStr)), pick = a => a[Math.floor(r() * a.length)];
  const c = CATS[cat], f = FACTS[idx];
  const quips = c.quips[f.tag] || c.quips.misc;
  const cameoOptions = P.CAMEOS.filter(x => x.after === cat);
  let cameo = r() < 0.38 && cameoOptions.length ? pick(cameoOptions) : null;
  const j = jealousy();
  if (j && j.by !== cat && r() < 0.5) cameo = { by: j.by, t: jealousLine(j) };
  return { cat, factIdx: idx, intro: pick(c.intro), fact: f.t, quip: pick(quips), outro: pick(c.outro), cameo, photo: (c.alt && c.alt[f.tag]) || c.photo };
}

/* ---------- Today's history: every fact shown, so Back works ---------- */
let hist = store.get('dp_hist', null);
if (!hist || hist.day !== day || !Array.isArray(hist.list) || !hist.list.length) hist = { day, list: [{ c: catOfDay(day), k: 0 }], pos: 0 };
let maxK = store.get('dp_extras', {}); // highest "another" number used per cat today
if (maxK.day !== day) maxK = { day, n: {} };
const saveHist = () => store.set('dp_hist', hist);
let selected = hist.list[hist.pos].c;
let shown = null;
const lastK = cat => { for (let i = hist.pos; i >= 0; i--) if (hist.list[i].c === cat) return hist.list[i].k; return 0; };
function pushEntry(entry) { hist.list = hist.list.slice(0, hist.pos + 1); hist.list.push(entry); hist.pos = hist.list.length - 1; saveHist(); }

/* ---------- Header ---------- */
function header() {
  const d = new Date();
  $('#dateLine').textContent = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const h = d.getHours(), name = store.get('dp_name', '').trim();
  const part = h < 5 ? 'Up late' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  $('#greet').textContent = `${part}${name ? ', ' + name : ''}! Today’s cat is ${CATS[catOfDay(day)].name}.`;
  let s = store.get('dp_streak', { last: null, n: 0 });
  if (s.last !== day) { s = { last: day, n: s.last === day - 1 ? s.n + 1 : 1 }; store.set('dp_streak', s); }
  $('#streak').hidden = s.n < 2;
  $('#streak').textContent = `🔥 ${s.n} days`;
}
function renderSpecial() {
  const el = $('#special');
  if (!special) { el.hidden = true; return; }
  el.hidden = false;
  $('#spEmoji').textContent = special.emoji; $('#spTitle').textContent = special.title;
  $('#spLine').innerHTML = `<b>${esc(CATS[selected].name)}:</b> ${esc(special.line(selected))}`;
}

/* ---------- The cats row ---------- */
function renderCats() {
  const cod = catOfDay(day);
  $('#cats').innerHTML = IDS.map(id => `<button class="cat" type="button" role="tab" data-id="${id}" aria-selected="${id === selected}" style="--c:${CATS[id].color}">
      ${id === cod ? '<span class="today">today</span>' : ''}
      <span class="face"><img src="${CATS[id].photo}" alt="${CATS[id].name}" data-id="${id}"></span><span class="nm">${CATS[id].name}</span><span class="mood">${esc(moodOf(id))}</span></button>`).join('');
  $$('#cats .cat').forEach(b => b.onclick = e => tapCat(b.dataset.id, e));
}
function tapCat(id, e) {
  if (id === selected) { pet(id, e); return; }
  stopSpeaking();
  pushEntry({ c: id, k: lastK(id) });
  sound('chirp', id);
  showEntry('swap');
  if (store.get('dp_auto', false)) speak();
}

/* ---------- The bubble ---------- */
function showEntry(anim) {
  const e = hist.list[hist.pos];
  selected = e.c;
  $$('#cats .cat').forEach(b => b.setAttribute('aria-selected', b.dataset.id === selected));
  const idx = factIdx(e.c, e.k);
  shown = compose(e.c, idx, `${day}|${e.c}|${idx}|${e.k}`);
  shown.k = e.k;
  document.documentElement.style.setProperty('--cat', CATS[selected].color);
  const b = $('#bubble');
  b.dataset.cat = selected; b.classList.remove('swap', 'in-left', 'in-right'); void b.offsetWidth; b.classList.add(anim || 'swap');
  b.style.setProperty('--tail', `${(IDS.indexOf(selected) * 2 + 1) / 6 * 100}%`);
  $('#intro').textContent = shown.intro; $('#fact').textContent = shown.fact; $('#quip').textContent = shown.quip; $('#outro').textContent = shown.outro;
  // Mood photo for some topics (Leo's worried face, Ollie's fangs, Angus in his box)
  IDS.forEach(i => { const im = $(`#cats img[data-id="${i}"]`); if (im) im.src = i === selected ? shown.photo : CATS[i].photo; });
  if (shown.cameo) {
    $('#cameo').hidden = false; $('#cameoImg').src = CATS[shown.cameo.by].photo; $('#cameoImg').alt = CATS[shown.cameo.by].name;
    $('#cameoText').innerHTML = `<b>${esc(CATS[shown.cameo.by].name)}:</b> ${esc(shown.cameo.t)}`;
  } else $('#cameo').hidden = true;
  // Remember it for the archive
  const seen = store.get('dp_seen', {}); if (!seen[idx]) { seen[idx] = [day, e.c]; store.set('dp_seen', seen); }
  renderSpecial(); renderNav(); updateSave(); prepareShare();
}
function renderNav() {
  const ahead = hist.pos < hist.list.length - 1;
  $('#backBtn').disabled = hist.pos === 0;
  $('#anotherBtn span').textContent = ahead ? 'Next' : 'Another';
  const dots = $('#dots'), n = hist.list.length;
  dots.hidden = n < 2;
  if (n < 2) return;
  const W = 9, from = Math.max(0, Math.min(hist.pos - 4, n - W)), to = Math.min(n, from + W);
  dots.innerHTML = (from > 0 ? '<i class="more">…</i>' : '') +
    hist.list.slice(from, to).map((e, i) => `<i class="${from + i === hist.pos ? 'on' : ''}" style="--c:${CATS[e.c].color}"></i>`).join('') +
    (to < n ? '<i class="more">…</i>' : '');
  dots.setAttribute('aria-label', `Fact ${hist.pos + 1} of ${n} today`);
}
function goNext() {
  stopSpeaking();
  if (hist.pos < hist.list.length - 1) { hist.pos++; saveHist(); }
  else {
    const k = Math.max(maxK.n[selected] || 0, lastK(selected)) + 1;
    maxK.n[selected] = k; store.set('dp_extras', maxK);
    pushEntry({ c: selected, k });
  }
  sound('chirp', hist.list[hist.pos].c); showEntry('in-right');
  if (store.get('dp_auto', false)) speak();
}
function goBack() {
  if (hist.pos === 0) { const b = $('#bubble'); b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge'); return; }
  stopSpeaking(); hist.pos--; saveHist(); showEntry('in-left');
  if (store.get('dp_auto', false)) speak();
}
$('#anotherBtn').onclick = goNext;
$('#backBtn').onclick = goBack;
// Swipe the bubble: left for the next fact, right to go back
(() => {
  const b = $('#bubble'); let sx = null, sy = 0, st = 0;
  b.addEventListener('touchstart', e => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; st = Date.now(); }, { passive: true });
  b.addEventListener('touchend', e => {
    if (sx === null) return; const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && Date.now() - st < 900) { if (dx < 0) goNext(); else goBack(); }
  }, { passive: true });
})();

/* ---------- Favourites ---------- */
const favs = () => store.get('dp_favs', []);
const isFav = s => favs().some(f => f.i === s.factIdx && f.cat === s.cat);
function updateSave() {
  const on = isFav(shown);
  $('#saveBtn').setAttribute('aria-pressed', on); $('#saveBtn span').textContent = on ? 'Saved' : 'Save';
  const n = favs().length; $('#favCount').textContent = n ? `(${n})` : '';
}
$('#saveBtn').onclick = e => {
  let f = favs();
  if (isFav(shown)) f = f.filter(x => !(x.i === shown.factIdx && x.cat === shown.cat));
  else { f.unshift({ i: shown.factIdx, cat: shown.cat, quip: shown.quip, t: Date.now() }); hearts(e.clientX, e.clientY, 5); toast('Saved to favourites'); }
  store.set('dp_favs', f); updateSave();
};
$('#favBtn').onclick = () => { renderFavs(); open('m-fav'); };
function renderFavs() {
  const f = favs();
  $('#favList').innerHTML = f.length ? f.map((x, k) => `<div class="fav" style="--c:${CATS[x.cat].color}"><img src="${CATS[x.cat].photo}" alt="${CATS[x.cat].name}"><p>${esc(FACTS[x.i] ? FACTS[x.i].t : '')}<small>${esc(CATS[x.cat].name)}: ${esc(x.quip || '')}</small></p><button type="button" data-k="${k}" aria-label="Remove">×</button></div>`).join('')
    : '<p class="empty">No favourites yet. Tap ♥ Save on a fact you like.</p>';
  $$('#favList [data-k]').forEach(b => b.onclick = () => { const a = favs(); a.splice(+b.dataset.k, 1); store.set('dp_favs', a); renderFavs(); updateSave(); });
}

/* ---------- Archive: every fact she's heard ---------- */
let archFilter = 'all';
const whenLabel = d => d === day ? 'Today' : d === day - 1 ? 'Yesterday' : dateOf(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
$('#archBtn').onclick = () => { archFilter = 'all'; renderArchive(); open('m-arch'); };
function renderArchive() {
  const seen = store.get('dp_seen', {}), all = Object.keys(seen).map(i => ({ i: +i, d: seen[i][0], c: seen[i][1] }));
  const n = all.length, total = FACTS.length;
  $('#archProg').innerHTML = `<b>${n} of ${total}</b> facts discovered<span class="bar"><i style="width:${Math.max(2, n / total * 100)}%"></i></span>`;
  $('#archFilters').innerHTML = [['all', 'All']].concat(IDS.map(i => [i, CATS[i].name])).map(([k, l]) => `<button class="chip" type="button" data-f="${k}" aria-pressed="${archFilter === k}" ${k !== 'all' ? `style="--c:${CATS[k].color}"` : ''}>${l}</button>`).join('');
  $$('#archFilters [data-f]').forEach(b => b.onclick = () => { archFilter = b.dataset.f; renderArchive(); });
  const list = all.filter(x => archFilter === 'all' || x.c === archFilter).sort((a, b) => b.d - a.d || a.i - b.i);
  let last = null, html = '';
  list.forEach(x => {
    if (x.d !== last) { html += `<h3 class="lbl">${esc(whenLabel(x.d))}</h3>`; last = x.d; }
    const fav = favs().some(f => f.i === x.i);
    html += `<div class="fav arch" style="--c:${CATS[x.c].color}"><img src="${CATS[x.c].photo}" alt="${CATS[x.c].name}"><p>${esc(FACTS[x.i].t)}<small>from ${esc(CATS[x.c].name)}${fav ? ' · ♥ saved' : ''}</small></p></div>`;
  });
  $('#archList').innerHTML = html || '<p class="empty">Nothing here yet.</p>';
}

/* ---------- Complaints Department ---------- */
const nameOf = id => (id === 'management' ? 'Management' : CATS[id].name);
const photoOf = id => (id === 'management' ? null : CATS[id].photo);
function compBadge() { $('#compNew').hidden = store.get('dp_cseen', null) === day; }
$('#compBtn').onclick = () => { store.set('dp_cseen', day); compBadge(); $('#fileForm').hidden = true; fileAgainst = null; renderComplaints(); open('m-comp'); };

// Employee of the Month: fusses + cases won − cases lost − complaints from Management + praise from Management
function scores(from, to) {
  const f = fussSum(from, to), s = {};
  IDS.forEach(i => { s[i] = { id: i, pts: f[i], fuss: f[i], won: 0, lost: 0, mg: 0, pr: 0 }; });
  for (let d = from; d <= to; d++) { const o = outcome(d); if (o) { s[o.win].won++; s[o.win].pts += 3; s[o.lose].lost++; s[o.lose].pts -= 2; } }
  mcomps().filter(m => m.d >= from && m.d <= to).forEach(m => { s[m.against].mg++; s[m.against].pts -= 2; });
  praises().filter(m => m.d >= from && m.d <= to).forEach(m => { s[m.against].pr++; s[m.against].pts += 2; });
  return IDS.map(i => s[i]).sort((a, b) => b.pts - a.pts || b.fuss - a.fuss || hash(a.id + from) - hash(b.id + from));
}
const active = list => list.some(x => x.fuss || x.won || x.lost || x.mg || x.pr);
function lastMonthWinner() {
  const ms = monthStart(day), prevStart = monthStart(ms - 1), list = scores(prevStart, ms - 1);
  return active(list) ? { id: list[0].id, month: monthName(prevStart), start: prevStart } : null;
}
function renderEotm() {
  const ms = monthStart(day), now = scores(ms, day), prev = lastMonthWinner(), wk = fussSum(weekStart(day), day);
  const max = Math.max(1, ...now.map(x => Math.abs(x.pts)));
  const detail = x => [x.fuss && `${x.fuss} ${x.fuss === 1 ? 'fuss' : 'fusses'}`, x.won && `${x.won} won`, x.lost && `${x.lost} lost`, x.pr && `${x.pr} ${x.pr === 1 ? 'praise' : 'praises'}`, x.mg && `${x.mg} ${x.mg === 1 ? 'complaint' : 'complaints'} from Management`].filter(Boolean).join(' · ') || 'nothing yet';
  $('#eotm').innerHTML = `
    ${prev ? `<div class="winner" style="--c:${CATS[prev.id].color}"><img src="${CATS[prev.id].photo}" alt=""><div><span class="lbl">🏆 ${esc(prev.month)}’s Employee of the Month</span><b>${esc(CATS[prev.id].name)}</b><p>“${esc(pickBy(P.EOTM.win[prev.id], 'w' + prev.start))}”</p></div></div>` : ''}
    <h3 class="lbl">${esc(monthName(day))} so far</h3>
    ${now.map((x, r) => `<div class="standing" style="--c:${CATS[x.id].color}"><span class="pos">${r + 1}</span><img src="${CATS[x.id].photo}" alt=""><div><b>${esc(CATS[x.id].name)} <em>${x.pts} pts</em></b><span class="bar"><i style="width:${Math.max(3, Math.max(0, x.pts) / max * 100)}%"></i></span><small>${esc(detail(x))}</small></div></div>`).join('')}
    <p class="fine">Points: a fuss is 1, a case won is 3, a case lost is −2, praise from Management is 2, a complaint from Management is −2. Fusses this week: ${IDS.map(i => `${CATS[i].name} ${wk[i]}`).join(' · ')}.</p>`;
}
function renderMgmt() {
  const list = mgmtAll().slice().reverse().slice(0, 12);
  $('#mgmtList').innerHTML = list.length ? `<h3 class="lbl">From Management</h3>` + list.map(m => {
    const p = isPraise(m), c = m.against;
    return `<article class="complaint mg${p ? ' praise' : ''}" style="--c:${CATS[c].color}">
      <header><span>${p ? 'Commendation' : 'Ref.'} ${p ? 'C' : 'M'}-${String(m.id).slice(-4)}</span><span>${esc(whenLabel(m.d))}</span></header>
      <div class="parties"><span class="duo"><img src="${CATS[c].photo}" alt=""></span><span class="who">${p ? `🌟 ${esc(CATS[c].name)}` : `Management<i>v</i>${esc(CATS[c].name)}`}</span><span class="type">${esc(m.type)}</span></div>
      ${m.text ? `<p class="ctext">“${esc(m.text)}”</p>` : ''}
      <p class="creply"><b>${esc(CATS[c].name)} ${p ? 'says' : 'responds'}:</b> ${esc(m.reply)}</p>
      ${m.counter ? `<p class="${p ? 'jealous' : 'counter'}">${esc(m.counter)}</p>` : ''}
      <span class="stamp green">${p ? 'Commended' : 'On file'}</span></article>`;
  }).join('') : '';
}
function renderComplaints() {
  renderEotm(); renderMgmt();
  const R = rulings(), A = appeals();
  const days = Array.from({ length: 14 }, (_, k) => day - k);
  const count = {}; days.forEach(d => { const c = complaintFor(d); count[c.against] = (count[c.against] || 0) + 1; });
  const top = IDS.slice().sort((a, b) => (count[b] || 0) - (count[a] || 0))[0];
  const sorry = days.filter(d => R[d] === 'apologise').length;
  $('#tally').innerHTML = `<div><b>${CATS[top].name} (${count[top] || 0})</b><span>most complained about this fortnight</span></div><div><b>${count.management || 0}</b><span>complaints against Management${sorry ? ` · ${sorry} ${sorry === 1 ? 'apology' : 'apologies'}` : ''}</span></div>`;
  $('#compList').innerHTML = days.map(d => {
    const c = complaintFor(d), r = R[d], mg = c.against === 'management';
    const imgs = [photoOf(c.from), photoOf(c.against)].filter(Boolean).map(p => `<img src="${p}" alt="">`).join('');
    let ruling;
    if (r) {
      const pool = P.RULINGS[r], speaker = r === 'upheld' ? c.against : c.from;
      const line = pool[speaker] ? pool[speaker][hash(d + r) % pool[speaker].length] : '';
      const label = { upheld: 'Upheld', dismissed: 'Dismissed', apologise: 'Apology issued', deny: 'Denied' }[r];
      ruling = `<span class="stamp${r === 'dismissed' || r === 'deny' ? '' : ' green'}">${label}</span>${line ? `<p class="react"><b>${esc(nameOf(speaker))}:</b> ${esc(line)}</p>` : ''}`;
      const o = outcome(d);
      if (o && hasAppeal(d)) {
        const who = o.firstLoser, ap = A[d];
        ruling += `<div class="appeal"><p><b>📜 Appeal lodged by ${esc(CATS[who].name)}:</b> “${esc(pickBy(P.APPEALS[who], 'apt' + d))}”</p>` +
          (ap ? `<span class="stamp${ap === 'allowed' ? ' green' : ''}">${ap === 'allowed' ? 'Overturned on appeal' : 'Appeal rejected'}</span><p class="react"><b>${esc(CATS[who].name)}:</b> ${esc(pickBy(P.APPEAL_RULINGS[ap][who], 'apr' + d))}</p>`
              : `<div class="ruling"><button class="up" type="button" data-ad="${d}" data-a="allowed">Allow appeal</button><button type="button" data-ad="${d}" data-a="rejected">Reject appeal</button></div>`) + '</div>';
      }
    } else {
      const btns = mg ? `<button class="up" type="button" data-d="${d}" data-r="apologise">Apologise</button><button type="button" data-d="${d}" data-r="deny">Deny everything</button>`
                      : `<button class="up" type="button" data-d="${d}" data-r="upheld">Uphold</button><button type="button" data-d="${d}" data-r="dismissed">Dismiss</button>`;
      ruling = `<div class="ruling">${btns}${d !== day ? `<span class="status">${esc(P.PENDING[hash('p' + d) % P.PENDING.length])}</span>` : ''}</div>`;
    }
    return `<article class="complaint" style="--c:${CATS[c.from].color}">
      <header><span>Complaint No. ${String(d % 10000).padStart(4, '0')}</span>${d === day ? '<span class="newtag">New today</span>' : `<span>${esc(whenLabel(d))}</span>`}</header>
      <div class="parties"><span class="duo">${imgs}</span><span class="who">${esc(nameOf(c.from))}<i>v</i>${esc(nameOf(c.against))}</span><span class="type">${esc(c.type)}</span></div>
      <p class="ctext">“${esc(c.t)}”</p>
      ${c.reply ? `<p class="creply"><b>${esc(nameOf(c.against))} responds:</b> ${esc(c.reply)}</p>` : ''}
      ${ruling}</article>`;
  }).join('');
  $$('#compList [data-r]').forEach(b => b.onclick = () => {
    const all = rulings(); all[b.dataset.d] = b.dataset.r; store.set('dp_rulings', all);
    const c = complaintFor(+b.dataset.d);
    sound(b.dataset.r === 'upheld' || b.dataset.r === 'deny' ? 'chirp' : 'purr', c.from === 'management' ? 'angus' : c.from);
    renderComplaints(); renderCats();
  });
  $$('#compList [data-ad]').forEach(b => b.onclick = () => {
    const all = appeals(); all[b.dataset.ad] = b.dataset.a; store.set('dp_appeals', all);
    const o = outcome(+b.dataset.ad); sound(b.dataset.a === 'allowed' ? 'purr' : 'chirp', o.firstLoser);
    renderComplaints(); renderCats();
  });
}
// Management files a complaint, or gives praise
let fileAgainst = null, fileMode = 'complaint';
function openFileForm(mode) {
  const f = $('#fileForm');
  if (!f.hidden && fileMode === mode) { f.hidden = true; return; }
  fileMode = mode; f.hidden = false; f.classList.toggle('praise', mode === 'praise');
  const praise = mode === 'praise';
  $('#fileWhoLbl').textContent = praise ? 'Praise for' : 'Complaint against';
  $('#fileTypeLbl').textContent = praise ? 'What for?' : 'Type of complaint';
  $('#fileText').placeholder = praise ? 'What did he do?' : 'What happened?';
  $('#fileSubmit').textContent = praise ? 'Give praise' : 'Lodge complaint';
  $('#fileWho').innerHTML = IDS.map(id => `<button class="chip who" type="button" data-w="${id}" aria-pressed="${fileAgainst === id}" style="--c:${CATS[id].color}"><img src="${CATS[id].photo}" alt="">${CATS[id].name}</button>`).join('');
  $$('#fileWho [data-w]').forEach(b => b.onclick = () => { fileAgainst = b.dataset.w; $$('#fileWho [data-w]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  $('#fileType').innerHTML = (praise ? P.PRAISE_TYPES : P.MGMT_TYPES).map(t => `<option>${esc(t)}</option>`).join('');
  $('#fileText').value = '';
  f.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
$('#fileBtn').onclick = () => openFileForm('complaint');
$('#praiseBtn').onclick = () => openFileForm('praise');
$('#fileForm').onsubmit = e => {
  e.preventDefault();
  const praise = fileMode === 'praise';
  if (!fileAgainst) { toast(praise ? 'Who are you praising?' : 'Who is the complaint against?'); return; }
  const type = $('#fileType').value, id = Date.now(), cat = fileAgainst;
  const text = $('#fileText').value.trim().slice(0, 200);
  let entry;
  if (praise) {
    const pool = P.PRAISE[cat][type] || P.PRAISE[cat]['Something else'];
    const others = IDS.filter(i => i !== cat), jealous = others[hash('j' + id) % 2];
    const counter = hash('pj' + id) % 10 < 5 ? fill(pickBy(P.PRAISE_JEALOUS[jealous], 'pjl' + id), { who: CATS[cat].name }) : '';
    entry = { id, d: day, kind: 'praise', against: cat, type, text, reply: pickBy(pool, 'r' + id), counter };
  } else {
    const pool = P.MGMT[cat][type] || P.MGMT[cat]['Something else'];
    const counter = hash('c' + id) % 10 < 4 ? pickBy(P.COUNTER[cat], 'cc' + id) : '';
    entry = { id, d: day, against: cat, type, text, reply: pickBy(pool, 'r' + id), counter };
  }
  const list = mgmtAll(); list.push(entry); store.set('dp_mcomps', list.slice(-80));
  $('#fileForm').hidden = true; fileAgainst = null;
  if (praise) { sound('purr', cat); const r = $('#praiseBtn').getBoundingClientRect(); hearts(r.left + r.width / 2, r.top, 6, ['🌟', '🧡', '✨', '🐾']); toast(`${CATS[cat].name} has been commended`); }
  else { sound('chirp', cat); toast(`Complaint lodged against ${CATS[cat].name}`); }
  renderComplaints(); renderCats();
  $('#mgmtList').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* ---------- Weekly quiz ---------- */
const QFACTS = FACTS.map((f, i) => (f.q ? i : -1)).filter(i => i >= 0);
const wk = weekStart(day), quizmaster = IDS[Math.floor(wk / 7) % 3];
let quiz = null;
function quizBadge() { $('#quizNew').hidden = store.get('dp_quiz', {})[wk] !== undefined; }
function buildQuiz() {
  const r = rng(hash('quiz' + wk)), seen = store.get('dp_seen', {});
  const recent = QFACTS.filter(i => seen[i] && seen[i][0] >= day - 14);
  const picks = shuffle(recent, r).concat(shuffle(QFACTS.filter(i => !recent.includes(i)), r)).slice(0, 5);
  return { i: 0, score: 0, answered: false, qs: picks.map(i => { const [q, a, ...w] = FACTS[i].q; return { i, q, a, opts: shuffle([a, ...w], r) }; }) };
}
$('#quizBtn').onclick = () => { quiz = null; renderQuiz(); open('m-quiz'); };
function renderQuiz() {
  const m = quizmaster, el = $('#quizBody'), res = store.get('dp_quiz', {});
  if (!quiz) {
    el.innerHTML = `<div class="qm" style="--c:${CATS[m].color}"><img src="${CATS[m].photo}" alt=""><div><span class="lbl">This week’s quizmaster</span><b>${CATS[m].name}</b><p>${esc(pickBy(P.QUIZ.intro[m], 'qi' + wk))}</p></div></div>
      ${res[wk] !== undefined ? `<p class="fine">You scored ${res[wk]} out of 5 this week. A new quiz arrives every Monday.</p>` : '<p class="fine">Five questions, mostly about facts you’ve heard recently. A new quiz arrives every Monday.</p>'}
      <button class="big" type="button" id="qStart">${res[wk] !== undefined ? 'Play again' : 'Start the quiz'}</button>`;
    $('#qStart').onclick = () => { quiz = buildQuiz(); renderQuiz(); };
    return;
  }
  if (quiz.i >= quiz.qs.length) {
    const s = quiz.score, band = s <= 2 ? 'low' : s <= 4 ? 'mid' : 'top';
    if (res[wk] === undefined) { res[wk] = s; store.set('dp_quiz', res); quizBadge(); }
    el.innerHTML = `<div class="qresult"><b>${s} / 5</b><img src="${CATS[m].photo}" alt=""><p><b>${CATS[m].name}:</b> ${esc(pickBy(P.QUIZ.result[band][m], 'qr' + wk + s))}</p></div><button class="big" type="button" id="qAgain">Play again</button>`;
    if (s === 5) hearts(innerWidth / 2, innerHeight / 2, 10, ['🎉', '🧡', '⭐', '🐾']);
    sound(s >= 3 ? 'purr' : 'chirp', m);
    $('#qAgain').onclick = () => { quiz = buildQuiz(); renderQuiz(); };
    return;
  }
  const q = quiz.qs[quiz.i];
  el.innerHTML = `<p class="lbl">Question ${quiz.i + 1} of ${quiz.qs.length}</p><h3 class="qq">${esc(q.q)}</h3>
    <div class="qopts">${q.opts.map((o, k) => `<button type="button" class="qopt" data-k="${k}">${esc(o)}</button>`).join('')}</div>
    <div id="qAfter" hidden><p class="qfact"></p><button class="big" type="button" id="qNext">${quiz.i === quiz.qs.length - 1 ? 'See my score' : 'Next question'}</button></div>`;
  $$('.qopt').forEach(b => b.onclick = () => {
    if (quiz.answered) return; quiz.answered = true;
    const right = q.opts[+b.dataset.k] === q.a; if (right) quiz.score++;
    $$('.qopt').forEach(x => { x.disabled = true; if (q.opts[+x.dataset.k] === q.a) x.classList.add('right'); });
    if (!right) b.classList.add('wrong');
    $('#qAfter').hidden = false; $('.qfact').textContent = (right ? '✓ ' : '✗ ') + FACTS[q.i].t;
    sound(right ? 'chirp' : 'purr', m);
  });
  $('#qNext').onclick = () => { quiz.i++; quiz.answered = false; renderQuiz(); };
}

/* ---------- Meet the cats ---------- */
$('#meetBtn').onclick = () => {
  $('#meetList').innerHTML = IDS.map(id => `<div class="meet" style="--c:${CATS[id].color}"><img src="${CATS[id].photo}" alt="${CATS[id].name}"><div><h3>${CATS[id].name}</h3><p class="role">${esc(CATS[id].role)}</p><p>${esc(CATS[id].bio)}</p><p class="mood-line">Today’s mood: <b>${esc(moodOf(id))}</b></p></div></div>`).join('');
  open('m-meet');
};

/* ---------- Petting ---------- */
function pet(id, e) {
  const btn = $(`#cats .cat[data-id="${id}"]`);
  const cls = id === 'leo' ? 'shiver' : 'wiggle';
  btn.classList.remove(cls); void btn.offsetWidth; btn.classList.add(cls);
  setTimeout(() => btn.classList.remove(cls), 700);
  const r = btn.querySelector('.face').getBoundingClientRect();
  hearts(e && e.clientX ? e.clientX : r.left + r.width / 2, r.top + r.height / 3, id === 'leo' ? 2 : 4);
  const img = btn.querySelector('img'), alt = CATS[id].alt && CATS[id].alt.pet;
  if (alt && !customAvatar[id]) { img.src = alt; setTimeout(() => { img.src = selected === id && shown ? shown.photo : CATS[id].photo; }, 1400); }
  if (id === 'ollie') { sound('chirp', id); setTimeout(() => sound('purr', id), 170); } // Ollie can't help announcing himself first
  else sound('purr', id);
  if (id === 'leo' && Math.random() < 0.4) toast('Leo flinched, then decided he liked it');
  addFuss(id);
  const j = jealousy();
  if (j && j.top === id && (j.n - j.m) % 5 === 0) setTimeout(() => toast(`${CATS[j.by].name}: ${jealousLine(j)}`), 900);
}
function hearts(x, y, n, set) {
  const e = set || ['🧡', '❤️', '🐾', '💛'];
  for (let i = 0; i < n; i++) {
    const h = document.createElement('span'); h.className = 'heart'; h.textContent = e[i % e.length];
    h.style.left = (x - 11 + (Math.random() * 30 - 15)) + 'px'; h.style.top = (y - 11) + 'px';
    h.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px'); h.style.animationDelay = (i * 0.08) + 's';
    document.body.appendChild(h); setTimeout(() => h.remove(), 2200);
  }
}

/* ---------- Her own photos and recordings, kept on the phone in IndexedDB ---------- */
const db = (() => {
  let p = null;
  const openDb = () => p || (p = new Promise((res, rej) => {
    try {
      const r = indexedDB.open('dailypurr', 1);
      r.onupgradeneeded = () => { const d = r.result; d.createObjectStore('photos', { keyPath: 'id' }); d.createObjectStore('meows', { keyPath: 'cat' }); d.createObjectStore('avatars', { keyPath: 'cat' }); };
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    } catch (e) { rej(e); }
  }));
  const run = (name, mode, fn) => openDb().then(d => new Promise((res, rej) => {
    const t = d.transaction(name, mode), req = fn(t.objectStore(name));
    t.oncomplete = () => res(req && req.result); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
  }));
  return { all: n => run(n, 'readonly', s => s.getAll()), put: (n, v) => run(n, 'readwrite', s => s.put(v)), del: (n, k) => run(n, 'readwrite', s => s.delete(k)) };
})();
const ORIGINAL = {}; IDS.forEach(i => { ORIGINAL[i] = CATS[i].photo; });
const customAvatar = {}, meowURL = {};
function loadAvatars() {
  return db.all('avatars').then(list => {
    IDS.forEach(i => { if (customAvatar[i]) URL.revokeObjectURL(customAvatar[i]); delete customAvatar[i]; CATS[i].photo = ORIGINAL[i]; });
    (list || []).forEach(a => { customAvatar[a.cat] = URL.createObjectURL(a.blob); CATS[a.cat].photo = customAvatar[a.cat]; });
    renderCats(); showEntry('none');
  }).catch(() => {});
}
function loadMeows() {
  return db.all('meows').then(list => {
    IDS.forEach(i => { if (meowURL[i]) URL.revokeObjectURL(meowURL[i]); delete meowURL[i]; });
    (list || []).forEach(m => { meowURL[m.cat] = URL.createObjectURL(m.blob); });
  }).catch(() => {});
}
async function shrink(blob, max, square) {
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImg(url);
    let sw = img.naturalWidth, sh = img.naturalHeight, sx = 0, sy = 0;
    if (square) { const s = Math.min(sw, sh); sx = (sw - s) / 2; sy = (sh - s) / 2; sw = sh = s; }
    const k = Math.min(1, max / Math.max(sw, sh)), c = document.createElement('canvas');
    c.width = Math.round(sw * k); c.height = Math.round(sh * k);
    c.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height);
    return await new Promise(r => c.toBlob(r, 'image/jpeg', 0.86));
  } finally { URL.revokeObjectURL(url); }
}
let albumCat = 'angus', albumURLs = [];
$('#albumBtn').onclick = () => { albumCat = selected; renderAlbum(); open('m-album'); };
async function renderAlbum() {
  $('#albumTabs').innerHTML = IDS.map(i => `<button class="chip" type="button" data-t="${i}" aria-pressed="${albumCat === i}" style="--c:${CATS[i].color}">${CATS[i].name}</button>`).join('');
  $$('#albumTabs [data-t]').forEach(b => b.onclick = () => { albumCat = b.dataset.t; renderAlbum(); });
  const c = albumCat, name = CATS[c].name;
  $('#addLbl').textContent = `Add photos of ${name}`;
  $('#meowName').textContent = `${name}’s meow`;
  $('#meowStatus').textContent = recState && recState.cat === c ? 'Recording… tap Stop when done' : meowURL[c] ? `Saved. ${name} uses it when given a fuss.` : `Record a real meow or purr, up to 8 seconds, and ${name} will use it when given a fuss.`;
  $('#recBtn').textContent = recState && recState.cat === c ? '■ Stop' : meowURL[c] ? '● Re-record' : '● Record';
  $('#recBtn').classList.toggle('on', !!(recState && recState.cat === c));
  $('#playMeow').hidden = $('#delMeow').hidden = !meowURL[c];
  $('#resetAvatar').hidden = !customAvatar[c];
  albumURLs.forEach(u => URL.revokeObjectURL(u)); albumURLs = [];
  let photos = [];
  try { photos = (await db.all('photos')).filter(p => p.cat === c).sort((a, b) => b.id - a.id); } catch (e) { $('#albumGrid').innerHTML = '<p class="empty">Photos can’t be saved in this browser.</p>'; return; }
  $('#albumGrid').innerHTML = photos.length ? photos.map(p => { const u = URL.createObjectURL(p.blob); albumURLs.push(u); return `<button type="button" class="thumb" data-p="${p.id}"><img src="${u}" alt="Photo of ${name}"></button>`; }).join('')
    : `<p class="empty">No photos of ${name} yet.</p>`;
  $$('#albumGrid [data-p]').forEach(b => b.onclick = () => openViewer(photos.find(p => p.id === +b.dataset.p), b.querySelector('img').src));
}
$('#addPhotos').onchange = async e => {
  const files = [...e.target.files]; e.target.value = '';
  if (!files.length) return;
  toast(files.length === 1 ? 'Adding photo…' : `Adding ${files.length} photos…`);
  let ok = 0;
  for (const f of files) { try { const blob = await shrink(f, 1400); if (blob) { await db.put('photos', { id: Date.now() + ok, cat: albumCat, blob }); ok++; } } catch (err) {} }
  toast(ok ? `Added ${ok} ${ok === 1 ? 'photo' : 'photos'}` : 'That photo couldn’t be added');
  renderAlbum();
};
let viewing = null;
function openViewer(p, src) { viewing = p; $('#viewImg').src = src; $('#viewer').hidden = false; }
$('#viewClose').onclick = () => { $('#viewer').hidden = true; viewing = null; };
$('#viewAvatar').onclick = async () => {
  if (!viewing) return;
  try { const blob = await shrink(viewing.blob, 512, true); await db.put('avatars', { cat: viewing.cat, blob }); await loadAvatars(); toast(`New profile photo for ${CATS[viewing.cat].name}`); } catch (e) { toast('That didn’t work, sorry'); }
  $('#viewer').hidden = true; renderAlbum();
};
$('#viewDelete').onclick = async () => {
  if (!viewing) return;
  try { await db.del('photos', viewing.id); toast('Photo deleted'); } catch (e) {}
  $('#viewer').hidden = true; renderAlbum();
};
$('#resetAvatar').onclick = async () => { try { await db.del('avatars', albumCat); await loadAvatars(); toast(`${CATS[albumCat].name} is back to the original photo`); } catch (e) {} renderAlbum(); };
// Meow recorder
let recState = null;
$('#recBtn').onclick = async () => {
  if (recState) { stopRec(); return; }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) { toast('Recording isn’t supported on this phone'); return; }
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { toast('Microphone access was blocked'); return; }
  const type = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find(t => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
  const mr = new MediaRecorder(stream, type ? { mimeType: type } : undefined), chunks = [], cat = albumCat;
  mr.ondataavailable = ev => { if (ev.data && ev.data.size) chunks.push(ev.data); };
  mr.onstop = async () => {
    stream.getTracks().forEach(t => t.stop());
    const blob = new Blob(chunks, { type: mr.mimeType || type || 'audio/mp4' });
    recState = null;
    if (blob.size < 800) { toast('That was too short. Try again?'); renderAlbum(); return; }
    try { await db.put('meows', { cat, blob }); await loadMeows(); toast(`Saved ${CATS[cat].name}’s meow`); } catch (e) { toast('That couldn’t be saved'); }
    renderAlbum();
  };
  mr.start(); recState = { mr, cat, timer: setTimeout(stopRec, 8000) };
  renderAlbum();
};
function stopRec() { if (!recState) return; clearTimeout(recState.timer); try { recState.mr.stop(); } catch (e) { recState = null; } }
$('#playMeow').onclick = () => { if (meowURL[albumCat]) new Audio(meowURL[albumCat]).play().catch(() => {}); };
$('#delMeow').onclick = async () => { try { await db.del('meows', albumCat); await loadMeows(); toast('Recording deleted'); } catch (e) {} renderAlbum(); };

/* ---------- Sound: her recordings, a file in the cats folder, or a synthesised purr and chirp ---------- */
let actx = null;
const ac = () => { if (!actx) { const A = window.AudioContext || window.webkitAudioContext; if (A) actx = new A(); } if (actx && actx.state === 'suspended') actx.resume(); return actx; };
const recordings = {};
IDS.forEach(id => fetch(`cats/${id}-meow.m4a`, { method: 'HEAD' }).then(r => { if (r.ok) recordings[id] = `cats/${id}-meow.m4a`; }).catch(() => {}));
function sound(kind, id) {
  if (!store.get('dp_sound', true)) return;
  if (kind === 'purr' && (meowURL[id] || recordings[id])) { new Audio(meowURL[id] || recordings[id]).play().catch(() => {}); return; }
  const c = ac(); if (!c) return;
  const t = c.currentTime;
  if (kind === 'purr') {
    const dur = 1.8, buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate), d = buf.getChannelData(0);
    let last = 0; for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; } // soft brown noise
    const src = c.createBufferSource(); src.buffer = buf;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = { angus: 260, leo: 360, ollie: 420 }[id] || 360;
    const g = c.createGain(); g.gain.value = 0;
    const lfo = c.createOscillator(); lfo.frequency.value = { angus: 23, leo: 27, ollie: 29 }[id] || 26;
    const lg = c.createGain(); lg.gain.value = 0.32;
    lfo.connect(lg).connect(g.gain);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.42, t + 0.25); g.gain.setValueAtTime(0.42, t + dur - 0.5); g.gain.linearRampToValueAtTime(0, t + dur);
    src.connect(lp).connect(g).connect(c.destination);
    src.start(t); lfo.start(t); src.stop(t + dur); lfo.stop(t + dur);
  } else {
    // A little "mrrp": a quick rising chirp
    const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
    const base = id === 'angus' ? 330 : id === 'leo' ? 520 : 640;
    o.type = 'triangle'; o.frequency.setValueAtTime(base, t); o.frequency.exponentialRampToValueAtTime(base * 1.7, t + 0.09); o.frequency.exponentialRampToValueAtTime(base * 1.25, t + 0.22);
    f.type = 'bandpass'; f.frequency.value = base * 2; f.Q.value = 1.2;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.16, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
    o.connect(f).connect(g).connect(c.destination); o.start(t); o.stop(t + 0.3);
  }
}

/* ---------- Reading aloud ----------
   Everything is queued in one go, each line in the right cat's voice, so nothing can be read twice. */
const synth = window.speechSynthesis;
let voice = null, speakGen = 0, listening = false;
function pickVoice() {
  if (!synth) return;
  const vs = synth.getVoices();
  voice = vs.find(v => /en-GB/i.test(v.lang) && /Daniel|Arthur|Serena|Kate|Oliver|Martha/i.test(v.name)) || vs.find(v => /en-GB/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
}
if (synth) { pickVoice(); synth.onvoiceschanged = pickVoice; }
const forSpeech = s => String(s).replace(/\*[^*]*\*/g, ' ').replace(/\([^)]*\)/g, ' ').replace(/\p{Extended_Pictographic}/gu, ' ')
  .replace(/—/g, ', ').replace(/\b([A-Z]{2,})\b/g, w => w.toLowerCase()).replace(/\s+/g, ' ').trim();
function speakLines(lines, done) {
  if (!synth) { toast('This phone can’t read aloud'); if (done) done(); return; }
  const gen = ++speakGen;
  if (synth.speaking || synth.pending) synth.cancel();
  const list = lines.map(l => ({ cat: l.cat, text: forSpeech(l.text) })).filter(l => l.text);
  let finished = false;
  const finish = () => { if (finished || gen !== speakGen) return; finished = true; if (done) done(); };
  if (!list.length) { finish(); return; }
  list.forEach((l, i) => {
    const u = new SpeechSynthesisUtterance(l.text), v = CATS[l.cat].voice;
    if (voice) u.voice = voice; u.lang = (voice && voice.lang) || 'en-GB';
    u.pitch = v.pitch; u.rate = v.rate;
    if (i === list.length - 1) { u.onend = finish; u.onerror = finish; }
    synth.speak(u);
  });
}
function speak() {
  if (!shown) return;
  setListening(true);
  const s = shown, c = s.cat, lines = [];
  if (special && !s.k && hist.list.findIndex(e => e.c === c) === hist.pos) lines.push({ cat: c, text: special.line(c) });
  lines.push({ cat: c, text: s.intro }, { cat: c, text: s.fact }, { cat: c, text: s.quip }, { cat: c, text: s.outro.replace(/^— ?/, '') });
  if (s.cameo) lines.push({ cat: s.cameo.by, text: s.cameo.t });
  speakLines(lines, () => setListening(false));
}
function setListening(on) { listening = on; $('#listenBtn').classList.toggle('on', on); $('#listenBtn span').textContent = on ? 'Stop' : 'Listen'; }
function stopSpeaking() { speakGen++; if (synth && (synth.speaking || synth.pending)) synth.cancel(); setListening(false); }
$('#listenBtn').onclick = () => { if (listening) stopSpeaking(); else speak(); };

/* ---------- Share card ---------- */
let shareFile = null, shareGen = 0;
const loadImg = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
function wrap(g, text, maxW) { const out = []; let line = ''; for (const w of String(text).split(/\s+/)) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }
async function prepareShare() {
  const gen = ++shareGen, s = shown; shareFile = null;
  try {
    if (document.fonts && document.fonts.load) await Promise.race([Promise.all(['800 64px "Baloo 2"', '800 46px Nunito', 'italic 34px "Libre Baskerville"', '600 34px Nunito'].map(f => document.fonts.load(f))), new Promise(r => setTimeout(r, 1500))]).catch(() => {});
    const W = 1080, H = 1600, Pd = 80, c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    const col = { angus: '#1f6f7f', leo: '#e39a1f', ollie: '#e46d93' }[s.cat];
    g.fillStyle = '#e9f1f0'; g.fillRect(0, 0, W, H);
    g.fillStyle = col; g.globalAlpha = 0.14; g.beginPath(); g.arc(W * 0.85, 120, 360, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
    const img = await loadImg(s.photo);
    const R = 150, cx = Pd + R, cy = 110 + R;
    g.fillStyle = col; g.beginPath(); g.arc(cx, cy, R + 14, 0, Math.PI * 2); g.fill();
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.clip(); g.drawImage(img, cx - R, cy - R, R * 2, R * 2); g.restore();
    g.fillStyle = '#14313a'; g.font = '800 76px "Baloo 2", Nunito, sans-serif'; g.fillText(CATS[s.cat].name, cx + R + 46, cy - 6);
    g.fillStyle = '#5b7177'; g.font = '700 32px Nunito, sans-serif'; g.fillText('The Daily Purr', cx + R + 48, cy + 44);
    const bx = Pd - 10, by = cy + R + 60, bw = W - (Pd - 10) * 2;
    g.font = '800 50px Nunito, sans-serif'; const factLines = wrap(g, s.fact, bw - 100);
    const quipFont = s.cat === 'angus' ? 'italic 36px "Libre Baskerville", Georgia, serif' : (s.cat === 'leo' ? 'italic 600 38px Nunito, sans-serif' : '600 38px Nunito, sans-serif');
    g.font = quipFont; const quipLines = wrap(g, s.quip, bw - 100);
    const bh = 80 + 60 + factLines.length * 64 + 30 + quipLines.length * 50 + 60;
    g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect(bx, by, bw, bh, 44); g.fill();
    g.fillStyle = col; g.beginPath(); g.roundRect(bx, by, bw, 12, [44, 44, 0, 0]); g.fill();
    g.beginPath(); g.moveTo(cx - 26, by + 2); g.lineTo(cx, by - 30); g.lineTo(cx + 26, by + 2); g.fill();
    let y = by + 86;
    g.fillStyle = col; g.font = s.cat === 'ollie' ? '800 40px "Baloo 2", sans-serif' : (s.cat === 'angus' ? 'italic 34px "Libre Baskerville", Georgia, serif' : '700 36px Nunito, sans-serif');
    g.fillText(s.cat === 'ollie' ? s.intro.toUpperCase() : s.intro, bx + 50, y); y += 70;
    g.fillStyle = '#14313a'; g.font = '800 50px Nunito, sans-serif'; factLines.forEach(l => { g.fillText(l, bx + 50, y); y += 64; });
    y += 22; g.fillStyle = '#3a5560'; g.font = quipFont;
    quipLines.forEach(l => { g.fillText(l, bx + 50, y); y += 50; });
    const fh = Math.max(W, by + bh + 130);
    g.fillStyle = '#5b7177'; g.font = '700 30px Nunito, sans-serif'; g.textAlign = 'center'; g.fillText('🐾  a fact a day from Angus, Leo & Ollie', W / 2, fh - 50);
    const out = document.createElement('canvas'); out.width = W; out.height = fh;
    const og = out.getContext('2d'); og.fillStyle = '#e9f1f0'; og.fillRect(0, 0, W, fh); og.drawImage(c, 0, 0);
    const blob = await new Promise(r => out.toBlob(r, 'image/png'));
    if (gen === shareGen && blob) shareFile = new File([blob], `daily-purr-${s.cat}.png`, { type: 'image/png' });
  } catch (e) { /* the share button falls back to text */ }
}
$('#shareBtn').onclick = () => {
  const text = `${CATS[shown.cat].name} says: ${shown.fact} ${shown.quip}`;
  const data = shareFile ? { files: [shareFile], title: 'The Daily Purr' } : { title: 'The Daily Purr', text };
  if (navigator.canShare && navigator.canShare(data)) { navigator.share(data).catch(() => {}); return; }
  if (navigator.share) { navigator.share({ title: 'The Daily Purr', text }).catch(() => {}); return; }
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => toast('Copied the fact'), () => toast('Sharing isn’t available here'));
};

/* ---------- Settings ---------- */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function renderDates() {
  const sp = store.get('dp_special', {});
  $('#spDates').innerHTML = SPECIAL_FIELDS.map(([k, label]) => { const v = sp[k] || {}; return `<div class="date-row" data-k="${k}"><span>${label}</span>
      <select data-p="d" aria-label="${label}: day"><option value="">Day</option>${Array.from({ length: 31 }, (_, i) => `<option ${+v.d === i + 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}</select>
      <select data-p="m" aria-label="${label}: month"><option value="">Month</option>${MONTHS.map((m, i) => `<option value="${i + 1}" ${+v.m === i + 1 ? 'selected' : ''}>${m}</option>`).join('')}</select>
      <input data-p="y" inputmode="numeric" maxlength="4" placeholder="Year" aria-label="${label}: year (optional)" value="${v.y ? esc(v.y) : ''}"></div>`; }).join('');
  $$('#spDates .date-row').forEach(row => row.querySelectorAll('select,input').forEach(inp => inp.onchange = () => {
    const all = store.get('dp_special', {}), get = p => row.querySelector(`[data-p="${p}"]`).value.trim();
    const d = get('d'), m = get('m'), y = get('y').replace(/\D/g, '');
    if (d && m) all[row.dataset.k] = { d: +d, m: +m, y: y ? +y : null }; else delete all[row.dataset.k];
    store.set('dp_special', all);
    special = specialFor(day); header(); renderCats(); renderSpecial();
  }));
}
$('#setBtn').onclick = () => {
  $('#sName').value = store.get('dp_name', ''); $('#sAuto').checked = store.get('dp_auto', false); $('#sSound').checked = store.get('dp_sound', true);
  $('#voiceTest').innerHTML = IDS.map(id => `<button class="pill" type="button" data-v="${id}" style="--c:${CATS[id].color}">${CATS[id].name}</button>`).join('');
  $$('#voiceTest [data-v]').forEach(b => b.onclick = () => {
    const id = b.dataset.v;
    speakLines([{ cat: id, text: { angus: 'Good evening. I am Angus, the eldest. I will be supervising.', leo: 'hi. I’m Leo. is it safe? ok. hi.', ollie: 'HELLO I’M OLLIE AND I HAVE FANGS' }[id] }]);
  });
  renderDates();
  open('m-set');
};
$('#sName').onchange = () => { store.set('dp_name', $('#sName').value.trim()); special = specialFor(day); header(); renderSpecial(); };
$('#sAuto').onchange = () => store.set('dp_auto', $('#sAuto').checked);
$('#sSound').onchange = () => store.set('dp_sound', $('#sSound').checked);

/* ---------- Sheets & toast ---------- */
function open(id) { $('#' + id).hidden = false; }
function close(id) { $('#' + id).hidden = true; if (id === 'm-album') stopRec(); }
$$('.modal').forEach(m => m.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(m.id); }));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!$('#viewer').hidden) $('#viewer').hidden = true; else $$('.modal').forEach(m => close(m.id)); } });
let toastT;
function toast(t) { const el = $('#toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, Math.min(5000, 1800 + t.length * 35)); }

/* ---------- Start ---------- */
header(); renderCats(); showEntry(); compBadge(); quizBadge();
loadAvatars(); loadMeows();
if (special && special.confetti && store.get('dp_party', null) !== day) {
  store.set('dp_party', day);
  setTimeout(() => { const r = $('#special').getBoundingClientRect(); hearts(innerWidth / 2, r.top + 20, 14, ['🎉', '🎂', '🧡', '✨', '🎈']); }, 500);
}
// Employee of the Month announcement, once at the start of each month
(() => { const w = lastMonthWinner(), key = monthStart(day); if (w && store.get('dp_eotm_seen', null) !== key) { store.set('dp_eotm_seen', key); setTimeout(() => toast(`🏆 ${CATS[w.id].name} is ${w.month}’s Employee of the Month!`), 1200); } })();
// Come back tomorrow (or leave it open past midnight) and there's a new set of facts
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && today() !== day) location.reload(); });
window.DailyPurr = { compose, dailyFact, catOfDay, ORDER, specialFor, dayNum, dateOf, moodOf, scores, jealousy, hist: () => hist, factIdx };
})();
