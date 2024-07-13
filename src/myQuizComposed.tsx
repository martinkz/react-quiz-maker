import styles from "./Quiz/styles.module.css";
import { Quiz } from "./Quiz/Quiz";
import { useQuiz } from "./Quiz/QuizContext";

export default function MyQuizComposed() {
	const state = useQuiz();
	const { currentQuestion, maxQuestions, progress, currentQuestionData, answerButtonState, result } = state;

	return (
		<div className="my-quiz">
			<Quiz>
				<Quiz.IntroPage state={state}>
					<div>
						<p>Intro child component</p>
						<Quiz.StartButton state={state}>Start Quiz</Quiz.StartButton>
					</div>
				</Quiz.IntroPage>
				<Quiz.QuestionWrapper>
					<Quiz.QuestionHeader state={state}>
						<div>
							<h4>{`${currentQuestion + 1} / ${maxQuestions} - ${progress}%`} - Header child</h4>
							<progress className={styles.progress} max="100" value={progress}></progress>
						</div>
					</Quiz.QuestionHeader>
					<Quiz.QuestionPage>
						<Quiz.QuestionBody state={state}>
							<h1>Question {currentQuestion + 1} - Question body child</h1>
							<p>{currentQuestionData.question}</p>
							{currentQuestionData.answers.map((item: any, index: number) => (
								<Quiz.AnswerButton state={state} key={currentQuestionData.question + index} index={index}>
									{item.answer}
									{answerButtonState[index] === "correct" && <span> ✔</span>}
								</Quiz.AnswerButton>
							))}
							<p>
								<Quiz.QuestionNextButton state={state}>Question Next</Quiz.QuestionNextButton>
							</p>
						</Quiz.QuestionBody>
						<Quiz.ExplainerPage state={state}>
							<h1>Explainer Child</h1>
							<p>{currentQuestionData.question}</p>
							<p>
								<Quiz.ExplainerNextButton state={state}>Explainer Next</Quiz.ExplainerNextButton>
							</p>
						</Quiz.ExplainerPage>
					</Quiz.QuestionPage>
				</Quiz.QuestionWrapper>
				<Quiz.ResultPage state={state}>
					<h1>
						<em>Your results is: {result} - Result child</em>
					</h1>
					<Quiz.StartButton state={state}>Play again</Quiz.StartButton>
				</Quiz.ResultPage>
				<p>this is ignored and not rendered yet</p>
			</Quiz>
		</div>
	);
}
