import { test } from 'node:test';
import assert from 'node:assert/strict';
import { relative } from 'node:path';
import { Script } from 'node:vm';
import { ARCHIVE_DIR, REPO_ROOT, listSongFiles, readText } from './lib/repo-files.js';

for (const file of [...listSongFiles(), ...listSongFiles(ARCHIVE_DIR)]) {
  const name = relative(REPO_ROOT, file);

  test(`${name}: is valid JavaScript syntax`, () => {
    // Compiles without running, so Strudel globals like s() are not needed.
    assert.doesNotThrow(() => new Script(readText(file), { filename: name }));
  });
}
