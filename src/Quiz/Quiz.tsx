import styles from "./styles.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { findReactChild } from "./utility";
import { QuizState, useQuiz } from "./QuizContext";
import { AnswerButton, StartButton, QuestionNextButton, ExplainerNextButton } from "./QuizButtons";
import { MotionScaleProps, MotionWrapper } from "./MotionWrapper";
import { ProgressBar } from "./QuizProgressBar";

interface QuizProps {
	IntroPage?: React.ReactNode;
	QuestionHeader?: React.ReactNode;
	QuestionHeader2?: React.FC<Record<string, unknown>>;
	QuestionBody?: React.ReactNode;
	QuestionWrapper?: React.FC<{ children: React.ReactNode }>;
	ExplainerPage?: React.ReactNode;
	ResultPage?: React.ReactNode;
}

export const Quiz = ({
	IntroPage,
	QuestionHeader,
	QuestionHeader2,
	QuestionBody,
	QuestionWrapper,
	ExplainerPage,
	ResultPage,
}: QuizProps) => {
	const { quizState, currentQuestion, maxQuestions, explainerVisible, config } = useQuiz();

	if (!config) {
		throw new Error("No config object provided");
	}

	const { animation, answerExplainerOnNewPage } = config;

	// const HeaderChild = findReactChild(children, "Header");
	// const IntroChild = findReactChild(children, "IntroPage");
	// const QuestionChild = findReactChild(children, "QuestionPage");
	// const ExplainerChild = findReactChild(children, "ExplainerPage");
	// const ResultPage = findReactChild(children, "ResultPage");

	const hideQuestionOnExplainer = answerExplainerOnNewPage && explainerVisible;
	const animatePresenceMode = animation === "slide" ? "sync" : "popLayout";

	const QuestionWrapperComponent = QuestionWrapper || QuestionWrapperDefault;
	// const QuestionHeaderComponent = QuestionHeader || Quiz.Header;

	const MotionQuestionHeader = motion(QuestionHeader2!);

	// console.log(QuestionHeader?.props);

	return (
		<>
			<AnimatePresence mode={animatePresenceMode}>
				{/* {quizState === QuizState.QUESTION && <MotionWrapper key={-2}>{HeaderChild || <Quiz.Header />}</MotionWrapper>} */}

				{quizState === QuizState.START && <MotionWrapper key={-1}>{IntroPage || <Quiz.IntroPage />}</MotionWrapper>}

				{quizState === QuizState.QUESTION && (
					<MotionWrapper key={-5}>
						<QuestionWrapperComponent>
							<AnimatePresence mode={animatePresenceMode}>
								<MotionWrapper key={-444}>{QuestionHeader}</MotionWrapper>
								<MotionQuestionHeader key={-2} {...MotionScaleProps} />
								{!hideQuestionOnExplainer && (
									<MotionWrapper key={currentQuestion + maxQuestions + 1}>
										{QuestionBody || <Quiz.QuestionPage />}
									</MotionWrapper>
								)}
								{explainerVisible && <MotionWrapper key={-3}>{ExplainerPage || <Quiz.ExplainerPage />}</MotionWrapper>}
							</AnimatePresence>
						</QuestionWrapperComponent>
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

function QuestionWrapperDefault({ children }: { children: React.ReactNode }) {
	return <div className="question-wrap">{children}</div>;
}

const Header = ({ children }: { children?: React.ReactNode }) => {
	const { progress } = useQuiz();
	return (
		<div>
			{children || (
				<>
					<div>
						<progress className={styles.progress} max="100" value={progress}></progress>
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
