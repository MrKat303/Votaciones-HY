# Sistema de Votaciones HY

Plataforma de votación digital institucional moderna, diseñada para asambleas con resultados en tiempo real.

## 🚀 Características

- **Admin Dashboard**: Gestión completa de votaciones (crear, cerrar, monitorear).
- **Votación Segura**: Bloqueo de doble voto por dispositivo (Fingerprint + LocalStorage).
- **Tiempo Real**: Actualización instantánea de resultados y estado.
- **UI Moderna**: Diseño "Glassmorphism" con paleta de colores institucional.
- **Tech Stack**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, Recharts.

## 🛠️ Instalación Local

1.  Clonar el repositorio:
    ```bash
    git clone https://github.com/MrKat303/Votaciones-HY.git
    cd Votaciones-HY
    ```

2.  Instalar dependencias:
    ```bash
    npm install
    # o
    pnpm install
    ```

3.  Correr el servidor de desarrollo:
    ```bash
    npm run dev
    ```

4.  Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 🏗️ Estructura del Proyecto

```
/app
  /admin        # Rutas de administrador (Dashboard, Crear)
  /votar        # Interfaz de votación
  layout.tsx    # Layout global y fuentes
  page.tsx      # Landing page
/components
  /admin        # Componentes de admin (Formularios)
  /ui           # Componentes base (Button, Card, Input)
  /voting       # Componentes de votación (Card, Timer, Charts)
/lib
  api.ts        # Mock Backend logic
  utils.ts      # Utilidades de estilo
/types          # Definiciones TypeScript
```

## 📦 Deploy en Vercel

1.  Subir el proyecto a tu GitHub.
2.  Importar el proyecto en [Vercel](https://vercel.com/new).
3.  Deployar (No requiere configuración extra).

## 🎨 Paleta de Colores

| Uso | Color | Hex |
| --- | --- | --- |
| Primario | Morado Oscuro | `#3A1B4E` |
| Fondo | Crema | `#F4EDE4` |
| Éxito | Verde | `#2EB67D` |
| Info | Azul Cielo | `#529CE8` |
| Error | Rosa Fuerte | `#C22359` |
| Acento | Amarillo | `#FFC100` |
