import styles from "./Quiz/styles.module.css";
import { Quiz } from "./Quiz/Quiz";
import { type QuizContextProps } from "./Quiz/QuizContext";

const btnColors = {
	unset: "#222",
	default: "#222",
	selected: "blue",
	correct: "green",
	incorrect: "red",
};

// If you want to omit a component, you can create a component returning null

export default function MyQuiz() {
	return (
		<div style={{ minHeight: "300px", display: "grid", justifyContent: "center", alignContent: "center" }}>
			<Quiz
				components={{
					IntroPage,
					QuestionWrapper,
					QuestionHeader,
					QuestionPage,
					QuestionBody,
					ExplainerPage,
					ResultPage,
				}}
			></Quiz>
		</div>
	);
}

function QuestionWrapper({ children }: { children: React.ReactNode }) {
	return (
		<div className="question-wrapper" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
			{children}
		</div>
	);
}

function QuestionPage({ children }: { children: React.ReactNode }) {
	return <div className="question-page">{children}</div>;
}

function QuestionHeader({ currentQuestion, maxQuestions, progress }: QuizContextProps) {
	return (
		<div className="question-header">
			<h4>{`${currentQuestion + 1} / ${maxQuestions} - ${progress}%`}</h4>
			<progress className={styles.progress} max="100" value={progress}></progress>
		</div>
	);
}

function QuestionBody({
	currentQuestion,
	currentQuestionData,
	answerButtonState,
	handleAnswerBtnClick,
	answerBtnRequiredProps,
	handleQuestionNextBtnClick,
	questionNextBtnRequiredProps,
}: QuizContextProps) {
	return (
		<div className="question-body">
			<h2>
				Question {currentQuestionData.question} - {currentQuestion}
			</h2>
			{currentQuestionData.answers.map((item: any, index: number) => (
				<button
					type="button"
					key={index}
					onClick={() => handleAnswerBtnClick(index)}
					style={{ background: btnColors[answerButtonState[index]] }}
					{...answerBtnRequiredProps}
				>
					{item.answer}
					{answerButtonState[index] === "correct" && <span> ✔</span>}
				</button>
			))}
			<p>
				<button type="button" onClick={handleQuestionNextBtnClick} {...questionNextBtnRequiredProps}>
					Question Next
				</button>
			</p>
		</div>
	);
}

function ExplainerPage({ currentQuestionData, handleExplainerNextBtnClick }: QuizContextProps) {
	return (
		<div className="question-explainer">
			<h2>Explainer</h2>
			<p>{currentQuestionData.explanation}</p>
			<button type="button" onClick={handleExplainerNextBtnClick}>
				Explainer Next
			</button>
		</div>
	);
}

function IntroPage({ handleStartBtnClick }: QuizContextProps) {
	return (
		<div className="intro-page">
			<p>Start the quiz</p>
			<button type="button" onClick={handleStartBtnClick}>
				Start quiz
			</button>
		</div>
	);
}

function ResultPage({ handleStartBtnClick, result }: QuizContextProps) {
	return (
		<div className="result-page">
			<h1>
				<em>Your results is: {result}</em>
			</h1>
			<button type="button" onClick={handleStartBtnClick}>
				Play again
			</button>
		</div>
	);
}
