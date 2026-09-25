// @title  Night Current
// @by     DeepSeek V4 Flash - High
// @tempo  168 bpm
// @notes  Atmospheric liquid DnB for background focus: rolling two-step, distant amen
//         chops, a crunchy wobble bass, airy pads. 126 bars / 3:00 per loop.
//         Paste the whole file into strudel.cc and play.

samples('github:tidalcycles/dirt-samples')
setcpm(168 / 4)

// One cycle = one 4/4 bar. Harmony and every modulation share one 6-bar loop, so
// all sections land on the changes and the arrangement returns in phase. No
// randomness, no manual mutes. Am9 -> Fmaj9 -> E9, two bars per chord; the E9
// resolves straight back to Am9, so the loop seam pulls, never jumps.
const roots = note("<a1 f1 e1>/2")
const bassRhythm = "<[x ~ ~ x ~ ~ x ~ x ~ x ~ ~ ~ x ~] [x ~ ~ x ~ x ~ x ~ ~ x ~ x ~ [x x] ~]>"
const acidRhythm = "x ~ x ~ ~ x ~ x ~ ~ x ~ x ~ [x x] x"

const kick = s("<[bd ~ ~ ~ ~ ~ [~ bd] ~ ~ ~ bd ~ ~ ~ ~ ~] [bd ~ ~ [~ bd] ~ ~ bd ~ ~ ~ bd ~ ~ ~ [~ bd]]>")
  .bank("RolandTR909").gain(0.86)
  .duckorbit("2:3").duckattack(0.16).duckdepth("0.7:0.8")

const snare = s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~")
  .bank("RolandTR909").gain(0.8)

const hats = s("hh*16").bank("RolandTR909")
  .gain("[.12 .26 .17 .34]*4").hpf(5600)
  .pan("[.42 .58]*8")

const ghosts = s("~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~ sd ~ ~ ~ [~ sd]")
  .bank("RolandTR909").gain(".12 .18 .1 .16").hpf(900)

const drums = stack(kick, snare, hats, ghosts,
  s("~ oh ~ ~ ~ oh ~ ~").bank("RolandTR909").gain(0.19).hpf(4200)
)

// Distant amen chops, one bar per bracket. Six bars, so the break stays in phase
// with the harmony and the arrangement never goes out of sync.
const amen = n(`<
  [0 1 2 3 4 5 6 7] [0 1 2 3 12 5 6 7]
  [0 9 2 3 4 5 14 7] [0 1 2 3 4 5 [14 15] 7]
  [0 1 [2 2] 3 12 5 6 7] [8 1 10 3 12 5 6 7]
>`).s("amencutup")
  .hpf(650).lpf(8500).gain(0.23).cut(1)

const subVoice = roots.s("sine")
  .attack(0.006).release(0.09).clip(0.92).gain(0.52).orbit(2)
const sub = subVoice.struct(bassRhythm)

// The crunch: detuned saw pair an octave up from the sub, a wobbling low-pass, and
// heavier shape plus bit reduction than the other tracks here. The sub carries the
// weight; the saws carry the grit.
const reese = roots.add(note(12)).struct(bassRhythm).s("sawtooth")
  .jux(x => x.add(note(0.08)))
  .attack(0.009).decay(0.15).sustain(0.55).release(0.09)
  .hpf(120).lpf("<600 900 1300 700 950 1500 800 1200>")
  .lpenv(3).lpq(3).shape(0.3).crush("<9 11 10 8>")
  .gain(0.24).orbit(2)

// Octave/fifth stabs that answer the reese in the fullest section.
const acid = roots.add(note("[12 12 19 24]*4"))
  .struct(acidRhythm).s("sawtooth")
  .attack(0.004).decay(0.12).sustain(0.12).release(0.06)
  .hpf(170).lpf("400 850 500 1500 650 1100 450 1900")
  .lpenv(3).lpq(5).shape(0.16).gain(0.19).orbit(2)

// Am9 -> Fmaj9 -> E9, offbeat 8th pulses.
const pad = note("<[a2,c3,e3,g3,b3] [f2,a2,c3,e3,g3] [e2,gs2,b2,d3,fs3]>/2")
  .struct("[~ x]*4").s("supersaw")
  .attack(0.05).decay(0.2).sustain(0.4).release(0.3)
  .hpf(360).lpf(sine.range(1000, 2300).slow(8))
  .gain(0.085).room(0.55).roomsize(4).orbit(3)

// One 6-bar melody, two bars per chord. Airy on purpose: long gaps, chord tones only.
const hook = note(`<
  [a4 ~ e4 a4 ~ c5 a4 ~]  [~ a4 ~ g4 e4 ~ ~ ~]
  [f4 ~ c4 f4 ~ a4 c5 ~]  [~ f4 ~ c5 ~ a4 ~ ~]
  [e4 ~ gs4 b4 ~ e5 b4 ~] [~ e5 ~ b4 gs4 ~ ~ ~]
>`)
  .s("triangle").fm(1.2).fmh(2)
  .attack(0.003).decay(0.14).sustain(0).release(0.09)
  .lpf(4200).gain(0.23)
  .delay(0.28).delaytime(60 / 168 * 0.75).delayfeedback(0.32)
  .room(0.3).roomsize(3).pan(sine.range(0.3, 0.7).slow(8)).orbit(4)

