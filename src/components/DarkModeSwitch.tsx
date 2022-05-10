import { createEffect, createSignal } from "solid-js";
import style from "./DarkModeSwitch.module.css";

function DarkModeSwitch() {
  const stored = localStorage.getItem("darkmode");
  const [dark, setDark] = createSignal(
    stored === null
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : stored === "dark"
  );

  createEffect(() => {
    const d = dark();
    localStorage.setItem("darkmode", d ? "dark" : "light");
    document.documentElement.classList.toggle("dark", d);
  });

  return (
    <label
      class={style.switchLabel}
      title="The dark mode stylesheet was generated from light mode styles by darkreader.org. It's awesome, go check it out!"
    >
      <input
        type="checkbox"
        onChange={(e: Event) => setDark((e.target as HTMLInputElement).checked)}
        checked={dark()}
      />
      Dark mode
    </label>
  );
}

export default DarkModeSwitch;
