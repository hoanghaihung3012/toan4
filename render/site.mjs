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
