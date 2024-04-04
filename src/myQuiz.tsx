import { Quiz } from "./Quiz/Quiz";
import { useQuiz } from "./Quiz/QuizContext";
import quizJson from "./quizData.json";

export default function MyQuiz() {
	const { handleStart } = useQuiz();

	return (
		<Quiz quizData={quizJson}>
			<Quiz.IntroPage>
				<p>Start the quiz</p>
				<button onClick={handleStart}>Start Quiz</button>
			</Quiz.IntroPage>
			<p>fdfs</p>
		</Quiz>
	);
}
