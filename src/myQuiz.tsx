import styles from "./Quiz/styles.module.css";
import { Quiz } from "./Quiz/Quiz";
import { useQuiz, QuizContextProps } from "./Quiz/QuizContext";

// If you want to omit a component, you can create a component returning null

function QuestionPage({ children }: { children: React.ReactNode }) {
	return <div className="question-wrap">{children}</div>;
}

function QuestionHeader() {
	const { currentQuestion, maxQuestions, progress } = useQuiz();

	return (
		<div className="question-header">
			<h4>{`${currentQuestion + 1} / ${maxQuestions} - ${progress}%`}</h4>
			<progress className={styles.progress} max="100" value={progress}></progress>
		</div>
	);
}

function QuestionBody({ currentQuestion, currentQuestionData, answerButtonState }: QuizContextProps) {
	// const { currentQuestionData, answerButtonState } = useQuiz();

	return (
		<div className="question-body">
			<h2>
				Question {currentQuestionData.question} - {currentQuestion}
			</h2>
			{currentQuestionData.answers.map((item: any, index: number) => (
				<Quiz.AnswerButton key={currentQuestionData.question + index} index={index}>
					{item.answer}
					{answerButtonState[index] === "correct" && <span> ✔</span>}
				</Quiz.AnswerButton>
			))}
			<p>
				<Quiz.QuestionNextButton>Next</Quiz.QuestionNextButton>
			</p>
		</div>
	);
}

function ExplainerPage() {
	const { currentQuestionData } = useQuiz();

	return (
		<div className="quiz-explainer">
			<h1>Explainer</h1>
			<p>{currentQuestionData.explanation}</p>
			<Quiz.ExplainerNextButton>Next</Quiz.ExplainerNextButton>
		</div>
	);
}

function IntroPage() {
	return (
		<div className="quiz-intro">
			<p>Start the quiz</p>
			<Quiz.StartButton>Start Quiz</Quiz.StartButton>
		</div>
	);
}

function ResultPage() {
	const { result } = useQuiz();

	return (
		<div className="quiz-result">
			<h1>
				<em>Your results is: {result}</em>
			</h1>
			<Quiz.StartButton>Play again</Quiz.StartButton>
		</div>
	);
}

export default function MyQuiz() {
	return (
		<Quiz
			IntroPage={IntroPage}
			QuestionPage={QuestionPage}
			QuestionHeader={QuestionHeader}
			QuestionBody={QuestionBody}
			ExplainerPage={ExplainerPage}
			ResultPage={ResultPage}
		></Quiz>
	);
}