const arp = note(`<
  [a3 c4 e4 a4 e4 c4 a3 c4]!2
  [f3 a3 c4 f4 c4 a3 f3 a3]!2
  [e3 gs3 b3 e4 b3 gs3 e3 gs3]!2
>`).s("square")
  .attack(0.002).decay(0.055).sustain(0).release(0.04)
  .hpf(1150).lpf(3300).gain(0.06)
  .delay(0.22).delaytime(60 / 168 * 1.5).delayfeedback(0.3)
  .room(0.25).roomsize(3).pan(".25 .75").orbit(5)

// Sustained sine on the chord roots: the low bed that keeps sections connected.
const drone = roots.s("sine").attack(0.9).release(1.4).gain(0.08).orbit(2)

const mist = s("pink*8").attack(0.035).decay(0.09).sustain(0)
  .hpf(3200).lpf(7500).gain(0.055)
  .room(0.6).roomsize(4).orbit(6)

// Twenty-four-bar snare rush, quiet for the first 18, peaking right as the lift
// hands off to the drive. Long saw ramps keep the rise smooth and repeatable.
const riser = stack(
  s("<~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ sd*4 [sd*8] [sd*16] [sd*32]>")
    .bank("RolandTR909").hpf(1200)
    .gain(saw.range(0.04, 0.26).slow(24)),
  s("<~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ white*4 white*8 white*16 white*32>")
    .hpf(800).lpf(saw.range(400, 7000).slow(24))
    .gain(saw.range(0, 0.09).slow(24))
)

// ---------------- sections (12, 18 or 24 cycles, all multiples of the 6-bar harmony)

const intro = stack(
  pad.lpf(1100), hook.lpf(2200).gain(0.13),
  amen.lpf(1800).gain(0.08), mist.gain(0.025), drone
)

const drift = stack(
  kick.gain(0.62), hats, ghosts,
  sub.gain(0.3), pad, mist.gain(0.025), drone,
  hook.lpf(2600).gain(0.13)
)

// Reese slides in behind a long filter ramp that ends where lift begins.
const cruise = stack(
  drums, amen.lpf(5200).gain(0.1),
  sub.gain(0.4),
  reese.lpf(saw.range(650, 1350).slow(18)),
  pad, hook, mist.gain(0.03)
)

const lift = stack(
  drums, amen.gain(0.15),
  sub.gain(0.45),
  reese.lpf(saw.range(1350, 1900).slow(24)),
  pad, arp.lpf(saw.range(1400, 4200).slow(24)),
  hook.gain(0.16), mist.gain(0.03),
  riser
)

// Fullest point: full break, open amen, the wobble wide open, acid stabs answering.
const drive = stack(
  drums, amen.gain(0.2),
  sub.gain(0.52), reese, acid,
  pad, arp, hook.gain(0.17), mist.gain(0.035)
)

// Reese closes back down over 18 bars, ending where the outro begins.
const settle = stack(
  drums, amen.lpf(6500).gain(0.13),
  sub.gain(0.42),
  reese.lpf(saw.range(1600, 750).slow(18)),
  pad, hook.gain(0.15), arp.lpf(2400).gain(0.05),
  mist.gain(0.028)
)

// Filter back down to exactly the intro's sound world: pad ends at 1100, hook at
// 2200, amen at 1800/0.08, sub faded to zero, so bar 127 is indistinguishable
// from bar 1. The last E9 chord resolves into the opening Am9.
const outro = stack(
  pad.lpf(saw.range(2300, 1100).slow(12)),
  hook.lpf(saw.range(3000, 2200).slow(12)).gain(saw.range(0.16, 0.13).slow(12)),
  amen.lpf(saw.range(6500, 1800).slow(12)).gain(saw.range(0.13, 0.08).slow(12)),
  hats.gain(saw.range(0.14, 0.03).slow(12)),
  sub.gain(saw.range(0.3, 0).slow(12)),
  mist.gain(0.025), drone
)

// 126 cycles at 42 cycles per minute = 180.0 seconds exactly. This arrangement
// repeats indefinitely and seamlessly.
$: arrange(
  [12, intro],   // 0:00  pads, distant chops, the bed
  [18, drift],   // 0:17  light groove arrives
  [18, cruise],  // 0:43  full break, reese slides in
  [24, lift],    // 1:09  arp rises, filters open, rush builds
  [24, drive],   // 1:43  crunchy bass wide open
  [18, settle],  // 2:17  unwind, reese closes down
  [12, outro]    // 2:43  dissolve back to the first chord at 3:00
).postgain(0.76)
