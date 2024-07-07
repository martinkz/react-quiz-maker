import styles from "./styles.module.css";
import { AnimatePresence } from "framer-motion";
import { AnswerButtonState, QuizState, useQuiz, btnColors, type QuizContextProps } from "./QuizContext";
import { AnswerButton, StartButton, QuestionNextButton, ExplainerNextButton } from "./QuizButtons";
import { MotionWrapper } from "./MotionWrapper";
import { ProgressBar } from "./QuizProgressBar";
import { findReactChild } from "./utility";
import React from "react";

type NoPropsFC = React.FC<Record<string, never>>;
interface QuizProps {
	components?: {
		IntroPage?: React.FC<QuizContextProps>;
		QuestionHeader?: React.FC<QuizContextProps>;
		QuestionBody?: React.FC<QuizContextProps>;
		QuestionPage?: React.FC<{ children: React.ReactNode }>;
		ExplainerPage?: React.FC<QuizContextProps>;
		ResultPage?: React.FC<QuizContextProps>;
	};
	children?: React.ReactNode;
}

export const Quiz = ({ components, children }: QuizProps) => {
	const { IntroPage, QuestionHeader, QuestionBody, QuestionPage, ExplainerPage, ResultPage } = components || {};

	const state = useQuiz();
	const { quizState, currentQuestion, maxQuestions, explainerVisible, explainerClosed, config } = state;

	if (!config) {
		throw new Error("No config object provided");
	}

	const { animation, answerExplainerOnNewPage } = config;

	const hideQuestionOnExplainer = answerExplainerOnNewPage && (explainerVisible || explainerClosed);
	const animatePresenceMode = animation === "slide" ? "sync" : "popLayout";

	const IntroChild = findReactChild(children, "IntroPage");
	const ResultChild = findReactChild(children, "ResultPage");
	const QuestionPageChild = findReactChild(children, "QuestionPage");
	const QuestionPageChildren = QuestionPageChild?.props?.children;
	const QuestionHeaderChild = findReactChild(QuestionPageChildren, "QuestionHeader");
	const QuestionBodyChild = findReactChild(QuestionPageChildren, "QuestionPage");
	const QuestionExplainerChild = findReactChild(QuestionPageChildren, "ExplainerPage");

	// const IntroChild = null;
	// const ResultChild = null;
	// const QuestionHeaderChild = null;
	// const QuestionBodyChild = null;
	// const QuestionExplainerChild = null;

	// Component function props or local component
	const IntroPageComponent = (IntroPage && <IntroPage {...state} />) || <Quiz.IntroPage state={state} />;
	const QuestionPageComponent = QuestionPage || Quiz.QuestionPage;
	const QuestionHeaderComponent = (QuestionHeader && <QuestionHeader {...state} />) || (
		<Quiz.QuestionHeader state={state} />
	);
	const QuestionBodyComponent = (QuestionBody && <QuestionBody {...state} />) || <Quiz.QuestionBody state={state} />;
	const ExplainerPageComponent = (ExplainerPage && <ExplainerPage {...state} />) || (
		<Quiz.ExplainerPage state={state} />
	);
	const ResultPageComponent = (ResultPage && <ResultPage {...state} />) || <Quiz.ResultPage state={state} />;

	// Children components or components from props
	const Intro = IntroChild || IntroPageComponent;
	const Header = QuestionHeaderChild || QuestionHeaderComponent;
	const Body = QuestionBodyChild || QuestionBodyComponent;
	const Explainer = QuestionExplainerChild || ExplainerPageComponent;
	const Result = ResultChild || ResultPageComponent;

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

const QuestionHeader = ({ children, state }: { children?: React.ReactNode; state: QuizContextProps }) => {
	const { progress } = state;
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

const IntroPage = ({ children, state }: { children?: React.ReactNode; state: QuizContextProps }) => {
	return (
		<div>
			{children || (
				<>
					<h1>Welcome to the Quiz</h1>
					<Quiz.StartButton state={state}>Start Quiz</Quiz.StartButton>
				</>
			)}
		</div>
	);
};

IntroPage.displayName = "IntroPage";
Quiz.IntroPage = IntroPage;

const QuestionBody = ({ children, state }: { children?: React.ReactNode; state: QuizContextProps }) => {
	const { config, currentQuestion, currentQuestionData } = state;
	const { nextButton } = config || {};

	return (
		<div>
			{children || (
				<>
					<h2>Question {currentQuestion + 1}</h2>
					<p>{currentQuestionData.question}</p>
					{currentQuestionData.answers.map((item: any, index: number) => (
						<Quiz.AnswerButton key={currentQuestionData.question + index} index={index} state={state}>
							{item.answer}
						</Quiz.AnswerButton>
					))}
					{nextButton && (
						<p>
							<Quiz.QuestionNextButton state={state}>Next</Quiz.QuestionNextButton>
						</p>
					)}
				</>
			)}
		</div>
	);
};

QuestionBody.displayName = "QuestionBody";
Quiz.QuestionBody = QuestionBody;

const ExplainerPage = ({ children, state }: { children?: React.ReactNode; state: QuizContextProps }) => {
	return (
		<div>
			{children || (
				<>
					<h1>Explainer</h1>
					<p>Explanation of the answer</p>
					<p>
						<Quiz.ExplainerNextButton state={state}>Next</Quiz.ExplainerNextButton>
					</p>
				</>
			)}
		</div>
	);
};

ExplainerPage.displayName = "ExplainerPage";
Quiz.ExplainerPage = ExplainerPage;

const ResultPage = ({ children, state }: { children?: React.ReactNode; state: QuizContextProps }) => {
	const { result } = state;
	return (
		<div>
			{children || (
				<>
					<h1>Your results is: {result}</h1>
					<Quiz.StartButton state={state}>Play again</Quiz.StartButton>
				</>
			)}
		</div>
	);
};

ResultPage.displayName = "ResultPage";
Quiz.ResultPage = ResultPage;

// export default Quiz;
