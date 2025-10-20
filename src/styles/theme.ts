export const theme = {
  colors: {
    background: '#121212',      // Fondo principal muy oscuro
    surface: '#1E1E1E',         // Fondo para tarjetas y formularios
    primary: '#BB86FC',         // Color de acento principal (botones, enlaces)
    secondary: '#03DAC6',       // Color de acento secundario
    text: '#FFFFFF',           // Texto principal (blanco)
    textSecondary: '#B3B3B3',  // Texto secundario (gris claro)
    border: '#2C2C2C',          // Color para bordes
    error: '#CF6679',          // Color para errores
  },
};

export type ThemeType = typeof theme;
