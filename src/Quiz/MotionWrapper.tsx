import { motion, AnimatePresence } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";
import { useQuiz } from "./QuizContext";

export const MotionWrapper = forwardRef(function (
	{ children }: { children: React.ReactNode },
	ref: ForwardedRef<HTMLDivElement>
) {
	const { config } = useQuiz();

	if (!config) {
		throw new Error("No config object provided");
	}

	const { animation, motionObject } = config;

	const wrappers = {
		slide: MotionSlideProps,
		scale: MotionScaleProps,
		custom: motionObject,
	};
	return (
		<motion.div ref={ref} {...wrappers[animation!]}>
			{children}
		</motion.div>
	);
});

export const MotionSlideProps = {
	style: { overflow: "hidden" },
	initial: { height: 0 },
	animate: { height: "auto" },
	transition: {
		duration: 0.5,
	},
	exit: { height: 0 },
};

export const MotionScaleProps = {
	// style: { display: "contents" },
	initial: { opacity: 0, scale: 0, height: 0 },
	animate: { opacity: 1, scale: 1, height: "auto" },
	transition: {
		duration: 0.4,
		// ease: [0, 0.71, 0.2, 1.01],
	},
	exit: { opacity: 0, scale: 0, height: 0 },
};
