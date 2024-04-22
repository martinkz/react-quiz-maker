import { AnimatePresence } from "framer-motion";
import { findReactChild } from "./utility";
import { QuizState, useQuiz } from "./QuizContext";
import { AnswerButton, StartButton, QuestionNextButton, ExplainerNextButton } from "./QuizButtons";
import { MotionWrapper } from "./MotionWrapper";
import { ProgressBar } from "./QuizProgressBar";

export const Quiz = ({ children }: { children?: React.ReactNode }) => {
	const { quizState, currentQuestion, maxQuestions, explainerVisible, config } = useQuiz();

	if (!config) {
		throw new Error("No config object provided");
	}

	const { animation, answerExplainerOnNewPage } = config;

	const HeaderChild = findReactChild(children, "Header");
	const IntroChild = findReactChild(children, "IntroPage");
	const QuestionChild = findReactChild(children, "QuestionPage");
	const ExplainerChild = findReactChild(children, "ExplainerPage");
	const ResultPage = findReactChild(children, "ResultPage");

	const hideQuestionOnExplainer = answerExplainerOnNewPage && explainerVisible;
	const animatePresenceMode = animation === "slide" ? "sync" : "popLayout";

	return (
		<>
			<AnimatePresence mode={animatePresenceMode}>
				{quizState === QuizState.QUESTION && <MotionWrapper key={-2}>{HeaderChild || <Quiz.Header />}</MotionWrapper>}

				{quizState === QuizState.START && (
					// <motion.div key={0} style={{ display: "flex" }} variants={motionVariants} initial="initial" animate="animate" transition="transition" exit="exit">
					<MotionWrapper key={-1}>{IntroChild || <Quiz.IntroPage />}</MotionWrapper>
					// </motion.div>
				)}

				{quizState === QuizState.QUESTION && !hideQuestionOnExplainer && (
					<MotionWrapper key={currentQuestion}>{QuestionChild || <Quiz.QuestionPage />}</MotionWrapper>
				)}

				{quizState === QuizState.QUESTION && explainerVisible && (
					<MotionWrapper key={currentQuestion + maxQuestions + 1}>
						{ExplainerChild || <Quiz.ExplainerPage />}
					</MotionWrapper>
				)}

				{quizState === QuizState.RESULT && (
					<MotionWrapper key={maxQuestions}>{ResultPage || <Quiz.ResultPage />}</MotionWrapper>
				)}
			</AnimatePresence>
		</>
	);
};

Quiz.ProgressBar = ProgressBar;

Quiz.StartButton = StartButton;
Quiz.QuestionNextButton = QuestionNextButton;
Quiz.ExplainerNextButton = ExplainerNextButton;
Quiz.AnswerButton = AnswerButton;

const Header = ({ children }: { children?: React.ReactNode }) => {
	return (
		<div>
			{children || (
				<>
					<div>
						<Quiz.ProgressBar />
					</div>
				</>
			)}
		</div>
	);
};

Header.displayName = "Header";
Quiz.Header = Header;

const IntroPage = ({ children }: { children?: React.ReactNode }) => {
	return (
		<div>
			{children || (
				<>
					<h1>Welcome to the Quiz</h1>
					{/* <Quiz.Button onClick={onStart}>Start Quiz</Quiz.Button> */}
					<Quiz.StartButton>Start Quiz</Quiz.StartButton>
				</>
			)}
		</div>
	);
};

IntroPage.displayName = "IntroPage";
Quiz.IntroPage = IntroPage;

const QuestionPage = ({ children }: { children?: React.ReactNode }) => {
	const { quizData, config, currentQuestion, currentQuestionData, explainerVisible } = useQuiz();
	const { nextButton, revealAnswer } = config || {};
	// console.log(nextButton, revealAnswer);

	return (
		<div>
			{children || (
				<>
					<h2>Question {currentQuestion + 1}</h2>
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
							<Quiz.QuestionNextButton>Next</Quiz.QuestionNextButton>
						</p>
					)}
				</>
			)}
		</div>
	);
};

QuestionPage.displayName = "QuestionPage";
Quiz.QuestionPage = QuestionPage;

const ExplainerPage = ({ children }: { children?: React.ReactNode }) => {
	return (
		<div>
			{children || (
				<>
					<h1>Explainer</h1>
					<p>Explanation of the answer</p>
					<p>
						<Quiz.ExplainerNextButton>Next</Quiz.ExplainerNextButton>
					</p>
				</>
			)}
		</div>
	);
};

ExplainerPage.displayName = "ExplainerPage";
Quiz.ExplainerPage = ExplainerPage;

const ResultPage = ({ children }: { children?: React.ReactNode }) => {
	const { result } = useQuiz();
	return (
		<div>
			{children || (
				<>
					<h1>Your results is: {result}</h1>
					<Quiz.StartButton>Play again</Quiz.StartButton>
				</>
			)}
		</div>
	);
};

ResultPage.displayName = "ResultPage";
Quiz.ResultPage = ResultPage;

export default Quiz;
