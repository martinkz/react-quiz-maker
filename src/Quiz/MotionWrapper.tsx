import { motion, AnimatePresence, MotionProps } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";
import { QuizConfig } from "./types";

export const AnimatePresenceWithDisable = ({ children, config }: { children: React.ReactNode; config: QuizConfig }) => {
	const { animation = "default" } = config;
	const animatePresenceMode = animation === "slideLeft" ? "popLayout" : "sync";

	if (animation === "disabled") {
		return children;
	} else {
		return <AnimatePresence mode={animatePresenceMode}>{children}</AnimatePresence>;
	}
};

export const MotionWrapper = forwardRef(function (
	{ children, config, motionProps }: { children: React.ReactNode; config?: QuizConfig; motionProps?: MotionProps },
	ref: ForwardedRef<HTMLDivElement>
) {
	const { animation = "mixed" /*, motionObject*/ } = config || {};

	const wrappers = {
		slideUp: MotionSlideUp,
		slideLeft: MotionSlideLeft,
		scale: MotionScale,
		mixed: motionProps,
	};

	if (animation === "disabled") {
		return <div>{children}</div>;
	} else {
		return (
			<motion.div
				// When ref is used animation is sometimes buggy? Seems to depend on the AnimationPresense mode
				// Commenting out the ref seems to change whether the AnimationPresense mode (wrapping this component) is being used or not
				ref={ref}
				{...wrappers[animation]}
			>
				{children}
			</motion.div>
		);
	}
});

export const MotionSlideUp = {
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

export const MotionSlideLeft = {
	initial: { opacity: 0, x: "-120px" },
	animate: { opacity: 1, x: 0 },
	transition: { duration: 0.5 },
	exit: { opacity: 0, x: "-120px" },
};

// With flexGrow, but it's buggy
// export const MotionSlideUp = {
// 	style: { overflow: "hidden" },
// 	initial: { height: 0, flexGrow: 0 },
// 	animate: { height: "auto", flexGrow: 1 },
// 	transition: { duration: 0.5 },
// 	exit: { height: 0, flexGrow: 0 },
// };
