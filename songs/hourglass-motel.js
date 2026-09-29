// "Hourglass Motel" — 92 BPM trip-hop noir in F minor
// Created by Claude Fable 5 (claude-fable-5)
//
// Structure (1 cycle = 1 bar, 82 bars ≈ 3:34):
//   intro 8 | verse 16 | chorus 8 | break 8 | verse 12 | chorus 16 | outro 14
// Motif: a descending line cliché — Fm, Fm(maj7), Fm7, Fm6 — under a lone piano,
// answered in the choruses by a theremin-like sine lead over Ab–Eb–Db–C7b9.

setcpm(92/4)

// ---------------------------------------------------------------- drums
const kit = (p) => p.bank("LinnDrum").orbit(1).room(0.12)

const kickVerse = kit(s(`<
  [bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~]
  [bd ~ ~ ~ ~ ~ ~ bd ~ ~ bd ~ ~ ~ ~ ~]
>`)).gain(0.52)

const kickChorus = kit(s("bd ~ ~ ~ ~ ~ ~ bd ~ ~ bd ~ ~ ~ ~ ~")).gain(0.52)

// 8-bar snare phrase, dragged fill on bar 8
const snareMain = kit(s(`<
  [~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~]!7
  [~ ~ ~ ~ sd ~ ~ ~ ~ ~ sd ~ sd ~ sd sd]
>`)).gain(0.54).room(0.3)

const snareGhost = kit(s("~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ sd ~"))
  .gain(0.13).speed(1.3)

const hats = kit(s("hh*8")).gain("[.36 .22]*4")
const hatsSwung = kit(s("[~@1.16 hh@0.84]*8")).gain(0.13)
const hatsBusy = kit(s("hh*16")).gain("[.15 .09 .11 .09]*4")
const openHat = kit(s("<~ [~ ~ ~ [~ oh]]>")).gain(0.25)

const crash909 = s("cr").bank("RolandTR909").orbit(1).room(0.3)
const crashRev = crash909.speed(-1).gain(0.5)

// ---------------------------------------------------------------- bass
const subBass = (p) => stack(
  p.s("sine").gain(0.72),
  p.s("sawtooth").lpf(420).gain(0.16),
).orbit(2).release(0.08)

const bassVerseNotes = note(`<
  [f1@4 ~ f1 ~ [~ c2]]
  [db2@4 ~ db2 ~ [~ ab1]]
  [bb1@4 ~ bb1 ~ [~ b1]]
  [c2@3 ~ g1 ~ c2 [~ e1]]
>`)

const bassChorusNotes = note(`<
  [ab1@4 ~ ab1 ~ [~ d2]]
  [eb2@4 ~ eb2 ~ [~ d2]]
  [db2@4 ~ db2 ab1 [~ db2]]
  [c2@3 ~ g1 ~ c2 [~ g1]]
>`)

const droneF = note("f1").s("sine").slow(2).attack(0.6).release(0.5)
  .gain(0.55).orbit(2)

// ---------------------------------------------------------------- keys
// rootless voicings: Fm9 | Dbmaj7 | Bbm9 | C7b9
const epVerse = note("<[ab3,c4,eb4,g4] [ab3,db4,f4] [ab3,c4,db4,f4] [g3,bb3,db4,e4]>")
  .struct("x ~ ~ ~ ~ x ~ ~").clip(2.5)
  .s("gm_epiano1").lpf(2600).gain(0.5).room(0.35).release(0.25).orbit(3)

// Abmaj7 | Ebadd9 | Dbmaj9 | C7b9
const epChorus = note("<[ab3,c4,eb4,g4] [g3,bb3,eb4,f4] [f3,ab3,c4,eb4] [g3,bb3,db4,e4]>")
  .struct("x ~ ~ x ~ ~ x ~").clip(2)
  .s("gm_epiano1").lpf(2600).gain(0.5).room(0.35).release(0.25).orbit(3)

// ---------------------------------------------------------------- piano
const grand = (p) => p.s("piano").lpf(3200).room(0.55).clip(2).orbit(4)

