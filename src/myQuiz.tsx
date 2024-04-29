import styles from "./Quiz/styles.module.css";
import { Quiz } from "./Quiz/Quiz";
import { useQuiz } from "./Quiz/QuizContext";
import { forwardRef, ForwardedRef } from "react";

function QuestionWrapper({ children }: { children: React.ReactNode }) {
	return <div className="question-wrap">{children}</div>;
}

function QuestionHeader({ className }: { className: string }) {
	const { currentQuestion, maxQuestions, progress } = useQuiz();

	return (
		<div>
			<h4>{`${currentQuestion + 1} / ${maxQuestions} - ${progress}%`}</h4>
			<progress className={styles.progress} max="100" value={progress}></progress>
		</div>
	);
}
// This component re-renders when the progress changes and thus the animation will replay, which is undesired
const QuestionHeader2 = forwardRef((props: any, ref: ForwardedRef<HTMLDivElement>) => {
	const { currentQuestion, maxQuestions, progress } = useQuiz();

	return (
		<div ref={ref}>
			<h4>{`${currentQuestion + 1} / ${maxQuestions} - ${progress}%`}</h4>
			<progress className={styles.progress} max="100" value={progress}></progress>
		</div>
	);
});

export default function MyQuiz() {
	const { currentQuestion, maxQuestions, currentQuestionData, answerButtonState, progress, result } = useQuiz();

	// const QuestionHeader = (
	// 	<div>
	// 		<h4>{`${currentQuestion + 1} / ${maxQuestions} - ${progress}%`}</h4>
	// 		<progress className={styles.progress} max="100" value={progress}></progress>
	// 	</div>
	// );

	const QuizIntro = (
		<div>
			<p>Start the quiz</p>
			<Quiz.StartButton>Start Quiz</Quiz.StartButton>
		</div>
	);

	const QuestionBody = (
		<div>
			<h1>Question {currentQuestion + 1}</h1>
			<p>{currentQuestionData.question}</p>
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

	const ResultPage = (
		<div>
			<h1>
				<em>Your results is: {result}</em>
			</h1>
			<Quiz.StartButton>Play again</Quiz.StartButton>
		</div>
	);

	return (
		<div>
			<Quiz
				IntroPage={QuizIntro}
				QuestionWrapper={QuestionWrapper}
				QuestionHeader={<QuestionHeader className="test-class" />}
				QuestionHeader2={QuestionHeader2}
				QuestionBody={QuestionBody}
				ResultPage={ResultPage}
			></Quiz>
		</div>
	);
}
