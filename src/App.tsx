import MyQuiz from "./myQuiz";
import { Quiz } from "./Quiz/Quiz";
import { QuizData } from "./Quiz/types";
import QuizComposed from "./QuizComposed";
import personalityQuizData from "./personalityQuiz.json";
import scoredQuizData from "./scoredQuiz.json";

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
				data={scoredQuizData as QuizData}
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
