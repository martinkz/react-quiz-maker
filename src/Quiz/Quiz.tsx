import styles from "./styles.module.css";
import { AnimatePresence } from "framer-motion";
import { AnswerButtonState, QuizState, useQuiz, type QuizContextProps } from "./QuizContext";
import { AnswerButton, StartButton, QuestionNextButton, ExplainerNextButton } from "./QuizButtons";
import { MotionWrapper } from "./MotionWrapper";
import { ProgressBar } from "./QuizProgressBar";
import { findReactChild } from "./utility";
import React from "react";

type NoPropsFC = React.FC<Record<string, never>>;
interface QuizProps {
	IntroPage?: NoPropsFC;
	QuestionHeader?: NoPropsFC;
	QuestionBody: React.FC<QuizContextProps>;
	QuestionPage?: React.FC<{ children: React.ReactNode }>;
	ExplainerPage?: NoPropsFC;
	ResultPage?: NoPropsFC;
	children?: React.ReactNode;
}

export const Quiz = ({
	IntroPage,
	QuestionHeader,
	QuestionBody,
	QuestionPage,
	ExplainerPage,
	ResultPage,
	children,
}: QuizProps) => {
	const state = useQuiz();
	const { quizState, currentQuestion, currentQuestionData, answerButtonState, maxQuestions, explainerVisible, config } =
		state;

	if (!config) {
		throw new Error("No config object provided");
	}

	const { animation, answerExplainerOnNewPage } = config;

	const hideQuestionOnExplainer = answerExplainerOnNewPage && explainerVisible;
	const animatePresenceMode = animation === "slide" ? "sync" : "popLayout";

	// const IntroChild = findReactChild(children, "IntroPage");
	// const ResultChild = findReactChild(children, "ResultPage");
	// const QuestionPageChild = findReactChild(children, "QuestionPage");
	// const QuestionPageChildren = QuestionPageChild?.props?.children;
	// const QuestionHeaderChild = findReactChild(QuestionPageChildren, "QuestionHeader");
	// const QuestionBodyChild = findReactChild(QuestionPageChildren, "QuestionPage");
	// const QuestionExplainerChild = findReactChild(QuestionPageChildren, "ExplainerPage");

	const IntroChild = null;
	const ResultChild = null;
	const QuestionPageChild = null;
	const QuestionPageChildren = null;
	const QuestionHeaderChild = null;
	const QuestionBodyChild = null;
	const QuestionExplainerChild = null;

	// Component function props or local component
	const IntroPageComponent = IntroPage || Quiz.IntroPage;
	const QuestionPageComponent = QuestionPage || Quiz.QuestionPage;
	const QuestionHeaderComponent = QuestionHeader || Quiz.QuestionHeader;
	const QuestionBodyComponent = QuestionBody || Quiz.QuestionBody;
	const ExplainerPageComponent = ExplainerPage || Quiz.ExplainerPage;
	const ResultPageComponent = ResultPage || Quiz.ResultPage;

	// Children components or components from props
	const Intro = IntroChild || <IntroPageComponent />;
	const Header = QuestionHeaderChild || <QuestionHeaderComponent />;
	const Body = QuestionBodyChild || <QuestionBodyComponent {...state} />;
	const Explainer = QuestionExplainerChild || <ExplainerPageComponent />;
	const Result = ResultChild || <ResultPageComponent />;

	return (
		<>
			<AnimatePresence mode={animatePresenceMode}>
				{/* {quizState === QuizState.QUESTION && <MotionWrapper key={-2}>{QuestionHeaderChild || <Quiz.QuestionHeader />}</MotionWrapper>} */}

				{quizState === QuizState.START && <MotionWrapper key={-1}>{Intro}</MotionWrapper>}

				{quizState === QuizState.QUESTION && (
					<MotionWrapper key={-2}>
						<QuestionPageComponent>
							<AnimatePresence mode={animatePresenceMode}>
								<MotionWrapper key={-3}>{Header}</MotionWrapper>
								{!hideQuestionOnExplainer && (
									<MotionWrapper key={currentQuestion + maxQuestions + 1}>{Body}</MotionWrapper>
								)}
								{explainerVisible && <MotionWrapper key={-4}>{Explainer}</MotionWrapper>}
							</AnimatePresence>
						</QuestionPageComponent>
					</MotionWrapper>
				)}

				{quizState === QuizState.RESULT && <MotionWrapper key={maxQuestions}>{Result}</MotionWrapper>}
			</AnimatePresence>
		</>
	);
};

Quiz.ProgressBar = ProgressBar;

Quiz.StartButton = StartButton;
Quiz.QuestionNextButton = QuestionNextButton;
Quiz.ExplainerNextButton = ExplainerNextButton;
Quiz.AnswerButton = AnswerButton;

function QuestionPage({ children }: { children: React.ReactNode }) {
	return <div className="question-wrap">{children}</div>;
}

QuestionPage.displayName = "QuestionPage";
Quiz.QuestionPage = QuestionPage;

const QuestionHeader = ({ children }: { children?: React.ReactNode }) => {
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

QuestionHeader.displayName = "QuestionHeader";
Quiz.QuestionHeader = QuestionHeader;

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

const QuestionBody = ({ children, currentQuestion2 }: { children?: React.ReactNode; currentQuestion2: number }) => {
	const { quizData, config, currentQuestion, currentQuestionData, explainerVisible } = useQuiz();
	const { nextButton, revealAnswer } = config || {};
	// console.log(nextButton, revealAnswer);

	return (
		<div>
			{children || (
				<>
					<h2>Question {currentQuestion2 + 1}</h2>
					<p>{currentQuestionData.question}</p>
					{currentQuestionData.answers.map((item: any, index: number) => (
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

QuestionBody.displayName = "QuestionBody";
Quiz.QuestionBody = QuestionBody;

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
