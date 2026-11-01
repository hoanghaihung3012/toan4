import { scenes as previous } from '../scene5/scene.js';
import { PROBLEMS, createProblemScenes } from '../problems.js';

export const scenes = createProblemScenes(PROBLEMS[5], previous.answer);
