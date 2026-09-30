// THE SUN HAS TEETH
// Original composition by GPT-6.1-Sol on XHIGH.
// 136 BPM / F minor, opening into F Dorian / heavy melodic electro breaks.
// 128 bars x 4 beats x 60 / 136 = 225.882 seconds (3:45.9), then repeats.
// Paste the entire file into https://strudel.cc and press Ctrl+Enter.
// All instruments, including the drums, use built-in synthesis. No samples.
//
// Bars     Time       Scene
//   1-8    0:00.0     A light behind the door: glass, pulse, distant chords
//   9-16   0:14.1     The latch gives: bass and fractured percussion
//  17-32   0:28.2     Teeth: first full statement of the eight-bar theme
//  33-48   0:56.5     The machine argues back: darker harmony, acid response
//  49-64   1:24.7     Weightless: the theme stretches over exposed harmony
//  65-72   1:52.9     Pressure: rising rolls, then a breath before impact
//  73-96   2:07.1     Breach: bass first, then the theme and its countervoice
//  97-112  2:49.4     Daylight: Dorian sixth, wider chords, soaring answer
// 113-128  3:17.6     Embers: dismantle the beat, resolve, leave room to ring

setcpm(136 / 4);
// Parse single-quoted mini notation too, including strings passed to helpers.
miniAllStrings();

// Each entry is one whole bar. cat preserves the rhythm inside that bar;
// arrange repeats a scene at normal speed for its specified bar count.
const line = (...bars) => cat(...bars.map((bar) => note(bar)));
const grid = (...bars) => cat(...bars.map((bar) => mini(bar)));
const rhythm = (...bars) => s('sine').struct(grid(...bars));
const controls = (...values) => cat(...values);
const beat = 60 / 136;

// The bass owns the roots; these close upper voicings move by small steps.
const dusk = line(
  '[ab3,c4,eb4,g4]', '[ab3,c4,eb4,g4]',
  '[ab3,c4,eb4,f4]', '[ab3,c4,eb4,f4]',
  '[g3,bb3,c4,eb4]', '[g3,bb3,c4,eb4]',
  '[g3,bb3,c4,f4]', '[g3,bb3,c4,f4]',
);
const furnace = line(
  '[ab3,c4,f4,g4]', '[ab3,c4,f4,g4]',
  '[ab3,db4,eb4,f4]', '[ab3,db4,eb4,f4]',
  '[ab3,bb3,d4,f4]', '[ab3,bb3,d4,f4]',
  '[bb3,c4,e4,g4]', '[bb3,c4,e4,g4]',
);
const daylight = line(
  '[ab3,c4,f4,g4]', '[ab3,c4,f4,g4]',
  '[ab3,c4,d4,f4]', '[ab3,c4,d4,f4]',
  '[g3,bb3,d4,f4]', '[g3,bb3,d4,f4]',
  '[ab3,c4,d4,g4]', '[ab3,c4,d4,g4]',
);

const roots = line('f1', 'f1', 'db2', 'db2', 'ab1', 'ab1', 'eb2', 'eb2');
const darkRoots = line('f1', 'f1', 'db2', 'db2', 'bb1', 'bb1', 'c2', 'c2');
const brightRoots = line('f1', 'f1', 'bb1', 'bb1', 'eb2', 'eb2', 'f1', 'f1');

