# Jev composition experiments

These tracks explore whether [TypeSafe Jev](https://api.typesafe.ai/docs) can help create a Strudel song even though it cannot write code or reason through a complete composition. **GPT-6-Sol wrote the [procedural generator](compose.mjs); Jev made bounded composition decisions.** The result is a collaboration between the generator's musical rules and Jev's selections, not a track coded directly by Jev.

The generator reads the repository's [shared song prompt](../../SONG_PROMPT.md) and sends that prompt to Jev without sending any existing songs. It generates finite choices for style, scale, tonic, harmony, drums, bass, three melodic phrases, sound palette, effects, and seven arrangement sections. Jev answers 19 `choice` questions. The script turns those decisions into Strudel code, keeps each track at 104 bars (at least three minutes at the offered tempos), and records the API requests, answers, probabilities, and chosen options in an adjacent JSON transcript. It uses built-in Strudel sounds only.

## Tracks

The first two tracks used Jev's top choice for each question. Two of the original three runs were identical, so only the distinct songs are kept here. The later three used seed-derived musical briefs and sampled from Jev's choice probabilities. The saved API responses identify the model as `jev-1.13.0`.

| Track | Decision transcript | Method |
|---|---|---|
| [Baseline 01](baseline-01.js) | [JSON](baseline-01.json) | Jev top choices |
| [Baseline 02](baseline-02.js) | [JSON](baseline-02.json) | Jev top choices |
| [Seeded 01](seeded-01.js) | [JSON](seeded-01.json) | Brief and probability sampling |
| [Seeded 02](seeded-02.js) | [JSON](seeded-02.json) | Brief and probability sampling |
| [Seeded 03](seeded-03.js) | [JSON](seeded-03.json) | Brief and probability sampling |

The batch reports are [baseline comparison](baseline-comparison.json) and [seeded comparison](seeded-comparison.json). These files preserve the actual live output and decisions. The generator has evolved since the baseline run, so a current rerun with the same seed is not guaranteed to recreate those archived files byte for byte.

To listen, open a song's `.js` file, paste it into [Strudel](https://strudel.cc), and press `Ctrl+Enter`. Press `Ctrl+.` to stop.

## Generate more

From the repository root with Node 20 or newer, set a TypeSafe API key in your terminal and run the CLI. The key is read from `TYPESAFE_API_KEY`; it is not written to generated files.

```bash
read -rsp 'TypeSafe API key: ' TYPESAFE_API_KEY; echo
export TYPESAFE_API_KEY
npm run jev -- --runs 3 --probes 1
unset TYPESAFE_API_KEY
```

That command makes 57 API calls: 19 decisions for each of three tracks. New live `.js` songs, adjacent `.json` transcripts, and a batch comparison file are written **directly into this folder** with unique timestamped names, ready to review and commit. `--dry-run` makes no API calls and writes to ignored `.dry-runs/` here.

By default the CLI creates a random seed. It prints and records the seed. `--seed TEXT` repeats the candidate phrases, musical briefs, and local sampling draws, though Jev's returned probabilities can change. `--runs N` creates N tracks. `--probes N` sends each exact API request N times before choosing; use it to see whether Jev itself changes its top answer on identical input. `--variation both` is the default. The other modes are:

| Mode | What changes across runs |
|---|---|
| `sample` | The script samples from Jev's probabilities; no run-specific brief is sent. Later API inputs can diverge after earlier sampled choices differ. |
| `brief` | Jev receives a run-specific musical brief; the script takes Jev's top choice. |
| `none` | No run-specific brief or sampling; the script takes Jev's top choice. |

Every transcript separates **Jev's top choice** from the **selected choice** when probability sampling is enabled. The comparison report identifies which questions had identical inputs across runs, whether Jev's top answer changed, and whether the selected option changed. Use `--out DIR` to send a run somewhere else. No live output is automatically added to the root track table; this folder is the home for Jev experiments.
