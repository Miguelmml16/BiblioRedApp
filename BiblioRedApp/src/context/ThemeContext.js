// Tema global (oscuro/claro) del panel. Oscuro por defecto, como el
// dashboard de referencia.
import React, { createContext, useContext, useMemo, useState } from 'react';
import { darkColors, lightColors } from '../theme/colors';

const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true);
  const value = useMemo(
    () => ({ colors: dark ? darkColors : lightColors, dark, toggle: () => setDark((d) => !d) }),
    [dark]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
