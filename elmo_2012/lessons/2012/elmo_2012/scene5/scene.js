import { scenes as previous } from '../scene4/scene.js';
import { PROBLEMS, createProblemScenes } from '../problems.js';

export const scenes = createProblemScenes(PROBLEMS[4], previous.answer);
