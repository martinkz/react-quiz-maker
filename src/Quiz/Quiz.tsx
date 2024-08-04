import { useQuiz, type QuizStateProps } from "./useQuiz";
import { QuizConfig, QuizState, QuizData, QuizAnswer } from "./types";
import { AnswerButton, StartButton, QuestionNextButton, ExplainerNextButton } from "./QuizButtons";
import { MotionWrapper, MotionScale, MotionSlideUp, AnimatePresenceWithDisable } from "./MotionWrapper";
import { findReactChild } from "./utility";
// import { motion } from "framer-motion";
import React, { HTMLAttributes } from "react";

type NoPropsFC = React.FC<Record<string, never>>;

type QuizComponents = {
	IntroPage: React.FC<QuizStateProps>;
	QuestionPage: React.FC<{ children: React.ReactNode }>;
	QuestionHeader: React.FC<QuizStateProps>;
	QuestionBody: React.FC<QuizStateProps>;
	QuestionInnerWrapper: React.FC<{ children: React.ReactNode }>;
	Explainer: React.FC<QuizStateProps>;
	ResultPage: React.FC<QuizStateProps>;
};

interface QuizProps {
	data: QuizData;
	config: QuizConfig;
	parentState?: QuizStateProps; // comes from QuizComposed
	components?: QuizComponents;
	children?: React.ReactNode;
}

export const Quiz = ({ components, children, data, config, parentState }: QuizProps) => {
	const { IntroPage, QuestionPage, QuestionHeader, QuestionBody, QuestionInnerWrapper, Explainer, ResultPage } =
		components || {};

	const localState = useQuiz(data, config);
	const state = parentState || localState; // parentState is used in QuizComposed, in which case localState is ignored

	const { quizState, currentQuestion, maxQuestions, explainerVisible } = state;

	if (!config) {
		throw new Error("No config object provided");
	}

	const { explainerNewPage } = config;

	const hideQuestionOnExplainer = explainerNewPage && explainerVisible;

	// You can pass components as children, see QuizComposed.tsx for an example.
	// This API is somewhat limited and potentially confusing to use, so it might be removed
	const IntroChild = findReactChild(children, "IntroPage");
	const ResultChild = findReactChild(children, "ResultPage");
	const QuestionPageChild = findReactChild(children, "QuestionPage");
	const QuestionPageChildren = QuestionPageChild?.props?.children;
	const QuestionHeaderChild = findReactChild(QuestionPageChildren, "QuestionHeader");
	const QuestionInnerWrapperChild = findReactChild(QuestionPageChildren, "QuestionInnerWrapper");

	const QuestionInnerWrapperChildren = QuestionInnerWrapperChild?.props?.children;
	const QuestionBodyChild = findReactChild(QuestionInnerWrapperChildren, "QuestionBody");
	const QuestionExplainerChild = findReactChild(QuestionInnerWrapperChildren, "Explainer");

	// Component function props
	const IntroPageComponent = IntroPage && <IntroPage {...state} />;
	const QuestionPageComponent = QuestionPage || Quiz.QuestionPage;
	const QuestionInnerWrapperComponent = QuestionInnerWrapper || Quiz.QuestionInnerWrapper;
	const QuestionHeaderComponent = QuestionHeader && <QuestionHeader {...state} />;
	const QuestionBodyComponent = QuestionBody && <QuestionBody {...state} />;
	const ExplainerComponent = Explainer && <Explainer {...state} />;
	const ResultPageComponent = ResultPage && <ResultPage {...state} />;

	// Children components or components from props or local components
	const Intro = IntroPageComponent || IntroChild || <Quiz.IntroPage state={state} />;
	const Header = QuestionHeaderComponent || QuestionHeaderChild || <Quiz.QuestionHeader state={state} />;
	const TheQuestionBody = QuestionBodyComponent || QuestionBodyChild || <Quiz.QuestionBody state={state} />;
	const ExplainerBody = ExplainerComponent || QuestionExplainerChild || <Quiz.Explainer state={state} />;
	const Result = ResultPageComponent || ResultChild || <Quiz.ResultPage state={state} />;

	return (
		<>
			<AnimatePresenceWithDisable config={config}>
				{quizState === QuizState.START && (
					<MotionWrapper config={config} motionProps={MotionSlideUp} key={-1}>
						{Intro}
					</MotionWrapper>
					// <motion.div key={-1} {...MotionSlideUp}>
					// 	{Intro}
					// </motion.div>
				)}

				{quizState === QuizState.QUESTION && (
					<MotionWrapper config={config} key={-2}>
						<QuestionPageComponent>
							{/* <motion.div key={-3} {...MotionSlideUp}>
							{Header}
						</motion.div> */}
							<MotionWrapper config={config} motionProps={MotionSlideUp} key={-3}>
								{Header}
							</MotionWrapper>
							<MotionWrapper config={config} motionProps={MotionSlideUp} key={-4}>
								<QuestionInnerWrapperComponent>
									<AnimatePresenceWithDisable config={config}>
										{!hideQuestionOnExplainer && (
											<MotionWrapper config={config} motionProps={MotionSlideUp} key={currentQuestion.index}>
												{TheQuestionBody}
											</MotionWrapper>
											// <motion.div {...MotionSlideUp} key={currentQuestion.index}>
											// 	{TheQuestionBody}
											// </motion.div>
										)}
										{explainerVisible && (
											<MotionWrapper config={config} motionProps={MotionScale} key={-5}>
												{ExplainerBody}
											</MotionWrapper>
											// <motion.div {...MotionScale} key={-5}>
											// 	{ExplainerBody}
											// </motion.div>
										)}
									</AnimatePresenceWithDisable>
								</QuestionInnerWrapperComponent>
							</MotionWrapper>
						</QuestionPageComponent>
					</MotionWrapper>
				)}

				{quizState === QuizState.RESULT && (
					// <motion.div key={maxQuestions} {...MotionSlideUp}>
					// 	{Result}
					// </motion.div>
					<MotionWrapper config={config} motionProps={MotionSlideUp} key={maxQuestions}>
						{Result}
					</MotionWrapper>
				)}
			</AnimatePresenceWithDisable>
		</>
	);
};

