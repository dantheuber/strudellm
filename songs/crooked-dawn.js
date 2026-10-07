// Crooked Dawn
// 7/8 Balkan-cinematic techno in D Phrygian dominant. One cycle is one bar of seven eighth-note
// steps, grouped 2+2+3. setcpm(36) is 0.6 cycles per second, so a bar lasts 1.667 s (126 BPM quarter notes).
setcpm(36)

// Drums
const kick = s("bd ~ bd ~ bd ~ ~").bank("RolandTR909").gain(0.62).orbit(0)
  .duckorbit("2:3").duckdepth(0.75).duckattack(0.12)
const hats = s("hh*7").bank("RolandTR909").gain("0.3 0.55 0.3 0.55 0.3 0.55 0.3").orbit(1)
const openHat = s("~ ~ ~ ~ ~ oh ~").bank("RolandTR909").gain(0.35).orbit(1)
const claps = s("~ ~ ~ cp ~ ~ cp").bank("RolandTR909").gain(0.55).room(0.15).orbit(1)
const clapRoll = s("cp*7").bank("RolandTR909").gain(0.45).orbit(1)
const taiko = s("~ gm_taiko_drum ~ gm_taiko_drum ~ ~ gm_taiko_drum").gain(1.1).room(0.2).orbit(6)
const clack = s("gm_woodblock ~ ~ gm_woodblock ~ gm_woodblock ~").gain(1.1).orbit(7)

// Bass: roots follow D D Eb A across each four-bar phrase
const bass = note("d2 ~ d2 ~ d3 d2 ~").add(note("<0 0 1 7>"))
  .s("sawtooth").lpf(sine.range(260, 620).slow(8)).lpenv(3).lpdecay(0.14).lpq(5)
  .gain(1.0).orbit(2)
const bass2 = note("d2 d2 ~ d3 ~ d2 d3").add(note("<0 0 1 7>"))
  .s("sawtooth").lpf(sine.range(300, 900).slow(8)).lpenv(3).lpdecay(0.12).lpq(5)
  .gain(1.0).orbit(2)
const sub = note("d1 ~ ~ ~ d1 ~ ~").add(note("<0 0 1 7>")).s("sine").gain(0.9).orbit(2)

// Harmony and pads
const pad = note("<[d3,f#3,a3] [d3,f#3,a3] [eb3,g3,bb3] [a2,c3,e3]>")
  .s("gm_string_ensemble_1").attack(0.2).room(0.5).gain(0.67).orbit(3)
const choir = note("<[d4,f#4,a4] [d4,f#4,a4] [eb4,g4,bb4] [a3,c4,e4]>")
  .s("gm_choir_aahs").attack(0.5).room(0.7).gain(0.78).orbit(3)
const bagpipe = note("<[d3,a3] [d3,a3] [eb3,bb3] [a2,e3]>")
  .s("gm_bagpipe").room(0.35).gain(0.67).orbit(3)
const stabs = note("<[d4,f#4,a4] [d4,f#4,a4] [eb4,g4,bb4] [a3,c4,e4]>")
  .struct("~ x ~ ~ x ~ x").s("supersaw").lpf(1600).clip(0.35)
  .room(0.2).gain(0.45).orbit(3)

// Lead hook (shanai), four bars: A is the first statement, B the lifted version
const hookA = note("<[d5 ~ eb5 f#5 ~ g5 f#5] [a5@2 g5 f#5 eb5 ~ d5] [c5 ~ bb4 c5 ~ d5 ~] [eb5@2 ~ d5@4]>")
  .s("gm_shanai").gain(1.5).delay(0.25).delaytime(0.238).delayfeedback(0.3).room(0.25).orbit(4)
const hookB = note("<[a5 ~ bb5 a5 g5 ~ f#5] [eb5 d5 eb5 f#5 ~ a5 ~] [g5 f#5 eb5 ~ d5 ~ c5] [d5@2 ~ f#5@2 eb5@2]>")
  .s("gm_shanai").gain(1.5).delay(0.25).delaytime(0.238).delayfeedback(0.3).room(0.25).orbit(4)

// Countermelody, koto solo, and kalimba sparkle
const counter = note("<[~ a4 f#4 ~ d4 ~ f#4] [a4@2 ~ g4 f#4 ~ eb4] [g4 ~ bb4 c5 ~ bb4 ~] [a4 ~ c5 ~ e5@2 ~]>")
  .s("gm_fiddle").gain(1.5).room(0.3).orbit(5)
