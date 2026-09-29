// Rearview Aurora
// Synthwave anthem, 112 BPM. The verses sit in F# minor and the chorus opens into A major,
// landing each time on a bVI-bVII-I lift (F - G - A). The piano bridge reuses that cadence
// one step higher (G - A - B), so the last chorus arrives in B major.
// Form: intro, verse, pre-chorus, chorus, riff, verse, pre-chorus, chorus, bridge,
// lifted chorus, outro. 116 bars, about 4:09.

setcpm(112 / 4)

const ECHO = (60 / 112) * 0.75 // dotted-eighth delay, in seconds
const rep = (x, count) => Array(count).fill(x)

// ------------------------------------------------------------------ harmony
// Pad voicings, one entry per bar. Bass roots are MIDI numbers (F1 = 29 ... E2 = 40).

const VERSE_CH = [
  "[a3,c#4,e4,g#4]", // F#m9
  "[a3,c#4,e4,f#4]", // Dmaj9
  "[g#3,b3,c#4,e4]", // Amaj9
  "[g#3,b3,c#4,f#4]", // E6/9
  "[a3,c#4,e4,g#4]", // F#m9
  "[a3,c#4,e4,f#4]", // Dmaj9
  "[a3,c#4,d4,f#4]", // Bm9
  "[[g#3,b3,c#4,f#4] [g#3,b3,d4,f4]]", // C#7sus4 -> C#7b9
]
const PRE_CH = [
  "[a3,c#4,e4,f#4]", // Dmaj9
  "[g#3,b3,e4,f#4]", // Eadd9
  "[g#3,b3,c#4,e4]", // C#m7
  "[a3,c#4,e4,g#4]", // F#m9
  "[b3,d4,f#4,a4]", // Bm7
  "[b3,e4,g#4,c#5]", // C#m7
  "[c#4,f#4,a4,e5]", // Dmaj9
  "[[e4,a4,b4,e5] [e4,g#4,b4,e5]]", // Esus4 -> E
]
const CHORUS_CH = [
  "[e3,a3,c#4,e4]", // A
  "[e3,g#3,b3,e4]", // E/G#
  "[f#3,a3,c#4,e4]", // F#m7
  "[e3,f#3,a3,c#4]", // Dmaj9
  "[e3,f#3,a3,d4]", // Bm11
  "[[e3,a3,b3,e4] [e3,g#3,b3,e4]]", // Esus4 -> E
  "[f3,a3,c4,e4]", // Fmaj7 (bVI)
  "[g3,b3,d4,e4]", // G6 (bVII)
]
const RIFF_CH = CHORUS_CH.slice(0, 4)
const BRIDGE_CH = [
  "[e4,f#4,a4,c#5]", // Dmaj9
  "[e4,g#4,b4,c#5]", // C#m7
  "[d4,f#4,a4,c#5]", // Bm9
  "[d4,f#4,a4,b4]", // E9sus4
  "[e4,f#4,a4,c#5]", // Dmaj9
  "[e4,g#4,b4,c#5]", // C#m7
  "[e4,g#4,a4,c#5]", // F#m9
  "[e4,g#4,a4,c#5]", // F#m9
  "[f#4,a4,b4,d5]", // Gmaj9
  "[e4,a4,c#5,f#5]", // A6
  "[f#4,a4,b4,d5]", // Gmaj9
  "[e4,a4,c#5,e5]", // A, then the lift to B
]
const OUTRO_CH = [...RIFF_CH, "[f3,a3,c4,e4]", "[g3,b3,d4,e4]", "[e3,a3,b3,c#4,e4]", "~"]

const VERSE_B = "<30 38 33 40 30 38 35 37>"
const PRE_B = "<38 40 37 30 35 37 38 40>"
const CHORUS_B = "<33 32 30 38 35 40 29 31>"
const RIFF_B = "<33 32 30 38>"
const BRIDGE_B = "<38 37 35 40 38 37 30 30 31 33 31 33>"
const OUTRO_B = "<33 32 30 38 29 31 33 ~>"

// ------------------------------------------------------------------ melodies
// Sixteen steps to the bar; @n holds a note for n sixteenths.

