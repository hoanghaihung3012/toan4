# Verification and critique: Divisibility rules (English variant of dau_hieu_chia_het)

Length 73.53 s (Vietnamese 72.37 s), 9 beats, 20 voice lines (en-US-AvaNeural, +10%). Scenes are the Vietnamese lesson's own code
(`lessons/dau_hieu_chia_het/scene.js`); only the board text (`TEXT`) and the voiceover differ.

## Loops
| Loop | Result |
|---|---|
| 1. Key-pose match | Vietnamese lesson before vs after the `TEXT` refactor: mean 0.000 on all 9 beats, so the VI output is unchanged (its voice.json, timing and audio are untouched). English key poses vs Vietnamese: same layout on all 9 beats, only the 7 text strings differ (VI/EN strip). English key poses before vs after the director fixes: mean 0.000 on all 9 (only timing moved). |
| 2. Sound-off read | Fresh subagent read only the 0.5 s sheets. It retold all 9 scenes and every result (98 ✓, 1995 ✗, 4005 ✓, 2021 ✗, 660 ✓, 3015 sum 9 ✓, 906 sum 15 ✗ for 9 / ✓ for 3, quiz 660: 2 ✓ 5 ✓ 9 ✗ 3 ✓, sum 12). Verdict **yes**; English is "short and natural". Flags: the 0 2 4 6 8 row stays under "divisible by 5"; the 9 → 3 switch is the weakest step; the countdown "3" could be read as the divisor 3; small labels. All come from the shared (approved) Vietnamese layout. |
| 3. Sync | `synccheck.mjs dau_hieu_chia_het_en`: 45 word-anchored windows, 0 off by more than 1 frame. Every TTS line keeps each number as its own word (checked in `audio/lines/L*.json`); results said with "makes". |
| 4. Fact check | Table below; nothing unmatched. |
| 5. Technical (WAV) | 73.533 s, 48 kHz stereo, −16.0 LUFS, true peak −1.5 dBFS. Silences > 1.2 s: 4.9–6.4 (3015 parks + erase), 9.4–10.9 / 20.2–21.7 / 28.9–30.6 / 34.4–35.9 / 54.9–56.4 (eraser wipes), 61.1–65.0 (countdown 3-2-1, intended). MP4 checks run after approval. |
| 6. Director's review | Below. |

## Fact check
| On screen / voice | Source (lessons/dau_hieu_chia_het/story.md) |
|---|---|
| "Is 3015 divisible by 9?", 3015, "divisible by 9", "?" | question; answered by D1 |
| "Divisibility rules", 2 5 9 3, "last digit", "add digits" | F1, F3, F5, F6 |
| "0, 2, 4, 6, 8 works", 98 ✓ "even", 1995 ✗ "odd" | F1, F2 |
| "The last digit is 0 or 5", 4005 ✓, 2021 ✗ | F3 |
| "Both 2 and 5? It ends in 0, like 660" | F4 |
| "3 plus 0 plus 1 plus 5 makes 9. Divisible by 9!" | D1 (3015 = 9 × 335) |
| "906: digit sum 15, not divisible by 9" | F5 |
| "15 is divisible by 3, so 906 is divisible by 3" | F6, D2 (906 = 3 × 302) |
| Quiz 660: 2 ✓ 5 ✓ (ends in 0), 6 + 6 + 0 = 12 → 3 ✓, 9 ✗ | D3 (asserted in scene.js) |
| "No need to divide. There's a trick!", "Your turn", "Comment your answer!" | Narration, no new numbers |

## Director's review (brutal)
1. **Dead hold in the answer** (65.5–68.3 s): the 0 was circled on "Answer", but the 2/5 ticks waited for the word "2"; English "so it's divisible by" is longer than "nên chia hết cho". Fixed: ticks start on "divisible" (hold now ~1.8 s).
2. **Hold before the 906 tick for 3** (51.3–53.0 s). Fixed: tick on "so" instead of "906".
3. **Pause after the rule rows** (14.5–16.3 s and the 5-row): the gap before "98" / "4005" cut 0.5 → 0.3 s.
- English ran 76 s at +6%; raised to +10% → 73.5 s (Ava still natural).
- Board text fits: "divisible by" is as wide as "chia hết cho"; "last digit / add digits" are shorter than the Vietnamese pair, which removes the crowding in beat 2.

## Still weak (your call, inherited from the Vietnamese layout)
- The yellow 0 2 4 6 8 row stays on screen under "divisible by 5".
- The 9 → 3 switch only changes the title digit; 3015's ticks stay without being tied to 3.
- The countdown "3" can be confused with the divisor 3.

## Final MP4 (`final/divisibility_rules.mp4`, after preview approval)
- 73.533 s, 1080×1920 at 30 fps, H.264 + AAC 48 kHz stereo, −16.0 LUFS, true peak −1.5 dBFS.
- The silences are the same as in the WAV (parking, wipes, the countdown).
- `freezedetect=n=0.001:d=4` flags 50.0–55.2 s (beat 7, "15 is divisible by 3, so 906 is divisible by 3!"). In that window only the title digit 9 → 3, the small circle around 15 and the tick are drawn, which is below the detector's threshold. It is the same staging as the Vietnamese beat 7, so it counts as a weak spot of the shared layout, not a new dead hold.
