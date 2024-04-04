import { forwardRef, ForwardedRef } from "react";
// import styles from "./styles.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { findReactChild } from "./utility";
import { useQuiz } from "./QuizContext";

export type QuizProps = {
	quizData: any;
	children?: React.ReactNode;
};

export enum QuizState {
	START,
	QUESTION,
	RESULT,
}

export type UserAnswer = {
	index: number;
	result: string;
};

export type QuizResult = number | string | null;

export const Quiz = ({ quizData, children }: QuizProps) => {
	const { quizState, currentQuestion, result, maxQuestions, handleStart, handleAnswer } = useQuiz();

	// console.log("Quiz: ", quizState);

	const IntroChild = findReactChild(children, "IntroPage");

	return (
		<>
			<AnimatePresence mode="popLayout">
				{quizState === QuizState.START && (
					// <motion.div key={0} style={{ display: "flex" }} variants={motionVariants} initial="initial" animate="animate" transition="transition" exit="exit">
					<MotionWrapper key={-1}>{IntroChild || <Quiz.IntroPage onStart={handleStart} />}</MotionWrapper>
					// </motion.div>
				)}

				{quizState === QuizState.QUESTION && (
					<MotionWrapper key={currentQuestion}>
						<QuestionPage question={quizData.questions[currentQuestion]} onAnswer={handleAnswer}>
							Question children
						</QuestionPage>
					</MotionWrapper>
				)}

				{quizState === QuizState.RESULT && (
					<MotionWrapper key={maxQuestions}>
						<ResultPage result={result} onRestart={handleStart} />
					</MotionWrapper>
				)}
			</AnimatePresence>
		</>
	);
};

const IntroPage = ({ onStart, children }: { onStart?: () => void; children?: React.ReactNode }) => {
	return (
		<div>
			{children || (
				<>
					<h1>Welcome to the Quiz</h1>
					<button onClick={onStart}>Start Quiz</button>
				</>
			)}
		</div>
	);
};

IntroPage.__displayName = "IntroPage";
Quiz.IntroPage = IntroPage;

export type Question = {
	question: any;
	onAnswer: (userAnswer: UserAnswer) => void;
	children?: React.ReactNode;
};

const QuestionPage = ({ question, onAnswer, children }: Question) => {
	console.log(children);

	return (
		<div>
			<h2>Question 1</h2>
			<p>{question.question}</p>
			{question.answers.map((item: any, index: number) => (
				<button key={index} onClick={() => onAnswer({ index: index, result: item.result })}>
					{item.answer}
				</button>
			))}
		</div>
	);
};

const ResultPage = ({ result, onRestart }: { result: QuizResult; onRestart: () => void }) => {
	return (
		<div>
			<h1>Your results is: {result}</h1>
			<button onClick={onRestart}>Play again</button>
		</div>
	);
};

Quiz.ResultPage = ResultPage;

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
