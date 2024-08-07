# React Quiz Maker

This is a quiz building library which allows developers to implement a variety of animated quiz types with a custom design, without having to implement most of the quiz logic. Uses motion framer under the hood.

## Live Demo

Here you can preview different configuration options.

https://react-quiz-demo.vercel.app/

## Stackblitz examples

(These might not work on Safari currently due to a Stackblitz issue, try Chrome or Firefox)

[Basic demo](https://stackblitz.com/~/github.com/martinkz/react-quiz-basic-demo?file=src/App.tsx)

[Custom quiz using tailwind css](https://stackblitz.com/~/github.com/martinkz/react-quiz-custom-demo-tailwind?file=src/App.tsx)

[Custom quiz using plain css](https://stackblitz.com/~/github.com/martinkz/react-quiz-custom-demo-css?file=src/App.tsx)

## Installation

```
npm install react-quiz-maker
```

## Config

| Option             | Type      | Values                                                 | Default   | Description                                                                                   |
| ------------------ | --------- | ------------------------------------------------------ | --------- | --------------------------------------------------------------------------------------------- |
| `autoResume`       | `boolean` |                                                        | `false`   | The quiz will resume automatically after the user has answered the question                   |
| `autoResumeDelay`  | `number`  |                                                        | `1000`    | The delay after which the quiz will resume automatically                                      |
| `revealAnswer`     | `boolean` |                                                        | `false`   | Reveal the correct answer after the user has chosen one of the answers                        |
| `explainerEnabled` | `boolean` |                                                        | `false`   | Enable an explanation box which appears after each question has been answered                 |
| `explainerNewPage` | `boolean` |                                                        | `false`   | Have the explanation box replace the question, instead of both being present at the same time |
| `animation`        | `string`  | `"mixed", "slideUp", "slideLeft", "scale", "disabled"` | `"mixed"` | Choose an animation style (or disable the animation)                                          |

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

| Component                     | Props                                                            | Type                                                                                       | Used In                          | Description                                                                  |
| ----------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------- | ---------------------------------------------------------------------------- |
| `<Quiz />`                    | `config`<br/>`data`<br/>`components?`                            | `QuizConfig`<br/>`QuizData`<br/>`QuizComponents`                                           |                                  | Main quiz component. Can be used on its own if you don't pass any components |
| `<Quiz.StartButton>`          | `children`<br/>`state`<br/>`className?`<br/>`style?`             | `React.ReactNode`<br/>`QuizStateProps`<br/>`string`<br/>`React.CSSProperties`              | `<IntroPage>`<br/>`<ResultPage>` | Start (or restart) button - in                                               |
| `<Quiz.QuestionNextButton>`   | `children`<br/>`state`<br/>`className?`<br/>`style?`             | `React.ReactNode`<br/>`QuizStateProps`<br/>`string`<br/>`React.CSSProperties`              | `<QuestionBody>`                 | Question Next button                                                         |
| `<Quiz.ExplainerNextButton>`  | `children`<br/>`state`<br/>`className?`<br/>`style?`             | `React.ReactNode`<br/>`QuizStateProps`<br/>`string`<br/>`React.CSSProperties`              | `<Explainer>`                    | Explainer Next button                                                        |
| `<Quiz.AnswerButton>`         | `children`<br/>`state`<br/>`index`<br/>`className?`<br/>`style?` | `React.ReactNode`<br/>`QuizStateProps`<br/>`number`<be/>`string`<br/>`React.CSSProperties` | `<QuestionBody>`                 | Answer button                                                                |
| `<Quiz.AutoResumeProgress />` | `state`<br/>`className?`<br/>`style?`                            | `QuizStateProps`<br/>`string`<br/>`React.CSSProperties`                                    | `<QuestionBody>`                 | Show the remaining time until the next question when `autoResume` is on      |

### Component structure

This visualises how the implementable components wrap each other to help you with styling.

#### Intro

![Intro](/docs/quiz-intro.png)

#### Question and explainer

![Question](/docs/quiz-question.png)

#### Result

![Result](/docs/quiz-result.png)

## Code example

This is an example of how to use the basic quiz with default styles.

### App.tsx

```js
import { Quiz, type QuizData } from "react-quiz-maker";
import quizData from "./scoredQuiz.json";
import "./react-quiz.css";

const config = {
	autoResume: true,
	autoResumeDelay: 1200,
	revealAnswer: true,
	explainerEnabled: false,
	explainerNewPage: false,
	animation: "mixed",
} as const;

function App() {
	return <Quiz config={config} data={quizData as QuizData} />;
}

export default App;
```

### Quiz data json

Download [scored quiz json](https://github.com/martinkz/react-quiz-demo/blob/main/src/scoredQuiz.json) or [personality quiz json](https://github.com/martinkz/react-quiz-maker/blob/main/src/personalityQuiz.json).

### CSS

Download [here](https://github.com/martinkz/react-quiz-maker/blob/main/src/Quiz/react-quiz.css)

## Tips

- If you omit any of the implementable components, it will use a default one. If you wish to omit it entirely (for example QuestionHeader), you can create a component which returns false.
- If you'd like to omit the intro page, you can create an IntroPage component which in its body calls the handleStartBtnClick() function to automatically start the quiz (will add code example in the near future).
