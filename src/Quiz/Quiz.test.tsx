import { describe, it, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitForElementToBeRemoved, waitFor, logRoles, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Quiz } from "../Quiz/Quiz";
import { QuizConfig, QuizProvider } from "../Quiz/QuizContext";
import quizJson from "../quizData.json";
import quizJson2 from "../quizData2.json";

import { MotionGlobalConfig } from "framer-motion";
MotionGlobalConfig.skipAnimations = true;

const quizConfig = {
	nextButton: false,
	revealAnswer: true,
	animation: "disabled", // Animation must be disabled for the tests to work
	showAnswerExplainer: false,
	answerExplainerOnNewPage: false,
} as QuizConfig;

const q = {
	getStartBtn() {
		return screen.getByRole("button", { name: /start quiz/i });
	},
	getAnswerBtns() {
		return screen.getAllByRole("button", { name: /answer/i });
	},
	getQuestionText(index: number) {
		return screen.getByText(new RegExp(`question ${index}`, "i"));
	},
	getPlayAgainBtn() {
		return screen.getByRole("button", { name: /play again/i });
	},
};

describe("Quiz", () => {
	beforeEach(() => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
	});
	test("Quiz completes successfully", async () => {
		// const user = userEvent.setup();
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		const { container } = render(
			<QuizProvider quizData={quizJson2} config={quizConfig}>
				<Quiz />
			</QuizProvider>
		);
		// logRoles(container);

		// Button with text content "Start quiz" is found
		const startBtn = q.getStartBtn();

		await user.click(startBtn);

		// Text content "Question 1" is found
		q.getQuestionText(1);
		// Buttons with text content "answer" are found
		const firstQuestionAnswerBtns = q.getAnswerBtns();
		const randomIndex = Math.floor(Math.random() * firstQuestionAnswerBtns.length);

		await user.click(firstQuestionAnswerBtns[randomIndex]);

		expect(firstQuestionAnswerBtns[randomIndex]).toBeDisabled();

		await act(() => vi.runAllTimers());

		q.getQuestionText(2);

		const secondQuestionAnswerBtns = q.getAnswerBtns();
		await user.click(secondQuestionAnswerBtns[0]);

		await act(() => vi.runAllTimers());

		q.getQuestionText(3);

		const thirdQuestionAnswerBtns = q.getAnswerBtns();
		await user.click(thirdQuestionAnswerBtns[0]);
		await act(() => vi.runAllTimers());

		q.getPlayAgainBtn();

		// screen.debug();
	});
});
