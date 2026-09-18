// @title  Long Exposure
// @by     GLM-5.3 - High
// @tempo  160 bpm
// @notes  Atmospheric DnB for background focus: rolling two-step, distant amen chops,
//         crunchy reese bass, airy pads, pink-noise wash. 120 bars / 3:00 per loop.
//         Paste the whole file into strudel.cc and play.

samples('github:tidalcycles/dirt-samples')
setcpm(160 / 4)

// One cycle = one 4/4 bar. Harmony and every modulation share one 8-bar loop, so
// all sections land on the changes and the arrangement returns in phase. No
// randomness, no manual mutes. Dm9 -> Bbmaj7 -> Gm9 -> A7sus, two bars per chord;
// the A7sus wraps straight back to Dm9, so the loop seam resolves instead of jumps.
const roots = note("<d1 bb1 g1 a1>/2")
const bassRhythm = "<[x ~ ~ x ~ ~ x ~ x ~ x ~ ~ ~ x ~] [x ~ ~ x ~ x ~ x ~ ~ x ~ x ~ [x x] ~]>"
const acidRhythm = "x ~ x ~ ~ x ~ x ~ ~ x ~ x ~ [x x] x"

const kick = s("<[bd ~ ~ ~ ~ ~ [~ bd] ~ ~ ~ bd ~ ~ ~ ~ ~] [bd ~ ~ [~ bd] ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ [~ bd]]>")
  .bank("RolandTR909").gain(0.84)
  .duckorbit("2:3").duckattack(0.16).duckdepth("0.7:0.8")

const snare = s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~")
  .bank("RolandTR909").gain(0.8)

const hats = s("hh*16").bank("RolandTR909")
  .gain("[.1 .22 .14 .3]*4").hpf(5600)
  .pan("[.4 .6]*8")

const ghosts = s("~ ~ ~ ~ ~ ~ sd ~ ~ ~ sd ~ ~ ~ ~ [~ sd]")
  .bank("RolandTR909").gain(".1 .16 .08 .14").hpf(900)

const drums = stack(kick, snare, hats, ghosts,
  s("~ oh ~ ~ ~ oh ~ ~").bank("RolandTR909").gain(0.19).hpf(4200)
)

// 8th-note amen chops, one bar per bracket. High-passed higher than the other DnB
// tracks here so the break stays a distant texture, not a foreground riff.
const amen = n(`<
  [0 1 2 3 4 5 6 7] [0 1 2 3 12 5 6 7]
  [0 9 2 3 4 5 14 7] [0 1 2 3 4 5 [14 15] 7]
  [0 1 [2 2] 3 12 5 6 7] [8 1 10 3 12 5 6 7]
  [0 9 2 11 4 13 6 15] [0 ~ 2 11 4 13 [14 15] 7]
>`).s("amencutup")
  .hpf(650).lpf(8500).gain(0.23).cut(1)

const subVoice = roots.s("sine")
  .attack(0.006).release(0.09).clip(0.92).gain(0.52).orbit(2)
const sub = subVoice.struct(bassRhythm)

// The crunch: detuned saw pair an octave up from the sub, animated low-pass, a
// trace of bit reduction. The sub carries the weight; the saws carry the grit.
const reese = roots.add(note(12)).struct(bassRhythm).s("sawtooth")
  .jux(x => x.add(note(0.08)))
  .attack(0.009).decay(0.15).sustain(0.55).release(0.09)
  .hpf(120).lpf("<600 900 1400 750 1000 1600 850 1300>")
  .lpenv(2).lpq(2).shape(0.24).crush("<12 11 13 10>")
  .gain(0.22).orbit(2)

// Octave/fifth stabs that answer the reese in the fullest section.
const acid = roots.add(note("[12 12 19 24]*4"))
  .struct(acidRhythm).s("sawtooth")
  .attack(0.004).decay(0.12).sustain(0.12).release(0.06)
  .hpf(170).lpf("400 850 500 1500 650 1100 450 1900")
  .lpenv(3).lpq(5).shape(0.16).gain(0.19).orbit(2)

// Dm9 -> Bbmaj7 -> Gm9 -> A7sus, offbeat 8th pulses.
const pad = note("<[d3,f3,a3,c4,e4] [bb2,d3,f3,a3] [g2,d3,f3,a3] [a2,d3,e3,g3]>/2")
  .struct("[~ x]*4").s("supersaw")
  .attack(0.05).decay(0.2).sustain(0.4).release(0.3)
  .hpf(360).lpf(sine.range(1000, 2300).slow(8))
  .gain(0.085).room(0.55).roomsize(4).orbit(3)

// One 8-bar melody, two bars per chord. Airy on purpose: long gaps, chord tones only.
const hook = note(`<
  [a4 ~ f4 a4 ~ c5 a4 ~]
  [d5 ~ a4 ~ f4 ~ e4 ~]
  [e4 ~ g4 a4 ~ c5 ~ e5]
  [g4 ~ a4 ~ d5 ~ c5 ~]
>/2`)
  .s("triangle").fm(1.2).fmh(2)
  .attack(0.003).decay(0.14).sustain(0).release(0.09)
  .lpf(4200).gain(0.23)
  .delay(0.28).delaytime(60 / 160 * 0.75).delayfeedback(0.32)
  .room(0.3).roomsize(3).pan(sine.range(0.3, 0.7).slow(8)).orbit(4)

