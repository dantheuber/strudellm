// Counterlight
// Melodic progressive house, 125 BPM, D minor, 5:42 (178 bars)
// by GLM-5.3 (zai-coding-plan/glm-5.3)
//
// Structure (bar numbers):
//   1-16   Overture    atmosphere, harp echoes, rising shimmer
//   17-32  Pulse       kick + sub enter, pluck motif states the theme
//   33-64  Horizon     first drop: full kit, vibraphone lead
//   65-88  Stillpoint  breakdown: piano + harp arps, long build
//   89-120 Zenith      second drop: lead an octave up, counter-melody
//   121-136 Undertow   the beat breaks into a dark 2-step, tension rise
//   137-160 Apex       final drop: augmented theme, saw lead joins
//   161-178 Afterglow  elements fade, last vibraphone statement, sustained Dm9
//
// Every voice below spans the full 178 bars as one alternation chain:
// bar N of the song is element N of each chain. Dm9 - Gm11 - Bbmaj9 - Cadd9
// carries the drops; the breakdown turns Bbmaj9 - Gm11 - Dm9 - A7sus, the
// Undertow darkens to Bbmaj7#11 - A7b13, and the Apex ends on A7sus.
//
// Paste into https://strudel.cc and press Ctrl+Enter.

setcpm(31.25) // 125 BPM, one cycle = one bar of 4/4

// ---------- helpers ----------
const rep = (n, x) => Array.from({ length: n }, () => x)       // n copies
const chain = (list) => mini('<' + list.map(b => '[' + b + ']').join(' ') + '>') // bar chain
const auto = (list) => mini('<' + list.join(' ') + '>')        // automation chain
const seg = (...pairs) => pairs.flatMap(([n, v]) => rep(n, v)) // automation segments

// ---------- chords & progressions ----------
const DM9  = 'd3,f3,a3,c4,e4'
const GM11 = 'g3,bb3,d4,f4,a4'
const BB9  = 'bb3,d4,f4,a4,c5'
const C9   = 'e3,g3,c4,d4'
const A7S  = 'e3,g3,a3,d4'       // A7sus4
const A7B  = 'g3,c#4,f4,a4'      // A7(b13)
const BBL  = 'bb3,d4,e4,a4'      // Bbmaj7(#11)
const DM_A = 'd3,a3,c4,e4'       // Dm(add9), the resting chord

const PROG_MAIN = [DM9, GM11, BB9, C9]          // one entry per chord, 2 bars each
const PROG_APEX = [DM9, GM11, BB9, A7S]
const STILL_PROG = [BB9, GM11, DM9, A7S]
const UND_PROG = [BBL, BBL, A7B, A7B]           // entries are bars here
// roots per bar for the 8-bar loops
const ROOTS_SUB = ['d1', 'd1', 'g1', 'g1', 'bb1', 'bb1', 'c2', 'c2']
const ROOTS_MID = ['d2', 'd2', 'g2', 'g2', 'bb2', 'bb2', 'c3', 'c3']
const APEX_SUB  = ['d1', 'd1', 'g1', 'g1', 'bb1', 'bb1', 'a1', 'a1']
const APEX_MID  = ['d2', 'd2', 'g2', 'g2', 'bb2', 'bb2', 'a2', 'a2']
const UND_SUB   = ['bb1', 'bb1', 'a1', 'a1']
const STILL_SUB = ['bb1', 'bb1', 'g1', 'g1', 'd1', 'd1', 'a1', 'a1']
const WALK_SUB = { d: 'c#2', g: 'a1', bb: 'c2', c: 'b1', a: 'b1' }  // approach notes
const WALK_MID = { d: 'c#3', g: 'a2', bb: 'c3', c: 'b2', a: 'b2' }
const letter = (n) => n.replace(/[0-9]/g, '')
const hold2 = (prog, form) => prog.flatMap(c => rep(2, form(c)))  // chord loop, 2 bars each

// ---------- drum vocabulary (16 sixteenth slots per bar) ----------
const K4    = 'bd ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~'
const K4CUT = 'bd ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~ ~ ~'
const K2    = 'bd ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ ~ ~'
const KBRK  = 'bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~'
const CP24  = '~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~'
const HH16  = 'hh hh hh:1 hh hh hh:1 hh hh hh:1 hh hh hh:1 hh'
const OH8   = '~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~'
const OHS   = '~ ~ oh ~ ~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ ~'
const SH16  = 'sh sh sh sh sh sh sh sh sh sh sh sh sh sh sh sh'
const RIM5  = 'rim ~ ~ rim ~ ~ rim ~ ~ ~ rim ~ ~ rim ~ ~'
const RIMQ  = 'rim ~ ~ ~ rim ~ ~ ~ rim ~ ~ ~ rim ~ ~ ~'
const SDQ   = 'sd ~ ~ ~ sd ~ ~ ~ sd ~ ~ ~ sd ~ ~ ~'
const SD8   = 'sd sd sd sd sd sd sd sd ~ ~ ~ ~ ~ ~ ~ ~'
const SD16  = 'sd sd sd sd sd sd sd sd sd sd sd sd sd sd sd sd'
const SD24  = '~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~'   // 2-step backbeat
const TOMF  = '~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ht ht lt lt'
const CR    = 'cr ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'
const RST   = '~'
const WHT   = 'white ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'

