import { scenes as previous } from '../scene3/scene.js';
import { PROBLEMS, createProblemScenes } from '../problems.js';

export const scenes = createProblemScenes(PROBLEMS[3], previous.answer);
