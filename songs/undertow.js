// ============================================================================
// "Undertow" - 100 BPM halftime wave in C minor
//
// A deep-water piece: sub-bass pressure, sparse halftime drums, dark pad
// swells and a bell motif that keeps surfacing like a buoy on the horizon.
// The track builds through two drops and dissolves back into the tide.
//
// Structure (80 bars, 4 beats/bar, 100 BPM -> 192.0s = 3:12.0 before loop):
//   01-08  intro      pads + bell motif, quiet hats fade in
//   09-16  verse      sub pedal, halftime kick/snare, 8th-note arp
//   17-24  build      filter opens, snare roll, riser into drop
//   25-40  drop A     full halftime drums, syncopated sub, lead motif
//   41-48  breakdown  add-9 pads, bells, sub pedal
//   49-56  verse 2    drums return, 16th arp, shaker
//   57-72  drop B     denser sub, lead harmony, up-down 16th arps (peak)
//   73-80  outro      everything strips back, final bell + crash
// ============================================================================

setcps(100 / 60 / 4);

// ---- helpers ---------------------------------------------------------------
const rep = (bar, n) => Array(n).fill(bar);
const lay = (...sections) => sections.flat();
// place an array of bar-strings at a start index inside an 80-bar array
const place = (start, bars, total = 80) => [
  ...rep("~", start),
  ...bars,
  ...rep("~", total - start - bars.length),
];
// build layers: one cat item per bar, so each string below is one bar
const S = (bars) => cat(...bars.map((b) => s(b)));
const N = (bars, up = []) =>
  cat(...bars.map((b, i) => (up.includes(i) ? note(b).add(note(12)) : note(b))));

// ---- harmony ---------------------------------------------------------------
const cm = "[c3,eb3,g3,bb3]";
const ab = "[ab2,c3,eb3,g3]";
const eb = "[eb3,g3,bb3,d4]";
const bb = "[bb2,d3,f3,ab3]";
const cm9 = "[c3,g3,d4,eb4]";
const ab9 = "[ab2,c3,g3,bb3]";
const eb9 = "[eb3,bb3,d4,f4]";
const bb9 = "[bb2,f3,ab3,c4]";

const PROG = [cm, cm, ab, ab, eb, eb, bb, bb];
// pulse voicings written out literally: strudel's transpiler statically
// parses string literals as mini-notation, so no template literals here
const PULSE = [
  "[c3,eb3,g3,bb3] ~ [c3,eb3,g3,bb3] ~",
  "[c3,eb3,g3,bb3] ~ [c3,eb3,g3,bb3] ~",
  "[ab2,c3,eb3,g3] ~ [ab2,c3,eb3,g3] ~",
  "[ab2,c3,eb3,g3] ~ [ab2,c3,eb3,g3] ~",
  "[eb3,g3,bb3,d4] ~ [eb3,g3,bb3,d4] ~",
  "[eb3,g3,bb3,d4] ~ [eb3,g3,bb3,d4] ~",
  "[bb2,d3,f3,ab3] ~ [bb2,d3,f3,ab3] ~",
  "[bb2,d3,f3,ab3] ~ [bb2,d3,f3,ab3] ~",
];

// ---- pads ------------------------------------------------------------------
const padIntro = N(place(0, PROG))
  .s("sawtooth").attack(0.9).decay(0.2).sustain(0.8).release(0.5)
  .lpf(620).gain(0.5).room(0.75);
const padVerse = N(place(8, PULSE))
  .s("sawtooth").attack(0.22).decay(0.15).sustain(0.7).release(0.3)
  .lpf(950).gain(0.42).room(0.6);
const padBuildA = N(place(16, PULSE.slice(0, 4)))
  .s("sawtooth").attack(0.2).decay(0.15).sustain(0.7).release(0.3)
  .lpf(1300).gain(0.44).room(0.6);
const padBuildB = N(place(20, PULSE.slice(4)))
  .s("sawtooth").attack(0.18).decay(0.15).sustain(0.7).release(0.3)
  .lpf(2100).gain(0.46).room(0.65);
const padDropA = N(place(24, [...PULSE, ...PULSE]))
  .s("sawtooth").attack(0.2).decay(0.15).sustain(0.7).release(0.3)
  .lpf(2300).gain(0.38).room(0.6);
const padBreak = N(place(40, [cm9, cm9, ab9, ab9, eb9, eb9, bb9, bb9]))
  .s("sawtooth").attack(1.1).decay(0.2).sustain(0.85).release(0.6)
  .lpf(850).gain(0.5).room(0.9);
const padVerse2 = N(place(48, PULSE))
  .s("sawtooth").attack(0.22).decay(0.15).sustain(0.7).release(0.3)
  .lpf(1350).gain(0.42).room(0.6);
