import { motion, AnimatePresence, MotionProps } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";
import { useQuiz } from "./QuizContext";

export const MotionWrapper = forwardRef(function (
	{ children, motionProps }: { children: React.ReactNode; motionProps?: MotionProps },
	_ref: ForwardedRef<HTMLDivElement>
) {
	const { config } = useQuiz();

	if (!config) {
		throw new Error("No config object provided");
	}

	const { animation = "default", motionObject } = config;

	console.log("motionObject", animation);

	const wrappers = {
		slide: MotionSlideProps,
		scale: MotionScaleProps,
		custom: motionObject,
		default: motionProps,
	};
	return (
		<motion.div
			// ref={ref} // When ref is used animation is sometimes buggy?
			{...wrappers[animation!]}
		>
			{children}
		</motion.div>
	);
});

const MotionSlideProps = {
	style: { overflow: "hidden" },
	initial: { height: 0 },
	animate: { height: "auto" },
	transition: { duration: 0.5 },
	exit: { height: 0 },
};

// With flexGrow, but it's buggy
// const MotionSlideProps = {
// 	style: { overflow: "hidden" },
// 	initial: { height: 0, flexGrow: 0 },
// 	animate: { height: "auto", flexGrow: 1 },
// 	transition: {
// 		duration: 0.5,
// 	},
// 	exit: { height: 0, flexGrow: 0 },
// };

const MotionScaleProps = {
	initial: { opacity: 0, scale: 0, height: 0 },
	animate: { opacity: 1, scale: 1, height: "auto" },
	transition: { duration: 0.5 },
	exit: { opacity: 0, scale: 0, height: 0 },
};