// the noir line cliché: F — E — Eb — D on beat 2 of each bar
const clicheMelody = note(`<
  [~ f4 ~ [ab4 c5]] [~ e4 ~ g4] [~ eb4 ~ f4] [~ d4 ~ e4]
  [~ f4 ~ [ab4 c5]] [~ e4 ~ g4] [~ eb4 ~ [f4 ab4]] [~ [db5 c5] ~ g4]
>`)
const clicheChords = note("<[f2,c3,ab3]!7 [c3,g3,bb3]>").clip(1.2)

const pianoAnswer = note("<~ [~ ~ ~ c5] ~ [~ ab4 [g4 ~] ~]>")

// ---------------------------------------------------------------- lead
const theremin = (p) => p.s("sine").vib(5).vibmod(0.35)
  .attack(0.05).release(0.2)
  .delay(0.35).delaytime(0.489).delayfeedback(0.35)
  .room(0.45).orbit(5)

const leadMelody = note(`<
  [c5@3 eb5] [bb4@3 g4] [ab4@2 f4 eb4] [e4@2 db5 c5]
  [c5@3 [eb5 f5]] [g5@3 [f5 eb5]] [f5@2 c5 ab4] [g4@2 e4@2]
>`)

const clarinetLine = note("<[~@2 c4@2] ~ [~@2 db4 [c4 bb3]] [~ g3@2 e3]>")
  .s("gm_clarinet").attack(0.06).lpf(1800).room(0.4).orbit(5)

// ---------------------------------------------------------------- pads
const pad = (p) => p.s("gm_string_ensemble_1").attack(0.4).release(1.2)
  .lpf(2200).room(0.5).orbit(6)

const padChorus = note("<[c4,eb4,g4] [bb3,eb4,g4] [ab3,c4,f4] [g3,db4,e4]>")
const padLow = note("<[f3,ab3,c4]!6 [g3,bb3,e4]!2>")
const padIntro = note("<~ ~ ~ ~ [f3,ab3,c4] [f3,ab3,c4] [f3,ab3,c4] [e3,g3,bb3]>")

// ---------------------------------------------------------------- pluck
const pluck = (p) => p.s("triangle").decay(0.18).sustain(0)
  .hpf(350).room(0.3).delay(0.25).delaytime(0.326).orbit(8)

const arpVerse = note(`<
  [~ f4 ~ ab4 ~ c5 ~ ab4] [~ f4 ~ ab4 ~ db5 ~ ab4]
  [~ f4 ~ ab4 ~ db5 ~ bb4] [~ e4 ~ g4 ~ bb4 ~ db5]
>`)

const arpChorus = note(`<
  [ab4 c5 eb5 c5]*2 [g4 bb4 eb5 bb4]*2
  [f4 ab4 c5 ab4]*2 [g4 bb4 db5 e5]*2
>`)

// ---------------------------------------------------------------- texture
const crackle = (g) => s("crackle").density(3).gain(g).orbit(7)

const riser = s("[~ ~ ~ gm_reverse_cymbal ~ ~ ~ ~]").speed(0.6)
  .gain(1).room(0.5).orbit(7)

// ================================================================ sections
const intro = stack(
  grand(clicheMelody).gain(0.58),
  grand(clicheChords).gain(0.5),
  note("<~ ~ ~ ~ f1 f1 f1 e1>").s("sine").attack(0.8).release(0.5).gain(0.5).orbit(2),
  pad(padIntro).gain("<0!4 .16 .2 .24 .28>"),
  crackle(0.75),
  riser.mask("<0!7 1>"),
  kit(s("<~!7 [~!12 sd sd sd ~]>")).gain(0.32),
)

const verse1 = stack(
  kickVerse, snareMain, snareGhost, hats, hatsSwung, openHat,
  subBass(bassVerseNotes),
  epVerse,
  grand(pianoAnswer).gain("<0!8 .8!8>"),
  crackle(0.45),
)

