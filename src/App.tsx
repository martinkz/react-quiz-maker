import Quiz from "./Quiz/Quiz";
import quizJson from "./quizData.json";

// import { UserAnswer } from "./Quiz/Quiz";

// function customAnswerEval(userAnswers: UserAnswer[]) {
// 	console.log(userAnswers);
// 	return "Custom result";
// }

function App() {
	return <Quiz quizData={quizJson}>Quiz children</Quiz>;
}

export default App;
