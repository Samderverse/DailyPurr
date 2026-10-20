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

/* ---------- Seeded randomness, so each day's facts stay the same all day ---------- */
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hash = s => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
const today = () => { const d = new Date(); return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 864e5); };
// One fixed shuffle of every fact; each day the three cats take the next three
const ORDER = (() => { const r = rng(hash('daily-purr')), a = FACTS.map((_, i) => i); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; })();
const dailyFact = (cat, day) => ORDER[(day * 3 + IDS.indexOf(cat)) % ORDER.length];
const catOfDay = day => IDS[hash('cat' + day) % 3];

/* ---------- What the cat says ---------- */
function compose(cat, factIdx, seedStr) {
  const r = rng(hash(seedStr)), pick = a => a[Math.floor(r() * a.length)];
  const c = CATS[cat], f = FACTS[factIdx];
  const quips = c.quips[f.tag] || c.quips.misc;
  const cameoOptions = P.CAMEOS.filter(x => x.after === cat);
  const cameo = r() < 0.38 && cameoOptions.length ? pick(cameoOptions) : null;
  return { cat, factIdx, intro: pick(c.intro), fact: f.t, quip: pick(quips), outro: pick(c.outro), cameo, photo: (c.alt && c.alt[f.tag]) || c.photo };
}

/* ---------- State ---------- */
const day = today();
let extras = store.get('dp_extras', {}); // "another" facts already shown today
if (extras.day !== day) extras = { day, n: {} };
let selected = catOfDay(day);
let shown = null;

/* ---------- Header ---------- */
function header() {
  const d = new Date();
  $('#dateLine').textContent = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const h = d.getHours(), name = store.get('dp_name', '').trim();
  const part = h < 5 ? 'Up late' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  $('#greet').textContent = `${part}${name ? ', ' + name : ''}! Today’s cat is ${CATS[catOfDay(day)].name}.`;
  // Visit streak
  let s = store.get('dp_streak', { last: null, n: 0 });
  if (s.last !== day) { s = { last: day, n: s.last === day - 1 ? s.n + 1 : 1 }; store.set('dp_streak', s); }
  $('#streak').hidden = s.n < 2;
  $('#streak').textContent = `🔥 ${s.n} days`;
}

/* ---------- The cats row ---------- */
function renderCats() {
  const cod = catOfDay(day);
  $('#cats').innerHTML = IDS.map(id => `<button class="cat" type="button" role="tab" data-id="${id}" aria-selected="${id === selected}" style="--c:${CATS[id].color}">
      ${id === cod ? '<span class="today">today</span>' : ''}
      <span class="face"><img src="${CATS[id].photo}" alt="${CATS[id].name}" data-id="${id}"></span><span class="nm">${CATS[id].name}</span></button>`).join('');
  $$('#cats .cat').forEach(b => b.onclick = e => tapCat(b.dataset.id, e));
}
function tapCat(id, e) {
  if (id === selected) { pet(id, e); return; }
  selected = id; stopSpeaking();
  $$('#cats .cat').forEach(b => b.setAttribute('aria-selected', b.dataset.id === id));
  sound('chirp', id);
  showFact();
  if (store.get('dp_auto', false)) speak();
}

