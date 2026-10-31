# Intro kênh Học cùng Phượng

A ~10 s channel intro, played at the start of every clip (9:16 Shorts and 16:9 long videos).
Not a lesson: nothing to solve, so there are no sourced numbers. The only facts are the user's request.

## Facts
| # | Fact | Source |
|---|---|---|
| F1 | Channel name "Học cùng Phượng" (spelling as in the existing lessons and YouTube metadata) | User request + `elmo_2023` lesson |
| F2 | Length about 10 s | User request |
| F3 | Voice: Edge TTS vi-VN-HoaiMyNeural, rate -4% (switched from ElevenLabs on request) | User request |

The voice makes no claim about who the host is and no promise beyond "let's learn maths happily".

## Scenes (board readable with the sound off | voice)
| Time | Board | Voice (line) |
|---|---|---|
| 0.0–2.0 | Chalk "Xin chào!" is written in yellow with a springy settle; chalk maths signs + − × ÷ = pop in around the board and keep floating | L1 "Xin chào các bạn!" |
| 2.0–3.9 | A pink swoosh underlines the greeting; the signs finish popping in | L2 "Chào mừng đến với kênh" |
| 3.4–5.6 | Wooden tiles are stamped onto the board: HỌC, CÙNG (cream) then PHƯỢNG (mint) | L3 "Học cùng Phượng!" |
| 5.6–6.4 | Hop wave runs along the tiles, yellow swoosh under the name, chalk sparks and a burst | (end of L3) |
| 6.4–8.6 | Chalk "Cùng học toán thật vui nhé!" is written under the name | L4 "Cùng học toán thật vui nhé!" |
| 8.6–10.0 | The felt eraser wipes the whole board clean, so the next clip starts on an empty board | (silence) |

Portrait stacks the name on three rows inside the platform-safe box; landscape puts it on one row.

## Files
- `lessons/2026-10-31/shorts/vi/intro_kenh/`: scene (shared by both formats), voice, timing, 9:16.
- `lessons/2026-10-31/long/vi/intro_kenh_ngang/`: 16:9 wrapper that imports the same scene; same script and the same audio lines.
- Voice engine: Edge TTS (`render/tts_words.py`). `render/voice.mjs` can also use ElevenLabs (`"provider": "elevenlabs"`, key in `ELEVENLABS_API_KEY`).
