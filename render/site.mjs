// Small lesson facts shared by the publishing scripts (pages.mjs, youtube.mjs).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { lessonDir } from './paths.mjs';

// story.md heading, cut at " — " (the preview page title and the Zalo message use it)
export function lessonTitle(lesson) {
  return (fs.readFileSync(`${lessonDir(lesson)}/story.md`, 'utf8').match(/^#\s+(.+)$/m)?.[1] || lesson)
    .split(/\s+[—-]\s+/)[0];
}

// origin "owner/repo" -> { repo: 'owner/repo', url: GitHub Pages link of the lesson's preview }, or null
export function pagesSite(lesson) {
  let remote;
  try { remote = execFileSync('git', ['remote', 'get-url', 'origin'], { encoding: 'utf8' }).trim(); } catch { return null; }
  const m = remote.match(/([^/:]+)\/([^/]+?)(\.git)?\/?$/);
  return m ? { repo: `${m[1]}/${m[2]}`, url: `https://${m[1].toLowerCase()}.github.io/${m[2]}/${lesson}/` } : null;
}

// The page around a published lesson's player: shared/web/index.html with the lesson's language and
// title, and paths into the lesson's own copy of shared/web.
export function pageShell(lang, title) {
  return fs.readFileSync('shared/web/index.html', 'utf8')
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(/<title>.*<\/title>/, `<title>${title}</title>`)
    .replace(/(href|src)="(css|js)\//g, '$1="shared/web/$2/');
}
