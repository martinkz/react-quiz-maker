import { Quiz } from "./Quiz/Quiz";
import { useQuiz } from "./Quiz/QuizContext";

export default function MyQuiz() {
	const { handleStart, currentQuestion, currentQuestionData, answerButtonState, result } = useQuiz();
	// console.log("MyQuiz: ", currentQuestionData.answers);

	const MotionScaleProps = {
		initial: { opacity: 0, scale: 0 },
		animate: { opacity: 1, scale: 1 },
		transition: {
			duration: 1,
			// ease: [0, 0.71, 0.2, 1.01],
		},
		exit: { opacity: 0, scale: 0 },
	};

	return (
		<Quiz>
			<Quiz.IntroPage>
				<div>
					<p>~~~ Start the quiz ~~~</p>
					<button onClick={handleStart}>Start Quiz</button>
				</div>
			</Quiz.IntroPage>
			<Quiz.MotionQuestionPage key={currentQuestion} {...MotionScaleProps}>
				<h1>~~~ Question {currentQuestion + 1} ~~~</h1>
				<p>{currentQuestionData.question}</p>
				{currentQuestionData.answers.map((item: any, index: number) => (
					<Quiz.AnswerButton key={currentQuestionData.question + index} index={index}>
						{item.answer}
						{answerButtonState[index] === "correct" && <span> ✔</span>}
					</Quiz.AnswerButton>
				))}
				<p>
					<Quiz.NextButton>Next</Quiz.NextButton>
				</p>
			</Quiz.MotionQuestionPage>
			<Quiz.ExplainerPage>
				<h1>Explainer Custom</h1>
				<p>{currentQuestionData.question}</p>
				<p>
					<Quiz.NextButton>Next</Quiz.NextButton>
				</p>
			</Quiz.ExplainerPage>
			<Quiz.ResultPage>
				<h1>
					<em>~~~ Your results is: {result} ~~~</em>
				</h1>
				<button onClick={handleStart}>Play again</button>
			</Quiz.ResultPage>
			<p>this is ignored and not rendered yet</p>
		</Quiz>
	);
}
