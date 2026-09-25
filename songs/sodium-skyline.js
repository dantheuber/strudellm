// Sodium Skyline
// Liquid drum & bass in F minor, 172 BPM, 152 bars (about 3:32).
// Written for the strudellm library by Claude Fable 5.1.
//
// Structure (bar numbers):
//    0  intro A     wide pad, e-piano, sub, vinyl crackle
//    8  intro B     half-time drums, shaker, lead sketch
//   16  build       filters open, snare roll, noise riser
//   24  drop 1      two-step drums, Reese bass, e-piano stabs, pulse lead
//   56  breakdown   piano, chord change, sub only
//   72  build 2     lead returns over half-time drums
//   80  drop 2      busier bass, supersaw lead, ride, chopped Amen
//  112  bridge      half-time reset with piano
//  120  drop 3      final drop with octave lead and piano doubling
//  136  outro       everything dissolves back to the pad
//
// Paste into https://strudel.cc and press Ctrl+Enter.

setcpm(172 / 4)

// ------------------------------------------------------------------ harmony
const dropStabs = "<Fm7@2 Db^7@2 Ab^7@2 Bbm7 C7b9>"
const dropPad   = "<Fm9@2 Db^7@2 Ab^7@2 Bbm9 C7b9>"
const breakPad  = "<Db^7@2 Eb69@2 Fm9@2 Ab^7@2 Db^7@2 Eb69@2 Bbm9@2 C7b9@2>"
const outroPad  = "<Fm9@2 Db^7@2 Ab^7@2 Bbm9 C7b9 Fm9@2 Db^7@2 Ab^7@2 Fm9@2>"
const dropRoot  = "<f2@2 db2@2 ab2@2 bb2 c2>"
const dropSub   = "<f1@2 db2@2 ab1@2 bb1 c2>"
const breakSub  = "<db2@2 eb2@2 f1@2 ab1@2 db2@2 eb2@2 bb1@2 c2@2>"
const outroSub  = "<f1@2 db2@2 ab1@2 bb1 c2 f1@2 db2@2 ab1@2 f1@2>"

// ------------------------------------------------------------------ melodies
// Scale degrees of F minor from F4 (0 = F4, 7 = F5). "_" holds the note.
const leadMel = `<
  [~ 4 _ 7 _ _ 6 _ 4 _ _ _ 2 _ 4 _] [~ ~ 3 _ 2 _ _ 0 _ _ _ _ ~ ~ ~ ~]
  [~ 4 _ 7 _ _ 6 _ 4 _ _ _ 5 _ 4 _] [~ ~ 2 _ 3 _ _ 5 _ _ _ _ ~ ~ ~ ~]
  [~ 4 _ 7 _ _ 9 _ 7 _ _ _ 6 _ 4 _] [~ ~ 6 _ 4 _ _ 2 _ _ _ _ ~ ~ ~ ~]
  [~ 3 _ 5 _ _ 7 _ 5 _ _ _ 3 _ 5 _] [~ ~ 4 _ 5 _ _ 8 _ _ _ _ 9 _ 8 _]
>`
// Piano melody for the breakdown, eighth-note grid, 16 bars.
const pianoMel = `<
  [~ 5 7 ~ 9 ~ 7 ~] [5 ~ ~ 4 ~ ~ ~ ~] [~ 3 6 ~ 8 ~ 6 ~] [4 ~ ~ 3 ~ ~ ~ ~]
  [~ 2 4 ~ 7 ~ 9 ~] [8 ~ ~ 7 ~ ~ ~ ~] [~ 4 6 ~ 9 ~ 11 ~] [10 ~ ~ 9 ~ ~ ~ ~]
  [~ 5 7 ~ 9 ~ 7 ~] [5 ~ ~ 4 ~ ~ ~ ~] [~ 3 6 ~ 8 ~ 6 ~] [4 ~ ~ 3 ~ ~ ~ ~]
  [~ 3 5 ~ 7 ~ 9 ~] [8 ~ ~ 7 ~ ~ ~ ~] [~ 4 5 ~ 8 ~ 10 ~] [9 ~ ~ 8 ~ ~ ~ ~]
>`
const pianoLH = "<db3@2 eb3@2 f3@2 ab3@2 db3@2 eb3@2 bb2@2 c3@2>"