const padDropB = N(place(56, [...PULSE, ...PULSE]))
  .s("sawtooth").attack(0.2).decay(0.15).sustain(0.7).release(0.3)
  .lpf(2500).gain(0.38).room(0.6);
const padOutro = N(place(72, [cm9, ab9, eb9, bb9, cm9, cm9, ab9, cm9]))
  .s("sawtooth").attack(0.9).decay(0.2).sustain(0.8).release(0.9)
  .lpf(520).gain(0.46).room(0.85);

// ---- sub bass (sine) -------------------------------------------------------
const pC = "c1 ~ ~ ~ ~ c1 ~ eb1";
const pA = "ab0 ~ ~ ~ ~ c1 ~ ab0";
const pE = "eb1 ~ ~ ~ ~ eb1 ~ g1";
const pB = "bb0 ~ ~ ~ ~ bb0 ~ ab0";
const pC2 = "c1 ~ ~ ~ ~ c1 [~ c1] eb1";
const pA2 = "ab0 ~ ~ ~ ~ c1 [~ c1] ab0";
const pE2 = "eb1 ~ ~ ~ ~ eb1 [~ eb1] g1";
const pB2 = "bb0 ~ ~ ~ ~ bb0 ~ c2";

const qC = "c1 ~ c1 ~ ~ c1 ~ c1";
const qA = "ab0 ~ ab0 ~ ~ c1 ~ ab0";
const qE = "eb1 ~ eb1 ~ ~ eb1 ~ g1";
const qB = "bb0 ~ bb0 ~ ~ bb0 ~ c2";
const qC2 = "c1 ~ c1 [~ c1] ~ c1 ~ eb1";
const qE2 = "eb1 ~ eb1 ~ ~ eb1 [~ g1] eb1";
const qB2 = "bb0 ~ bb0 ~ ~ f1 ~ ab0";

const subBars = lay(
  ["c1", "~", "~", "~", "c1", "~", "~", "~"], // intro swells
  ["c1", "~", "ab0", "~", "eb1", "~", "bb0", "~"], // verse pedal
  ["c1", "~", "ab0", "~", "eb1", "~", "bb0", "b0"], // build, b0 leads to drop
  [pC, pC, pA, pA, pE, pE, pB, pB2, pC2, pC, pA2, pA, pE2, pE, pB2, pB], // drop A
  ["c1", "c1", "ab0", "ab0", "eb1", "eb1", "bb0", "bb0"], // breakdown pedal
  ["c1", "c1", "ab0", "ab0", "eb1", "eb1", "bb0", "bb0"], // verse 2
  [qC, qC, qA, qA, qE, qE, qB, qB, qC2, qC, qA, qA, qE2, qE, qB, qB2], // drop B
  ["c1", "ab0", "eb1", "bb0", "c1", "~", "~", "c1"] // outro
);
const sub = N(subBars)
  .s("sine").attack(0.02).decay(0.06).sustain(0.92).release(0.1).gain(0.72);

// ---- drums -----------------------------------------------------------------
const v = "bd ~ ~ ~ ~ ~ ~ ~";
const v2 = "bd ~ ~ ~ ~ ~ bd ~";
const kC = "bd ~ [~ bd] ~ ~ ~ ~";
const kD = "bd ~ ~ ~ bd ~ ~ bd";
const b3 = "bd ~ bd ~ ~ ~ bd ~";
const kff = "bd bd bd bd bd bd bd bd";

const kickBars = lay(
  rep("~", 8),
  [v, v, v, v2, v, v, v, v2],
  [v2, v2, v2, v2, b3, b3, b3, kff],
  [v, v2, v, v2, v, v2, v, kC],
  [v2, v, kC, v2, v, kC, v2, v2],
  rep("~", 8),
  [v2, v, v, v2, v, v2, v, v2],
  [v2, v2, kC, v2, v, v2, kC, v2],
  [v2, kC, v2, kD, v2, kC, v2, v2],
  [v, v, ...rep("~", 6)]
);
const kick = S(kickBars).gain(0.9);

const s1 = "~ ~ ~ ~ sd ~ ~ ~";
const s2 = "~ ~ ~ ~ sd ~ ~ [sd ~]";
const s3 = "~ ~ ~ ~ sd ~ sd ~";
const sroll = "~ ~ ~ ~ sd sd [sd sd] [sd sd sd sd]";
const d2 = "~ ~ ~ ~ sd ~ ~ [~ sd]";
const f40 = "~ ~ ~ ~ sd ~ [sd sd] [sd sd sd]";
const f72 = "~ ~ ~ ~ sd [sd sd] sd [sd sd sd sd]";

