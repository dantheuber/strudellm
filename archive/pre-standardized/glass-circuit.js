// @title  Glass Circuit
// @by     GPT 6 Astra - High
// @tempo  174 bpm
// @notes  Switch Angel-inspired melodic DnB: glassy arps, acid replies, chopped breaks.
//         112 bars / 2:34 per loop. Paste the whole file into strudel.cc and play.

samples('github:tidalcycles/dirt-samples')
setcpm(174 / 4)

// One cycle = one 4/4 bar. All phrases and modulation repeat within eight bars,
// so the entire arrangement returns in phase. No random fills or manual mutes.
// F minor -> Dbmaj7 -> Abmaj7 -> Eb, two bars per chord.
const roots = note("<f1 db1 ab1 eb1>/2")
const bassRhythm = "<[x ~ ~ x ~ ~ x ~ x ~ x ~ ~ ~ x ~] [x ~ ~ x ~ x ~ x ~ ~ x ~ x ~ x ~]>"
const answerRhythm = "x ~ x ~ ~ x ~ x ~ ~ x ~ x ~ [x x] ~"

// The kick ducks only the bass and pads; hats and lead keep their transients.
const kick = s("<[bd ~ ~ ~ ~ ~ [~ bd] ~ ~ ~ bd ~ ~ ~ ~ ~] [bd ~ ~ [~ bd] ~ ~ bd ~ ~ ~ bd ~ ~ ~ [~ bd] ~]>")
  .bank("RolandTR909").gain(0.86)
  .duckorbit("2:3").duckattack(0.14).duckdepth("0.65:0.75")

const snare = s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~")
  .bank("RolandTR909").gain(0.8)

const hats = s("hh*16").bank("RolandTR909")
  .gain("[.12 .26 .17 .34]*4").hpf(5200)
  .pan("[.42 .58]*8")

const ghosts = s("~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~ sd ~ ~ ~ [~ sd]")
  .bank("RolandTR909").gain(".12 .18 .1 .16").hpf(850)

const drums = stack(kick, snare, hats, ghosts,
  s("~ oh ~ ~ ~ oh ~ ~").bank("RolandTR909").gain(0.19).hpf(4200)
)

// Seven restrained bars, then a deliberate turnaround with snare doubles.
const amen = n(`<
  [0 1 2 3 4 5 6 7] [0 1 2 3 12 5 6 7]
  [0 9 2 3 4 5 14 7] [0 1 2 3 4 5 6 [14 15]]
  [0 1 2 3 4 5 6 7] [8 1 10 3 12 5 6 7]
  [0 9 2 11 4 5 6 7] [0 ~ 2 [2 2] 12 13 [14 14] [15 15]]
>`).s("amencutup")
  .hpf(650).lpf(8500).gain(0.23).cut(1)

const subVoice = roots.s("sine")
  .attack(0.006).release(0.09).clip(0.92).gain(0.52).orbit(2)
const sub = subVoice.struct(bassRhythm)

const reese = roots.add(note(12)).struct(bassRhythm).s("sawtooth")
  .jux(x => x.add(note(0.08)))
  .attack(0.009).decay(0.15).sustain(0.55).release(0.09)
  .hpf(120).lpf("<650 950 700 1300 850 1600 950 1800>")
  .lpenv(2).lpq(2).shape(0.2).gain(0.22).orbit(2)

// A higher, shorter answer changes the second drop's rhythm and tone together.
const acid = roots.add(note("[12 12 24 19]*4"))
  .struct(answerRhythm).s("sawtooth")
  .attack(0.004).decay(0.12).sustain(0.12).release(0.06)
  .hpf(170).lpf("400 850 500 1500 650 1100 450 1900")
  .lpenv(3).lpq(5).shape(0.16).gain(0.19).orbit(2)

// Soft eighth-note chord pulses leave room for both the break and the hook.
const pad = note("<[f3,ab3,c4,eb4] [db3,f3,ab3,c4] [ab3,c4,eb4,g4] [eb3,g3,bb3,f4]>/2")
  .struct("[~ x]*4").s("supersaw")
  .attack(0.045).decay(0.18).sustain(0.4).release(0.28)
  .hpf(380).lpf(sine.range(1100, 2400).slow(8))
  .gain(0.085).room(0.55).roomsize(4).orbit(3)

