#!/usr/bin/env node
// Experimental Jev-directed Strudel composer. No existing song is sent to Jev.
import { createHash, randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const API_URL = 'https://api.typesafe.ai/v1/systemone';
const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const JEV_DIR = resolve(ROOT, 'songs', 'jev');
const MODES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
};
const NOTES = ['c', 'cs', 'd', 'ds', 'e', 'f', 'fs', 'g', 'gs', 'a', 'as', 'b'];
const PROGRESSIONS = [
  [0, 5, 3, 4], [0, 3, 4, 3], [0, 4, 5, 3], [0, 6, 5, 4],
  [0, 2, 5, 3], [0, 5, 1, 4], [0, 3, 6, 4], [0, 1, 3, 4],
  [0, 4, 3, 4], [0, 2, 3, 4], [0, 6, 3, 4], [0, 5, 4, 3],
  [5, 3, 0, 4], [3, 4, 0, 5], [0, 3, 0, 4], [0, 5, 3, 6],
  [0, 1, 5, 4], [0, 6, 1, 4], [0, 2, 6, 4], [0, 3, 5, 4],
  [0, 4, 1, 3], [0, 6, 4, 5], [0, 2, 4, 5], [0, 5, 6, 4],
];
const KICKS = [
  [0, 4, 8, 12], [0, 8], [0, 6, 10], [0, 3, 8, 11],
  [0, 4, 7, 10, 12], [0, 5, 8, 14], [0, 6, 8, 11, 14], [0, 3, 6, 10, 13],
];
const SNARES = [[4, 12], [4, 11], [8], [4, 12, 15]];
const HATS = [
  [0, 2, 4, 6, 8, 10, 12, 14], [0, 4, 8, 12], [2, 6, 10, 14],
  [0, 2, 5, 8, 10, 13], [0, 3, 6, 8, 11, 14], [0, 2, 4, 7, 8, 10, 12, 15],
  [0, 2, 4, 6, 8, 9, 10, 12, 14], [0, 1, 2, 4, 6, 8, 10, 11, 12, 14],
];
const BASS_RHYTHMS = [
  [0, 4], [0, 3, 6], [0, 4, 7], [0, 2, 5, 7],
  [0, 3, 5], [0, 2, 4, 6], [0, 5, 7], [0, 3, 4, 7],
];
const BASS_PATHS = [[0, 0, 4, 0], [0, 4, 0, 2], [0, 2, 4, 2], [0, 0, 2, 4]];
const RHYTHMS = [
  [0, 2, 4, 6], [0, 3, 4, 7], [0, 2, 5, 7],
  [0, 1, 4, 6], [0, 3, 5], [0, 2, 4, 5, 7],
];
const CONTOURS = [
  [0, 2, 4, 2, 0, -1], [0, 4, 2, 5, 4, 2], [4, 2, 0, -1, 0, 2],
  [0, 0, 2, 4, 2, 0], [2, 4, 5, 4, 2, 0], [0, -1, 0, 2, 4, 2],
  [4, 5, 4, 2, 0, -1], [0, 2, 0, 4, 2, 5],
];
const SECTION_LENGTHS = [
  ['intro', 8], ['foundation', 16], ['first hook', 16],
  ['break', 16], ['rebuild', 16], ['climax', 16], ['outro', 16],
];

function hash(value) {
  return createHash('sha256').update(value).digest('hex');
}

