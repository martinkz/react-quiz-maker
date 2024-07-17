import styles from "./styles.module.css";
import { AnswerButtonState, QuizState, useQuiz, type QuizContextProps } from "./QuizContext";
import { AnswerButton, StartButton, QuestionNextButton, ExplainerNextButton } from "./QuizButtons";
import { MotionWrapper, MotionScale, MotionSlideUp, AnimatePresenceWithDisable } from "./MotionWrapper";
import { ProgressBar } from "./QuizProgressBar";
import { findReactChild } from "./utility";
import { motion } from "framer-motion";
import React from "react";

type NoPropsFC = React.FC<Record<string, never>>;
interface QuizProps {
	components?: {
		IntroPage?: React.FC<QuizContextProps>;
		QuestionWrapper?: React.FC<{ children: React.ReactNode }>;
		QuestionHeader?: React.FC<QuizContextProps>;
		QuestionBody?: React.FC<QuizContextProps>;
		QuestionPage?: React.FC<{ children: React.ReactNode }>;
		ExplainerPage?: React.FC<QuizContextProps>;
		ResultPage?: React.FC<QuizContextProps>;
	};
	children?: React.ReactNode;
}

export const Quiz = ({ components, children }: QuizProps) => {
	const { IntroPage, QuestionWrapper, QuestionHeader, QuestionBody, QuestionPage, ExplainerPage, ResultPage } =
		components || {};

	const state = useQuiz();
	const { quizState, currentQuestion, maxQuestions, explainerVisible, config } = state;

	if (!config) {
		throw new Error("No config object provided");
	}

	const { explainerNewPage } = config;

	// const hideQuestionOnExplainer = explainerNewPage && (explainerVisible || explainerClosed);
	const hideQuestionOnExplainer = explainerNewPage && explainerVisible;

	const IntroChild = findReactChild(children, "IntroPage");
	const ResultChild = findReactChild(children, "ResultPage");
	const QuestionWrapperChild = findReactChild(children, "QuestionWrapper");
	const QuestionWrapperChildren = QuestionWrapperChild?.props?.children;
	const QuestionHeaderChild = findReactChild(QuestionWrapperChildren, "QuestionHeader");
	const QuestionPageChild = findReactChild(QuestionWrapperChildren, "QuestionPage");

	const QuestionPageChildren = QuestionPageChild?.props?.children;
	const QuestionBodyChild = findReactChild(QuestionPageChildren, "QuestionBody");
	const QuestionExplainerChild = findReactChild(QuestionPageChildren, "ExplainerPage");

	// Component function props
	const IntroPageComponent = IntroPage && <IntroPage {...state} />;
	const QuestionWrapperComponent = QuestionWrapper || Quiz.QuestionWrapper;
	const QuestionPageComponent = QuestionPage || Quiz.QuestionPage;
	const QuestionHeaderComponent = QuestionHeader && <QuestionHeader {...state} />;
	const QuestionBodyComponent = QuestionBody && <QuestionBody {...state} />;
	const ExplainerPageComponent = ExplainerPage && <ExplainerPage {...state} />;
	const ResultPageComponent = ResultPage && <ResultPage {...state} />;

	// Children components or components from props or local components
	const Intro = IntroChild || IntroPageComponent || <Quiz.IntroPage state={state} />;
	const Header = QuestionHeaderChild || QuestionHeaderComponent || <Quiz.QuestionHeader state={state} />;
	const Body = QuestionBodyChild || QuestionBodyComponent || <Quiz.QuestionBody state={state} />;
	const Explainer = QuestionExplainerChild || ExplainerPageComponent || <Quiz.ExplainerPage state={state} />;
	const Result = ResultChild || ResultPageComponent || <Quiz.ResultPage state={state} />;

	return (
		<>
			<AnimatePresenceWithDisable>
				{quizState === QuizState.START && (
					<MotionWrapper motionProps={MotionSlideUp} key={-1}>
						{Intro}
					</MotionWrapper>
					// <motion.div key={-1} {...MotionSlideUp}>
					// 	{Intro}
					// </motion.div>
				)}

				{quizState === QuizState.QUESTION && (
					<MotionWrapper key={-2}>
						<QuestionWrapperComponent>
							{/* <motion.div key={-3} {...MotionSlideUp}>
							{Header}
						</motion.div> */}
							<MotionWrapper motionProps={MotionSlideUp} key={-3}>
								{Header}
							</MotionWrapper>
							<MotionWrapper motionProps={MotionSlideUp} key={-4}>
								<QuestionPageComponent>
									<AnimatePresenceWithDisable>
										{!hideQuestionOnExplainer && (
											<MotionWrapper motionProps={MotionSlideUp} key={currentQuestion.index}>
												{Body}
											</MotionWrapper>
											// <motion.div {...MotionSlideUp} key={currentQuestion.index}>
											// 	{Body}
											// </motion.div>
										)}
										{explainerVisible && (
											<MotionWrapper motionProps={MotionScale} key={-5}>
												{Explainer}
											</MotionWrapper>
											// <motion.div {...MotionScale} key={-5}>
											// 	{Explainer}
											// </motion.div>
										)}
									</AnimatePresenceWithDisable>
								</QuestionPageComponent>
							</MotionWrapper>
						</QuestionWrapperComponent>
					</MotionWrapper>
				)}

				{quizState === QuizState.RESULT && (
					// <motion.div key={maxQuestions} {...MotionSlideUp}>
					// 	{Result}
					// </motion.div>
					<MotionWrapper motionProps={MotionSlideUp} key={maxQuestions}>
						{Result}
					</MotionWrapper>
				)}
			</AnimatePresenceWithDisable>
		</>
	);
};

