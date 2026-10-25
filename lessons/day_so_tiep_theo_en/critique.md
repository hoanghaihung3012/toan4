# Verification and critique: What comes next? (English variant of day_so_tiep_theo)

Length 65.47 s, 7 beats, 19 voice lines (en-US-AvaNeural, +6%). Scenes are the Vietnamese lesson's own code
(`lessons/day_so_tiep_theo/scene.js`); only the board text (`TEXT`) and the voiceover differ.

## Loops
| Loop | Result |
|---|---|
| 1. Key-pose match | English key poses against the Vietnamese ones: same layout on all 7 beats, only the 4 text strings differ (`out/keypose_compare.png`). English key poses before vs after the voice-rate change: mean 0.000 on all 7. Vietnamese lesson before vs after the `TEXT` refactor: mean 0.000 on all 7, so the VI output is unchanged. |
| 2. Sound-off read | Fresh subagent read only the 0.5 s sheets. It retold every scene, both methods (doubling jumps → 94; × 2 + 2 → 94) and the challenge (190). Verdict **yes**. It said all text is English and reads naturally. Flags: small "×2" labels, "Way 2" with no "Way 1", faint pink operators. All of these come from the shared (approved) layout. |
| 3. Sync | `synccheck.mjs day_so_tiep_theo_en`: 39 word-anchored windows, 0 off by more than 1 frame. |
| 4. Fact check | Table below; nothing unmatched. |
| 5. Technical (WAV) | 65.467 s, 48 kHz stereo, −15.8 LUFS, true peak −1.5 dBFS. Silences > 1.2 s: 5.3–7.9 thinking dots (intended), 31.0–33.4 end of beat 4 + wipe, 49.0–50.7 wipe, 54.3–58.2 countdown 3-2-1 (intended). MP4 checks run after approval. |
| 6. Director's review | Below. |

## Fact check
| On screen / voice | Source |
|---|---|
| 1, 4, 10, 22, 46; "What comes next?" | F1 (given by the user) |
| jumps 3, 6, 12, 24; "doubled"; 24 × 2 = 48; 46 + 48 = 94 | F2 hoidap247 7460602 |
| "Way 2: × 2 + 2", 1→4, 4→10, 10→22, 22→46, 46→94 | D1 (recomputed, asserted in scene.js) |
| "Your turn!", after 94; 48 × 2 = 96; 94 + 96 = 190 | F3 olm.vn, D2 |
| "Here's a trick…", "Notice anything?", "Comment your answer!", "Two ways, same answer: 94!" | Narration, no new numbers |

## Director's review (brutal)
1. **The TTS merged "48 equals 94" into one word** (no word time for 94, so the answer block could not land on it). Fixed: every result is said with "makes" ("46 plus 48 makes 94"), which keeps each number as its own word; sync 0 off.
2. **English ran 6 s longer than the Vietnamese cut** (68.3 s at +0%). Fixed: rate +6% → 65.5 s; Ava still sounds natural.
3. **Board text has to fit the Vietnamese layout.** Checked each string: "What comes next?" and "Comment your answer!" are shorter than the Vietnamese lines, "Way 2:" fits the title row, "Your turn!" is centred like "Đến lượt bạn!". No overflow.

## Still weak (your call)
- "Way 2" with no "Way 1" (the same as "Cách 2" in the Vietnamese cut). The voice says "another way", so it reads as a second method.
- The small "×2" labels and the countdown 3-2-1 straight into the answer are inherited from the approved Vietnamese layout.

## Final MP4 (`final/what_comes_next.mp4`, after preview approval)
- 65.467 s, 1080×1920 at 30 fps, H.264 + AAC 48 kHz stereo, −15.9 LUFS, true peak −1.5 dBFS.
- The silences are the same as in the WAV (thinking dots, two wipes, the countdown).
- `freezedetect=n=0.001:d=4` flags 10.6–14.7 s and 16.9–26.3 s. In those windows only the small jump arcs, the "+n" labels and the "×2" arcs are drawn, which is below the detector's threshold. The Vietnamese final shows the same two flags (10.6–15.6, 16.7–25.0), so this comes from the shared layout and is not a new dead hold.