const VERSE_MEL_A = [
  "[~@2 c#5@2 c#5@2 b4@2 a4@4 g#4@2 a4@2]",
  "[f#4@8 ~@2 e4@2 f#4@2 a4@2]",
  "[~@2 c#5@2 c#5@2 b4@2 a4@2 b4@2 c#5@4]",
  "[b4@8 g#4@4 ~@4]",
  "[~@2 c#5@2 c#5@2 b4@2 a4@4 c#5@2 e5@2]",
  "[f#5@6 e5@2 c#5@8]",
  "[d5@4 c#5@4 b4@4 a4@2 b4@2]",
  "[b4@6 a4@2 g#4@4 f4@4]",
]
const VERSE_MEL_B = [
  "[f#4@2 c#5@2 c#5@2 b4@2 a4@4 g#4@2 a4@2]",
  "[f#4@8 ~@2 e4@2 f#4@2 a4@2]",
  "[~@2 c#5@2 c#5@2 b4@2 a4@2 b4@2 c#5@4]",
  "[e5@6 c#5@2 b4@8]",
  "[~@2 c#5@2 c#5@2 b4@2 a4@2 c#5@2 e5@2 f#5@2]",
  "[f#5@6 e5@2 c#5@4 e5@4]",
  "[d5@4 c#5@2 b4@2 d5@4 f#5@4]",
  "[b4@4 c#5@4 d5@4 f5@4]",
]
const PRE_MEL = [
  "[f#5@8 e5@4 c#5@4]",
  "[b4@8 ~@2 g#4@2 b4@2 e5@2]",
  "[e5@8 c#5@4 b4@4]",
  "[a4@8 ~@2 f#4@2 a4@2 d5@2]",
  "[d5@8 c#5@4 b4@4]",
  "[c#5@6 e5@2 g#5@8]",
  "[a5@8 f#5@4 e5@4]",
  "[e5@4 a5@4 g#5@8]",
]
// The hook: a 3+3+2 climb to a held peak, then a two-note fall.
const CHORUS_MEL = [
  "[c#5@3 e5@3 a5@6 g#5@2 e5@2]",
  "[b4@3 e5@3 g#5@6 f#5@2 e5@2]",
  "[a4@3 c#5@3 f#5@6 e5@2 c#5@2]",
  "[a4@3 d5@3 e5@10]",
  "[d5@3 f#5@3 b5@6 a5@2 f#5@2]",
  "[e5@3 a5@5 g#5@8]",
  "[c5@3 f5@3 a5@6 g5@2 f5@2]",
  "[d5@3 g5@3 b5@6 a5@2 g5@2]",
]
const FINAL_MEL = [...CHORUS_MEL, ...CHORUS_MEL.slice(0, 7), "[d5@3 g5@3 b5@10]"]
// Harmony under the hook for the last chorus, mostly chord tones a third to a sixth below.
const CHORUS_HARM = [
  "[a4@3 c#5@3 e5@6 e5@2 c#5@2]",
  "[g#4@3 b4@3 e5@6 d5@2 b4@2]",
  "[f#4@3 a4@3 c#5@6 c#5@2 a4@2]",
  "[f#4@3 a4@3 c#5@10]",
  "[b4@3 d5@3 f#5@6 f#5@2 d5@2]",
  "[b4@3 e5@5 e5@8]",
  "[a4@3 c5@3 f5@6 e5@2 c5@2]",
  "[b4@3 d5@3 g5@6 e5@2 d5@2]",
]
const FINAL_HARM = [...CHORUS_HARM, ...CHORUS_HARM.slice(0, 7), "[b4@3 d5@3 g5@10]"]
// Vibraphone answers for verse 2: the hook's rising arpeggio, heard early.
const VERSE_ANSWERS = [
  "~", "[~@8 e5@2 a5@2 c#6@4]",
  "~", "[~@8 e5@2 g#5@2 b5@4]",
  "~", "[~@8 f#5@2 a5@2 e6@4]",
  "~", "[~@8 f5@2 g#5@2 b5@4]",
]
const RIFF_MEL = [
  "[e5@2 a5@2 b5@2 c#6@4 b5@2 a5@2 e5@2]",
  "[e5@2 g#5@2 a5@2 b5@4 a5@2 g#5@2 e5@2]",
  "[e5@2 f#5@2 g#5@2 a5@4 g#5@2 f#5@2 c#5@2]",
  "[e5@2 f#5@2 a5@2 c#6@6 b5@2 a5@2]",
]
const BRIDGE_RIFF = [
  "[d5@2 g5@2 a5@2 b5@4 a5@2 f#5@2 d5@2]",
  "[e5@2 a5@2 b5@2 c#6@4 b5@2 a5@2 f#5@2]",
  "[d5@2 g5@2 a5@2 b5@4 a5@2 f#5@2 d5@2]",
  "[e5@2 a5@2 b5@2 c#6@6 d6@2 e6@2]",
]
const OUTRO_RIFF = [
  ...RIFF_MEL,
  "[e5@2 f5@2 a5@2 c6@4 a5@2 g5@2 e5@2]",
  "[d5@2 g5@2 a5@2 b5@4 a5@2 g5@2 e5@2]",
  "~",
  "~",
]
const BRIDGE_MEL = [
  "[~@4 f#4@2 a4@2 c#5@8]",
  "[b4@4 g#4@4 e4@8]",
  "[~@4 d4@2 f#4@2 c#5@8]",
  "[b4@4 a4@4 b4@8]",
  "[~@4 f#4@2 a4@2 e5@8]",
  "[c#5@4 e5@4 g#5@8]",
  "[a5@8 g#5@4 e5@4]",
  "[f#5@16]",
  "~", "~", "~", "~",
]