function rng(seed) {
  let state = Number.parseInt(hash(seed).slice(0, 8), 16) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

function creativeBrief(seed, runNumber) {
  const random = rng(`${seed}:brief:${runNumber}`);
  const pick = values => values[Math.floor(random() * values.length)];
  return {
    rhythmicImpulse: pick(['lurching and syncopated', 'steady and propulsive', 'spacious with unexpected accents', 'restless and broken', 'lightly swinging', 'slowly accumulating']),
    harmonicColor: pick(['warm and resolved', 'ambiguous and suspended', 'dark with flashes of brightness', 'bright but bittersweet', 'tense and unresolved', 'open and weightless']),
    foreground: pick(['a memorable bass movement', 'a short melodic hook', 'percussion that evolves', 'conversation between two melodies', 'texture and negative space', 'a hypnotic arpeggio']),
    dramaticArc: pick(['a patient bloom into a strong peak', 'an early hook followed by a deep break', 'several waves of energy', 'a sparse opening and sudden entrance', 'tension that releases near the end', 'a long gradual build with a quiet exit']),
  };
}

function noteName(midi) {
  return `${NOTES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
}

function degreeMidi(tonic, mode, degree, octave = 4) {
  const scale = MODES[mode];
  const octaves = Math.floor(degree / 7);
  const index = ((degree % 7) + 7) % 7;
  return 12 * (octave + 1) + tonic + 12 * octaves + scale[index];
}

function namedOptions(values, description) {
  return Object.fromEntries(values.map((value, i) => [
    `o${String(i + 1).padStart(2, '0')}`,
    { value, description: description(value, i) },
  ]));
}

function parseArgs(argv) {
  const args = { seed: null, runs: 1, probes: 1, out: null, dryRun: false, model: 'jev-latest', variation: 'both' };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dry-run') { args.dryRun = true; continue; }
    if (arg === '--help') { args.help = true; continue; }
    const key = { '--seed': 'seed', '--runs': 'runs', '--probes': 'probes', '--out': 'out', '--model': 'model', '--variation': 'variation' }[arg];
    if (!key || !argv[i + 1]) throw new Error(`Unknown or incomplete option: ${arg}`);
    args[key] = argv[++i];
  }
  for (const [key, max] of [['runs', 20], ['probes', 10]]) {
    args[key] = Number(args[key]);
    if (!Number.isInteger(args[key]) || args[key] < 1 || args[key] > max) {
      throw new Error(`--${key} must be an integer from 1 to ${max}`);
    }
  }
  if (!['both', 'sample', 'brief', 'none'].includes(args.variation)) {
    throw new Error('--variation must be both, sample, brief, or none');
  }
  args.seed ??= randomBytes(8).toString('hex');
  return args;
}

async function callJev(body, key) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });
    if (response.ok) return response.json();
    if ((response.status === 429 || response.status >= 500) && attempt < 2) {
      await new Promise(done => setTimeout(done, 500 * 2 ** attempt));
      continue;
    }
    throw new Error(`TypeSafe API returned HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
}

function sampleChoice(options, answer, seed) {
  const random = rng(seed);
  const draw = random();
  const weights = Object.keys(options).map(id => {
    const probability = answer.probabilities?.[id];
    return [id, Number.isFinite(probability) && probability > 0 ? probability : 0];
  });
  const total = weights.reduce((sum, [, weight]) => sum + weight, 0);
  if (total <= 0) return { choice: answer.choice, draw: null, probability: null };
  let remaining = draw * total;
  for (const [id, weight] of weights) {
    remaining -= weight;
    if (remaining < 0) return { choice: id, draw, probability: weight / total };
  }
  const [id, weight] = weights.at(-1);
  return { choice: id, draw, probability: weight / total };
}

function makeChooser({ prompt, args, runNumber, brief }) {
  const decisions = [];
  async function choose(stage, instruction, options, context) {
    const criteria = Object.fromEntries(Object.entries(options).map(([id, option]) => [id, option.description]));
    const request = {
      model: args.model,
      state: { songPrompt: prompt, task: 'Choose material for one original Strudel track.',
        ...(brief ? { creativeBrief: brief } : {}), ...context },
      questions: { selection: { type: 'choice', instructions: instruction, criteria } },
    };
    const requestHash = hash(JSON.stringify(request));
    const probes = [];
    for (let i = 0; i < args.probes; i++) {
      const result = args.dryRun
        ? { model: 'DRY_RUN', answers: { selection: { type: 'choice', choice: Object.keys(options)[0], confidence: 1 } }, usage: null }
        : await callJev(request, process.env.TYPESAFE_API_KEY);
      const answer = result?.answers?.selection;
      if (answer?.type !== 'choice' || !Object.hasOwn(options, answer.choice)) {
        throw new Error(`Invalid choice for ${stage}: ${JSON.stringify(answer)}`);
      }
      probes.push({ choice: answer.choice, confidence: answer.confidence, probabilities: answer.probabilities, model: result.model, usage: result.usage });
    }
    const sampled = ['both', 'sample'].includes(args.variation) && !args.dryRun
      ? sampleChoice(options, probes[0], `${args.seed}:run:${runNumber}:stage:${stage}`)
      : { choice: probes[0].choice, draw: null, probability: null };
    const picked = sampled.choice;
    decisions.push({ stage, requestHash, request, probes, jevTopChoice: probes[0].choice,
      selected: picked, selectionMethod: sampled.draw === null ? 'top' : 'sample',
      samplingDraw: sampled.draw, selectedProbability: sampled.probability });
    console.log(`  ${stage}: ${picked}${picked !== probes[0].choice ? ` (Jev top: ${probes[0].choice})` : ''} — ${options[picked].description.slice(0, 72)}${new Set(probes.map(p => p.choice)).size > 1 ? ' [probe disagreement]' : ''}`);
    return options[picked].value;
  }
  return { choose, decisions };
}

function styleOptions() {
  const feels = [
    ['glassy electronica', 'clear melodic lines and spacious synths'],
    ['nighttime breakbeat', 'uneven drums and a restless bass pulse'],
    ['hypnotic dance', 'repeating motifs with gradual changes in intensity'],
    ['cinematic downtempo', 'wide harmony and deliberate rhythmic space'],
  ];
  return namedOptions(feels.flatMap(([name, detail]) => [96, 108, 120, 136].map(bpm => ({ name, detail, bpm }))),
    value => `${value.name}, ${value.bpm} BPM; ${value.detail}`);
}

function progressionOptions(tonic, mode) {
  return namedOptions(PROGRESSIONS, degrees => {
    const roots = degrees.map(d => noteName(degreeMidi(tonic, mode, d, 3)));
    return `Four-bar harmony: ${roots.join(' → ')}; scale degrees ${degrees.map(d => d + 1).join('–')}.`;
  });
}

function stepPattern(sound, hits) {
  return Array.from({ length: 16 }, (_, i) => hits.includes(i) ? sound : '~').join(' ');
}

function drumOptions() {
  return namedOptions(KICKS.flatMap(kick => SNARES.map(snare => ({ kick, snare }))), value =>
    `16-step beat; kick on ${value.kick.map(n => n + 1).join(', ')}, snare on ${value.snare.map(n => n + 1).join(', ')}.`);
}

function hatOptions() {
  return namedOptions(HATS.flatMap(hits => [[], [6], [6, 14]].map(open => ({ hits, open }))), value =>
    `Closed hats on steps ${value.hits.map(n => n + 1).join(', ')}; open hats ${value.open.length ? `on ${value.open.map(n => n + 1).join(', ')}` : 'absent'}.`);
}

function bassOptions() {
  return namedOptions(BASS_RHYTHMS.flatMap(hits => BASS_PATHS.map(path => ({ hits, path }))), value =>
    `Eight-step bass rhythm at ${value.hits.map(n => n + 1).join(', ')}; relative melodic moves ${value.path.join(', ')}.`);
}

function melodyOptions(tonic, mode, progression, seed, role) {
  const random = rng(`${seed}:${role}`);
  const values = [];
  for (let contour = 0; contour < CONTOURS.length; contour++) {
    for (let rhythm = 0; rhythm < RHYTHMS.length; rhythm++) {
      const bars = [];
      for (let bar = 0; bar < 4; bar++) {
        const active = RHYTHMS[rhythm];
        const line = Array(8).fill('~');
        for (let j = 0; j < active.length; j++) {
          const nudge = Math.floor(random() * 3) - 1;
          let degree = progression[bar] + CONTOURS[contour][(j + bar) % 6] + nudge;
          if (bar === 3 && j === active.length - 1) degree = 0;
          line[active[j]] = noteName(degreeMidi(tonic, mode, degree, role === 'counter' ? 5 : 4));
        }
        bars.push(line.join(' '));
      }
      values.push({ bars, contour, rhythm });
    }
  }
  return namedOptions(values, value =>
    `${role} phrase, four bars; ${value.bars.map((bar, i) => `bar ${i + 1}: ${bar}`).join('; ')}`);
}

function sectionOptions(role) {
  const focus = [
    ['pad', ['pad']], ['bass and pad', ['bass', 'pad']],
    ['arpeggio and pad', ['arp', 'pad']], ['lead and bass', ['lead', 'bass', 'pad']],
    ['alternate hook and arpeggio', ['variation', 'arp', 'pad']],
    ['lead and counterpoint', ['lead', 'counter', 'pad']],
    ['alternate hook and counterpoint', ['variation', 'counter', 'bass', 'pad']],
    ['full melodic conversation', ['lead', 'variation', 'counter', 'arp', 'bass', 'pad']],
    ['lead, arpeggio, and bass', ['lead', 'arp', 'bass', 'pad']],
    ['alternate hook and bass', ['variation', 'bass', 'pad']],
    ['both hooks and bass', ['lead', 'variation', 'bass', 'pad']],
    ['counterpoint, arpeggio, and bass', ['counter', 'arp', 'bass', 'pad']],
    ['lead, counterpoint, arpeggio, and bass', ['lead', 'counter', 'arp', 'bass', 'pad']],
    ['alternate hook, counterpoint, arpeggio, and bass', ['variation', 'counter', 'arp', 'bass', 'pad']],
    ['both hooks, arpeggio, and bass', ['lead', 'variation', 'arp', 'bass', 'pad']],
    ['both hooks, counterpoint, and bass', ['lead', 'variation', 'counter', 'bass', 'pad']],
  ];
  const drums = [
    ['no drums', 'none'], ['soft pulse', 'pulse'],
    ['full drums', 'full'], ['drums with brighter hats', 'bright'],
  ];
  const candidates = focus.flatMap(([name, layers]) => drums.map(([drumName, drum]) => ({ name, layers, drumName, drum })));
  const suitable = candidates.filter(value => {
    if (role === 'intro' || role === 'break' || role === 'outro') return value.drum === 'none' || value.drum === 'pulse';
    if (role === 'foundation' || role === 'rebuild') return value.layers.includes('bass') && value.drum !== 'none';
    if (role === 'first hook') return value.layers.includes('lead') && value.drum !== 'none';
    if (role === 'climax') return value.layers.includes('variation') && ['full', 'bright'].includes(value.drum);
    return true;
  });
  return namedOptions(suitable,
    value => `${value.name}; ${value.drumName}.`);
}

function instrumentationOptions() {
  return namedOptions(['sine', 'triangle', 'sawtooth', 'square'].flatMap(lead =>
    ['sine', 'triangle', 'sawtooth', 'square'].flatMap(pad =>
      ['RolandTR808', 'RolandTR909'].map(bank => ({ lead, pad, bank })))),
  value => `Lead: ${value.lead}; pad: ${value.pad}; drums: ${value.bank}.`);
}

function effectsOptions() {
  return namedOptions([1800, 2600, 3600, 5000].flatMap(cutoff =>
    [0, 0.2, 0.4].flatMap(delay =>
      [0.2, 0.55].map(room => ({ cutoff, delay, room })))),
  value => `Lead brightness ${value.cutoff} Hz; echo amount ${value.delay}; room amount ${value.room}.`);
}

function codeString(value) { return JSON.stringify(value); }

function renderSong(song, model) {
  const { style, tonic, mode, progression, drums, hats, bass, lead, variation, counter, instruments, effects, sections } = song;
  const bars = SECTION_LENGTHS.reduce((n, [, length]) => n + length, 0);
  const chordBars = progression.map(degree => {
    const notes = [0, 2, 4, 6].map(step => noteName(degreeMidi(tonic, mode, degree + step, 3)));
    return `[${notes.join(',')}]`;
  });
  const bassBars = progression.map(degree => {
    const notes = Array(8).fill('~');
    bass.hits.forEach((step, index) => {
      notes[step] = noteName(degreeMidi(tonic, mode, degree + bass.path[index % bass.path.length], 2));
    });
    return notes.join(' ');
  });
  const arpBars = progression.map(degree => [0, 2, 4, 6, 4, 2, 6, 2]
    .map(step => noteName(degreeMidi(tonic, mode, degree + step, 4))).join(' '));
  const sectionDefinitions = sections.map((section, i) => {
    const layers = [...section.layers];
    if (section.drum === 'pulse') layers.push('pulse');
    if (section.drum === 'full') layers.push('fullDrums');
    if (section.drum === 'bright') layers.push('brightDrums');
    return `const section${i + 1} = stack(${layers.join(', ')}); // ${SECTION_LENGTHS[i][0]}: ${section.name}, ${section.drumName}`;
  });
  const usedLayers = new Set(sections.flatMap(section => section.layers));
  const usedDrums = new Set(sections.map(section => section.drum));
  const lines = [
    `// Jev-directed procedural composition; decisions made by ${model}.`,
    `// ${style.name}; ${style.bpm} BPM; ${bars} bars = ${(bars * 240 / style.bpm).toFixed(1)} seconds before looping.`,
    '// Built-in Strudel sounds only. Decision transcript is in the adjacent JSON file.',
    `setcpm(${style.bpm} / 4);`,
  ];
  if (['bass', 'arp', 'lead', 'variation', 'counter'].some(layer => usedLayers.has(layer))) {
    lines.push('const line = (...bars) => cat(...bars.map(bar => note(bar)));');
  }
  lines.push(
    `const harmony = note(${codeString(`<${chordBars.join(' ')}>`)});`,
    `const pad = harmony.s(${codeString(instruments.pad)}).attack(0.4).release(0.8).lpf(1300).room(0.55).gain(0.18);`,
  );
  if (usedLayers.has('bass')) lines.push(`const bass = line(${bassBars.map(codeString).join(', ')}).s("sawtooth").lpf(700).attack(0.004).decay(0.18).sustain(0.2).release(0.08).gain(0.32);`);
  if (usedLayers.has('arp')) lines.push(`const arp = line(${arpBars.map(codeString).join(', ')}).s("triangle").attack(0.003).decay(0.13).sustain(0).release(0.08).lpf(2600).gain(0.16).delay(0.22).delaytime(0.25);`);
  if (usedLayers.has('lead')) lines.push(`const lead = line(${lead.bars.map(codeString).join(', ')}).s(${codeString(instruments.lead)}).attack(0.01).release(0.22).lpf(${effects.cutoff}).gain(0.25).delay(${effects.delay}).delaytime(0.375).room(${effects.room});`);
  if (usedLayers.has('variation')) lines.push(`const variation = line(${variation.bars.map(codeString).join(', ')}).s(${codeString(instruments.lead)}).attack(0.01).release(0.25).lpf(${effects.cutoff}).gain(0.22).delay(${effects.delay}).delaytime(0.375).room(${effects.room});`);
  if (usedLayers.has('counter')) lines.push(`const counter = line(${counter.bars.map(codeString).join(', ')}).s("triangle").attack(0.02).release(0.3).lpf(3500).gain(0.13).pan(0.7).room(0.35);`);
  if (['pulse', 'full', 'bright'].some(drum => usedDrums.has(drum))) {
    lines.push(`const kick = s(${codeString(stepPattern('bd', drums.kick))}).bank(${codeString(instruments.bank)}).gain(0.75);`);
    lines.push(`const hats = s(${codeString(stepPattern('hh', hats.hits))}).bank(${codeString(instruments.bank)}).gain(0.12).hpf(5000);`);
  }
  if (usedDrums.has('full') || usedDrums.has('bright')) lines.push(`const snare = s(${codeString(stepPattern('sd', drums.snare))}).bank(${codeString(instruments.bank)}).gain(0.42);`);
  if (usedDrums.has('bright')) lines.push(`const openHats = s(${codeString(stepPattern('oh', hats.open))}).bank(${codeString(instruments.bank)}).gain(0.1).hpf(5000);`);
  if (usedDrums.has('pulse')) lines.push('const pulse = stack(kick.gain(0.55), hats.gain(0.55));');
  if (usedDrums.has('full')) lines.push('const fullDrums = stack(kick, snare, hats);');
  if (usedDrums.has('bright')) lines.push('const brightDrums = stack(kick, snare, hats.gain(1.6), openHats);');
  lines.push(...sectionDefinitions);
  lines.push(`arrange(\n${SECTION_LENGTHS.map(([, length], i) => `  [${length}, section${i + 1}],`).join('\n')}\n).gain(0.82);`);
  return `${lines.join('\n')}\n`;
}

function comparison(runs) {
  const stages = runs[0].decisions.map(d => d.stage);
  return stages.map((stage, index) => {
    const decisions = runs.map(run => run.decisions[index]);
    const requestHashes = [...new Set(decisions.map(d => d.requestHash))];
    const selected = decisions.map(d => d.selected);
    const jevTopChoices = decisions.map(d => d.jevTopChoice);
    const sameInputDifferentSelection = requestHashes.some(requestHash =>
      new Set(decisions.filter(d => d.requestHash === requestHash).map(d => d.selected)).size > 1);
    const sameInputDifferentJevChoice = requestHashes.some(requestHash =>
      new Set(decisions.filter(d => d.requestHash === requestHash).map(d => d.jevTopChoice)).size > 1);
    return { stage, identicalInputsAcrossRuns: requestHashes.length === 1, selections: selected, jevTopChoices,
      changedSelection: new Set(selected).size > 1, sameInputDifferentSelection, sameInputDifferentJevChoice,
      probeDisagreements: decisions.map(d => new Set(d.probes.map(p => p.choice)).size > 1) };
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log('Usage: npm run jev -- [--seed TEXT] [--variation both|sample|brief|none] [--runs 1..20] [--probes 1..10] [--out DIR] [--model MODEL] [--dry-run]');
    console.log('Default variation is both; omitted seed is random. --probes repeats each identical request.');
    return;
  }
  if (!args.dryRun && !process.env.TYPESAFE_API_KEY) throw new Error('Set TYPESAFE_API_KEY before a live run.');
  console.log(`Seed: ${args.seed}; variation: ${args.variation}.`);
  console.log(`${args.runs * args.probes * 19} ${args.dryRun ? 'simulated' : 'live'} decisions (${args.runs} run(s) × ${args.probes} probe(s) × 19 stages).`);
  const prompt = await readFile(resolve(ROOT, 'SONG_PROMPT.md'), 'utf8');
  const session = new Date().toISOString().replace(/[:.]/g, '-');
  const output = args.out ? resolve(ROOT, args.out)
    : args.dryRun ? resolve(JEV_DIR, '.dry-runs', `${session}-${process.pid}`)
      : JEV_DIR;
  await mkdir(output, { recursive: true });
  const sessionPrefix = `jev-${session}-${process.pid}`;
  const runs = [];
  for (let runNumber = 1; runNumber <= args.runs; runNumber++) {
    console.log(`Run ${runNumber}/${args.runs}${args.dryRun ? ' (dry run: no Jev calls)' : ''}`);
    const brief = ['both', 'brief'].includes(args.variation) ? creativeBrief(args.seed, runNumber) : null;
    if (brief) console.log(`  Creative brief: ${Object.values(brief).join('; ')}`);
    const { choose, decisions } = makeChooser({ prompt, args, runNumber, brief });
    const style = await choose('style', 'Choose the most compelling overall musical direction for this original track.', styleOptions(), {});
    const mode = await choose('mode', 'Which scale mode gives this direction a distinctive musical character?',
      namedOptions(Object.keys(MODES), value => `${value} scale`), { style });
    const tonic = await choose('tonic', 'Which tonic pitch best suits this direction and mode?',
      namedOptions(Array.from({ length: 12 }, (_, i) => i), value => `${NOTES[value]} as tonic`), { style, mode });
    const progression = await choose('harmony', 'Choose the strongest four-bar harmonic journey for this track.',
      progressionOptions(tonic, mode), { style, mode, tonic: NOTES[tonic] });
    const drums = await choose('drums', 'Choose a beat that makes the chosen style and harmony feel alive.',
      drumOptions(), { style, mode, progression });
    const hats = await choose('hats', 'Choose a hi-hat pattern that complements this kick and snare beat.',
      hatOptions(), { style, mode, progression, drums });
    const bass = await choose('bass', 'Choose a bass rhythm and melodic motion that locks to the chosen beat.',
      bassOptions(), { style, mode, progression, drums, hats });
    const lead = await choose('lead', 'Choose the four-bar hook with the strongest identity and rhythmic fit.',
      melodyOptions(tonic, mode, progression, args.seed, 'lead'), { style, mode, progression, drums, bass });
    const variation = await choose('variation', 'Choose a second four-bar hook that develops and contrasts with the first.',
      melodyOptions(tonic, mode, progression, args.seed, 'variation'), { style, mode, progression, lead: lead.bars });
    const counter = await choose('counter', 'Choose a contrasting four-bar phrase that answers the hook without crowding it.',
      melodyOptions(tonic, mode, progression, args.seed, 'counter'), { style, mode, progression, lead: lead.bars, variation: variation.bars });
    const instruments = await choose('instruments', 'Choose a timbral palette that gives the chosen phrases character.',
      instrumentationOptions(), { style, mode, progression, lead: lead.bars, variation: variation.bars, counter: counter.bars });
    const effects = await choose('effects', 'Choose a lead brightness and space treatment for this track.',
      effectsOptions(), { style, instruments, lead: lead.bars });
    const sections = [];
    for (const [name, bars] of SECTION_LENGTHS) {
      sections.push(await choose(`section: ${name}`, `Choose instrumentation for the ${name} section (${bars} bars). Give the complete track a satisfying arc.`,
        sectionOptions(name), { style, mode, progression, previousSections: sections, section: name, bars }));
    }
    const model = decisions.find(d => d.probes[0].model !== 'DRY_RUN')?.probes[0].model ?? 'DRY_RUN';
    const song = renderSong({ style, tonic, mode, progression, drums, hats, bass, lead, variation, counter, instruments, effects, sections }, model);
    new Script(song, { filename: `run-${runNumber}.js` });
    const prefix = `${sessionPrefix}-run-${String(runNumber).padStart(2, '0')}`;
    await writeFile(resolve(output, `${prefix}.js`), song, { flag: 'wx' });
    await writeFile(resolve(output, `${prefix}.json`), JSON.stringify({ seed: args.seed, variation: args.variation,
      runNumber, creativeBrief: brief, requestedModel: args.model,
      resolvedModel: model, dryRun: args.dryRun, promptHash: hash(prompt), songHash: hash(song), decisions }, null, 2) + '\n', { flag: 'wx' });
    runs.push({ decisions, songHash: hash(song) });
  }
  const summary = { seed: args.seed, variation: args.variation, runs: args.runs, probes: args.probes, dryRun: args.dryRun,
    songHashes: runs.map(run => run.songHash), stages: comparison(runs) };
  await writeFile(resolve(output, `${sessionPrefix}-comparison.json`), JSON.stringify(summary, null, 2) + '\n', { flag: 'wx' });
  console.log(`Wrote ${args.runs} song(s), decision transcripts, and ${sessionPrefix}-comparison.json to ${output}`);
  console.log(`${new Set(summary.songHashes).size} distinct song file(s); ${summary.stages.filter(s => s.sameInputDifferentJevChoice).length} stages where Jev's top choice changed on identical inputs; ${summary.stages.filter(s => s.sameInputDifferentSelection).length} stages where the selected choice changed on identical inputs; ${summary.stages.filter(s => s.probeDisagreements.some(Boolean)).length} stages had probe disagreements.`);
}

export { creativeBrief, sampleChoice };

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
