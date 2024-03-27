import { ComponentProps } from "react";
export type ButtonProps = ComponentProps<"button"> & {
    icon?: string;
};
export type QuizProps = {
    quizData: object;
    children?: React.ReactNode;
};
export declare const Quiz: ({ quizData, children }: QuizProps) => import("react/jsx-runtime").JSX.Element;
export declare const IntroPage: ({ onStart }: {
    onStart: () => void;
}) => import("react/jsx-runtime").JSX.Element;
export default Quiz;
