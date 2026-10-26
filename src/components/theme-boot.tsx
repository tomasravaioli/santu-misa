import { useEffect } from "react";
import { usePrefs } from "@/lib/prefs";

function prefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeBoot() {
  const theme = usePrefs((s) => s.theme);

  useEffect(() => {
    void usePrefs.persist.rehydrate();
  }, []);

  useEffect(() => {
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && prefersDark());
      document.documentElement.classList.toggle("dark", dark);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", dark ? "#050505" : "#6B1C1C");
    };
    apply();
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  return null;
}
