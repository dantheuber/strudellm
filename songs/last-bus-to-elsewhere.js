// LAST BUS TO ELSEWHERE
// 130 BPM UK garage / future garage in G minor. 112 bars, about 3:27.
// Intro > groove > drop 1 > breakdown > drop 2 > dub switch > final drop > outro.
// Orbits: 1 drums, 2 bass, 3 keys and pads, 4 lead, 5 fx, 6 piano and bells.

setcpm(130 / 4)

// ---------- harmony (MIDI numbers) ----------
// r = bass root, v = voicing (rootless, smooth voice leading)
const P1 = [
  { r: 43, v: [58, 62, 65, 69] }, // Gm9
  { r: 39, v: [55, 58, 62, 65] }, // Ebmaj9
  { r: 46, v: [62, 65, 69, 72] }, // Bbmaj9
  { r: 41, v: [57, 60, 64, 67] }, // Fmaj9
]
const P2 = [
  { r: 36, v: [55, 58, 62, 63] }, // Cm9
  { r: 39, v: [55, 58, 62, 65] }, // Ebmaj9
  { r: 43, v: [58, 62, 65, 69] }, // Gm9
  { r: 38, v: [60, 63, 66, 69] }, // D7b9
]
const P3 = [P1[0], P1[1], P2[0], P2[2]] // outro: lands home on Gm9

// ---------- helpers ----------
const mix = (...l) => stack(...l.filter(Boolean))
const bars8 = (P) => P.flatMap((c) => [c, c])
const cells = (str) => str.replace(/\s/g, '').split('')
const S16 = (str) => mini(cells(str).map((c) => (c === 'x' ? 'x' : '~')).join(' '))
const swung = (p) => p.swingBy(1 / 10, 8)
// only sound in the listed bars (0-based) of an 8 bar block
const gate = (pat, on) => pat.mask(mini('<' + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (on.includes(i) ? 1 : 0)).join(' ') + '>'))
// silence the last eighth note of the block so the next downbeat lands harder
const stopTime = (pat) => pat.mask(mini('<1 1 1 1 1 1 1 [1@7 0]>'))
const bar = (steps, len = 2) => {
  const hits = steps.map((n, i) => [n, i]).filter(([n]) => n !== '.')
  const out = hits.length && hits[0][1] > 0 ? ['~@' + hits[0][1]] : []
  hits.forEach(([n, i], k) => {
    const gap = (k + 1 < hits.length ? hits[k + 1][1] : 16) - i
    const l = Math.min(gap, len)
    out.push(n + '@' + l)
    if (gap > l) out.push('~@' + (gap - l))
  })
  return out.join(' ') || '~'
}
const rhy = (str, dict, len) => bar(cells(str).map((ch) => (dict[ch] === undefined ? '.' : String(dict[ch]))), len)
const perBar = (P, f) => cat(...bars8(P).map((c, i) => mini(f(c, i))))
const chordTok = (c) => '[' + c.v.join(',') + ']'

// ---------- drums ----------
const H16 = "0.85 0.3 0.55 0.3 0.85 0.3 0.55 0.35 0.85 0.3 0.55 0.3 0.85 0.3 0.6 0.45"
const KA = 'x... .... ..x. ....'
const KB = 'x... ..x. ..x. ....'
const KC = 'x... .... ..x. ..x.'
const duck = (p) => p.duckorbit("2:3").duckattack(0.14).duckdepth(0.5)

const D = (o = {}) => mix(
  o.k && duck(s("bd").bank("rolandtr909").struct(cat(...o.k.map(S16))).gain(o.kg ?? 0.8)).orbit(1),
  o.sn && s("sd").bank("emusp12").struct(S16(o.sn === 3 ? '.... .... x... ....' : '.... x... .... x...')).gain(0.75).room(0.15).roomsize(2).orbit(1),
  o.sn && s("cp").bank("rolandtr909").struct(S16(o.sn === 3 ? '.... .... x... ....' : o.sn === 2 ? '.... x... .... x...' : '.... .... .... x...')).gain(0.3).room(0.25).orbit(1),
  o.gh && swung(s("rim").bank("rolandtr909").struct(cat(S16('...x .... .x.. ..x.'), S16('.... ...x ..x. .x..'))).gain(0.28)).orbit(1),
  o.hh && swung(s("hh*16").bank("emusp12").gain(H16.mul(o.hh)).degradeBy(0.06).hpf(5000)).orbit(1),
  o.oh && swung(s("oh").bank("rolandtr909").struct(S16('.... ..x. .... ..x.')).clip(2).gain(0.6).hpf(4500)).orbit(1),
  o.perc && swung(s("lt").bank("linndrum").struct(cat(S16('...x .... .x.. ....'), S16('.... ..x. ...x .x..'))).gain(0.4).speed(1.2)).orbit(1),
  o.crash && s("cr").bank("rolandtr909").struct(S16('x...............')).mask("<1 0 0 0 0 0 0 0>").gain(0.4).orbit(5),
  o.fill && s("sd*16").bank("emusp12").gain(saw.range(0.12, 0.45)).mask("<0 0 0 0 0 0 0 1>").orbit(1),
)

