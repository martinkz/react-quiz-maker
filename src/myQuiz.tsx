import styles from "./Quiz/styles.module.css";
import { Quiz } from "./Quiz/Quiz";
import { useQuiz, type QuizContextProps } from "./Quiz/QuizContext";

// If you want to omit a component, you can create a component returning null

export const btnColors = {
	unset: "#222",
	default: "#222",
	selected: "blue",
	correct: "green",
	incorrect: "red",
};

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

function QuestionBody({
	currentQuestion,
	currentQuestionData,
	answerButtonState, // group answer button props?
	handleAnswerBtnClick,
	answerBtnRequiredProps,
	handleQuestionNextBtnClick,
	questionNextBtnRequiredProps,
}: QuizContextProps) {
	// const { currentQuestionData, answerButtonState } = useQuiz();
	// const { currentQuestion, currentQuestionData, answerButtonState, handleAnswerBtnClick, isAnswerBtnDisabled } = state;

	return (
		<div className="question-body">
			<h2>
				Question {currentQuestionData.question} - {currentQuestion}
			</h2>
			{currentQuestionData.answers.map((item: any, index: number) => (
				// <Quiz.AnswerButton key={currentQuestionData.question + index} index={index} state={state}>
				// 	{item.answer}
				// 	{answerButtonState[index] === "correct" && <span> ✔</span>}
				// </Quiz.AnswerButton>
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
