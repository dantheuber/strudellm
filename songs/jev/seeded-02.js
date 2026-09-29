// Jev-directed procedural composition; decisions made by jev-1.13.0.
// cinematic downtempo; 108 BPM; 104 bars = 231.1 seconds before looping.
// Built-in Strudel sounds only. Decision transcript is in the adjacent JSON file.
setcpm(108 / 4);
const line = (...bars) => cat(...bars.map(bar => note(bar)));
const harmony = note("<[d3,f3,a3,c4] [c4,e4,g4,b4] [g3,b3,d4,f4] [a3,c4,e4,g4]>");
const pad = harmony.s("sine").attack(0.4).release(0.8).lpf(1300).room(0.55).gain(0.18);
const bass = line("d2 ~ ~ d2 ~ ~ f2 ~", "c3 ~ ~ c3 ~ ~ e3 ~", "g2 ~ ~ g2 ~ ~ b2 ~", "a2 ~ ~ a2 ~ ~ c3 ~").s("sawtooth").lpf(700).attack(0.004).decay(0.18).sustain(0.2).release(0.08).gain(0.32);
const arp = line("d4 f4 a4 c5 a4 f4 c5 f4", "c5 e5 g5 b5 g5 e5 b5 e5", "g4 b4 d5 f5 d5 b4 f5 b4", "a4 c5 e5 g5 e5 c5 g5 c5").s("triangle").attack(0.003).decay(0.13).sustain(0).release(0.08).lpf(2600).gain(0.16).delay(0.22).delaytime(0.25);
const lead = line("c4 ~ ~ a4 g4 ~ ~ c5", "a5 ~ ~ d5 b5 ~ ~ g5", "b4 ~ ~ d5 c5 ~ ~ b4", "f5 ~ ~ e5 d5 ~ ~ d4").s("sine").attack(0.01).release(0.22).lpf(2600).gain(0.25).delay(0.2).delaytime(0.375).room(0.55);
const variation = line("c4 ~ ~ a4 e4 ~ ~ c5", "a5 ~ ~ d5 a5 ~ ~ a5", "a4 ~ ~ f5 c5 ~ ~ a4", "f5 ~ ~ d5 b4 ~ ~ d4").s("sine").attack(0.01).release(0.25).lpf(2600).gain(0.22).delay(0.2).delaytime(0.375).room(0.55);
const counter = line("c5 ~ ~ b4 ~ c5 ~ ~", "b5 ~ ~ c6 ~ e6 ~ ~", "f5 ~ ~ a5 ~ d6 ~ ~", "c6 ~ ~ e6 ~ d5 ~ ~").s("triangle").attack(0.02).release(0.3).lpf(3500).gain(0.13).pan(0.7).room(0.35);
const kick = s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~").bank("RolandTR909").gain(0.75);
const hats = s("hh ~ hh ~ ~ hh ~ ~ hh ~ hh ~ ~ hh ~ ~").bank("RolandTR909").gain(0.12).hpf(5000);
const snare = s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").bank("RolandTR909").gain(0.42);
const pulse = stack(kick.gain(0.55), hats.gain(0.55));
const fullDrums = stack(kick, snare, hats);
const section1 = stack(arp, pad); // intro: arpeggio and pad, no drums
const section2 = stack(counter, arp, bass, pad, pulse); // foundation: counterpoint, arpeggio, and bass, soft pulse
const section3 = stack(lead, counter, pad, pulse); // first hook: lead and counterpoint, soft pulse
const section4 = stack(pad); // break: pad, no drums
const section5 = stack(lead, arp, bass, pad, pulse); // rebuild: lead, arpeggio, and bass, soft pulse
const section6 = stack(variation, counter, arp, bass, pad, fullDrums); // climax: alternate hook, counterpoint, arpeggio, and bass, full drums
const section7 = stack(lead, counter, arp, bass, pad); // outro: lead, counterpoint, arpeggio, and bass, no drums
arrange(
  [8, section1],
  [16, section2],
  [16, section3],
  [16, section4],
  [16, section5],
  [16, section6],
  [16, section7],
).gain(0.82);
