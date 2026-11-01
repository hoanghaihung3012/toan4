import { scenes as previous } from '../scene9/scene.js';
import { PROBLEMS, createProblemScenes } from '../problems.js';

export const scenes = createProblemScenes(PROBLEMS[9], previous.answer);
