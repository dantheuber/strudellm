import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, SAMPLE_MAP_PATH, readText } from './lib/repo-files.js';

test('strudel.json is a JSON object', () => {
  const map = JSON.parse(readText(SAMPLE_MAP_PATH));
  assert.equal(typeof map, 'object');
  assert.ok(map !== null && !Array.isArray(map));
});

test('every file listed in strudel.json exists', () => {
  const map = JSON.parse(readText(SAMPLE_MAP_PATH));
  for (const [sound, files] of Object.entries(map)) {
    // Keys starting with "_" (like "_base") are settings, not sounds.
    if (sound.startsWith('_')) continue;
    const paths = Array.isArray(files) ? files : [files];
    for (const path of paths) {
      assert.ok(existsSync(join(REPO_ROOT, path)), `${sound}: missing ${path}`);
    }
  }
});