// ------------------------------------------------------------------ instruments

const pad = (ch, cut, g) => note(ch).s("supersaw").unison(5).detune(0.25).spread(0.85)
  .attack(0.3).decay(0.4).sustain(0.85).release(1.2)
  .lpf(cut).lpq(0.3).gain(g).room(0.5).roomsize(6).orbit(2)

const strings = (ch, g) => note(ch).s("gm_string_ensemble_1")
  .attack(0.5).release(1.5).gain(g).orbit(2)

const choir = (ch, g) => note(ch).s("gm_choir_aahs")
  .attack(0.35).release(1.5).gain(g).orbit(2)

const bass = (roots, rhythm, pops, cut, g) => note(roots.struct(rhythm).add(pops))
  .s("sawtooth").attack(0.004).decay(0.18).sustain(0.55).release(0.05).clip(0.92)
  .lpf(cut).lpq(7).lpenv(2).lpdecay(0.14).lpsustain(0.15)
  .gain(g).orbit(3)

const sub = (roots, g) => note(roots).s("sine").attack(0.02).release(0.3).gain(g).orbit(3)

const leadSoft = (mel, cut, g) => stack(
  note(mel).s("sawtooth").lpf(cut).lpq(1.2).gain(g),
  note(mel).s("triangle").gain(g * 0.9),
).attack(0.015).decay(0.4).sustain(0.7).release(0.35).vib(5).vibmod(0.12)
  .delay(0.28).delaytime(ECHO).delayfeedback(0.32).room(0.35).roomsize(4).orbit(4)

const leadBig = (mel, g) => stack(
  note(mel).s("supersaw").unison(3).detune(0.12).spread(0.5).lpf(3800).lpq(1.5).gain(g),
  note(mel).transpose(-12).s("square").lpf(1800).gain(g * 0.45),
).attack(0.01).decay(0.35).sustain(0.75).release(0.3).vib(5.5).vibmod(0.14)
  .delay(0.28).delaytime(ECHO).delayfeedback(0.32).room(0.35).roomsize(4).orbit(4)

const harmony = (mel, g) => note(mel).s("supersaw").unison(3).detune(0.14).spread(0.6)
  .attack(0.01).decay(0.35).sustain(0.75).release(0.3).vib(5.5).vibmod(0.14)
  .lpf(2800).lpq(1).gain(g).pan(0.38)
  .delay(0.28).delaytime(ECHO).delayfeedback(0.32).room(0.35).roomsize(4).orbit(4)

const sparkle = (mel, g) => note(mel).transpose(12).s("sine")
  .attack(0.01).decay(0.25).sustain(0.4).release(0.4).gain(g)
  .delay(0.28).delaytime(ECHO).delayfeedback(0.32).room(0.35).roomsize(4).orbit(4)

const celesta = (mel, g) => note(mel).transpose(12).s("gm_celesta").gain(g)
  .delay(0.28).delaytime(ECHO).delayfeedback(0.32).room(0.35).roomsize(4).orbit(4)

