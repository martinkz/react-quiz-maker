import { useState, useRef } from "react";
import { evaluateScore, evaluatePersonality, getAnswerBtnsNewState, createTimeout } from "./utility";
// import { type HTMLMotionProps } from "framer-motion";
import {
	QuizData,
	QuestionData,
	QuizType,
	QuizState,
	AnimationVariants,
	QuizConfig,
	QuizResultValue,
	AnswerButtonState,
	UserAnswer,
} from "./types";

type EmptyObject = Record<string, never>;

export interface Question extends QuestionData {
	index: number;
}

export interface QuizStateProps {
	quizState: QuizState;
	currentQuestion: Question;
	currentAnswer: UserAnswer | undefined;
	result: QuizResultValue;
	maxQuestions: number;
	quizType: QuizType;
	handleAnswerBtnClick: (index: number) => void;
	// The below type needs to be updated to hold attributes for HTML elements through passing a generic type
	answerBtnRequiredProps: Record<string, string | boolean | Record<string, any>> | EmptyObject;
	handleQuestionNextBtnClick: () => void;
	questionNextBtnRequiredProps: Record<string, string | boolean | Record<string, any>> | EmptyObject;
	handleExplainerNextBtnClick: () => void;
	handleStartBtnClick: () => void;
	quizData: QuizData;
	config?: QuizConfig;
	answerButtonState: AnswerButtonState[];
	explainerVisible: boolean;
	progress: number;
}

export const useQuiz = (data: QuizData, config: QuizConfig) => {
	const quizData = data;
	const initialAnswerButtonState = Array(quizData.questions[0].answers.length).fill(AnswerButtonState.UNSET);
	const [quizState, setQuizState] = useState<QuizState>(QuizState.START);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [userAnswers, setUserAnswers] = useState<Array<UserAnswer>>([]);
	const [result, setResult] = useState<QuizResultValue>(null);
	// currentAnswer is used to store the user's current answer when the autoResume setting is off. We need to store it as the user can change their answer before the press Next
	const [currentAnswer, setCurrentAnswer] = useState<UserAnswer | undefined>(undefined);
	const [answerButtonState, setAnswerButtonState] = useState<AnswerButtonState[]>(initialAnswerButtonState);
	const [explainerVisible, setExplainerVisible] = useState(false);
	const timersRef = useRef<Record<string, any>>({});

	const currentQuestion = {
		...quizData.questions[currentQuestionIndex],
		index: currentQuestionIndex + 1,
	};
	const maxQuestions = quizData.questions.length;
	const quizType: QuizType = quizData.type;
	const progress = Math.round((100 / maxQuestions) * (currentQuestionIndex + 1));

	// config.animation = config?.animation || "scale"; // Provide config default
	// config.explainerNewPage = config?.explainerNewPage || false;

	const {
		evalCustom,
		autoResume,
		autoResumeDelay = 1000,
		animation,
		// motionObject,
		revealAnswer,
		explainerEnabled,
		explainerNewPage = false,
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
		setCurrentQuestionIndex(0);
		setUserAnswers([]);
		setCurrentAnswer(undefined);
		setAnswerButtonState(initialAnswerButtonState);
		setResult(null);
	}

	function handleAnswerBtnClick(index: number) {
		const answers = quizData.questions[currentQuestionIndex].answers;
		const theAnswer = { index: index, result: answers[index].result };
		const answerButtonsUpdatedState = getAnswerBtnsNewState(index, answers, theAnswer, showCorrectAnswer);
		setCurrentAnswer(theAnswer);
		setAnswerButtonState(answerButtonsUpdatedState);
		// Only handle the answer if we're not using a next button and not showing the explainer.
		// Otherwise the answer will be handled by the next button
		if (autoResume && !explainerEnabled) {
			processAnswer(theAnswer);
		}
		if (explainerEnabled && !explainerVisible && autoResume) {
			if (explainerNewPage) {
				// setTaskQueue((prevTasks) => [...prevTasks, { setExplainerVisibleTask: 1 }]);
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
				processAnswer(currentAnswer);
				setExplainerVisible(false);
			}
		}
	}

	function handleExplainerNextBtnClick() {
		processAnswer(currentAnswer!);
		setExplainerVisible(false);
	}

	function processAnswer(userAnswer: UserAnswer) {
		const updatedUserAnswers = [...userAnswers];
		updatedUserAnswers[currentQuestionIndex] = userAnswer;
		setUserAnswers(updatedUserAnswers);

		const hasDelay = !explainerEnabled && autoResume;
		// revealAnswer && ((explainerEnabled && !explainerVisible) || (!explainerEnabled && autoResume))

		if (currentQuestionIndex === maxQuestions - 1) {
			if (hasDelay) {
				// Clear the timeout and set up a new one with the remaining time of the previous timeout
				// This is to prevent endQuiz being called with a stale updatedUserAnswers value
				// Possibly refactor this into it's own hook (including the ref)
				if (timersRef.current?.endQuizTask) {
					clearTimeout(timersRef.current?.endQuizTask?.id);
				}
				const delay = timersRef.current?.endQuizTask?.remainingTime || autoResumeDelay;
				const timer = createTimeout(() => endQuiz(updatedUserAnswers), delay);
				timersRef.current.endQuizTask = timer;
			} else {
				endQuiz(updatedUserAnswers);
			}
			return;
		}

		if (hasDelay) {
			// Only set up once, since setUpNextQuestion doesn't depend on any value that could be stale due to the user changing answers
			if (!timersRef.current?.setUpNextQuestionTask) {
				const timeoutId = setTimeout(() => setUpNextQuestion(), autoResumeDelay);
				timersRef.current.setUpNextQuestionTask = timeoutId;
			}
		} else {
			setUpNextQuestion();
		}
	}

	function setUpNextQuestion() {
		timersRef.current = {};
		const nextQuestion = currentQuestionIndex + 1;
		setCurrentQuestionIndex(nextQuestion);
		setCurrentAnswer(undefined);
		const initialAnswerButtonState = Array(quizData.questions[nextQuestion].answers.length).fill(
			AnswerButtonState.UNSET
		);
		setAnswerButtonState(initialAnswerButtonState);
	}

	function endQuiz(userAnswers: UserAnswer[]) {
		timersRef.current = {};
		const evalFunctions = {
			[QuizType.SCORED]: evaluateScore,
			[QuizType.PERSONALITY]: evaluatePersonality,
			[QuizType.CUSTOM]: evalCustom,
		};

		const evalResult = evalFunctions[quizType]!(userAnswers);
		console.log("Your result is: ", evalResult);
		setResult(evalResult);
		setQuizState(QuizState.RESULT);
	}

	return {
		quizData,
		quizState,
		quizType,
		currentQuestion,
		maxQuestions,
		currentAnswer,
		result,
		handleAnswerBtnClick,
		answerBtnRequiredProps,
		handleQuestionNextBtnClick,
		questionNextBtnRequiredProps,
		handleExplainerNextBtnClick,
		handleStartBtnClick,
		config,
		answerButtonState,
		explainerVisible,
		progress,
	};
};
