import { scenes as previous } from '../scene2/scene.js';
import { PROBLEMS, createProblemScenes } from '../problems.js';

export const scenes = createProblemScenes(PROBLEMS[2], previous.answer);
