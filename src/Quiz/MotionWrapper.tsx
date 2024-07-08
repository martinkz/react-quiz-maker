import { motion, MotionProps } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";
import { useQuiz } from "./QuizContext";

export const MotionWrapper = forwardRef(function (
	{ children, motionProps }: { children: React.ReactNode; motionProps?: MotionProps },
	ref: ForwardedRef<HTMLDivElement>
) {
	const { config } = useQuiz();

	if (!config) {
		throw new Error("No config object provided");
	}

	const { animation = "default", motionObject } = config;

	const wrappers = {
		slide: MotionSlide,
		scale: MotionScale,
		custom: motionObject,
		default: motionProps,
	};
	return (
		<motion.div
			ref={ref} // When ref is used animation is sometimes buggy?
			{...wrappers[animation!]}
		>
			{children}
		</motion.div>
	);
});

export const MotionSlide = {
	style: { overflow: "hidden" },
	initial: { height: 0 },
	animate: { height: "auto" },
	transition: { duration: 0.5 },
	exit: { height: 0 },
};

export const MotionScale = {
	initial: { opacity: 0, scale: 0, height: 0 },
	animate: { opacity: 1, scale: 1, height: "auto" },
	transition: { duration: 0.5 },
	exit: { opacity: 0, scale: 0, height: 0 },
};

// With flexGrow, but it's buggy
// const MotionSlide = {
// 	style: { overflow: "hidden" },
// 	initial: { height: 0, flexGrow: 0 },
// 	animate: { height: "auto", flexGrow: 1 },
// 	transition: {
// 		duration: 0.5,
// 	},
// 	exit: { height: 0, flexGrow: 0 },
// };
