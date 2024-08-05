/* These are functional tests that cover a broad range 
of the quiz functionality, though they do not cover 100% */

import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitForElementToBeRemoved, waitFor, logRoles, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Quiz } from "../Quiz/Quiz";
import { QuizData } from "../Quiz/types";
import personalityQuizData from "../personalityQuiz.json";
import scoredQuizData from "../scoredQuiz.json";

import { MotionGlobalConfig } from "framer-motion";
MotionGlobalConfig.skipAnimations = true;

// Extracting these here, as the markup is likely to change
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
	queryQuestionNextBtn() {
		return screen.queryByTestId("question-next");
	},
	queryExplainerNextBtn() {
		return screen.queryByTestId("explainer-next");
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

	/* 
		autoResume: true,
		revealAnswer: true,
		explainerEnabled: false,
		explainerNewPage: false, 
	*/

	test("Quiz completes successfully", async () => {
		// const user = userEvent.setup();
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(
			<Quiz
				data={scoredQuizData as QuizData}
				config={{
					autoResume: true,
					revealAnswer: true,
					explainerEnabled: false,
					explainerNewPage: false,
					animation: "disabled", // Animation must be disabled for the tests to work
				}}
			/>
		);
		// logRoles(container);

		const startBtn = q.getStartBtn();

		await user.click(startBtn);

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
	});

	/* 
		autoResume: true,
		revealAnswer: false,
		explainerEnabled: false,
		explainerNewPage: false, 
	*/

	test("Quiz resumes automatically and doesn't contain a Next button", async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(
			<Quiz
				data={scoredQuizData as QuizData}
				config={{
					autoResume: true,
					revealAnswer: false,
					explainerEnabled: false,
					explainerNewPage: false,
					animation: "disabled",
				}}
			/>
		);

		const startBtn = q.getStartBtn();
		await user.click(startBtn);

		const firstQuestionAnswerBtns = q.getAnswerBtns();
		await user.click(firstQuestionAnswerBtns[0]);

		// The answer buttons are not disabled as revealAnswer is false (and explainer is not shown)
		expect(firstQuestionAnswerBtns[0]).not.toBeDisabled();

		// The Next button is not found as autoResume is true
		expect(q.queryQuestionNextBtn()).not.toBeInTheDocument();

		await act(() => vi.runAllTimers());

		// The quiz advances to the next question automatically
		q.getQuestionText(2);
	});

	/* 
		autoResume: true,
		revealAnswer: false,
		explainerEnabled: true,
		explainerNewPage: false, 
	*/

	test("Quiz displays the explainer at the same time as the question and answer buttons are disabled", async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(
			<Quiz
				data={scoredQuizData as QuizData}
				config={{
					autoResume: true,
					revealAnswer: false,
					explainerEnabled: true,
					explainerNewPage: false,
					animation: "disabled",
				}}
			/>
		);

		const startBtn = q.getStartBtn();
		await user.click(startBtn);

		const firstQuestionAnswerBtns = q.getAnswerBtns();
		await user.click(firstQuestionAnswerBtns[0]);

		// The copy for question 1 is still on the page, as we have the explainer on the same page
		q.getQuestionText(1);

		// The answer buttons are disabled despite revealAnswer being false, due to the explainer being shown automatically
		expect(firstQuestionAnswerBtns[0]).toBeDisabled();

		// The Next button is not found as autoResume is true
		expect(q.queryQuestionNextBtn()).not.toBeInTheDocument();

		// The explainer next button is found
		expect(q.queryExplainerNextBtn()).toBeInTheDocument();

		await user.click(q.queryExplainerNextBtn()!);

		// autoResume is instant (no setTimeout is used), so we don't need to run timers
		// await act(() => vi.runAllTimers());

		// The quiz advances to the next question after we click the explainer next button
		q.getQuestionText(2);
	});

	/* 
		autoResume: false,
		revealAnswer: false,
		explainerEnabled: true,
		explainerNewPage: false, 
	*/

	test("Quiz displays the explainer on the same page, but the next button is hidden due to autoResume being false", async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(
			<Quiz
				data={scoredQuizData as QuizData}
				config={{
					autoResume: false,
					revealAnswer: false,
					explainerEnabled: true,
					explainerNewPage: false,
					animation: "disabled",
				}}
			/>
		);

		const startBtn = q.getStartBtn();
		await user.click(startBtn);

		const firstQuestionAnswerBtns = q.getAnswerBtns();
		await user.click(firstQuestionAnswerBtns[0]);

		// The copy for question 1 is still on the page, as we have the explainer on the same page
		q.getQuestionText(1);

		// The answer buttons are not disabled as revealAnswer is false (and explainer is not shown yet)
		expect(firstQuestionAnswerBtns[0]).not.toBeDisabled();

		// The Next button is found as autoResume is false
		expect(q.queryQuestionNextBtn()).toBeInTheDocument();

		// The explainer next button is not found (yet)
		expect(q.queryExplainerNextBtn()).not.toBeInTheDocument();

		await user.click(q.queryQuestionNextBtn()!);

		// The explainer next button is now found, after we clicked next
		expect(q.queryExplainerNextBtn()).toBeInTheDocument();

		// Answer buttons are now disabled, as we have shown the explainer
		expect(firstQuestionAnswerBtns[0]).toBeDisabled();

		// The Next button is hidden after we show the explainer
		expect(q.queryQuestionNextBtn()).not.toBeVisible();

		await user.click(q.queryExplainerNextBtn()!);

		// The quiz advances to the next question after we click the explainer next button
		q.getQuestionText(2);
	});

	/* 
		autoResume: false,
		revealAnswer: false,
		explainerEnabled: true,
		explainerNewPage: true, 
	*/

	test("Quiz displays the explainer on a new page", async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(
			<Quiz
				data={scoredQuizData as QuizData}
				config={{
					autoResume: false,
					revealAnswer: false,
					explainerEnabled: true,
					explainerNewPage: true,
					animation: "disabled",
				}}
			/>
		);

		const startBtn = q.getStartBtn();
		await user.click(startBtn);

		const firstQuestionAnswerBtns = q.getAnswerBtns();
		await user.click(firstQuestionAnswerBtns[0]);

		// The copy for question 1 is still on the page, as autoResume is false
		q.getQuestionText(1);

		// The answer buttons are not disabled as revealAnswer is false (and explainer is not shown on this page)
		expect(firstQuestionAnswerBtns[0]).not.toBeDisabled();

		// The Next button is found as autoResume is false
		expect(q.queryQuestionNextBtn()).toBeInTheDocument();

		// The explainer next button is not found (yet)
		expect(q.queryExplainerNextBtn()).not.toBeInTheDocument();

		await user.click(q.queryQuestionNextBtn()!);

		// The explainer next button is now found, after we clicked next
		expect(q.queryExplainerNextBtn()).toBeInTheDocument();

		// The Next button is not found after we show the explainer on a new page
		expect(q.queryQuestionNextBtn()).not.toBeInTheDocument();

		await user.click(q.queryExplainerNextBtn()!);

		// The quiz advances to the next question after we click the explainer next button
		q.getQuestionText(2);
	});

	test("Quiz result is correctly calculated if we change answers during the autoResume timeout", async () => {
		// const user = userEvent.setup();
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		render(
			<Quiz
				data={scoredQuizData as QuizData}
				config={{
					autoResume: true,
					revealAnswer: false,
					explainerEnabled: false,
					explainerNewPage: false,
					animation: "disabled",
				}}
			/>
		);
		// logRoles(container);

		const startBtn = q.getStartBtn();
		await user.click(startBtn);

		const firstQuestionAnswerBtns = q.getAnswerBtns();
		await user.click(firstQuestionAnswerBtns[1]);
		await user.click(firstQuestionAnswerBtns[0]); // Change the answer before running the timers

		await act(() => vi.runAllTimers());

		const secondQuestionAnswerBtns = q.getAnswerBtns();
		await user.click(secondQuestionAnswerBtns[1]);
		await user.click(secondQuestionAnswerBtns[0]);

		await act(() => vi.runAllTimers());

		const thirdQuestionAnswerBtns = q.getAnswerBtns();
		await user.click(thirdQuestionAnswerBtns[1]);
		await user.click(thirdQuestionAnswerBtns[0]);
		await act(() => vi.runAllTimers());

		screen.getAllByText(/3/i);

		q.getPlayAgainBtn();
	});
});
