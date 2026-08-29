import { createContext } from "react";

// Context only file — keep provider/component logic in a separate file to
// ensure Fast Refresh works correctly.
export const ThemeContext = createContext();
