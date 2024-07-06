import MyQuiz from "./myQuiz";
import Quiz from "./Quiz/Quiz";
import MyQuizComposed from "./myQuizComposed";
import { QuizProvider } from "./Quiz/QuizContext";
import quizJson from "./quizData.json";
import quizJson2 from "./quizData2.json";

// import { UserAnswer } from "./Quiz/Quiz";
// function customAnswerEval(userAnswers: UserAnswer[]) {
// 	console.log(userAnswers);
// 	return "Custom result";
// }

const MotionSlideSideProps = {
	initial: { opacity: 0, x: "-100px" },
	animate: { opacity: 1, x: 0 },
	transition: {
		duration: 1.5,
	},
	exit: { opacity: 0, x: "-100px" },
};

function App() {
	return (
		<>
			{/* <QuizProvider
				quizData={quizJson2}
				config={{
					// evalCustom: customAnswerEval,
					nextButton: true,
					revealAnswer: true,
					animation: "custom",
					motionObject: MotionSlideSideProps,
					showAnswerExplainer: false,
					answerExplainerOnNewPage: false,
				}}
			>
				<MyQuizComposed />
			</QuizProvider> */}

			<div style={{ margin: "80px 0" }}></div>

			<QuizProvider
				quizData={quizJson2}
				config={{
					// evalCustom: customAnswerEval,
					nextButton: true,
					revealAnswer: true,
					animation: "slide",
					showAnswerExplainer: false,
					answerExplainerOnNewPage: false,
				}}
			>
				<MyQuiz />
			</QuizProvider>

			<div style={{ margin: "80px 0" }}></div>

			<QuizProvider
				quizData={quizJson2}
				config={{
					// evalCustom: customAnswerEval,
					nextButton: false,
					revealAnswer: true,
					animation: "scale",
					// motionObject: MotionSlideSideProps,
					showAnswerExplainer: false,
					answerExplainerOnNewPage: false,
				}}
			>
				<Quiz />
			</QuizProvider>
		</>
	);
}

export default App;
