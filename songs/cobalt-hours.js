// Cobalt Hours — melodic / cinematic techno in A minor, 122 BPM
// Model: Claude Opus 4.8
//
// A hypnotic i–VI–III–VII loop (Am – F – C – G) that opens from a filtered
// drone, rides an offbeat bass and a rolling arp, breaks down to a lone
// emotional lead, then builds back into a wide-open drop before it settles.
//
// Structure (1 cycle = 1 bar): intro 8 · pulse 8 · groove 8 · lift 16 ·
//   lift+lead 16 · breakdown 16 · build 8 · drop 16 · drop peak 8 · outro 8
// Total 112 bars ≈ 3:40 before it loops.

setcpm(122/4)

// ---- harmony: one chord per bar, four-bar loop --------------------------
const CHORDS = "<[a3,c4,e4,b4] [f3,a3,c4,e4] [c4,e4,g4,b4] [g3,b3,d4,e4]>"
const ROOTS  = "<a1 f1 c2 g1>"

// gentle four-to-the-floor sidechain pump (dips on each kick, recovers)
const pump = saw.range(0.6, 1).fast(4)

// ---- drums (Roland TR-909) ----------------------------------------------
const kick = s("bd*4").bank("RolandTR909").gain(0.85).shape(0.12)
const clap = s("~ cp ~ cp").bank("RolandTR909").gain(0.5).room(0.16)
const hats = s("hh*16").bank("RolandTR909")
  .gain(sine.range(0.06, 0.24).fast(4))
  .pan(sine.range(0.35, 0.65).slow(5))
const ohat = s("~ oh ~ oh ~ oh ~ oh").bank("RolandTR909").gain(0.16)
const perc = s("~ rim ~ ~ rim ~ ~ rim").bank("RolandTR909")
  .gain(0.26).pan(0.7).room(0.2)

// ---- low end -------------------------------------------------------------
const sub = note(ROOTS).s("sine").gain(0.5).attack(0.01).release(0.15)
const bass = note(ROOTS).add(note(12)).s("sawtooth")
  .struct("~ x ~ x ~ x ~ x")
  .lpf(sine.range(430, 1050).slow(16)).lpq(7)
  .attack(0.005).decay(0.13).sustain(0.25).release(0.09)
  .gain(0.46)
const bassGroove = note(ROOTS).add(note(12)).s("sawtooth")
  .struct("~ x ~ x ~ x ~ x")
  .lpf(620).lpq(6)
  .attack(0.005).decay(0.13).sustain(0.25).release(0.09)
  .gain(0.4)
const bassBuild = note(ROOTS).add(note(12)).s("sawtooth")
  .struct("~ x ~ x ~ x ~ x")
  .lpf(saw.range(500, 2600).slow(8)).lpq(6)
  .attack(0.005).decay(0.13).sustain(0.25).release(0.09)
  .gain(0.4)

// ---- pad: two lightly detuned saws --------------------------------------
const padCore = stack(
  note(CHORDS).s("sawtooth"),
  note(CHORDS).add(note(0.12)).s("sawtooth").gain(0.7),
)
const pad = padCore.attack(0.5).release(0.9)
  .lpf(sine.range(620, 1750).slow(24)).lpq(6)
  .room(0.5).gain(0.28)
const padLow = padCore.attack(0.75).release(1.1)
  .lpf(720).lpq(4).room(0.62).gain(0.24)

// ---- arp: plucked triangle with a dotted-eighth delay -------------------
const ARP = "<[a4 c5 e5 c5 e5 g5 e5 c5] [f4 a4 c5 a4 c5 e5 c5 a4] [c5 e5 g5 e5 g5 b5 g5 e5] [g4 b4 d5 b4 d5 f5 d5 b4]>"
const arp = note(ARP).s("triangle")
  .attack(0.004).decay(0.16).sustain(0).release(0.12)
  .lpf(sine.range(1200, 4200).slow(12))
  .delay(0.4).delaytime(0.369).delayfeedback(0.34)
  .room(0.28).gain(0.3).pan(0.45)
