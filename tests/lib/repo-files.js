import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SONGS_DIR = join(REPO_ROOT, 'songs');
export const SAMPLE_MAP_PATH = join(REPO_ROOT, 'strudel.json');

// Song files are every .js file in songs/, including the template.
export function listSongFiles() {
  return readdirSync(SONGS_DIR)
    .filter((name) => name.endsWith('.js'))
    .map((name) => join(SONGS_DIR, name));
}

export function readText(path) {
  return readFileSync(path, 'utf8');
}

// Reads "// @key value" lines from the top comment block of a song.
export function parseSongHeader(source) {
  const header = {};
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\/\/\s*@(\w+)\s+(.*)$/);
    if (match) {
      header[match[1]] = match[2].trim();
    } else if (!line.startsWith('//')) {
      break;
    }
  }
  return header;
}