// ---------- bass vocabulary ----------
const subOff  = (n) => '~ ' + n + ' ~ ' + n + ' ~ ' + n + ' ~ ' + n // offbeat 8ths
const subRoll = (n) => rep(8, n).join(' ')                    // rolling 8ths
const subDark = (n) => n + ' ' + n + ' ~ ' + n + ' ' + n + ' ~ ' + n + ' ' + n // broken 8ths
const gallop  = (n) => '[' + n + ' ~ ' + n + ' ' + n + ']*4'  // prog gallop 16ths
const midOff  = (n) => '~ ~ ' + n + ' ~ ~ ~ ' + n + ' ~ ~ ~ ' + n + ' ~ ~ ~ ' + n + ' ~'
const octpop  = (n) => '[' + n + ' ~ ' + n + ' ' + n + ' ' + n.replace(/2$/, '3') + ' ~ ' + n + ' ' + n + ']*2'
const walk    = (pattern, n, step) =>
  step ? pattern(n).replace(/[^ ]+$/, step) : pattern(n)
const bassLoop = (roots, cycles, pattern, walks) =>
  Array.from({ length: cycles }, () => roots.map((r, i) => {
    const next = roots[(i + 1) % roots.length]
    return (i % 2 === 1) ? walk(pattern, r, walks[letter(next)]) : pattern(r)
  })).flat()
const midLoop = (roots, cycles, pops) =>
  Array.from({ length: cycles }, () => roots.map((r, i) =>
    pops.includes(i % 8) ? octpop(r) : gallop(r))).flat()

