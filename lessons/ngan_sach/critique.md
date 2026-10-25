# Director's review: Hai ngăn sách

Watched twice as 2 fps contact sheets (out/sheet0–4) and the five key poses.

## Pass 1: brutal critique
1. **The key condition was ambiguous.** A fresh sound-off viewer read the small "hơn 8" tag as "shelf 2 has 8 more". The tag sat on a thin bracket at the corner of shelf 1, and nothing marked which 8 books were the extra ones.
2. **The "+8" step was not motivated.** The ghost books were faint chalk outlines, and nothing on the board said why we add 8 to 160. The "= nhau" tag was cramped against the frame.
3. **Labels too small, and the bottom third was empty.** The first build used a short bookcase (books ~130 px) and 64–66 px labels. The 15 books that go back in beat 3 were not marked before they moved, which left a 2 s hold while the voice talked.
4. Minor: the challenge countdown sat on top of "Bình luận đáp án nhé!", and in beat 3 the shelf label switched to 99 before the equation finished.

## Fixes applied
1. The 8 extra books on shelf 1 now get a yellow box and a bigger "hơn 8" (80 px). Beat 1 adds the line "Sau khi chuyển 15: ngăn 1 hơn 8".
2. The ghost books are filled yellow, with a larger "+8" and the line "Thêm 8: hai ngăn bằng nhau" before 160 + 8 = 168.
3. The bookcase is taller (books 168–204 px, shelves at y 720/1060), the labels are 72–84 px, and the equations moved down to use the board. In beat 3, the 15 books are boxed with a "15" tag the moment the voice says "Lúc đầu", then they fly back. The countdown moved beside "Lúc đầu", and shelf 1 reads 99 only after 84 + 15 = 99 is written.

## Pass 2
A fresh sound-off viewer retold the whole lesson correctly:
- Total 160. 15 books move from shelf 1 to shelf 2. After that, shelf 1 still has 8 more.
- Add 8 to make the shelves equal: 168 : 2 = 84.
- 84 + 15 = 99.
- Check: 160 − 99 = 61 and 84 − 76 = 8 ✓.
- The challenge ends with a countdown.

Verdict: yes. The remaining notes were "small text on a downscaled sheet" (on a phone the labels are 72–92 px at 1080 width) and some empty board below the equations.

## Still weak (your call)
- Each book is drawn 1:1 (99 thin spines), so a single book is very thin. The rows read as "a lot of books" and the lengths are true to scale.
- The challenge uses practice numbers (120, 10, 6) that are not from the Sheet. The answer (73) is checked in code and not shown.

## Verification
- **Key poses:** 5/5 rendered after the fixes and kept as the reference (out/keyposes_strip.png).
- **Sync:** 20 word-anchored windows, 0 off by more than 1 frame.
- **Facts:** every number is in story.md (F1, D1–D5) and asserted in scene.js.
- **Audio:** 69.400 s, 48 kHz stereo, true peak −3.5 dBFS. Silences over 1.2 s are the thinking pause (11.1–14.6 s), the three eraser wipes and the end countdown.
npm test: 15 pass, 0 fail.

## Final MP4 (final/ngan_sach.mp4, after approval)
- 1080×1920, 30 fps, 69.400 s; AAC stereo 48 kHz; true peak −3.5 dBFS.
- freezedetect (n=0.001, d=4): one near-hold at 25.3–30.2 s, where "168 : 2 = 84" stands while the voice says "Sau khi chuyển, ngăn thứ nhất có 84 cuốn". Only the circle around 84 and the shelf label "84" change there. Kept: it is your call whether to add more motion.
