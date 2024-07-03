import styles from "./Quiz/styles.module.css";
import { Quiz } from "./Quiz/Quiz";
import { useQuiz } from "./Quiz/QuizContext";

export default function MyQuizComposed() {
	const { currentQuestion, maxQuestions, progress, currentQuestionData, answerButtonState, result } = useQuiz();

	return (
		<Quiz>
			<Quiz.IntroPage>
				<div>
					<p>Intro child component</p>
					<Quiz.StartButton>Start Quiz</Quiz.StartButton>
				</div>
			</Quiz.IntroPage>
			<Quiz.QuestionPage>
				<Quiz.QuestionHeader>
					<div className="question-header">
						<h4>{`${currentQuestion + 1} / ${maxQuestions} - ${progress}%`} - Header child</h4>
						<progress className={styles.progress} max="100" value={progress}></progress>
					</div>
				</Quiz.QuestionHeader>
				<Quiz.QuestionBody>
					<h1>Question {currentQuestion + 1} - Question body child</h1>
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
				</Quiz.QuestionBody>
				<Quiz.ExplainerPage>
					<h1>Explainer Child</h1>
					<p>{currentQuestionData.question}</p>
					<p>
						<Quiz.ExplainerNextButton>Next</Quiz.ExplainerNextButton>
					</p>
				</Quiz.ExplainerPage>
			</Quiz.QuestionPage>
			<Quiz.ResultPage>
				<h1>
					<em>Your results is: {result} - Result child</em>
				</h1>
				<Quiz.StartButton>Play again</Quiz.StartButton>
			</Quiz.ResultPage>
			<p>this is ignored and not rendered yet</p>
		</Quiz>
	);
}