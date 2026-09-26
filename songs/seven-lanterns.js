// SEVEN LANTERNS
// 140 BPM melodic psy-trance. A minor, lifting to B minor for the last drop. 136 bars, 3:53.
//
// A seven-note figure is played in sixteenths against a sixteen-step bar, so its accents
// drift one step per bar and only realign every seven bars. That figure (the lanterns) runs
// under everything. Over it sits a syncopated hook: teased on celesta in the intro, driven by
// the lead in the drops, slowed to half speed in the breakdown. A second theme of straight
// quarter notes is sung in the breakdown, then takes over the last drop, a whole step higher.
//
//   intro 16 | build 16 | drop 32 | breakdown and build 24 | drop in B minor 32 | outro 16

setcpm(140 / 4)

// ── tonal helpers ────────────────────────────────────────────────────────────
const MINOR = [0, 2, 3, 5, 7, 8, 10]
// scale degree -> midi note. `raise` lifts the 7th degree a semitone (harmonic minor colour).
const deg = (d, tonic, raise = '') => {
  const k = ((d % 7) + 7) % 7
  return tonic + MINOR[k] + 12 * Math.floor(d / 7) + (raise && k === 6 ? 1 : 0)
}
const cyc = (list) => mini('<' + list.join(' ') + '>')
const rows = (len, f) => cyc(Array.from({ length: len }, (_, b) => '[' + f(b) + ']'))
const grid = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join(' ')
// 1 for bars inside any [from, to) range, else 0, for masking a layer
const on = (len, ...ranges) => cyc(Array.from({ length: len }, (_, b) => (ranges.some(([a, z]) => b >= a && b < z) ? 1 : 0)))
// one-off content at chosen bars: plan(16, { 15: 'sd*16' })
const plan = (len, map) => cyc(Array.from({ length: len }, (_, b) => '[' + (map[b] ?? '~') + ']'))
// degree text ('~' rest, '_' hold, trailing h raises the 7th) -> midi text
const midi = (txt, tonic, shift = 0) =>
  txt.trim().split(/\s+/).map((t) => {
    const m = /^(-?\d+)(h?)$/.exec(t)
    return m ? deg(+m[1] + shift, tonic, m[2]) : t
  }).join(' ')
const line = (bars, len, tonic, shift = 0) => rows(len, (b) => midi(bars[b % bars.length], tonic, shift))

// chord roots (degrees) one per bar: Am F C G | Am F Dm G. 'h' = raised 7th, so 4h is E major.
const PROG = ['0', '-2', '2', '-1', '0', '-2', '3', '-1']
const chordAt = (prog, b, tonic, offsets) => {
  const m = /^(-?\d+)(h?)$/.exec(prog[b % prog.length])
  return offsets.map((o) => deg(+m[1] + o, tonic, m[2]))
}
const rootDeg = (prog, b) => +/^-?\d+/.exec(prog[b % prog.length])[0]
const ARP_TONES = [0, 2, 4, 7, 9]
const PAD_TONES = [0, 4, 7, 9, 11]

// ── mix plumbing ─────────────────────────────────────────────────────────────
// orbits: 1 drums, 2 bass, 3 pads / keys / fx, 4 lead and lanterns (sharing one delay)
const duck = (p) =>
  p.duckorbit("2:3:4").duckdepth("0.85:0.8:0.4").duckattack("0.14:0.3:0.18")
const BAR = 60 / 140 * 4
const prime = s("sine*3").note(48).gain(0).orbit("2 3 4")

// ── drums ────────────────────────────────────────────────────────────────────
const kick = (len, sub, msk, kb = () => 'bd bd bd bd', cut) => {
  const lp = (p) => (cut ? p.lpf(cut) : p)
  return stack(
    duck(lp(s(rows(len, kb)).bank("RolandTR909").n(1).clip(0.4).gain(0.5).orbit(1))),
    lp(note(rows(len, (b) => kb(b).replace(/bd/g, sub))).s("sine").penv(12).pdecay(0.06).decay(0.24).sustain(0).gain(0.3).orbit(1)),
  ).mask(msk)
}
// per-bar level multiplier: 1 until `from`, then falling linearly to `to` by the last bar
const taper = (len, from, to = 0) => rows(len, (b) => (b < from ? 1 : (1 - (1 - to) * (b - from + 1) / (len - from)).toFixed(2)))
// silences the last beat of bar `at`, the breath before a drop
const gap = (len, at) => rows(len, (b) => (b === at ? '1 1 1 0' : '1'))

