import { describe, it, expect, vi } from "vitest";
import { render, screen, waitForElementToBeRemoved, waitFor, logRoles } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Quiz } from "../Quiz/Quiz";
import { QuizConfig, QuizProvider } from "../Quiz/QuizContext";
import quizJson from "../quizData.json";

const quizConfig = {
	nextButton: true,
	revealAnswer: true,
	animation: "disabled",
	showAnswerExplainer: false,
	answerExplainerOnNewPage: false,
} as QuizConfig;

describe("Quiz", () => {
	it("renders the quiz Intro page", () => {
		render(
			<QuizProvider quizData={quizJson} config={quizConfig}>
				<Quiz />
			</QuizProvider>
		);
		screen.getByRole("button", { name: /Start quiz/i });
		// expect(button).toHaveTextContent(/Start quiz/i);
	});

	it("Starts the quiz", async () => {
		const { container } = render(
			<QuizProvider quizData={quizJson} config={quizConfig}>
				<Quiz />
			</QuizProvider>
		);

		// Button with text content "Start quiz" is found
		const startBtn = screen.getByRole("button", { name: /start quiz/i });

		await userEvent.click(startBtn);

		// Buttons with text content "answer" are found
		const answerBtns = screen.getAllByRole("button", { name: /answer/i });
		console.log(answerBtns.length);

		// logRoles(container);
		// screen.debug();

		// vi.useFakeTimers();
		// setTimeout(() => {
		// 	screen.debug();
		// }, 1500);
		// vi.runAllTimers();

		// await waitForElementToBeRemoved(() => screen.getByText(/Start quiz/i));

		// await waitFor(async () => {
		// 	const message = await screen.findByText("Question 1");
		// 	expect(message).toBeInTheDocument();
		// 	screen.debug();
		// });
	});
});
