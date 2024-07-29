import styles from "./Quiz/styles.module.css";
import { Quiz } from "./Quiz/Quiz";
import type { QuizConfig, QuizData, QuizAnswer } from "./Quiz/types";
import { useQuiz } from "./Quiz/useQuiz";
import personalityQuizData from "./personalityQuiz.json";
import scoredQuizData from "./scoredQuiz.json";

const config: QuizConfig = {
	// evalCustom: customAnswerEval,
	autoResume: true,
	revealAnswer: true,
	animation: "slideLeft",
	explainerEnabled: false,
	explainerNewPage: false,
};

export default function QuizComposed() {
	const state = useQuiz(scoredQuizData as QuizData, config);
	const { maxQuestions, progress, currentQuestion, answerButtonState, result } = state;

	return (
		<div className="my-quiz">
			<Quiz parentState={state} config={config} data={scoredQuizData as QuizData}>
				<Quiz.IntroPage state={state}>
					<div>
						<p>Intro child component</p>
						<Quiz.StartButton state={state}>Start Quiz</Quiz.StartButton>
					</div>
				</Quiz.IntroPage>
				<Quiz.QuestionPage>
					<Quiz.QuestionHeader state={state}>
						<div>
							<h4>{`${currentQuestion.index} / ${maxQuestions} - ${progress}%`} - Header child</h4>
							<progress className={styles.progress} max="100" value={progress}></progress>
						</div>
					</Quiz.QuestionHeader>
					<Quiz.QuestionInnerWrapper>
						<Quiz.QuestionBody state={state}>
							<h1>Question {currentQuestion.index} - Question body child</h1>
							<p>{currentQuestion.question}</p>
							{currentQuestion.answers.map((item: QuizAnswer, index: number) => (
								<Quiz.AnswerButton state={state} key={index} index={index}>
									{item.answer}
									{answerButtonState[index] === "correct" && <span> ✔</span>}
								</Quiz.AnswerButton>
							))}
							<p>
								<Quiz.QuestionNextButton state={state}>Question Next</Quiz.QuestionNextButton>
							</p>
						</Quiz.QuestionBody>
						<Quiz.Explainer state={state}>
							<h1>Explainer Child</h1>
							<p>{currentQuestion.question}</p>
							<p>
								<Quiz.ExplainerNextButton state={state}>Explainer Next</Quiz.ExplainerNextButton>
							</p>
						</Quiz.Explainer>
					</Quiz.QuestionInnerWrapper>
				</Quiz.QuestionPage>
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
