import React, { createContext, useContext, useState } from "react";
import { QuizState, UserAnswer, QuizResult } from "./Quiz";
import { evaluateScore, evaluatePersonality } from "./utility";

type EvalFunction = (userAnswers: UserAnswer[]) => string | number | null;

export enum QuizType {
	SCORED = "scored",
	PERSONALITY = "personality",
	CUSTOM = "custom",
}

export type QuizConfig = {
	evalCustom?: EvalFunction;
	nextButton?: boolean;
};

interface QuizContextProps {
	quizState: QuizState;
	setQuizState: React.Dispatch<React.SetStateAction<QuizState>>;
	currentQuestion: number;
	setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
	userAnswers: Array<UserAnswer>;
	setUserAnswers: React.Dispatch<React.SetStateAction<Array<UserAnswer>>>;
	result: QuizResult;
	setResult: React.Dispatch<React.SetStateAction<QuizResult>>;
	maxQuestions: number;
	quizType: QuizType;
	handleStart: () => void;
	handleAnswer: (userAnswer: UserAnswer) => void;
	currentQuestionData: any;
	quizData: any;
}

const QuizContext = createContext<QuizContextProps>({
	quizState: 0,
	setQuizState: () => {},
	currentQuestion: 0,
	setCurrentQuestion: () => {},
	userAnswers: [],
	setUserAnswers: () => {},
	result: null,
	setResult: () => {},
	maxQuestions: 0,
	quizType: QuizType.SCORED,
	handleStart: () => {},
	handleAnswer: () => {},
	currentQuestionData: null,
	quizData: null,
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
	const [quizState, setQuizState] = useState<QuizState>(QuizState.START);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [userAnswers, setUserAnswers] = useState<Array<UserAnswer>>([]);
	const [result, setResult] = useState<QuizResult>(null);
	const currentQuestionData = quizData.questions[currentQuestion];
	const maxQuestions = quizData.questions.length;
	const quizType: QuizType = quizData.type;
	// console.log("QuizProvider: ", config);

	const { evalCustom, nextButton } = config || {};

	console.log("QuizProvider: ", nextButton);

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
	}

	function handleAnswer(userAnswer: UserAnswer) {
		const updatedUserAnswers = [...userAnswers, userAnswer];

		setUserAnswers(updatedUserAnswers);

		const evalFunctions = {
			[QuizType.SCORED]: evaluateScore,
			[QuizType.PERSONALITY]: evaluatePersonality,
			[QuizType.CUSTOM]: evalCustom,
		};

		if (currentQuestion === maxQuestions - 1) {
			const evalResult = (evalFunctions[quizType] as EvalFunction)(updatedUserAnswers);
			console.log("Your result is: ", evalResult);
			setResult(evalResult);
			setQuizState(QuizState.RESULT);
			return;
		}

		setCurrentQuestion(currentQuestion + 1);
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
				result,
				setResult,
				handleStart,
				handleAnswer,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
};
