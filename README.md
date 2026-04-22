# 🛍️ E-Commerce Frontend

Frontend moderno construido con **React** y **Vite** que consume tres servicios REST separados: `order-service`, `auth-service` y `catalog-service`.

## 📋 Características

✅ **Autenticación de Usuarios**

- Registro e inicio de sesión
- Persistencia de sesión con localStorage
- Validación en frontend

✅ **Catálogo de Productos**

- Listado de productos con búsqueda
- Filtrado por categoría
- Agregar/crear productos
- Información de stock en tiempo real

✅ **Carrito de Compras**

- Agregar/eliminar productos
- Cálculo automático de total
- Vista del carrito

✅ **Órdenes**

- Checkout síncrono contra `order-service`
- Limpieza del carrito después de la compra
- Confirmación visible de la orden

## 🚀 Instalación y Uso

### Requisitos

- Node.js 16+
- npm o yarn

### Instalación

```bash
cd FRONT-DEMO
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build para Producción

```bash
npm run build
npm run preview
```

## 📁 Estructura del Proyecto

```
FRONT-DEMO/
├── src/
│   ├── components/
│   │   ├── Auth.jsx           # Componente de autenticación
│   │   ├── Auth.css           # Estilos de autenticación
│   │   ├── Shop.jsx           # Componente principal de tienda
│   │   └── Shop.css           # Estilos de tienda
│   ├── services/
│   │   └── api.js             # Cliente Axios y servicios
│   ├── App.jsx                # Componente raíz
│   ├── App.css                # Estilos globales
│   ├── main.jsx               # Punto de entrada
│   └── index.css              # Estilos base
├── index.html                 # HTML principal
├── vite.config.js             # Configuración de Vite
├── package.json               # Dependencias
└── README.md                  # Este archivo
```

## 🔌 Conexión con Servicios

El frontend se conecta a tres servicios REST que deben estar corriendo localmente o en la nube:

- `order-service` en `http://localhost:8081`
- `auth-service` en `http://localhost:8082`
- `catalog-service` en `http://localhost:8083`

Las URLs se definen con variables de entorno Vite y se consumen desde [src/services/httpClient.js](src/services/httpClient.js#L1).

```bash
VITE_ORDER_SERVICE_URL=http://localhost:8081
VITE_AUTH_SERVICE_URL=http://localhost:8082
VITE_CATALOG_SERVICE_URL=http://localhost:8083
```

### Endpoints Utilizados

| Módulo              | Método | Endpoint                          |
| ------------------- | ------ | --------------------------------- |
| **Auth service**    | POST   | `/auth/exchange`                  |
|                     | GET    | `/auth/me`                        |
| **Catalog service** | GET    | `/products`                       |
|                     | POST   | `/products`                       |
|                     | GET    | `/products/{id}`                  |
| **Order service**   | POST   | `/cart/add`                       |
|                     | GET    | `/cart/{userId}`                  |
|                     | DELETE | `/cart/{userId}/item/{productId}` |
|                     | DELETE | `/cart/{userId}`                  |
|                     | POST   | `/orders`                         |
|                     | GET    | `/orders/user/{userId}`           |

## 🎨 Temas y Estilos

- **Color Primario:** `#667eea` (Azul)
- **Color Secundario:** `#764ba2` (Púrpura)
- **Gradiente Principal:** `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Diseño Responsivo:** Mobile-first con breakpoints en 768px

## 📦 Dependencias Principales

- **React 19.2.4** - Librería de UI
- **Vite 7.3.1** - Build tool rápido
- **Axios 1.13.6** - Cliente HTTP
- **@vitejs/plugin-react 5.1.4** - Plugin React para Vite

## 🔐 Autenticación

### Flujo de Autenticación

1. **Registro**
   - El usuario ingresa username, email, password y fullName
   - Se envía POST a `/users/register`
   - Se redirige a login automáticamente

2. **Login**
   - El usuario ingresa username y password
   - Se envía POST a `/users/login`
   - Respuesta incluye usuario (sin password)
   - Se guarda en localStorage

3. **Persistencia**
   - Al cargar la app, se valida localStorage
   - Si existe usuario, se salta pantalla de login
   - Al logout, se elimina localStorage

### Datos Guardados en localStorage

```javascript
{
  "id": 1,
  "username": "juan",
  "email": "juan@example.com",
  "fullName": "Juan Pérez"
}
```

> ⚠️ **NOTA ACADÉMICA:** En producción, usar tokens JWT en lugar de localStorage sin encripción.

## 🛒 Flujo de Compra

1. **Visualizar Productos**
   - GET `/products` retorna catálogo completo
   - Se muestran con nombre, descripción, precio, stock y categoría

2. **Agregar al Carrito**
   - POST `/cart/add` con userId, productId, quantity
   - Se valida stock disponible en backend

3. **Ver Carrito**
   - GET `/cart/{userId}` retorna items y total
   - Se calcula automáticamente el subtotal por item

4. **Procesar Orden**
   - POST `/orders` crea la orden desde el carrito
   - El order-service descuenta inventario
   - Se limpia el carrito automáticamente

## 🐛 Solución de Problemas

### Error: "Could not get any response"

**Causa:** El backend no está corriendo.
**Solución:**

```bash
# En otra terminal
cd ../demo
mvn spring-boot:run
```

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Causa:** Backend no permite requests desde frontend.
**Solución:** Agregar CORS al backend (próxima actualización).

### Estado no se sincroniza

**Causa:** Cambios en backend sin actualizar frontend.
**Solución:** Click en el botón de actualizar o recargar página.

## 🧪 Testing Manual

### Setup Completo

1. Inicia backend: `cd ../demo && mvn spring-boot:run`
2. Inicia frontend: `npm run dev`
3. Abre `http://localhost:3000`

### Flujo de Prueba

1. **Registro:** Crea nuevo usuario con datos válidos
2. **Login:** Inicia sesión con las credenciales
3. **Crear Producto:** Agrega nuevos items al catálogo
4. **Carrito:** Agrega productos y verifica total
5. **Logout:** Cierra sesión y verifica que vuelva a login

## 📝 Notas Técnicas

Este frontend demuestra:

- ✅ **Componentes React** funcionales con hooks
- ✅ **Estado local** con useState
- ✅ **Efectos secundarios** con useEffect
- ✅ **Comunicación HTTP** con Axios y clientes separados por servicio
- ✅ **Autenticación** con Google Identity Services y `AuthProvider`
- ✅ **Manejo de errores** y estados de carga
- ✅ **UI responsiva** con CSS modular

## 🚀 Próximas Mejoras

- [x] Implementar órdenes y checkout
- [ ] Carrito persistente en backend
- [ ] Autenticación con JWT
- [ ] Búsqueda y filtrados avanzados
- [ ] Paginación de productos
- [ ] Perfil de usuario
- [ ] Historial de compras
- [ ] Notificaciones toast
- [ ] Dark mode
- [ ] Test unitarios

## 📄 Licencia

ISC

---

**Versión:** 1.0.0
**Última actualización:** 27 de Febrero 2026
**Autor del Proyecto:** Académico

# Front-Cloud