// ---------- bass ----------
const BM = {
  A: 'r..r..o...r.....',
  B: 'r..r..o...r..f.o',
  C: 'r...............',
  D: 'r.......r.o.....',
}
const bassL = (P, mode, g = 1) => {
  const len = mode === 'C' ? 16 : mode === 'A' ? 3 : 2
  const sub = perBar(P, (c) => rhy(BM[mode], { r: c.r, o: c.r + 12, f: c.r + 7 }, len))
  const mid = perBar(P, (c) => rhy(BM[mode], { r: c.r + 12, o: c.r + 24, f: c.r + 19 }, len))
  return mix(
    note(sub).s("sine").attack(0.005).release(0.08).gain(0.85 * g).orbit(2),
    note(mid).s("sawtooth").lpf(650).lpenv(3).lpd(0.13).lps(0.15).lpq(3).attack(0.003).release(0.06).gain(0.22 * g).shape(0.2).orbit(2),
  )
}

// ---------- keys, pads ----------
const keysL = (P, spec, g = 1, len = 3, saw = 0) => {
  const line = perBar(P, (c, i) => rhy(spec[i % spec.length], { x: chordTok(c) }, len))
  return mix(
    swung(note(line).s("gm_epiano1").gain(0.55 * g).hpf(180).lpf(5000).room(0.35).roomsize(3).delay(0.3).delaytime(0.346).delayfeedback(0.4).orbit(3)),
    swung(note(line).s("sine").fm(1.6).fmh(2).fmdecay(0.25).fmsustain(0.1).attack(0.002).decay(0.5).sustain(0.05).release(0.3).gain(0.14 * g).hpf(200).orbit(3)),
    saw && swung(note(line).s("supersaw").unison(3).attack(0.005).decay(0.3).sustain(0.2).release(0.25).lpf(2600).lpenv(2).lpd(0.2).hpf(250)
      .gain(0.3 * saw).room(0.3).roomsize(3).orbit(3)),
  )
}
const padL = (P, lp = 1600, g = 1) => note(cat(...P.map((c) => mini(chordTok(c)))).slow(2))
  .s("supersaw").unison(3).attack(0.8).sustain(1).release(1.6)
  .lpf(lp).hpf(200).gain(0.32 * g).room(0.6).roomsize(5).orbit(3)

// ---------- leads ----------
const T = (str) => str.trim().split(/\s+/)
const L1 = [
  'd5 . . f5 . . g5 . . . a5 . g5 . . .',
  'f5 . . . d5 . . . . . f5 . . . . .',
  'g5 . . bb5 . . a5 . . . g5 . f5 . . .',
  'eb5 . . . g5 . . . d5 . . . . . . .',
  'f5 . . a5 . . c6 . . . bb5 . a5 . . .',
  'c6 . . . a5 . . . f5 . . . . . . .',
  'a5 . . c6 . . a5 . . . g5 . f5 . e5 .',
  'g5 . . . . . a5 . . . g5 . f5 . . .',
]
const L2 = [
  'g5 . . . . . bb5 . c6 . . . bb5 . g5 .',
  'bb5 . . . . . . . g5 . . . . . . .',
  'g5 . . . . . bb5 . d6 . . . c6 . bb5 .',
  'c6 . . . . . . . bb5 . . . . . . .',
  'd6 . . . . . f6 . d6 . . . c6 . bb5 .',
  'a5 . . . g5 . . . f5 . . . d5 . . .',
  'f#5 . . a5 . . c6 . eb6 . . . d6 . c6 .',
  'a5 . . . . . . . . . . . . . . .',
]
const lead1 = (g = 1, on = [0, 1, 2, 3, 4, 5, 6, 7]) => {
  const line = cat(...L1.map((b) => mini(bar(T(b), 3))))
  return gate(mix(
    note(line).s("sawtooth").detune(9).lpf(2400).lpenv(3).lpd(0.2).lps(0.1).attack(0.003).decay(0.25).sustain(0.25).release(0.25).gain(0.6 * g),
    note(line).s("sawtooth").detune(-9).lpf(2400).lpenv(3).lpd(0.2).lps(0.1).attack(0.003).decay(0.25).sustain(0.25).release(0.25).gain(0.6 * g),
    note(line).s("triangle").add(note(12)).attack(0.003).decay(0.2).sustain(0.1).release(0.2).gain(0.5 * g),
  ), on).delay(0.35).delaytime(0.346).delayfeedback(0.45).room(0.4).roomsize(3).orbit(4)
}
const lead2 = (g = 1, on = [0, 1, 2, 3, 4, 5, 6, 7]) => {
  const line = cat(...L2.map((b) => mini(bar(T(b), 8))))
  return gate(mix(
    note(line).s("sawtooth").detune(11).lpf(3600).attack(0.03).decay(0.2).sustain(0.75).release(0.5).vib(5).vibmod(0.25).gain(0.4 * g),
    note(line).s("sawtooth").detune(-11).lpf(3600).attack(0.03).decay(0.2).sustain(0.75).release(0.5).vib(5).vibmod(0.25).gain(0.4 * g),
  ), on).delay(0.3).delaytime(0.346).delayfeedback(0.4).room(0.5).roomsize(4).orbit(4)
}

