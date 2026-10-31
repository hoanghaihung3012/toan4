# The garden becomes a square: verification + director's review

Bản tiếng Anh dùng lại cảnh của `vuon_thanh_hinh_vuong`; chỉ chữ trên bảng và lời đọc thay đổi.

## Verification loops
1. **Key-pose match:** VI/EN key poses side by side (`keypose_compare.png`): layout identical, only the text differs. First pass: the label "length" next to the comparison bars (beat 3–4) touched the bar. Fixed with `FIT` (labels 44 px, x 34/44), re-checked at full size. Vietnamese key poses before/after the `TEXT`/`FIT` export: mean 0.000 on all 6 beats.
2. **Sound-off read:** a fresh subagent read the 2 fps sheets with no audio and retold the problem (perimeter 120 m, width +10 / length −10 → square), the steps 120 ÷ 2 = 60, length − width = 10 + 10 = 20, length = (60 + 20) ÷ 2 = 40, width = 20, area 40 × 20 = 800 m², the check 30 = 30, and the 100 m challenge with a 3-2-1 countdown. English board text read naturally.
3. **Sync:** `npm run sync -- vuon_thanh_hinh_vuong_en` → 27 word-anchored windows, 0 off by more than 1 frame. Every line's word list checked in `audio/lines/L*.json`: no merged number boundaries (results are said with "makes").
4. **Fact check:** every English line and board word maps 1:1 to the Vietnamese lesson (table in story.md); numbers 120, 10, 60, 20, 40, 800, 30, 100 come from the source (F1–F3) or the asserted derivations (D1–D6). Nothing new added; the challenge answer (525) is not shown.
5. **Technical:** see the final MP4 section below.
6. **Director's review** (two passes over the sheets):
   - The reader called the "length − width = 10 + 10" step the weakest: the two-headed arrow and the "20 m" label are small. Same staging as the approved Vietnamese clip, kept identical on purpose.
   - "length ?" with "−10 m" right beside it at the top of the garden can read as a value; the red cut strip and the dashed square explain it. Same as the Vietnamese layout.
   - Comparison-bar labels are small at phone size (44 px): the price of the longer English words without moving the bars. Kept.
   - Voice runs 65.0 s vs 59.8 s in Vietnamese (English at +10%, the skill's upper rate); lines were already shortened once from 71 s.

## Final MP4 (`final/2026-10-26/garden_becomes_a_square.mp4`)
- Duration 65.000 s (= timing.json), 1080×1920 @ 30 fps, AAC 48 kHz **stereo**, true peak **−1.5 dBFS** (< −1).
- Silences > 1.5 s: 11.2–15.0 s (thinking dots after the question + eraser wipe), 39.5–41.2 s and 50.5–52.1 s (eraser wipes between beats), 62.0–65.0 s (3-2-1 countdown). All intended, no dead air.
- `freezedetect` flags 35.4–39.9 s: the only change there is the small chalk line "width = 60 − 40 = 20 m" being written with its burst (checked on frames 35.5 / 37.5 / 39.5 s). Same small-cue case as the Vietnamese clip.
