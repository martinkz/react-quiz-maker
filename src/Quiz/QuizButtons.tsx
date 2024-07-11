import { type QuizContextProps } from "./QuizContext";

export const btnColors = {
	unset: "#222",
	default: "#222",
	selected: "blue",
	correct: "green",
	incorrect: "red",
};

export function QuestionNextButton({ children, state }: { children: React.ReactNode; state: QuizContextProps }) {
	const { handleQuestionNextBtnClick, questionNextBtnRequiredProps } = state;

	return (
		<button type="button" onClick={handleQuestionNextBtnClick} {...questionNextBtnRequiredProps}>
			{children}
		</button>
	);
}

export function ExplainerNextButton({ children, state }: { children: React.ReactNode; state: QuizContextProps }) {
	const { handleExplainerNextBtnClick } = state;

	return (
		<button type="button" onClick={handleExplainerNextBtnClick}>
			{children}
		</button>
	);
}

export function StartButton({ children, state }: { children: React.ReactNode; state: QuizContextProps }) {
	const { handleStartBtnClick } = state;

	return (
		<button type="button" onClick={handleStartBtnClick}>
			{children}
		</button>
	);
}

export function AnswerButton({
	children,
	index,
	state,
}: {
	children: React.ReactNode;
	index: number;
	state: QuizContextProps;
}) {
	const { currentQuestionData, answerButtonState, handleAnswerBtnClick, answerBtnRequiredProps } = state;

	return (
		<button
			type="button"
			key={currentQuestionData.question + index}
			onClick={() => handleAnswerBtnClick(index)}
			style={{ background: btnColors[answerButtonState[index]] }}
			{...answerBtnRequiredProps}
		>
			{children}
		</button>
	);
}