const pluck = (mel, cut, g) => stack(
  note(mel).s("sawtooth").gain(g),
  note(mel).transpose(-12).s("square").gain(g * 0.5),
).attack(0.002).decay(0.28).sustain(0.08).release(0.25)
  .lpf(cut).lpq(5).lpenv(2.5).lpdecay(0.18)
  .delay(0.42).delaytime(ECHO).delayfeedback(0.46).room(0.3).roomsize(4).pan(0.42).orbit(5)

const arp = (ch, order, shift, cut, g) => note(ch).arp(order).transpose(shift).s("square")
  .attack(0.002).decay(0.14).sustain(0).release(0.1)
  .lpf(cut).lpq(3).gain(g).pan(0.62)
  .delay(0.25).delaytime(ECHO).delayfeedback(0.3).orbit(7)

const vibes = (mel, g) => note(mel).s("vibraphone").gain(g).pan(0.3)
  .room(0.45).roomsize(5).orbit(9)

const piano = (pat, g) => note(pat).s("piano").gain(g).room(0.45).roomsize(5).orbit(9)

// ------------------------------------------------------------------ drums

const kick = (rhythm, g) => s("bd").bank("RolandTR909").struct(rhythm).gain(g).orbit(1)
  .duckorbit("2:3:7").duckattack(0.14).duckdepth(0.6)

const snare = (rhythm, g) => stack(
  s("sd").bank("LinnDrum").struct(rhythm).gain(g),
  s("cp").bank("RolandTR909").struct(rhythm).gain(g * 0.35),
  s("white").struct(rhythm).attack(0.001).decay(0.2).sustain(0).hpf(1800).lpf(9000).gain(g * 0.3),
).room(0.55).roomsize(2.2).orbit(6)

const hats = (rhythm, g) => s("hh").bank("LinnDrum").struct(rhythm).gain(g).orbit(1)
const openHats = (rhythm, g) => s("oh").bank("LinnDrum").struct(rhythm).gain(g).orbit(1)
const shaker = (rhythm, g) => s("sh").bank("LinnDrum").struct(rhythm).gain(g).orbit(1)
const tamb = (rhythm, g) => s("tambourine").struct(rhythm).gain(g).orbit(1)

const crash = (rhythm, g) => s("cr").bank("RolandTR909").struct(rhythm).gain(g)
  .room(0.3).roomsize(6).orbit(8)
const swell = (rhythm, g) => s("cr").bank("RolandTR909").struct(rhythm).speed(-1).gain(g).orbit(8)
const riser = (rhythm, secs, g) => s("white").struct(rhythm)
  .attack(secs).sustain(1).release(0.05).hpf(400).lpf(600).lpenv(5).lpattack(secs)
  .gain(g).orbit(8)
const toms = (pat, g) => s(pat).bank("LinnDrum").gain(g).orbit(6)

const KICK_VERSE = "<[x ~ ~ ~ ~ ~ ~ ~ x ~ x ~ ~ ~ ~ ~] [x ~ ~ ~ ~ ~ ~ ~ x ~ x ~ ~ ~ ~ x]>"
const HAT_ACCENT = "[0.55 0.35 1 0.35]*4"

// ------------------------------------------------------------------ sections

const INTRO = stack(
  note("c4").s("sine").gain(0).orbit("<[2,3,7] ~ ~ ~ ~ ~ ~ ~>"), // opens the ducked orbits
  pad(cat(...RIFF_CH), "<500 650 800 1000 1200 1450 1700 2000>", 0.18),
  pluck(cat(...RIFF_MEL), "<700 900 1100 1400 1800 2200 2700 3300>", 0.22).mask("<0 0 1 1 1 1 1 1>"),
  sub(RIFF_B, 0.2).mask("<0 0 0 0 1 1 1 1>"),
  kick("x*4", 0.16).lpf(300).mask("<0 0 0 0 1 1 1 1>"),
  hats("x*8", 0.1).mask("<0 0 0 0 0 0 1 1>"),
  s("marktrees").struct("<x ~ ~ ~ ~ ~ ~ ~>").gain(0.25).room(0.3).roomsize(6).orbit(8),
  riser("~ ~ ~ x", 4.3, 0.18).slow(8),
  swell("<~ ~ ~ ~ ~ ~ ~ x>", 0.3),
)