// Main hook: the repeated high C leans into a falling Ab-G-F signature.
// Its second half answers upward instead of restating the first half.
const teeth = line(
  '~ c5 ~ [c5 ab4] ~ g4 f4 ~',
  'ab4@2 ~ c5 ~ eb5 c5 ~',
  '~ c5 ~ [c5 ab4] ~ g4 f4 ~',
  'eb5@2 c5 ab4 ~ g4 f4 ~',
  '~ bb4 ~ [c5 eb5] ~ g5 eb5 ~',
  'c5@2 ~ bb4 ab4 ~ g4 ~',
  '~ bb4 ~ [c5 f5] ~ eb5 c5 ~',
  'bb4 ~ g4 ~ f4@3 ~',
);
const argument = line(
  'f3 ~ [f3 c4] ~ ab3 ~ g3 ~',
  'f3 ~ ~ [eb3 f3] ~ ab3 c4 ~',
  'db3 ~ [db3 ab3] ~ c4 ~ ab3 ~',
  'f3 ~ eb3 ~ db3 ~ [c3 db3] ~',
  'bb2 ~ [bb2 f3] ~ ab3 ~ d4 ~',
  'f3 ~ d3 ~ bb2 ~ [ab2 bb2] ~',
  'c3 ~ [c3 g3] ~ bb3 ~ e4 ~',
  'g3 ~ e3 ~ c3 ~ [db3 e3] ~',
);
const sky = line(
  'c6@2 ~ ab5 g5@2 f5 ~',
  '~ g5 ab5 ~ c6@3 ~',
  'd6@2 ~ c6 ab5@2 f5 ~',
  '~ ab5 c6 ~ d6 c6 ab5 ~',
  'bb5@2 ~ g5 f5@2 d5 ~',
  '~ f5 g5 ~ bb5@3 ~',
  'c6@2 ~ ab5 g5@2 f5 ~',
  'g5 ~ ab5 ~ f5@3 ~',
);
const weightless = line(
  'c5@3 ab4 g4@2 f4@2',
  '~@2 ab4@2 c5@3 ~',
  'eb5@3 c5 ab4@2 g4@2',
  'f4@4 ~@2 c5@2',
  'd5@3 c5 bb4@2 ab4@2',
  'f4@4 d5@2 ~@2',
  'e5@3 c5 bb4@2 g4@2',
  'e4@4 ~@4',
).slow(2);

const sparks = line(
  'f4 c5 g4 ab4 c5 ab4 g4 c5',
  'f4 c5 ab4 g4 eb5 c5 ab4 g4',
  'db4 ab4 eb5 f4 ab4 f4 eb5 ab4',
  'db4 ab4 f4 eb5 c5 ab4 f4 eb5',
  'ab4 eb5 bb4 c5 eb5 c5 bb4 eb5',
  'ab4 eb5 c5 bb4 g5 eb5 c5 bb4',
  'eb4 bb4 f5 g4 bb4 g4 f5 bb4',
  'eb4 bb4 g4 f5 eb5 bb4 g4 f5',
);
const brightSparks = line(
  'f4 c5 g4 ab4 c5 ab4 g4 c5',
  'f4 c5 ab4 g4 d5 c5 ab4 g4',
  'bb4 f5 c5 d5 f5 d5 c5 f5',
  'bb4 f5 d5 c5 ab5 f5 d5 c5',
  'eb4 bb4 f5 g4 bb4 g4 f5 bb4',
  'eb4 bb4 g4 f5 d5 bb4 g4 f5',
  'f4 c5 g4 ab4 d5 c5 ab4 g4',
  'f4 c5 ab4 g4 f5 c5 ab4 g4',
);
const darkSparks = line(
  'f4 c5 g4 ab4 c5 ab4 g4 c5',
  'f4 c5 ab4 g4 eb5 c5 ab4 g4',
  'db4 ab4 eb5 f4 ab4 f4 eb5 ab4',
  'db4 ab4 f4 eb5 c5 ab4 f4 eb5',
  'bb3 f4 c5 d4 f4 d4 c5 f4',
  'bb3 f4 d4 c5 ab4 f4 d4 c5',
  'c4 g4 d5 e4 g4 e4 d5 g4',
  'c4 g4 e4 d5 bb4 g4 e4 d5',
);

// A two-layer snare, pitched kick, noise hats and resonant metal percussion.
// The last two bars of the kit provide a turnaround, not a random fill.
const kickSteps = rhythm(
  '1 0 0 0 0 0 1 0 1 0 0 1 0 0 0 0',
  '1 0 0 1 0 0 0 0 1 0 1 0 0 0 0 0',
  '1 0 0 0 0 0 1 0 1 0 0 1 0 0 0 0',
  '1 0 0 0 0 0 0 1 1 0 0 0 0 0 1 0',
  '1 0 0 0 0 0 1 0 1 0 0 1 0 0 0 0',
  '1 0 0 1 0 0 0 0 1 0 1 0 0 0 0 0',
  '1 0 0 0 0 0 1 0 1 0 0 0 0 0 1 0',
  '1 0 0 0 0 0 1 0 1 0 0 0 0 1 0 0',
);
const kick = (steps = kickSteps, level = 0.82) => steps
  .s('sine').freq(48).penv(35).pattack(0).pdecay(0.045).pcurve(1)
  .attack(0.001).decay(0.17).sustain(0).release(0.025)
  .gain(level).orbit(1)
  .duckorbit('3:4:5:6').duckdepth('0.62:0.28:0.42:0.35')
  .duckattack('0.13:0.10:0.17:0.15');