/* ---------- The bubble ---------- */
function currentFactIdx(cat) {
  const k = extras.n[cat] || 0;
  if (!k) return dailyFact(cat, day);
  // Extra facts: walk through the shuffle from a different starting point, skipping today's main ones
  const mains = new Set(IDS.map(c => dailyFact(c, day)));
  let pos = (day * 7 + IDS.indexOf(cat) * 41 + k * 13) % ORDER.length;
  while (mains.has(ORDER[pos])) pos = (pos + 1) % ORDER.length;
  return ORDER[pos];
}
function showFact() {
  const idx = currentFactIdx(selected);
  shown = compose(selected, idx, `${day}|${selected}|${idx}|${extras.n[selected] || 0}`);
  document.documentElement.style.setProperty('--cat', CATS[selected].color);
  const b = $('#bubble');
  b.dataset.cat = selected; b.classList.remove('swap'); void b.offsetWidth; b.classList.add('swap');
  b.style.setProperty('--tail', `${(IDS.indexOf(selected) * 2 + 1) / 6 * 100}%`);
  $('#intro').textContent = shown.intro; $('#fact').textContent = shown.fact; $('#quip').textContent = shown.quip; $('#outro').textContent = shown.outro;
  // Mood photo for some topics (Leo's worried face, Ollie's fangs, Angus in his box)
  const img = $(`#cats img[data-id="${selected}"]`); if (img) img.src = shown.photo;
  IDS.filter(i => i !== selected).forEach(i => { const im = $(`#cats img[data-id="${i}"]`); if (im) im.src = CATS[i].photo; });
  if (shown.cameo) {
    $('#cameo').hidden = false; $('#cameoImg').src = CATS[shown.cameo.by].photo; $('#cameoImg').alt = CATS[shown.cameo.by].name;
    $('#cameoText').innerHTML = `<b>${esc(CATS[shown.cameo.by].name)}:</b> ${esc(shown.cameo.t)}`;
  } else $('#cameo').hidden = true;
  updateSave(); prepareShare();
}
$('#anotherBtn').onclick = () => {
  stopSpeaking();
  extras.n[selected] = (extras.n[selected] || 0) + 1; store.set('dp_extras', extras);
  sound('chirp', selected); showFact();
  if (store.get('dp_auto', false)) speak();
};

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
  else { f.unshift({ i: shown.factIdx, cat: shown.cat, quip: shown.quip, t: Date.now() }); hearts(e.clientX, e.clientY, 5); toast(`Saved to favourites`); }
  store.set('dp_favs', f); updateSave();
};
$('#favBtn').onclick = () => { renderFavs(); open('m-fav'); };
function renderFavs() {
  const f = favs();
  $('#favList').innerHTML = f.length ? f.map((x, k) => `<div class="fav" style="--c:${CATS[x.cat].color}"><img src="${CATS[x.cat].photo}" alt="${CATS[x.cat].name}"><p>${esc(FACTS[x.i] ? FACTS[x.i].t : '')}<small>${esc(CATS[x.cat].name)}: ${esc(x.quip || '')}</small></p><button type="button" data-k="${k}" aria-label="Remove">×</button></div>`).join('')
    : '<p class="empty">No favourites yet. Tap ♥ Save on a fact you like.</p>';
  $$('#favList [data-k]').forEach(b => b.onclick = () => { const a = favs(); a.splice(+b.dataset.k, 1); store.set('dp_favs', a); renderFavs(); updateSave(); });
}

