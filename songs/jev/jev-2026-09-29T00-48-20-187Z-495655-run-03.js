// Jev-directed procedural composition; decisions made by jev-1.13.0.
// hypnotic dance; 96 BPM; 104 bars = 260.0 seconds before looping.
// Built-in Strudel sounds only. Decision transcript is in the adjacent JSON file.
setcpm(96 / 4);
const line = (...bars) => cat(...bars.map(bar => note(bar)));
const harmony = note("<[d3,f3,a3,c4] [as3,d4,f4,a4] [c4,ds4,g4,as4] [a3,c4,ds4,g4]>");
const pad = harmony.s("triangle").attack(0.4).release(0.8).lpf(1300).room(0.55).gain(0.18);
const bass = line("d2 ~ f2 ~ a2 ~ f2 ~", "as2 ~ d3 ~ f3 ~ d3 ~", "c3 ~ ds3 ~ g3 ~ ds3 ~", "a2 ~ c3 ~ ds3 ~ c3 ~").s("sawtooth").lpf(700).attack(0.004).decay(0.18).sustain(0.2).release(0.08).gain(0.32);
const arp = line("d4 f4 a4 c5 a4 f4 c5 f4", "as4 d5 f5 a5 f5 d5 a5 d5", "c5 ds5 g5 as5 g5 ds5 as5 ds5", "a4 c5 ds5 g5 ds5 c5 g5 c5").s("triangle").attack(0.003).decay(0.13).sustain(0).release(0.08).lpf(2600).gain(0.16).delay(0.22).delaytime(0.25);
const lead = line("ds4 ~ ds4 ~ ~ f4 ~ a4", "c5 ~ d5 ~ ~ f5 ~ c5", "ds5 ~ a5 ~ ~ ds5 ~ as4", "ds5 ~ d5 ~ ~ as4 ~ d4").s("sine").attack(0.01).release(0.22).lpf(2600).gain(0.25).delay(0.4).delaytime(0.375).room(0.55);
const variation = line("f4 ~ a4 ~ a4 a4 ~ ds4", "f5 ~ f5 ~ g5 c5 ~ as4", "g5 ~ g5 ~ ds5 as4 ~ d5", "d5 ~ d5 ~ a4 c5 ~ d4").s("sine").attack(0.01).release(0.25).lpf(2600).gain(0.22).delay(0.4).delaytime(0.375).room(0.55);
const counter = line("d5 ~ ~ as5 ~ f5 ~ ~", "f6 ~ ~ c6 ~ g6 ~ ~", "d6 ~ ~ as6 ~ a6 ~ ~", "g6 ~ ~ ds6 ~ d5 ~ ~").s("triangle").attack(0.02).release(0.3).lpf(3500).gain(0.13).pan(0.7).room(0.35);
const kick = s("bd ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ ~ ~").bank("RolandTR808").gain(0.75);
const hats = s("hh ~ hh ~ ~ hh ~ ~ hh ~ hh ~ ~ hh ~ ~").bank("RolandTR808").gain(0.12).hpf(5000);
const snare = s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").bank("RolandTR808").gain(0.42);
const pulse = stack(kick.gain(0.55), hats.gain(0.55));
const fullDrums = stack(kick, snare, hats);
const section1 = stack(arp, pad, pulse); // intro: arpeggio and pad, soft pulse
const section2 = stack(lead, arp, bass, pad, pulse); // foundation: lead, arpeggio, and bass, soft pulse
const section3 = stack(lead, arp, bass, pad, pulse); // first hook: lead, arpeggio, and bass, soft pulse
const section4 = stack(arp, pad, pulse); // break: arpeggio and pad, soft pulse
const section5 = stack(variation, counter, arp, bass, pad, fullDrums); // rebuild: alternate hook, counterpoint, arpeggio, and bass, full drums
const section6 = stack(variation, counter, arp, bass, pad, fullDrums); // climax: alternate hook, counterpoint, arpeggio, and bass, full drums
const section7 = stack(arp, pad, pulse); // outro: arpeggio and pad, soft pulse
arrange(
  [8, section1],
  [16, section2],
  [16, section3],
  [16, section4],
  [16, section5],
  [16, section6],
  [16, section7],
).gain(0.82);
