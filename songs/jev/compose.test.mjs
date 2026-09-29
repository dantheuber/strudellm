import { test } from 'node:test';
import assert from 'node:assert/strict';
import { creativeBrief, sampleChoice } from './compose.mjs';

test('seeded sampling is reproducible and can choose different Jev-supported options', () => {
  const options = { a: {}, b: {}, c: {} };
  const answer = { choice: 'a', probabilities: { a: 0.4, b: 0.3, c: 0.3 } };
  assert.deepEqual(sampleChoice(options, answer, 'same seed'), sampleChoice(options, answer, 'same seed'));
  const choices = new Set(Array.from({ length: 30 }, (_, i) => sampleChoice(options, answer, `seed:${i}`).choice));
  assert.ok(choices.size > 1);
  assert.ok([...choices].every(choice => Object.hasOwn(options, choice)));
});

test('musical briefs vary by run while repeating for a fixed seed and run', () => {
  assert.deepEqual(creativeBrief('same seed', 1), creativeBrief('same seed', 1));
  assert.notDeepEqual(creativeBrief('same seed', 1), creativeBrief('same seed', 2));
});
