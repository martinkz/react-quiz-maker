import { type QuizStateProps } from "./useQuiz";

export function QuestionNextButton({
	children,
	state,
	className = "",
	style,
}: {
	children: React.ReactNode;
	state: QuizStateProps;
	className?: string;
	style?: React.CSSProperties;
}) {
	const { handleQuestionNextBtnClick, questionNextBtnRequiredProps, config } = state;

	if (config?.autoResume) {
		return null;
	}

	return (
		<button
			className={`quiz-button ${className}`}
			style={style}
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
	className = "",
	style,
}: {
	children: React.ReactNode;
	state: QuizStateProps;
	className?: string;
	style?: React.CSSProperties;
}) {
	const { handleExplainerNextBtnClick } = state;

	return (
		<button
			className={`quiz-button ${className}`}
			style={style}
			data-testid="explainer-next"
			type="button"
			onClick={handleExplainerNextBtnClick}
		>
			{children}
		</button>
	);
}

export function StartButton({
	children,
	state,
	className = "",
	style,
}: {
	children: React.ReactNode;
	state: QuizStateProps;
	className?: string;
	style?: React.CSSProperties;
}) {
	const { handleStartBtnClick } = state;

	return (
		<button className={`quiz-button ${className}`} style={style} type="button" onClick={handleStartBtnClick}>
			{children}
		</button>
	);
}

export function AnswerButton({
	children,
	index,
	state,
	className = "",
	style,
}: {
	children: React.ReactNode;
	index: number;
	state: QuizStateProps;
	className?: string;
	style?: React.CSSProperties;
}) {
	const { currentAnswer, answerButtonState, handleAnswerBtnClick, answerBtnRequiredProps } = state;

	return (
		<button
			className={`quiz-button ${className}`}
			type="button"
			onClick={() => handleAnswerBtnClick(index)}
			style={style}
			aria-pressed={currentAnswer?.index === index}
			{...answerBtnRequiredProps}
		>
			{children}
		</button>
	);
}
