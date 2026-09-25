// NEON TIDELINE
// Original composition by GPT-6-Astra on XHIGH.
// 138 BPM / 4 beats per cycle / 128 bars = 222.6087 seconds (3:42.61).
// Paste this whole file into https://strudel.cc and press Ctrl+Enter.
// The complete arrangement loops after bar 128. Built-in sounds only.
// A broken-beat night drive: distant lights, undertow, then open water.

setcpm(138 / 4);
const beat = 60 / 138;

// Every entry is one complete bar; pitches and rests are composed by hand.
const line = (...bars) => cat(...bars.map(bar => note(bar)));

// Dm(add9) -> Bbmaj7 -> Fmaj9 -> C(add9) -> A7(b9).
// Close upper voices let the changing bass redraw the harmony underneath.
// Separate orbits keep the different echo times and reverb sizes independent.
const harmony = note(`<
  [d3,f3,a3,e4]!2 [bb2,f3,a3,d4]!2
  [c3,e3,a3,g4]!2 [c3,g3,d4,e4] [a2,g3,bb3,cs4]
>`);

const pad = (cutoff = 1200, level = 0.12) => harmony
  .s("sawtooth").attack(0.45).decay(0.6).sustain(0.65).release(0.9)
  .lpf(cutoff).hpf(230).gain(level)
  .pan(sine.slow(16).range(0.38, 0.62)).room(0.45).roomsize(4).orbit(2);

const stabs = harmony.struct("~ x ~ ~ ~ x ~ x")
  .s("triangle").attack(0.003).decay(0.18).sustain(0).release(0.12)
  .lpf(2300).hpf(300).gain(0.22)
  .delay(0.23).delaytime(beat * 0.75).delayfeedback(0.32).room(0.18).orbit(3);

// Two related bass performances: the second answers the hook more actively.
const bassA = line(
  "d2 ~ d2 [~ d3] ~ a1 c2 ~",
  "d2 ~ ~ a1 d2 ~ [c2 d2] ~",
  "bb1 ~ bb1 [~ f2] ~ a1 bb1 ~",
  "bb1 ~ ~ f2 bb1 ~ [a1 bb1] ~",
  "f1 ~ f2 [~ c2] ~ e2 f2 ~",
  "f1 ~ ~ c2 f2 ~ [e2 f2] ~",
  "c2 ~ c2 [~ g2] ~ d2 e2 ~",
  "a1 ~ a1 ~ e2 ~ [g2 bb1] cs2"
);

const bassB = line(
  "d2 ~ [d2 d3] ~ ~ a1 [c2 d2] ~",
  "~ d2 ~ a1 d3 ~ [c3 a2] d2",
  "bb1 ~ [bb1 f2] ~ ~ bb2 a2 f2",
  "bb1 ~ ~ [f2 bb1] ~ a1 bb1 ~",
  "f1 ~ [f2 c2] ~ ~ e2 [f2 a2] ~",
  "~ f1 ~ c2 f2 ~ [e2 c2] f1",
  "c2 ~ [g2 c3] ~ ~ g2 [e2 d2] ~",
  "a1 ~ e2 ~ g2 [bb2 a2] e2 cs2"
);

const bass = (part, bite = 950) => stack(
  part.s("sine").attack(0.005).decay(0.15).sustain(0.75)
    .release(0.065).lpf(170).gain(0.64),
  part.s("sawtooth").attack(0.004).decay(0.13).sustain(0.25)
    .release(0.055).lpf(bite).lpq(1.5).lpenv(2)
    .lpdecay(0.12).lpsustain(0).hpf(170).gain(0.20)
);

const kick = s(`<
  [bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~]
  [bd ~ ~ ~ ~ ~ ~ bd ~ ~ bd ~ ~ ~ bd ~]
  [bd ~ ~ ~ ~ ~ bd ~ ~ ~ ~ bd ~ ~ ~ ~]
  [bd ~ ~ bd ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ bd]
>`).bank("RolandTR909").gain(0.84).lpf(6000);

const snare = s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~")
  .bank("RolandTR909").gain(0.52).hpf(150).room(0.12);
const clap = s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~")
  .bank("RolandTR808").gain(0.20).hpf(650).late(0.006).room(0.23);
const ghosts = s(`<
  [~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ sd ~]
  [~ ~ ~ sd ~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ sd]
>`).bank("RolandTR909").gain(0.12).hpf(800).speed(1.12);
const hats = s("hh*16").bank("RolandTR909")
  .gain("0.13 0.06 0.24 0.09 0.13 0.07 0.27 0.10")
  .hpf(6500).pan("0.38 0.62").swingBy(0.07, 8);
const openHats = s("~ oh ~ oh ~ oh ~ [oh ~]")
  .bank("RolandTR909").gain(0.18).hpf(7000).cut(1);