const VERSE1 = stack(
  kick(KICK_VERSE, 0.36),
  snare("~ x ~ x", 0.45).velocity("<0.65!8 1!8>"),
  hats("<[x*8]!8 [x*16]!8>", 0.17).velocity(HAT_ACCENT),
  shaker("x*16", 0.1).mask("<0!8 1!8>"),
  bass(VERSE_B, "x*8", "<[0 0 0 0 0 0 0 0]!8 [0 0 0 0 0 0 0 12]!8>", "<350!8 550!8>", 0.34),
  sub(VERSE_B, 0.22),
  pad(cat(...VERSE_CH), 1100, 0.17),
  leadSoft(cat(...VERSE_MEL_A, ...VERSE_MEL_B), 1600, 0.27),
  arp(cat(...VERSE_CH), "[0 1 2 3]*4", 12, 1400, 0.14).mask("<0!8 1!8>"),
)

const PRE = (second) => stack(
  kick(cat(...rep(KICK_VERSE, 4), "x*4", "x*4", "x*4", "[x x ~ ~]"), 0.42),
  snare(cat(...rep("~ x ~ x", 6), "~ x ~ [x x]", "x*16"), 0.48)
    .velocity(cat(...rep("1", 7), "[0.2 0.25 0.3 0.35 0.4 0.45 0.5 0.55 0.6 0.65 0.7 0.75 0.8 0.85 0.9 1]")),
  hats("x*16", 0.2).velocity(HAT_ACCENT),
  shaker("x*16", 0.1),
  second ? toms(cat(...rep("~", 7), "[~@8 ht ht mt mt lt lt lt lt]"), 0.3) : silence,
  bass(PRE_B, "x*8", "0 0 0 0 0 0 0 12", "<500 600 700 800 900 1000 1150 1300>", 0.4),
  sub(PRE_B, 0.25),
  pad(cat(...PRE_CH), "<1300 1500 1700 1900 2100 2300 2600 2900>", 0.19),
  arp(cat(...PRE_CH), "[0 1 2 3]*4", 12, "<1200 1400 1600 1800 2000 2200 2500 2800>", 0.16),
  leadSoft(cat(...PRE_MEL), 2200, 0.3),
  riser("~ ~ ~ x", 4.3, 0.2).slow(8),
  swell("<~ ~ ~ ~ ~ ~ ~ x>", 0.3),
)

const CHORUS = (k, big, mel, harm) => stack(
  kick("x*4", 0.45),
  snare(cat(...rep("~ x ~ x", 7), "~ x ~ [x x x x]"), 0.54)
    .velocity(cat(...rep("1", 7), "[1 1 1 [0.5 0.65 0.8 1]]")),
  hats("x*16", 0.15).velocity(HAT_ACCENT),
  openHats("[~ x]*4", 0.12),
  shaker("x*16", 0.1),
  crash(big ? "<x ~ ~ ~>" : "<x ~ ~ ~ ~ ~ ~ ~>", 0.35),
  bass(CHORUS_B.add(k), "x*16", "[0 0 12 0]*4", 850, 0.42),
  sub(CHORUS_B.add(k), 0.26),
  pad(cat(...CHORUS_CH).transpose(k), 2600, 0.24),
  arp(cat(...CHORUS_CH).transpose(k), "[0 1 2 3 1 2 3 2]*2", 24, 3000, 0.2),
  leadBig(cat(...mel).transpose(k), big ? 0.6 : 0.55),
  sparkle(cat(...mel).transpose(k), 0.1).mask(big ? "1" : "<0!8 1!8>"),
  big ? stack(
    strings(cat(...CHORUS_CH).transpose(k + 12), 0.2),
    choir(cat(...CHORUS_CH).transpose(k), 0.32),
    celesta(cat(...mel).transpose(k), 0.2),
    harmony(cat(...harm).transpose(k), 0.3),
    tamb("[~ x]*4", 0.2),
  ) : silence,
)

