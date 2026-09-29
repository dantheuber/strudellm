setcpm(32)

const padVoice = note("<[a2,e3,b3,c4] [f2,c3,g3,a3] [c3,g3,d4,e4] [g2,d3,a3,b3]>")
  .sound("user")
  .partials([1, .55, .34, .22, .14, .09, .05, .03])
  .attack(.9).release(3.2).legato(1.2)
  .cutoff(1050).room(.5)

const padShimmer = (g) => note("<[a3,e4,b4,c5] [f3,c4,g4,a4] [c4,g4,d5,e5] [g3,d4,a4,b4]>")
  .sound("sine")
  .attack(1.4).release(3.6).legato(1.25)
  .gain(g).room(.6).delay(.25).delaysync(.375)

const subDrone = (g) => note("<a1 f1 c2 g1>")
  .sound("triangle")
  .attack(.5).release(2.8).legato(1.3)
  .cutoff(300).gain(g)

const subOff = (g) => note("<[~ a1]*4 [~ f1]*4 [~ c2]*4 [~ g1]*4>")
  .sound("triangle")
  .attack(.01).release(.3).legato(.85)
  .cutoff(400).gain(g)

const acid = (notes, cutoffs, res, g) => note(notes)
  .sound("sawtooth")
  .cutoff(cutoffs)
  .resonance(res)
  .attack(.01).release(.12).legato(.55)
  .gain(g)

const acidANotes = "<[a2 ~ a2 ~ a3 ~ a2 ~ c3 ~ a2 ~ g2 ~ a2 ~] [a2 ~ a2 a2 ~ c3 ~ a2 g2 g2 ~ a2 ~ e2 g2 a2]>"
const acidBNotes = "<[a2 a2 ~ a3 ~ a2 c3 c#3 ~ a2 ~ g2 ~ a2 b2 ~] [a2 ~ a3 a3 ~ e3 ~ c3 c#3 d3 ~ c3 ~ b2 ~ a2]>"
const acidCNotes = "<[a2 a2 a3 a2 e3 a2 c3 c#3 d3 c#3 c3 a2 g2 g2 a2 b2] [c3 c3 d3 e3 ~ e3 g3 e3 d3 c3 b2 c3 a2 a2 g2 a2]>"

const acidACutoff = "<[280 320 360 400 450 500 560 620 690 760 840 920 1000 1050 1100 1080] [300 340 380 430 480 530 590 650 720 790 860 930 1000 1060 1100 1120]>"
const acidBCutoff = "<[350 420 500 600 700 820 950 1100 1250 1420 1600 1800 2000 2250 2500 2800] [320 400 500 620 760 900 1050 1250 1500 1750 2000 2300 2550 2750 2900 2800]>"
const acidCCutoff = "<[700 900 1150 1400 1700 2000 2400 2800 3300 3800 4400 5000 5700 6500 7300 8200] [5500 6200 7000 7800 8600 9300 9800 9500 9000 8400 7700 6900 6000 5000 4000 3200]>"

const leadBreak = note("<[e5 ~ c5 a4 b4 ~ a4 ~] [g4 ~ a4 b4 e5 ~ ~ ~] [d5 ~ c5 d5 e5 ~ c5 ~] [b4 ~ a4 ~ g4 ~ ~ ~] [e5 ~ c5 a4 b4 ~ a4 ~] [g4 ~ a4 b4 e5 ~ ~ ~] [d5 ~ c5 d5 e5 ~ c5 ~] [b4 ~ d5 ~ e5 ~ ~ ~]>")
  .sound("triangle")
  .attack(.03).release(.9).legato(1.4)
  .cutoff(1400)
  .delay(.4).delaysync(.375).delayfeedback(.5).room(.45)

const leadSaw = (g) => note("<[e5 ~ c5 a4 b4 ~ a4 ~] [g4 ~ a4 b4 e5 ~ ~ ~] [d5 ~ c5 d5 e5 ~ c5 ~] [b4 ~ a4 ~ g4 ~ ~ ~] [e5 ~ c5 a4 b4 ~ a4 ~] [g4 ~ a4 b4 e5 ~ ~ ~] [d5 ~ c5 d5 e5 ~ c5 ~] [b4 ~ d5 ~ e5 ~ ~ ~]>")
  .sound("sawtooth")
  .attack(.02).release(.7).legato(1.3)
  .cutoff(1900)
  .delay(.35).delaysync(.375).delayfeedback(.45).room(.4)
  .gain(g)

