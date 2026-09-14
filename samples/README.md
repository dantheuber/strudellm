# samples

Custom audio files used by songs in this repo.

- Put each sound in its own folder: `samples/<sound-name>/<file>.wav`
- Register every file in the root `strudel.json`, with paths relative to the repo root:

```json
{
  "kick": ["samples/kick/kick-01.wav", "samples/kick/kick-02.wav"]
}
```

- In a song, load them with `samples('github:<github-user>/strudel-tracks')` and play with `s("kick:1")`.

`npm test` fails if `strudel.json` points at a file that does not exist.
