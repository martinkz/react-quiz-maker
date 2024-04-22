import { Quiz } from "./Quiz/Quiz";
import { useQuiz } from "./Quiz/QuizContext";

export default function MyQuiz() {
	const { currentQuestion, maxQuestions, currentQuestionData, answerButtonState, result } = useQuiz();

	return (
		<div className="quiz-wrap">
			{currentQuestion}
			<Quiz>
				<Quiz.Header>
					<h4>{`${currentQuestion + 1} / ${maxQuestions}`}</h4>
					<Quiz.ProgressBar />
				</Quiz.Header>
				<Quiz.IntroPage>
					<div>
						<p>Start the quiz</p>
						<Quiz.StartButton>Start Quiz</Quiz.StartButton>
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
						<Quiz.QuestionNextButton>Next</Quiz.QuestionNextButton>
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
					<Quiz.StartButton>Play again</Quiz.StartButton>
				</Quiz.ResultPage>
				<p>this is ignored and not rendered yet</p>
			</Quiz>
		</div>
	);
}