// ------------------------------------------------------------------ drums
const K  = s("bd").bank("RolandTR909").gain(0.42).orbit(1)
const SN = stack(
  s("sd:1").bank("LinnDrum").gain(0.42).room(0.15).roomsize(1.5),
  s("cp").bank("RolandTR909").gain(0.1).hpf(1500),
).orbit(1)
const GH = s("sd:2").bank("LinnDrum").gain(0.15).lpf(2200).pan(0.45).orbit(1)
const HH = s("hh").bank("RolandTR909").cut(1).pan(0.62).orbit(1)
const OH = s("oh").bank("RolandTR909").cut(1).gain(0.17).pan(0.6).orbit(1)
const SH = s("sh").bank("LinnDrum").pan(0.38).orbit(1)
const RD = s("rd").bank("RolandTR909").gain(0.12).pan(0.68).orbit(1)
const CR = s("cr").bank("RolandTR909").gain(0.3).orbit(1)
const ROLL = s("sd:1").bank("LinnDrum").room(0.15).roomsize(1.5).orbit(1)

const duck = (p) => p.duckorbit("2:3").duckattack("0.12:0.25").duckdepth("0.2:0.15")

const kickTwoStep = K.struct("<[x ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~] [x ~ ~ ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ ~]>")
const kickBusy    = K.struct("<[x ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~] [x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ x]>")
const kickHalf    = K.struct("x ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~")
const snareTwoStep = SN.struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~")
const snareHalf    = SN.struct("~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~")
const snareFill    = SN.struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ x x x x")
const snares  = snareTwoStep.lastOf(8, () => snareFill)
const ghosts  = GH.struct("<[~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~] [~ ~ x ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ x x]>")
const hats8   = HH.struct("x*8").gain("[0.28 0.16]*4")
const hats16  = HH.struct("x*16").gain("[0.3 0.13 0.2 0.13]*4")
const openHat = OH.struct("~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~")
const shaker  = SH.struct("x*16").gain("[0.15 0.06 0.11 0.06]*4")
const ride    = RD.struct("x*8")
const crash   = CR.struct("<x ~!15>")
const roll    = ROLL.struct("<~!6 [x*8] [x*16]>").gain(saw.slow(2).range(0.12, 0.38))
const snareHalfRise = snareHalf.mask("<1!6 0 0>")  // backbeat drops out while the roll plays

const amen  = s("brk").hpf(200).lpf(9000).pan(0.5).orbit(1)
const amenA = amen.splice(16, "<[0 1 2 3 4 5 6 7] [8 9 10 11 12 13 14 15]>")
const amenB = amen.splice(16, "<[0 1 2 3 4 5 6 7] [8 9 10 11 12 13 14 15] [0 1 2 3 4 5 6 7] [8 9 [10 10] 11 4 [5 5] 14 [15 15 15 15]]>")

// ------------------------------------------------------------------ bass
const bassStructA = "<[x _ _ x _ _ x _ _ _ x _ _ _ x _] [x _ _ x _ _ x _ _ _ x _ x _ _ _]>"
const bassStructB = "<[x _ _ x _ _ x _ _ _ x _ _ _ x _] [x _ _ x _ _ x _ _ _ x _ x _ x _] [x _ _ x _ _ x _ _ _ x _ _ _ x _] [x _ _ x _ x _ _ x _ _ x _ x _ _]>"
const reese = (roots, st) => note(roots).struct(st).s("supersaw").unison(2).detune(0.3).spread(0)
  .adsr("0.005:0.22:0.55:0.08").clip(0.92)
  .ftype("24db").lpf(520).lpq(2.5).lpenv(1.6).lpa(0.01).lpd(0.2).lps(0.3)
  .distort("0.7:0.7").gain(0.4).orbit(2)
const sub = (roots, st) => note(roots).struct(st).s("sine").adsr("0.008:0.15:0.8:0.06").clip(0.92).gain(0.43).orbit(2)
const subLong = (roots) => note(roots).s("sine").attack(0.4).release(0.6).clip(0.9).gain(0.4).orbit(2)

// ------------------------------------------------------------------ chords & pads
const stabStruct = "<[~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~] [~ ~ x ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ x ~]>"
const epiano = chord(dropStabs).dict("lefthand").voicing().s("gm_epiano1")
  .release(0.15).lpf(2400).delay(0.28).delayfeedback(0.35).room(0.3).roomsize(4).pan(0.4).orbit(3)
const stabs = epiano.struct(stabStruct).clip(2).gain(0.3)
const introKeys = epiano.struct("<[x ~ ~ ~ ~ ~ x ~] [x ~ ~ ~ ~ ~ ~ ~]>").clip(4).lpf(1500).gain(0.26).delay(0.4)
const pad = (chords) => chord(chords).anchor("g5").voicing().s("supersaw").unison(5).detune(0.3).spread(0.9)
  .adsr("0.5:0.4:0.85:1.2").lpq(0.4).room(0.4).roomsize(4).orbit(3)
