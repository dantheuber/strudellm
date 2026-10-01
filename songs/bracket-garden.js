// Bracket Garden
// Original strudellm track by Codex (OpenAI Codex agent), default effort.
// 108 BPM, E Dorian, broken-beat electronica; 96 bars = 3:33.33.
// A little musical grammar grows branches, tangles, then finds its roots.
// All voices are synthesized: no sample downloads or dependencies.
// Paste the complete file into https://strudel.cc and press Ctrl+Enter.
//
// Bars 1-8: seed; 9-24: roots; 25-48: canopy;
// 49-64: rain; 65-88: flowering; 89-96: clearing. Then repeat.

setcpm(108 / 4)

// Each bracket is one complete bar; alternation advances one bar per cycle.
const gardenLine = (bars) => mini('<' + bars.map(b => '[' + b + ']').join(' ') + '>')
const roots = ['e2', 'g2', 'a2', 'd2', 'e2', 'b2', 'a2', 'e2']
const voicings = [
  'g3,b3,d4,fs4', 'g3,b3,d4,a4', 'a3,cs4,e4,b4', 'a3,d4,e4,fs4',
  'g3,b3,e4,fs4', 'a3,b3,d4,fs4', 'g3,a3,cs4,e4', 'g3,b3,e4',
]
const sprout = [
  'e5 ~ b4 fs5 ~ e5 ~ ~', 'd5 ~ b4 ~ a4 ~ b4 ~',
  'cs5 ~ e5 ~ b4 a4 ~ ~', 'fs5 ~ e5 d5 ~ a4 ~ ~',
  'e5 ~ fs5 b5 ~ a5 fs5 ~', 'd5 ~ fs5 ~ a5 fs5 ~ b4',
  'e5 cs5 ~ b4 ~ a4 b4 ~', 'g4 ~ fs4 ~ e4 ~ ~ ~',
]
const blossom = [
  'b5 ~ a5 fs5 ~ e5 fs5 ~', 'g5 ~ fs5 d5 ~ b4 d5 ~',
  'e5 ~ cs5 e5 ~ fs5 a5 ~', 'a5 fs5 ~ e5 d5 ~ fs5 ~',
  'b5 a5 ~ fs5 e5 ~ fs5 b5', 'a5 ~ fs5 d5 ~ b4 fs5 ~',
  'e5 ~ fs5 e5 cs5 ~ b4 a4', 'b4 ~ g4 fs4 e4 ~ ~ ~',
]

const soil = note(gardenLine(voicings)).s('triangle')
  .attack(0.35).sustain(0.7).release(0.8).lpf(1700)
  .gain(0.13).room(0.55)

const twig = (phrases, level = 0.24) => note(gardenLine(phrases)).s('sine')
  .attack(0.003).decay(0.24).sustain(0).release(0.12)
  .gain(level).delay(0.25).delaytime(0.416667).delayfeedback(0.35)
  .room(0.25).pan('<0.35 0.65>')

const rootPulse = note(gardenLine(roots.map(r => r + ' ~ ' + r + ' ~ ~ ' + r + ' ~ ' + r)))
  .s('triangle').attack(0.006).decay(0.2).sustain(0.15).release(0.08)
  .lpf(650).gain(0.34)

// Pitch falls turn the sine oscillator into a rounded kick.
const footstep = note('e1 ~ ~ ~ ~ ~ e1 ~ ~ ~ e1 ~ ~ ~ ~ ~').s('sine')
  .penv(18).pdecay(0.045).attack(0.002).decay(0.19)
  .sustain(0).release(0.025).gain(0.65)
const branch = s('~ ~ ~ ~ white ~ ~ ~ ~ ~ ~ ~ white ~ ~ ~')
  .hpf(1600).lpf(7500).attack(0.001).decay(0.12).sustain(0)
  .release(0.025).gain(0.18)
const dew = s('white*8').hpf(8500).attack(0.001).decay(0.025)
  .sustain(0).release(0.01).gain('0.06 0.025 0.045 0.025 0.06 0.025 0.045 0.035')
  .pan('0.3 0.7')
const wood = note('~ e4 ~ ~ b3 ~ e4 ~').s('square')
  .lpf(1200).attack(0.001).decay(0.035).sustain(0).release(0.01)
  .gain(0.055).pan(0.75)
const kit = stack(footstep, branch, dew)

// A slower answering phrase leaves the main melody room to breathe.
const answer = twig([
  '~ ~ g4 ~ ~ ~ b4 ~', '~ ~ ~ ~ d5 ~ ~ ~',
  '~ ~ e4 ~ ~ ~ cs5 ~', '~ ~ ~ ~ a4 ~ ~ ~',
  '~ ~ b4 ~ ~ ~ g5 ~', '~ ~ ~ ~ fs5 ~ ~ ~',
  '~ ~ cs5 ~ ~ ~ e5 ~', 'b4 ~ ~ ~ e5 ~ ~ ~',
], 0.13).pan(0.2)

const seed = stack(soil, twig(sprout, 0.16))
const rootsSection = stack(soil, rootPulse, footstep, dew, twig(sprout, 0.21))
const canopy = stack(soil, rootPulse, kit, wood, twig(sprout), answer)
// No drums in the rain: longer notes reveal the harmony underneath the hook.
const rain = stack(
  soil.gain(0.17),
  note(gardenLine(['e5 b4', 'd5 a4', 'cs5 e5', 'fs5 d5',
    'b5 fs5', 'a5 d5', 'e5 cs5', 'b4 e5'])).s('triangle')
    .attack(0.08).decay(0.6).sustain(0.3).release(0.5)
    .gain(0.2).room(0.65),
  note(gardenLine(roots)).s('sine').attack(0.15).release(0.4).gain(0.18),
)
const flowering = stack(soil, rootPulse, kit, wood, twig(blossom, 0.26), answer)
const clearing = stack(soil, twig(sprout, 0.13))

arrange(
  [8, seed],
  [16, rootsSection],
  [24, canopy],
  [16, rain],
  [24, flowering],
  [8, clearing],
).postgain(0.8)
