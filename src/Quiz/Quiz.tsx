import { forwardRef, ForwardedRef } from "react";
// import styles from "./styles.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { findReactChild } from "./utility";
import { QuizType, AnswerButtonState, useQuiz } from "./QuizContext";

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
	const { quizData, quizState, currentQuestion, result, maxQuestions, handleStart, handleAnswer, config } = useQuiz();

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
							<Quiz.QuestionPage
							// question={quizData.questions[currentQuestion]}
							// onAnswer={handleAnswer}
							// config={config}
							/>
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

const AnswerButton = ({ children, index }: { children: React.ReactNode; index: number }) => {
	const { config, quizData, currentQuestion, setCurrentAnswer, handleAnswer, answerButtonState, setAnswerButtonState } =
		useQuiz();
	const { nextButton, revealAnswer } = config || {};
	const answers = quizData.questions[currentQuestion].answers;
	const quizType = quizData.type;

	// Sometimes the answer buttons re-render with the indexes of the previous question
	// This is a workaround to prevent an error
	// Currently not needed, but may be needed in the future
	// if (answers?.[index] === undefined) {
	// 	return null;
	// }

	const colors = {
		[AnswerButtonState.DEFAULT]: "#222",
		[AnswerButtonState.SELECTED]: "blue",
		[AnswerButtonState.CORRECT]: "green",
		[AnswerButtonState.INCORRECT]: "red",
	};

	const bgColor = colors[answerButtonState[index]];

	// console.log("AnswerButton: ", index, currentAnswer, answers[index]);

	function nextStep() {
		const theAnswer = { index: index, result: answers[index].result };
		setCurrentAnswer(theAnswer);
		const showCorrectAnswer = quizType === QuizType.SCORED && revealAnswer === "immediate";
		const isHighlightedForSelected = theAnswer.index === index;
		const initialAnswerButtonState = Array(answers.length).fill(AnswerButtonState.DEFAULT);
		const newBtnStateAll = [...initialAnswerButtonState];
		if (showCorrectAnswer) {
			const correctIndex = answers.findIndex((item: any) => item.result === "1");
			const isCorrect = index === correctIndex;
			const newBtnState = isCorrect ? AnswerButtonState.CORRECT : AnswerButtonState.INCORRECT;
			newBtnStateAll[index] = newBtnState;
			newBtnStateAll[correctIndex] = AnswerButtonState.CORRECT;
		} else if (isHighlightedForSelected) {
			newBtnStateAll[index] = AnswerButtonState.SELECTED;
		}
		setAnswerButtonState(newBtnStateAll);
		if (nextButton) {
			// console.log("Next button");
		} else {
			handleAnswer(theAnswer);
		}
	}

	return (
		<button style={{ background: bgColor }} onClick={nextStep}>
			{children}
		</button>
	);
};
Quiz.AnswerButton = AnswerButton;

const NextButton = ({ children }: { children: React.ReactNode }) => {
	const { config, quizData, currentQuestion, handleAnswer } = useQuiz();
	const { nextButton, revealAnswer } = config || {};

	function nextStep() {
		handleAnswer({ index: 0, result: "next" });
	}

	return <button onClick={() => {}}>{children}</button>;
};
Quiz.NextButton = NextButton;

const QuestionPage = ({ children }: { children?: React.ReactNode }) => {
	const { quizData, config, currentQuestion, currentQuestionData, handleAnswer } = useQuiz();
	const { nextButton, revealAnswer } = config || {};
	// console.log(nextButton, revealAnswer);

	return (
		<div>
			{children || (
				<>
					<h2>Question 1</h2>
					<p>{currentQuestionData.question}</p>
					{currentQuestionData.answers.map((item: any, index: number) => (
						// <button key={index} onClick={() => onAnswer({ index: index, result: item.result })}>
						// 	{item.answer}
						// </button>
						<Quiz.AnswerButton key={currentQuestionData.question + index} index={index}>
							{item.answer}
						</Quiz.AnswerButton>
					))}
					{nextButton && (
						<p>
							<Quiz.NextButton>Next</Quiz.NextButton>
						</p>
					)}
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
