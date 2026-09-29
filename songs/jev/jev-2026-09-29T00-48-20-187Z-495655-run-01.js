// Jev-directed procedural composition; decisions made by jev-1.13.0.
// cinematic downtempo; 108 BPM; 104 bars = 231.1 seconds before looping.
// Built-in Strudel sounds only. Decision transcript is in the adjacent JSON file.
setcpm(108 / 4);
const line = (...bars) => cat(...bars.map(bar => note(bar)));
const harmony = note("<[b3,d4,fs4,a4] [g4,b4,d5,fs5] [c4,e4,g4,b4] [fs4,a4,c5,e5]>");
const pad = harmony.s("square").attack(0.4).release(0.8).lpf(1300).room(0.55).gain(0.18);
const bass = line("b2 ~ ~ ~ d3 ~ ~ ~", "g3 ~ ~ ~ b3 ~ ~ ~", "c3 ~ ~ ~ e3 ~ ~ ~", "fs3 ~ ~ ~ a3 ~ ~ ~").s("sawtooth").lpf(700).attack(0.004).decay(0.18).sustain(0.2).release(0.08).gain(0.32);
const arp = line("b4 d5 fs5 a5 fs5 d5 a5 d5", "g5 b5 d6 fs6 d6 b5 fs6 b5", "c5 e5 g5 b5 g5 e5 b5 e5", "fs5 a5 c6 e6 c6 a5 e6 a5").s("triangle").attack(0.003).decay(0.13).sustain(0).release(0.08).lpf(2600).gain(0.16).delay(0.22).delaytime(0.25);
const lead = line("c5 ~ ~ c5 ~ g5 ~ ~", "c6 ~ ~ d6 ~ a5 ~ ~", "g5 ~ ~ d5 ~ c5 ~ ~", "g5 ~ ~ fs5 ~ b4 ~ ~").s("sine").attack(0.01).release(0.22).lpf(2600).gain(0.25).delay(0.2).delaytime(0.375).room(0.55);
const variation = line("b4 ~ g4 ~ c5 e5 ~ fs5", "g5 ~ a5 ~ a5 c6 ~ a5", "c5 ~ d5 ~ fs5 d5 ~ c5", "a5 ~ c6 ~ g5 fs5 ~ b4").s("sine").attack(0.01).release(0.25).lpf(2600).gain(0.22).delay(0.2).delaytime(0.375).room(0.55);
const counter = line("a5 ~ ~ e6 ~ b5 ~ ~", "a6 ~ ~ fs6 ~ e7 ~ ~", "b5 ~ ~ fs6 ~ e6 ~ ~", "d7 ~ ~ a6 ~ b5 ~ ~").s("triangle").attack(0.02).release(0.3).lpf(3500).gain(0.13).pan(0.7).room(0.35);
const kick = s("bd ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~").bank("RolandTR808").gain(0.75);
const hats = s("hh ~ ~ ~ hh ~ ~ ~ hh ~ ~ ~ hh ~ ~ ~").bank("RolandTR808").gain(0.12).hpf(5000);
const snare = s("~ ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~").bank("RolandTR808").gain(0.42);
const openHats = s("~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ ~ ~ ~ oh ~").bank("RolandTR808").gain(0.1).hpf(5000);
const pulse = stack(kick.gain(0.55), hats.gain(0.55));
const brightDrums = stack(kick, snare, hats.gain(1.6), openHats);
const section1 = stack(bass, pad, pulse); // intro: bass and pad, soft pulse
const section2 = stack(bass, pad, pulse); // foundation: bass and pad, soft pulse
const section3 = stack(lead, arp, bass, pad, pulse); // first hook: lead, arpeggio, and bass, soft pulse
const section4 = stack(lead, counter, arp, bass, pad); // break: lead, counterpoint, arpeggio, and bass, no drums
const section5 = stack(counter, arp, bass, pad, brightDrums); // rebuild: counterpoint, arpeggio, and bass, drums with brighter hats
const section6 = stack(lead, variation, counter, bass, pad, brightDrums); // climax: both hooks, counterpoint, and bass, drums with brighter hats
const section7 = stack(counter, arp, bass, pad); // outro: counterpoint, arpeggio, and bass, no drums
arrange(
  [8, section1],
  [16, section2],
  [16, section3],
  [16, section4],
  [16, section5],
  [16, section6],
  [16, section7],
).gain(0.82);