const snareSteps = rhythm(
  '0 0 0 0 1 0 0 0 0 0 0 0 1 0 0 0',
  '0 0 0 0 1 0 0 0 0 0 0 0 1 0 0 0',
  '0 0 0 0 1 0 0 0 0 0 0 0 1 0 0 0',
  '0 0 0 0 1 0 0 0 0 0 0 0 1 0 0 1',
  '0 0 0 0 1 0 0 0 0 0 0 0 1 0 0 0',
  '0 0 0 0 1 0 0 0 0 0 0 0 1 0 0 0',
  '0 0 0 0 1 0 0 0 0 0 0 0 1 0 1 0',
  '0 0 0 0 1 0 0 0 0 0 1 0 1 1 0 1',
);
const snare = (steps = snareSteps, level = 1) => stack(
  steps.s('white').hpf(1150).lpf(10500)
    .attack(0.001).decay(0.14).sustain(0).release(0.035).gain(0.28 * level),
  steps.s('triangle').freq(185).penv(9).pattack(0).pdecay(0.025)
    .attack(0.001).decay(0.065).sustain(0).release(0.015).gain(0.32 * level),
).orbit(2).room(0.08).roomsize(0.8);
const hats = s('white*16').hpf(7200).lpf(14500)
  .attack(0.001).decay('0.018 0.028 0.042 0.022').sustain(0).release(0.008)
  .gain('0.045 0.024 0.11 0.032 0.06 0.024 0.095 0.038')
  .pan('0.36 0.64').swingBy(0.07, 8).orbit(2);
const openHat = s('~ white ~ white ~ white ~ white')
  .hpf(8500).attack(0.002).decay(0.12).sustain(0).release(0.035)
  .gain(0.065).pan(0.63).orbit(2);
const ghosts = rhythm(
  '0 0 0 1 0 0 0 0 0 1 0 0 0 0 1 0',
  '0 0 1 0 0 0 0 1 0 0 0 1 0 0 0 0',
).s('pink').bpf(2100).bpq(1.5).attack(0.001)
  .decay(0.032).sustain(0).release(0.008).gain('0.04 0.055')
  .pan(0.38).late(0.003).orbit(2);
const metal = line(
  '~ ~ c6 ~ ~ g5 ~ ~', '~ eb6 ~ ~ ~ ~ c6 ~',
  '~ ~ ab5 ~ ~ eb6 ~ ~', '~ ~ ~ c6 ~ ~ ~ [g5 ab5]',
).s('sine').fm(3.4).fmh(2.73).fmdecay(0.025).fmsustain(0)
  .attack(0.001).decay(0.047).sustain(0).release(0.015)
  .hpf(1700).gain(0.07).pan('0.24 0.76').orbit(2);
const kit = stack(kick(), snare(), hats, openHat, ghosts);

const bassSteps = grid(
  '0 0 1 0 0 0 1 1 0 0 1 0 0 0 1 0',
  '0 0 1 0 0 0 1 0 0 1 0 0 0 0 1 1',
);
const bass = (root, cutoff = 700, level = 0.32) => root.struct(bassSteps)
  .s('sawtooth').attack(0.003).decay(0.12).sustain(0.18).release(0.04)
  .lpf(cutoff).lpq(1.1).lpenv(3.2).lpattack(0.002).lpdecay(0.10)
  .lpsustain(0).hpf(35).distort('1.5:0.7').gain(level).orbit(3);
const sub = (root, level = 0.26) => root.struct(bassSteps)
  .s('sine').attack(0.004).decay(0.13).sustain(0.18).release(0.035)
  .gain(level).orbit(3);
