import { Quiz } from "./Quiz/Quiz";
import { useQuiz } from "./Quiz/QuizContext";
import { QuizState } from "./Quiz/QuizContext";

export default function MyQuiz() {
	const { handleStart, currentQuestion, currentQuestionData, answerButtonState, result, quizState, state } = useQuiz();
	// console.log("MyQuiz: ", currentQuestionData.answers);
	console.log(state(QuizState.QUESTION));

	return (
		<Quiz>
			{state(QuizState.START) && (
				<Quiz.IntroPage>
					<div>
						<p>Start the quiz</p>
						<button onClick={handleStart}>Start Quiz</button>
					</div>
				</Quiz.IntroPage>
			)}
			<Quiz.QuestionPage>
				<h1>Question {currentQuestion + 1}</h1>
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
			</Quiz.QuestionPage>
			<Quiz.ExplainerPage>
				<h1>Explainer Custom</h1>
				<p>{currentQuestionData.question}</p>
				<p>
					<Quiz.NextButton>Next</Quiz.NextButton>
				</p>
			</Quiz.ExplainerPage>
			<Quiz.ResultPage>
				<h1>
					<em>Your results is: {result}</em>
				</h1>
				<button onClick={handleStart}>Play again</button>
			</Quiz.ResultPage>
			<p>this is ignored and not rendered yet</p>
		</Quiz>
	);
}
