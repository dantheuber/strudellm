// Long Exposure
// Melodic electronica in D minor, 122 BPM. 112 bars (3:40), then it loops.
//
// The piano cycles a three-note cell in sixteenths. Sixteen doesn't divide by
// three, so each bar starts one note further along and the accents drift
// against the beat. The hook comes back four ways: a whistle in the verse, a
// supersaw in the drops, a choir over new chords in the breakdown, and in
// D major at sunrise.

setcpm(122 / 4)

// ---------- harmony ----------

// bass: bass synth root. lh: piano left hand. pad: pad voicing.
// cell: the three notes the piano ostinato cycles through.
const CHORD = {
  'Dm9':    { bass: 'd2',  lh: 'd3,a3',   pad: 'f3,a3,c4,e4',   cell: 'a4 e5 d5' },
  'Bbmaj9': { bass: 'bb1', lh: 'bb2,f3',  pad: 'f3,a3,c4,d4',   cell: 'a4 d5 c5' },
  'Gm9':    { bass: 'g1',  lh: 'g2,d3',   pad: 'f3,a3,bb3,d4',  cell: 'a4 d5 bb4' },
  'A7sus':  { bass: 'a1',  lh: 'a2,e3',   pad: 'e3,g3,a3,d4',   cell: 'a4 e5 d5' },
  'A7b9':   { bass: 'a1',  lh: 'a2,e3',   pad: 'e3,g3,bb3,c#4', cell: 'bb4 e5 c#5' },
  'F/A':    { bass: 'a1',  lh: 'a2,f3',   pad: 'f3,a3,c4,e4',   cell: 'a4 e5 c5' },
  'Dm/F':   { bass: 'f1',  lh: 'f2,c3',   pad: 'f3,a3,d4,e4',   cell: 'a4 e5 d5' },
  'Ebmaj7': { bass: 'eb1', lh: 'eb2,bb2', pad: 'g3,bb3,d4,f4',  cell: 'a4 d5 bb4' },
  'Dmaj9':  { bass: 'd2',  lh: 'd3,a3',   pad: 'f#3,a3,c#4,e4', cell: 'a4 f#5 e5' },
  'Gm6':    { bass: 'g1',  lh: 'g2,d3',   pad: 'g3,bb3,d4,e4',  cell: 'bb4 e5 d5' },
}

const MAIN = ['Dm9', 'Dm9', 'Bbmaj9', 'Bbmaj9', 'Gm9', 'Gm9', 'A7sus', 'A7b9']
const LIFT = ['Bbmaj9', 'Bbmaj9', 'Gm9', 'Gm9', 'A7sus', 'A7sus', 'A7b9', 'A7b9']
const DRIFT = ['Bbmaj9', 'F/A', 'Gm9', 'Dm/F', 'Ebmaj7', 'Ebmaj7', 'A7sus', 'A7b9']
const DAWN = ['Bbmaj9', 'Bbmaj9', 'Dmaj9', 'Dmaj9', 'Gm6', 'Gm6', 'Dmaj9', 'Dmaj9']

// ---------- melodies: one string per bar, in eighth notes ----------

const REST = ['~', '~', '~', '~', '~', '~', '~', '~']
const HOOK = [
  'd5@3 e5@3 f5@2', 'e5@3 c5@3 a4@2', 'd5', '~@6 c5 d5',
  'f5@3 d5@3 bb4@2', 'a4@3 bb4@3 d5@2', 'e5@6 d5@2', 'c#5',
]
const ANSWER = [
  'd5@3 e5@3 f5@2', 'a5@3 g5@3 e5@2', 'f5@6 e5 d5', 'd5@6 c5 d5',
  'f5@3 d5@3 bb4@2', 'a5@3 g5@3 f5@2', 'e5@6 d5@2', 'c#5@3 e5@3 g5@2',
]
// the hook's opening D E F comes back as D E F# once D major arrives
const SUNRISE = [
  'd5@3 e5@3 f5@2', 'a5@3 g5@3 e5@2', 'f#5@6 e5 d5', 'd5@6 c#5 d5',
  'g5@3 d5@3 bb4@2', 'a5@3 g5@3 e5@2', 'd5@3 e5@3 f#5@2', 'f#5',
]
const LAST_LIGHT = [
  'd5', '~', 'd5@3 e5@3 f#5@2', 'e5@3 c#5@3 a4@2',
  'd5@3 e5@3 g5@2', 'e5@3 d5@3 bb4@2', 'a4@3 c#5@3 e5@2', 'd5',
]