// ---------- vocal-ish chops, piano arps, bells ----------
const VOX = ['..1. ..2. .... 3.1.', '..1. .... 2..3 ..1.']
const voxL = (P, g = 1) => {
  const line = perBar(P, (c, i) => rhy(VOX[i % 2], { 0: c.v[0] + 12, 1: c.v[1] + 12, 2: c.v[2] + 12, 3: c.v[3] + 12 }, 2))
  return swung(note(line).s("sawtooth").vowel("<a o a e>").attack(0.01).decay(0.12).sustain(0.4).release(0.25)
    .lpf(6500).gain(0.6 * g).room(0.5).roomsize(3).delay(0.3).delaytime(0.346).delayfeedback(0.45).orbit(4))
}
const ARP = { s: '0.1.2.3.2.1.3.2.', f: '0123 2123 0132 2312' }
const arpL = (P, mode = 's', g = 1) => {
  const line = perBar(P, (c) => rhy(ARP[mode], { 0: c.v[0] + 12, 1: c.v[1] + 12, 2: c.v[2] + 12, 3: c.v[3] + 12 }, 2))
  return swung(note(line).s("piano").gain(0.9 * g).lpf(6000).room(0.4).roomsize(3).delay(0.25).delaytime(0.23).delayfeedback(0.4).orbit(6))
}
const bellL = (P, g = 1) => {
  const line = perBar(P, (c) => rhy('...0 ..1. .2.. 3..2', { 0: c.v[3] + 24, 1: c.v[2] + 24, 2: c.v[3] + 24, 3: c.v[1] + 24 }, 2))
  return swung(note(line).s("sine").fm(3).fmh(3.5).fmdecay(0.15).fmsustain(0).attack(0.002).decay(0.4).sustain(0).release(0.3)
    .gain(0.5 * g).room(0.5).roomsize(3).delay(0.3).delaytime(0.346).delayfeedback(0.4).orbit(6))
}

// ---------- effects ----------
const revCrash = (g = 0.5) => s("cr").bank("rolandtr909").speed(-1).gain(g * 1.5).mask("<0 0 0 0 0 0 0 1>").orbit(5)
const riser = (g = 0.5) => s("white*32").attack(0.01).release(0.05).hpf(500)
  .lpf(saw.slow(2).range(700, 9000)).gain(saw.slow(2).range(0.1, 0.55).mul(g * 2.5))
  .mask("<0 0 0 0 0 0 1 1>").orbit(5)
const crackle = (g = 0.3) => s("crackle").density(0.5).gain(g * 4).hpf(500).orbit(5)

// ---------- arrangement ----------
// a near-silent bass note so orbit 2 exists before the first kick ducks it
const silentBass = note(43).s("sine").gain(0.001).orbit(2)

const KEY_SPARSE = ['x... .... .... ..x.', '.... .... x... ....']
const KEY_MID = ['x..x ..x. .... ..x.', 'x... .x.. ..x. ..x.']
const KEY_BUSY = ['x..x ..x. ..x. .x.x', 'x... .x.x ..x. ..x.']

