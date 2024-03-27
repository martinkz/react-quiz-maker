import { useState, forwardRef, ComponentProps } from "react";
import styles from "./styles.module.css";
import testData from "./testData.json";
import { motion, AnimatePresence } from "framer-motion";

export type ButtonProps = ComponentProps<"button"> & {
	icon?: string;
};

export type QuizProps = {
	quizData: any;
	children?: React.ReactNode;
};

export const Quiz = ({ quizData, children }: QuizProps) => {
	const [count, setCount] = useState(0);
	console.log(quizData, children);

	function handleAnswer(answer: string) {
		setCount(0);
	}

	function handleStart() {
		setCount(1);
	}

	return (
		<>
			<AnimatePresence mode="popLayout">
				{count === 0 && (
					// <motion.div key={0} style={{ display: "flex" }} variants={motionVariants} initial="initial" animate="animate" transition="transition" exit="exit">
					<MotionWrapper key={0}>
						<IntroPage onStart={handleStart} />
					</MotionWrapper>
					// </motion.div>
				)}

				{count === 1 && (
					<MotionWrapper key={1}>
						<QuestionPage question={testData.questions[3]} onAnswer={handleAnswer} />
					</MotionWrapper>
				)}

				{/* <button className={styles.quiz} onClick={() => setCount((count) => (count > 0 ? 0 : 1))}>
					Count is {count}
				</button> */}
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

const QuestionPage = ({ question, onAnswer }: { question: any; onAnswer: (answer: string) => void }) => {
	return (
		<div>
			<h2>Question 1</h2>
			<p>{question.text}</p>
			{question.answers.map((option: string, index: number) => (
				<button key={index} onClick={() => onAnswer(option)}>
					{option}
				</button>
			))}
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

const MotionWrapper = forwardRef((props: MotionWrapperProps, ref: RefObject<HTMLDivElement>) => {
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
