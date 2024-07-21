import styles from "./Quiz/styles.module.css";
import { Quiz } from "./Quiz/Quiz";
import { type QuizConfig, type QuizStateProps } from "./Quiz/useQuiz";
import quizJson from "./quizData.json";
import quizJson2 from "./quizData2.json";

const btnColors = {
	unset: "#222",
	default: "#222",
	selected: "blue",
	correct: "green",
	incorrect: "red",
};

const config: QuizConfig = {
	// evalCustom: customAnswerEval,
	autoResume: true,
	autoResumeDelay: 1000,
	revealAnswer: true,
	animation: "slideLeft",
	explainerEnabled: false,
	explainerNewPage: false,
};

const quizComponents = {
	IntroPage,
	QuestionWrapper,
	QuestionHeader,
	QuestionPage,
	QuestionBody,
	ExplainerPage,
	ResultPage,
};

// If you want to omit a component, you can create a component returning null

export default function MyQuiz() {
	return (
		<div style={{ minHeight: "300px", display: "grid", justifyContent: "center", alignContent: "center" }}>
			<Quiz data={quizJson2} config={config} components={quizComponents}></Quiz>
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

function QuestionHeader({ currentQuestion, maxQuestions, progress }: QuizStateProps) {
	return (
		<div className="question-header">
			<h4>{`${currentQuestion.index} / ${maxQuestions} - ${progress}%`}</h4>
			<progress className={styles.progress} max="100" value={progress}></progress>
		</div>
	);
}

function QuestionBody(state: QuizStateProps) {
	const { currentQuestion, answerButtonState } = state;
	return (
		<div className="question-body">
			<h1 style={{ fontSize: "30px" }}>{currentQuestion.index}</h1>
			<h2>{currentQuestion.question}</h2>
			{currentQuestion.answers.map((item: any, index: number) => (
				// <button
				// 	type="button"
				// 	key={index}
				// 	onClick={() => handleAnswerBtnClick(index)}
				// 	style={{ background: btnColors[answerButtonState[index]] }}
				// 	{...answerBtnRequiredProps}
				// >
				// 	{item.answer}
				// 	{answerButtonState[index] === "correct" && <span> ✔</span>}
				// </button>
				<Quiz.AnswerButton key={index} index={index} state={state}>
					{item.answer}
					{answerButtonState[index] === "correct" && <span> ✔</span>}
				</Quiz.AnswerButton>
			))}
			<p>
				{/* <button
					data-testid="question-next"
					type="button"
					onClick={handleQuestionNextBtnClick}
					{...questionNextBtnRequiredProps}
				>
					Next
				</button> */}
				<Quiz.QuestionNextButton state={state}>Next</Quiz.QuestionNextButton>
			</p>
		</div>
	);
}

function ExplainerPage({ currentQuestion, handleExplainerNextBtnClick }: QuizStateProps) {
	return (
		<div className="question-explainer">
			<h2>Explainer</h2>
			<p>{currentQuestion.explanation}</p>
			<button data-testid="explainer-next" type="button" onClick={handleExplainerNextBtnClick}>
				Next
			</button>
		</div>
	);
}

function IntroPage({ handleStartBtnClick }: QuizStateProps) {
	return (
		<div className="intro-page">
			<p>Start the quiz</p>
			<button type="button" onClick={handleStartBtnClick}>
				Start quiz
			</button>
		</div>
	);
}

function ResultPage({ handleStartBtnClick, result }: QuizStateProps) {
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
