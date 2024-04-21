import { Quiz } from "./Quiz/Quiz";
import { useQuiz } from "./Quiz/QuizContext";

export default function MyQuiz() {
	const { handleStart, currentQuestion, currentQuestionData, answerButtonState, result } = useQuiz();
	// console.log("MyQuiz: ", currentQuestionData.answers);

	return (
		<Quiz>
			<Quiz.IntroPage>
				<div>
					<p>Start the quiz</p>
					<button onClick={handleStart}>Start Quiz</button>
				</div>
			</Quiz.IntroPage>
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
					<Quiz.QuestionNextButton>
						<div>Next</div>
					</Quiz.QuestionNextButton>
				</p>
			</Quiz.QuestionPage>
			<Quiz.ExplainerPage>
				<h1>Explainer Custom</h1>
				<p>{currentQuestionData.question}</p>
				<p>
					<Quiz.ExplainerNextButton>Next</Quiz.ExplainerNextButton>
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
