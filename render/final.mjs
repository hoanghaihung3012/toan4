// Final export after the preview is approved: capture the video, mux the lesson's voiceover,
// and write the one committed file to final/<lesson>.mp4 (the video-only capture stays in the
// lesson's ignored out/).
//
//   node render/final.mjs <lesson> [--crf 18]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { parseArgs } from './browser.mjs';

const args = parseArgs(process.argv.slice(2));
const lesson = args._[0];
if (!lesson) throw new Error('usage: node render/final.mjs <lesson>');
const video = `lessons/${lesson}/out/${lesson}_video.mp4`;
const out = `final/${lesson}.mp4`;

execFileSync('node', ['render/capture.mjs', '--lesson', lesson, '--out', video, ...(args.crf ? ['--crf', String(args.crf)] : [])],
  { stdio: 'inherit' });
fs.mkdirSync('final', { recursive: true });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-i', `lessons/${lesson}/audio/voice.wav`,
  '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
  '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' });
console.log(`wrote ${out}`);
