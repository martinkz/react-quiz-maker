import styles from "./Quiz/styles.module.css";
import { Quiz } from "./Quiz/Quiz";
import { type QuizContextProps } from "./Quiz/QuizContext";

export const btnColors = {
	unset: "#222",
	default: "#222",
	selected: "blue",
	correct: "green",
	incorrect: "red",
};

// If you want to omit a component, you can create a component returning null

function QuestionPage({ children }: { children: React.ReactNode }) {
	return (
		<div
			className="question-wrap"
			// style={{ display: "flex", flexDirection: "column", minHeight: "600px", justifyContent: "stretch" }}
		>
			{children}
		</div>
	);
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
					key={currentQuestionData.question + index}
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
					Next
				</button>
			</p>
		</div>
	);
}

function ExplainerPage({ currentQuestionData, handleExplainerNextBtnClick }: QuizContextProps) {
	return (
		<div className="explainer">
			<h2>Explainer</h2>
			<p>{currentQuestionData.explanation}</p>
			<button type="button" onClick={handleExplainerNextBtnClick}>
				Next
			</button>
		</div>
	);
}

function IntroPage({ handleStartBtnClick }: QuizContextProps) {
	return (
		<div className="quiz-intro">
			<p>Start the quiz</p>
			<button type="button" onClick={handleStartBtnClick}>
				Start quiz
			</button>
		</div>
	);
}

function ResultPage({ handleStartBtnClick, result }: QuizContextProps) {
	return (
		<div className="quiz-result">
			<h1>
				<em>Your results is: {result}</em>
			</h1>
			<button type="button" onClick={handleStartBtnClick}>
				Play again
			</button>
		</div>
	);
}

export default function MyQuiz() {
	return (
		<div style={{ minHeight: "300px", display: "grid", justifyContent: "center", alignContent: "center" }}>
			<Quiz components={{ IntroPage, QuestionPage, QuestionHeader, QuestionBody, ExplainerPage, ResultPage }}></Quiz>
		</div>
	);
}