const hats = (len, msk, lvl = 1) =>
  stack(
    s("[~ ~ oh ~]*4").bank("RolandTR909").gain(0.3 * lvl).clip(0.9).orbit(1),
    s("[~ hh ~ hh]*4").bank("RolandTR909").gain("[.16 .24]*8".mul(lvl)).orbit(1),
  ).mask(msk)

const clap = (msk, lvl = 1) => s("~ cp ~ cp").bank("RolandTR909").n(1).gain(0.55 * lvl).orbit(1).mask(msk)

const perc = (msk, lvl = 1) =>
  stack(
    s("~ ~ ~ rim ~ ~ rim ~ ~ ~ rim ~ ~ ~ rim ~").bank("RolandTR909").gain(0.3 * lvl).orbit(1),
    s("sh*8").bank("RolandTR808").gain("[.14 .08]*4".mul(lvl)).orbit(1),
  ).mask(msk)

// snare roll: density doubles bar by bar
const ROLLS = { 1: [16], 4: [4, 8, 16, 32], 5: [4, 4, 8, 16, 32] }
const roll = (len, from, n = 4) =>
  s(plan(len, Object.fromEntries(ROLLS[n].map((d, i) => [from + i, 'sd*' + d]))))
    .bank("RolandTR909").n(1).gain(saw.range(0.25, 0.85).slow(n).late(from)).orbit(1)

const crash = (len, at, lvl = 0.5) => s(plan(len, Object.fromEntries(at.map((b) => [b, 'cr'])))).bank("RolandTR909").gain(lvl).orbit(1)
const swell = (len, at) => s(plan(len, Object.fromEntries(at.map((b) => [b, 'cr'])))).bank("RolandTR909").speed(-1).gain(0.5).orbit(3)
const riser = (len, from, lvl = 0.6) =>
  s(mini('<~@' + from + ' white@' + (len - from) + '>')).attack((len - from) * BAR * 0.9).release(0.3).gain(lvl)
    .hpf(300).hpenv(5).hpattack((len - from) * BAR).orbit(3).room(0.3).roomsize(3.5)

// rising saw siren that lands on `pitch` when the drop arrives
const siren = (len, from, pitch, lvl = 0.14) =>
  note(mini('<~@' + from + ' ' + pitch + '@' + (len - from) + '>')).s("sawtooth").penv(24).pattack((len - from) * BAR)
    .attack((len - from) * BAR * 0.8).release(0.3).lpf(3200).hpf(300).gain(lvl).room(0.4).roomsize(3.5).orbit(3)
// low sine hit under a drop's downbeat
const boom = (len, at, pitch, lvl = 0.5) =>
  note(plan(len, Object.fromEntries(at.map((b) => [b, pitch])))).s("sine").penv(12).pdecay(0.25).decay(1.2).sustain(0).gain(lvl).room(0.3).roomsize(3.5).orbit(3)

// ── harmony ──────────────────────────────────────────────────────────────────
const CELL = [0, 1, 2, 3, 4, 3, 2]
const lantern = (len, tonic, prog, msk, { lvl = 0.4, oct = 0, cut = 2500 } = {}) => {
  const at = (b, i) => (16 * b + i) % 7
  const notes = rows(len, (b) => { const ch = chordAt(prog, b, tonic, ARP_TONES); return grid(16, (i) => (oct && i % 2 ? '~' : ch[CELL[at(b, i)]] + oct)) })
  const gains = rows(len, (b) => grid(16, (i) => (lvl * (at(b, i) === 0 ? 1 : CELL[at(b, i)] === 4 ? 0.8 : 0.55)).toFixed(3)))
  const pans = rows(len, (b) => grid(16, (i) => (0.2 + 0.15 * CELL[at(b, i)]).toFixed(2)))
  return note(notes).s("sawtooth").gain(gains).pan(pans)
    .attack(0.002).decay(0.15).sustain(0).release(0.05)
    .lpf(cut).lpq(3).lpenv(2.5).lpa(0.002).lpd(0.13)
    .delay(0.4).delaysync(3 / 16).delayfeedback(0.5).room(0.3).roomsize(2).orbit(4).mask(msk)
}

