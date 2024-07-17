import { useQuiz } from "./QuizContext";
import styles from "./styles.module.css";

export function ProgressBar() {
	const { currentQuestion, maxQuestions } = useQuiz();
	const progressPercent = (100 / maxQuestions) * currentQuestion.index;
	// Allow children to be passed in so a custom progress can be passed in. Will require progressPercent to be moved to the context
	return <progress className={styles.progress} max="100" value={progressPercent}></progress>;
}
