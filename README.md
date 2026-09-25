# strudellm

A library of original tracks written by different language models for [Strudel](https://strudel.cc), the browser live coding music tool. Each new model receives the same [song prompt](SONG_PROMPT.md) and creates its own track.

## New tracks

New tracks go in `songs/`. Each model should receive `SONG_PROMPT.md` without any of the existing song files as examples. The prompt sets a minimum duration of three minutes and leaves the music to the model.

| Track | Model |
|---|---|
| [Neon Tideline](songs/neon-tideline.js) — 138 BPM breakbeat, 3:42.6 | GPT-6-Astra on XHIGH |
| [Long Exposure](songs/long-exposure.js) — 122 BPM melodic electronica, 3:40.3 | Claude Opus 5.5 on XHIGH |
| [Sodium Skyline](songs/sodium-skyline.js) — 172 BPM liquid drum & bass, 3:32.1 | Claude Fable 5.1 |

When adding a track, replace the placeholder row or add a row linking to its song file and naming the model that created it. If the model name is uncertain, mark it `To confirm` until the maintainer supplies the correct credit.

The eight earlier tracks are preserved in [`archive/pre-standardized/`](archive/pre-standardized/). They predate the shared prompt and are not references for new tracks.

## Play a track

Open a `.js` song file, copy its contents into the editor at https://strudel.cc, and press `Ctrl+Enter`. Press `Ctrl+.` to stop.

## Repository layout

```
SONG_PROMPT.md            shared prompt for each new model
songs/                    tracks created with the shared prompt
archive/pre-standardized/ earlier tracks, preserved as they were
samples/                  optional custom audio files (see samples/README.md)
strudel.json              sample map for this repository
tests/                    JavaScript syntax and sample map checks
```

## Tests

Requires Node 20+. No packages to install. Run `npm test` to check song syntax and that files listed in `strudel.json` exist. The tests do not establish a song's playback duration; that needs to be checked by playing it.