// One eight-bar melody: repeated opening gesture, then a rising reply.
const hook = note(`<
  [c5 ~ ab4 c5 ~ eb5 c5 ~] [ab4 ~ c5 ~ f5 eb5 c5 ~]
  [c5 ~ ab4 c5 ~ f5 eb5 ~] [ab4 ~ f4 ~ ab4 c5 eb5 ~]
  [eb5 ~ c5 eb5 ~ g5 eb5 ~] [c5 ~ ab4 ~ c5 eb5 g5 ~]
  [bb4 ~ g4 bb4 ~ f5 eb5 ~] [g4 ~ bb4 ~ f5 eb5 bb4 ~]
>`)
  .s("triangle").fm(1.2).fmh(2)
  .attack(0.003).decay(0.14).sustain(0).release(0.09)
  .lpf(4200).gain(0.23)
  .delay(0.28).delaytime(60 / 174 * 0.75).delayfeedback(0.32)
  .room(0.3).roomsize(3).pan(sine.range(0.3, 0.7).slow(8)).orbit(4)

const arp = note(`<
  [f4 ab4 c5 eb5 c5 ab4 c5 ab4]!2
  [db4 f4 ab4 c5 ab4 f4 ab4 f4]!2
  [ab4 c5 eb5 g5 eb5 c5 eb5 c5]!2
  [eb4 g4 bb4 f5 bb4 g4 bb4 g4]!2
>`).s("square")
  .attack(0.002).decay(0.055).sustain(0).release(0.04)
  .hpf(1200).lpf(3300).gain(0.07)
  .delay(0.22).delaytime(60 / 174 * 1.5).delayfeedback(0.3)
  .room(0.25).roomsize(3).pan(".25 .75").orbit(5)

const mist = s("pink*8").attack(0.035).decay(0.09).sustain(0)
  .hpf(3200).lpf(7500).gain(0.055)
  .room(0.6).roomsize(4).orbit(6)

const intro = stack(
  pad.lpf(1100), hook.lpf(2200).gain(0.14),
  amen.lpf(1800).gain(0.08), mist.gain(0.025)
)

const lift = stack(
  kick.gain(0.65), snare.gain(0.55), hats,
  amen.gain(0.13), sub.gain(0.32), pad, hook.gain(0.17)
)

const build = stack(
  drums, amen.gain(0.17), sub.gain(0.38), pad,
  hook, arp.lpf(saw.range(1200, 4200).slow(8)),
  s("<~ ~ ~ ~ sd*4 sd*8 sd*16 [sd*8 ~]>")
    .bank("RolandTR909").hpf(1200)
    .gain(saw.range(0.05, 0.28).slow(8)),
  mist.gain(saw.range(0.02, 0.13).slow(8))
)

const dropA = stack(drums, amen, sub, reese, pad, hook)

const dropAReply = stack(
  drums, amen, sub, reese.lpf("<1100 1700 850 1500>"),
  pad, hook.gain(0.19), arp
)

// Halftime rim clicks and suspended chords make space before the second lift.
const breakdown = stack(
  pad.clip(2).release(0.6).lpf(1800), hook.gain(0.2),
  roots.add(note(12)).s("triangle").attack(0.08).release(0.3)
    .lpf(450).gain(0.2).orbit(2),
  s("~ ~ rim ~").bank("RolandTR909").gain(0.18),
  amen.lpf(1600).gain(0.06), mist.gain(0.025)
)

const rebuild = stack(
  build, reese.lpf(saw.range(350, 1600).slow(8)).gain(0.12)
)

const dropB = stack(
  drums, amen, subVoice.struct(answerRhythm), acid,
  pad.lpf(2300), hook.gain(0.2), arp
)

const peak = stack(
  drums, amen.gain(0.28), subVoice.struct(answerRhythm), acid,
  reese.struct("x ~ ~ ~ ~ ~ ~ ~").gain(0.12),
  pad, hook.add(note(12)).gain(0.16), arp
)

// Filter down to the same sound world as the intro. Delay/reverb tails carry
// across the wrap; the last Eb chord resolves back to F minor on bar one.
const outro = stack(
  pad.lpf(saw.range(1800, 1100).slow(8)),
  hook.lpf(saw.range(3500, 2200).slow(8)).gain(0.14),
  amen.lpf(saw.range(5000, 1800).slow(8))
    .gain(saw.range(0.2, 0.08).slow(8)),
  hats.gain(saw.range(0.12, 0.02).slow(8)), mist.gain(0.025)
)

// 112 * 4 * 60 / 174 = 154.48 seconds. This arrangement repeats indefinitely.
$: arrange(
  [8, intro],       // 0:00  glass and distant breaks
  [8, lift],        // 0:11  groove comes into focus
  [8, build],       // 0:22  filter lift and snare rush
  [16, dropA],      // 0:33  reese / hook call and response
  [16, dropAReply], // 0:55  brighter bass, arpeggio enters
  [8, breakdown],  // 1:17  floating halftime pocket
  [8, rebuild],    // 1:28  tension returns
  [16, dropB],      // 1:39  acid bass changes the pocket
  [16, peak],       // 2:01  octave hook and busier breaks
  [8, outro]        // 2:23  dissolve back to the beginning at 2:34
).postgain(0.72)