const crackle = s("crackle").density(0.08).lpf(6000).gain(1.2).orbit(5)

// ------------------------------------------------------------------ leads
const leadPulse = n(leadMel).scale("F4:minor").s("pulse").pw(0.32).pwrate(0.7).pwsweep(0.12)
  .adsr("0.01:0.12:0.6:0.18").clip(0.85)
  .lpf(1900).lpq(1.2).lpenv(1.4).lpa(0.008).lpd(0.16).lps(0.35)
  .delay(0.32).delayfeedback(0.4).room(0.28).roomsize(3).gain(0.42).pan(0.6).orbit(4)
const leadHarm = n(leadMel.add(2)).scale("F4:minor").s("pulse").pw(0.4).pwrate(0.5).pwsweep(0.1)
  .adsr("0.01:0.12:0.6:0.18").clip(0.85).lpf(1600).lpq(1).lpenv(1.2).lpa(0.008).lpd(0.16).lps(0.35)
  .delay(0.32).delayfeedback(0.4).room(0.28).roomsize(3).gain(0.2).pan(0.3).orbit(4)
const leadSaw = n(leadMel).scale("F4:minor").s("supersaw").unison(5).detune(0.25).spread(0.75)
  .adsr("0.02:0.15:0.7:0.25").clip(0.9).lpf(2800).lpq(0.6).lpenv(1).lpa(0.01).lpd(0.2).lps(0.5)
  .delay(0.3).delayfeedback(0.4).room(0.3).roomsize(3).gain(0.4).orbit(4)
const leadOct = n(leadMel.add(7)).scale("F4:minor").s("supersaw").unison(3).detune(0.2).spread(0.6)
  .adsr("0.02:0.15:0.7:0.25").clip(0.9).lpf(4200).lpq(0.5)
  .delay(0.3).delayfeedback(0.4).room(0.3).roomsize(3).gain(0.2).orbit(4)
const pianoR = n(pianoMel).scale("F4:minor").s("piano").gain(0.6).room(0.35).roomsize(4).pan(0.55).orbit(3)
const pianoL = note(pianoLH).struct("x ~ ~ ~ ~ ~ x ~").s("piano").gain(0.42).room(0.35).roomsize(4).pan(0.45).orbit(3)
const pianoLead = n(leadMel).scale("F4:minor").s("piano").gain(0.35).room(0.35).roomsize(4).pan(0.6).orbit(3)

// ------------------------------------------------------------------ transitions
const riser = s("white").struct("<~!5 x ~ ~>").clip(3).attack(3.8).release(0.3)
  .hpf(150).lpf(400).lpenv(5).lpa(4).lpd(0.1).lps(1).gain(0.6).room(0.35).roomsize(5).orbit(5)
const revCym = note("c5").s("gm_reverse_cymbal").struct("<~!7 [~ x]>").gain(1).room(0.35).roomsize(5).orbit(5)
const revCrash = s("cr").bank("RolandTR909").speed(-1).struct("<~!7 x>").gain(0.28).room(0.35).roomsize(5).orbit(5)
const rise = stack(roll, riser, revCym, revCrash)

// Silent first pass over every sample so nothing loads late on the first real hit.
const preload = stack(
  kickTwoStep, snareFill, ghosts, hats16, openHat, shaker, ride, crash, amenB, stabs, revCym,
  stack(pianoR, pianoL).fast(2), pianoLead.fast(2), revCrash,
).gain(0)

