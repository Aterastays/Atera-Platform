import { useEffect, useRef } from "react";

export function useScrollReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { el.style.opacity = "1"; el.style.transform = "none"; return; }
    el.classList.add("reveal");
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("revealed"); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref as any;
}

export function useStaggerReveal(count: number, delayMs = 80) {
  const refs = Array.from({ length: count }, () => useRef<HTMLElement>(null));
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observers: IntersectionObserver[] = [];
    refs.forEach((ref, i) => {
      const el = ref.current;
      if (!el) return;
      if (prefersReduced) { el.style.opacity = "1"; el.style.transform = "none"; return; }
      el.classList.add("reveal");
      el.style.transitionDelay = `${i * delayMs}ms`;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { el.classList.add("revealed"); observer.disconnect(); } },
        { threshold: 0.15 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);
  return refs as any;
}
