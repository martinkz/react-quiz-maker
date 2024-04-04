import MyQuiz from "./myQuiz";
import { QuizProvider } from "./Quiz/QuizContext";
import quizJson from "./quizData.json";

// import { UserAnswer } from "./Quiz/Quiz";
// function customAnswerEval(userAnswers: UserAnswer[]) {
// 	console.log(userAnswers);
// 	return "Custom result";
// }

function App() {
	return (
		<QuizProvider quizData={quizJson}>
			<MyQuiz />
		</QuizProvider>
	);
}

export default App;
