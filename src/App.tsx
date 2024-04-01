import Quiz from "./Quiz/Quiz";
import quizJson from "./quizData.json";

import { userAnswer } from "./Quiz/Quiz";

function customAnswerEval(userAnswers: userAnswer[]) {
	console.log(userAnswers);
	return "Custom result";
}

function App() {
	return <Quiz quizData={quizJson} evalCustom={customAnswerEval} />;
}

export default App;
