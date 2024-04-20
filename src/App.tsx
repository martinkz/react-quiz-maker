import MyQuiz from "./myQuiz";
import Quiz from "./Quiz/Quiz";
import { AnimationVariants, QuizProvider } from "./Quiz/QuizContext";
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
		duration: 0.5,
	},
	exit: { opacity: 0, x: "-100px" },
};

function App() {
	return (
		<>
			<QuizProvider
				quizData={quizJson2}
				config={{
					// evalCustom: customAnswerEval,
					nextButton: true,
					revealAnswer: false,
					showAnswerExplainer: true,
					animation: "slide",
				}}
			>
				<MyQuiz />
			</QuizProvider>

			<QuizProvider
				quizData={quizJson2}
				config={{
					// evalCustom: customAnswerEval,
					nextButton: false,
					revealAnswer: true,
					animation: "custom",
					motionObject: MotionSlideSideProps,
					// showAnswerExplainer: true,
				}}
			>
				<Quiz />
			</QuizProvider>
		</>
	);
}

export default App;
