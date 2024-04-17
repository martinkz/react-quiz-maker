import { Quiz } from "./Quiz/Quiz";
import { useQuiz } from "./Quiz/QuizContext";
import { motion } from "framer-motion";

export default function MyQuiz() {
	const { handleStart, currentQuestion, currentQuestionData, answerButtonState, result } = useQuiz();
	// console.log("MyQuiz: ", currentQuestionData.answers);

	const MotionScaleProps = {
		initial: { opacity: 0, scale: 0 },
		animate: { opacity: 1, scale: 1 },
		transition: {
			duration: 1,
			// ease: [0, 0.71, 0.2, 1.01],
		},
		exit: { opacity: 0, scale: 0 },
	};

	const MotionAnswerButtonContainerProps3 = {
		style: { display: "block" },
		initial: "hideBtn",
		animate: "showBtn",
		variants: {
			hideBtn: {
				transition: {
					staggerChildren: 0.2,
					staggerDirection: -1,
				},
			},
			showBtn: {
				transition: {
					delayChildren: 0.7,
					staggerChildren: 0.2,
					staggerDirection: 1,
				},
			},
		},
	};

	const MotionAnswerButtonProps3 = {
		style: { display: "inline-block" },
		variants: {
			hideBtn: {
				opacity: 0,
				scale: 0,
				transition: {
					duration: 0.3,
				},
			},
			showBtn: {
				opacity: 1,
				scale: 1,
				transition: {
					duration: 0.5,
					ease: [0, 0.71, 0.2, 1.01],
				},
			},
		},
	};

	return (
		<Quiz>
			<Quiz.IntroPage>
				<div>
					<p>~~~ Start the quiz ~~~</p>
					<button onClick={handleStart}>Start Quiz</button>
				</div>
			</Quiz.IntroPage>
			<Quiz.MotionQuestionPage key={currentQuestion} {...MotionScaleProps}>
				<h1>~~~ Question {currentQuestion + 1} ~~~</h1>
				<p>{currentQuestionData.question}</p>
				<motion.div {...MotionAnswerButtonContainerProps3}>
					{currentQuestionData.answers.map((item: any, index: number) => (
						<motion.span {...MotionAnswerButtonProps3} key={currentQuestionData.question + index}>
							<Quiz.AnswerButton index={index}>
								{item.answer}
								{answerButtonState[index] === "correct" && <span> ✔</span>}
							</Quiz.AnswerButton>
						</motion.span>
					))}
				</motion.div>
				<p>
					<Quiz.NextButton>Next</Quiz.NextButton>
				</p>
			</Quiz.MotionQuestionPage>
			<Quiz.ExplainerPage>
				<h1>Explainer Custom</h1>
				<p>{currentQuestionData.question}</p>
				<p>
					<Quiz.NextButton>Next</Quiz.NextButton>
				</p>
			</Quiz.ExplainerPage>
			<Quiz.ResultPage>
				<h1>
					<em>~~~ Your results is: {result} ~~~</em>
				</h1>
				<button onClick={handleStart}>Play again</button>
			</Quiz.ResultPage>
			<p>this is ignored and not rendered yet</p>
		</Quiz>
	);
}
