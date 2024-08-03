# React Quiz Maker

This is a quiz building library which allows developers to implement a variety of animated quiz types with a custom design, without having to implement most of the quiz logic.

[Show me some code](#code-example) | [Demo]()

## Installation

```
npm install react-quiz-maker
```

## Config

| Option             | Type      | Values                                                   | Default     | Description                                                                                   |
| ------------------ | --------- | -------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------- |
| `autoResume`       | `boolean` |                                                          | `false`     | The quiz will resume automatically after the user has answered the question                   |
| `autoResumeDelay`  | `number`  |                                                          | `1000`      | The delay after which the quiz will resume automatically                                      |
| `revealAnswer`     | `boolean` |                                                          | `false`     | Reveal the correct answer after the user has chosen one of the answers                        |
| `explainerEnabled` | `boolean` |                                                          | `false`     | Enable an explanation box which appears after each question has been answered                 |
| `explainerNewPage` | `boolean` |                                                          | `false`     | Have the explanation box replace the question, instead of both being present at the same time |
| `animation`        | `string`  | `"default", "slideUp", "slideLeft", "scale", "disabled"` | `"default"` | Choose an animation style (or disable the animation)                                          |

## API

To achieve a custom design, the API gives you control over how some of the quiz components are implemented. The API tries to balance ease-of-use vs customisability, i.e. to what extent you can modify the quiz vs how easy it is to implement a custom design and functionality. Over time the API can be extended to allow more customisability (especially around the animations).

### Implementable components

| Component                | Props              | Type                       | Description                                                                                                                                  |
| ------------------------ | ------------------ | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `<YourQuiz>`             | `config`<br>`data` | `QuizConfig`<br>`QuizData` | An optional component you can name anything. It is recommended to create this, as it wraps all other components, so it's useful for styling. |
| `<IntroPage>`            | `state`            | `QuizStateProps`           | This is the intro page for the quiz. Contains the \<Quiz.StartBtn />.                                                                        |
| `<QuestionPage>`         | `children`         | `React.ReactNode`          | This is a presentational component which wraps the question page. All question-related subcomponents will be passed here as children         |
| `<QuestionHeader />`     | `state`            | `QuizStateProps`           | The header for the question, it contains the overall quiz progress.                                                                          |
| `<QuestionInnerWrapper>` | `children`         | `React.ReactNode`          | Presentational wrapper component, the children passed to it are the \<QuestionBody> and \<Explainer> (if used). Useful for styling.          |
| `<QuestionBody>`         | `state`            | `QuizStateProps`           | Contains the question and answers.                                                                                                           |
| `<Explainer>`            | `state`            | `QuizStateProps`           | Contains the explanation box.                                                                                                                |
| `<ResultPage>`           | `state`            | `QuizStateProps`           | Contains the final quiz result.                                                                                                              |

### Provided components

The library provides some additional components used for navigating the quiz and displaying progress, although you can implement your own (see code examples below). All these receive the same `state` prop in order to keep the API simple. You need to ensure you use them in the appropriate components, otherwise you will encounter bugs.

| Component                    | Props                                                            | Type                                                                                       | Used In                          | Description                                                                  |
| ---------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------- | ---------------------------------------------------------------------------- |
| `<Quiz />`                   | `config`<br/>`data`<br/>`components?`                            | `QuizConfig`<br/>`QuizData`<br/>`QuizComponents`                                           |                                  | Main quiz component. Can be used on its own if you don't pass any components |
| `<Quiz.StartButton>`         | `children`<br/>`state`<br/>`className?`<br/>`style?`             | `React.ReactNode`<br/>`QuizStateProps`<br/>`string`<br/>`React.CSSProperties`              | `<IntroPage>`<br/>`<ResultPage>` | Start (or restart) button - in                                               |
| `<Quiz.QuestionNextButton>`  | `children`<br/>`state`<br/>`className?`<br/>`style?`             | `React.ReactNode`<br/>`QuizStateProps`<br/>`string`<br/>`React.CSSProperties`              | `<QuestionBody>`                 | Question Next button                                                         |
| `<Quiz.ExplainerNextButton>` | `children`<br/>`state`<br/>`className?`<br/>`style?`             | `React.ReactNode`<br/>`QuizStateProps`<br/>`string`<br/>`React.CSSProperties`              | `<Explainer>`                    | Explainer Next button                                                        |
| `<Quiz.AnswerButton>`        | `children`<br/>`state`<br/>`index`<br/>`className?`<br/>`style?` | `React.ReactNode`<br/>`QuizStateProps`<br/>`number`<be/>`string`<br/>`React.CSSProperties` | `<QuestionBody>`                 | Answer button                                                                |
| `<Quiz.ResumeProgress />`    | `state`<br/>`className?`<br/>`style?`                            | `QuizStateProps`<br/>`string`<br/>`React.CSSProperties`                                    | `<QuestionBody>`                 | Show the remaining time until the next question when `autoResume` is on      |

### Component structure

This visualises how the implementable components wrap each other to help you with styling.

#### Intro

![Question](/docs/quiz-intro.png)

#### Question and explainer

![Question](/docs/quiz-question.png)

#### Result

![Question](/docs/quiz-result.png)

## Code example

This is an example of a custom quiz which uses the available implementable components. Uses tailwind css for styling. If it's not clear what each component contains, look at the pictures above this section. This is the same design/implementation as in the [demo]().

### App.tsx

```js

import type { QuizData } from "react-quiz-maker";
import MyQuiz from "./components/MyQuiz";
import scoredQuizData from "./scoredQuiz.json";

const config = {
	autoResume: true,
	autoResumeDelay: 1200,
	revealAnswer: false,
	explainerEnabled: false,
	explainerNewPage: false,
	animation: "slideUp",
} as const;

function App() {
	return <MyQuiz config={config} data={scoredQuizData as QuizData} />;
}

export default App;
```

### scoredQuiz.json

See [here](https://github.com/martinkz/react-quiz-demo/blob/main/src/scoredQuiz.json).

### MyQuiz.tsx

```js
import { Quiz } from "react-quiz-maker";
import type { QuizConfig, QuizStateProps, QuizData } from "react-quiz-maker";

const btnStyles = {
	unset: "bg-[#222]",
	default: "bg-[#222]",
	selected: "bg-[#c2185b] scale-[1.07]",
	correct: "bg-green-700",
	incorrect: "bg-[#b52e49]",
};

const bgColors = {
	quizBg: "bg-[#512da8]",
	slideBg: "bg-[#7e57c2]",
	questionBg: "bg-[#673ab7]",
	explainerBg: "bg-[#512da8]",
	buttonBg: "bg-[#311b92]",
};

const quizComponents = {
	IntroPage,
	QuestionPage,
	QuestionHeader,
	QuestionInnerWrapper,
	QuestionBody,
	Explainer,
	ResultPage,
};

export default function MyQuiz({ config, data }: { config: QuizConfig; data: QuizData }) {
	return (
		<div
			className={`my-quiz relative md:p-10 md:rounded-2xl ${bgColors.quizBg} text-white text-center text-xl font-thin`}
		>
			<div className={`flex flex-col items-stretch justify-center ${bgColors.slideBg} rounded-2xl p-8`}>
				<Quiz config={config} data={data} components={quizComponents} />
			</div>
		</div>
	);
}

function IntroPage(state: QuizStateProps) {
	const { quizData } = state;
	const quizTitle = quizData.quizTitle;
	const quizDescription = quizData.quizSynopsis;
	return (
		<div className="intro-page min-h-[400px] md:px-10 flex flex-col items-center justify-center gap-10">
			<h2 className="text-3xl font-black uppercase tracking-wide">{quizTitle}</h2>
			<p>{quizDescription}</p>
			<Quiz.StartButton className={`px-4 py-3 ${bgColors.buttonBg} rounded-lg text-white`} state={state}>
				Start quiz
			</Quiz.StartButton>
		</div>
	);
}

function QuestionPage({ children }: { children: React.ReactNode }) {
	return <div className="question-page flex flex-col gap-8">{children}</div>;
}

function QuestionInnerWrapper({ children }: { children: React.ReactNode }) {
	return (
		<div
			className={`question-inner-wrapper flex flex-col justify-center items-center ${bgColors.questionBg} p-10 rounded-2xl`}
		>
			{children}
		</div>
	);
}

function QuestionHeader(state: QuizStateProps) {
	const { currentQuestion, maxQuestions, progress } = state;
	return (
		<div className="question-header flex gap-8 justify-center items-center">
			<h3 className="font-black text-lg">
				{currentQuestion.index} <span className="font-normal">/</span> {maxQuestions}
			</h3>
			<progress
				className="flex-1 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-white [&::-webkit-progress-value]:bg-violet-400 [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500"
				max="100"
				value={progress}
			></progress>
			<h3 className="font-black text-lg">{`${progress}%`}</h3>
		</div>
	);
}

function QuestionBody(state: QuizStateProps) {
	const { currentQuestion, answerButtonState } = state;

	return (
		<div className="question-body space-y-10 py-6">
			<h2 className="grid gap-8 justify-center items-center text-2xl">
				<span className="mx-auto shrink-0 text-5xl font-black rounded-full bg-white text-black w-[75px] h-[75px] flex justify-center items-center">
					{currentQuestion.index}
				</span>
				{currentQuestion.question}
			</h2>

			<div className="grid lg:flex flex-col md:flex-row flex-wrap gap-4 items-center justify-center px-2">
				{currentQuestion.answers.map((item: any, index: number) => (
					<Quiz.AnswerButton
						className={`p-4 rounded-lg transition-all text-xl ${btnStyles[answerButtonState[index]]}`}
						key={index}
						index={index}
						state={state}
					>
						{item.answer}
						{answerButtonState[index] === "correct" && <span className="font-black"> ✓</span>}
						{answerButtonState[index] === "incorrect" && <span className="font-black"> ×</span>}
					</Quiz.AnswerButton>
				))}
			</div>

			<Quiz.QuestionNextButton
				className={`px-4 py-3 ${bgColors.buttonBg} rounded-lg text-white disabled:opacity-50 transition-all`}
				state={state}
			>
				Next
			</Quiz.QuestionNextButton>

			<Quiz.ResumeProgress
				className={`[&>div]:h-[5px] [&>div]:rounded-lg [&>div]:bg-violet-400 [&>div]:transition-all [&>div]:ease-linear`}
				state={state}
			/>
		</div>
	);
}

function Explainer(state: QuizStateProps) {
	const { currentQuestion, currentAnswer } = state;
	const answerIsCorrect = currentAnswer?.result === "1";

	return (
		<div className={`explainer-page ${bgColors.explainerBg} p-10 rounded-2xl space-y-6`}>
			<h2 className="text-3xl font-black">
				{answerIsCorrect ? currentQuestion.messageForCorrectAnswer : currentQuestion.messageForIncorrectAnswer}
			</h2>
			<p>{currentQuestion.explanation}</p>
			<Quiz.ExplainerNextButton className={`px-4 py-3 ${bgColors.buttonBg} rounded-lg text-white`} state={state}>
				Next
			</Quiz.ExplainerNextButton>
		</div>
	);
}

function ResultPage(state: QuizStateProps) {
	const { result, quizData } = state;
	const resultsCopy = quizData.results;

	return (
		<div className="result-page min-h-[400px] md:px-10 flex flex-col items-center justify-center gap-10">
			<h2 className="text-3xl font-black">Your result is: {result}</h2>
			{resultsCopy && <p>{resultsCopy[result!].description}</p>}
			<Quiz.StartButton className={`px-4 py-3 ${bgColors.buttonBg} rounded-lg text-white`} state={state}>
				Play again
			</Quiz.StartButton>
		</div>
	);
}

```

## Important points

- If you omit any of the implementable components, it will use a default one. If you wish to omit it entirely (for example QuestionHeader), you can create a component that returns null.
- If you'd like to omit the intro page, you can create an IntroPage component which in its body calls the handleStartBtnClick() function from the state to automatically start the quiz (will add code example in the near future).