const snareBars = lay(
  rep("~", 8),
  [s1, s1, s1, s2, s1, s1, s1, s2],
  [s2, s2, s2, s2, s3, s3, sroll, "~"],
  [s1, d2, s1, d2, s1, d2, s1, d2],
  [d2, d2, s1, d2, d2, s1, d2, f40],
  rep("~", 8),
  [s1, s2, s1, s2, s1, s2, s1, s2],
  [d2, d2, d2, d2, d2, d2, s1, d2],
  [d2, d2, d2, s3, d2, d2, d2, f72],
  rep("~", 8)
);
const snare = S(snareBars).gain(0.6).room(0.3);

const clapBars = lay(
  rep("~", 24),
  [...rep("~ ~ ~ ~ cp ~ ~ ~", 15), "~"],
  rep("~", 16),
  [...rep("~ ~ ~ ~ cp ~ ~ ~", 15), "~"],
  rep("~", 8)
);
const clap = S(clapBars).gain(0.38).room(0.45);

const h1 = "hh hh hh hh hh hh hh [hh hh]";
const h2 = "hh hh [hh hh] hh hh hh hh hh";
const h3 = "hh hh [hh hh] hh hh [hh hh] hh hh";

const hatBars = lay(
  rep("~", 8),
  [h1, h2, h1, h2, h1, h2, h1, h2],
  [h1, h1, h1, h1, h3, h3, h3, h1],
  [h1, h1, h2, h1, h1, h2, h1, h2],
  [h2, h1, h3, h1, h2, h1, h3, h2],
  rep("~", 8),
  [h2, h1, h2, h1, h2, h1, h2, h3],
  [h3, h2, h3, h2, h3, h2, h3, h2],
  [h3, h3, h2, h3, h3, h2, h3, h3],
  rep("~", 8)
);
const hats = S(hatBars).gain(0.48);

// quiet hats for the calm passages
const qh = "hh ~ hh ~ hh ~ hh ~";
const qhatBars = lay(
  rep("~", 4), rep(qh, 4), rep("~", 36), rep(qh, 4), rep("~", 24), rep(qh, 4), rep("~", 4)
);
const qhats = S(qhatBars).gain(0.26);

const o1 = "~ ~ oh ~ ~ ~ oh ~";
const o2 = "~ ~ oh ~ ~ oh ~ ~";
const ohBars = lay(
  rep("~", 24),
  rep(o1, 8),
  [o1, o1, o2, o1, o1, o2, o1, "~"],
  rep("~", 16),
  [o1, o2, o1, o2, o1, o2, o1, o2],
  [o1, o2, o1, o1, o2, o1, o2, "~"],
  rep("~", 8)
);
const openHats = S(ohBars).gain(0.3);

const r1 = "~ ~ rim ~ ~ rim ~ ~";
const r2 = "~ ~ rim ~ ~ ~ rim ~";
const rimBars = lay(
  rep("~", 8),
  [r1, r2, r1, r2, r1, r2, r1, r2],
  rep("~", 32),
  [r1, r2, r1, r2, r1, r2, r1, r2],
  [r2, r1, r2, r1, r2, r1, r2, r1],
  [r2, r2, r1, r2, r2, r1, r2, "~"],
  rep("~", 8)
);
const rims = S(rimBars).gain(0.3);

const sh1 = "sh sh sh sh sh sh sh sh";
const sh2 = "sh sh [sh sh] sh sh sh [sh sh] sh";
const shakerBars = lay(rep("~", 48), rep(sh1, 16), rep(sh2, 8), rep("~", 8));
const shaker = S(shakerBars).gain(0.16);

const crashIdx = [0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 79];
const crashBars = Array.from({ length: 80 }, (_, i) => (crashIdx.includes(i) ? "cr" : "~"));
const crashes = S(crashBars).gain(0.5).room(0.8);

// riser swells into each drop
const riserBars = lay(rep("~", 20), ["c4", "eb4", "g4", "bb4"], rep("~", 30), ["g4", "bb4"], rep("~", 24));
const riser = N(riserBars)
  .s("sawtooth").attack(0.35).decay(0.1).sustain(0.8).release(0.4)
  .lpf(2800).gain(0.13).room(0.7);

// ---- arpeggio (sawtooth pluck) ----------------------------------------------
const aC = "[c4 eb4 g4 bb4]*2";
const aA = "[ab3 c4 eb4 g4]*2";
const aE = "[eb4 g4 bb4 d5]*2";
const aB = "[bb3 d4 f4 ab4]*2";
const bC = "[c4 eb4 g4 bb4]*4";
const bA = "[ab3 c4 eb4 g4]*4";
const bE = "[eb4 g4 bb4 d5]*4";
const bB = "[bb3 d4 f4 ab4]*4";
const uC = "[c4 eb4 g4 bb4 c5 bb4 g4 eb4]*2";
const uA = "[ab3 c4 eb4 g4 ab4 g4 eb4 c4]*2";
const uE = "[eb4 g4 bb4 d5 eb5 d5 bb4 g4]*2";
const uB = "[bb3 d4 f4 ab4 bb4 ab4 f4 d4]*2";

