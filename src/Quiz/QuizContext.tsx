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

export type AnimationVariants = "slide" | "scale" | "custom";

export type QuizConfig = {
	evalCustom?: EvalFunction;
	nextButton?: boolean;
	revealAnswer?: boolean;
	showAnswerExplainer?: boolean;
	answerExplainerOnNewPage?: boolean;
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

export const btnColors = {
	[AnswerButtonState.UNSET]: "#222",
	[AnswerButtonState.DEFAULT]: "#222",
	[AnswerButtonState.SELECTED]: "blue",
	[AnswerButtonState.CORRECT]: "green",
	[AnswerButtonState.INCORRECT]: "red",
};

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
	handleStart: () => void;
	handleAnswer: (userAnswer: UserAnswer) => void;
	handleAnswerBtnClick: (index: number) => void;
	// The below type needs to be updated to hold attributes for HTML elements through passing a generic type
	answerBtnRequiredProps: Record<string, string | boolean | Record<string, any>> | EmptyObject;
	handleQuestionNextBtnClick: () => void;
	questionNextBtnRequiredProps: Record<string, string | boolean | Record<string, any>> | EmptyObject;
	currentQuestionData: any;
	quizData: any;
	config?: QuizConfig;
	answerButtonState: AnswerButtonState[];
	setAnswerButtonState: React.Dispatch<React.SetStateAction<AnswerButtonState[]>>;
	explainerVisible: boolean;
	setExplainerVisible: React.Dispatch<React.SetStateAction<boolean>>;
	explainerClosed: boolean;
	setExplainerClosed: React.Dispatch<React.SetStateAction<boolean>>;
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
	handleStart: () => {},
	handleAnswer: () => {},
	handleAnswerBtnClick: () => {},
	answerBtnRequiredProps: {},
	handleQuestionNextBtnClick: () => {},
	questionNextBtnRequiredProps: {},
	currentQuestionData: null,
	quizData: null,
	config: {},
	answerButtonState: [],
	setAnswerButtonState: () => {},
	explainerVisible: false,
	setExplainerVisible: () => {},
	explainerClosed: false,
	setExplainerClosed: () => {},
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
	// explainerClosed is used ot distinguish between the explainer not yet having been opened and the explainer already been closed,
	// which is needed to decide whether to show the Next button for the question
	const [explainerClosed, setExplainerClosed] = useState(false);
	const currentQuestionData = quizData.questions[currentQuestion];
	const maxQuestions = quizData.questions.length;
	const quizType: QuizType = quizData.type;
	const progress = Math.round((100 / maxQuestions) * (currentQuestion + 1));
	// console.log("QuizProvider: ", config);

	// config.animation = config?.animation || "scale"; // Provide config default
	config.answerExplainerOnNewPage = config?.answerExplainerOnNewPage || false;

	const {
		evalCustom,
		nextButton,
		animation,
		motionObject,
		revealAnswer,
		showAnswerExplainer,
		answerExplainerOnNewPage,
	} = config || {};

	const showCorrectAnswer = quizType === QuizType.SCORED && revealAnswer === true;
	const answerBtnStateIsSet = currentAnswer !== undefined;
	const isAnswerBtnDisabled = answerBtnStateIsSet && (showCorrectAnswer || explainerVisible);
	const answerBtnRequiredProps = {
		disabled: isAnswerBtnDisabled,
	};
	const questionNextBtnRequiredProps = {
		disabled: currentAnswer === undefined,
		style: { visibility: explainerVisible || explainerClosed ? "hidden" : "visible" },
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

	if (animation === "custom" && !motionObject) {
		throw new Error(
			"You selected a custom animation but did not provide a motion object. Please add a motionObject property to the config object."
		);
	}

	if (answerExplainerOnNewPage && !showAnswerExplainer) {
		throw new Error(
			"You set answerExplainerOnNewPage to true but showAnswerExplainer is false. Please set showAnswerExplainer to true to display it."
		);
	}

	function handleStart() {
		setQuizState(QuizState.QUESTION);
		setCurrentQuestion(0);
		setUserAnswers([]);
		setCurrentAnswer(undefined);
		setAnswerButtonState(initialAnswerButtonState);
		setResult(null);
		setExplainerClosed(false);
	}

	function handleAnswerBtnClick(index: number) {
		const answers = quizData.questions[currentQuestion].answers;
		const theAnswer = { index: index, result: answers[index].result };
		const answerButtonsUpdatedState = getAnswerBtnsNewState(index, answers, theAnswer, showCorrectAnswer);
		setCurrentAnswer(theAnswer);
		setAnswerButtonState(answerButtonsUpdatedState);
		// Only handle the answer if we're not using a next button and not showing the explainer.
		// Otherwise the answer will be handled by the next button
		if (!nextButton && !showAnswerExplainer) {
			handleAnswer(theAnswer);
		}
		if (showAnswerExplainer && !explainerVisible && !nextButton) {
			const delay = answerExplainerOnNewPage ? 1500 : 0;
			setTimeout(() => setExplainerVisible(true), delay);
		}
	}

	function handleQuestionNextBtnClick() {
		if (currentAnswer) {
			if (showAnswerExplainer && !explainerVisible) {
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

		const delay =
			// revealAnswer && ((showAnswerExplainer && !explainerVisible) || (!showAnswerExplainer && !nextButton)) ? 1500 : 0;
			!showAnswerExplainer && !nextButton ? 1500 : 0;

		if (currentQuestion === maxQuestions - 1) {
			setTimeout(() => endQuiz(updatedUserAnswers), delay);
			return;
		}

		setTimeout(() => setUpNextQuestion(), delay);
	}

	function setUpNextQuestion() {
		const nextQuestion = currentQuestion + 1;
		setCurrentQuestion(nextQuestion);
		setCurrentAnswer(undefined);
		setExplainerClosed(false);
		const initialAnswerButtonState = Array(quizData.questions[nextQuestion].answers.length).fill(
			AnswerButtonState.UNSET
		);
		setAnswerButtonState(initialAnswerButtonState);
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
				handleStart,
				handleAnswer,
				handleAnswerBtnClick,
				answerBtnRequiredProps,
				handleQuestionNextBtnClick,
				questionNextBtnRequiredProps,
				config,
				answerButtonState,
				setAnswerButtonState,
				explainerVisible,
				setExplainerVisible,
				explainerClosed,
				setExplainerClosed,
				progress,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
};