const rim = s("~ ~ rim ~ ~ ~ ~ rim ~ ~ rim ~ ~ rim ~ ~")
  .bank("RolandTR808").gain(0.15).hpf(900).pan(0.7)
  .delay(0.22).delaytime(beat * 0.375).delayfeedback(0.24).orbit(4);

// The turnaround replaces the last bar of each eight-bar drum phrase.
const fill = stack(
  s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ ~ ~ ~ ~")
    .bank("RolandTR909").gain(0.82),
  s("~ ~ ~ ~ sd ~ ~ sd ~ sd ~ sd sd [sd sd] ~ ~")
    .bank("RolandTR909").gain("0.28 0.4 0.3 0.55")
    .hpf(300).pan("0.42 0.58"),
  hats
);
const drums = arrange([7, stack(kick, snare, clap, hats, ghosts, rim)], [1, fill])
  .ribbon(0, 8);
const drive = stack(drums, openHats);
const pulse = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").bank("RolandTR909").gain(0.63).lpf(800),
  hats.gain("0.07 0.035 0.12 0.04"), rim
);

// The hook starts with a held ninth, drops to the third, then climbs back.
// Its final C# belongs to the dominant and resolves into the next D.
const theme = line(
  "~ a4 e5@2 d5 ~ [a4 c5] d5",
  "f5@3 e5 d5@2 ~ a4",
  "~ a4 d5@2 f5 ~ [e5 d5] c5",
  "d5@3 a4 f4@2 ~ a4",
  "~ c5 g5@2 e5 ~ [c5 a4] c5",
  "e5@3 c5 a4@2 ~ g4",
  "g4 ~ c5 d5 e5@2 d5 c5",
  "bb4@2 a4 ~ g4 e4 cs5@2"
);
const glass = (part, level = 0.30) => part
  .s("sine").fm(1.7).fmh(2).fmdecay(0.18).fmsustain(0.08)
  .attack(0.004).decay(0.32).sustain(0.28).release(0.28)
  .lpf(6500).hpf(330).gain(level)
  .delay(0.24).delaytime(beat * 0.75).delayfeedback(0.34).room(0.28).orbit(5);

// A smaller signal foreshadows the melody before the drums arrive.
const beacon = line(
  "a5@2 ~@6", "~@4 e5@2 ~@2",
  "f5@2 ~@6", "~@6 d5@2",
  "e5@2 ~@6", "~@4 c5@2 ~@2",
  "g5@2 ~@6", "~@4 cs5@2 ~@2"
);

const arpeggio = line(
  "d4 a4 e5 f4 a4 e5 d5 a4", "d4 a4 e5 f4 a4 c5 e5 a4",
  "bb3 f4 a4 d4 f4 a4 d5 f4", "bb3 f4 a4 d4 f4 c5 d5 a4",
  "f4 a4 c5 e4 a4 c5 g5 c5", "f4 a4 c5 e4 g4 c5 e5 c5",
  "c4 g4 d5 e4 g4 d5 e5 g4", "a3 e4 g4 bb4 cs5 e5 g5 cs5"
).s("triangle").attack(0.002).decay(0.10).sustain(0).release(0.08)
  .gain("0.12 0.075 0.09 0.075").lpf(2500).hpf(550)
  .pan("0.25 0.75").delay(0.20).delaytime(beat * 0.375).delayfeedback(0.28).orbit(6);

// A new, wider melody for the second crest; the original hook returns after it.
const horizon = line(
  "a5@3 g5 f5@2 e5 d5", "e5@2 f5 a5 e5@2 d5@2",
  "f5@3 a5 d6@2 c6 a5", "f5@2 e5 d5 a4 d5@2 ~",
  "g5@3 a5 c6@2 a5 g5", "e5@2 g5 a5 c6 g5@2 e5",
  "g5@2 e5 d5 c5@2 d5 e5", "g5 bb5 a5 e5 cs5@2 ~@2"
);
const answer = line(
  "~@6 f5 a5", "~@6 e5 f5", "~@6 a5 f5", "~@6 d5 f5",
  "~@6 e5 g5", "~@6 g5 e5", "~@6 g5 e5", "~@6 e5 cs5"
).s("triangle").attack(0.015).decay(0.2).sustain(0).release(0.25)
  .gain(0.16).pan(0.72).hpf(700).room(0.4);

const wash = s("pink").attack(0.7).decay(0.2).sustain(0.2).release(1.1)
  .hpf(1800).lpf(5200).gain(0.065).room(0.6).roomsize(5).orbit(7);
