import { useQuiz } from "./QuizContext";
import styles from "./styles.module.css";

export function ProgressBar() {
	const { currentQuestion, maxQuestions } = useQuiz();
	const progressPercent = (100 / maxQuestions) * (currentQuestion + 1);
	return <progress className={styles.progress} max="100" value={progressPercent}></progress>;
}
