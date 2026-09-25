import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SONGS_DIR = join(REPO_ROOT, 'songs');
export const ARCHIVE_DIR = join(REPO_ROOT, 'archive', 'pre-standardized');
export const SAMPLE_MAP_PATH = join(REPO_ROOT, 'strudel.json');

// Song files are every .js file in a song directory and its subfolders.
export function listSongFiles(directory = SONGS_DIR) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return listSongFiles(path);
    return entry.name.endsWith('.js') ? [path] : [];
  });
}

export function readText(path) {
  return readFileSync(path, 'utf8');
}
