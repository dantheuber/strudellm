// @title  The Water Keeps Its Own Time
// @by     Codex
// @tempo  94 bpm
// @notes  An original 94 bpm chamber-electronic drift in five eight-bar scenes.

setcpm(94 / 4)

// Eight slow-changing colors: D minor opens out through Lydian light,
// then folds back toward A before the loop returns home.
const tide = cat(
  "d3,f3,a3,c4,e4",
  "bb2,f3,a3,d4,e4",
  "g2,bb3,d4,f4,a4",
  "c3,g3,a3,d4,e4",
  "eb3,g3,bb3,d4,a4",
  "f2,c3,e3,g3,a3",
  "a2,eb3,g3,b3,d4",
  "a2,e3,g3,bb3,d4"
)

const alternateTide = cat(
  "d3,a3,c4,e4",
  "bb2,f3,ab3,d4,e4",
  "g2,d3,f3,a3,c4",
  "c3,g3,bb3,d4,f4",
  "eb3,bb3,d4,f4,g4",
  "f2,c3,eb3,g3,a3",
  "a2,eb3,g3,c4,d4",
  "a2,e3,g3,bb3,d4"
)

const bed = tide.note()
  .sound("triangle")
  .attack(0.7).decay(0.4).sustain(0.45).release(2.8)
  .lpf("<900 1100 1450 1050 1700 1350 1000 1250>".slow(8))
  .room(0.88).gain(0.15)

const shadowBed = alternateTide.note()
  .sound("triangle")
  .attack(0.9).decay(0.5).sustain(0.4).release(2.5)
  .lpf(1150).room(0.9).gain(0.13)

const lowCurrent = cat(
  "d2 ~ a2 d3", "bb1 ~ f2 a2", "g1 ~ d2 f2", "c2 ~ g2 d3",
  "eb2 ~ bb2 d3", "f1 ~ c2 e2", "a1 ~ eb2 g2", "a1 ~ e2 g2"
).note()
  .sound("sine")
  .attack(0.01).decay(0.18).sustain(0.12).release(0.22)
  .lpf(360).gain(0.32)

const smallMotions = cat(
  "~ a4 ~ d5 f5 ~ e5 c5",
  "~ d5 ~ f5 a5 ~ e5 d5",
  "~ d5 ~ g5 f5 ~ d5 a4",
  "~ g4 ~ c5 d5 ~ e5 g5",
  "~ bb4 d5 ~ f5 ~ a5 g5",
  "~ a4 c5 ~ e5 g5 ~ f5",
  "~ c5 eb5 ~ g5 ~ d5 c5",
  "~ bb4 d5 ~ e5 ~ g5 a5"
).note()
  .sound("sine").fm(1.4).fmh(2)
  .attack(0.015).decay(0.22).sustain(0.08).release(0.65)
  .lpf(3200).room(0.62).gain(0.11).pan(0.62)

const answer = cat(
  "a5 ~ ~ e6 ~ d6 ~ ~",
  "f5 ~ a5 ~ ~ d6 c6 ~",
  "d6 ~ a5 ~ g5 ~ ~ d6",
  "e5 ~ g5 ~ d6 ~ c6 ~",
  "bb5 ~ f6 ~ d6 ~ a5 ~",
  "c6 ~ a5 ~ g5 ~ e5 ~",
  "g5 ~ eb6 ~ d6 ~ c6 ~",
  "bb5 ~ d6 ~ e6 ~ a5 ~"
).note()
  .sound("sine").fm(2).fmh(1.5)
  .attack(0.02).decay(0.3).sustain(0.05).release(0.9)
  .lpf(4200).room(0.78).gain(0.075).pan(0.34)

const heartbeat = s("bd ~ ~ bd ~ ~ bd ~")
  .gain(0.48)

const deepDrum = s("~ ~ ~ ~ sd ~ ~ ~")
  .gain(0.3)

const woodDrops = s("~ rim ~ ~ ~ ~ rim ~")
  .gain(0.12).room(0.45)

const saltAir = s("hh ~ hh ~ ~ hh ~ hh")
  .gain(0.075).hpf(5200)

const opening = stack(
  bed,
  answer.gain(0.055)
)

const arrival = stack(
  bed,
  lowCurrent,
  smallMotions,
  heartbeat.gain(0.34),
  woodDrops
)

const undertow = stack(
  shadowBed,
  lowCurrent.gain(0.3),
  answer,
  heartbeat.gain(0.27),
  woodDrops.gain(0.075)
)

const crest = stack(
  bed,
  lowCurrent,
  smallMotions.gain(0.14),
  answer,
  heartbeat,
  deepDrum,
  woodDrops,
  saltAir
)

const afterglow = stack(
  bed.gain(0.1),
  answer.gain(0.045)
)

$: arrange(
  [8, opening],
  [8, arrival],
  [8, undertow],
  [8, crest],
  [8, afterglow]
)