const chorus1 = stack(
  kickChorus, snareMain, snareGhost,
  hats.gain("[.4 .26]*4"), hatsSwung.gain(0.18),
  kit(s("~ ~ ~ [~ oh]")).gain(0.24),
  crash909.gain(0.24).mask("<1 0!7>"),
  subBass(bassChorusNotes),
  epChorus,
  pad(padChorus).gain(0.4),
  theremin(leadMelody).gain(0.52),
  crackle(0.38),
)

const interlude = stack(
  kit(s("bd ~ ~ ~")).gain(0.34).lpf(500),
  grand(clicheMelody).gain(0.58),
  grand(clicheChords).gain(0.5),
  pad(padLow).gain(0.26),
  droneF,
  crackle(0.6),
  kit(s("<~!7 [sd*8]>")).gain(saw.range(0.08, 0.3)),
  riser.mask("<0!7 1>"),
)

const verse2 = stack(
  kickVerse, snareMain, snareGhost, hats, hatsSwung, hatsBusy, openHat,
  subBass(bassVerseNotes),
  epVerse,
  clarinetLine.gain("<.55!8 .4 .25 0 0>"),
  pluck(arpVerse).gain("<0!4 .3!8>"),
  pad(padLow).gain("<0!8 .32!4>"),
  crackle(0.4),
  crashRev.mask("<0!11 1>"),
  kit(s("<~!11 [~ ~ ~ ~ sd ~ ~ ~ sd ~ sd ~ sd sd sd sd]>")).gain(0.38),
)

const chorus2 = stack(
  kickChorus, snareMain, snareGhost,
  hats.gain("[.4 .26]*4"), hatsSwung.gain(0.18), hatsBusy.mul(gain("<0!8 1!8>")),
  kit(s("~ ~ ~ [~ oh]")).gain(0.24),
  crash909.gain(0.26).mask("<1 0!7>"),
  subBass(bassChorusNotes),
  epChorus,
  pad(padChorus).gain(0.4),
  pad(padChorus.add(note(12))).gain("<0!8 .24!8>").lpf(3000),
  theremin(leadMelody).gain(0.52),
  theremin(leadMelody.add(note(12))).gain("<0!8 .18!8>"),
  pluck(arpChorus).gain(0.32),
  crackle(0.38),
)

const outro = stack(
  kit(s("<[bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~]!4 [bd ~ ~ ~]!6 ~!4>"))
    .gain("<.42 .4 .38 .35 .3 .28 .26 .24 .22 .2 0!4>").lpf("<20000!4 900!6 500!4>"),
  kit(s("<[~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~]!4 ~!10>")).gain(0.38).room(0.35),
  hats.mul(gain("<.8 .65 .5 .35 0!10>")),
  subBass(bassVerseNotes).mul(gain("<1 .85 .7 .55 0!10>")),
  epVerse.mul(gain("<.9 .8 .7 .6 0!10>")),
  crash909.gain(0.2).mask("<1 0!13>"),
  grand(note(`<~ ~ ~ ~
    [~ f4 ~ [ab4 c5]] [~ e4 ~ g4] [~ eb4 ~ f4] [~ d4 ~ e4]
    [~ f4 ~ [ab4 c5]] [~ e4 ~ g4] [~ eb4 ~ f4] [~ [e4 d4] ~ c4]
    ~ ~>`)).gain(0.58),
  grand(note("<~!4 [f2,c3,ab3]!7 [c3,g3,bb3] ~ ~>")).gain(0.48),
  grand(note("<~!12 [f1,f2,c3,ab3] ~>")).gain(0.65).clip(2).room(0.8),
  pad(note("<~!4 [f3,ab3,c4]!8 ~ ~>")).gain("<0!4 .24!6 .18 .12 0 0>"),
  crackle("<.5!10 .4 .3 .2 .1>"),
)

// ================================================================ arrangement
arrange(
  [8,  intro],
  [16, verse1],
  [8,  chorus1],
  [8,  interlude],
  [12, verse2],
  [16, chorus2],
  [14, outro],
).postgain(0.55)