const koto = note("<[d5 ~ f#5 ~ a5 ~ d6] [a5 ~ g5 ~ f#5 ~ eb5] [bb4 ~ c5 ~ d5 ~ eb5] [a4 ~ c5 ~ e5 ~ a5]>")
  .s("gm_koto").gain(1.8).room(0.4).delay(0.25).delaytime(0.238).delayfeedback(0.35).orbit(5)
const sparkle = note("<[d6 ~ a5 ~ f#6 ~ a5] [d6 ~ a5 ~ eb6 ~ a5] [bb5 ~ g5 ~ eb5 ~ bb5] [a5 ~ c6 ~ e6 ~ c6]>")
  .s("gm_kalimba").gain(1.5).room(0.35).delay(0.3).delaytime(0.238).delayfeedback(0.4).orbit(7)

// Sidechain target: a silent note on orbit 2 so the kick's duck has a target from the first bar
const duckSeed = note("c4").s("sine").gain(0).orbit(2)

// Noise riser, one sweep per eight bars
const riser = s("white").lpf(saw.range(300, 7000).slow(8)).gain(saw.range(0.05, 0.7).slow(8)).orbit(6)

// Sections
const introA = stack(choir, sparkle, duckSeed)
const introB = stack(choir, hookA, sparkle, duckSeed, riser)

const build1a = stack(kick, hats, choir, hookA, sparkle, taiko, duckSeed)
const build1b = stack(kick, hats, openHat, claps, bass, sub, pad, hookA, taiko, clack, sparkle)

const drop1a = stack(kick, hats, openHat, claps, bass, sub, pad, hookA, taiko, clack, sparkle)
const drop1b = stack(kick, hats, openHat, claps, bass, sub, pad, hookA, counter, taiko, clack, sparkle)
const drop1c = stack(kick, hats, openHat, claps, bass, sub, pad, hookB, counter, taiko, clack, sparkle)

const breakA = stack(pad, hookA, sparkle)
const breakB = stack(pad, hookA, counter, sparkle, kick.gain(0.4), hats, riser)

const build2a = stack(kick, hats, claps, bass, sub, pad, hookB, taiko, clack, riser)
const build2b = stack(kick, hats, clapRoll, bass, sub, pad, hookB, taiko, clack, riser)

const drop2a = stack(kick, hats, openHat, claps, bass, sub, pad, hookB, counter, taiko, clack, sparkle)
const drop2b = stack(kick, hats, openHat, claps, bass2, sub, pad, stabs, hookA, counter, taiko, clack, sparkle)
const drop2c = stack(kick, hats, openHat, claps, bass, sub, pad, stabs, hookB, counter, taiko, clack, sparkle)
const drop2d = stack(kick, hats, openHat, claps, bass2, sub, pad, stabs, hookB.add(note("12")), counter, taiko, clack, sparkle)

const bridgeA = stack(bagpipe, choir, koto, taiko.gain(0.6), sparkle)
const bridgeB = stack(bagpipe, koto, hats, sparkle, riser)
const bridgeC = stack(kick, hats, claps, bagpipe, koto, sub, riser)

const finalA = stack(kick, hats, openHat, claps, bass, sub, pad, stabs, hookB, counter, taiko, clack, sparkle)
const finalB = stack(kick, hats, openHat, claps, bass2, sub, pad, stabs, hookB.add(note("12")), counter, taiko, clack, sparkle)
const finalC = stack(kick, hats, openHat, claps, bass2, sub, pad, stabs, hookA.add(note("12")), counter.add(note("12")), taiko, clack, sparkle)

const outroA = stack(kick, hats, bass, sub, pad, hookA, counter, sparkle)
const outroB = stack(kick, bass, sub, pad, hookA, sparkle)
const outroC = stack(pad, hookA, counter, sparkle)
const outroD = stack(pad, koto)

arrange(
  [4, introA], [4, introB],
  [4, build1a], [4, build1b],
  [8, drop1a], [8, drop1b], [8, drop1c],
  [8, breakA], [8, breakB],
  [4, build2a], [4, build2b],
  [8, drop2a], [8, drop2b], [8, drop2c], [8, drop2d],
  [8, bridgeA], [4, bridgeB], [4, bridgeC],
  [8, finalA], [8, finalB], [8, finalC],
  [2, outroA], [2, outroB], [2, outroC], [2, outroD],
).postgain(0.5)
