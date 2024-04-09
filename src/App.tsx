import MyQuiz from "./myQuiz";
import MyQuiz2 from "./myQuiz2";
import { QuizProvider } from "./Quiz/QuizContext";
import quizJson from "./quizData.json";
import quizJson2 from "./quizData2.json";

// import { UserAnswer } from "./Quiz/Quiz";
// function customAnswerEval(userAnswers: UserAnswer[]) {
// 	console.log(userAnswers);
// 	return "Custom result";
// }

function App() {
	return (
		<>
			<QuizProvider
				quizData={quizJson2}
				config={{
					// evalCustom: customAnswerEval,
					nextButton: true,
					revealAnswer: "immediate",
				}}
			>
				<MyQuiz />
			</QuizProvider>
			<QuizProvider
				quizData={quizJson2}
				config={{
					// evalCustom: customAnswerEval,
					nextButton: false,
					revealAnswer: "immediate",
				}}
			>
				<MyQuiz2 />
			</QuizProvider>
		</>
	);
}

export default App;
