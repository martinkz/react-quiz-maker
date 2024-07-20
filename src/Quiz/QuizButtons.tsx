import { type QuizContextProps } from "./QuizContext";

export const btnColors = {
	unset: "#222",
	default: "#222",
	selected: "blue",
	correct: "green",
	incorrect: "red",
};

export function QuestionNextButton({
	children,
	state,
	className,
}: {
	children: React.ReactNode;
	state: QuizContextProps;
	className?: string;
}) {
	const { handleQuestionNextBtnClick, questionNextBtnRequiredProps } = state;

	return (
		<button
			className={className}
			data-testid="question-next"
			type="button"
			onClick={handleQuestionNextBtnClick}
			{...questionNextBtnRequiredProps}
		>
			{children}
		</button>
	);
}

export function ExplainerNextButton({
	children,
	state,
	className,
}: {
	children: React.ReactNode;
	state: QuizContextProps;
	className?: string;
}) {
	const { handleExplainerNextBtnClick } = state;

	return (
		<button className={className} data-testid="explainer-next" type="button" onClick={handleExplainerNextBtnClick}>
			{children}
		</button>
	);
}

export function StartButton({
	children,
	state,
	className,
}: {
	children: React.ReactNode;
	state: QuizContextProps;
	className?: string;
}) {
	const { handleStartBtnClick } = state;

	return (
		<button className={className} type="button" onClick={handleStartBtnClick}>
			{children}
		</button>
	);
}

export function AnswerButton({
	children,
	index,
	state,
	className,
}: {
	children: React.ReactNode;
	index: number;
	state: QuizContextProps;
	className?: string;
}) {
	const { currentAnswer, answerButtonState, handleAnswerBtnClick, answerBtnRequiredProps } = state;

	return (
		<button
			className={className}
			type="button"
			key={index}
			onClick={() => handleAnswerBtnClick(index)}
			style={{ background: btnColors[answerButtonState[index]] }}
			aria-pressed={currentAnswer?.index === index}
			{...answerBtnRequiredProps}
		>
			{children}
		</button>
	);
}