const pad = (len, tonic, prog, msk, lvl, cut = 2200) => {
  const tones = (b, side) => chordAt(prog, b, tonic, PAD_TONES).filter((_, i) => i % 2 === side).join(',')
  return stack(
    note(rows(len, (b) => tones(b, 0))).s("sawtooth").detune(8).pan(0.3),
    note(rows(len, (b) => tones(b, 1))).s("sawtooth").detune(-8).pan(0.7),
  ).attack(0.5).decay(0.5).sustain(0.8).release(1.2).lpf(cut).hpf(160).gain(lvl * 1.3)
    .room(0.4).roomsize(3.5).orbit(3).mask(msk)
}

const HOPS = [
  [[0, 0, 0], [0, 0, 12], [0, 0, 0], [0, 12, 0]],
  [[0, 0, 12], [0, 0, 0], [0, 12, 0], [12, 0, 12]],
]
const bass = (len, tonic, prog, follow, msk, cut, lvl = 0.75) => {
  const at = (b, i) => {
    const k = i & 3, base = deg(follow ? rootDeg(prog, b) : 0, tonic)
    if (k === 0) return '~'
    if ((b & 3) === 3 && i >> 2 === 3) return base + [12, 10, 7][k - 1]      // last beat of each fourth bar falls: octave, b7, fifth
    const hop = HOPS[b % 2][i >> 2][k - 1]
    return base + hop
  }
  return stack(
    note(rows(len, (b) => grid(16, (i) => at(b, i)))).s("sawtooth")
      .attack(0.003).decay(0.1).sustain(0.35).release(0.04).clip(0.9)
      .lpf(cut).lpq(6).lpenv(2).lpd(0.1).gain(lvl).orbit(2),
    note(rows(len, (b) => deg(follow ? rootDeg(prog, b) : 0, tonic))).s("sine").attack(0.01).sustain(1).release(0.05).clip(1)
      .gain(lvl * 0.65).orbit(2),
  ).mask(msk)
}

// ── keys: piano runs the lantern figure in eighths, choir and drone hold the harmony ──
const piano = (len, tonic, prog, msk, lvl) => {
  const at = (b, i) => (8 * b + i) % 7
  return stack(
    note(rows(len, (b) => { const ch = chordAt(prog, b, tonic, ARP_TONES); return grid(8, (i) => ch[CELL[at(b, i)]]) }))
      .s("piano").gain(rows(len, (b) => grid(8, (i) => (lvl * (at(b, i) === 0 ? 1 : 0.7)).toFixed(3)))),
    note(rows(len, (b) => deg(rootDeg(prog, b), tonic - 12))).s("piano").gain(lvl * 0.9),
  ).release(0.3).room(0.5).roomsize(3.5).orbit(3).mask(msk)
}
const choir = (len, tonic, prog, msk, lvl) =>
  note(rows(len, (b) => chordAt(prog, b, tonic, [0, 4, 7, 9]).join(','))).s("gm_choir_aahs")
    .attack(0.8).release(1.5).gain(lvl).room(0.5).roomsize(3.5).orbit(3).mask(msk)
const bell = (bars, len, tonic, msk, lvl, stretch = 1) =>
  note(line(bars, len, tonic)).slow(stretch).s("gm_celesta").gain(lvl).room(0.5).roomsize(3.5).orbit(3).mask(msk)