const POST = stack(
  kick("x*4", 0.45),
  snare(cat(...rep("~ x ~ x", 7), "~ x ~ [x x x x]"), 0.5),
  hats("x*16", 0.15).velocity(HAT_ACCENT),
  openHats("[~ x]*4", 0.1),
  crash("<x ~ ~ ~ ~ ~ ~ ~>", 0.35),
  bass(RIFF_B, "x*8", "[0 12]*4", 900, 0.4),
  sub(RIFF_B, 0.26),
  pad(cat(...RIFF_CH), 2400, 0.2),
  pluck(cat(...RIFF_MEL), 3600, 0.3),
)

const VERSE2 = stack(
  kick(KICK_VERSE, 0.36),
  snare("~ x ~ x", 0.45),
  hats("x*16", 0.2).velocity(HAT_ACCENT),
  shaker("x*16", 0.1),
  bass(VERSE_B, "x*8", "0 0 0 0 0 0 0 12", 550, 0.34),
  sub(VERSE_B, 0.22),
  pad(cat(...VERSE_CH), 1200, 0.17),
  leadSoft(cat(...VERSE_MEL_B), 1700, 0.27),
  vibes(cat(...VERSE_ANSWERS), 0.3),
  arp(cat(...VERSE_CH), "[0 1 2 3]*4", 12, 1500, 0.14),
)

const BRIDGE = stack(
  piano(cat(...BRIDGE_CH).transpose(-12).struct("x@3 x@3 x@2"), 0.22),
  piano(BRIDGE_B.add(12), 0.25),
  piano(cat(...BRIDGE_MEL), 0.4),
  strings(cat(...BRIDGE_CH), 0.16),
  crash("<x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~>", 0.3),
  sub(BRIDGE_B, 0.2),
  kick(cat(...rep("~", 4), ...rep("[x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~]", 4), "x*4", "x*4", "x*4", "[x x ~ ~]"), 0.36),
  snare(cat(...rep("~", 6), "~ ~ x ~", "~ ~ x ~", "~ ~ x ~", "~ x ~ x", "x*8", "x*16"), 0.48)
    .velocity(cat(...rep("1", 11), "[0.2 0.25 0.3 0.35 0.4 0.45 0.5 0.55 0.6 0.65 0.7 0.75 0.8 0.85 0.9 1]")),
  hats("x*16", 0.18).velocity(HAT_ACCENT).mask("<0!8 1!4>"),
  bass(BRIDGE_B, "<[x*8]!10 [x*16]!2>", "0", "<400!8 600 800 1000 1300>", 0.38).mask("<0!8 1!4>"),
  pluck(cat(...rep("~", 8), ...BRIDGE_RIFF), "<2000!8 1500 2000 2700 3500>", 0.26),
  riser("~ ~ x", 8.6, 0.22).slow(12),
  swell("<~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x>", 0.32),
)

const OUTRO = stack(
  kick(cat(...rep("x*4", 6), "[x ~ ~ ~]", "~"), 0.42),
  snare(cat(...rep("~ x ~ x", 5), "~ x ~ [x x x x]", "~", "~"), 0.5),
  hats(cat(...rep("x*16", 6), "~", "~"), 0.2).velocity(HAT_ACCENT),
  crash("<x ~ ~ ~ ~ ~ x ~>", 0.35),
  bass(OUTRO_B.add(2), "<[x*8]!6 [x ~ ~ ~] ~>", "0", 800, 0.4),
  sub(OUTRO_B.add(2), 0.26),
  pad(cat(...OUTRO_CH).transpose(2), 2200, 0.22).release(3),
  strings(cat(...OUTRO_CH).transpose(14), 0.16),
  pluck(cat(...OUTRO_RIFF).transpose(2), 3200, 0.3),
  leadBig(cat(...rep("~", 6), "[c#5@3 e5@3 a5@10]", "~").transpose(2), 0.55),
  s("marktrees").struct("<~ ~ ~ ~ ~ ~ x ~>").gain(0.25).room(0.3).roomsize(6).orbit(8),
)

arrange(
  [8, INTRO],
  [16, VERSE1],
  [8, PRE(false)],
  [16, CHORUS(0, false, CHORUS_MEL)],
  [8, POST],
  [8, VERSE2],
  [8, PRE(true)],
  [8, CHORUS(0, false, CHORUS_MEL)],
  [12, BRIDGE],
  [16, CHORUS(2, true, FINAL_MEL, FINAL_HARM)],
  [8, OUTRO],
).postgain(0.74)
