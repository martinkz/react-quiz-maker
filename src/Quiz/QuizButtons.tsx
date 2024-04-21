import { QuizType, AnswerButtonState, UserAnswer, useQuiz } from "./QuizContext";
import { findIndexes } from "./utility";

export function QuestionNextButton({ children }: { children: React.ReactNode }) {
	const { config, currentAnswer, handleAnswer, setExplainerVisible, explainerVisible } = useQuiz();
	const { showAnswerExplainer } = config || {};

	const cssVisibility = explainerVisible ? "hidden" : "visible";

	function nextStep() {
		if (currentAnswer) {
			if (showAnswerExplainer && !explainerVisible) {
				setExplainerVisible(true);
			} else {
				handleAnswer(currentAnswer);
				setExplainerVisible(false);
			}
		}
	}

	return (
		<button type="button" onClick={nextStep} disabled={!currentAnswer} style={{ visibility: cssVisibility }}>
			{children}
		</button>
	);
}

export function ExplainerNextButton({ children }: { children: React.ReactNode }) {
	const { currentAnswer, handleAnswer, setExplainerVisible } = useQuiz();

	function nextStep() {
		handleAnswer(currentAnswer!);
		setExplainerVisible(false);
	}

	return (
		<button type="button" onClick={nextStep}>
			{children}
		</button>
	);
}

export function StartButton({ children }: { children: React.ReactNode }) {
	const { handleStart } = useQuiz();

	return (
		<button type="button" onClick={handleStart}>
			{children}
		</button>
	);
}

export function AnswerButton({ children, index }: { children: React.ReactNode; index: number }) {
	const {
		config,
		quizData,
		currentQuestion,
		setCurrentAnswer,
		handleAnswer,
		answerButtonState,
		setAnswerButtonState,
		explainerVisible,
		setExplainerVisible,
	} = useQuiz();
	const { nextButton, revealAnswer, showAnswerExplainer, answerExplainerOnNewPage } = config || {};
	const answers = quizData.questions[currentQuestion].answers;

	// Sometimes the answer buttons re-render with the indexes of the previous question
	// This is a workaround to prevent an error when the next question has fewer answers
	if (answers?.[index] === undefined) {
		return null;
	}

	const quizType = quizData.type;
	const theAnswer = { index: index, result: answers[index].result };
	const showCorrectAnswer = quizType === QuizType.SCORED && revealAnswer === true;
	const btnStateIsSet = answerButtonState[index] !== AnswerButtonState.UNSET;
	const btnDisabled = btnStateIsSet && (showCorrectAnswer || explainerVisible);

	const colors = {
		[AnswerButtonState.UNSET]: "#222",
		[AnswerButtonState.DEFAULT]: "#222",
		[AnswerButtonState.SELECTED]: "blue",
		[AnswerButtonState.CORRECT]: "green",
		[AnswerButtonState.INCORRECT]: "red",
	};

	const bgColor = colors[answerButtonState[index]];

	function answerBtnClick() {
		setCurrentAnswer(theAnswer);
		const answerButtonsUpdatedState = getAnswerBtnsNewState(answers, theAnswer, showCorrectAnswer);
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

	// Update the state of all answer buttons based on the current answer and whether to show the correct answer
	function getAnswerBtnsNewState(answers: any, currentAnswer: UserAnswer, showCorrectAnswer: boolean) {
		const defaultAnswerButtonState = Array(answers.length).fill(AnswerButtonState.DEFAULT);
		const newBtnStateAll = [...defaultAnswerButtonState];
		if (showCorrectAnswer) {
			const correctIndexes = findIndexes(
				answers.map((item: any) => item.result),
				"1"
			);
			const isCorrect = correctIndexes.includes(index);
			const newBtnState = isCorrect ? AnswerButtonState.CORRECT : AnswerButtonState.INCORRECT;
			newBtnStateAll[index] = newBtnState;
			correctIndexes.forEach((index) => (newBtnStateAll[index] = AnswerButtonState.CORRECT));
		} else {
			const isHighlightedForSelected = currentAnswer.index === index;
			if (isHighlightedForSelected) {
				newBtnStateAll[index] = AnswerButtonState.SELECTED;
			}
		}
		return newBtnStateAll;
	}

	return (
		<button type="button" style={{ background: bgColor }} onClick={answerBtnClick} disabled={btnDisabled}>
			{children}
		</button>
	);
}