/* ---------- Complaints Department ---------- */
const COMPS = P.COMPLAINTS;
const CORDER = (() => { const r = rng(hash('complaints')), a = COMPS.map((_, i) => i); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; })();
const complaintFor = d => COMPS[CORDER[((d % CORDER.length) + CORDER.length) % CORDER.length]];
const nameOf = id => (id === 'management' ? 'Management' : CATS[id].name);
const photoOf = id => (id === 'management' ? null : CATS[id].photo);
function compBadge() { $('#compNew').hidden = store.get('dp_cseen', null) === day; }
$('#compBtn').onclick = () => { store.set('dp_cseen', day); compBadge(); renderComplaints(); open('m-comp'); };
function renderComplaints() {
  const rulings = store.get('dp_rulings', {});
  const days = Array.from({ length: 14 }, (_, k) => day - k);
  // Tally: who's been complained about most in the last fortnight
  const count = {}; days.forEach(d => { const c = complaintFor(d); count[c.against] = (count[c.against] || 0) + 1; });
  const top = IDS.slice().sort((a, b) => (count[b] || 0) - (count[a] || 0))[0];
  const sorry = days.filter(d => rulings[d] === 'apologise').length;
  $('#tally').innerHTML = `<div><b>${CATS[top].name} (${count[top] || 0})</b><span>most complained about this fortnight</span></div><div><b>${count.management || 0}</b><span>complaints against Management${sorry ? ` · ${sorry} ${sorry === 1 ? 'apology' : 'apologies'}` : ''}</span></div>`;
  $('#compList').innerHTML = days.map(d => {
    const c = complaintFor(d), r = rulings[d], mg = c.against === 'management';
    const when = d === day ? 'Today' : d === day - 1 ? 'Yesterday' : (() => { const t = new Date(); t.setDate(t.getDate() - (day - d)); return t.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); })();
    const imgs = [photoOf(c.from), photoOf(c.against)].filter(Boolean).map(p => `<img src="${p}" alt="">`).join('');
    let ruling;
    if (r) {
      const pool = P.RULINGS[r], speaker = r === 'upheld' ? c.against : c.from;
      const line = pool[speaker] ? pool[speaker][hash(d + r) % pool[speaker].length] : '';
      const label = { upheld: 'Upheld', dismissed: 'Dismissed', apologise: 'Apology issued', deny: 'Denied' }[r];
      ruling = `<span class="stamp${r === 'dismissed' || r === 'deny' ? '' : ' green'}">${label}</span>${line ? `<p class="react"><b>${esc(nameOf(speaker))}:</b> ${esc(line)}</p>` : ''}`;
    } else {
      const btns = mg ? `<button class="up" type="button" data-d="${d}" data-r="apologise">Apologise</button><button type="button" data-d="${d}" data-r="deny">Deny everything</button>`
                      : `<button class="up" type="button" data-d="${d}" data-r="upheld">Uphold</button><button type="button" data-d="${d}" data-r="dismissed">Dismiss</button>`;
      ruling = `<div class="ruling">${btns}${d !== day ? `<span class="status">${esc(P.PENDING[hash('p' + d) % P.PENDING.length])}</span>` : ''}</div>`;
    }
    return `<article class="complaint" style="--c:${CATS[c.from].color}">
      <header><span>Complaint No. ${String(d % 10000).padStart(4, '0')}</span>${d === day ? '<span class="newtag">New today</span>' : `<span>${esc(when)}</span>`}</header>
      <div class="parties"><span class="duo">${imgs}</span><span class="who">${esc(nameOf(c.from))}<i>v</i>${esc(nameOf(c.against))}</span><span class="type">${esc(c.type)}</span></div>
      <p class="ctext">“${esc(c.t)}”</p>
      ${c.reply ? `<p class="creply"><b>${esc(nameOf(c.against))} responds:</b> ${esc(c.reply)}</p>` : ''}
      ${ruling}</article>`;
  }).join('');
  $$('#compList [data-r]').forEach(b => b.onclick = () => {
    const all = store.get('dp_rulings', {}); all[b.dataset.d] = b.dataset.r; store.set('dp_rulings', all);
    const c = complaintFor(+b.dataset.d);
    sound(b.dataset.r === 'upheld' || b.dataset.r === 'deny' ? 'chirp' : 'purr', c.from === 'management' ? 'angus' : c.from);
    renderComplaints();
  });
}

/* ---------- Meet the cats ---------- */
$('#meetBtn').onclick = () => {
  $('#meetList').innerHTML = IDS.map(id => `<div class="meet" style="--c:${CATS[id].color}"><img src="${CATS[id].photo}" alt="${CATS[id].name}"><div><h3>${CATS[id].name}</h3><p class="role">${esc(CATS[id].role)}</p><p>${esc(CATS[id].bio)}</p></div></div>`).join('');
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
  if (alt) { const before = img.src; img.src = alt; setTimeout(() => { if (selected !== id || !shown || shown.photo !== alt) img.src = selected === id && shown ? shown.photo : CATS[id].photo; }, 1400); }
  sound(id === 'ollie' ? 'chirp' : 'purr', id);
  if (id === 'leo' && Math.random() < 0.4) toast('Leo flinched, then decided he liked it');
}
function hearts(x, y, n) {
  const e = ['🧡', '❤️', '🐾', '💛'];
  for (let i = 0; i < n; i++) {
    const h = document.createElement('span'); h.className = 'heart'; h.textContent = e[i % e.length];
    h.style.left = (x - 11 + (Math.random() * 30 - 15)) + 'px'; h.style.top = (y - 11) + 'px';
    h.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px'); h.style.animationDelay = (i * 0.08) + 's';
    document.body.appendChild(h); setTimeout(() => h.remove(), 1600);
  }
}