const arp = note(`<
  [d4 f4 a4 c5 a4 f4 c5 a4]!2
  [bb3 d4 f4 a4 f4 d4 a4 f4]!2
  [g3 bb3 d4 f4 a4 f4 d4 bb3]!2
  [a3 d4 e4 g4 e4 d4 g4 e4]!2
>`).s("square")
  .attack(0.002).decay(0.055).sustain(0).release(0.04)
  .hpf(1150).lpf(3300).gain(0.06)
  .delay(0.22).delaytime(60 / 160 * 1.5).delayfeedback(0.3)
  .room(0.25).roomsize(3).pan(".25 .75").orbit(5)

// Sustained sine on the chord roots: the low bed that keeps sections connected.
const drone = roots.s("sine").attack(0.9).release(1.4).gain(0.08).orbit(2)

// Long sub notes for the open sections, fading out at the very end of the outro
// so the wrap into the (sub-less) intro has no step.
const sustain = roots.s("sine")
  .attack(0.06).release(0.85).clip(0.9).gain(0.3).orbit(2)

const mist = s("pink*8").attack(0.035).decay(0.09).sustain(0)
  .hpf(3200).lpf(7500).gain(0.055)
  .room(0.6).roomsize(4).orbit(6)

// Eight-bar snare rush peaking exactly at the haze -> drive boundary.
const riser = stack(
  s("<~ ~ ~ ~ ~ ~ [sd*4] [sd*8 sd*16]>")
    .bank("RolandTR909").hpf(1200)
    .gain(saw.range(0.04, 0.24).slow(8)),
  s("~ ~ ~ ~ ~ ~ white*4 white*8")
    .hpf(800).lpf(saw.range(400, 7000).slow(8))
    .gain(saw.range(0, 0.09).slow(8))
)

// ---------------- sections (8 or 16 cycles, all multiples of the 8-bar harmony)

const intro = stack(
  pad.lpf(1100), hook.lpf(2200).gain(0.13),
  amen.lpf(1800).gain(0.08), mist.gain(0.025), drone
)

const drift = stack(
  kick.gain(0.62), hats, ghosts,
  sub.gain(0.3), pad, mist.gain(0.025), drone,
  hook.lpf(2600).gain(0.13)
)

// Reese slides in behind a 16-bar filter ramp that ends where lift begins.
const cruise = stack(
  drums, amen.lpf(5200).gain(0.1),
  sub.gain(0.4),
  reese.lpf(saw.range(650, 1350).slow(16)),
  pad, hook, mist.gain(0.03)
)

const lift = stack(
  drums, amen.gain(0.15),
  sub.gain(0.45),
  reese.lpf(saw.range(1350, 1900).slow(16)),
  pad, arp.lpf(saw.range(1400, 4200).slow(16)),
  hook.gain(0.16), mist.gain(0.03)
)

// Open halftime pocket: kick and rim only, sustained subs, and the rush into drive.
const haze = stack(
  kick.gain(0.5),
  s("~ ~ rim ~").bank("RolandTR909").gain(0.16),
  sustain,
  pad.clip(2).release(0.6).lpf(1800),
  hook.lpf(3000).gain(0.18),
  amen.lpf(1400).gain(0.05),
  riser, mist.gain(0.03)
)

// Fullest point: full break, open amen, both bass voices, arp wide open.
const drive = stack(
  drums, amen.gain(0.2),
  sub.gain(0.52), reese, acid,
  pad, arp, hook.gain(0.17), mist.gain(0.035)
)

// Reese closes back down over 16 bars, ending where wander begins.
const settle = stack(
  drums, amen.lpf(6500).gain(0.13),
  sub.gain(0.42),
  reese.lpf(saw.range(1600, 750).slow(16)),
  pad, hook.gain(0.15), arp.lpf(2400).gain(0.05),
  mist.gain(0.028)
)

// The long coding pocket: light groove, quiet bass, air everywhere.
const wander = stack(
  kick.gain(0.62), hats, ghosts,
  sub.gain(0.34),
  reese.lpf(750).gain(0.13),
  pad, hook.lpf(2600).gain(0.13), arp.lpf(2000).gain(0.045),
  mist.gain(0.025), drone
)

// Filter back down to exactly the intro's sound world: pad ends at 1100, hook at
// 2200, amen at 1800/0.08, sub gone, so bar 121 is indistinguishable from bar 1.
const outro = stack(
  pad.lpf(saw.range(2300, 1100).slow(8)),
  hook.lpf(saw.range(3000, 2200).slow(8)).gain(saw.range(0.16, 0.13).slow(8)),
  amen.lpf(saw.range(6500, 1800).slow(8)).gain(saw.range(0.13, 0.08).slow(8)),
  hats.gain(saw.range(0.14, 0.03).slow(8)),
  sustain.gain(saw.range(0.3, 0.02).slow(8)),
  mist.gain(0.025), drone
)

// 120 cycles at 40 cycles per minute = 180.0 seconds exactly. This arrangement
// repeats indefinitely and seamlessly.
$: arrange(
  [8, intro],   // 0:00  pads, distant chops, the bed
  [16, drift],  // 0:12  light groove arrives
  [16, cruise], // 0:36  full break, reese slides in
  [16, lift],   // 1:00  arp rises, filters open
  [8, haze],    // 1:24  open halftime space, rush builds
  [16, drive],  // 1:36  both bass voices, everything forward
  [16, settle], // 2:00  unwind, reese closes down
  [16, wander], // 2:24  the coding pocket
  [8, outro]    // 2:48  dissolve back to the first chord at 3:00
).postgain(0.78)
