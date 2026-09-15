// @title  Faultline Protocol
// @by     Codex (for Dan Essig)
// @tempo  174 bpm
// @notes  Evolving drum and bass / dubstep: a long pressure build, fake-out, and crunchy two-part drops

// Amen chops and a few extra classic breaks live in Dirt-Samples.
samples('github:tidalcycles/dirt-samples')

setcpm(174 / 4)

// Core two-step drums. Small cycle-level changes keep the backbone human without
// moving the snare away from beats two and four.
const drums = stack(
  s("bd ~ ~ [~ bd] ~ ~ bd ~ ~ ~ [bd ~] ~ ~ ~ ~ ~, ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~")
    .bank("RolandTR909")
    .gain("<.96 .9 1 .92>"),
  s("hh*16")
    .bank("RolandTR909")
    .gain("[.16 .38 .2 .52]*4")
    .hpf(5200)
    .degradeBy(0.08)
    .sometimesBy(0.12, x => x.speed("<1 1.5 2>")),
  s("~ ~ ~ oh ~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ [oh ~]")
    .bank("RolandTR909")
    .gain(0.23)
)

// The drops open into a half-time pocket: one big backbeat, fewer hats, and
// enough empty space for the bass movement to read clearly.
const dropDrums = stack(
  s("bd ~ ~ [~ bd] ~ ~ ~ ~ sd ~ ~ ~ ~ ~ [bd ~] ~")
    .bank("RolandTR909")
    .gain("<.9 .84 .94 .86>"),
  s("hh*8")
    .bank("RolandTR909")
    .hpf(5600)
    .gain("[.12 .28 .15 .34]*2")
    .degradeBy(0.14),
  s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ [lt mt] ht")
    .bank("RolandTR909")
    .gain(0.3)
    .someCyclesBy(0.22, x => x.fast(2))
)

// The second drop keeps the DnB momentum instead of revisiting the first drop's
// half-time pocket. The backbeat is familiar, but the kicks lean forward.
const dropDrumsB = stack(
  s("bd ~ ~ [bd ~] ~ ~ bd ~ ~ ~ bd ~ ~ [~ bd] ~ ~, ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~")
    .bank("RolandTR909")
    .gain("<.86 .92 .84 .95>"),
  s("hh*16")
    .bank("RolandTR909")
    .hpf(5400)
    .gain("[.12 .3 .16 .38]*4")
    .degradeBy(0.1),
  s("~ ~ ~ oh ~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ [oh ~]")
    .bank("RolandTR909")
    .gain(0.17)
)

// The imported break is kept above the kick and sub. Its alternating slice maps
// make every pair of bars answer differently, with occasional restrained stutters.
const amen = s("amencutup*8")
  .n("<[0 1 2 3 4 5 6 7] [8 1 10 3 12 5 [14 15] 7] [0 9 2 11 4 13 6 15]>")
  .hpf(420)
  .gain("<.38 .5 .42 .56>")
  .room(0.1)
  .sometimesBy(0.09, x => x.speed(2))

// Every tonal part follows the same Dm - Bb - Gm - Am progression twice across
// eight cycles. Variations change the rhythm and voicing, never the harmony.
const sub = note("<d1 bb0 g0 a0 [d1 a0] bb0 [g0 d1] a0>")
  .s("sine")
  .attack(0.008)
  .release(0.22)
  .gain(0.64)

// These rounded wobble phrases aim for an early-2010s remix sound: warm detuned
// saws, animated low-pass movement, and only a trace of bit reduction. The sub
// carries the impact; the mids provide texture instead of abrasive loudness.
const wobbleA = note("<d2 [bb1 ~] g1 [a1 ~] [d2 a1] bb1 [g1 d2] [a1 c2]>")
  .s("sawtooth")
  .jux(x => x.add(note(0.07)))
  .lpf(sine.range(340, 1250).fast("<2 4 3 4>"))
  .lpq(4)
  .shape(0.24)
  .crush("<12 10 14 11>")
  .attack(0.018)
  .release(0.28)
  .gain(0.32)

const wobbleB = note("<[d2 ~] [bb1 f2] [g1 ~] [a1 e2] [d2 f2] [bb1 ~] [g1 d2] [a1 ~]>")
  .s("sawtooth")
  .jux(x => x.add(note(-0.06)))
  .lpf(sine.range(300, 1450).fast("<3 2 4 3>"))
  .lpq(5)
  .shape(0.28)
  .crush("<11 13 10 14>")
  .attack(0.012)
  .release(0.24)
  .gain(0.28)
  .someCyclesBy(0.1, x => x.rev())

const pad = n("<[0,2,4,6] [5,7,9,11] [3,5,7,9] [4,6,8,10]>")
  .scale("D3:minor")
  .s("supersaw")
  .attack(0.45)
  .release(1.7)
  .lpf(sine.range(480, 2300).slow(13))
  .gain(saw.range(0.06, 0.24).fast(4))
  .room(0.7)
  .orbit(2)

// A single recurring hook replaces the earlier competing arpeggios. Its notes are
// chord tones, so it can pass through intros, builds, and drops as connective tissue.
const signal = note("<[a4 d5] [f5 d5] [d5 bb4] [e5 c5] [f5 a5] [d5 bb4] [bb4 d5] [c5 e5]>")
  .s("square")
  .decay(0.07)
  .sustain(0)
  .lpf(sine.range(900, 4300).slow(11))
  .delay(0.35)
  .delaytime("<0.125 0.1875 0.25>")
  .delayfeedback(0.45)
  .pan(sine.slow(3))
  .gain("<.12 .2 .15 .23>")
  .sometimesBy(0.1, x => x.add(note(12)))

