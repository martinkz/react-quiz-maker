import { useState, forwardRef, ComponentProps, ForwardedRef } from "react";
// import styles from "./styles.module.css";

import { motion, AnimatePresence } from "framer-motion";

import { evaluateScore, evaluatePersonality } from "./utility";

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

enum QuizType {
	SCORED = "scored",
	PERSONALITY = "personality",
	CUSTOM = "custom",
}

export type userAnswer = {
	index: number;
	result: string;
};

export const Quiz = ({ quizData }: QuizProps) => {
	const [quizState, setQuizState] = useState<QuizState>(QuizState.START);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [userAnswers, setUserAnswers] = useState<Array<userAnswer>>([]);
	const [result, setResult] = useState<number | string | null>(null);
	const maxQuestions = quizData.questions.length;
	const quizType: QuizType = quizData.type;
	// console.log(quizData, children);

	function handleAnswer(answerIdx: number, answerResult: string) {
		const updatedUserAnswers = [...userAnswers, { index: answerIdx, result: answerResult }];

		setUserAnswers(updatedUserAnswers);

		if (currentQuestion === maxQuestions - 1) {
			const result = quizType === QuizType.SCORED ? evaluateScore(updatedUserAnswers) : evaluatePersonality(updatedUserAnswers);
			setResult(result);
			console.log("Your result is: ", result);
			setQuizState(QuizState.RESULT);
			return;
		}

		setCurrentQuestion(currentQuestion + 1);
	}

	function handleStart() {
		setQuizState(QuizState.QUESTION);
		setCurrentQuestion(0);
		setUserAnswers([]);
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
						<ResultPage result={result} onRestart={handleStart} />
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

const QuestionPage = ({ question, onAnswer }: { question: any; onAnswer: (answerIdx: number, answerResult: string) => void }) => {
	return (
		<div>
			<h2>Question 1</h2>
			<p>{question.question}</p>
			{question.answers.map((item: any, index: number) => (
				<button key={index} onClick={() => onAnswer(index, item.result)}>
					{item.answer}
				</button>
			))}
		</div>
	);
};

export const ResultPage = ({ result, onRestart }: { result: number | string | null; onRestart: () => void }) => {
	return (
		<div>
			<h1>Your results is: {result}</h1>
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
