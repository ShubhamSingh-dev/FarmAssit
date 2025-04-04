import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ Fix: Define `cn` function for merging Tailwind classes
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// ✅ Keep your existing function for smooth scrolling
export function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}
