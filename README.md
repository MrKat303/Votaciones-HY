# SISTEMA DE ELECCIONES V2.9

Plataforma institucional de escrutinio digital diseñada para la gestión de asambleas, votaciones y toma de decisiones en tiempo real. Este sistema permite una transición fluida entre la votación de los participantes y la visualización de resultados mediante interfaces de transmisión profesional.

## 🛠️ Stack Tecnológico

- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **Base de Datos & Realtime:** Supabase
- **Estilos:** Tailwind CSS
- **Iconografía:** Lucide React
- **Componentes Visuales:** Recharts, QRCodeSVG

## 🌟 Funcionalidades Clave

### 👨‍💼 Panel de Administración (Monitor de Control)
- **Gestión de Sesiones:** Creación, lanzamiento y cierre de votaciones con tiempos personalizados.
- **Modos de Votación:**
    - **Booleana:** A favor, En contra, Abstención (con vista de Quórum 2/3).
    - **Múltiple:** Selección de opciones personalizadas.
    - **Nube de Ideas:** Recolección dinámica de conceptos (WordCloud).
- **Control de Visibilidad:** Toggle dinámico para publicar o privatizar resultados en la sala pública en tiempo real.
- **Modo Transmisión:** Interfaz de pantalla completa optimizada para proyectores o streaming:
    - **Hemiciclo Legislativo:** Visualización de asientos para votos booleanos.
    - **Modo Presentación:** Fondo pastel minimalista para Nube de Ideas.
    - **Dashboard V2.9:** Vista técnica con métricas y temporizadores.

### 🗳️ Interfaz del Votante (Sala Pública)
- **Experiencia Mobile-First:** Diseñada para una interacción rápida desde dispositivos móviles.
- **Seguridad:** Control de doble voto mediante identificador único por dispositivo.
- **Privacidad:** Los resultados solo son visibles si el administrador decide publicarlos.
- **Auto-Limpieza:** Las encuestas desaparecen automáticamente del feed al finalizar el tiempo o tras emitir el voto (según configuración).

## 🚀 Configuración e Instalación

1. **Clonar repositorio:**
   ```bash
   git clone https://github.com/MrKat303/Votaciones-HY.git
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Variables de Entorno:**
   Crear un archivo `.env.local` con las credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_shave_anonima
   ```

4. **Base de Datos:**
   Ejecutar el script contenido en `supabase_schema.sql` en el editor SQL de tu proyecto Supabase para inicializar las tablas y el Realtime.

5. **Desarrollo:**
   ```bash
   npm run dev
   ```

## 📐 Estructura de Archivos

- `/app`: Rutas principales (Landing, Admin, Sala de Votación).
- `/components`: Lógica de visualización (LiveResults, Hemiciclo, Temporizadores).
- `/lib`: Configuración de API y cliente de Supabase.
- `/types`: Definiciones de modelos de datos.
- `supabase_schema.sql`: Definición de la estructura de la base de datos.
- `Logo.svg`: Activo institucional de la marca.

---
**Desarrollado para SISTEMA DE ELECCIONES 2026**