// ---------- pattern builders ----------

// '<a b c ...>' with one entry per bar
const perBar = (bars, fn) => mini('<' + bars.map(fn).join(' ') + '>')

// like perBar, but a chord repeated in the next bar is held instead of restruck
const held = (bars, fn) => {
  const runs = []
  for (const c of bars) {
    const last = runs[runs.length - 1]
    if (last && last.chord === c) last.bars++
    else runs.push({ chord: c, bars: 1 })
  }
  return mini('<' + runs.map(r => '[' + fn(r.chord) + ']@' + r.bars).join(' ') + '>')
}

// sixteenths through each chord's cell; the cell keeps cycling across bar
// lines, so every bar starts on the next note of it
const ostinato = bars => perBar(bars, (c, i) => {
  const cell = CHORD[c].cell.split(' ')
  return '[' + Array.from({ length: 16 }, (_, k) => cell[(k + i) % 3]).join(' ') + ']'
})

const melody = bars => mini('<' + bars.map(b => '[' + b + ']').join(' ') + '>')
const roots = bars => note(perBar(bars, c => CHORD[c].bass))
const chords = bars => note(held(bars, c => CHORD[c].pad))

// ---------- instruments ----------
// orbits: 1 drums, 2 bass, 3 pads, 4 piano, 5 leads, 6 choir and bells, 7 fx

const piano = bars => note(ostinato(bars)).s('piano')
  .gain("[.5 .28 .38 .28]*4".add(rand.range(-.03, .03)))
  .pan("[.4 .6]*8").release(1.2).room(.45).roomsize(5).orbit(4)

const leftHand = bars => note(perBar(bars, c => '[' + CHORD[c].lh + ']')).s('piano')
  .gain(.45).release(3.5).room(.45).roomsize(5).orbit(4)

const strum = chord => note(chord).s('piano').gain(.4).room(.45).roomsize(5).orbit(4)

const warmPad = bars => chords(bars).s('supersaw').unison(4).detune(.12)
  .lpf(750).attack(1.2).release(2.5).gain(.28).room(.6).roomsize(8).orbit(3)

const widePad = bars => chords(bars).s('supersaw').unison(7).detune(.28)
  .lpf(2400).attack(.06).release(1.2).gain(.22).room(.5).roomsize(8).orbit(3)

const stabs = bars => chords(bars).struct("x*8").s('supersaw').unison(5).detune(.2)
  .decay(.2).sustain(.3).release(.15).gain(.34).room(.5).roomsize(8).orbit(3)

const bassVoice = (pat, cutoff) => pat.layer(
  x => x.s('sawtooth').lpf(cutoff).lpenv(2.5).lpdecay(.18).lpq(3).gain(.3),
  x => x.s('sine').gain(.38),
).decay(.3).sustain(.6).release(.08).orbit(2)

// 3+3+2 eighths, the last hit an octave up
const bassDotted = (bars, cutoff = 300) =>
  bassVoice(roots(bars).struct("x ~ ~ x ~ ~ x ~").add(note("0 0 0 0 0 0 12 0")), cutoff)

// three sixteenths after every kick
const bassRolling = (bars, cutoff = 600) =>
  bassVoice(roots(bars).struct("[~ x x x]*4").add(note("[0 0 0 0]*3 [0 0 12 0]")), cutoff)

const whistle = pat => note(pat).s('sine').fm(.6).fmh(2).vib(5).vibmod(.12)
  .attack(.05).release(.5).gain(.3).delay(.35).delayfeedback(.4)
  .room(.5).roomsize(6).orbit(5)

