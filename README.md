# React Quiz Maker

This is quiz building library that allows developers to implement a variety of animated quiz types with a custom design, without having to implement most of the quiz logic.

## Config

| Option           | Type    | Values                                                 | Default   | Description                                                                                   |
| ---------------- | ------- | ------------------------------------------------------ | --------- | --------------------------------------------------------------------------------------------- |
| autoResume       | boolean |                                                        | false     | The quiz will resume automatically after the user has answered the question                   |
| autoResumeDelay  | number  |                                                        | 1000      | The delay after which the quiz will resume automatically                                      |
| revealAnswer     | boolean |                                                        | false     | Reveal the correct answer after the user has chosen one of the answers                        |
| explainerEnabled | boolean |                                                        | false     | Enable an explanation box which appears after each question has been answered                 |
| explainerNewPage | boolean |                                                        | false     | Have the explanation box replace the question, instead of both being present at the same time |
| animation        | string  | "default", "slideUp", "slideLeft", "scale", "disabled" | "default" | Choose an animation style (or disable the animation)                                          |

## API

To achieve a custom design, the API gives you control over how some of the quiz components are implemented. The API tries to balance ease-of-use vs customisability, i.e. to what extent you can modify the quiz vs how easy it is to implement a custom design and functionality. Over time the API can be extended to allow more customisability (especially around the framer-motion animations).

### Implementable components

| Component               | Props          | Type                   | Description                                                                                                                               |
| ----------------------- | -------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| \<YourQuizWrapper>      | config<br>data | QuizConfig<br>QuizData | An optional component you can name anything. It is recommended to make this, as it wraps all other components so it's useful for styling. |
| \<IntroPage />          | state          | QuizStateProps         | This is the intro page for the quiz. Contains the \<Quiz.StartBtn />.                                                                     |
| \<QuestionPage>         | children       | React.ReactNode        | This is a presentational component which wraps the question page. All question-related subcomponents will be passed here as children      |
| \<QuestionHeader />     | state          | QuizStateProps         | The header for the question, it contains the overall quiz progress.                                                                       |
| \<QuestionInnerWrapper> | children       | React.ReactNode        | Presentational wrapper component, the children passed to it are the \<QuestionBody> and \<Explainer> (if used). Useful for styling.       |
| \<QuestionBody>         | state          | QuizStateProps         | Contains the question and answers.                                                                                                        |
| \<Explainer>            | state          | QuizStateProps         | Contains the explanation box.                                                                                                             |
| \<ResultPage>           | state          | QuizStateProps         | Contains the final quiz result.                                                                                                           |

### Provided components