arrange(
  // intro
  [8, mix(padL(P1, saw.range(500, 2200).slow(8)), keysL(P1, KEY_SPARSE, 0.8, 6), crackle(), silentBass, gate(voxL(P1, 0.7), [6, 7]), revCrash(0.5))],
  // groove
  [8, mix(D({ k: [KA, KA, KA, KB], sn: 1, hh: 0.8, gh: 1 }), bassL(P1, 'A'), keysL(P1, KEY_SPARSE), padL(P1, 1400), crackle(0.2))],
  [8, stopTime(mix(D({ k: [KA, KA, KB, KC], sn: 2, hh: 1, gh: 1, oh: 1, fill: 1 }), bassL(P1, 'B'), keysL(P1, KEY_MID), padL(P1, 1800), gate(voxL(P1, 0.8), [4, 5, 6, 7]), revCrash(0.4)))],
  // drop 1
  [8, mix(D({ k: [KB, KA, KB, KC], sn: 2, hh: 1, gh: 1, oh: 1, crash: 1 }), bassL(P1, 'B'), keysL(P1, KEY_MID), padL(P1, 2000), lead1(1), voxL(P1, 0.8))],
  [8, mix(D({ k: [KB, KA, KB, KC], sn: 2, hh: 1, gh: 1, oh: 1, perc: 1, fill: 1 }), bassL(P1, 'B'), keysL(P1, KEY_BUSY, 1, 3, 0.6), padL(P1, 2200, 1.2), lead1(1), bellL(P1), voxL(P1, 0.8), revCrash(0.4))],
  // breakdown
  [8, mix(padL(P1, 2400, 1.3), keysL(P1, KEY_SPARSE, 1, 8), arpL(P1, 's'), bassL(P1, 'C', 0.8), crackle(0.2), gate(voxL(P1, 0.6), [4, 5, 6, 7]), riser(0.4))],
  [8, stopTime(mix(gate(D({ k: [KA] }), [4, 5, 6, 7]), gate(D({ hh: 0.7, sn: 1 }), [2, 3, 4, 5, 6, 7]), D({ fill: 1 }), padL(P2, 2800, 1.3), keysL(P2, KEY_MID), arpL(P2, 'f'), gate(bassL(P2, 'C', 0.8), [4, 5, 6, 7]), lead2(0.7, [4, 5, 6, 7]), voxL(P2, 0.7), riser(0.5), revCrash(0.5)))],
  // drop 2
  [8, mix(D({ k: [KB, KA, KB, KC], sn: 2, hh: 1, gh: 1, oh: 1, perc: 1, crash: 1 }), bassL(P2, 'B'), keysL(P2, KEY_BUSY, 1, 3, 1), padL(P2, 2600, 1.3), lead2(1.2), arpL(P2, 's', 0.7))],
  [8, mix(D({ k: [KB, KA, KB, KC], sn: 2, hh: 1, gh: 1, oh: 1, perc: 1, fill: 1 }), bassL(P1, 'B'), keysL(P1, KEY_BUSY, 1, 3, 0.8), padL(P1, 2600, 1.2), lead1(1), bellL(P1), voxL(P1, 0.9), revCrash(0.4))],
  // dub switch
  [8, stopTime(mix(D({ k: ['x... .... .... ....', 'x... .... .... ....', 'x... .... .... ....', 'x... .... .... ..x.'], sn: 3, hh: 0.5 }), bassL(P1, 'C'), keysL(P1, KEY_SPARSE, 1, 6), padL(P1, 1200), gate(lead1(0.8), [4, 5]), voxL(P1, 0.7), riser(0.5), revCrash(0.5)))],
  // final drop
  [8, mix(D({ k: [KB, KA, KB, KC], sn: 2, hh: 1, gh: 1, oh: 1, perc: 1, crash: 1 }), bassL(P2, 'B'), keysL(P2, KEY_BUSY, 1, 3, 1.3), padL(P2, 3000, 1.4), lead2(1.3), bellL(P2, 0.8), arpL(P2, 's', 0.7), voxL(P2, 0.8))],
  [8, mix(D({ k: [KB, KA, KB, KC], sn: 2, hh: 1, gh: 1, oh: 1, perc: 1, fill: 1 }), bassL(P1, 'B'), keysL(P1, KEY_BUSY, 1, 3, 1.3), padL(P1, 3000, 1.4), lead1(1.1), lead2(0.6), bellL(P1), arpL(P1, 'f', 0.7), voxL(P1, 0.9), revCrash(0.4))],
  // outro
  [8, mix(D({ k: [KA], sn: 1, hh: 0.7, gh: 1 }), bassL(P1, 'D'), keysL(P1, KEY_MID), padL(P1, 1800), lead1(0.8, [0, 1, 2, 3]), gate(voxL(P1, 0.7), [4, 5, 6, 7]))],
  [8, mix(padL(P3, 1500, 1.2), keysL(P3, KEY_SPARSE, 1, 8), arpL(P3, 's', 0.8), gate(bassL(P3, 'C', 0.7), [0, 1, 2, 3, 4, 5, 6, 7]), crackle(0.2))],
)
.postgain(0.46)