const sawLead = pat => note(pat).layer(
  x => x.s('supersaw').unison(6).detune(.2).lpf(3600).gain(.58),
  x => x.s('triangle').add(note(12)).gain(.17),
).attack(.02).decay(.4).sustain(.75).release(.35)
  .delay(.3).delayfeedback(.4).room(.4).roomsize(6).orbit(5)

const choir = pat => note(pat).add(note(-12)).s('gm_choir_aahs')
  .attack(.3).release(1.8).gain(.6).room(.7).roomsize(9).orbit(6)

// five-note figure in eighths, so it realigns with the bar only every five bars
const bells = bars => chords(bars).arp("0 2 1 3 2".fast(8 / 5)).add(note(24))
  .s('sine').fm(4).fmh(3.5).fmdecay(.3).fmsustain(0).decay(.5).sustain(0)
  .gain(.13).pan(sine.range(.25, .75).slow(3)).delay(.4).delayfeedback(.45)
  .room(.6).roomsize(9).orbit(6)

const drums = pat => s(pat).bank('RolandTR909').room(.15).roomsize(2).orbit(1)
const kick = pat => drums(pat).gain(.5)
const pump = pat => kick(pat).duckorbit("2:3").duckattack(".16:.24").duckdepth(".5:.75")
// a clap roll closes every eight-bar phrase
const clap = () => drums("<[~ cp ~ cp]!7 [~ cp ~ [cp cp cp cp]]>").gain(.62).hpf(250).room(.3)
const hats = () => drums("hh*16").gain("[.38 .17 .28 .17]*4").hpf(6000).pan(.55)
const openHats = () => drums("[~ oh]*4").gain(.14).hpf(4000).pan(.45)
const ride = () => drums("rd*8").gain("[.1 .06]*4").pan(.62)
const crash = () => drums("<cr ~!7>").gain(.19)
const rim = () => drums("rim").struct("x ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~ ~ ~")
  .gain(.17).pan(.7).delay(.25).delayfeedback(.35)
const snareRoll = () => drums("<sd*4 sd*4 sd*8 sd*8 sd*16 sd*16 sd*16 [[sd*4]*3 ~]>")
  .gain(saw.range(.15, .6).slow(8)).speed(saw.range(.9, 1.3).slow(8))
  .hpf(saw.range(200, 1500).slow(8))
const tomFill = () => drums("~ ~ ~ ~ ~ ~ ~ ~ lt ~ lt mt ~ mt ht ht").gain(.25)

const crackle = () => s('crackle').density(.08).hpf(1200).gain(.9).orbit(7)
const riser = bars => s('white').slow(bars).hpf(300).hpenv(5).hpattack(bars * 1.9).hpsustain(1)
  .attack(bars * 1.7).release(.1).gain(.18).room(.4).roomsize(4).orbit(7)
const swell = () => s('white').attack(1.8).release(.05).hpf(1500).gain(.15).orbit(7)
const impact = () => note('d1').s('sine').penv(-12).pattack(.12).decay(1.4).sustain(0)
  .gain(.9).orbit(7)

// ---------- sections ----------

const intro = stack(
  piano(MAIN).lpf(saw.range(600, 6000).slow(8)),
  warmPad(MAIN).mask("<0!4 1!4>").velocity(.6),
  crackle(),
  swell().mask("<0!7 1>"),
)

const pulse = stack(
  piano(MAIN),
  leftHand(MAIN).mask("<0!8 1!8>"),
  warmPad(MAIN).velocity(.6),
  bassDotted(MAIN, 180).velocity(.8),
  kick("bd ~ ~ bd ~ ~ bd ~").lpf(900).velocity(.6),
  drums("[~ hh]*4").gain(.18).hpf(8000),
  bells(MAIN).mask("<0!8 1!8>"),
  rim().mask("<0!8 1!8>"),
  crackle(),
  swell().mask("<0!15 1>"),
)

const verse = stack(
  piano(MAIN).velocity(.75),
  leftHand(MAIN),
  warmPad(MAIN).velocity(.65),
  bassDotted(MAIN).velocity(.85),
  kick("<[bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~]!3 [bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ bd ~ ~]>").velocity(.6),
  clap().velocity(.8),
  hats().velocity(.9),
  rim(),
  bells(MAIN).velocity(.6),
  whistle(melody([...REST, ...HOOK])),
  tomFill().mask("<0!15 1>"),
)