const voice = (bars, len, tonic, msk, lvl) =>
  note(line(bars, len, tonic)).s("gm_voice_oohs").attack(0.08).release(0.6).gain(lvl).room(0.5).roomsize(3.5).orbit(3).mask(msk)
const drone = (len, prog, msk, lvl) =>
  note(rows(len, (b) => deg(rootDeg(prog, b), 33))).s("sine").attack(0.3).release(0.6).gain(lvl).orbit(2).mask(msk)
// sub pulse for the last build: eighths, then sixteenths
const pulse = (len, prog, from, mid) =>
  note(rows(len, (b) => grid(b < mid ? 8 : 16, () => deg(rootDeg(prog, b), 33)))).s("sine").attack(0.003).decay(0.09).sustain(0.2)
    .release(0.03).gain(0.5).orbit(2).mask(on(len, [from, len]))

// ── lead: the hook ───────────────────────────────────────────────────────────
// degrees from A4 (0 = A4, 4 = E5, 7 = A5), sixteen steps per bar
const HOOK = [
  '4 _ _ 7 _ _ 9 _ 8 _ 7 _ _ _ 4 _',      // Am
  '5 _ _ 7 _ _ 9 _ 7 _ 5 _ _ _ 2 _',      // F
  '4 _ _ 6 _ _ 9 _ 8 _ 6 _ _ _ 4 _',      // C
  '6 _ _ 8 _ _ 10 _ 9 _ 8 _ _ _ 6 _',     // G
  '4 _ _ 7 _ _ 9 _ 11 _ 9 _ 8 _ 7 _',     // Am, climbs to E6
  '5 _ _ 7 _ _ 9 _ 10 _ 9 _ 7 _ 5 _',     // F
  '3 _ _ 5 _ _ 7 _ 9 _ 7 _ 5 _ 3 _',      // Dm
  '6 _ 8 _ 10 _ 8 _ 6 _ _ _ ~ ~ ~ ~',     // G, leaves room for a fill
]
// the hook for the end of the breakdown: last bar becomes E major (G# via 'h')
const HOOK_TURN = [HOOK[4], HOOK[5], HOOK[6], '8 _ _ _ 6h _ _ _ 4 _ _ _ 6h _ 8 _']

// theme B: straight quarter notes and a sighing contour against the hook's syncopation.
// Sung in the breakdown, then driven by the lead in the last drop.
const THEME = [
  '7 _ _ _ 9 _ _ _ 11 _ _ _ 9 _ 8 _',       // Am
  '10 _ _ _ 9 _ _ _ 7 _ _ _ 5 _ 7 _',       // F
  '9 _ _ _ 11 _ _ _ 13 _ _ _ 11 _ 10 _',    // C
  '10 _ _ _ 8 _ _ _ 6 _ _ _ 8 _ 10 _',      // G
  '11 _ _ _ 9 _ _ _ 11 _ _ _ 12 _ 11 _',    // Am
  '12 _ _ _ 10 _ _ _ 9 _ _ _ 7 _ 9 _',      // F
  '10 _ _ _ 12 _ _ _ 10 _ _ _ 9 _ 7 _',     // Dm
  '8 _ _ _ 10 _ _ _ 8 _ 6 _ 4 _ _ _',       // G
]

const lead = (len, tonic, bars, msk, { shift = 0, lvl = 0.4, cut = 4500, oct = 0, plain = 0 } = {}) => {
  const n = note(line(bars, len, tonic + oct, shift))
  const voice = plain ? n.s("sawtooth").detune(plain < 0.5 ? -10 : 10).pan(plain) : n.s("supersaw").unison(3).spread(0.7).detune(0.25)
  return voice.attack(0.005).decay(0.3).sustain(0.7).release(0.35).lpf(cut).hpf(220).gain(lvl)
    .delay(0.35).delaysync(3 / 16).delayfeedback(0.5).room(0.3).roomsize(2).orbit(4).mask(msk)
}

