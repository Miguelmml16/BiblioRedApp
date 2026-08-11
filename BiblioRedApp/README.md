# Banco de Libro — App Móvil (React Native / Expo)

App móvil del sistema Banco de Libro (Taller #5). Incluye Login con SQLite,
navegación TAB + Drawer, pantallas de los módulos, cerrar sesión, sesión
persistente (Reto 1) e info del usuario en el Drawer (Reto 2).

## Requisitos
- Node.js instalado (https://nodejs.org — versión LTS).
- La app **Expo Go** en tu celular (Play Store / App Store), o un emulador.

## Instalación (desde cero, versión-segura)

1. Crear el proyecto base:
   ```
   npx create-expo-app@latest BancoLibroApp --template blank
   cd BancoLibroApp
   ```

2. Instalar dependencias (Expo elige versiones compatibles):
   ```
   npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs @react-navigation/drawer react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated @react-native-async-storage/async-storage expo-sqlite
   ```

3. Copiar dentro del proyecto el archivo `App.js` y la carpeta `src/` de este ZIP
   (reemplaza el `App.js` que viene por defecto).

4. Ejecutar:
   ```
   npx expo start
   ```
   Escanea el QR con Expo Go, o pulsa `a` (Android) / `i` (iOS emulador).

## Usuario de prueba
- Usuario: `admin`
- Contraseña: `1234`
(Se crea solo en SQLite la primera vez que abre la app.)

## Si aparece un error de "worklets" al abrir
Ejecuta y reinicia limpiando caché:
```
npx expo install react-native-worklets
npx expo start -c
```

## Estructura
```
App.js
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