const build = stack(
  piano(LIFT).velocity(saw.range(.8, 1.1).slow(8)),
  stabs(LIFT).lpf(saw.range(400, 5000).slow(8)).mask("<1!7 [1 1 1 0]>"),
  bassVoice(roots(LIFT).struct("x*8"), 300).velocity(.6).mask("<1!7 [1 1 1 0]>"),
  kick("<bd*4!6 bd*8 ~>"),
  clap().mask("<1!4 0!4>"),
  hats().velocity(saw.range(.6, 1.2).slow(8)).mask("<1!7 [1 1 1 0]>"),
  snareRoll(),
  riser(8),
)

const drop = stack(
  pump("bd*4"),
  clap(),
  hats(),
  openHats(),
  crash(),
  impact().mask("<1 0!15>"),
  bassRolling(MAIN),
  widePad(MAIN),
  sawLead(melody([...HOOK, ...ANSWER])),
  piano(MAIN).velocity(.7),
  rim().mask("<0!8 1!8>"),
)

const breakdown = stack(
  drums("cr").gain(.25).mask("<1 0!15>"),
  piano(DRIFT).velocity(.8),
  leftHand(DRIFT),
  warmPad(DRIFT).velocity(.75),
  choir(melody([...HOOK, ...ANSWER])),
  whistle(melody([...REST, ...ANSWER])).velocity(.8),
  kick("bd*4").lpf(saw.range(200, 3000).slow(8)).velocity(.6).mask("<0!8 1!7 0>"),
  bassVoice(roots(DRIFT).add(note(12)).struct("x*8"), 300).velocity(.7).mask("<0!8 1!7 [1 1 1 0]>"),
  hats().velocity(saw.range(.3, 1).slow(4)).mask("<0!12 1!3 [1 1 1 0]>"),
  snareRoll().mask("<0!8 1!8>"),
  riser(8).mask("<0!8 1!8>"),
  crackle(),
)

// everything but the lead and piano drops out for the last two beats of bar 8,
// leaving the C# hanging before the answer phrase
const gap = "<1!7 [1 0] 1!8>"

const finale = stack(
  pump("bd*4").mask(gap),
  clap().mask(gap),
  hats().mask(gap),
  openHats().mask(gap),
  ride().mask(gap),
  crash(),
  rim().mask(gap),
  impact().mask("<1 0!15>"),
  bassRolling(MAIN, 700).mask(gap),
  widePad(MAIN).lpf(3200),
  sawLead(melody([...HOOK, ...ANSWER])),
  choir(melody([...HOOK, ...ANSWER])).velocity(.6),
  bells(MAIN),
  piano(MAIN).velocity(.75),
  swell().mask("<0!15 1>"),
)

const sunrise = stack(
  pump("bd*4"),
  clap(),
  hats(),
  openHats(),
  ride(),
  crash(),
  impact().mask("<1 0!7>"),
  bassRolling(DAWN, 700),
  widePad(DAWN).lpf(3200),
  sawLead(melody(SUNRISE)),
  choir(melody(SUNRISE)).velocity(.6),
  bells(DAWN),
  piano(DAWN).velocity(.75),
)

const coda = stack(
  drums("cr").gain(.2).mask("<1 0!7>"),
  piano(DAWN).mask("<1!6 0!2>").velocity(.7),
  leftHand(DAWN).mask("<1!6 0!2>"),
  warmPad(DAWN).velocity(.6),
  whistle(melody(LAST_LIGHT)).velocity(.65),
  strum("[d2 a2 e3 f#3 a3 c#4 e4 f#4 a4] ~ ~ ~").mask("<0!6 1 0>"),
  crackle(),
)

arrange(
  [8, intro],
  [16, pulse],
  [16, verse],
  [8, build],
  [16, drop],
  [16, breakdown],
  [16, finale],
  [8, sunrise],
  [8, coda],
).postgain(.64)
