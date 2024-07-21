import MyQuiz from "./myQuiz";
import { Quiz } from "./Quiz/Quiz";
import QuizComposed from "./QuizComposed";
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
			{/* <QuizComposed />
			<div style={{ margin: "80px 0" }}></div> */}

			<MyQuiz />
			<div style={{ margin: "80px 0" }}></div>

			<Quiz
				data={quizJson2}
				config={{
					// evalCustom: customAnswerEval,
					autoResume: true,
					autoResumeDelay: 1200,
					revealAnswer: false,
					// explainerEnabled: true,
					// explainerNewPage: true,
					// animation: "slideLeft",
				}}
			/>
		</>
	);
}

export default App;
