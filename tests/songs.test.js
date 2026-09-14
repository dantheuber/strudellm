import { test } from 'node:test';
import assert from 'node:assert/strict';
import { basename } from 'node:path';
import { Script } from 'node:vm';
import { listSongFiles, parseSongHeader, readText } from './lib/repo-files.js';

const REQUIRED_HEADER_KEYS = ['title', 'by', 'tempo'];
const songFiles = listSongFiles();

test('songs folder contains at least one song', () => {
  assert.ok(songFiles.length > 0);
});

for (const file of songFiles) {
  const name = basename(file);

  test(`${name}: is valid JavaScript syntax`, () => {
    // Compiles without running, so Strudel globals like s() are not needed.
    assert.doesNotThrow(() => new Script(readText(file), { filename: name }));
  });

  test(`${name}: has required header fields`, () => {
    const header = parseSongHeader(readText(file));
    for (const key of REQUIRED_HEADER_KEYS) {
      assert.ok(header[key], `missing "// @${key}" line`);
    }
  });

  test(`${name}: file name is kebab-case`, () => {
    assert.match(name, /^_?[a-z0-9]+(-[a-z0-9]+)*\.js$/);
  });
}

test('parseSongHeader stops at the first non-comment line', () => {
  const header = parseSongHeader('// @title A\n// @by B\ns("bd")\n// @tempo 90');
  assert.deepEqual(header, { title: 'A', by: 'B' });
});
