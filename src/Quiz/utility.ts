import React from "react";
import { type UserAnswer, AnswerButtonState } from "./useQuiz";

export function evaluateScore(userAnswers: UserAnswer[]) {
	const score = userAnswers.filter((answer: any) => answer.result === "1").length;
	return score;
}

export function evaluatePersonality(userAnswers: UserAnswer[]) {
	const personalityTypesWithScore = userAnswers.reduce((acc: Record<string, number>, answer: UserAnswer) => {
		acc[answer.result] = (acc[answer.result] || 0) + 1;
		return acc;
	}, {});
	console.log(personalityTypesWithScore);

	// Find the personality type with the highest score
	const typeWithHighestScore = Object.keys(personalityTypesWithScore).reduce((a, b) =>
		personalityTypesWithScore[a] > personalityTypesWithScore[b] ? a : b
	);

	// Find all personality types with the same highest score
	const allTypesWithHighestScore = Object.keys(personalityTypesWithScore).filter(
		(key) => personalityTypesWithScore[key] === personalityTypesWithScore[typeWithHighestScore]
	);

	// Return a random type from the types with the highest score
	const randomType = allTypesWithHighestScore[Math.floor(Math.random() * allTypesWithHighestScore.length)];

	return randomType;
}

export function findIndexes<T>(arr: Array<T>, value: T): number[] {
	return arr.flatMap((el, i) => (el === value ? i : []));
}

// export function findReactChild(children: React.ReactNode, type: string): React.ReactNode {
// 	return React.Children.toArray(children).find((child: any) => child.type.name === type);
// }

export function findReactChild(children: React.ReactNode, name: string): React.ReactElement | undefined {
	return React.Children.toArray(children).find(
		(child): child is React.ReactElement =>
			React.isValidElement(child) && typeof child.type !== "string" && (child.type as any).displayName === name
	);
}

// Update the state of all answer buttons based on the current answer and whether to show the correct answer
export function getAnswerBtnsNewState(
	index: number,
	answers: any,
	currentAnswer: UserAnswer,
	showCorrectAnswer: boolean
) {
	const defaultAnswerButtonState = Array(answers.length).fill(AnswerButtonState.DEFAULT);
	// Set all answers to 'default' state instead of the initial 'unset' state
	const newBtnStateAll = [...defaultAnswerButtonState];
	if (showCorrectAnswer) {
		// If the chosen answer is correct, highlight it and all other correct answers, otherwise highlight the chosen incorrect answer and all correct answers
		const correctIndexes = findIndexes(
			answers.map((item: any) => item.result),
			"1"
		);
		const isCorrect = correctIndexes.includes(index);
		const newBtnState = isCorrect ? AnswerButtonState.CORRECT : AnswerButtonState.INCORRECT;
		newBtnStateAll[index] = newBtnState;
		correctIndexes.forEach((index) => (newBtnStateAll[index] = AnswerButtonState.CORRECT));
	} else {
		const isHighlightedForSelected = currentAnswer.index === index;
		if (isHighlightedForSelected) {
			newBtnStateAll[index] = AnswerButtonState.SELECTED;
		}
	}
	return newBtnStateAll;
}

export interface Timer {
	id: ReturnType<typeof setTimeout>;
	readonly remainingTime: number;
}

// Returns a timeout object which holds it's setTimeout id and the remaining time.
// The remaining time is used to in cases where we need to clear the setTimeout and re-set while keeping the remaining time.
export function createTimeout<T extends unknown[]>(fn: (...args: T) => void, delay: number, ...params: T): Timer {
	const id = setTimeout(fn, delay, ...params);
	const endTime = new Date().getTime() + delay;

	return {
		id,
		get remainingTime(): number {
			const remainingTime = endTime - new Date().getTime();
			return remainingTime > 0 ? remainingTime : 0;
		},
	};
}
