// These get bundled as types.d.ts in the final package

export enum QuizType {
	SCORED = "scored",
	PERSONALITY = "personality",
	CUSTOM = "custom",
}

export enum QuizState {
	START = "start",
	QUESTION = "question",
	RESULT = "result",
}

export type AnimationVariants = "mixed" | "slideUp" | "slideLeft" | "scale" | "disabled";

type EvalFunction = (userAnswers: UserAnswer[]) => string | number | null;

export type QuizConfig = {
	evalCustom?: EvalFunction;
	autoResume?: boolean;
	autoResumeDelay?: number;
	revealAnswer?: boolean;
	explainerEnabled?: boolean;
	explainerNewPage?: boolean;
	animation?: AnimationVariants;
	// motionObject?: HTMLMotionProps<"div">;
};

export enum AnswerButtonState {
	// UNSET is an initial value only, once clicked, the button will be set to one of the other values
	// This is to distinguish between the initial state and the state after the user has clicked an answer, for styling purposes
	UNSET = "unset",
	DEFAULT = "default",
	CORRECT = "correct",
	INCORRECT = "incorrect",
	SELECTED = "selected",
}

export type UserAnswer = {
	index: number;
	result: string;
};

export type QuizResultValue = number | string | null;

// Quiz JSON types

export interface QuizData {
	quizTitle: string;
	quizSynopsis: string;
	type: QuizType;
	questions: QuestionData[];
	results?: {
		[key: string]: QuizResult;
	};
}

export interface QuizAnswer {
	answer: string;
	result: string;
}

export interface QuestionData {
	question: string;
	questionType: "text" | "image";
	answers: QuizAnswer[];
	answerSelectionType?: "single" | "multiple";
	questionImage?: string;
	messageForCorrectAnswer?: string;
	messageForIncorrectAnswer?: string;
	explanation?: string;
}

export interface QuizResult {
	description: string;
}
