# Banco de Libro — App Móvil (React Native / Expo)

App móvil del sistema Banco de Libro, conectada en vivo al backend Django
(`https://bancolibro.alwaysdata.net/api/`). Navegación TAB + Drawer, 5
módulos que consultan y crean datos reales, login por sesión de Django,
estados de carga y manejo de errores de red/autenticación/validación.

## Requisitos
- Node.js instalado (https://nodejs.org — versión LTS).
- La app **Expo Go** en tu celular (Play Store / App Store), o un emulador.

## Instalación

1. Instalar dependencias:
   ```
   npm install
   ```

2. Ejecutar:
   ```
   npx expo start
   ```
   Escanea el QR con Expo Go, o pulsa `a` (Android) / `i` (iOS emulador).

## Autenticación

El backend no expone un endpoint de Token/JWT: usa el login por **sesión**
de Django (el mismo que el panel de administración). Por eso:

- Los 5 módulos (Libros, Categorías, Socios, Préstamos, Donaciones) se
  pueden **consultar sin iniciar sesión** — la API los expone en lectura
  pública.
- Para **crear** un registro nuevo hace falta iniciar sesión con una
  cuenta **staff** de Django (la misma que usarías para entrar a
  `/admin/`). Sin esa cuenta, el botón "Guardar" queda oculto y se muestra
  una invitación a iniciar sesión.
- Al iniciar sesión, la cookie de sesión (`sessionid`) y el token CSRF
  (`csrftoken`) se guardan de forma segura con `expo-secure-store` y se
  adjuntan automáticamente en cada petición que lo requiere
  (`src/services/api.js`).

## Estructura
```
App.js
index.js
app.json
package.json
assets/
src/
  services/
    api.js         -> cliente HTTP: cookies/CSRF, login/logout, manejo de errores
    resources.js    -> endpoints reales + configuración de listado/creación por módulo
  hooks/
    useResourceList.js -> carga, error, refresh y creación reutilizados por los módulos
  context/AuthContext.js -> sesión (perfil restaurado + login/logout contra Django)
  navigation/
    RootNavigator.js      -> app principal siempre visible + Login como pantalla modal
    TabNavigator.js        -> HOME + Libros + Préstamos
    DrawerNavigator.js     -> módulos + info usuario o invitado + login/logout
  screens/                -> Login, Home, Libros, Socios, Préstamos, Donaciones, Categorías
  components/ModuloScreen.js -> pantalla de módulo: lista en vivo + formulario de creación
  theme/colors.js
```
