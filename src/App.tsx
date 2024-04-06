import MyQuiz from "./myQuiz";
import MyQuiz2 from "./myQuiz2";
import { QuizProvider } from "./Quiz/QuizContext";
import quizJson from "./quizData.json";

// import { UserAnswer } from "./Quiz/Quiz";
// function customAnswerEval(userAnswers: UserAnswer[]) {
// 	console.log(userAnswers);
// 	return "Custom result";
// }

function App() {
	return (
		<>
			<QuizProvider quizData={quizJson}>
				<MyQuiz />
			</QuizProvider>
			<QuizProvider quizData={quizJson}>
				<MyQuiz2 />
			</QuizProvider>
		</>
	);
}

export default App;
