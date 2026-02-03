import { ref, onMounted, onUnmounted } from "vue";

const THEME_STORAGE_KEY = "life-calendar-theme";
const isDark = ref(false);

// Apply theme to document
const applyTheme = () => {
  if (typeof document !== "undefined") {
    if (isDark.value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
};

// Initialize theme from localStorage or system preference
const initTheme = () => {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored) {
    isDark.value = stored === "dark";
  } else {
    // Check system preference
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  applyTheme();
};

// Initialize theme immediately (before Vue mounts)
if (typeof window !== "undefined") {
  initTheme();
}

export function useTheme() {
  let mediaQuery = null;
  let mediaQueryListener = null;

  // Toggle theme
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    applyTheme();
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, isDark.value ? "dark" : "light");
    }
  };

  // Set theme explicitly
  const setTheme = theme => {
    isDark.value = theme === "dark";
    applyTheme();
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  };

  // Watch for system theme changes
  onMounted(() => {
    // Sync with current state
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      isDark.value = stored === "dark";
    } else {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    applyTheme();

    if (typeof window !== "undefined") {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQueryListener = e => {
        // Only update if user hasn't set a preference
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
          isDark.value = e.matches;
          applyTheme();
        }
      };

      mediaQuery.addEventListener("change", mediaQueryListener);
    }
  });

  onUnmounted(() => {
    if (mediaQuery && mediaQueryListener) {
      mediaQuery.removeEventListener("change", mediaQueryListener);
    }
  });

  return {
    isDark,
    toggleTheme,
    setTheme
  };
}
