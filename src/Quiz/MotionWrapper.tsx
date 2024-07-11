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

	const { animation = "default" /*, motionObject*/ } = config;

	const wrappers = {
		slideUpDown: MotionSlide,
		slideLeftRight: MotionSlideSide,
		scale: MotionScale,
		default: motionProps,
	};
	return (
		<motion.div
			// When ref is used animation is sometimes buggy? Seems to depend on the AnimationPresense mode
			// Commenting out the ref seems to change whether the AnimationPresense mode (wrapping this component) is being used or not
			ref={ref}
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

export const MotionSlideSide = {
	initial: { opacity: 0, x: "-120px" },
	animate: { opacity: 1, x: 0 },
	transition: { duration: 0.5 },
	exit: { opacity: 0, x: "-120px" },
};

// With flexGrow, but it's buggy
// export const MotionSlide = {
// 	style: { overflow: "hidden" },
// 	initial: { height: 0, flexGrow: 0 },
// 	animate: { height: "auto", flexGrow: 1 },
// 	transition: { duration: 0.5 },
// 	exit: { height: 0, flexGrow: 0 },
// };