// ---------- the theme (16th grid, 8 bars) ----------
const M1 = 'a4 ~ d5 ~ f5 ~ ~ e5 ~ ~ ~ ~ ~ ~ ~ ~'
const M2 = 'd5 ~ ~ c5 ~ ~ a4 ~ ~ ~ c5 ~ ~ ~ ~ ~'
const M3 = 'g4 ~ a4 ~ bb4 ~ ~ ~ d5 ~ ~ ~ ~ ~ ~ ~'
const M4 = 'c5 ~ ~ a4 ~ ~ ~ ~ f4 ~ ~ ~ a4 ~ ~ ~'
const M5 = 'd5 ~ f5 ~ a5 ~ ~ g5 ~ ~ ~ ~ ~ ~ ~ ~'
const M6 = 'f5 ~ d5 ~ c5 ~ ~ ~ d5 ~ ~ ~ ~ ~ ~ ~'
const M7 = 'e5 ~ d5 ~ c5 ~ ~ a4 ~ ~ ~ ~ ~ ~ ~ ~'
const M8 = 'g4 ~ ~ a4 ~ ~ c5 ~ ~ ~ ~ ~ ~ ~ ~ ~'
// augmented (half-density) theme for the final drop
const A1 = 'a4 ~ ~ ~ d5 ~ f5 ~ ~ ~ e5 ~ ~ ~ ~ ~'
const A2 = 'd5 ~ ~ ~ c5 ~ a4 ~ ~ ~ ~ ~ c5 ~ ~ ~'
const A3 = 'g4 ~ a4 ~ bb4 ~ ~ ~ d5 ~ ~ ~ ~ ~ d5 ~'
const A4 = 'c5 ~ ~ ~ a4 ~ ~ ~ ~ ~ a4 ~ c5 ~ ~ ~'
const A5 = 'd5 ~ ~ ~ f5 ~ a5 ~ ~ ~ g5 ~ ~ ~ ~ ~'
const A6 = 'f5 ~ d5 ~ ~ ~ c5 ~ d5 ~ ~ ~ ~ ~ ~ ~'
const A7 = 'e5 ~ ~ ~ d5 ~ c5 ~ a4 ~ ~ ~ ~ ~ ~ ~'
const A8 = 'g4 ~ ~ ~ a4 ~ c5 ~ d5 ~ ~ ~ ~ ~ ~ ~'
// counter-melody answers (square synth), 8 bars
const CTR = [
  'f5 ~ ~ ~ ~ ~ ~ ~ d5 ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ e5 ~ ~ ~ ~ ~ c5 ~ ~ ~ ~ ~',
  'd5 ~ ~ ~ ~ ~ f5 ~ ~ ~ e5 ~ ~ ~ ~ ~',
  '~ ~ ~ ~ c5 ~ ~ ~ a4 ~ ~ ~ ~ ~ ~ ~',
  'f5 ~ ~ ~ g5 ~ ~ ~ a5 ~ ~ ~ ~ g5 ~',
  '~ ~ ~ ~ e5 ~ ~ ~ d5 ~ ~ ~ c5 ~ ~',
  'a4 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  RST
]
// glockenspiel pedal tones, 2 bars
const GLO = [
  'a5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  'd6 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'
]
// syncopated chord stab bar from the top three voices of a chord
const stab = (chord) => {
  const top = chord.split(',').slice(2).join(',')
  return '~ ~ ' + top + ' ~ ~ ~ ~ ' + top + ' ~ ~ ' + top + ' ~ ~ ~ ' + top + ' ~'
}
// lower a voicing by one octave
const down = (chord) => chord.split(',').map(n => {
  const m = n.match(/^([a-g]#?)(\d)$/)
  return m ? m[1] + (Number(m[2]) - 1) : n
}).join(',')

// ============================================================
// DRUMS
// ============================================================
const kickBars = [
  ...rep(16, RST),
  ...rep(15, K4), K4CUT,                                    // Pulse
  ...rep(31, K4), K4CUT,                                    // Horizon
  ...rep(22, RST), K4, K4,                                  // Stillpoint build
  ...rep(20, K4), ...rep(4, RST), ...rep(8, K4),            // Zenith + lift
  ...rep(12, KBRK), ...rep(4, K4),                          // Undertow
  ...rep(24, K4),                                           // Apex
  ...rep(8, K4), ...rep(8, K2), ...rep(2, RST)              // Afterglow
]
const drumsKick = s(chain(kickBars)).gain(auto(seg(
  [16, 0], [16, .92], [32, .92], [22, 0], [2, .8],
  [20, .95], [4, 0], [8, .95], [12, .88], [4, .92],
  [16, .95], [8, 1], [8, .6], [8, .35], [2, 0]
)))

const clapBars = [
  ...rep(24, RST), ...rep(8, CP24),                         // Pulse tail
  ...rep(32, CP24),                                         // Horizon
  ...rep(24, RST),                                          // Stillpoint
  ...rep(20, CP24), ...rep(4, RST), ...rep(8, CP24),        // Zenith + lift
  ...rep(16, RST),                                          // Undertow
  ...rep(24, CP24),                                         // Apex
  ...rep(8, CP24), ...rep(10, RST)                          // Afterglow
]
const drumsClap = s(chain(clapBars)).gain(auto(seg(
  [24, 0], [8, .35], [16, .55], [16, .7], [24, 0],
  [20, .7], [4, 0], [8, .7], [16, 0],
  [16, .7], [8, .75], [8, .3], [10, 0]
)))

const drumsHat = s(chain([
  ...rep(32, RST), ...rep(32, HH16),                        // Horizon
  ...rep(24, RST),                                          // Stillpoint
  ...rep(32, HH16),                                         // Zenith
  ...rep(16, RST),                                          // Undertow
  ...rep(24, HH16),                                         // Apex
  ...rep(18, RST)
])).gain(auto(seg([32, 0], [32, .42], [24, 0], [32, .44], [16, 0], [24, .46], [18, 0])))

const drumsOpenHat = s(chain([
  ...rep(20, RST), ...rep(12, OH8),                         // Pulse tail
  ...rep(32, OH8),                                          // Horizon
  ...rep(22, RST), ...rep(2, OH8),                          // Stillpoint build
  ...rep(32, OH8),                                          // Zenith
  ...rep(8, OHS), ...rep(8, OH8),                           // Undertow
  ...rep(24, OH8),                                          // Apex
  ...rep(6, OH8), ...rep(12, RST)                           // Afterglow
])).gain(auto(seg(
  [20, 0], [12, .42], [32, .45], [22, 0], [2, .33],
  [32, .46], [8, .4], [8, .55], [24, .48], [6, .25], [12, 0]
)))

const drumsShaker = s(chain([...rep(16, RST), ...rep(162, SH16)]))
  .gain(auto(seg(
    [16, 0], [8, .2], [4, .22], [4, .26],                   // Pulse ramp
    [32, .24],                                              // Horizon
    [16, .1], [4, 0], [4, .15],                             // Stillpoint + build
    [32, .25],                                              // Zenith
    [16, .24],                                              // Undertow
    [24, .26],                                              // Apex
    [8, .18], [4, .12], [6, 0]                              // Afterglow fade
  )))

const drumsRim = s(chain([
  ...rep(12, RST), ...rep(4, RIMQ),                         // Overture ticks
  ...rep(24, RST), ...rep(16, RIM5),                        // Horizon middle
  ...rep(32, RST), ...rep(16, RIM5),                        // Zenith start
  ...rep(32, RST), ...rep(24, RIM5),                        // Apex
  ...rep(18, RST)
])).gain(.18)

// snare: section-ending rolls, the breakdown build, the 2-step backbeat
const drumsSnare = s(chain([
  ...rep(15, RST), SD16,                                    // bar 16 roll
  ...rep(15, RST), SD16,                                    // bar 32 roll
  ...rep(15, RST), SD8,                                     // bar 48 fill
  ...rep(15, RST), SD16,                                    // bar 64 roll
  ...rep(20, RST), SDQ, SD8, SD16, SD16,                    // Stillpoint build
  ...rep(31, RST), SD16,                                    // bar 120 roll
  ...rep(12, SD24), SDQ, SD8, SD16, SD16,                   // Undertow
  ...rep(23, RST), SD16,                                    // bar 160 roll
  ...rep(18, RST)
])).gain(auto(seg(
  [15, 0], [1, .8], [15, 0], [1, .8], [15, 0], [1, .5], [15, 0], [1, .8],
  [20, 0], [1, .25], [1, .32], [1, .4], [1, .55],
  [31, 0], [1, .8],
  [12, .6], [1, .55], [1, .7], [2, 1],
  [23, 0], [1, .85], [18, 0]
))).release(.05)

// toms punctuate the Apex every 8 bars
const drumsToms = s(chain([
  ...rep(136, RST),
  ...rep(7, RST), TOMF, ...rep(7, RST), TOMF, ...rep(7, RST), TOMF,
  ...rep(18, RST)
])).gain(.5).room(.4)

// crashes at section entries and re-entries
const drumsCrash = s(chain([
  ...rep(16, RST), CR, ...rep(15, RST),                     // bar 17
  CR, ...rep(15, RST),                                      // bar 33
  CR, ...rep(15, RST),                                      // bar 49
  CR, ...rep(23, RST),                                      // bar 65
  CR, ...rep(19, RST), ...rep(4, RST),                      // bar 89, lift 109-112
  CR, ...rep(7, RST),                                       // bar 113
  CR, ...rep(15, RST),                                      // bar 121
  CR, ...rep(7, RST),                                       // bar 137
  CR, ...rep(7, RST),                                       // bar 145
  CR, ...rep(7, RST),                                       // bar 153
  CR, ...rep(17, RST)                                       // bar 161
])).gain(auto(seg(
  [16, 0], [1, .35], [15, 0], [1, .5], [15, 0], [1, .35], [15, 0],
  [1, .45], [23, 0], [1, .55], [23, 0], [1, .6], [7, 0],
  [1, .3], [15, 0], [1, .6], [7, 0], [1, .4], [7, 0], [1, .5], [7, 0],
  [1, .3], [17, 0]
))).room(.8)

// ============================================================
// BASS
// ============================================================
const subBars = [
  ...rep(16, RST),
  ...bassLoop(ROOTS_SUB, 2, subOff, WALK_SUB),              // Pulse
  ...bassLoop(ROOTS_SUB, 4, subRoll, WALK_SUB),             // Horizon
  ...Array.from({ length: 3 }, () => STILL_SUB).flat(),     // Stillpoint breathing
  ...bassLoop(ROOTS_SUB, 4, subRoll, WALK_SUB),             // Zenith
  ...bassLoop(UND_SUB, 4, subDark, WALK_SUB),               // Undertow
  ...bassLoop(APEX_SUB, 3, subRoll, WALK_SUB),              // Apex
  ...rep(18, 'd1')                                          // Afterglow
]
const bassSub = note(chain(subBars)).s('sine').gain(auto(seg(
  [16, 0], [16, .62], [32, .66], [24, .3], [32, .68],
  [16, .64], [24, .7], [8, .4], [6, .3], [4, .25]
))).attack(.05).release(.15)

const midBars = [
  ...rep(24, RST),
  ...bassLoop(ROOTS_MID, 1, midOff, WALK_MID),              // Pulse tail
  ...bassLoop(ROOTS_MID, 2, midOff, WALK_MID),              // Horizon first half
  ...midLoop(ROOTS_MID, 2, []),                             // Horizon gallop
  ...rep(24, RST),
  ...midLoop(ROOTS_MID, 4, [6, 7]),                         // Zenith
  ...rep(16, RST),
  ...midLoop(APEX_MID, 3, [6, 7]),                          // Apex
  ...rep(18, RST)
]
const bassMid = note(chain(midBars)).s('sawtooth').gain(.32).lpf(560).release(.08)

// long dark saw tones under the Undertow
const undSub = note(chain([
  ...rep(120, RST),
  ...Array.from({ length: 4 }, () => ['bb2', 'bb2', 'a2', 'a2']).flat(),
  ...rep(42, RST)
])).s('sawtooth').gain(.3).attack(.3).release(.5).lpf(700)

// ============================================================
// HARMONY BEDS
// ============================================================
// sustained pads: Overture, Stillpoint, Undertow, Afterglow
const padSustain = note(chain([
  ...rep(8, DM9), ...rep(4, GM11), ...rep(4, DM9),          // Overture
  ...rep(48, RST),
  ...hold2(STILL_PROG, c => c), ...hold2(STILL_PROG, c => c), ...hold2(STILL_PROG, c => c),
  ...rep(32, RST),
  ...hold2(UND_PROG, c => c), ...hold2(UND_PROG, c => c),
  ...rep(24, RST),
  ...rep(4, DM9), ...rep(4, GM11), ...rep(4, DM9), ...rep(6, DM_A)
])).s('sawtooth')
  .gain(auto(seg([16, .42], [48, 0], [24, .48], [32, 0], [16, .45], [24, 0], [18, .44])))
  .attack(auto(seg([16, .9], [48, .1], [24, .6], [32, .1], [16, .5], [24, .1], [18, .7])))
  .release(auto(seg([16, 1.2], [48, .1], [24, 1.4], [32, .1], [16, 1], [24, .1], [18, 1.6])))
  .lpf(auto(seg(
    [2, 450], [2, 520], [2, 600], [2, 700], [2, 820], [2, 950], [2, 1050], [2, 1150],
    [48, 1000],
    [2, 650], [2, 750], [2, 850], [2, 950], [2, 1050], [2, 1150], [2, 1300],
    [2, 1500], [2, 1700], [2, 1900], [2, 2200], [2, 2500],
    [32, 1200], [16, 1300], [24, 1400],
    [4, 1900], [4, 1600], [4, 1400], [6, 850]
  )))
  .room(.5).size(.9)

// pumping eighth-note chords: Pulse tail, Horizon, Zenith, Apex
const pumpBar = (c) => '[' + c + ']*8'
const padPumpBars = [
  ...rep(24, RST),
  ...hold2(PROG_MAIN, pumpBar),                             // Pulse tail
  ...hold2(PROG_MAIN, pumpBar), ...hold2(PROG_MAIN, pumpBar),
  ...hold2(PROG_MAIN, pumpBar), ...hold2(PROG_MAIN, pumpBar), // Horizon
  ...rep(24, RST),
  ...hold2(PROG_MAIN, pumpBar), ...hold2(PROG_MAIN, pumpBar),
  ...hold2(PROG_MAIN, pumpBar), ...hold2(PROG_MAIN, pumpBar), // Zenith
  ...rep(16, RST),
  ...hold2(PROG_APEX, pumpBar), ...hold2(PROG_APEX, pumpBar),
  ...hold2(PROG_APEX, pumpBar),                             // Apex
  ...rep(18, RST)
]
const padPump = note(chain(padPumpBars)).s('sawtooth')
  .gain('[.18 .34]*4')
  .lpf(auto(seg(
    [24, 900], [8, 1000], [16, 1300], [16, 1600], [24, 0],
    [16, 1700], [16, 1900], [16, 0], [24, 2100], [18, 0]
  )))
  .release(.3).room(.3)

// dark triangle layer under the Stillpoint pads
const padTriangle = note(chain([
  ...rep(64, RST),
  ...hold2(STILL_PROG, c => down(c)), ...hold2(STILL_PROG, c => down(c)),
  ...hold2(STILL_PROG, c => down(c)),
  ...rep(90, RST)
])).s('triangle').gain(.3).attack(.8).release(1.4).lpf(700).room(.5)

// organ warmth in the Apex
const padOrgan = note(chain([
  ...rep(136, RST),
  ...hold2(PROG_APEX, c => pumpBar(down(c).split(',').slice(0, 2).join(','))),
  ...hold2(PROG_APEX, c => pumpBar(down(c).split(',').slice(0, 2).join(','))),
  ...hold2(PROG_APEX, c => pumpBar(down(c).split(',').slice(0, 2).join(','))),
  ...rep(18, RST)
])).s('organ_full').gain(.14).lpf(1500).release(.3).room(.4)

// piano: Stillpoint chords, Afterglow chords
const pianoBar = (chord) => chord + ' ' + rep(15, '~').join(' ')
const stillPiano = Array.from({ length: 3 }, () => [
  pianoBar('f3,bb3,d4,a4'), pianoBar('f3,bb3,d4,a4'),
  pianoBar('bb3,d4,f4,a4'), pianoBar('bb3,d4,f4,a4'),
  pianoBar('a3,d4,f4,c5'), pianoBar('a3,d4,f4,c5'),
  pianoBar('g3,a3,d4,e4'), pianoBar('g3,a3,d4,e4')
]).flat()
const keysPiano = note(chain([
  ...rep(64, RST),
  ...stillPiano,
  ...rep(72, RST),
  pianoBar('d3,f3,a3,c4'), RST, pianoBar('bb3,d4,f4,a4'),
  ...rep(5, RST), pianoBar('d3,a3,c4,e4'), ...rep(9, RST)
])).s('piano')
  .gain(auto(seg([64, 0], [24, .4], [72, 0], [1, .35], [1, 0],
    [1, .32], [5, 0], [1, .3], [9, 0])))
  .release(1.1).room(.5).clip(1)

// syncopated square stabs: Horizon tail, Zenith, Apex
const keysStabs = note(chain([
  ...rep(40, RST),
  ...hold2(PROG_MAIN, stab), ...hold2(PROG_MAIN, stab), ...hold2(PROG_MAIN, stab),
  ...rep(24, RST),
  ...hold2(PROG_MAIN, stab), ...hold2(PROG_MAIN, stab),
  ...hold2(PROG_MAIN, stab), ...hold2(PROG_MAIN, stab),
  ...rep(16, RST),
  ...hold2(PROG_APEX, stab), ...hold2(PROG_APEX, stab), ...hold2(PROG_APEX, stab),
  ...rep(18, RST)
])).s('square').gain(.17).lpf(2300).release(.12)
  .delay(.2).delaytime(.24).delayfeedback(.25)

// ============================================================
// LEADS & MELODY
// ============================================================
// the Pulse states the theme on a soft plucked saw
const leadPluck = note(chain([
  ...rep(16, RST),
  M1, M2, M3, M4, M5, M6, M7, M8,
  M1, M2, M3, M4, M5, M6, M7, M8,
  ...rep(146, RST)
])).s('sawtooth').gain(.26).lpf(1400).release(.2)
  .delay(.35).delaytime(.36).delayfeedback(.32).room(.35)

// vibraphone sings the theme in Horizon
const vibH = note(chain([
  ...rep(32, RST),
  M1, M2, M3, M4, M5, M6, M7, M8,
  M1, M2, M3, M4, M5, M6, M7, M8,
  M1, M2, M3, M4, M5, M6, M7, M8,
  RST, RST, RST, RST, M5, M6, M7, M8,
  ...rep(114, RST)
])).s('vibraphone').gain(.5).room(.35).delay(.3).delaytime(.36).delayfeedback(.3)

// vibraphone counter-phrase in Stillpoint
const vibS = note(chain([
  ...rep(72, RST),
  'f5 ~ ~ ~ d5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~', RST,
  'e5 ~ ~ ~ c5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~', RST,
  'd5 ~ ~ ~ a4 ~ ~ ~ c5 ~ ~ ~ ~ ~ ~ ~', RST, RST, RST,
  ...rep(98, RST)
])).s('vibraphone').gain(.3).room(.4).delay(.3).delaytime(.36).delayfeedback(.35)

// vibraphone an octave up in Zenith
const vibZ = note(chain([
  ...rep(88, RST),
  M1, M2, M3, M4, M5, M6, M7, M8,
  M1, M2, M3, M4, M5, M6, M7, M8,
  M1, M2, M3, M4, M5, M6, M7, M8,
  RST, RST, RST, RST, M5, M6, M7, M8,
  ...rep(58, RST)
])).s('vibraphone').add(12).gain(.46).room(.35)
  .delay(.3).delaytime(.36).delayfeedback(.3)

// vibraphone fragments over the Undertow 2-step
const vibU = note(chain([
  ...rep(120, RST),
  'd5 ~ ~ ~ ~ ~ f5 ~ ~ ~ e5 ~ ~ ~ ~ ~', RST,
  'd5 ~ ~ ~ ~ ~ ~ ~ a4 ~ ~ ~ ~ ~ ~ ~', RST,
  'c5 ~ ~ ~ d5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~', RST,
  ...rep(10, RST),
  ...rep(42, RST)
])).s('vibraphone').gain(.3).room(.45).delay(.4).delaytime(.36).delayfeedback(.4)

// vibraphone plays the augmented theme in Apex
const vibA = note(chain([
  ...rep(136, RST),
  A1, A2, A3, A4, A5, A6, A7, A8,
  M1, M2, M3, M4, M5, M6, M7, M8,
  A1, A2, A3, A4, A5, A6, A7, A8,
  ...rep(18, RST)
])).s('vibraphone').gain(.48).room(.35).delay(.28).delaytime(.36).delayfeedback(.3)

// final vibraphone statement in Afterglow
const vibO = note(chain([
  ...rep(160, RST),
  M1, M2, M3, M4, M5, M6, M7, M8,
  'a4 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~', RST, RST,
  'f5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~', RST, RST,
  'd5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  ...rep(3, RST)
])).s('vibraphone').gain(.34).room(.5).delay(.42).delaytime(.36).delayfeedback(.45)

// the saw lead joins for the Apex, an octave up
const sawLead = note(chain([
  ...rep(144, RST),
  M1, M2, M3, M4, M5, M6, M7, M8,
  M1, M2, M3, M4,
  'd6 ~ ~ a5 ~ ~ f5 ~ ~ ~ e5 ~ ~ ~ ~ ~',
  M6, M7, M8,
  ...rep(18, RST)
])).s('sawtooth').add(12).gain(.24).lpf(3200).release(.2)
  .delay(.28).delaytime(.36).delayfeedback(.3).room(.3)

// square counter-melody answers in Zenith
const counter = note(chain([
  ...rep(92, RST),
  ...CTR,
  ...rep(78, RST)
])).s('square').gain(.14).lpf(1800).release(.2)
  .delay(.3).delaytime(.36).delayfeedback(.3).room(.3)

// ============================================================
// TEXTURES
// ============================================================
const glockNote = (n) => n + ' ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'
const textureGlock = note(chain([
  ...rep(8, RST),
  glockNote('d6'), RST, glockNote('a5'), RST,
  glockNote('f5'), RST, glockNote('d6'), RST,                // Overture
  ...rep(32, RST),
  ...GLO, ...GLO, ...GLO, ...GLO, ...GLO, ...GLO, ...GLO, ...GLO,   // Horizon tail
  ...rep(40, RST),
  ...GLO, ...GLO, ...GLO, ...GLO, ...GLO, ...GLO, ...GLO, ...GLO,   // Zenith tail
  ...rep(24, RST),
  ...GLO, ...GLO, ...GLO, ...GLO, ...GLO, ...GLO, ...GLO, ...GLO,   // Apex tail
  ...rep(4, RST),
  glockNote('d6'), ...rep(3, RST),
  glockNote('a5'), ...rep(3, RST),
  glockNote('d6'),
  ...rep(5, RST)
])).s('glockenspiel').gain(auto(seg(
  [8, 0], [8, .16], [32, 0], [16, .14], [40, 0], [16, .13],
  [24, 0], [16, .13], [4, 0], [1, .12], [3, 0], [1, .12], [3, 0], [1, .12], [5, 0]
))).room(.5).delay(.3).delaytime(.36).delayfeedback(.35)

// harp: overture echoes, breakdown arps, undertow runs
const harpCell = {
  bb: 'bb2 f3 bb3 d4 f4 bb4 f4 d4 bb3 f3 bb2 f3 bb3 d4 f4 bb4',
  g:  'g2 d3 g3 bb3 d4 g4 d4 bb3 g3 d3 g2 d3 g3 bb3 d4 g4',
  d:  'd3 a3 d4 f4 a4 d5 a4 f4 d4 a3 d3 a3 d4 f4 a4 d5',
  a:  'a2 e3 a3 d4 e4 a4 e4 d4 a3 e3 a2 e3 a3 d4 e4 a4'
}
const harpNote = (n) => n + ' ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'
const stillHarp = Array.from({ length: 3 }, (c) =>
  ['bb', 'g', 'd', 'a'].flatMap((r, i) =>
    (c === 2 && i >= 2) ? ['[' + harpCell[r] + ']*2', '[' + harpCell[r] + ']*2'] : [harpCell[r], harpCell[r]]
  )).flat()
const textureHarp = note(chain([
  RST, RST,
  harpNote('d4'), RST, harpNote('f4'), RST, harpNote('a4'), RST,
  harpNote('d5'), RST, harpNote('c5'), RST, harpNote('bb4'), RST, harpNote('a4'), RST,
  ...rep(48, RST),
  ...stillHarp,
  ...rep(32, RST),
  ...rep(4, RST),
  'd4 e4 f4 g4 a4 bb4 c5 d5 ~ ~ ~ ~ ~ ~ ~ ~', RST,
  'a4 bb4 c5 d5 e5 f5 g5 a5 ~ ~ ~ ~ ~ ~ ~ ~', RST,
  'd4 e4 f4 g4 a4 bb4 c5 d5 e5 f5 g5 a5 bb5 c6 d6 e6',
  'f6 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  ...rep(6, RST),
  ...rep(42, RST)
])).s('harp').gain(auto(seg(
  [2, 0], [1, .34], [1, 0], [1, .34], [1, 0], [1, .34], [1, 0],
  [1, .34], [1, 0], [1, .34], [1, 0], [1, .34], [1, 0], [1, .34], [1, 0],
  [48, 0],
  [2, .14], [2, .16], [2, .18], [2, .2], [2, .22], [2, .24],
  [2, .27], [2, .3], [2, .34], [2, .38], [2, .42], [2, .5],
  [32, 0],
  [4, 0], [1, .3], [1, 0], [1, .38], [1, 0], [1, .48], [1, .55], [6, 0],
  [42, 0]
))).room(.45).delay(.2).delaytime(.24).delayfeedback(.25)

// sine shimmer arp fading in over the Overture
const textureShimmer = note(mini('{d4 f4 a4 e5 c5 a4}%16'))
  .s('sine').gain(auto(seg(
    [8, 0], [1, .09], [1, .1], [1, .11], [1, .12],
    [1, .13], [1, .14], [1, .15], [1, .16], [162, 0]
  )))
  .delay(.2).delaytime(.24).delayfeedback(.3).room(.4)

// sub drone across the Overture
const droneSub = note('d1').slow(16).s('sine')
  .gain(auto(seg([1, .4], [177, 0]))).attack(2).release(2)

// one pure tone at the very end
const toneEnd = note(chain([
  ...rep(176, RST),
  'a5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  'a5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'
])).s('sine').gain(.13).attack(1).release(2.5).room(.6)

// white-noise risers before each drop
const fxRiser = s(chain([
  ...rep(12, RST), ...rep(4, WHT),                          // into Pulse
  ...rep(12, RST), ...rep(3, WHT), RST,                     // into Horizon
  ...rep(28, RST), ...rep(3, WHT), RST,                     // into Stillpoint
  ...rep(16, RST), ...rep(8, WHT),                          // Stillpoint build
  ...rep(28, RST), ...rep(4, WHT),                          // into Zenith
  ...rep(8, RST), ...rep(8, WHT),                           // through Undertow
  ...rep(23, RST), WHT,                                     // bar 160
  ...rep(18, RST)
])).gain(auto(seg(
  [12, 0], [1, .07], [1, .13], [1, .22], [1, .38],
  [12, 0], [1, .1], [1, .16], [1, .26], [1, 0],
  [28, 0], [1, .08], [1, .14], [1, .24], [1, 0],
  [16, 0], [1, .05], [1, .07], [1, .09], [1, .11], [1, .15], [1, .2], [1, .28], [1, .45],
  [28, 0], [1, .1], [1, .15], [1, .22], [1, .34],
  [8, 0], [1, .08], [1, .11], [1, .14], [1, .18], [1, .23], [1, .3], [1, .4], [1, .6],
  [23, 0], [1, .3],
  [18, 0]
))).lpf(auto(seg(
  [12, 600], [1, 900], [1, 1400], [1, 2200], [1, 3600],
  [12, 800], [1, 1200], [1, 1900], [1, 3000], [1, 4000],
  [28, 900], [1, 1400], [1, 2200], [1, 3400], [1, 4000],
  [16, 600], [1, 800], [1, 1000], [1, 1300], [1, 1700], [1, 2200], [1, 2900], [1, 3800], [1, 5000],
  [28, 1000], [1, 1500], [1, 2400], [1, 3600], [1, 5200],
  [8, 700], [1, 900], [1, 1200], [1, 1600], [1, 2100], [1, 2800], [1, 3700], [1, 4800], [1, 6000],
  [23, 800], [1, 2000],
  [18, 800]
))).attack(.4).release(.2)

// ============================================================
// ASSEMBLY
// ============================================================
const song = stack(
  drumsKick, drumsClap, drumsHat, drumsOpenHat, drumsShaker, drumsRim,
  drumsSnare, drumsToms, drumsCrash,
  bassSub, bassMid, undSub,
  padSustain, padPump, padTriangle, padOrgan,
  keysPiano, keysStabs,
  leadPluck, vibH, vibS, vibZ, vibU, vibA, vibO, sawLead, counter,
  textureGlock, textureHarp, textureShimmer, droneSub, toneEnd,
  fxRiser
)

$: song
