import MyQuiz from "./myQuiz";
import MyQuiz2 from "./myQuiz2";
import { QuizProvider, QuizConfig } from "./Quiz/QuizContext";
import quizJson from "./quizData.json";
import quizJson2 from "./quizData2.json";

// import { UserAnswer } from "./Quiz/Quiz";
// function customAnswerEval(userAnswers: UserAnswer[]) {
// 	console.log(userAnswers);
// 	return "Custom result";
// }

const quizSettings: QuizConfig = {
	// evalCustom: customAnswerEval,
	nextButton: true,
};

function App() {
	return (
		<>
			<QuizProvider quizData={quizJson} config={quizSettings}>
				<MyQuiz />
			</QuizProvider>
			<QuizProvider quizData={quizJson2}>
				<MyQuiz2 />
			</QuizProvider>
		</>
	);
}

export default App;