Quiz.ProgressBar = ProgressBar;

Quiz.StartButton = StartButton;
Quiz.QuestionNextButton = QuestionNextButton;
Quiz.ExplainerNextButton = ExplainerNextButton;
Quiz.AnswerButton = AnswerButton;

function QuestionWrapper({ children }: { children: React.ReactNode }) {
	return (
		<div className="question-wrapper-default" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
			{children}
		</div>
	);
}

QuestionWrapper.displayName = "QuestionWrapper";
Quiz.QuestionWrapper = QuestionWrapper;

function QuestionPage({ children }: { children: React.ReactNode }) {
	return <div className="question-page-default">{children}</div>;
}

QuestionPage.displayName = "QuestionPage";
Quiz.QuestionPage = QuestionPage;

const QuestionHeader = ({ children, state }: { children?: React.ReactNode; state: QuizContextProps }) => {
	const { progress } = state;
	return (
		<>
			{children || (
				<div className="question-header-default">
					<div>
						<progress className={styles.progress} max="100" value={progress}></progress>
					</div>
				</div>
			)}
		</>
	);
};

QuestionHeader.displayName = "QuestionHeader";
Quiz.QuestionHeader = QuestionHeader;

const IntroPage = ({ children, state }: { children?: React.ReactNode; state: QuizContextProps }) => {
	return (
		<>
			{children || (
				<div className="intro-page-default">
					<h1>Welcome to the Quiz</h1>
					<Quiz.StartButton state={state}>Start quiz</Quiz.StartButton>
				</div>
			)}
		</>
	);
};

IntroPage.displayName = "IntroPage";
Quiz.IntroPage = IntroPage;

const QuestionBody = ({ children, state }: { children?: React.ReactNode; state: QuizContextProps }) => {
	const { config, currentQuestion } = state;
	const { autoResume } = config || {};

	return (
		<>
			{children || (
				<div className="question-body-default">
					<h2>Question {currentQuestion.index}</h2>
					<p>{currentQuestion.question}</p>
					{currentQuestion.answers.map((item: any, index: number) => (
						<Quiz.AnswerButton key={index} index={index} state={state}>
							{item.answer}
						</Quiz.AnswerButton>
						// <span key={index}>
						// 	<input type="radio" id={item.answer} name="answer" value={item.answer} />
						// 	<label htmlFor={item.answer}>{item.answer}</label>
						// </span>
					))}
					{!autoResume && (
						<p>
							<Quiz.QuestionNextButton state={state}>Next</Quiz.QuestionNextButton>
						</p>
					)}
				</div>
			)}
		</>
	);
};

QuestionBody.displayName = "QuestionBody";
Quiz.QuestionBody = QuestionBody;

const ExplainerPage = ({ children, state }: { children?: React.ReactNode; state: QuizContextProps }) => {
	const { currentQuestion } = state;
	return (
		<>
			{children || (
				<div className="question-explainer-default">
					<>
						<h1>Explainer</h1>
						<p>{currentQuestion.explanation}</p>
						<p>
							<Quiz.ExplainerNextButton state={state}>Next</Quiz.ExplainerNextButton>
						</p>
					</>
				</div>
			)}
		</>
	);
};

ExplainerPage.displayName = "ExplainerPage";
Quiz.ExplainerPage = ExplainerPage;

const ResultPage = ({ children, state }: { children?: React.ReactNode; state: QuizContextProps }) => {
	const { result } = state;
	return (
		<>
			{children || (
				<div className="result-page-default">
					<h1>Your results is: {result}</h1>
					<Quiz.StartButton state={state}>Play again</Quiz.StartButton>
				</div>
			)}
		</>
	);
};

ResultPage.displayName = "ResultPage";
Quiz.ResultPage = ResultPage;
