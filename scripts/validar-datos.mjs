/* =====================================================================
   Comprobación de integridad de los datos del vademécum.

   Antes de unificar había tres catálogos de plantas que podían divergir
   sin que nada lo detectara: uno en src/data, otro en src/vademecum/data
   y una lista más en el script de imágenes. Este script verifica que la
   fuente única de verdad (src/data/plantas.ts) está completa y es
   coherente con las imágenes y con el catálogo de fuentes.

   Uso:  node scripts/validar-datos.mjs
   ===================================================================== */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { PLANTAS, CATEGORIAS, NIVELES_EVIDENCIA } from '../src/data/plantas.ts';
import { IMAGENES } from '../src/data/imagenes.ts';
import { FUENTES } from '../src/data/fuentes.ts';

const errores = [];
const avisos = [];

const comprobar = (condicion, mensaje) => {
  if (!condicion) errores.push(mensaje);
};

/** Imágenes de sección que no son plantas pero también deben existir. */
const IMAGENES_DE_SECCION = ['hero', 'saberes', 'preparaciones', 'jardin'];

const NIVELES = Object.keys(NIVELES_EVIDENCIA);
const IDS_CATEGORIA = new Set(CATEGORIAS.map((c) => c.id));
const IDS_FUENTE = new Set(FUENTES.map((f) => f.id));

// --- 1. Identificadores únicos -------------------------------------------
const ids = PLANTAS.map((p) => p.id);
const repetidos = ids.filter((id, i) => ids.indexOf(id) !== i);
comprobar(repetidos.length === 0, `Identificadores de planta repetidos: ${[...new Set(repetidos)].join(', ')}`);

// --- 2. Campos obligatorios ----------------------------------------------
const CAMPOS_TEXTO = [
  'nombre',
  'cientifico',
  'familia',
  'resumen',
  'descripcion',
  'distribucion',
  'parteUsada',
  'conservacion',
  'sabiasQue',
  'wikipedia',
];
const CAMPOS_LISTA = ['usosTradicionales', 'preparaciones', 'precauciones', 'fuentes'];

for (const planta of PLANTAS) {
  for (const campo of CAMPOS_TEXTO) {
    const valor = planta[campo];
    comprobar(
      typeof valor === 'string' && valor.trim().length > 0,
      `«${planta.id}»: el campo «${campo}» está vacío`,
    );
  }
  for (const campo of CAMPOS_LISTA) {
    const valor = planta[campo];
    comprobar(
      Array.isArray(valor) && valor.length > 0,
      `«${planta.id}»: el campo «${campo}» está vacío`,
    );
  }
  comprobar(
    Array.isArray(planta.categorias) && planta.categorias.length > 0,
    `«${planta.id}»: no tiene ninguna categoría`,
  );
  comprobar(
    Array.isArray(planta.evidencia) && planta.evidencia.length > 0,
    `«${planta.id}»: no registra ningún nivel de evidencia`,
  );
  comprobar(
    planta.cultivo &&
      ['luz', 'suelo', 'riego', 'propagacion'].every(
        (c) => typeof planta.cultivo[c] === 'string' && planta.cultivo[c].trim().length > 0,
      ),
    `«${planta.id}»: faltan datos de cultivo (luz, suelo, riego o propagación)`,
  );

  // --- 3. Referencias válidas ---------------------------------------------
  for (const categoria of planta.categorias) {
    comprobar(
      IDS_CATEGORIA.has(categoria),
      `«${planta.id}»: la categoría «${categoria}» no existe en CATEGORIAS`,
    );
  }
  for (const evidencia of planta.evidencia) {
    comprobar(
      NIVELES.includes(evidencia.nivel),
      `«${planta.id}»: nivel de evidencia desconocido «${evidencia.nivel}»`,
    );
    comprobar(
      typeof evidencia.texto === 'string' && evidencia.texto.trim().length > 0,
      `«${planta.id}»: hay una entrada de evidencia sin texto`,
    );
  }
  for (const fuente of planta.fuentes) {
    comprobar(
      IDS_FUENTE.has(fuente),
      `«${planta.id}»: la fuente «${fuente}» no existe en el catálogo de fuentes`,
    );
  }

  // --- 4. Fotografía ------------------------------------------------------
  const credito = IMAGENES[planta.imagen];
  comprobar(
    Boolean(credito),
    `«${planta.id}»: no hay entrada en el mapa de imágenes para la clave «${planta.imagen}»`,
  );
  if (credito) {
    const archivo = path.resolve('public', credito.url.replace(/^\//, ''));
    comprobar(
      existsSync(archivo),
      `«${planta.id}»: falta el archivo de imagen ${credito.url}`,
    );
  }
}

// --- 5. Imágenes de sección ----------------------------------------------
for (const id of IMAGENES_DE_SECCION) {
  const credito = IMAGENES[id];
  comprobar(Boolean(credito), `Falta la imagen de sección «${id}»`);
  if (credito) {
    const archivo = path.resolve('public', credito.url.replace(/^\//, ''));
    comprobar(existsSync(archivo), `Falta el archivo de imagen ${credito.url} (sección «${id}»)`);
  }
}

// --- 6. Imágenes sobrantes ------------------------------------------------
const idsPlanta = new Set(ids);
for (const id of Object.keys(IMAGENES)) {
  if (!idsPlanta.has(id) && !IMAGENES_DE_SECCION.includes(id)) {
    avisos.push(`La imagen «${id}» no corresponde a ninguna planta del catálogo`);
  }
}

// --- Resultado -------------------------------------------------------------
console.log(`Plantas: ${PLANTAS.length}`);
console.log(`Categorías: ${CATEGORIAS.length}`);
console.log(`Fuentes: ${FUENTES.length}`);
console.log(`Imágenes: ${Object.keys(IMAGENES).length}`);

for (const aviso of avisos) console.warn(`  aviso  ${aviso}`);

if (errores.length > 0) {
  console.error(`\n${errores.length} problemas encontrados:`);
  for (const error of errores) console.error(`  error  ${error}`);
  process.exit(1);
}

console.log('\nLos datos son coherentes: plantas, categorías, fuentes e imágenes cuadran.');
