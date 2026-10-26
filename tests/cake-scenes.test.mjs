import assert from 'node:assert/strict';
import test from 'node:test';
import { openPlayer } from '../render/browser.mjs';
import { lessonDir } from '../render/paths.mjs';

test('two cake chapter instances keep text and layout isolated in the same page', async () => {
  const player = await openPlayer({ lesson: 'ai_an_banh' });
  try {
    const result = await player.page.evaluate(async (dir) => {
      const { createScenes, scenes: vietnamese } = await import(`/${dir}/scene.js`);
      const { ChalkLayer, resetIds } = await import('/shared/web/js/chalk.js');
      const { composeChapters } = await import('/shared/composition/chapters.js');
      const text = { title: 'First chapter', kids: ['An', 'Bao', 'Chi', 'Dung'] };
      const layout = { ansX: 300 };
      const first = createScenes({ text, layout });
      text.title = 'Changed outside';
      text.kids[0] = 'Changed outside';
      layout.ansX = 900;
      const second = createScenes({ text: { title: 'Second chapter' }, layout: { ansX: 600 } });
      const render = (scene) => {
        resetIds();
        const root = document.createElement('div');
        scene({
          fx: document.createElement('div'),
          chalk: (strength) => new ChalkLayer(root, strength),
          objects: () => {
            const objects = document.createElement('div');
            root.appendChild(objects);
            return objects;
          },
        }, {});
        return { html: root.innerHTML, text: root.textContent };
      };
      const before = render(first.beat1);
      const composition = composeChapters([
        { id: 'first', timing: window.timing, scenes: first },
        { id: 'second', timing: window.timing, scenes: second },
      ], { audio: './audio/voice.wav' });
      const other = render(composition.scenes['second.beat1']);
      const after = render(composition.scenes['first.beat1']);
      const defaults = render(vietnamese.beat1);
      return { before, after, other, defaults, beats: composition.timing.beats.map((beat) => beat.id) };
    }, lessonDir('ai_an_banh'));
    assert.deepEqual(result.before, result.after);
    assert.match(result.before.text, /First chapter/);
    assert.doesNotMatch(result.before.text, /Changed outside|Second chapter/);
    assert.match(result.other.text, /Second chapter/);
    assert.match(result.defaults.text, /Ai đã ăn bánh/);
    assert.equal(result.beats.length, 10);
    assert.equal(result.beats[5], 'second.beat1');
  } finally {
    await player.close();
  }
});