const pad = (chords, cutoff = 1700, level = 0.14) => chords
  .s('sawtooth').attack(0.18).decay(0.4).sustain(0.6).release(0.5)
  .lpf(cutoff).hpf(240).gain(level).pan(0.52)
  .room(0.36).roomsize(3.5).roomlp(3800).orbit(5);
const glass = (melody, level = 0.34) => melody
  .s('sine').fm(1.8).fmh(2).fmdecay(0.16).fmsustain(0.12)
  .attack(0.002).decay(0.23).sustain(0.05).release(0.16)
  .lpf(6800).hpf(280).gain(level).pan('0.44 0.56')
  .delay(0.23).delaytime(beat * 0.75).delayfeedback(0.31)
  .room(0.24).roomsize(2.5).roomlp(5000).orbit(4);
const arp = (melody = sparks, level = 0.12) => melody
  .s('triangle').attack(0.001).decay(0.08).sustain(0).release(0.04)
  .hpf(600).lpf('2600 4200 3200 5400').gain(level)
  .pan('0.22 0.78 0.34 0.66').delay(0.28).delaytime(beat * 1.5)
  .delayfeedback(0.32).room(0.15).roomsize(2.5).orbit(6);
const acid = argument.s('sawtooth')
  .attack(0.002).decay(0.09).sustain(0.08).release(0.035)
  .lpf(controls(420, 600, 800, 1100, 650, 950, 1450, 2000))
  .lpq(3.2).lpenv(4.5).lpattack(0.001).lpdecay(0.10).lpsustain(0)
  .hpf(220).distort('1.8:0.5').gain(0.17).pan(0.39).orbit(6)
  .delay(0.16).delaytime(beat * 1.5).delayfeedback(0.32)
  .room(0.15).roomsize(2.5);
const soar = sky.s('sawtooth').attack(0.018).decay(0.18)
  .sustain(0.45).release(0.20).lpf(4200).hpf(700)
  .vib(5.2).vibmod(0.10).gain(0.14).pan(0.63)
  .delay(0.23).delaytime(beat * 0.75).delayfeedback(0.31)
  .room(0.24).roomsize(2.5).roomlp(5000).orbit(4);

const heartbeat = kick(rhythm('1 0 0 0 0 0 0 0'), 0.46);
const intro = stack(
  pad(dusk, 850, 0.11),
  glass(teeth.slow(2), 0.25),
  heartbeat,
  arp(sparks, 0.045).lpf(1800),
);
const ignition = stack(
  kick(), snare(snareSteps, 0.72), hats.velocity(0.6), ghosts,
  bass(roots, controls(220, 260, 330, 420, 520, 650, 850, 1100), 0.27),
  sub(roots, 0.20), pad(dusk, 1200, 0.10), arp(),
);
const firstLight = stack(
  kit, bass(roots, controls(550, 600, 650, 700, 750, 800, 850, 950,
    850, 900, 950, 1000, 1050, 1100, 1200, 1350)), sub(roots),
  pad(dusk, controls(1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000,
    2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800)),
  glass(teeth), arp(),
);
const friction = stack(
  kit, metal, bass(darkRoots, 1100), sub(darkRoots),
  pad(furnace, 2300, 0.12), acid,
  glass(line('~', '~', '~', 'eb5 c5 ~ ab4 ~@4', '~', '~', '~', 'g5 e5 ~ c5 ~@4'), 0.27),
);
const float = stack(
  pad(furnace.slow(2), 2300, 0.18).attack(0.34).release(0.9),
  glass(weightless, 0.37).decay(0.65).release(0.45),
  arp(darkSparks.slow(2), 0.075),
  darkRoots.slow(2).s('sine').attack(0.15).sustain(0.4).release(0.6).gain(0.18).orbit(3),
);

