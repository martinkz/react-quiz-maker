import { forwardRef, ForwardedRef } from "react";
// import styles from "./styles.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { findReactChild } from "./utility";
import { useQuiz } from "./QuizContext";

export type QuizProps = {
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

export const Quiz = ({ children }: QuizProps) => {
	const { quizData, quizState, currentQuestion, result, maxQuestions, handleStart, handleAnswer } = useQuiz();

	// console.log("Quiz: ", quizState);

	const IntroChild = findReactChild(children, "IntroPage");
	const QuestionChild = findReactChild(children, "QuestionPage");
	const ResultPage = findReactChild(children, "ResultPage");

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
						{QuestionChild || (
							<Quiz.QuestionPage question={quizData.questions[currentQuestion]} onAnswer={handleAnswer} />
						)}
					</MotionWrapper>
				)}

				{quizState === QuizState.RESULT && (
					<MotionWrapper key={maxQuestions}>
						{ResultPage || <Quiz.ResultPage result={result} onRestart={handleStart} />}
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
					{/* <Quiz.Button onClick={onStart}>Start Quiz</Quiz.Button> */}
					<button onClick={onStart}>Start Quiz</button>
				</>
			)}
		</div>
	);
};

IntroPage.__displayName = "IntroPage";
Quiz.IntroPage = IntroPage;

const AnswerButton = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
	return <button onClick={onClick}>{children}</button>;
};

Quiz.AnswerButton = AnswerButton;

export type Question = {
	question?: any;
	onAnswer?: (userAnswer: UserAnswer) => void;
	children?: React.ReactNode;
};

const QuestionPage = ({ question, onAnswer = () => {}, children }: Question) => {
	return (
		<div>
			{children || (
				<>
					<h2>Question 1</h2>
					<p>{question.question}</p>
					{question.answers.map((item: any, index: number) => (
						<button key={index} onClick={() => onAnswer({ index: index, result: item.result })}>
							{item.answer}
						</button>
					))}
				</>
			)}
		</div>
	);
};

QuestionPage.__displayName = "QuestionPage";
Quiz.QuestionPage = QuestionPage;

export type Result = {
	result?: QuizResult;
	onRestart?: () => void;
	children?: React.ReactNode;
};

const ResultPage = ({ children, result, onRestart }: Result) => {
	return (
		<div>
			{children || (
				<>
					<h1>Your results is: {result}</h1>
					<button onClick={onRestart}>Play again</button>
				</>
			)}
		</div>
	);
};

ResultPage.__displayName = "ResultPage";
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
	// return <>{props.children}</>;
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