// ── sections ─────────────────────────────────────────────────────────────────
const A = 57, B = 59, A1 = 33, B1 = 35
const BRK = ['0', '0', '-2', '-2', '2', '2', '-1', '-1']                 // bars 0-7: two bars per chord under the slowed hook
  .concat(PROG)                                                        // bars 8-15: one per bar under theme B
  .concat(['0', '-2', '2', '-1', '0', '-2', '3', '4h'])                // bars 16-23: last bar is E major, the pivot into B minor
const BLD = BRK.slice(16)
const HOOK_BLD = HOOK.slice(0, 4).concat(HOOK_TURN)
const OUT = ['0', '-2', '2', '-1', '0', '-2', '3', '-1', '0', '-2', '2', '-1', '0', '-2', '3', '0']
const HOOK_OUT = [HOOK[0], HOOK[1], HOOK[6], '4 _ _ _ _ _ _ _ 7 _ _ _ _ _ _ _']
const fills = (len, at, kind = 'sd*16') => s(plan(len, Object.fromEntries(at.map((b) => [b, kind])))).bank("RolandTR909").n(1).gain(saw.range(0.3, 0.8)).orbit(1)

const intro = stack(
  prime.mask(on(16, [0, 1])),
  pad(16, A, PROG, on(16, [0, 16]), 0.3, saw.range(500, 2400).slow(16)),
  lantern(16, A, PROG, on(16, [0, 16]), { lvl: 1.2, cut: saw.range(500, 3200).slow(16) }),
  bell(HOOK, 16, 69, on(16, [8, 16]), 0.5),
  kick(16, A1, on(16, [8, 16]), undefined, saw.range(250, 9000).slow(8).late(8)),
  hats(16, on(16, [10, 16]), 0.8),
  clap(on(16, [14, 16]), 0.6),
  riser(16, 12, 0.5),
  roll(16, 15, 1),
  swell(16, [15]),
)

const build = stack(
  stack(
    pad(16, A, PROG, on(16, [0, 16]), 0.2, sine.range(1400, 2800).slow(8)),
    lantern(16, A, PROG, on(16, [0, 16]), { lvl: 1.35, cut: saw.range(1500, 4000).slow(16) }),
    lantern(16, A, PROG, on(16, [8, 16]), { lvl: 0.68, oct: 12, cut: 5000 }),
    kick(16, A1, on(16, [0, 16])),
    hats(16, on(16, [0, 16])),
    clap(on(16, [4, 16])),
    perc(on(16, [8, 16]), 0.8),
    bass(16, A1, PROG, false, on(16, [0, 12]), saw.range(200, 1100).slow(16)),
    lead(16, 69, HOOK, on(16, [8, 16]), { lvl: 0.45, cut: saw.range(1200, 6000).slow(8).late(8) }),
    roll(16, 12, 4),
  ).mask(gap(16, 15)),
  riser(16, 12, 0.6),
  siren(16, 12, 81),
  swell(16, [15]),
)

const drop1 = stack(
  pad(32, A, PROG, on(32, [0, 32]), 0.17, sine.range(1800, 3200).slow(16)),
  lantern(32, A, PROG, on(32, [0, 32]), { lvl: 1.35, cut: sine.range(2500, 5000).slow(16) }),
  lantern(32, A, PROG, on(32, [8, 16], [20, 32]), { lvl: 0.61, oct: 12, cut: 6000 }),
  kick(32, A1, on(32, [0, 32])),
  hats(32, on(32, [0, 32])),
  clap(on(32, [0, 32])),
  perc(on(32, [0, 32])),
  bass(32, A1, PROG, false, on(32, [0, 32]), sine.range(500, 1600).slow(8)),
  lead(32, 69, HOOK, on(32, [0, 16], [20, 32]), { lvl: 0.59 }),
  lead(32, 69, HOOK, on(32, [12, 16], [20, 32]), { lvl: 0.33, oct: -12, cut: 3000, plain: 0.3 }),
  lead(32, 69, HOOK, on(32, [24, 32]), { lvl: 0.39, shift: -2, cut: 3800, plain: 0.7 }),
  crash(32, [0, 16, 24]),
  boom(32, [0], A1),
  fills(32, [7, 23, 31]),
  fills(32, [15], 'lt*2 mt*2 ht*4 ht*8'),
)