// The buildup ends with a quarter-bar vacuum. Neither drums nor the riser
// mask the first kick of the next scene.
const roll = rhythm(
  '1 0 1 0 1 0 1 0', '1 0 1 0 1 0 1 0',
  '1 1 1 1 1 1 1 1', '1 1 1 1 1 1 1 1',
  '1*16', '1*16', '1*32', '[1*24]@3 0',
);
const pressure = stack(
  pad(furnace, controls(900, 1100, 1400, 1800, 2300, 2900, 3500, 4200), 0.13),
  bass(darkRoots, controls(200, 260, 350, 500, 800, 1100, 1500, 2200), 0.24),
  snare(roll, 0.45).velocity(controls(0.45, 0.50, 0.55, 0.60, 0.68, 0.78, 0.90, 1)),
  rhythm('1*8', '1*8', '1*8', '1*8', '1*16', '1*16', '1*16', '[1*12]@3 0')
    .s('white').attack(0.008).decay(0.055).sustain(0).release(0.04)
    .bpf(controls(900, 1200, 1700, 2400, 3400, 4800, 6800, 9000)).bpq(1.3)
    .gain(controls(0.018, 0.024, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08)).orbit(2),
  glass(line('c5 ~ ~ ~', 'c5 ~ ~ ab4', 'c5 ~ g4 ~', 'c5 ab4 g4 f4',
    'c5 ~ c5 ~', 'c5 ab4 c5 g4', 'c5 ab4 g4 f4 c5 ab4 g4 f4',
    'e5 g5 bb5 c6 ~@4'), 0.28),
);
const breach = stack(
  kit, metal, bass(roots, 1500, 0.35), sub(roots, 0.29),
  pad(dusk, 2500, 0.15), arp(sparks, 0.16),
  glass(line('~@4 c5 ab4 g4 ~', '~', '~@4 c5 ab4 g4 ~', '~',
    '~@4 eb5 c5 bb4 ~', '~', '~@4 f5 eb5 c5 ~', '~'), 0.31),
);
const blaze = stack(
  kit, metal, bass(roots, 1600, 0.34), sub(roots, 0.27),
  pad(dusk, 2800, 0.15), glass(teeth, 0.39), arp(sparks, 0.14),
  arrange([8, silence], [8,
    glass(line('~', '~@4 f5 g5 ab5 ~', '~', '~@4 ab5 g5 f5 ~',
      '~', '~@4 eb5 g5 bb5 ~', '~', '~@4 g5 f5 eb5 ~'), 0.19).pan(0.7),
  ]),
);
const dawn = stack(
  kit, metal, bass(brightRoots, 1200), sub(brightRoots),
  pad(daylight, 3400, 0.17), glass(teeth, 0.31),
  arp(brightSparks, 0.13), soar,
);
const embers = stack(
  kick(rhythm('1 0 0 0', '1 0 1 0', '1 0 0 0', '1 0 1 0',
    '1 0 0 0', '1 0 0 0', '1 0 0 0', '1 0 0 0'), 0.53),
  hats.velocity(0.4), pad(daylight, 1400, 0.13),
  glass(teeth, 0.28), arp(brightSparks, 0.07), sub(brightRoots, 0.19),
);
const afterglow = stack(
  pad(line('[ab3,c4,d4,g4]', '[ab3,c4,d4,g4]', '[ab3,c4,f4,g4]',
    '[ab3,c4,f4,g4]', '[ab3,c4,f4,g4] ~', '~', '~', '~'), 1000, 0.12)
    .attack(0.3).release(1.4),
  glass(line('c5@2 ~ ab4 g4@2 f4 ~', '~@4 g4 ab4 c5 ~',
    'g4@2 ~ ab4 f4@3 ~', '~@4 c5@2 ab4 ~', 'f4@2 ~@6', '~', '~', '~'), 0.26)
    .decay(0.7).release(0.8),
  line('f1', '~', 'f1', '~', 'f1 ~', '~', '~', '~')
    .s('sine').attack(0.04).decay(0.8).sustain(0.2).release(1.2)
    .gain(0.18).orbit(3),
);

// Exactly 128 bars. The final three bars contain only the natural tails.
// ribbon resets the longer intro phrase as well as the section arrangement.
arrange(
  [8, intro],
  [8, ignition],
  [16, firstLight],
  [16, friction],
  [16, float],
  [8, pressure],
  [8, breach],
  [16, blaze],
  [16, dawn],
  [8, embers],
  [8, afterglow],
).ribbon(0, 128).postgain(1.45);
