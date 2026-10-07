// Salt Ferry: 118 BPM dub techno in D minor.
// One cycle is one bar at 4/4. 96 bars at 29.5 cycles per minute = 3:15.3.
// Built-in Strudel sounds only: TR-909 drums, sine sub, saw stabs, triangle lead.

setcpm(29.5)

const progression = "<Dm9 Bb^7 Gm9 A7>"

const kick = s("bd*4").bank("RolandTR909").gain(0.5)
const snare = s("~ sd ~ sd").bank("RolandTR909").gain(0.42).room(0.35)
const hats = s("hh*8").bank("RolandTR909").gain("0.22 0.1 0.18 0.12 0.24 0.1 0.2 0.14")
const openHat = s("~ oh ~ oh").bank("RolandTR909").gain(0.18).delay(0.35).delaytime(0.381).delayfeedback(0.5)

const sub = note("<d1 bb0 g1 a0>").struct("x ~ x x ~ x ~ ~").s("sine").lpf(150).gain(0.75)

const stabs = chord(progression).voicing().struct("~ x ~ ~ ~ x ~ x")
  .s("sawtooth")
  .lpf(sine.range(500, 1800).slow(6))
  .attack(0.004).decay(0.22).sustain(0)
  .gain(0.2)
  .room(0.5)
  .delay(0.4).delaytime(0.381).delayfeedback(0.55)

const lead = n("<[0 ~ 2 4 ~ 5 4 2] [5 ~ 4 2 ~ 0 ~ -1]>").scale("d4:minor")
  .s("triangle")
  .gain(0.22)
  .lpf(2600)
  .attack(0.02).decay(0.4).sustain(0.3)
  .delay(0.5).delaytime(0.381).delayfeedback(0.6)
  .room(0.7)

const hiss = s("white").gain(0.5).lpf(sine.range(300, 5000).slow(8)).hpf(200)

const intro = stack(sub, stabs)

const build = stack(
  sub,
  stabs,
  hats.mul(gain(0.7)),
  hiss.mul(gain(saw.range(0.2, 1).slow(8)))
)

const grooveA = stack(kick, snare, hats, openHat, sub, stabs)

const brk1 = stack(stabs, lead, hiss.mul(gain(0.4)))

const grooveB = stack(kick, snare, hats, openHat, sub, stabs, lead)

const brk2 = stack(stabs.lpf(600), lead, hiss.mul(gain(0.25)))

const grooveC = stack(kick, snare, hats, openHat, sub, stabs, lead, hiss.mul(gain(0.25)))

const outro = stack(kick, snare, hats, sub, stabs, lead).mul(gain(saw.range(1, 0).slow(16)))

arrange(
  [8, intro],
  [8, build],
  [16, grooveA],
  [8, brk1],
  [16, grooveB],
  [8, brk2],
  [16, grooveC],
  [16, outro]
).postgain(0.8)