Quiz.StartButton = StartButton;
Quiz.QuestionNextButton = QuestionNextButton;
Quiz.ExplainerNextButton = ExplainerNextButton;
Quiz.AnswerButton = AnswerButton;

interface ResumeProgressProps extends HTMLAttributes<HTMLDivElement> {
	state: QuizStateProps;
}

function ResumeProgress({ state, ...props }: ResumeProgressProps) {
	const { config, currentAnswer } = state;
	const waitingForDelay = config?.autoResume && currentAnswer !== undefined;
	const progress = waitingForDelay ? 100 : 0;
	return (
		<div
			role="progressbar"
			aria-valuenow={progress}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label="Waiting to continue"
			{...props}
		>
			<div
				style={{
					width: `${progress}%`,
					transitionDuration: config?.autoResumeDelay?.toString() + "ms",
				}}
			></div>
		</div>
	);
}
Quiz.ResumeProgress = ResumeProgress;

function QuestionPage({ children }: { children: React.ReactNode }) {
	return (
		<div className="question-wrapper-default" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
			{children}
		</div>
	);
}

QuestionPage.displayName = "QuestionPage";
Quiz.QuestionPage = QuestionPage;

function QuestionInnerWrapper({ children }: { children: React.ReactNode }) {
	return <div className="question-page-default">{children}</div>;
}

QuestionInnerWrapper.displayName = "QuestionInnerWrapper";
Quiz.QuestionInnerWrapper = QuestionInnerWrapper;

const QuestionHeader = ({ children, state }: { children?: React.ReactNode; state: QuizStateProps }) => {
	const { progress } = state;
	return (
		<>
			{children || (
				<div className="question-header-default">
					<div>
						<progress max="100" value={progress}></progress>
					</div>
				</div>
			)}
		</>
	);
};

QuestionHeader.displayName = "QuestionHeader";
Quiz.QuestionHeader = QuestionHeader;

const IntroPage = ({ children, state }: { children?: React.ReactNode; state: QuizStateProps }) => {
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

const QuestionBody = ({ children, state }: { children?: React.ReactNode; state: QuizStateProps }) => {
	const { config, currentQuestion } = state;
	const { autoResume } = config || {};

	return (
		<>
			{children || (
				<div className="question-body-default">
					<h2>Question {currentQuestion.index}</h2>
					<p>{currentQuestion.question}</p>
					{currentQuestion.answers.map((item: QuizAnswer, index: number) => (
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

const Explainer = ({ children, state }: { children?: React.ReactNode; state: QuizStateProps }) => {
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

Explainer.displayName = "Explainer";
Quiz.Explainer = Explainer;

const ResultPage = ({ children, state }: { children?: React.ReactNode; state: QuizStateProps }) => {
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
