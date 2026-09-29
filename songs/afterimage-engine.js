// AFTERIMAGE ENGINE — 128 BPM, 120 bars / 3:45 before the arrangement repeats.
// Each cycle is one bar of 4/4. The eight-bar scenes form one continuous arc.
setcpm(128 / 4);

// D minor's recurring four-chord orbit: Dm9 / Bbmaj9 / Fadd9 / Cadd9.
const chords = "<[d3,f3,a3,c4,e4] [bb2,d3,f3,a3,c4] [f3,a3,c4,g4] [c3,e3,g3,d4]>";
const turnChords = "<[g2,bb2,d3,f3,a3] [f2,a2,d3,f3] [eb3,g3,bb3,d4] [a2,c#3,e3,g3,bb3]>";

const haze = note(chords).s("sawtooth").lpf(1150).attack(.36).decay(.5)
  .sustain(.55).release(1.2).gain(.105).room(.36).orbit(3);
const brightHaze = note(chords).s("triangle").attack(.08).release(.8)
  .gain(.17).room(.28).orbit(3);
const turnHaze = note(turnChords).s("sawtooth").lpf(1400).attack(.25)
  .release(1.15).gain(.105).room(.4).orbit(3);

// The high figure is heard first as fragments, then becomes the main hook.
const hookNotes = `<
  [~ a4 c5 d5 ~ f5 e5 d5]
  [~ a4 c5 d5 ~ f5 e5 c5]
  [~ c5 e5 f5 ~ a5 g5 f5]
  [~ g4 c5 e5 ~ d5 c5 a4]
  [a4 c5 d5 ~ f5 e5 d5 c5]
  [a4 c5 d5 ~ e5 f5 a5 ~]
  [c5 e5 f5 ~ a5 g5 f5 e5]
  [g4 c5 e5 ~ d5 c5 a4 ~]
>`;
const hook = note(hookNotes).s("square").lpf(2200).attack(.008)
  .decay(.17).sustain(.23).release(.13).gain(.18)
  .delay(.19).delaytime(.375).delayfeedback(.28).room(.19).orbit(4);
const glassHook = note(hookNotes).s("triangle").attack(.006)
  .decay(.25).sustain(.08).release(.28).gain(.25)
  .delay(.13).delaytime(.375).delayfeedback(.24).room(.32).orbit(4);
const fragments = note(`<
  [~ ~ c5 d5 ~ ~ e5 ~]
  [~ ~ c5 d5 ~ ~ f5 ~]
  [~ ~ e5 f5 ~ ~ g5 ~]
  [~ ~ c5 e5 ~ ~ d5 ~]
  [~ a4 c5 d5 ~ ~ e5 ~]
  [~ a4 c5 d5 ~ ~ f5 ~]
  [~ c5 e5 f5 ~ ~ g5 ~]
  [~ g4 c5 e5 ~ ~ d5 ~]
>`).s("triangle").attack(.008).decay(.24).sustain(.08)
  .release(.25).gain(.19).delay(.12).delaytime(.375).room(.3).orbit(4);

const answer = note(`<
  [~ ~ f4 ~ a4 ~ c5 ~]
  [~ ~ f4 ~ a4 ~ d5 ~]
  [~ ~ a4 ~ c5 ~ e5 ~]
  [~ ~ e4 ~ g4 ~ c5 ~]
  [~ ~ f4 ~ a4 ~ d5 ~]
  [~ ~ f4 ~ a4 ~ c5 ~]
  [~ ~ a4 ~ c5 ~ e5 ~]
  [~ ~ e4 ~ g4 ~ a4 ~]
>`).s("sine").attack(.025).release(.42).gain(.24)
  .room(.26).pan(.68).orbit(5);

const turnLead = note(`<
  [~ d5 f5 g5 ~ a5 f5 d5]
  [~ a4 d5 f5 ~ e5 d5 a4]
  [~ g4 bb4 d5 ~ g5 f5 d5]
  [~ c#5 e5 g5 ~ e5 c#5 a4]
>`).s("triangle").attack(.014).decay(.2).sustain(.2)
  .release(.2).gain(.26).delay(.18).delaytime(.375).room(.28).orbit(4);

