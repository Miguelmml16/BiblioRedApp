# BiblioRed — Panel móvil (React Native / Expo)

Panel de gestión móvil, estilo dashboard, conectado en vivo al backend
Django (`https://bancolibro.alwaysdata.net/api/`). Pantalla única con
estadísticas, pestañas por recurso, y listado + crear/editar/eliminar
(y "Devolver" en préstamos) sobre los 5 recursos reales. Login por sesión
de Django, tema oscuro/claro, estados de carga y manejo de errores de
red/autenticación/validación.

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
   Si el celular no logra conectar por estar en otra red/firewall, usa
   `npx expo start --tunnel`.

## Autenticación

El backend no expone un endpoint de Token/JWT: usa el login por **sesión**
de Django (el mismo que el panel de administración). Por eso:

- Los 5 recursos (Libros, Categorías, Socios, Préstamos, Donaciones) se
  pueden **consultar sin iniciar sesión** — la API los expone en lectura
  pública.
- Para **crear, editar o eliminar** hace falta iniciar sesión con una
  cuenta **staff** de Django (la misma que usarías para entrar a
  `/admin/`). Sin esa cuenta, los botones de acción quedan ocultos y se
  muestra una invitación a iniciar sesión.
- Al iniciar sesión, la cookie de sesión (`sessionid`) y el token CSRF
  (`csrftoken`) se guardan de forma segura con `expo-secure-store` y se
  adjuntan automáticamente en cada petición que lo requiere
  (`src/services/api.js`). Las actualizaciones usan `PATCH` (parciales),
  no `PUT`, para no depender de campos que el formulario no expone.

## Estructura
```
App.js
index.js
app.json
package.json
assets/
src/
  services/
    api.js          -> cliente HTTP: cookies/CSRF, login/logout, manejo de errores
    resources.js     -> endpoints reales + configuración de listado/campos por recurso
  hooks/
    useResourceList.js   -> carga, error, refresh y CRUD reutilizados por el dashboard
    useDashboardStats.js -> estadísticas en vivo (libros, ejemplares, socios, préstamos activos)
  context/
    AuthContext.js   -> sesión (perfil restaurado + login/logout contra Django)
    ThemeContext.js  -> tema oscuro/claro global
  navigation/
    RootNavigator.js -> dashboard siempre visible + Login como pantalla modal
  screens/
    DashboardScreen.js -> pantalla única: topbar + stats + pestañas + lista + CRUD
    LoginScreen.js
  components/dashboard/
    Topbar.js          -> logo, refrescar, toggle de tema, login/logout
    StatCards.js        -> tarjetas de estadísticas
    ResourceTabs.js      -> pestañas Préstamos/Libros/Socios/Donaciones/Categorías
    RecordCard.js        -> fila de registro con badges y acciones (Devolver/Editar/Eliminar)
    RecordFormModal.js   -> formulario modal de creación/edición
  theme/colors.js -> paletas oscura y clara (acento morado)
```
