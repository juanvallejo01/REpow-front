# REpow – Front

Aplicación web para **reservar espacios** y resolver de forma guiada los choques cuando dos
personas editan la misma reserva al mismo tiempo (**bloqueo optimista por versión**).

Hecha con **Vue 3 + Vite**, **Vue Router** y **Axios**. Necesita que el
[back](https://github.com/juanvallejo01/REpow-back) esté corriendo.

## Cómo correrlo

```bash
# 1. con el back corriendo en http://localhost:3000
npm install

# 2. arrancar en http://localhost:5173
npm run dev
```

Si el back está en otra dirección, crea un archivo `.env` con:

```
VITE_API_URL=http://otra-direccion/api
```

## Pantallas

| Ruta | Pantalla | Qué se puede hacer |
|------|----------|--------------------|
| `/espacios` | Espacios | Ver las salas y entrar a una |
| `/espacios/:id` | Detalle de espacio | Elegir un día, ver las horas ocupadas y reservar |
| `/reservas` | Reservas | Ver todas las reservas con su versión, editarlas o cancelarlas |

## Estructura

```
src/
├── main.js                  crea la app y carga los estilos
├── App.vue                  MainLayout + la vista de la ruta actual
├── router/index.js          las rutas de cada pantalla
├── layouts/
│   └── MainLayout.vue       encabezado con el menu
├── views/                   una por pantalla
│   ├── EspaciosView.vue
│   ├── EspacioView.vue
│   └── ReservasView.vue
├── components/
│   ├── ReservaForm.vue      formulario para crear y editar reservas
│   └── ConflictoModal.vue   ventana para resolver un choque
├── services/
│   └── api.js               todas las llamadas al back
├── utils/
│   └── fechas.js            mostrar fechas y horas en hora de Colombia
└── assets/
    └── estilos.css          colores y estilos generales de toda la app
```

Para cambiar colores, bordes o sombras de toda la app, basta con cambiar las variables de
`:root` al inicio de `src/assets/estilos.css`.

## Dónde cambiar cada cosa

| Quiero cambiar... | Archivo |
|-------------------|---------|
| Colores, bordes o sombras de toda la app | `src/assets/estilos.css` |
| El menú | `src/layouts/MainLayout.vue` |
| Las URLs o agregar una pantalla | `src/router/index.js` y `src/views/` |
| Lo que se ve en una pantalla | La vista correspondiente en `src/views/` |
| El formulario de reserva | `src/components/ReservaForm.vue` |
| La ventana de choque | `src/components/ConflictoModal.vue` |
| Una llamada al back | `src/services/api.js` |

## Cómo se resuelve un choque

1. Cada reserva llega del back con su **versión** (se ve como `v1`, `v2`... en la pantalla de Reservas).
2. Al editar o cancelar, el front envía esa versión en el header `If-Match` (ver `services/api.js`).
3. Si otra persona guardó antes, el back responde **412** con la reserva como está ahora.
4. Se abre `ConflictoModal`, que muestra **tus cambios** junto a la **versión actual** y marca
   en amarillo lo que es distinto. El usuario elige:
   - **Quedarme con la versión actual**: descarta sus cambios.
   - **Guardar mis cambios**: los guarda encima de la versión nueva.

### Probarlo con dos usuarios

1. Abre `http://localhost:5173/reservas` en **dos pestañas**.
2. En las dos, haz clic en **Editar** sobre la misma reserva.
3. Cambia algo en la pestaña 1 y guarda: la reserva pasa a la versión 2.
4. Cambia algo en la pestaña 2 y guarda: aparece la ventana del choque.