const impact = stack(
  s("cr").bank("RolandTR909").gain(0.20).hpf(2500).room(0.3),
  note("d2").s("sine").penv(12).pattack(0).pdecay(0.18)
    .attack(0.001).decay(0.65).sustain(0).release(0.2).gain(0.35)
);
const entrance = arrange([1, impact], [7, silence]);

const submerged = stack(
  pad(650, 0.15),
  glass(theme, 0.19).lpf(2400).room(0.55).delayfeedback(0.48),
  note("<d2!2 bb1!2 f1!2 c2 a1>").s("sine")
    .attack(0.1).release(0.3).gain(0.28),
  wash.mask("<1 0 0 0 1 0 0 0>")
);
const halfTime = stack(
  submerged, arpeggio.gain(0.07),
  s("bd ~ ~ ~ ~ ~ ~ ~").bank("RolandTR909").gain(0.68),
  s("~ ~ ~ ~ sd ~ ~ ~").bank("RolandTR909").gain(0.40).room(0.35),
  rim
);

// Eight bars of tension. A half-bar vacuum makes the next downbeat land.
const build = stack(
  pad(1800, 0.13), arpeggio, glass(beacon, 0.18),
  s("bd*4").bank("RolandTR909").gain(0.66),
  s("sd*<2 2 4 4 8 8 16 16>").bank("RolandTR909")
    .gain("<0.10 0.13 0.16 0.19 0.21 0.23 0.24 0.26>")
    .hpf("<400 500 650 800 1100 1500 2000 2600>"),
  s("pink*8").attack(0.025).decay(0.12).sustain(0).release(0.08)
    .hpf(2200).lpf("<900 1200 1700 2400 3400 4800 6500 9000>")
    .gain("<0.01 0.015 0.025 0.035 0.05 0.07 0.10 0.13>")
).mask("<1!7 [1 0]>");

// This closing phrase resolves the dominant to D minor, then lets it ring.
const farewell = stack(
  line("a5@3 e5 d5@4", "f5@3 e5 d5@4", "d5@4 a4@4", "f4@6 e4@2",
    "d5@8", "a4@8", "d5@2 ~@6", "~")
    .s("sine").fm(0.7).fmh(2).attack(0.01).decay(0.8).sustain(0)
    .release(0.7).gain("<0.28 0.26 0.24 0.22 0.20 0.18 0.15 0>")
    .delay(0.25).delaytime(beat * 0.75).delayfeedback(0.4).room(0.45).orbit(5),
  note("<[d3,f3,a3,e4]!4 [d3,f3,a3,d4] ~ ~ ~>")
    .s("triangle").attack(0.4).decay(1.0).sustain(0.2).release(1.2)
    .gain("<0.15 0.13 0.11 0.09 0.13 0 0 0>").lpf(1000).room(0.5).roomsize(4).orbit(2),
  note("<d2 ~ d2 ~ d2 ~ ~ ~>").s("sine")
    .attack(0.02).decay(0.7).sustain(0).release(0.4).gain(0.25)
);

// One arrangement, one 128-bar form. Section lengths are cycles, not beats.
arrange(
  [8, stack(pad(750, 0.14), glass(beacon, 0.28), wash.mask("<1 0 0 0>"))], // 0:00 lights
  [8, stack(pad(1000), glass(beacon, 0.22), pulse, arpeggio.gain(0.065))],   // 0:14 pulse
  [8, stack(drums, bass(bassA, 600), stabs, entrance)],                    // 0:28 undertow
  [8, stack(drive, bass(bassA), stabs, arpeggio)],                         // 0:42 motion
  [8, stack(drive, bass(bassA), pad(), glass(theme), entrance)],           // 0:56 first crest
  [8, stack(drive, bass(bassA, 1200), stabs, glass(theme), answer)],        // 1:10 response
  [8, submerged],                                                       // 1:23 below water
  [8, halfTime],                                                        // 1:37 heartbeat
  [8, build],                                                           // 1:51 pressure
  [8, stack(drive, bass(bassB, 1700), stabs, glass(theme), entrance)],      // 2:05 breakthrough
  [8, stack(drive, bass(bassB, 2100), pad(1900), glass(theme), arpeggio)],  // 2:19 spray
  [8, stack(drive, bass(bassB, 1700), stabs, glass(horizon, 0.27))],        // 2:33 horizon
  [8, stack(drive, bass(bassB, 2200), pad(2200), glass(horizon, 0.29),
    arpeggio, entrance)],                                               // 2:47 open water
  [8, stack(drive, bass(bassA, 1300), stabs, glass(theme, 0.32), answer)],  // 3:01 homecoming
  [8, stack(drums, bass(bassA, 650), pad(950), glass(theme, 0.24))],        // 3:15 afterglow
  [8, farewell]                                                         // 3:29 shore -> 3:42.61
).ribbon(0, 128).postgain(0.65);
