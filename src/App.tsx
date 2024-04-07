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

const quizSettings1: QuizConfig = {
	// evalCustom: customAnswerEval,
	nextButton: true,
	revealAnswer: "immediate",
};

const quizSettings2: QuizConfig = {
	// evalCustom: customAnswerEval,
	nextButton: false,
	revealAnswer: "immediate",
};

function App() {
	return (
		<>
			<QuizProvider quizData={quizJson2} config={quizSettings1}>
				<MyQuiz />
			</QuizProvider>
			<QuizProvider quizData={quizJson2} config={quizSettings2}>
				<MyQuiz2 />
			</QuizProvider>
		</>
	);
}

export default App;
