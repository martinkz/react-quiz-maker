import { Quiz } from "./Quiz/Quiz";
import { useQuiz } from "./Quiz/QuizContext";

export default function MyQuiz() {
	const { handleStart, currentQuestion, currentQuestionData, result } = useQuiz();
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
					// <button key={index} onClick={() => handleAnswer({ index: index, result: item.result })}>
					// 	{item.answer}
					// </button>
					<Quiz.AnswerButton key={currentQuestionData.question + index} index={index}>
						{item.answer}
					</Quiz.AnswerButton>
				))}
				<p>
					<Quiz.NextButton>Next</Quiz.NextButton>
				</p>
			</Quiz.QuestionPage>
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