const shimmer = note(`<
  [d4 f4 a4 c5 f4 a4 c5 e5]
  [bb3 d4 f4 a4 d4 f4 a4 c5]
  [f4 a4 c5 g5 a4 c5 e5 g5]
  [c4 e4 g4 d5 e4 g4 c5 d5]
>`).s("triangle").attack(.005).decay(.12).sustain(.06)
  .release(.13).gain(.16).pan("<.18 .82 .28 .72>")
  .delay(.13).delaytime(.375).room(.31).orbit(5);

const stabs = note(`<
  [[d4,a4,c5] ~ [d4,a4,c5] ~]
  [[bb3,f4,a4] ~ [bb3,f4,a4] ~]
  [[f4,c5,e5] ~ [f4,c5,e5] ~]
  [[c4,g4,d5] ~ [c4,g4,d5] ~]
>`).s("sawtooth").lpf(900).attack(.012).decay(.21)
  .sustain(.08).release(.15).gain(.19).room(.14).orbit(3);
const turnStabs = note(`<
  [[g3,d4,f4] ~ [g3,d4,f4] ~]
  [[f3,a3,d4] ~ [f3,a3,d4] ~]
  [[eb3,bb3,d4] ~ [eb3,bb3,d4] ~]
  [[a3,c#4,g4] ~ [a3,c#4,g4] ~]
>`).s("sawtooth").lpf(1050).attack(.012).decay(.21)
  .sustain(.08).release(.15).gain(.18).room(.14).orbit(3);

const codaHaze = note(`<
  [d3,f3,a3,c4,e4] [bb2,d3,f3,a3,c4]
  [f3,a3,c4,g4] [c3,e3,g3,d4]
  [bb2,d3,f3,a3,c4] [f3,a3,c4,g4]
  [c3,e3,g3,d4] [d3,f3,a3,c4,e4]
>`).s("triangle").attack(.13).release(1.25)
  .gain(.18).room(.4).orbit(3);
const codaBell = note(`<
  [a4 c5 d5 ~ f5 e5 d5 ~]
  [a4 ~ c5 d5 ~ f5 e5 ~]
  [c5 e5 f5 ~ a5 g5 f5 ~]
  [g4 c5 e5 ~ d5 c5 a4 ~]
  [a4 c5 d5 ~ f5 ~ e5 ~]
  [c5 e5 f5 ~ a5 ~ g5 ~]
  [g4 c5 e5 ~ d5 c5 a4 ~]
  [d5 ~ ~ ~ ~ ~ ~ ~]
>`).s("triangle").attack(.012).decay(.3).sustain(.14)
  .release(.65).gain(.23).delay(.12).delaytime(.375).room(.4).orbit(4);

const bassNotes = `<
  [d2 ~ d2 a1 d2 ~ c2 a1]
  [bb1 ~ bb1 f2 bb1 ~ a1 f1]
  [f2 ~ f2 c2 f2 ~ e2 c2]
  [c2 ~ c2 g1 c2 ~ e2 g1]
>`;
const bass = note(bassNotes).s("sawtooth").lpf(440).attack(.008)
  .decay(.15).sustain(.28).release(.08).gain(.38).orbit(2);
const sub = note("<[d2 ~ d2 ~] [bb1 ~ bb1 ~] [f2 ~ f2 ~] [c2 ~ c2 ~]>")
  .s("sine").attack(.012).release(.16).gain(.22).orbit(2);
const turnBass = note(`<
  [g1 ~ g1 d2 g1 ~ f2 d2]
  [f1 ~ f1 c2 f1 ~ e2 c2]
  [eb2 ~ eb2 bb1 eb2 ~ d2 bb1]
  [a1 ~ a1 e2 a1 ~ g1 e2]
>`).s("sawtooth").lpf(480).attack(.008).decay(.17)
  .sustain(.25).release(.07).gain(.39).orbit(2);

