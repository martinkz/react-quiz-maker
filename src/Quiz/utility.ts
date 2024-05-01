import React from "react";
import { UserAnswer } from "./QuizContext";

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