const arpSoft = note(ARP).s("triangle")
  .attack(0.004).decay(0.16).sustain(0).release(0.12)
  .lpf(1500)
  .delay(0.5).delaytime(0.369).delayfeedback(0.42)
  .room(0.55).gain(0.22).pan(0.55)

// ---- lead + counter ------------------------------------------------------
const LEAD = "<[e5 ~ e5 a5 ~ g5 ~ e5] [f5 ~ ~ e5 ~ c5 ~ ~] [e5 ~ g5 ~ c6 ~ b5 g5] [a5 ~ ~ b5 ~ d5 ~ ~]>"
const lead = note(LEAD).s("sawtooth")
  .lpf(sine.range(1500, 3200).slow(8)).lpq(5)
  .attack(0.01).decay(0.2).sustain(0.6).release(0.25)
  .room(0.38).delay(0.3).delaytime(0.369).delayfeedback(0.28)
  .gain(0.4)
const counter = note("<c6 a5 e6 d6>").s("triangle")
  .attack(0.02).release(0.6).lpf(3000)
  .room(0.5).delay(0.35).delaytime(0.246).delayfeedback(0.3)
  .gain(0.2).pan(0.62)

// ---- fx ------------------------------------------------------------------
const atmos = note("a2").s("sawtooth").slow(4)
  .attack(2).release(3).lpf(520).room(0.7).gain(0.15)
const riser = s("white*32").slow(8)
  .gain(saw.range(0.02, 0.4).slow(8)).hpf(320)
  .lpf(saw.range(700, 9000).slow(8)).release(0.25).room(0.3)
const snroll = s("sd*16").bank("RolandTR909")
  .gain(saw.range(0.0, 0.5).slow(8)).room(0.2)
const crash = s("cr").bank("RolandTR909").slow(8).gain(0.4).room(0.3)
const revcrash = s("cr").bank("RolandTR909").speed(-1).slow(8)
  .gain(0.3).room(0.45)
const tail = note("[a3,c4,e4,a4]").s("sawtooth").slow(8)
  .attack(0.3).release(4).lpf(1200).room(0.7).gain(0.26)

// ---- sections ------------------------------------------------------------
const intro = stack(padLow, atmos, arpSoft.gain(0.12).degradeBy(0.5))
const pulse = stack(kick.gain(0.82), sub.gain(0.42), hats.gain(0.4), padLow, atmos.gain(0.7))
const groove = stack(kick, sub, bassGroove, hats, ohat, clap.gain(0.4), padLow, arpSoft)
const lift = stack(kick, sub.gain(pump), bass, hats, ohat, clap, perc, pad.gain(pump), arp)
const liftLead = stack(kick, sub.gain(pump), bass, hats, ohat, clap, perc, pad.gain(pump), arp, lead)
const breakdown = stack(padLow, arpSoft, lead.gain(0.34).lpf(2200), counter, atmos, revcrash)
const build = stack(kick.gain(0.82), sub.gain(0.4), bassBuild, hats, padLow, arpSoft, snroll, riser, crash)
const drop = stack(kick, sub.gain(pump), bass, hats, ohat, clap, perc, pad.gain(pump), arp, lead, counter, crash)
const dropPeak = stack(kick, sub.gain(pump), bass, hats, ohat, clap, perc, pad.gain(pump), arp, lead.gain(0.44), counter.gain(0.24), crash)
const outro = stack(padLow, arpSoft.gain(0.2), sub.gain(0.34), atmos, tail)

// ---- arrangement ---------------------------------------------------------
arrange(
  [8, intro],
  [8, pulse],
  [8, groove],
  [16, lift],
  [16, liftLead],
  [16, breakdown],
  [8, build],
  [16, drop],
  [8, dropPeak],
  [8, outro],
).gain(0.8)
