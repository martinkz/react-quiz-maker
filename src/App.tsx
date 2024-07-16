import MyQuiz from "./myQuiz";
import { Quiz } from "./Quiz/Quiz";
import MyQuizComposed from "./myQuizComposed";
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
			{/* <QuizProvider
				quizData={quizJson2}
				config={{
					// evalCustom: customAnswerEval,
					autoResume: false,
					revealAnswer: true,
					animation: "disabled",
					showAnswerExplainer: true,
					answerExplainerOnNewPage: false,
				}}
			>
				<MyQuizComposed />
			</QuizProvider>

			<div style={{ margin: "80px 0" }}></div> */}

			{/* <QuizProvider
				quizData={quizJson2}
				config={{
					// evalCustom: customAnswerEval,
					autoResume: true,
					revealAnswer: false,
					showAnswerExplainer: true,
					answerExplainerOnNewPage: false,
					animation: "slideLeftRight",
				}}
			>
				<MyQuiz />
			</QuizProvider> */}

			<div style={{ margin: "80px 0" }}></div>

			<QuizProvider
				quizData={quizJson2}
				config={{
					// evalCustom: customAnswerEval,
					autoResume: true,
					autoResumeDelay: 500,
					revealAnswer: true,
					showAnswerExplainer: true,
					answerExplainerOnNewPage: false,
					// animation: "slideLeftRight",
				}}
			>
				<Quiz />
			</QuizProvider>
		</>
	);
}

export default App;
