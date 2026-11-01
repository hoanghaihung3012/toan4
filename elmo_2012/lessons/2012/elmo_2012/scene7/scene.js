import { scenes as previous } from '../scene6/scene.js';
import { PROBLEMS, createProblemScenes } from '../problems.js';

export const scenes = createProblemScenes(PROBLEMS[6], previous.answer);
