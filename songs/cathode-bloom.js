// @title  Cathode Bloom
// @by     GLM 5.2 - high
// @tempo  128 bpm
// @notes  Original melodic techno in D aeolian - 96 bars = 3:00 exact loop

// Load dirt-samples (kick, hats, claps...) over the network
samples('github:tidalcycles/dirt-samples')

setcpm(128 / 4) // 32 cycles per minute -> 96 cycles = 180.0s exactly

// --------------------------------------------------------------------
// CATHODE BLOOM
// --------------------------------------------------------------------
// Arrangement (96 bars):
//   0-7    intro        pad + drone only
//   8-15   build I      kick fades in, arp wakes up filtered
//   16-31  groove I     full drums, bass, stabs
//   32-39  breakdown    drums out, pad + drone + dark arp
//   40-47  tension      hats back, snare roll, riser
//   48-55  build II     everything layered, big riser
//   56-79  drop         lead melody, 3 passes over the 8-bar loop
//   80-95  outro        strip back down, loop cleanly into itself
//
// Harmony: D aeolian, one chord per bar - Dm | Bb | Gm | Am.
// Signature move: a 16th-note arp that sits a little lower each bar
// of the progression, then the A-root octave pump snaps it back up.
// --------------------------------------------------------------------

// ---- harmonic material ---------------------------------------------
const padChords = note("<[d3,f3,c4,e4] [a#2,d3,f3,a3] [g2,a#2,d3,f3] [a2,c3,e3]>")

const stabChords = note(`<
  [~ ~ [d4,f4,a4] ~ ~ ~ [d4,f4,a4] ~]
  [~ ~ [a#3,d4,f4] ~ ~ ~ [a#3,d4,f4] ~]
  [~ ~ [g3,a#3,d4] ~ ~ ~ [g3,a#3,d4] ~]
  [~ ~ [a3,c4,e4] ~ ~ ~ [a3,c4,e4] ~]
>`)

const arpPattern = note(`<
  [d4 a4 d5 a4 f5 d5 a4 f4 d4 a4 d5 a4 f5 e5 c5 a4]
  [a#3 f4 a#4 f4 d5 a#4 f4 d4 a#3 f4 a#4 f4 d5 c5 a4 f4]
  [g3 d4 g4 d4 a#4 g4 d4 a#3 g3 d4 g4 d4 a#4 a4 f4 d4]
  [a3 a4 a3 a4 a3 a4 a3 a4 a3 a4 a3 a4 a3 a4 a3 a4]
>`)

const leadMelody = note(`<
  [d5@2 f5 e5] [f5@2 a5 g5] [g5@2 f5 d5] [c5@2 e5 a4]
  [d5 e5 f5@2] [g5 f5 d5@2] [a#4 c5 d5 f5] [e5@3 d5]
>`)

const bassPattern = note(`<
  [~ d2 ~ d2 ~ d2 ~ d2]
  [~ a#2 ~ a#2 ~ a#2 ~ a#2]
  [~ g2 ~ g2 ~ g2 ~ g2]
  [~ a2 ~ a2 ~ a2 ~ a2]
>`)

// ---- pads & drone ---------------------------------------------------
$: padChords
  .sound("sawtooth")
  .attack(1.1)
  .release(2.4)
  .cutoff(700)
  .resonance(1.5)
  .gain("<0.32@8 0.4@8 0.5@16 0.45@16 0.45@8 0.55@24 0.38@8 0.28@8>")
  .room(0.85)
  .mask("<1@8 1@8 1@16 1@16 1@8 1@24 1@8 1@8>")

$: s("sine")
  .note("d2")
  .attack(0.05)
  .release(0.4)
  .gain(sine.slow(2).range(0.12, 0.38))
  .mask("<1@8 0@8 0@16 1@8 0@8 0@8 0@24 0@16>")

// ---- arp ------------------------------------------------------------
$: arpPattern
  .sound("sawtooth")
  .release(0.12)
  .cutoff("<600@8 1100@8 2600@16 1400@16 2000@8 2600@24 2200@8 1600@8>")
  .resonance(2)
  .gain("<0.3@8 0.42@8 0.5@16 0.45@16 0.48@8 0.55@24 0.42@8 0.3@8>")
  .delay(0.35)
  .delaytime(0.35)
  .delayfeedback(0.45)
  .room(0.25)
  .mask("<0@8 1@8 1@16 1@16 1@8 1@24 1@8 0@8>")

// ---- bass -----------------------------------------------------------
$: bassPattern
  .sound("square")
  .attack(0.005)
  .release(0.1)
  .cutoff(420)
  .resonance(3)
  .gain(0.85)
  .mask("<0@8 0@8 1@16 0@16 1@8 1@24 1@8 0@8>")

// ---- drums ----------------------------------------------------------
$: s("<[bd*4]!7 [bd*8]>") // straight four, double-time fill every 8th bar
  .gain("<0.6@8 0.85@8 1@16 1@16 1@8 1@24 0.9@8 0.6@8>")
  .mask("<0@8 1@8 1@16 0@16 1@8 1@24 1@8 0@8>")

$: s("hh*16")
  .gain(".9 .3 .5 .3 .7 .3 .5 .3 .9 .3 .5 .3 .7 .3 .55 .35")
  .mask("<0@8 1@8 1@16 0@8 1@8 1@8 1@24 1@8 0@8>")

$: s("<~ oh>*4")
  .gain(0.42)
  .mask("<0@8 1@8 1@16 0@8 1@8 1@8 1@24 1@8 0@8>")

$: s("<~ cp>*2")
  .gain(0.72)
  .room(0.3)
  .mask("<0@8 1@8 1@16 0@16 1@8 1@24 1@8 0@8>")

// snare roll: second half of the breakdown through build II
$: s("sd*16")
  .gain(saw.slow(12).range(0.12, 0.8))
  .mask("<0@44 1@4 1@8 0@40>")

// risers: short one into groove I, big one into the drop
$: s("white")
  .hpf(saw.slow(4).range(300, 5000))
  .gain(saw.slow(4).range(0.04, 0.22))
  .mask("<0@12 1@4 0@80>")

$: s("white")
  .hpf(saw.slow(8).range(200, 6000))
  .gain(saw.slow(8).range(0.05, 0.3))
  .mask("<0@48 1@8 0@40>")

// crashes at the three section turns
$: s("cr")
  .gain(0.5)
  .room(0.4)
  .mask("<0@32 1 0@23 1 0@23 1 0@15>")

// ---- stabs ----------------------------------------------------------
$: stabChords
  .sound("sawtooth")
  .attack(0.004)
  .release(0.14)
  .cutoff(1700)
  .resonance(1)
  .gain(0.4)
  .delay(0.2)
  .delaytime(0.35)
  .delayfeedback(0.3)
  .room(0.3)
  .mask("<0@8 0@8 1@16 0@16 1@8 1@24 0@16>")

// ---- lead -----------------------------------------------------------
$: leadMelody
  .sound("supersaw")
  .attack(0.01)
  .release(0.25)
  .cutoff(3200)
  .resonance(1.2)
  .gain(0.55)
  .delay(0.3)
  .delaytime(0.35)
  .delayfeedback(0.5)
  .room(0.5)
  .mask("<0@56 1@24 0@16>")

$: leadMelody
  .add(note(12))
  .sound("supersaw")
  .attack(0.01)
  .release(0.25)
  .cutoff(4400)
  .gain(0.2)
  .room(0.6)
  .mask("<0@56 1@24 0@16>")
