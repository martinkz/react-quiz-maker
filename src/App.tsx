import MyQuiz from "./myQuiz";
import { Quiz } from "./Quiz/Quiz";
import MyQuizComposed from "./myQuizComposed";
import { QuizProvider } from "./Quiz/QuizContext";
import quizJson from "./quizData.json";
import quizJson2 from "./quizData2.json";

// import { type UserAnswer } from "./Quiz/QuizContext";
// function customAnswerEval(userAnswers: UserAnswer[]) {
// 	console.log(userAnswers);
// 	return "Custom result";
// }

function App() {
	return (
		<>
			{/* <QuizProvider
				quizData={quizJson2}
				config={{
					// evalCustom: customAnswerEval,
					autoResume: false,
					revealAnswer: true,
					animation: "disabled",
					explainerEnabled: true,
					explainerNewPage: false,
				}}
			>
				<MyQuizComposed />
			</QuizProvider>

			<div style={{ margin: "80px 0" }}></div> */}

			<QuizProvider
				quizData={quizJson2}
				config={{
					// evalCustom: customAnswerEval,
					autoResume: true,
					autoResumeDelay: 1200,
					revealAnswer: true,
					explainerEnabled: true,
					explainerNewPage: true,
					animation: "slideLeft",
				}}
			>
				<MyQuiz />
			</QuizProvider>

			<div style={{ margin: "80px 0" }}></div>

			<QuizProvider
				quizData={quizJson2}
				config={{
					// evalCustom: customAnswerEval,
					autoResume: true,
					autoResumeDelay: 1200,
					revealAnswer: false,
					// explainerEnabled: true,
					// explainerNewPage: true,
					// animation: "slideLeft",
				}}
			>
				<Quiz />
			</QuizProvider>
		</>
	);
}

export default App;
