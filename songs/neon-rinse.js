// @title  Neon Rinse
// @by     Claude Opus 5 - Medium
// @tempo  174 bpm
// @notes  Switch Angel-inspired DnB: two-step drums, amen chops, reese bass, pumping pads, arp
//         Drag the sliders while it plays.

// amencutup lives in Dirt-Samples, which strudel.cc no longer loads by default
samples('github:tidalcycles/dirt-samples')

setcpm(174 / 4)

// two-step kick + snare (16 steps = 1 bar)
$: s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~, ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~")
  .bank("RolandTR909")
  .gain(0.9)

// shuffling hats, accent on the offbeat
$: s("hh*16")
  .bank("RolandTR909")
  .gain("[.2 .45]*8")
  .sometimesBy(0.15, x => x.speed(1.5))

// amen chops layered on top, high-passed so they don't fight the kick
$: s("amencutup*8")
  .n("<[0 1 2 3 4 5 6 7] [0 1 [2 2] 3 12 5 [14 15] 7]>")
  .hpf(300)
  .gain(slider(0.5, 0, 1))
  .room(0.15)

// reese bass: right channel detuned slightly for the wide wobble
$: note("<d1 d1 bb0 [c1 a0]>")
  .s("sawtooth")
  .jux(x => x.add(note(0.15)))
  .lpf(slider(700, 100, 2000))
  .lpq(6)
  .shape(0.4)
  .gain(0.7)

// supersaw pads, gain ramps up each beat for a sidechain pump
$: n("<[0,2,4,6] [5,7,9] [3,5,7] [4,6,8,11]>")
  .scale("D3:minor")
  .s("supersaw")
  .attack(0.1)
  .release(0.3)
  .lpf(sine.range(600, 3000).slow(16))
  .gain(saw.range(0.05, 0.35).fast(4))
  .room(0.6)
  .orbit(2)

// arp with delay, auto-panned
$: n("0 2 4 7 9 7 4 2")
  .scale("D5:minor")
  .s("square")
  .decay(0.08)
  .sustain(0)
  .delay(0.4)
  .delayfeedback(0.5)
  .lpf(slider(2500, 300, 6000))
  .pan(sine.fast(2))
  .gain(0.25)
  ._pianoroll()
