// ElevenLabs text-to-speech with word times, for render/voice.mjs ("provider": "elevenlabs").
// The API key is read from ELEVENLABS_API_KEY (environment or the git-ignored .env); never commit it.
import fs from 'node:fs';

const API = 'https://api.elevenlabs.io/v1';

export function loadEnv(file = '.env') {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]] && m[2]) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

// character alignment -> words ({ text, start, end } in seconds), split on whitespace
export function wordsFromAlignment({ characters, character_start_times_seconds: starts,
  character_end_times_seconds: ends }) {
  const words = [];
  let cur = null;
  characters.forEach((ch, i) => {
    if (/\s/.test(ch)) { cur = null; return; }
    if (!cur) { cur = { text: '', start: starts[i], end: ends[i] }; words.push(cur); }
    cur.text += ch;
    cur.end = ends[i];
  });
  return words;
}

export async function synthEleven({ voiceId, text, model = 'eleven_multilingual_v2', speed, stability,
  similarity, style, mp3, words }) {
  loadEnv();
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('ELEVENLABS_API_KEY is not set (environment or .env)');
  const voice_settings = {
    ...(stability !== undefined ? { stability } : {}),
    ...(similarity !== undefined ? { similarity_boost: similarity } : {}),
    ...(style !== undefined ? { style } : {}),
    ...(speed !== undefined ? { speed } : {}),
  };
  const res = await fetch(`${API}/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'content-type': 'application/json' },
    body: JSON.stringify({ text, model_id: model, ...(Object.keys(voice_settings).length ? { voice_settings } : {}) }),
  });
  if (!res.ok) throw new Error(`elevenlabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const body = await res.json();
  fs.writeFileSync(mp3, Buffer.from(body.audio_base64, 'base64'));
  const list = wordsFromAlignment(body.alignment || body.normalized_alignment);
  fs.writeFileSync(words, JSON.stringify(list, null, 1));
  return list;
}