// Drum kit: brittle hats over a heavy, slightly displaced kick.
const ghostKick = s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~")
  .bank("RolandTR909").gain(.53).orbit(1);
const breakKick = s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ bd ~")
  .bank("RolandTR909").gain(.76).orbit(1);
const floorKick = s("bd ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~")
  .bank("RolandTR909").gain(.79).duckorbit("2:3:4:5")
  .duckattack(.19).duckdepth(.38).orbit(1);
const backbeat = s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~")
  .bank("RolandTR909").gain(.57).orbit(1);
const clap = s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~")
  .gain(.27).orbit(1);
const ticks = s("hh*8").bank("RolandTR707")
  .gain("[.15 .08 .19 .09 .17 .08 .24 .11]").swingBy(1/3, 4).orbit(1);
const highHats = s("hh*16").bank("RolandTR707")
  .gain("[.15 .055 .10 .055 .2 .055 .1 .055 .16 .055 .11 .055 .22 .055 .12 .055]")
  .swingBy(1/3, 4).orbit(1);
const openHat = s("~ oh ~ oh").bank("RolandTR909").gain(.16).orbit(1);
const rim = s("~ ~ ~ rim ~ ~ [rim rim] ~").gain(.18).orbit(1);
const crash = s("cr ~ ~ ~").bank("RolandTR909").gain(.24).orbit(1);

// Eight bars of rising air and increasingly close snare strokes.
const lift = s("white*8").hpf("<1200 1600 2300 3200 4400 6000 7800 10000>")
  .decay(.045).sustain(0).gain("<.025 .035 .045 .06 .075 .09 .105 .12>")
  .orbit(6);
const roll = s("<[~ sd ~ sd] [~ sd ~ sd] [sd*4] [sd*4] [sd*8] [sd*8] [sd*16] [sd*16]>")
  .bank("RolandTR909").gain("<.09 .1 .12 .13 .15 .17 .19 .21>").orbit(1);

const scenes = [
  // 00–08: a room comes into focus.
  [haze, shimmer],
  // 08–16: the pulse is suggested before the backbeat arrives.
  [haze, shimmer, sub, ghostKick, ticks],
  // 16–24: asymmetric breakbeat, bass, and the first melodic fragments.
  [haze, bass, breakKick, backbeat, ticks, rim, fragments],
  // 24–32: the hook takes the foreground.
  [brightHaze, bass, breakKick, backbeat, clap, ticks, glassHook, answer],
  // 32–40: pull the kick away while the snare and noise climb.
  [haze, sub, stabs, hook, lift, roll],
  // 40–48: first release.
  [haze, stabs, bass, sub, floorKick, backbeat, clap, highHats, openHat, hook, crash],
  // 48–56: keep the pressure, change the lead's color.
  [brightHaze, stabs, bass, sub, floorKick, backbeat, highHats, rim, glassHook, answer],
  // 56–64: a wide, nearly weightless clearing.
  [haze, shimmer, answer, ghostKick],
  // 64–72: G minor, F, Eb, and an A dominant turn the harmony inward.
  [turnHaze, turnBass, breakKick, backbeat, ticks, turnLead],
  // 72–80: hold the new harmony under the second climb.
  [turnHaze, turnBass, turnStabs, turnLead, lift, roll],
  // 80–88: the second peak returns to the home progression.
  [haze, stabs, bass, sub, floorKick, backbeat, clap, highHats, openHat, hook, answer, crash],
  // 88–96: an answering voice and sharper percussion.
  [brightHaze, bass, sub, floorKick, backbeat, clap, highHats, rim, hook, answer],
  // 96–104: open the chord and let the melody breathe once more.
  [brightHaze, shimmer, bass, floorKick, backbeat, ticks, openHat, glassHook],
  // 104–112: the rhythm recedes.
  [haze, shimmer, sub, ghostKick, ticks, answer],
  // 112–120: final statement and a sustained D minor landing.
  [codaHaze, codaBell],
];

arrange(...scenes.map(parts => [8, stack(...parts)]));
