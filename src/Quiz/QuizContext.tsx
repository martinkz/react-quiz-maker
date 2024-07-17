import React, { createContext, useContext, useState } from "react";
import { evaluateScore, evaluatePersonality, getAnswerBtnsNewState } from "./utility";
import { HTMLMotionProps } from "framer-motion";

type EvalFunction = (userAnswers: UserAnswer[]) => string | number | null;

type EmptyObject = Record<string, never>;

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

export type AnimationVariants = "slideUp" | "slideLeft" | "scale" | "disabled";

export type QuizConfig = {
	evalCustom?: EvalFunction;
	autoResume?: boolean;
	autoResumeDelay?: number;
	revealAnswer?: boolean;
	explainerEnabled?: boolean;
	explainerNewPage?: boolean;
	animation?: AnimationVariants;
	motionObject?: HTMLMotionProps<"div">;
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

export type QuizResult = number | string | null;

export interface QuizContextProps {
	quizState: QuizState;
	setQuizState: React.Dispatch<React.SetStateAction<QuizState>>;
	currentQuestion: number;
	setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
	userAnswers: Array<UserAnswer>;
	setUserAnswers: React.Dispatch<React.SetStateAction<Array<UserAnswer>>>;
	currentAnswer: UserAnswer | undefined;
	setCurrentAnswer: React.Dispatch<React.SetStateAction<UserAnswer | undefined>>;
	result: QuizResult;
	setResult: React.Dispatch<React.SetStateAction<QuizResult>>;
	maxQuestions: number;
	quizType: QuizType;
	handleAnswer: (userAnswer: UserAnswer) => void;
	handleAnswerBtnClick: (index: number) => void;
	// The below type needs to be updated to hold attributes for HTML elements through passing a generic type
	answerBtnRequiredProps: Record<string, string | boolean | Record<string, any>> | EmptyObject;
	handleQuestionNextBtnClick: () => void;
	questionNextBtnRequiredProps: Record<string, string | boolean | Record<string, any>> | EmptyObject;
	handleExplainerNextBtnClick: () => void;
	handleStartBtnClick: () => void;
	currentQuestionData: any;
	quizData: any;
	config?: QuizConfig;
	answerButtonState: AnswerButtonState[];
	setAnswerButtonState: React.Dispatch<React.SetStateAction<AnswerButtonState[]>>;
	explainerVisible: boolean;
	setExplainerVisible: React.Dispatch<React.SetStateAction<boolean>>;
	progress: number;
}

// export type OptionalContextProps = Partial<QuizContextProps>;

const QuizContext = createContext<QuizContextProps>({
	quizState: QuizState.START,
	setQuizState: () => {},
	currentQuestion: 0,
	setCurrentQuestion: () => {},
	userAnswers: [],
	setUserAnswers: () => {},
	currentAnswer: undefined,
	setCurrentAnswer: () => {},
	result: null,
	setResult: () => {},
	maxQuestions: 0,
	quizType: QuizType.SCORED,
	handleAnswer: () => {},
	handleAnswerBtnClick: () => {},
	answerBtnRequiredProps: {},
	handleQuestionNextBtnClick: () => {},
	questionNextBtnRequiredProps: {},
	handleExplainerNextBtnClick: () => {},
	handleStartBtnClick: () => {},
	currentQuestionData: null,
	quizData: null,
	config: {},
	answerButtonState: [],
	setAnswerButtonState: () => {},
	explainerVisible: false,
	setExplainerVisible: () => {},
	progress: 0,
});

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider = ({
	children,
	quizData,
	config = {},
}: {
	children: React.ReactNode;
	quizData: any;
	config?: QuizConfig;
}) => {
	const initialAnswerButtonState = Array(quizData.questions[0].answers.length).fill(AnswerButtonState.UNSET);
	const [quizState, setQuizState] = useState<QuizState>(QuizState.START);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [userAnswers, setUserAnswers] = useState<Array<UserAnswer>>([]);
	const [result, setResult] = useState<QuizResult>(null);
	// currentAnswer is used to store the user's current answer when the next button setting is on. We need to store it as the user can change their answer before the press Next
	const [currentAnswer, setCurrentAnswer] = useState<UserAnswer | undefined>(undefined);
	const [answerButtonState, setAnswerButtonState] = useState<AnswerButtonState[]>(initialAnswerButtonState);
	const [explainerVisible, setExplainerVisible] = useState(false);
	const currentQuestionData = quizData.questions[currentQuestion];
	const maxQuestions = quizData.questions.length;
	const quizType: QuizType = quizData.type;
	const progress = Math.round((100 / maxQuestions) * (currentQuestion + 1));
	// console.log("QuizProvider: ", config);

	// config.animation = config?.animation || "scale"; // Provide config default
	config.explainerNewPage = config?.explainerNewPage || false;

	const {
		evalCustom,
		autoResume,
		autoResumeDelay = 1000,
		animation,
		motionObject,
		revealAnswer,
		explainerEnabled,
		explainerNewPage,
	} = config || {};

	const showCorrectAnswer = quizType === QuizType.SCORED && revealAnswer === true;
	const isAnswerBtnStateSet = currentAnswer !== undefined;
	const isAnswerBtnDisabled = isAnswerBtnStateSet && (showCorrectAnswer || explainerVisible);
	const answerBtnRequiredProps = {
		disabled: isAnswerBtnDisabled,
	};
	const questionNextBtnRequiredProps = {
		disabled: currentAnswer === undefined,
		// style: { visibility: explainerVisible || explainerClosed ? "hidden" : "visible" },
		style: { visibility: explainerVisible ? "hidden" : "visible" },
	};

	if (!Object.values(QuizType).includes(quizType)) {
		throw new Error(`Invalid quiz type: ${quizType}. Please provide a valid quiz type.`);
	}

	if (evalCustom === undefined && quizType === QuizType.CUSTOM) {
		throw new Error(
			"Quiz type set as type 'custom' but no custom evaluation function was provided. Please provide a custom evaluation function parameter."
		);
	}
	if (evalCustom !== undefined && quizType !== QuizType.CUSTOM) {
		throw new Error(
			`You provided a custom evaluation function parameter, but your quiz is of type ${quizType}. Please set the quiz type to 'custom' if you'd like to use a custom evaluator.}`
		);
	}

	// if (animation === "custom" && !motionObject) {
	// 	throw new Error(
	// 		"You selected a custom animation but did not provide a motion object. Please add a motionObject property to the config object."
	// 	);
	// }

	if (explainerNewPage && !explainerEnabled) {
		throw new Error(
			"You set explainerNewPage to true but explainerEnabled is false. Please set explainerEnabled to true to display it."
		);
	}

	function handleStartBtnClick() {
		setQuizState(QuizState.QUESTION);
		setCurrentQuestion(0);
		setUserAnswers([]);
		setCurrentAnswer(undefined);
		setAnswerButtonState(initialAnswerButtonState);
		setResult(null);
	}

	function handleAnswerBtnClick(index: number) {
		const answers = quizData.questions[currentQuestion].answers;
		const theAnswer = { index: index, result: answers[index].result };
		const answerButtonsUpdatedState = getAnswerBtnsNewState(index, answers, theAnswer, showCorrectAnswer);
		setCurrentAnswer(theAnswer);
		setAnswerButtonState(answerButtonsUpdatedState);
		// Only handle the answer if we're not using a next button and not showing the explainer.
		// Otherwise the answer will be handled by the next button
		if (autoResume && !explainerEnabled) {
			handleAnswer(theAnswer);
		}
		if (explainerEnabled && !explainerVisible && autoResume) {
			if (explainerNewPage) {
				setTimeout(() => setExplainerVisible(true), autoResumeDelay);
			} else {
				setExplainerVisible(true);
			}
		}
	}

	function handleQuestionNextBtnClick() {
		if (currentAnswer) {
			if (explainerEnabled && !explainerVisible) {
				setExplainerVisible(true);
			} else {
				handleAnswer(currentAnswer);
				setExplainerVisible(false);
			}
		}
	}

	function handleAnswer(userAnswer: UserAnswer) {
		const updatedUserAnswers = [...userAnswers, userAnswer];
		setUserAnswers(updatedUserAnswers);

		const hasDelay = !explainerEnabled && autoResume;
		// revealAnswer && ((explainerEnabled && !explainerVisible) || (!explainerEnabled && autoResume))

		if (currentQuestion === maxQuestions - 1) {
			if (hasDelay) {
				setTimeout(() => endQuiz(updatedUserAnswers), autoResumeDelay);
			} else {
				endQuiz(updatedUserAnswers);
			}
			return;
		}

		if (hasDelay) {
			setTimeout(() => setUpNextQuestion(), autoResumeDelay);
		} else {
			setUpNextQuestion();
		}
	}

	function setUpNextQuestion() {
		const nextQuestion = currentQuestion + 1;
		setCurrentQuestion(nextQuestion);
		setCurrentAnswer(undefined);
		const initialAnswerButtonState = Array(quizData.questions[nextQuestion].answers.length).fill(
			AnswerButtonState.UNSET
		);
		setAnswerButtonState(initialAnswerButtonState);
	}

	function handleExplainerNextBtnClick() {
		handleAnswer(currentAnswer!);
		setExplainerVisible(false);
	}

	function endQuiz(userAnswers: UserAnswer[]) {
		const evalFunctions = {
			[QuizType.SCORED]: evaluateScore,
			[QuizType.PERSONALITY]: evaluatePersonality,
			[QuizType.CUSTOM]: evalCustom,
		};
		const evalResult = (evalFunctions[quizType] as EvalFunction)(userAnswers);
		console.log("Your result is: ", evalResult);
		setResult(evalResult);
		setQuizState(QuizState.RESULT);
	}

	return (
		<QuizContext.Provider
			value={{
				quizData,
				quizState,
				quizType,
				setQuizState,
				currentQuestion,
				setCurrentQuestion,
				currentQuestionData,
				maxQuestions,
				userAnswers,
				setUserAnswers,
				currentAnswer,
				setCurrentAnswer,
				result,
				setResult,
				handleAnswer,
				handleAnswerBtnClick,
				answerBtnRequiredProps,
				handleQuestionNextBtnClick,
				questionNextBtnRequiredProps,
				handleExplainerNextBtnClick,
				handleStartBtnClick,
				config,
				answerButtonState,
				setAnswerButtonState,
				explainerVisible,
				setExplainerVisible,
				progress,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
};
