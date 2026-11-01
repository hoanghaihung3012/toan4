import { scenes as previous } from '../scene7/scene.js';
import { PROBLEMS, createProblemScenes } from '../problems.js';

export const scenes = createProblemScenes(PROBLEMS[7], previous.answer);
