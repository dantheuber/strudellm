// Jev-directed procedural composition; decisions made by jev-1.13.0.
// nighttime breakbeat; 136 BPM; 104 bars = 183.5 seconds before looping.
// Built-in Strudel sounds only. Decision transcript is in the adjacent JSON file.
setcpm(136 / 4);
const line = (...bars) => cat(...bars.map(bar => note(bar)));
const harmony = note("<[d3,f3,a3,c4] [as3,d4,f4,a4] [a3,c4,ds4,g4] [g3,as3,d4,f4]>");
const pad = harmony.s("sawtooth").attack(0.4).release(0.8).lpf(1300).room(0.55).gain(0.18);
const bass = line("d2 ~ ~ a2 ~ ~ d2 ~", "as2 ~ ~ f3 ~ ~ as2 ~", "a2 ~ ~ ds3 ~ ~ a2 ~", "g2 ~ ~ d3 ~ ~ g2 ~").s("sawtooth").lpf(700).attack(0.004).decay(0.18).sustain(0.2).release(0.08).gain(0.32);
const arp = line("d4 f4 a4 c5 a4 f4 c5 f4", "as4 d5 f5 a5 f5 d5 a5 d5", "a4 c5 ds5 g5 ds5 c5 g5 c5", "g4 as4 d5 f5 d5 as4 f5 as4").s("triangle").attack(0.003).decay(0.13).sustain(0).release(0.08).lpf(2600).gain(0.16).delay(0.22).delaytime(0.25);
const lead = line("ds4 ~ as4 ~ g4 a4 ~ as4", "f5 ~ c5 ~ g5 ds5 ~ ds5", "c5 ~ f5 ~ d5 c5 ~ as4", "ds5 ~ c5 ~ a4 f4 ~ d4").s("sawtooth").attack(0.01).release(0.22).lpf(2600).gain(0.25).delay(0.2).delaytime(0.375).room(0.55);
const variation = line("ds4 f4 ~ ~ ds4 ~ as4 ~", "d5 as4 ~ ~ ds5 ~ c5 ~", "as4 ds5 ~ ~ c5 ~ f5 ~", "c5 c5 ~ ~ f5 ~ d4 ~").s("sawtooth").attack(0.01).release(0.25).lpf(2600).gain(0.22).delay(0.2).delaytime(0.375).room(0.55);
const counter = line("c5 ~ ~ c5 ds5 ~ ~ g5", "c6 ~ ~ d6 ds6 ~ ~ c6", "as5 ~ ~ ds6 as5 ~ ~ g5", "ds6 ~ ~ a5 f5 ~ ~ d5").s("triangle").attack(0.02).release(0.3).lpf(3500).gain(0.13).pan(0.7).room(0.35);
const kick = s("bd ~ ~ ~ ~ ~ bd ~ bd ~ ~ bd ~ ~ bd ~").bank("RolandTR909").gain(0.75);
const hats = s("hh ~ hh ~ ~ hh ~ ~ hh ~ hh ~ ~ hh ~ ~").bank("RolandTR909").gain(0.12).hpf(5000);
const snare = s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ sd").bank("RolandTR909").gain(0.42);
const openHats = s("~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ ~ ~ ~ oh ~").bank("RolandTR909").gain(0.1).hpf(5000);
const pulse = stack(kick.gain(0.55), hats.gain(0.55));
const fullDrums = stack(kick, snare, hats);
const brightDrums = stack(kick, snare, hats.gain(1.6), openHats);
const section1 = stack(lead, counter, pad, pulse); // intro: lead and counterpoint, soft pulse
const section2 = stack(bass, pad, pulse); // foundation: bass and pad, soft pulse
const section3 = stack(lead, counter, pad, pulse); // first hook: lead and counterpoint, soft pulse
const section4 = stack(bass, pad, pulse); // break: bass and pad, soft pulse
const section5 = stack(lead, arp, bass, pad, fullDrums); // rebuild: lead, arpeggio, and bass, full drums
const section6 = stack(variation, arp, pad, brightDrums); // climax: alternate hook and arpeggio, drums with brighter hats
const section7 = stack(lead, bass, pad); // outro: lead and bass, no drums
arrange(
  [8, section1],
  [16, section2],
  [16, section3],
  [16, section4],
  [16, section5],
  [16, section6],
  [16, section7],
).gain(0.82);
