# The Builders Camp by HiveYoung

Landing page oficial de **The Builders Camp**, una iniciativa de [HiveYoung](https://hiveyoung.org/) para estudiantes de enseñanza media que quieren aprender, crear y desarrollar las habilidades del futuro.

The Builders Camp es una experiencia intensiva de cinco días en la que jóvenes exploran tecnología, creatividad, liderazgo y emprendimiento mediante talleres, desafíos reales y trabajo en equipo.

## Sobre el sitio

La landing presenta la propuesta del programa y acompaña a cada postulante desde el descubrimiento de la experiencia hasta el envío de su postulación.

Incluye:

- Presentación del programa y su propósito.
- Información sobre la experiencia, metodología y actividades.
- Sección de preguntas frecuentes.
- Diseño responsivo para escritorio y dispositivos móviles.
- Animaciones e interacciones visuales.
- Formulario de postulación por etapas.
- Envío seguro de postulaciones mediante una ruta interna y Google Apps Script.
- Metadatos SEO, Open Graph, sitemap y robots.

## Tecnologías

- [Next.js 16](https://nextjs.org/) con App Router.
- [React 19](https://react.dev/).
- [TypeScript](https://www.typescriptlang.org/).
- [GSAP](https://gsap.com/) para animaciones.
- [Lenis](https://lenis.darkroom.engineering/) para desplazamiento suave.
- CSS y recursos gráficos personalizados.

## Desarrollo local

### Requisitos

- Node.js 20 o superior.
- npm, pnpm, yarn o Bun.

### Instalación

```bash
git clone https://github.com/MrKat303/thebuilderscamp.git
cd thebuilderscamp
npm install
```

### Ejecución

```bash
npm run dev
```

Luego abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Comandos disponibles

```bash
npm run dev      # Inicia el entorno de desarrollo
npm run build    # Genera la versión de producción
npm run start    # Ejecuta la versión de producción
npm run lint     # Revisa la calidad del código
```

## Estructura principal

```text
app/
├── api/apply/       # Recepción y reenvío de postulaciones
├── apply/           # Formulario de postulación
├── components/      # Componentes compartidos
├── layout.tsx       # Layout, metadatos y datos estructurados
└── page.tsx         # Landing page principal

public/              # Imágenes, logotipos y recursos estáticos
google-apps-script/  # Script que crea el formulario y recibe postulaciones
```

## Integración de postulaciones

El archivo `google-apps-script/Code.gs` contiene la definición del Google Form y el endpoint que registra cada postulación. La aplicación se conecta al despliegue mediante estas variables de entorno:

```bash
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
GOOGLE_APPS_SCRIPT_TOKEN=token-privado-de-integracion
```

Puedes usar `env.example` como referencia. Nunca publiques el token real en el repositorio.

## Despliegue

El proyecto puede desplegarse en cualquier plataforma compatible con Next.js. Para producción, genera primero una compilación optimizada con `npm run build`.

---

Desarrollado para **The Builders Camp by HiveYoung**.
