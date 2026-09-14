// @title  First Groove
// @by     Dan Essig
// @tempo  110 bpm
// @notes  Starter song: 909 drums, minor bassline, filtered pad chords

setcpm(110 / 4)

$: stack(
  s("bd*4"),
  s("~ cp ~ cp"),
  s("hh*8").gain(0.4)
).bank("RolandTR909")

$: n("<0 0 3 5> [0 7]")
  .scale("A1:minor")
  .s("sawtooth")
  .lpf(600)
  .decay(0.2)
  .sustain(0)

$: n("<[0,2,4] [3,5,7] [5,7,9] [4,6,8]>")
  .scale("A3:minor")
  .s("supersaw")
  .lpf(sine.range(800, 2400).slow(8))
  .gain(0.3)
  .room(0.5)
