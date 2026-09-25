# strudellm

An answer to the question: Can LLM's make good vibes?

Songs written as code for [Strudel](https://strudel.cc), the browser live-coding music tool.

## How to play a song

1. Open a file in `songs/`.
2. Copy all of it.
3. Paste it into the editor at https://strudel.cc and press `Ctrl+Enter`. Press `Ctrl+.` to stop.

## Songs

| Song | File | Tempo |
|---|---|---|
| Neon Rinse (drum and bass) | [songs/neon-rinse.js](songs/neon-rinse.js) | 174 bpm |
| Mirage Dial (desert electro) | [songs/mirage-dial/mirage-dial.js](songs/mirage-dial/mirage-dial.js) | 112 bpm |
| Faultline Protocol (drum and bass / dubstep) | [songs/faultline-protocol.js](songs/faultline-protocol.js) | 174 bpm |
| Glass Circuit (melodic drum and bass, 2:34 loop) | [songs/glass-circuit.js](songs/glass-circuit.js) | 174 bpm |
| Long Exposure (atmospheric drum and bass, 3:00 loop) | [songs/long-exposure.js](songs/long-exposure.js) | 160 bpm |
| Night Current (atmospheric liquid drum and bass, 3:00 loop) | [songs/night-current.js](songs/night-current.js) | 168 bpm |
| Cathode Bloom (melodic techno, 3:00 loop) | [songs/cathode-bloom.js](songs/cathode-bloom.js) | 128 bpm |
| The Water Keeps Its Own Time (chamber-electronic drift, five-scene loop) | [songs/the-water-keeps-its-own-time.js](songs/the-water-keeps-its-own-time.js) | 94 bpm |

## Project layout

```
songs/            one .js file per song, optionally in a same-named folder
songs/_template.js  starting point for a new song
samples/          custom audio files (see samples/README.md)
strudel.json      sample map, lets songs load this repo's samples
tests/            checks for song files and the sample map
```

## Writing a new song

1. Copy `songs/_template.js` to `songs/<song-name>.js`, or to
   `songs/<song-name>/<song-name>.js` when the song needs its own folder.
2. Fill in the header lines. `@title`, `@by` and `@tempo` are required:

   ```js
   // @title  Song Name
   // @by     Your Name
   // @tempo  120 bpm
   // @notes  Optional description
   ```

3. Add the song to the table above.

## Custom samples

Put audio in `samples/<sound-name>/` and list the files in `strudel.json`. Once the repo is pushed to GitHub, a song loads them with:

```js
samples('github:<github-user>/strudel-tracks')
```

See `samples/README.md` for the details.

## Tests

Requires Node 20+. No packages to install.

```
npm test
```

The tests check that:

- every song is valid JavaScript syntax
- every song has the required header lines and a kebab-case file name
- `strudel.json` is valid and every file it lists exists