const arpSparkle = (g) => note("<[a4 c5 e5 a5 e5 c5 a4 c5 e5 a5 e5 c5 a4 c5 e5 a5] [f4 a4 c5 f5 c5 a4 f4 a4 c5 f5 c5 a4 f4 a4 c5 f5] [g4 c5 e5 g5 e5 c5 g4 c5 e5 g5 e5 c5 g4 c5 e5 g5] [g4 b4 d5 g5 d5 b4 g4 b4 d5 g5 d5 b4 g4 b4 d5 g5]>")
  .sound("sine")
  .attack(.005).release(.25).legato(.9)
  .pan("<-.35 .35>*8")
  .delay(.3).delaysync(.375).delayfeedback(.4).room(.5)
  .gain(g)

const bells = (g) => note("<a5 e6 c6 g5 b5 a5>")
  .sound("sine")
  .attack(.01).release(1.6).legato(1.2)
  .room(.7).delay(.3).delaysync(.375)
  .gain(g)

const stabs = (g) => note("<[~ [a4,c5,e5] ~ ~ ~ [a4,c5,e5] ~ ~] [~ [f4,a4,c5] ~ ~ ~ [f4,a4,c5] ~ ~] [~ [g4,c5,e5] ~ ~ ~ [g4,c5,e5] ~ ~] [~ [g4,b4,d5] ~ ~ ~ [g4,b4,d5] ~ ~]>")
  .sound("sawtooth")
  .attack(.01).release(.25).legato(.6)
  .cutoff(1700).resonance(2)
  .delay(.3).delaysync(.375).delayfeedback(.4)
  .pan(.25)
  .gain(g)

const kick = (acc) => s("bd*4").gain(acc)
const kickMuffled = (acc) => s("bd*4").cutoff(260).gain(acc)
const hats = (accents) => s("hh*16").gain(accents).speed("<1 .98 1.02 .98>")
const ohOff = (g) => s("[~ oh]*4").gain(g).room(.15)
const clapBack = (g) => s("[~ cp]*2").gain(g)
const shaker = (g) => s("sh*8").gain(g).pan(-.25)
const ride8 = s("rd*8").gain("[.28 .15]*4").pan(.2)
const rimGhost = (g) => s("<[~ ~ rim ~ ~ ~ ~ ~] [~ ~ ~ ~ rim ~ ~ ~]>").gain(g).room(.2)
const air = (g) => s("hh*16").gain(g).cutoff(6500).room(.9).speed(.9)
const swell = (g) => s("oh").speed(-.5).gain(g).room(.5).struct("~ ~ ~ ~ ~ ~ ~ x")
const revKick = (g) => s("bd").speed(-1).gain(g).room(.4).struct("~ ~ ~ ~ ~ ~ ~ x")
const crash = (g) => s("cr").gain(g).room(.5).struct("x ~ ~ ~ ~ ~ ~ ~")

const snareRoll = s("<sd*2 sd*4 sd*8 sd*8 sd*16 sd*16 sd*32 sd*32>")
  .gain("<.26 .3 .35 .39 .44 .5 .57 .64>")
  .room(.25)

const riser = s("oh")
  .speed("<-.35 -.42 -.5 -.6 -.72 -.86 -1.05 -1.3>")
  .gain("<.2 .23 .26 .29 .33 .36 .4 .45>")
  .room(.55)

const pad = (g) => padVoice.gain(g)

const intro = stack(
  pad("<.2 .26 .3 .32 .34 .34 .36 .36>"),
  padShimmer(.07),
  subDrone("<0 0 .42 .42 .42 .42 .42 .42>"),
  arpSparkle("<0 0 0 0 .09 .09 .09 .1>"),
  bells(.13),
  air("<0 0 .05 .05 .05 .05 .05 .05>"),
  swell(.5),
)

const pulse = stack(
  kickMuffled("<.74!8>"),
  ohOff("<0 0 .3 .3 .35 .35 .4 .4>"),
  subDrone(.45),
  pad(.3),
  arpSparkle(.1),
  air(.05),
  swell(.5),
)

const groove = stack(
  kick("[.82 .78 .74 .78]"),
  hats("[.5 .19 .34 .19]*4"),
  clapBack(.47),
  ohOff(.38),
  shaker("<0!8 .18!8>"),
  rimGhost(.3),
  subOff(.5),
  pad(.22),
  acid(acidANotes, 420, 6, "<0!8 .3!8>"),
)

