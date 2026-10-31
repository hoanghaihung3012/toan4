import { scenes as solution } from './review_frame.js';
import { question, createQuestionScene } from './problem_scene.js';
import { problems } from './problems.js';
import { boards } from './boards.js';
import { createBoardScenes } from './board_scene.js';

export const scenes = { question, ...solution,
	rooms_question: createQuestionScene(problems[1]), teams_question: createQuestionScene(problems[2]),
	...createBoardScenes(boards),
};