const arpV = [aC, aC, aA, aA, aE, aE, aB, aB];
const arpB = [bC, bC, bA, bA, bE, bE, bB, bB];
const arpU = [uC, uC, uA, uA, uE, uE, uB, uB];

const arpEnv = (p) => p.s("sawtooth").attack(0.003).decay(0.09).sustain(0).room(0.3);
const arpVerse = arpEnv(N(place(8, arpV))).lpf(950).gain(0.26);
const arpBuild = arpEnv(N(place(16, arpB))).lpf(1750).gain(0.25);
const arpDropA2 = arpEnv(N(place(32, arpV))).lpf(1100).gain(0.19);
const arpVerse2 = arpEnv(N(place(48, arpB))).lpf(1500).gain(0.23);
const arpDropB = arpEnv(N(place(56, [...arpU, ...arpU]))).lpf(1900).gain(0.21);

// ---- bell motif (triangle, the signature of the piece) ----------------------
const m1 = "g5 ~ ~ ~ eb5 ~ ~ ~";
const m2 = "~ ~ d5 ~ ~ ~ ~ ~";
const m3 = "eb5 ~ ~ ~ g5 ~ bb5 ~";
const m4 = "~ ~ ~ ~ ~ ~ d5 ~";
const m4b = "~ ~ ~ ~ f5 ~ g5 ~";
const fin = "c6 ~ ~ ~ ~ ~ ~ ~";

const bellBars = lay(
  [m1, m2, m3, m4, m1, m2, m3, m4b],
  rep("~", 32),
  [m1, m2, m3, m4b, m1, m2, m3, m4],
  rep("~", 24),
  [m1, m2, m3, m4b, m1, m2, "~", fin]
);
const bells = N(bellBars)
  .s("triangle").attack(0.004).decay(0.32).sustain(0)
  .gain(0.38).delay(0.55).delaytime(0.45).delayfeedback(0.38).room(0.85);

// ---- lead (sawtooth, drop motif) --------------------------------------------
const L1 = "g4 ~ ~ eb5 ~ ~ d5 ~";
const L2 = "~ ~ c5 ~ ~ ~ ~ ~";
const L3 = "c5 ~ ~ eb5 ~ ~ f5 ~";
const L4 = "~ ~ eb5 ~ ~ ~ d5 ~";
const L5 = "g4 ~ ~ bb4 ~ ~ d5 ~";
const L6 = "~ ~ eb5 ~ ~ ~ ~ ~";
const L7 = "d5 ~ ~ f5 ~ ~ ab5 ~";
const L8 = "~ ~ g5 ~ ~ ~ ~ ~";
const F40 = "~ ~ ~ ~ g4 ab4 bb4 c5";
const F72 = "c5 d5 eb5 f5 g5 ab5 bb5 c6";

const leadEnv = (p) =>
  p.s("sawtooth").attack(0.02).decay(0.1).sustain(0.7).release(0.12)
    .delay(0.45).delaytime(0.45).delayfeedback(0.3).room(0.5).shape(0.15);

const lead1 = leadEnv(N(lay(rep("~", 24), [L1, L2, L3, L4, L5, L6, L7, L8], rep("~", 48))))
  .lpf(2600).gain(0.4);
// second half of drop A: lead jumps an octave on the Eb/Bb bars
const lead2 = leadEnv(N(lay(rep("~", 32), [L1, L2, L3, L4, L5, L6, L7, F40], rep("~", 40)), [36, 37, 38]))
  .lpf(2900).gain(0.36);
const lead3 = leadEnv(
  N(lay(rep("~", 56), [L1, L2, L3, L4, L5, L6, L7, L8], [L1, L2, L3, L4, L5, L6, L7, F72], rep("~", 8)))
).lpf(2600).gain(0.42);

// harmony shadow under the drop B lead (diatonic sixth below)
const harm = N(lay(rep("~", 56), [L1, L2, L3, L4, L5, L6, L7, L8], [L1, L2, L3, L4, L5, L6, L7, "~"], rep("~", 8)))
  .add(note(-4))
  .s("square").attack(0.03).decay(0.1).sustain(0.6).release(0.1)
  .lpf(1800).gain(0.2).room(0.5).delay(0.3).delaytime(0.45).delayfeedback(0.25);

// ---- full arrangement -------------------------------------------------------
stack(
  padIntro, padVerse, padBuildA, padBuildB, padDropA, padBreak, padVerse2, padDropB, padOutro,
  sub,
  kick, snare, clap, hats, qhats, openHats, rims, shaker, crashes,
  riser,
  arpVerse, arpBuild, arpDropA2, arpVerse2, arpDropB,
  bells,
  lead1, lead2, lead3, harm
);
