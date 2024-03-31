import { useState, forwardRef, ComponentProps, ForwardedRef } from "react";
// import styles from "./styles.module.css";

import { motion, AnimatePresence } from "framer-motion";

export type ButtonProps = ComponentProps<"button"> & {
	icon?: string;
};

export type QuizProps = {
	quizData: any;
	children?: React.ReactNode;
};

enum QuizState {
	START,
	QUESTION,
	RESULT,
}

export const Quiz = ({ quizData, children }: QuizProps) => {
	const [quizState, setQuizState] = useState<QuizState>(QuizState.START);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [userAnswers, setUserAnswers] = useState<Array<number>>([]);
	const maxQuestions = quizData.questions.length;
	// console.log(quizData, children);

	function handleAnswer(answerIdx: number) {
		const updatedUserAnswers = [...userAnswers, answerIdx];

		setUserAnswers(updatedUserAnswers);

		if (currentQuestion === maxQuestions - 1) {
			setQuizState(QuizState.RESULT);
			console.log("Your score is: ", evaluateAnswers(quizData.questions, updatedUserAnswers));
			return;
		}

		setCurrentQuestion(currentQuestion + 1);
	}

	function handleStart() {
		setQuizState(QuizState.QUESTION);
		setCurrentQuestion(0);
		setUserAnswers([]);
	}

	function evaluateAnswers(questions: Array<any>, answers: Array<number>) {
		const score = questions.filter((question: any, index: number) => question.answers[answers[index]].result === "1").length;
		return score;
	}

	return (
		<>
			<AnimatePresence mode="popLayout">
				{quizState === QuizState.START && (
					// <motion.div key={0} style={{ display: "flex" }} variants={motionVariants} initial="initial" animate="animate" transition="transition" exit="exit">
					<MotionWrapper key={-1}>
						<IntroPage onStart={handleStart} />
					</MotionWrapper>
					// </motion.div>
				)}

				{quizState === QuizState.QUESTION && (
					<MotionWrapper key={currentQuestion}>
						<QuestionPage question={quizData.questions[currentQuestion]} onAnswer={handleAnswer} />
					</MotionWrapper>
				)}

				{quizState === QuizState.RESULT && (
					<MotionWrapper key={maxQuestions}>
						<ResultPage onRestart={handleStart} />
					</MotionWrapper>
				)}
			</AnimatePresence>
		</>
	);
};

export const IntroPage = ({ onStart }: { onStart: () => void }) => {
	return (
		<div>
			<h1>Welcome to the Quiz</h1>
			<button onClick={onStart}>Start Quiz</button>
		</div>
	);
};

const QuestionPage = ({ question, onAnswer }: { question: any; onAnswer: (answerIdx: number) => void }) => {
	return (
		<div>
			<h2>Question 1</h2>
			<p>{question.question}</p>
			{question.answers.map((item: object, index: number) => (
				<button key={index} onClick={() => onAnswer(index)}>
					{item.answer}
				</button>
			))}
		</div>
	);
};

export const ResultPage = ({ onRestart }: { onRestart: () => void }) => {
	return (
		<div>
			<h1>Your results:</h1>
			<button onClick={onRestart}>Play again</button>
		</div>
	);
};

// const motionVariants = {
// 	initial: { opacity: 0, scale: 0 },
// 	animate: { opacity: 1, scale: 1 },
// 	transition: {
// 		duration: 0.5,
// 		ease: [0, 0.71, 0.2, 1.01],
// 	},
// 	exit: { opacity: 0, scale: 0 },
// };

type MotionWrapperProps = {
	key: number;
	children: React.ReactNode;
};

const MotionWrapper = forwardRef((props: MotionWrapperProps, ref: ForwardedRef<HTMLDivElement>) => {
	return (
		<motion.div
			key={props.key}
			ref={ref}
			style={{ display: "flex" }}
			initial={{ opacity: 0, scale: 0 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{
				duration: 0.5,
				ease: [0, 0.71, 0.2, 1.01],
			}}
			exit={{ opacity: 0, scale: 0 }}
		>
			{props.children}
		</motion.div>
	);
});

export default Quiz;