const intro = stack(
  pad.lpf(sine.range(350, 1250).slow(8)).gain(0.17),
  signal.degradeBy(0.42).gain(0.11),
  amen.slow(2).lpf(1150).hpf(620).gain(0.055).room(0.4),
  s("~ ~ ~ ~ rim ~ ~ ~").bank("RolandTR909").room(0.8).gain(0.16)
)

const lift = stack(
  pad,
  signal,
  s("bd ~ ~ ~ ~ ~ bd ~, ~ ~ ~ ~ sd ~ ~ ~").bank("RolandTR909").gain(0.62),
  s("hh*8").bank("RolandTR909").hpf(6000).gain(saw.range(0.08, 0.34).slow(8)),
  sub.lpf(240).gain(0.4)
)

// Keep the lift's eighth-note hat clock and fade in only the missing offbeats.
// Both builds begin at the same phase of this five-cycle gain shape.
const buildDrums = stack(
  s("bd ~ ~ [~ bd] ~ ~ bd ~ ~ ~ [bd ~] ~ ~ ~ ~ ~, ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~")
    .bank("RolandTR909")
    .gain(0.78),
  s("hh*8")
    .bank("RolandTR909")
    .hpf(5400)
    .gain("[.15 .34]*4"),
  s("[~ hh]*8")
    .bank("RolandTR909")
    .hpf(5700)
    .gain("<.22 .02 .05 .1 .16>")
    .degradeBy(0.12)
)

const buildOne = stack(
  buildDrums,
  pad.lpf(saw.range(500, 3200).slow(4)),
  signal.gain(saw.range(0.1, 0.3).slow(4)),
  sub.lpf(260).gain(saw.range(0.28, 0.46).slow(4)),
  note("d5").s("sawtooth").lpf(saw.range(300, 5200).slow(4)).gain(saw.range(0.02, 0.2).slow(4))
)

const buildTwo = stack(
  drums,
  amen.gain(saw.range(0.24, 0.44).slow(3)),
  pad.lpf(saw.range(900, 2800).slow(3)).gain(0.1),
  signal.gain(0.12),
  sub.lpf(300).gain(0.42),
  note("d5").s("sawtooth").lpf(saw.range(500, 5200).slow(3)).shape(saw.range(0.08, 0.28).slow(3)).gain(saw.range(0.05, 0.16).slow(3)),
  s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ [lt ~] [mt ht]")
    .bank("RolandTR909")
    .gain(saw.range(0.12, 0.38).slow(3))
)

// Drop one lands directly from the established groove. Its second phrase answers
// with a different wobble and kick accent instead of simply getting louder.
const dropA = stack(
  dropDrums,
  amen.gain(0.24),
  sub,
  wobbleA,
  pad.lpf(1050).gain(0.065),
  signal.gain(0.075)
)

const dropAAnswer = stack(
  dropDrums,
  amen.n("<[0 9 2 11 4 13 6 15] [8 1 10 3 12 5 14 7]>").gain(0.18),
  sub,
  wobbleB,
  wobbleA.gain(0.14),
  pad.lpf(1150).gain(0.07),
  signal.degradeBy(0.28).gain(0.07)
)

// Drop two begins with the bass exposed for one cycle—an arrival rather than an
// empty fake-out—then opens into a quicker DnB response with a distinct bass phrase.
const bassReveal = stack(
  sub.gain(0.7),
  wobbleB.lpf(sine.range(280, 1050).fast(2)).gain(0.3),
  pad.lpf(850).gain(0.075),
  signal.degradeBy(0.5).gain(0.06)
)

const dropB = stack(
  dropDrumsB,
  amen.gain(0.25),
  sub,
  wobbleB,
  pad.lpf(1250).gain(0.065),
  signal.gain(0.07)
)

const dropBAnswer = stack(
  dropDrumsB,
  amen.n("<[8 9 2 3 12 13 6 7] [0 1 10 11 4 5 14 15]>").gain(0.22),
  sub,
  wobbleA.gain(0.22),
  wobbleB.gain(0.2),
  pad.lpf(1350).gain(0.07),
  signal.degradeBy(0.18).gain(0.075)
)

const breakdown = stack(
  pad.lpf(sine.range(280, 1500).slow(8)).gain(0.2),
  signal.degradeBy(0.35).gain(0.13),
  amen.slow(2).lpf(1050).hpf(620).gain(0.05).room(0.45),
  note("<d2 bb1 g1 a1 d2 bb1 g1 a1>").s("triangle").lpf(500).release(0.6).gain(0.34),
  s("~ rim ~ ~ ~ ~ rim [~ rim]").bank("RolandTR909").room(0.85).gain(0.14)
)

// 96 cycles before returning to the intro. Within that arc, odd-length filter
// motion (11 and 13 cycles) and probability-based fills do not reset with the bars,
// so successive passes never line up in quite the same way.
$: arrange(
  [8, intro],
  [8, lift],
  [5, buildOne],
  [3, buildTwo],
  [12, dropA],
  [12, dropAAnswer],
  [8, breakdown],
  [5, buildOne],
  [3, buildTwo],
  [1, bassReveal],
  [7, dropB],
  [8, dropBAnswer],
  [8, dropB],
  [8, dropBAnswer]
)._pianoroll()
