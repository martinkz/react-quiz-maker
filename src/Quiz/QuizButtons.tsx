import { useQuiz } from "./QuizContext";

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