const acidA1 = stack(
  kick("[.84 .8 .76 .8]"),
  hats("[.62 .24 .42 .24]*4"),
  clapBack(.5),
  ohOff(.42),
  shaker(.18),
  rimGhost(.28),
  subDrone(.3),
  acid(acidANotes, acidACutoff, "<8 9 10 9>", .52),
  pad(.18),
)

const acidA2 = stack(
  kick("[.84 .8 .76 .8]"),
  hats("[.62 .24 .42 .24]*4"),
  clapBack(.5),
  ohOff(.42),
  shaker(.18),
  rimGhost(.28),
  subDrone(.3),
  acid(acidANotes, acidACutoff, "<8 9 10 9>", .55),
  stabs(.2),
  leadSaw(.13),
  pad(.18),
)

const acidB1 = stack(
  kick("[.84 .8 .76 .8]"),
  hats("[.66 .26 .46 .26]*4"),
  clapBack(.5),
  ohOff(.42),
  shaker(.18),
  rimGhost(.28),
  subDrone(.3),
  acid(acidBNotes, acidBCutoff, "<11 12 13 12>", .58),
  stabs(.22),
  pad(.18),
  swell(.5),
)

const breakdown = stack(
  pad(.37),
  padShimmer(.1),
  subDrone(.45),
  leadBreak.gain(.46),
  arpSparkle(.12),
  bells(.13),
  air(.06),
  s("[~ ~ sd ~]").gain("<0!12 .3 .32 .35 .4>"),
)

const build = stack(
  snareRoll,
  riser,
  kick("<0 0 .46 .5 .57 .62 .7 .74>"),
  note("a1*8").sound("triangle").attack(.01).release(.2).cutoff(350)
    .gain("<.26 .28 .3 .33 .36 .4 .44 .48>"),
  pad(.3),
  hats("<0!4 [.4 .16 .28 .16]*4!4>"),
  ohOff("<0 0 0 0 0 .35 .4 .45>"),
  revKick(.7),
)

const dropBase = stack(
  crash(.5),
  kick("[.88 .84 .82 .84]"),
  hats("[.76 .31 .52 .31]*4"),
  clapBack(.55),
  ohOff(.48),
  shaker(.22),
  ride8,
  rimGhost(.3),
  subDrone(.3),
  stabs(.25),
  pad(.15),
  arpSparkle(.15),
)

const drop1 = stack(dropBase, acid(acidANotes, acidACutoff, "<8 9 10 9>", .62))
const drop2 = stack(dropBase, acid(acidBNotes, acidBCutoff, "<10 11 12 11>", .64), leadSaw(.16))
const drop3 = stack(dropBase, acid(acidCNotes, acidCCutoff, "<12 13 14 13>", .7).shape(.25), leadSaw(.36))

const resolve = stack(
  kick("<.8!8>"),
  hats("[.42 .16 .3 .16]*4"),
  ohOff(.3),
  subOff(.46),
  leadSaw(.33),
  leadBreak.gain(.18),
  pad(.34),
  padShimmer(.09),
  arpSparkle(.12),
  bells(.12),
  air(.05),
)

const outro1 = stack(
  kickMuffled("<.5 .45 .4 .35 0 0 0 0>"),
  pad("<.34 .3 .28 .26 .24 .22 .2 .19>"),
  padShimmer(.07),
  subDrone(.38),
  arpSparkle("<.11 .1 .09 .08 .07 .06 .05 .04>"),
  bells(.12),
  air(.05),
)

const outro2 = stack(
  pad("<.18 .17 .16 .15 .14 .13 .12 .12>"),
  padShimmer("<.06 .05 .05 .04 .04 .03 .03 .02>"),
  subDrone("<.3 .28 .26 .25 .24 .22 .2 .18>"),
  arpSparkle("<.03 .02 .01 0 0 0 0 0>"),
  bells("<.12 .1 .09 .08 .07 .06 .05 .04>"),
  air(.05),
)

const song = arrange(
  [8, intro],
  [8, pulse],
  [16, groove],
  [8, acidA1],
  [8, acidA2],
  [8, acidB1],
  [16, breakdown],
  [8, build],
  [8, drop1],
  [8, drop2],
  [8, drop3],
  [8, resolve],
  [8, outro1],
  [8, outro2],
)

$: song.postgain(.82)
