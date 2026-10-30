import fs from 'node:fs';

const RATE = 48000;

function writeWav(file, samples) {
  const dataSize = samples.length * 2;
  const wav = Buffer.alloc(44 + dataSize);
  wav.write('RIFF', 0);
  wav.writeUInt32LE(36 + dataSize, 4);
  wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(2, 22);
  wav.writeUInt32LE(RATE, 24);
  wav.writeUInt32LE(RATE * 4, 28);
  wav.writeUInt16LE(4, 32);
  wav.writeUInt16LE(16, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(dataSize, 40);
  samples.forEach((sample, index) => wav.writeInt16LE(sample, 44 + index * 2));
  fs.writeFileSync(file, wav);
}

function chalkChime(file) {
  const duration = 0.95;
  const frames = Math.round(RATE * duration);
  const samples = new Int16Array(frames * 2);
  let seed = 937;
  let noise = 0;
  const notes = [
    { start: 0.34, frequency: 659.25, gain: 0.20 },
    { start: 0.43, frequency: 987.77, gain: 0.15 },
  ];

  for (let i = 0; i < frames; i++) {
    const t = i / RATE;
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const white = (seed / 0x100000000) * 2 - 1;
    noise = noise * 0.86 + white * 0.14;
    const swipeEnvelope = t < 0.28 ? Math.sin(Math.PI * t / 0.28) ** 1.5 : 0;
    let value = noise * swipeEnvelope * 0.23;

    for (const note of notes) {
      const elapsed = t - note.start;
      if (elapsed >= 0) {
        const envelope = Math.exp(-elapsed * 8) * Math.min(1, elapsed / 0.008);
        value += note.gain * envelope * (
          Math.sin(2 * Math.PI * note.frequency * elapsed)
          + 0.28 * Math.sin(2 * Math.PI * note.frequency * 2.76 * elapsed)
        );
      }
    }

    const sample = Math.max(-1, Math.min(1, value)) * 32767;
    samples[i * 2] = sample;
    samples[i * 2 + 1] = sample;
  }
  writeWav(file, samples);
}

export function generateSfx(file, preset) {
  if (preset !== 'chalk_chime') throw new Error(`unknown sound preset: ${preset}`);
  chalkChime(file);
  return file;
}