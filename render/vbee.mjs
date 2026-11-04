// Vbee text-to-speech for render/voice.mjs ("provider": "vbee"; "voice" is the Vbee voice_code, optional "speed").
// Credentials come from VBEE_API_ID and VBEE_TOKEN (environment or the git-ignored .env); never commit them.
// Vbee returns no word times, so they are estimated: the measured speech span of the mp3 is shared out
// over the words by syllable weight, with a pause after each comma or full stop.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { loadEnv } from './elevenlabs.mjs';

const API = 'https://vbee.vn/api/v1/tts';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// total length and silence log of an mp3
function span(file) {
  const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file],
    { encoding: 'utf8' }).trim());
  const res = spawnSync('ffmpeg', ['-hide_banner', '-i', file, '-af', 'silencedetect=n=-38dB:d=0.1', '-f', 'null', '-'],
    { encoding: 'utf8' }).stderr;
  return { dur, log: res };
}

// word weights ~ spoken length
function weight(w) {
  const digits = (w.match(/\d/g) || []).length;
  const letters = w.replace(/[^\p{L}]/gu, '').length;
  return Math.max(1, digits * 1.6 + letters * 0.45 + 0.8);
}

// Words are shared out over the speech segments between the real pauses (comma / full stop breaks are
// matched to the longest detected silences), each segment by syllable weight.
export function estimateWords(text, start, end, silences = []) {
  const toks = text.split(/\s+/).filter(Boolean);
  const breaks = toks.map((t, i) => (i < toks.length - 1 && /[.?!,:;]$/.test(t) ? i : -1)).filter((i) => i >= 0);
  const inner = silences.filter(([a, b]) => a > start + 0.05 && b < end - 0.05);
  const picked = [...inner].sort((x, y) => (y[1] - y[0]) - (x[1] - x[0])).slice(0, breaks.length).sort((x, y) => x[0] - y[0]);
  const cuts = breaks.slice(0, picked.length);
  const out = [];
  let from = 0, t0 = start;
  [...cuts, toks.length - 1].forEach((last, k) => {
    const seg = toks.slice(from, last + 1);
    const t1 = k < cuts.length ? picked[k][0] : end;
    const total = seg.reduce((a, w) => a + weight(w), 0);
    let t = t0;
    seg.forEach((tok) => {
      const d = (weight(tok) / total) * (t1 - t0);
      out.push({ text: tok.replace(/[.,!?:;]+$/, ''), start: t, end: t + d });
      t += d;
    });
    from = last + 1;
    t0 = k < cuts.length ? picked[k][1] : end;
  });
  return out;
}

export async function synthVbee({ voiceCode, text, speed = 1, mp3, words }) {
  loadEnv();
  const { VBEE_API_ID: appId, VBEE_TOKEN: token } = process.env;
  if (!appId || !token) throw new Error('VBEE_API_ID / VBEE_TOKEN are not set (environment or .env)');
  const headers = { Authorization: `Bearer ${token}`, 'content-type': 'application/json' };
  const res = await fetch(API, {
    method: 'POST', headers,
    body: JSON.stringify({ app_id: appId, response_type: 'indirect', callback_url: 'https://example.com/vbee',
      input_text: text, voice_code: voiceCode, audio_type: 'mp3', bitrate: 128, speed_rate: String(speed) }),
  });
  const made = await res.json();
  if (!res.ok || made.status !== 1) throw new Error(`vbee ${res.status}: ${JSON.stringify(made).slice(0, 300)}`);
  const id = made.result.request_id;
  let link = null;
  for (let i = 0; i < 60 && !link; i++) {
    await sleep(1200);
    const j = await (await fetch(`${API}/${id}`, { headers })).json();
    if (j.result?.status === 'SUCCESS') link = j.result.audio_link;
    else if (j.result?.status === 'FAILURE') throw new Error(`vbee failed: ${JSON.stringify(j).slice(0, 300)}`);
  }
  if (!link) throw new Error('vbee: timed out');
  const audio = await fetch(link);
  if (!audio.ok) throw new Error(`vbee download ${audio.status}`);
  fs.writeFileSync(mp3, Buffer.from(await audio.arrayBuffer()));
  const { dur, log } = span(mp3);
  const sil = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  const start = sil[0] !== undefined && sil[0] < 0.05 && ends[0] !== undefined ? ends[0] : 0;
  const lastStart = sil[sil.length - 1];
  const end = lastStart !== undefined && lastStart > dur - 0.6 && lastStart > start ? lastStart : dur;
  const pairs = sil.map((a, i) => [a, ends[i] ?? dur]);
  const list = estimateWords(text, start, end, pairs);
  fs.writeFileSync(words, JSON.stringify(list, null, 1));
  return list;
}