// ------------------------------------------------------------------ sections
const introA = stack(
  pad(dropPad).lpf(600).gain(0.16),
  introKeys,
  subLong(dropSub),
  crackle,
  preload,
)
const introB = stack(
  pad(dropPad).lpf(800).gain(0.17),
  introKeys,
  subLong(dropSub),
  crackle,
  kickHalf, snareHalf, hats8.gain(0.18), shaker.gain("[0.1 0.04 0.07 0.04]*4"),
  leadPulse.lpf(800).gain(0.3),
)
const build = stack(
  pad(dropPad).lpf("<700 900 1100 1400 1800 2300 3000 4000>").gain(0.2),
  stabs.gain(0.26),
  subLong(dropSub),
  crackle,
  kickHalf, snareHalfRise, hats8, shaker,
  leadPulse.lpf("<900 1000 1200 1400 1700 2000 2400 2800>").gain(0.38),
  rise,
)
const drop1a = stack(
  crash, duck(kickTwoStep), snares, ghosts, hats8, shaker, amenA.gain(0.24),
  reese(dropRoot, bassStructA), sub(dropSub, bassStructA),
  stabs, pad(dropPad).lpf(1200).gain(0.16),
  leadPulse,
)
const drop1b = stack(
  duck(kickTwoStep), snares, ghosts, hats16, openHat, shaker, amenB.gain(0.28),
  reese(dropRoot, bassStructA), sub(dropSub, bassStructA),
  stabs, pad(dropPad).lpf(1400).gain(0.18),
  leadPulse, leadHarm,
)
const breakdown = stack(
  crash.gain(0.18),
  pianoR, pianoL,
  pad(breakPad).lpf("<900 900 1000 1000 1100 1100 1200 1200 1300 1300 1500 1500 1700 1700 2000 2200>").gain(0.2),
  subLong(breakSub).gain(0.5),
  crackle,
  stack(kickHalf, snareHalf, hats8.gain(0.2), shaker.gain("[0.1 0.04 0.07 0.04]*4")).mask("<0!8 1!8>"),
)
const build2 = stack(
  pad(dropPad).lpf("<1200 1400 1600 1900 2200 2600 3200 4000>").gain(0.2),
  stabs.gain(0.28),
  subLong(dropSub),
  kickHalf, snareHalfRise, hats8, shaker,
  leadPulse.lpf("<1200 1300 1500 1700 1900 2200 2500 2800>").gain(0.4),
  rise,
)
const drop2a = stack(
  crash, duck(kickBusy), snares, ghosts, hats16, openHat, ride, shaker, amenB.gain(0.27),
  reese(dropRoot, bassStructB).lpf(sine.range(420, 1100).fast(2)), sub(dropSub, bassStructB),
  stabs, pad(dropPad).lpf(1500).gain(0.17),
  leadSaw, leadHarm,
)
const drop2b = stack(
  duck(kickBusy), snares, ghosts, hats16, openHat, ride, shaker, amenB.gain(0.27),
  reese(dropRoot, bassStructB).lpf(sine.range(420, 1300).fast(2)), sub(dropSub, bassStructB),
  stabs, pad(dropPad).lpf(1800).gain(0.18),
  leadSaw, leadHarm, leadOct,
)
const bridge = stack(
  crash.gain(0.18),
  pianoR, pianoL,
  pad(breakPad).lpf(1600).gain(0.2),
  subLong(breakSub).gain(0.5),
  crackle,
  kickHalf, snareHalfRise, hats8.gain(0.2), shaker,
  rise,
)
const drop3 = stack(
  crash, duck(kickBusy), snares, ghosts, hats16, openHat, ride, shaker, amenB.gain(0.27),
  reese(dropRoot, bassStructB).lpf(sine.range(420, 1300).fast(2)), sub(dropSub, bassStructB),
  stabs, pad(dropPad).lpf(2000).gain(0.18),
  leadSaw, leadHarm, leadOct, pianoLead,
)
const outro = stack(
  pad(outroPad)
    .lpf("<2400 2000 1700 1400 1200 1000 850 700 600 520 450 400 360 320 290 260>")
    .gain("<0.18 0.175 0.17 0.165 0.16 0.155 0.15 0.14 0.13 0.12 0.11 0.1 0.09 0.08 0.07 0.06>"),
  stabs.gain("<0.28 0.26 0.24 0.22 0.2 0.18 0.16 0.14 0.12 0.1 0.08 0.06 0 0 0 0>"),
  subLong(outroSub).gain("<0.42 0.42 0.4 0.4 0.38 0.38 0.36 0.36 0.32 0.32 0.28 0.28 0.22 0.22 0.15 0.15>"),
  crackle.gain("<1.2 1.2 1.2 1.2 1.1 1.1 1 1 0.9 0.8 0.7 0.6 0.5 0.4 0.3 0.2>"),
  stack(kickHalf, snareHalf, hats8.gain(0.2), shaker.gain("[0.1 0.04 0.07 0.04]*4")).mask("<1!8 0!8>"),
)

arrange(
  [8, introA],
  [8, introB],
  [8, build],
  [16, drop1a],
  [16, drop1b],
  [16, breakdown],
  [8, build2],
  [16, drop2a],
  [16, drop2b],
  [8, bridge],
  [16, drop3],
  [16, outro],
)
