# Banco de Libro — App Móvil (React Native / Expo)

App móvil del sistema Banco de Libro (Taller #5). Incluye Login con SQLite,
navegación TAB + Drawer, pantallas de los módulos, cerrar sesión, sesión
persistente (Reto 1) e info del usuario en el Drawer (Reto 2).

## Requisitos
- Node.js instalado (https://nodejs.org — versión LTS).
- La app **Expo Go** en tu celular (Play Store / App Store), o un emulador.

## Instalación

Este repositorio ya incluye `package.json`, `app.json` y `assets/` — es un proyecto Expo completo y listo para ejecutar.

1. Instalar dependencias:
   ```
   npm install
   ```

2. Ejecutar:
   ```
   npx expo start
   ```
   Escanea el QR con Expo Go, o pulsa `a` (Android) / `i` (iOS emulador).

## Usuario de prueba
- Usuario: `admin`
- Contraseña: `1234`
(Se crea solo en SQLite la primera vez que abre la app.)

## Estructura
```
App.js
index.js
app.json
package.json
assets/
src/
  database/db.js          -> SQLite: tabla usuarios, validar login
  context/AuthContext.js  -> sesión, login/logout, persistencia (Reto 1)
  navigation/
    RootNavigator.js      -> Login vs App principal
    TabNavigator.js       -> HOME + Libros + Préstamos
    DrawerNavigator.js    -> módulos + info usuario (Reto 2) + logout
  screens/                -> Login, Home, Libros, Socios, Préstamos, Donaciones, Categorías
  components/ModuloScreen.js -> pantalla base reutilizable de módulos
  theme/colors.js
```
