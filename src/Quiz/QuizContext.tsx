import React, { createContext, useContext, useState } from "react";
import { UserAnswer, QuizResult } from "./Quiz";
import { evaluateScore, evaluatePersonality } from "./utility";

type EvalFunction = (userAnswers: UserAnswer[]) => string | number | null;

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

export type QuizConfig = {
	evalCustom?: EvalFunction;
	nextButton?: boolean;
	revealAnswer?: boolean;
	showAnswerExplainer?: boolean;
};

export enum AnswerButtonState {
	// UNSET is an initial value only, once clicked, the button will be set to one of the other values
	// This is to distinguish between the initial state and the state after the user has clicked an answer
	UNSET = "unset",
	DEFAULT = "default",
	CORRECT = "correct",
	INCORRECT = "incorrect",
	SELECTED = "selected",
}

interface QuizContextProps {
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
	currentQuestionData: any;
	quizData: any;
	config?: QuizConfig;
	answerButtonState: AnswerButtonState[];
	setAnswerButtonState: React.Dispatch<React.SetStateAction<AnswerButtonState[]>>;
	showExplainer: boolean;
	setShowExplainer: React.Dispatch<React.SetStateAction<boolean>>;
}

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
	currentQuestionData: null,
	quizData: null,
	config: {},
	answerButtonState: [],
	setAnswerButtonState: () => {},
	showExplainer: false,
	setShowExplainer: () => {},
});

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider = ({
	children,
	quizData,
	config,
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
	const [showExplainer, setShowExplainer] = useState(false);
	const currentQuestionData = quizData.questions[currentQuestion];
	const maxQuestions = quizData.questions.length;
	const quizType: QuizType = quizData.type;
	// console.log("QuizProvider: ", config);

	const { evalCustom, nextButton, revealAnswer } = config || {};

	// console.log("QuizProvider: ", nextButton);

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

	function handleStart() {
		// console.log("handleStart: ", quizState);
		setQuizState(QuizState.QUESTION);
		setCurrentQuestion(0);
		setUserAnswers([]);
		setCurrentAnswer(undefined);
		setAnswerButtonState(initialAnswerButtonState);
	}

	function handleAnswer(userAnswer: UserAnswer) {
		const updatedUserAnswers = [...userAnswers, userAnswer];

		setUserAnswers(updatedUserAnswers);

		if (config?.showAnswerExplainer && !showExplainer) {
			setShowExplainer(true);
			return;
		} else {
			setShowExplainer(false);
		}

		if (currentQuestion === maxQuestions - 1) {
			endQuiz(updatedUserAnswers);
			return;
		}

		const delay = revealAnswer ? 300 : 150;

		setTimeout(() => {
			console.log("------ Set Next question ------");
			setUpNextQuestion();
		}, delay);
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

	function showAnswerExplainer() {
		setShowExplainer(true);
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
				config,
				answerButtonState,
				setAnswerButtonState,
				showExplainer,
				setShowExplainer,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
};
