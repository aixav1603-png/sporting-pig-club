# 🐷 Pig Fit Club - Sistema de Gestión de Club Deportivo

Un sistema completo de gestión para clubes deportivos con temática de cerdo fitness. Arquitectura desacoplada: Frontend en Vanilla JavaScript y Backend en Node.js/Express.

## 📋 Características Principales

- ✅ **Autenticación Segura**: JWT tokens + bcrypt password hashing
- ✅ **3 Roles Distintos**: Atleta, Entrenador, Administrador
- ✅ **Dashboards Personalizados**: Interfaz adaptada a cada rol
- ✅ **Gestión de Usuarios CRUD**: Control completo por administradores
- ✅ **API REST**: Comunicación cliente-servidor limpia
- ✅ **Persistencia Real**: Base de datos JSON
- ✅ **Modo Offline**: Simulación de datos en host estático

## 🏗️ Arquitectura

```
project/
├── backend/
│   ├── db/
│   │   └── users.json          # Base de datos
│   ├── middlewares/
│   │   └── auth.js             # Middlewares de autenticación
│   ├── routes/
│   │   ├── auth.js             # Rutas de login/register
│   │   ├── dashboard.js        # Rutas de dashboards
│   │   └── users.js            # CRUD de usuarios
│   └── server.js               # Servidor Express
├── public/
│   ├── index.html              # Landing page
│   ├── login.html              # Página de login
│   ├── register.html           # Página de registro
│   ├── dashboard_admin.html    # Dashboard del Admin
│   ├── dashboard_coach.html    # Dashboard del Coach
│   ├── dashboard_usuario.html  # Dashboard del Atleta
│   ├── styles.css              # Estilos globales
│   ├── images/                 # Carpeta para imágenes/logo
│   └── js/
│       ├── api.js              # Capa de comunicación API
│       ├── auth.js             # Lógica de autenticación
│       └── dashboard.js        # Lógica de dashboards
├── package.json                # Dependencias
├── .env                        # Variables de entorno
└── README.md                   # Este archivo
```

## 🚀 Instalación y Ejecución

### Requisitos
- Node.js (v14 o superior)
- npm

### Pasos

1. **Instalar dependencias**
```bash
npm install
```

2. **Iniciar el servidor**
```bash
npm start
```

El backend estará disponible en `http://localhost:5000`

3. **Acceder a la aplicación**
- Abre tu navegador en `http://localhost:5000`
- Verás la landing page con opciones de login/registro

## 👤 Usuarios de Demo

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@pigfit.com | password123 |
| Coach | coach@pigfit.com | password123 |
| Athlete | athlete@pigfit.com | password123 |

*Nota: Las contraseñas están hasheadas en la base de datos.*

## 📚 Guía de Desarrollo

### Estructura Frontend

#### `js/api.js` - Capa de Red
- **Función principal**: `apiRequest(endpoint, options)`
- **Características**:
  - Inyecta automáticamente headers (`Content-Type`, `Authorization`)
  - Soporte para simulación en host estático
  - Manejo de errores centralizado

Ejemplo:
```javascript
const data = await apiRequest('/dashboard', { method: 'GET' });
```

#### `js/auth.js` - Autenticación
- Captura eventos de formularios
- Validación en cliente
- Guarda token y usuario en localStorage
- Redirección automática según rol

#### `js/dashboard.js` - Lógica de Dashboards
- Protección de rutas (`requireAuth`)
- Renderizado dinámico de componentes
- Gestión CRUD de usuarios (Admin)
- Navegación del sidebar

### Estructura Backend

#### Endpoints de API

**Públicos:**
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

**Protegidos (requieren token JWT):**
- `GET /api/dashboard` - Obtiene datos personalizados por rol
- `GET /api/users` - Lista todos los usuarios (Admin)
- `POST /api/users` - Crea nuevo usuario (Admin)
- `PUT /api/users/:id` - Actualiza usuario (Admin)
- `DELETE /api/users/:id` - Elimina usuario (Admin)

#### Middlewares

**authMiddleware**: Verifica token JWT válido
```javascript
router.get('/dashboard', authMiddleware, ...);
```

**adminMiddleware**: Verifica que el usuario sea Admin
```javascript
router.delete('/users/:id', authMiddleware, adminMiddleware, ...);
```

## 🎨 Personalización del Diseño

La temática puede ser fácilmente modificable. Los puntos clave son:

### Cambiar Colores (CSS)
Edita las variables en `styles.css`:
```css
:root {
  --primary-pig: #FF6B9D;      /* Color principal */
  --secondary-pig: #FFA6C1;    /* Color secundario */
  --accent-gold: #FFD700;      /* Acentos */
}
```

### Cambiar HTML
- Los `id` de elementos HTML son críticos para la funcionalidad
- Si cambias `id`, actualiza las referencias en `auth.js` y `dashboard.js`
- Puedes cambiar clases CSS libremente

### Agregar Imágenes y Logo
1. Coloca imágenes en `public/images/`
2. Referencia en HTML:
```html
<img src="images/logo.png" alt="Pig Fit Logo">
```

## 🔐 Seguridad

- Contraseñas encriptadas con bcrypt (10 salt rounds)
- Tokens JWT con expiración de 24 horas
- Middlewares de autenticación y autorización
- Headers de seguridad (CORS configurado)

## 📱 Responsividad

La aplicación es totalmente responsive:
- **Desktop**: Diseño de dos columnas (sidebar + contenido)
- **Tablet**: Sidebar colapsado
- **Mobile**: Menú adaptativo

## 🐛 Troubleshooting

**Error: "Puerto 5000 ya está en uso"**
- Cambia el puerto en `.env`
- O mata el proceso: `lsof -ti:5000 | xargs kill -9`

**Error: "Token inválido"**
- Limpia localStorage: `localStorage.clear()`
- Vuelve a hacer login

**Errores CORS**
- Asegúrate que el backend está ejecutándose
- Verifica la URL en `api.js`: `API_BASE_URL`

## 📝 Próximas Características

- [ ] Agregar imágenes y logo oficial
- [ ] Sistema de reservas de entrenamientos
- [ ] Notificaciones en tiempo real
- [ ] Estadísticas avanzadas
- [ ] Integración con Google Calendar
- [ ] Exportar reportes en PDF

## 📄 Licencia

MIT

---

**Hecho con 🐷 y 💪 para el fitness**
