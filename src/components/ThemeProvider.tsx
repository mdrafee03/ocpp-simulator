import { useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    const html = document.documentElement;

    // Remove existing theme classes
    html.classList.remove("light", "dark");

    // Add current theme class
    html.classList.add(theme);

    // Set data-theme attribute for DaisyUI
    html.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
};
