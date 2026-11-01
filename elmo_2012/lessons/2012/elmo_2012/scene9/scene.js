import { scenes as previous } from '../scene8/scene.js';
import { PROBLEMS, createProblemScenes } from '../problems.js';

export const scenes = createProblemScenes(PROBLEMS[8], previous.answer);
