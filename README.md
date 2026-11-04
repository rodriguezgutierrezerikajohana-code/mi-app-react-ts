# Vademécum Digital de Plantas Medicinales

Aplicación web (React + TypeScript + Vite) con un vademécum de plantas medicinales.
La portada (`/`) y la guía clásica (`/guia`) muestran **el mismo catálogo de plantas**,
servido desde una única fuente de datos.

## Requisitos

- Node.js (versión 18 o superior; se ha probado con Node 24)
- npm (incluido con Node.js)

## Instalación

```bash
npm install
```

## Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:5173`.

## Comandos disponibles

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente. |
| `npm run build` | Compila TypeScript y genera la build de producción en `dist/`. |
| `npm run preview` | Sirve localmente la build de `dist/`. |
| `npm run validar` | Comprueba la integridad de los datos (plantas, categorías, fuentes, imágenes). |
| `npm run verificar` | `validar` + comprobación de tipos + renderizado de prueba. |

`npm run verificar` es la puerta de calidad: valida los datos, pasa `tsc --noEmit` y
después monta la portada, la guía y las cuatro pestañas de cada ficha en memoria
para detectar errores de renderizado que el compilador no puede ver.

## Fuente única de datos

Toda la información de plantas vive en `src/data/`. No hay catálogos duplicados:

```
src/data/
├── plantas.ts    # Catálogo de plantas, categorías y niveles de evidencia (FUENTE DE VERDAD)
├── fuentes.ts    # Catálogo de fuentes (EMA, OMS, NCCIH, MedlinePlus, Kew, IPNI…)
├── imagenes.ts   # Créditos de las fotografías (generado por scripts/obtener-imagenes.mjs)
├── contenido.ts  # Glosario, preparaciones, consejos de jardín, FAQ, aviso legal
└── ias.ts        # Directorio de inteligencias artificiales (vista /ias)
```

### `src/data/plantas.ts`

Es el único lugar donde se declara una planta. El esquema de `Planta` es un
superset de los dos catálogos anteriores, de modo que no se perdió información:

| Campo | Contenido |
| --- | --- |
| `id`, `nombre`, `nombreLocal?` | Identificador, nombre común y nombre familiar. |
| `cientifico`, `familia` | Nombre científico y familia botánica. |
| `categorias[]` | Ids de `CATEGORIAS` (una planta puede estar en varias). |
| `resumen` | Texto corto de la tarjeta. |
| `descripcion`, `distribucion`, `parteUsada` | Identificación, hábitat y parte usada. |
| `usosTradicionales[]` | Prácticas documentadas (no afirman eficacia). |
| `evidencia[]` | Nivel (`tradicional` \| `preliminar` \| `moderada`) y su descripción. |
| `preparaciones[]`, `precauciones[]` | Formas de uso y advertencias. |
| `conservacion` | Cómo conservar la planta. |
| `cultivo` | `luz`, `suelo`, `riego`, `propagacion`. |
| `sabiasQue` | Curiosidad verificada. |
| `fuentes[]` | Claves del catálogo de `fuentes.ts`. |
| `imagen`, `wikipedia` | Clave de la foto y artículo de origen. |

Añadir una planta = añadir un objeto a `PLANTAS`. Todo lo demás se deriva solo:
las dos vistas la muestran, el script de imágenes la descarga y el validador la
comprueba.

### Categorías

`CATEGORIAS` reúne las clasificaciones de las dos versiones anteriores en 7
grupos: digestivas, relajantes, respiratorias, piel, antiinflamatorias,
inmunitarias y vitalidad. Usa `nombreCategoria(id)` e `iconoCategoria(id)` para
mostrarlas con su nombre y su icono.

## Fotografías

```bash
node scripts/obtener-imagenes.mjs
```

Descarga las imágenes de Wikimedia Commons y regenera `src/data/imagenes.ts` con
sus créditos. La lista de plantas se toma del propio catálogo (`planta.wikipedia`),
así que no hay lista de plantas que mantener a mano. Los archivos ya descargados
no se vuelven a bajar.

## Estructura del proyecto

```
mi-app-react-ts/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/images/plantas/   # Fotografías descargadas
├── scripts/
│   ├── obtener-imagenes.mjs  # Descarga de fotos y generación de imagenes.ts
│   ├── validar-datos.mjs     # Comprobación de integridad de los datos
│   ├── smoke-entrada.ts      # Entrada que se compila para el render de prueba
│   └── smoke-ejecutar.mjs    # Aserciones del render de prueba
└── src/
    ├── main.tsx              # Punto de entrada y enrutado
    ├── App.tsx               # Guía clásica (/guia) y vistas /clima y /ias
    ├── App.css
    ├── Clima.tsx
    ├── components/InteligenciasArtificiales.tsx
    ├── data/                 # ← única fuente de datos
    └── vademecum/
        ├── Vademecum.tsx     # Portada del vademécum
        ├── Vademecum.css
        ├── components/FichaPlanta.tsx  # Ficha modal de la planta
        └── hooks/
```

## Rutas

| Ruta | Contenido |
| --- | --- |
| `/`, `/vademecum` | Portada del vademécum: catálogo, galería, glosario, FAQ y fuentes. |
| `/guia` | Guía clásica con las mismas plantas, en formato lista con filtros. |
| `/clima` | Pronóstico de prueba. |
| `/ias` | Directorio de inteligencias artificiales. |

## Tecnologías utilizadas

- [React 18](https://react.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Vite 5](https://vitejs.dev/)
