import { forwardRef, ForwardedRef, memo } from "react";
// import styles from "./styles.module.css";
import { motion, AnimatePresence, stagger } from "framer-motion";
import { findReactChild, findIndexes } from "./utility";
import { QuizType, QuizState, AnimationVariants, AnswerButtonState, useQuiz } from "./QuizContext";

export type QuizProps = {
	children?: React.ReactNode;
};

export type UserAnswer = {
	index: number;
	result: string;
};

export type QuizResult = number | string | null;

export const Quiz = ({ children }: QuizProps) => {
	const { quizState, currentQuestion, result, maxQuestions, handleStart, showExplainer, config } = useQuiz();

	if (!config) {
		throw new Error("No config object provided");
	}

	const { animation } = config;

	// console.log("Quiz: ", quizState);

	const IntroChild = findReactChild(children, "IntroPage");
	const QuestionChild = findReactChild(children, "MotionQuestionPage");
	const ExplainerChild = findReactChild(children, "ExplainerPage");
	const ResultPage = findReactChild(children, "ResultPage");

	const animatePresenceMode = animation === "slide" ? "sync" : "popLayout";

	return (
		<>
			<AnimatePresence mode={animatePresenceMode}>
				{quizState === QuizState.START && (
					<MotionWrapper key={-1}>{IntroChild || <DefaultIntroPage onStart={handleStart} />}</MotionWrapper>
				)}

				{quizState === QuizState.QUESTION && (
					<MotionWrapper key={currentQuestion}>{QuestionChild || <QuestionPageDefault />}</MotionWrapper>
				)}

				{quizState === QuizState.QUESTION && showExplainer && (
					<MotionWrapper key={currentQuestion + maxQuestions + 1}>
						{ExplainerChild || <Quiz.ExplainerPage />}
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

const DefaultIntroPage = ({ onStart }: { onStart?: () => void }) => {
	return (
		<div>
			<h1>Welcome to the Quiz</h1>
			<button onClick={onStart}>Start Quiz</button>
		</div>
	);
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
	return <div>{children}</div>;
};

const RefWrapper = forwardRef(({ children }: { children: React.ReactNode }, ref: ForwardedRef<HTMLDivElement>) => {
	return <div ref={ref}>{children}</div>;
});

const IntroPage = memo(PageWrapper);
IntroPage.displayName = "IntroPage";
Quiz.IntroPage = IntroPage;

const MotionQuestionPage = motion(RefWrapper, { forwardMotionProps: true });
MotionQuestionPage.displayName = "MotionQuestionPage";
Quiz.MotionQuestionPage = MotionQuestionPage;

const QuestionPage = memo(PageWrapper);
QuestionPage.displayName = "QuestionPage";
Quiz.QuestionPage = QuestionPage;

const AnswerButton = ({ children, index }: { children: React.ReactNode; index: number }) => {
	const {
		config,
		quizData,
		currentQuestion,
		setCurrentAnswer,
		handleAnswer,
		answerButtonState,
		setAnswerButtonState,
		showExplainer,
	} = useQuiz();
	const { nextButton, revealAnswer } = config || {};
	const answers = quizData.questions[currentQuestion].answers;

	// Sometimes the answer buttons re-render with the indexes of the previous question
	// This is a workaround to prevent an error when the next question has fewer answers
	// Currently not needed, but may be needed in the future
	if (answers?.[index] === undefined) {
		return null;
	}

	const quizType = quizData.type;
	const theAnswer = { index: index, result: answers[index].result };
	const showCorrectAnswer = quizType === QuizType.SCORED && revealAnswer === true;
	const btnStateIsSet = answerButtonState[index] !== AnswerButtonState.UNSET;
	const btnDisabled = btnStateIsSet && (showCorrectAnswer || showExplainer);

	const colors = {
		[AnswerButtonState.UNSET]: "#222",
		[AnswerButtonState.DEFAULT]: "#222",
		[AnswerButtonState.SELECTED]: "blue",
		[AnswerButtonState.CORRECT]: "green",
		[AnswerButtonState.INCORRECT]: "red",
	};

	const bgColor = colors[answerButtonState[index]];

	function answerBtnClick() {
		setCurrentAnswer(theAnswer);
		const answerButtonsUpdatedState = getAnswerBtnsNewState(answers, theAnswer, showCorrectAnswer);
		setAnswerButtonState(answerButtonsUpdatedState);
		if (nextButton) {
			// console.log("Next button");
		} else {
			handleAnswer(theAnswer);
		}
	}

	// Update the state of all answer buttons based on the current answer and whether to show the correct answer
	function getAnswerBtnsNewState(answers: any, currentAnswer: UserAnswer, showCorrectAnswer: boolean) {
		const defaultAnswerButtonState = Array(answers.length).fill(AnswerButtonState.DEFAULT);
		const newBtnStateAll = [...defaultAnswerButtonState];
		if (showCorrectAnswer) {
			const correctIndexes = findIndexes(
				answers.map((item: any) => item.result),
				"1"
			);
			const isCorrect = correctIndexes.includes(index);
			const newBtnState = isCorrect ? AnswerButtonState.CORRECT : AnswerButtonState.INCORRECT;
			newBtnStateAll[index] = newBtnState;
			correctIndexes.forEach((index) => (newBtnStateAll[index] = AnswerButtonState.CORRECT));
		} else {
			const isHighlightedForSelected = currentAnswer.index === index;
			if (isHighlightedForSelected) {
				newBtnStateAll[index] = AnswerButtonState.SELECTED;
			}
		}
		return newBtnStateAll;
	}

	return (
		<button style={{ background: bgColor }} onClick={answerBtnClick} disabled={btnDisabled}>
			{children}
		</button>
	);
};
Quiz.AnswerButton = AnswerButton;

const NextButton = ({ children }: { children: React.ReactNode }) => {
	const { currentAnswer, handleAnswer, showExplainer } = useQuiz();

	// if (showExplainer) {
	// 	return null;
	// }

	function nextStep() {
		if (currentAnswer) {
			handleAnswer(currentAnswer);
		}
	}

	return (
		<button onClick={nextStep} disabled={!currentAnswer}>
			{children}
		</button>
	);
};
Quiz.NextButton = NextButton;

const QuestionPageDefault = () => {
	const { quizData, config, currentQuestion, currentQuestionData, showExplainer } = useQuiz();
	const { nextButton, revealAnswer } = config || {};
	// console.log(nextButton, revealAnswer);

	return (
		<div>
			<h2>Question 1</h2>
			<p>{currentQuestionData.question}</p>
			<AnimatePresence>
				<motion.div
					style={{ display: "flex" }}
					key={currentQuestionData.question}
					variants={parentVars}
					initial="initial"
					animate="open"
				>
					{currentQuestionData.answers.map((item: any, index: number) => {
						return (
							<div key={currentQuestion + item.answer + index} style={{ overflow: "hidden" }}>
								<motion.div variants={childVars}>
									<Quiz.AnswerButton index={index}>{item.answer}</Quiz.AnswerButton>
								</motion.div>
							</div>
						);
					})}
				</motion.div>
			</AnimatePresence>
			{nextButton && (
				<p>
					<Quiz.NextButton>Next</Quiz.NextButton>
				</p>
			)}
		</div>
	);
};

// QuestionPage.displayName = "QuestionPage";
// Quiz.QuestionPage = QuestionPage;

const ExplainerPage = ({ children }: { children?: React.ReactNode }) => {
	return (
		<div>
			{children || (
				<>
					<h1>Explainer</h1>
					<p>Explanation of the answer</p>
					<p>
						<Quiz.NextButton>Next</Quiz.NextButton>
					</p>
				</>
			)}
		</div>
	);
};

ExplainerPage.displayName = "ExplainerPage";
Quiz.ExplainerPage = ExplainerPage;

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

ResultPage.displayName = "ResultPage";
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

const MotionWrapper = forwardRef(({ children }: { children: React.ReactNode }, ref: ForwardedRef<HTMLDivElement>) => {
	const { config } = useQuiz();
	if (!config) {
		throw new Error("No config object provided");
	}

	const { animation } = config;

	const wrappers = {
		slide: MotionSlideProps,
		scale: MotionScaleProps,
	};
	return (
		<motion.div ref={ref} {...wrappers[animation!]}>
			{children}
		</motion.div>
	);
});

const parentVars = {
	initial: {
		transition: {
			staggerChildren: 0.2,
			staggerDirection: -1,
		},
	},
	open: {
		transition: {
			delayChildren: 0.3,
			staggerChildren: 0.2,
			staggerDirection: 1,
		},
	},
};

const childVars = {
	style: { display: "inline-block" },
	initial: {
		y: "200px",
		transition: {
			duration: 0.5,
		},
	},
	open: {
		y: 0,
		transition: {
			duration: 0.7,
		},
	},
};

const MotionAnswerButtonContainerProps = {
	initial: { opacity: 0, scale: 0 },
	animate: { opacity: 1, scale: 1 },
	transition: {
		duration: 1,
		delay: 0.7,
		ease: [0, 0.71, 0.2, 1.01],
	},
	// Having exit here causes the question to be duplicated on the next replay
	// exit: { opacity: 0, scale: 0 },
};

const MotionAnswerButtonProps = {
	style: { display: "inline-block" },
	initial: { opacity: 0, scale: 0 },
	animate: { opacity: 1, scale: 1 },
	transition: {
		duration: 1,
		delay: 0.7,
		ease: [0, 0.71, 0.2, 1.01],
	},
	// Having exit here causes the question to be duplicated on the next replay
	// exit: { opacity: 0, scale: 0 },
};

const MotionSlideProps = {
	style: { overflow: "hidden" },
	initial: { height: 0 },
	animate: { height: "auto" },
	transition: {
		duration: 1,
	},
	exit: { height: 0 },
};

const MotionScaleProps = {
	initial: { opacity: 0, scale: 0 },
	animate: { opacity: 1, scale: 1 },
	transition: {
		duration: 1,
		// ease: [0, 0.71, 0.2, 1.01],
	},
	exit: { opacity: 0, scale: 0 },
};

export default Quiz;
