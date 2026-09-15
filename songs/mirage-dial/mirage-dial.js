// @title  Mirage Dial
// @by     Codex (for Dan Essig)
// @tempo  112 bpm
// @notes  Desert electro at blue hour: dusty drums, warm bass, glassy arpeggios

setcpm(112 / 4)

// A grounded four-on-the-floor pulse with a little syncopated sand in the gears.
$: s("bd ~ bd ~ bd ~ bd [bd ~], ~ cp ~ cp, [~ rim]*4")
  .bank("RolandTR909")
  .gain("<.9 .82 .9 1>")
  .room(0.08)

// Two hat clocks create a loose, windblown groove around the straight kick.
$: s("[hh ~]*4, [~ hh]*8")
  .bank("RolandTR909")
  .gain("[.18 .42 .24 .55]*4")
  .hpf(5200)
  .pan("<.32 .68>")
  .sometimesBy(0.12, x => x.speed(1.5))

// Warm sub melody: D minor, with a turnaround that briefly pulls toward C.
$: n("<0 0 [0 7] 5 6 6 [6 4] 2 3 3 [3 5] 6 -1 -1 [-1 2] 4>")
  .scale("D1:minor")
  .s("triangle")
  .lpf(sine.range(260, 720).slow(8))
  .lpq(4)
  .attack(0.01)
  .release(0.18)
  .gain(0.72)

// Wide suspended chords move slowly behind the rhythm like heat haze.
$: n("<[0,2,4,6] [6,8,10,12] [3,5,7,9] [-1,1,3,5]>")
  .scale("D3:minor")
  .s("supersaw")
  .attack(0.35)
  .release(1.8)
  .lpf(sine.range(650, 1900).slow(16))
  .gain(saw.range(0.07, 0.24).fast(4))
  .room(0.72)
  .orbit(2)

// The dial itself: an asymmetric, glassy figure that changes direction by phrase.
$: n("<0 2 4 7 9 7 4 2, 0 3 5 8 10 8 5 3>")
  .scale("D5:minor")
  .s("sine")
  .decay(0.12)
  .sustain(0)
  .delay(0.35)
  .delaytime("<0.125 0.1875>")
  .delayfeedback(0.42)
  .pan(sine.slow(3))
  .gain("<.2 .28 .16 .32>")
  .sometimesBy(0.18, x => x.add(note(12)))

// A faint answering signal arrives every other bar.
$: note("<~ [a5 ~ f5 e5] ~ [d6 c6 a5 ~]>")
  .s("square")
  .attack(0.02)
  .release(0.4)
  .lpf(1800)
  .room(0.85)
  .pan("<.8 .2>")
  .gain(0.12)
  ._pianoroll()
