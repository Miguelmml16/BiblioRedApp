// Paleta oscura (por defecto) del panel Banco de Libro / BiblioRed.
export const darkColors = {
  bg: '#0f1115',
  card: '#171a21',
  cardAlt: '#1c202a',
  line: '#262a33',
  text: '#e7e9ee',
  gray: '#9aa2b1',
  primary: '#7c3aed', // acento morado
  primaryDark: '#6d28d9',
  accent: '#7c3aed',
  ok: '#22c55e',
  danger: '#ef4444',
  warning: '#d59a1f',
  dark: true,
};

// Paleta clara (toggle de tema).
export const lightColors = {
  bg: '#f4f5f7',
  card: '#ffffff',
  cardAlt: '#f0eefc',
  line: '#e3e5ea',
  text: '#1a1c22',
  gray: '#6b7280',
  primary: '#7c3aed',
  primaryDark: '#6d28d9',
  accent: '#7c3aed',
  ok: '#15803d',
  danger: '#dc2626',
  warning: '#a5690f',
  dark: false,
};

// Export por defecto: paleta oscura (usada por pantallas que aún no
// consumen ThemeContext, p. ej. antes de que el provider monte).
export const colors = darkColors;
