import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

Object.defineProperty(global, "scrollTo", { value: vi.fn(), writable: true });

afterEach(() => {
	cleanup();
});
