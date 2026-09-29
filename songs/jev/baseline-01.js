// Jev-directed procedural composition; decisions made by jev-1.13.0.
// hypnotic dance; 136 BPM; 104 bars = 183.5 seconds before looping.
// Built-in Strudel sounds only. Decision transcript is in the adjacent JSON file.
setcpm(136 / 4);
const line = (...bars) => cat(...bars.map(bar => note(bar)));
const harmony = note("<[d3,f3,a3,c4] [b3,d4,f4,a4] [g3,b3,d4,f4] [a3,c4,e4,g4]>");
const pad = harmony.s("sawtooth").attack(0.4).release(0.8).lpf(1300).room(0.55).gain(0.18);
const bass = line("d2 ~ ~ ~ d2 ~ ~ ~", "b2 ~ ~ ~ b2 ~ ~ ~", "g2 ~ ~ ~ g2 ~ ~ ~", "a2 ~ ~ ~ a2 ~ ~ ~").s("sawtooth").lpf(700).attack(0.004).decay(0.18).sustain(0.2).release(0.08).gain(0.32);
const arp = line("d4 f4 a4 c5 a4 f4 c5 f4", "b4 d5 f5 a5 f5 d5 a5 d5", "g4 b4 d5 f5 d5 b4 f5 b4", "a4 c5 e5 g5 e5 c5 g5 c5").s("triangle").attack(0.003).decay(0.13).sustain(0).release(0.08).lpf(2600).gain(0.16).delay(0.22).delaytime(0.25);
const lead = line("d4 ~ f4 ~ a4 ~ f4 ~", "d5 ~ f5 ~ d5 ~ c5 ~", "c5 ~ a4 ~ g4 ~ e4 ~", "d5 ~ b4 ~ a4 ~ d4 ~").s("sawtooth").attack(0.01).release(0.22).lpf(1800).gain(0.25).delay(0.2).delaytime(0.375).room(0.2);
const variation = line("e4 ~ g4 ~ g4 ~ g4 ~", "c5 ~ f5 ~ d5 ~ a4 ~", "e5 ~ b4 ~ a4 ~ e4 ~", "b4 ~ g4 ~ g4 ~ d4 ~").s("sawtooth").attack(0.01).release(0.25).lpf(1800).gain(0.22).delay(0.2).delaytime(0.375).room(0.2);
const counter = line("f5 ~ a5 ~ b5 ~ a5 ~", "f6 ~ g6 ~ e6 ~ d6 ~", "d6 ~ d6 ~ b5 ~ f5 ~", "f6 ~ c6 ~ a5 ~ d5 ~").s("triangle").attack(0.02).release(0.3).lpf(3500).gain(0.13).pan(0.7).room(0.35);
const kick = s("bd ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~").bank("RolandTR909").gain(0.75);
const snare = s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").bank("RolandTR909").gain(0.42);
const hats = s("hh ~ hh ~ hh ~ hh ~ hh ~ hh ~ hh ~ hh ~").bank("RolandTR909").gain(0.12).hpf(5000);
const openHats = s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~").bank("RolandTR909").gain(0.1).hpf(5000);
const pulse = stack(kick.gain(0.55), hats.gain(0.55));
const fullDrums = stack(kick, snare, hats);
const brightDrums = stack(kick, snare, hats.gain(1.6), openHats);
const section1 = stack(arp, pad); // intro: arpeggio and pad, no drums
const section2 = stack(arp, pad); // foundation: arpeggio and pad, no drums
const section3 = stack(arp, pad, pulse); // first hook: arpeggio and pad, soft pulse
const section4 = stack(arp, pad); // break: arpeggio and pad, no drums
const section5 = stack(arp, pad, fullDrums); // rebuild: arpeggio and pad, full drums
const section6 = stack(arp, pad, fullDrums); // climax: arpeggio and pad, full drums
const section7 = stack(arp, pad); // outro: arpeggio and pad, no drums
arrange(
  [8, section1],
  [16, section2],
  [16, section3],
  [16, section4],
  [16, section5],
  [16, section6],
  [16, section7],
).gain(0.82);
