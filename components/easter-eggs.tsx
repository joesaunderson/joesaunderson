"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const KONAMI = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

const CARP = ["c", "a", "r", "p"];

function endsWith(buffer: string[], sequence: string[]): boolean {
  if (buffer.length < sequence.length) return false;
  return sequence.every(
    (key, index) => buffer[buffer.length - sequence.length + index] === key,
  );
}

export function EasterEggs() {
  const router = useRouter();
  const bufferRef = useRef<string[]>([]);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    console.log(
      "%cThere's no J-O-K-E without J-O-E.",
      "font-family: monospace; font-size: 14px; font-weight: 600;",
    );
    console.log(
      "Two more easter eggs: one belongs to a certain football club (you know the code), and one is the name of a certain fish. Source: https://github.com/joesaunderson/joesaunderson",
    );
  }, []);

  useEffect(() => {
    const showToast = (message: string) => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      setToast(message);
      toastTimeoutRef.current = setTimeout(() => setToast(null), 4000);
    };

    const handleKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        return;
      }

      const buffer = bufferRef.current;
      buffer.push(event.key.toLowerCase());
      if (buffer.length > KONAMI.length) buffer.shift();

      if (endsWith(buffer, KONAMI)) {
        const enabled = document.documentElement.classList.toggle("liverpool");
        showToast(
          enabled
            ? "You'll Never Walk Alone."
            : "Full time. Normal colours restored.",
        );
        bufferRef.current = [];
      } else if (endsWith(buffer, CARP)) {
        bufferRef.current = [];
        router.push("/fishing");
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [router]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-10 flex justify-center px-6"
    >
      {toast && (
        <p className="rounded-full bg-accent px-4 py-2 font-mono text-base text-white sm:text-sm dark:text-neutral-950">
          {toast}
        </p>
      )}
    </div>
  );
}
