import Quiz from "./Quiz/Quiz";
import quizJson from "./quizData.json";

function App() {
	return <Quiz quizData={quizJson} />;
}

export default App;
