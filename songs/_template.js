// @title  Untitled
// @by     Your Name
// @tempo  120 bpm
// @notes  Copy this file to songs/<song-name>.js and paste the code into strudel.cc

// Load custom samples from this repo (uncomment once samples are pushed):
// samples('github:<github-user>/strudel-tracks')

setcpm(120 / 4)

$: s("bd*4").bank("RolandTR909")

$: s("~ hh ~ hh").bank("RolandTR909").gain(0.6)