const breakdown = stack(
  stack(
    piano(24, A, BRK, on(24, [0, 16]), 0.85),
    choir(24, A, BRK, on(24, [4, 16]), 0.5),
    bell(HOOK.slice(0, 4), 4, 69, on(24, [0, 8]), 0.9, 2),
    voice(THEME, 24, 57, on(24, [8, 16]), 0.7),
    bell(THEME, 24, 69, on(24, [8, 16]), 0.4),
    pad(24, A, BRK, on(24, [8, 16]), 0.24, sine.range(1200, 2600).slow(16)),
    drone(24, BRK, on(24, [8, 16]), 0.3),
    pad(24, A, BRK, on(24, [16, 24]), 0.24, saw.range(800, 3600).slow(8)),
    lantern(24, A, BRK, on(24, [16, 24]), { lvl: 1.2, oct: 12, cut: saw.range(2000, 6000).slow(8).late(16) }),
    bell(HOOK_BLD, 24, 69, on(24, [16, 24]), 0.7),
    pulse(24, BRK, 16, 20),
    kick(24, A1, on(24, [20, 24])),
    clap(on(24, [22, 24]), 0.7),
    roll(24, 18, 5),
  ).mask(gap(24, 23)),
  riser(24, 16, 0.6),
  siren(24, 20, 83),
  swell(24, [23]),
)

const drop2 = stack(
  pad(32, B, PROG, on(32, [0, 32]), 0.17, sine.range(1800, 3400).slow(16)),
  lantern(32, B, PROG, on(32, [0, 32]), { lvl: 1.35, cut: sine.range(2800, 5500).slow(16) }),
  lantern(32, B, PROG, on(32, [0, 32]), { lvl: 0.68, oct: 12, cut: 6500 }),
  kick(32, B1, on(32, [0, 32])),
  hats(32, on(32, [0, 32])),
  clap(on(32, [0, 32])),
  perc(on(32, [0, 32])),
  bass(32, B1, PROG, true, on(32, [0, 32]), sine.range(600, 1800).slow(8)),
  lead(32, 71, HOOK, on(32, [0, 16], [24, 32]), { lvl: 0.59 }),
  lead(32, 71, HOOK, on(32, [0, 16], [24, 32]), { lvl: 0.42, shift: -2, cut: 4000, plain: 0.3 }),
  lead(32, 71, HOOK, on(32, [24, 32]), { lvl: 0.4, oct: 12, cut: 6000, plain: 0.7 }),
  lead(32, 71, THEME, on(32, [16, 24]), { lvl: 0.6 }),
  lead(32, 71, THEME, on(32, [16, 24]), { lvl: 0.35, shift: -2, cut: 4000, plain: 0.3 }),
  lead(32, 71, THEME, on(32, [16, 24]), { lvl: 0.25, oct: -12, cut: 2500, plain: 0.5 }),
  crash(32, [0, 8, 16, 24]),
  boom(32, [0], B1),
  fills(32, [7, 23, 31]),
  fills(32, [15], 'lt*2 mt*2 ht*4 ht*8'),
)

const outro = stack(
  pad(16, B, OUT, on(16, [0, 16]), 0.25, sine.range(1500, 2600).slow(16)).postgain(taper(16, 12, 0.35)),
  lantern(16, B, OUT, on(16, [0, 16]), { lvl: 1.2, cut: saw.range(4500, 1200).slow(16) }).postgain(taper(16, 8, 0.2)),
  kick(16, B1, on(16, [0, 12])),
  hats(16, on(16, [0, 8]), 0.9),
  clap(on(16, [0, 4])),
  bass(16, B1, OUT, true, on(16, [0, 8]), saw.range(1400, 400).slow(8), 0.6),
  bell(HOOK_OUT, 16, 71, on(16, [12, 16]), 0.5),
)

arrange([16, intro], [16, build], [32, drop1], [24, breakdown], [32, drop2], [16, outro]).postgain(0.62)