/* ---------- Sound: synthesised purrs and chirps, or real recordings if added ---------- */
let actx = null;
const ac = () => { if (!actx) { const A = window.AudioContext || window.webkitAudioContext; if (A) actx = new A(); } if (actx && actx.state === 'suspended') actx.resume(); return actx; };
const recordings = {};
// Optional: drop cats/angus-meow.m4a (or leo-, ollie-) into the repo and that cat uses it when petted
IDS.forEach(id => fetch(`cats/${id}-meow.m4a`, { method: 'HEAD' }).then(r => { if (r.ok) recordings[id] = `cats/${id}-meow.m4a`; }).catch(() => {}));
function sound(kind, id) {
  if (!store.get('dp_sound', true)) return;
  if (kind === 'purr' && recordings[id]) { const a = new Audio(recordings[id]); a.play().catch(() => {}); return; }
  const c = ac(); if (!c) return;
  const t = c.currentTime;
  if (kind === 'purr') {
    const dur = 1.8, buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate), d = buf.getChannelData(0);
    let last = 0; for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; } // soft brown noise
    const src = c.createBufferSource(); src.buffer = buf;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = id === 'angus' ? 260 : 360;
    const g = c.createGain(); g.gain.value = 0;
    const lfo = c.createOscillator(); lfo.frequency.value = id === 'angus' ? 23 : 27;
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

/* ---------- Reading aloud, a different voice for each cat ---------- */
const synth = window.speechSynthesis;
let voice = null;
function pickVoice() {
  if (!synth) return;
  const vs = synth.getVoices();
  voice = vs.find(v => /en-GB/i.test(v.lang) && /Daniel|Arthur|Serena|Kate|Oliver|Martha/i.test(v.name)) || vs.find(v => /en-GB/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
}
if (synth) { pickVoice(); synth.onvoiceschanged = pickVoice; }
const forSpeech = s => String(s).replace(/\*[^*]*\*/g, ' ').replace(/\([^)]*\)/g, ' ').replace(/\p{Extended_Pictographic}/gu, ' ')
  .replace(/—/g, ', ').replace(/\b([A-Z]{2,})\b/g, w => w.toLowerCase()).replace(/\s+/g, ' ').trim();
function speakText(cat, parts, done) {
  if (!synth) { toast('This phone can’t read aloud'); return; }
  synth.cancel();
  const v = CATS[cat].voice, list = parts.map(forSpeech).filter(Boolean);
  list.forEach((p, i) => {
    const u = new SpeechSynthesisUtterance(p);
    if (voice) u.voice = voice; u.lang = (voice && voice.lang) || 'en-GB';
    u.pitch = v.pitch; u.rate = v.rate;
    if (i === list.length - 1) u.onend = u.onerror = () => done && done();
    synth.speak(u);
  });
}
function speak() {
  if (!shown) return;
  setListening(true);
  const parts = [shown.intro, shown.fact, shown.quip, shown.outro.replace(/^— ?/, '')];
  speakText(shown.cat, parts, () => {
    if (shown.cameo && listening) speakText(shown.cameo.by, [shown.cameo.t], () => setListening(false));
    else setListening(false);
  });
}
let listening = false;
function setListening(on) { listening = on; $('#listenBtn').classList.toggle('on', on); $('#listenBtn span').textContent = on ? 'Stop' : 'Listen'; }
function stopSpeaking() { if (synth) synth.cancel(); setListening(false); }
$('#listenBtn').onclick = () => { if (listening) stopSpeaking(); else speak(); };

