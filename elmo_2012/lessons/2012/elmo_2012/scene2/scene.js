import { scenes as previous } from '../scene1/scene.js';
import { PROBLEMS, createProblemScenes } from '../problems.js';

export const scenes = createProblemScenes(PROBLEMS[1], previous.answer);