/* ---------- Share card ---------- */
let shareFile = null, shareGen = 0;
const loadImg = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
function wrap(g, text, maxW) { const out = []; let line = ''; for (const w of String(text).split(/\s+/)) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }
async function prepareShare() {
  const gen = ++shareGen, s = shown; shareFile = null;
  try {
    if (document.fonts && document.fonts.load) await Promise.race([Promise.all(['800 64px "Baloo 2"', '800 46px Nunito', 'italic 34px "Libre Baskerville"', '600 34px Nunito'].map(f => document.fonts.load(f))), new Promise(r => setTimeout(r, 1500))]).catch(() => {});
    const W = 1080, H = 1600, P = 80, c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    const col = { angus: '#1f6f7f', leo: '#e39a1f', ollie: '#e46d93' }[s.cat];
    g.fillStyle = '#e9f1f0'; g.fillRect(0, 0, W, H);
    g.fillStyle = col; g.globalAlpha = 0.14; g.beginPath(); g.arc(W * 0.85, 120, 360, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
    const img = await loadImg(s.photo);
    const R = 150, cx = P + R, cy = 110 + R;
    g.fillStyle = col; g.beginPath(); g.arc(cx, cy, R + 14, 0, Math.PI * 2); g.fill();
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.clip(); g.drawImage(img, cx - R, cy - R, R * 2, R * 2); g.restore();
    g.fillStyle = '#14313a'; g.font = '800 76px "Baloo 2", Nunito, sans-serif'; g.fillText(CATS[s.cat].name, cx + R + 46, cy - 6);
    g.fillStyle = '#5b7177'; g.font = '700 32px Nunito, sans-serif'; g.fillText('The Daily Purr', cx + R + 48, cy + 44);
    // Bubble
    const bx = P - 10, by = cy + R + 60, bw = W - (P - 10) * 2;
    g.font = '800 50px Nunito, sans-serif'; const factLines = wrap(g, s.fact, bw - 100);
    g.font = s.cat === 'angus' ? 'italic 36px "Libre Baskerville", Georgia, serif' : (s.cat === 'leo' ? 'italic 600 38px Nunito, sans-serif' : '600 38px Nunito, sans-serif');
    const quipLines = wrap(g, s.quip, bw - 100);
    const bh = 80 + 60 + factLines.length * 64 + 30 + quipLines.length * 50 + 60;
    g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect(bx, by, bw, bh, 44); g.fill();
    g.fillStyle = col; g.beginPath(); g.roundRect(bx, by, bw, 12, [44, 44, 0, 0]); g.fill();
    g.beginPath(); g.moveTo(cx - 26, by + 2); g.lineTo(cx, by - 30); g.lineTo(cx + 26, by + 2); g.fill();
    let y = by + 86;
    g.fillStyle = col; g.font = s.cat === 'ollie' ? '800 40px "Baloo 2", sans-serif' : (s.cat === 'angus' ? 'italic 34px "Libre Baskerville", Georgia, serif' : '700 36px Nunito, sans-serif');
    g.fillText(s.cat === 'ollie' ? s.intro.toUpperCase() : s.intro, bx + 50, y); y += 70;
    g.fillStyle = '#14313a'; g.font = '800 50px Nunito, sans-serif'; factLines.forEach(l => { g.fillText(l, bx + 50, y); y += 64; });
    y += 22; g.fillStyle = '#3a5560';
    g.font = s.cat === 'angus' ? 'italic 36px "Libre Baskerville", Georgia, serif' : (s.cat === 'leo' ? 'italic 600 38px Nunito, sans-serif' : '600 38px Nunito, sans-serif');
    quipLines.forEach(l => { g.fillText(l, bx + 50, y); y += 50; });
    // Footer just under the bubble, then trim the card to fit (never shorter than square)
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
$('#setBtn').onclick = () => {
  $('#sName').value = store.get('dp_name', ''); $('#sAuto').checked = store.get('dp_auto', false); $('#sSound').checked = store.get('dp_sound', true);
  $('#voiceTest').innerHTML = IDS.map(id => `<button class="pill" type="button" data-v="${id}" style="--c:${CATS[id].color}">${CATS[id].name}</button>`).join('');
  $$('#voiceTest [data-v]').forEach(b => b.onclick = () => {
    const id = b.dataset.v;
    speakText(id, [{ angus: 'Good evening. I am Angus, the eldest. I will be supervising.', leo: 'hi. I’m Leo. is it safe? ok. hi.', ollie: 'HELLO I’M OLLIE AND I HAVE FANGS' }[id]]);
  });
  open('m-set');
};
$('#sName').onchange = () => { store.set('dp_name', $('#sName').value.trim()); header(); };
$('#sAuto').onchange = () => store.set('dp_auto', $('#sAuto').checked);
$('#sSound').onchange = () => store.set('dp_sound', $('#sSound').checked);

/* ---------- Sheets & toast ---------- */
function open(id) { $('#' + id).hidden = false; }
function close(id) { $('#' + id).hidden = true; }
$$('.modal').forEach(m => m.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(m.id); }));
document.addEventListener('keydown', e => { if (e.key === 'Escape') $$('.modal').forEach(m => close(m.id)); });
let toastT;
function toast(t) { const el = $('#toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, 2200); }

/* ---------- Start ---------- */
header(); renderCats(); showFact(); compBadge();
// Come back tomorrow (or leave it open past midnight) and there's a new set of facts
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && today() !== day) location.reload(); });
window.DailyPurr = { compose, dailyFact, catOfDay, ORDER };
})();
