/* =====================================================================
   Verificación de renderizado: monta el vademécum y la vista anterior
   en memoria (renderToString) para detectar errores en tiempo de
   ejecución que TypeScript no puede ver (p. ej. claves de imagen
   inexistentes o datos ausentes).
   Uso: node scripts/smoke-ejecutar.mjs   (requiere antes:
        npx vite build --ssr scripts/smoke-entrada.ts --outDir .smoke)
   ===================================================================== */
import rdom from 'react-dom/server';
import React from 'react';
import { PLANTAS, CATEGORIAS } from '../src/data/plantas.ts';

const { renderToString } = rdom;

// --- Parches mínimos de navegador para renderizar fuera del navegador ---
globalThis.window = {
  location: { pathname: '/' },
  history: { pushState() {} },
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  addEventListener() {},
  removeEventListener() {},
  scrollTo() {},
  scrollY: 0,
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  navigator: { clipboard: { writeText: async () => {} } },
};
globalThis.document = {
  title: '',
  addEventListener() {},
  removeEventListener() {},
  getElementById: () => null,
  querySelectorAll: () => [],
  body: { classList: { add() {}, remove() {} }, style: {} },
};

const errores = [];
const comprobar = (condicion, texto) => {
  if (condicion) console.log(`  OK   ${texto}`);
  else {
    console.log(`  FALLO ${texto}`);
    errores.push(texto);
  }
};

const { Vademecum, App, FichaPlanta } = await import('../.smoke/smoke-entrada.js');

// ---------- Vademécum (portada) ----------
let html = '';
try {
  html = renderToString(React.createElement(Vademecum));
  console.log('Vademecum renderizado sin errores');
} catch (e) {
  console.error('Vademecum ha fallado al renderizar:', e);
  process.exit(1);
}
comprobar(html.includes('Vademécum Digital de Plantas Medicinales'), 'título de portada');
comprobar(html.includes('La sabiduría de la naturaleza'), 'lema de portada');
comprobar(html.includes('Explorar las plantas'), 'botón explorar plantas');
comprobar(html.includes('Descubrir los saberes ancestrales'), 'botón saberes ancestrales');
comprobar(html.includes('Aviso sanitario'), 'aviso sanitario visible');
comprobar(html.includes('href="/clima"'), 'enlace a Clima en la navegación');
comprobar(html.includes('href="/ias"'), 'enlace a IA en la navegación');
comprobar(
  (html.match(/Abrir ficha de /g) ?? []).length >= PLANTAS.length * 2,
  `${PLANTAS.length} fichas en catálogo + ${PLANTAS.length} en galería`,
);
comprobar(html.includes('/images/plantas/'), 'fotografías locales');
comprobar(!html.includes('thumb.wikimedia.org'), 'sin imágenes externas de Wikimedia');
comprobar(html.includes('medlineplus.gov/herbalmedicine'), 'enlace MedlinePlus verificado');
comprobar(!html.includes('herbsanddietarysupplements'), 'sin enlace MedlinePlus roto');
comprobar(!html.includes('cochranelibrary'), 'sin enlace Cochrane antiguo');
comprobar(!html.includes('powo.science.kew.org'), 'sin enlace Kew roto');
comprobar(html.includes('No encontramos plantas') === false, 'estado vacío solo aparece sin resultados');

// React separa los nodos de texto con comentarios (`<!-- -->`), así que para
// comprobar frases literales hay que trabajar sobre el texto sin comentarios.
const texto = html.replace(/<!--.*?-->/g, '');
comprobar(
  texto.includes(`Las ${PLANTAS.length} plantas del vademécum`),
  `el catálogo anuncia ${PLANTAS.length} plantas`,
);
const categoriasAusentes = CATEGORIAS.filter((c) => !texto.includes(c.nombre));
comprobar(
  categoriasAusentes.length === 0,
  `las ${CATEGORIAS.length} categorías del catálogo aparecen`,
);
if (categoriasAusentes.length > 0) {
  console.log(`        ausentes: ${categoriasAusentes.map((c) => c.nombre).join(', ')}`);
}

// Cada planta del catálogo único debe verse en la portada.
const nombres = PLANTAS.map((p) => p.nombre);
const ausentes = nombres.filter((n) => !texto.includes(n));
comprobar(ausentes.length === 0, `las ${nombres.length} plantas del catálogo aparecen`);
if (ausentes.length > 0) console.log(`        ausentes: ${ausentes.join(', ')}`);

// ---------- Vista anterior (guía, clima e IA) ----------
window.location.pathname = '/clima';
try {
  const htmlClima = renderToString(React.createElement(App));
  comprobar(htmlClima.includes('Madrid'), 'vista Clima (/clima)');
  comprobar(htmlClima.includes('Volver al Vademécum'), 'enlace de vuelta al vademécum');
} catch (e) {
  console.error('App (clima) ha fallado al renderizar:', e);
  errores.push('App clima');
}

window.location.pathname = '/ias';
try {
  const htmlIas = renderToString(React.createElement(App));
  comprobar(htmlIas.includes('Inteligencias Artificiales'), 'vista IA (/ias)');
} catch (e) {
  console.error('App (ias) ha fallado al renderizar:', e);
  errores.push('App ias');
}

window.location.pathname = '/guia';
try {
  const htmlGuia = renderToString(React.createElement(App));
  comprobar(htmlGuia.includes('Plantas Medicinales'), 'vista guía (/guia)');
} catch (e) {
  console.error('App (guia) ha fallado al renderizar:', e);
  errores.push('App guia');
}

// ---------- Ficha de planta (modal) ----------
// La ficha tiene cuatro pestañas: se comprueba que cada una se renderiza
// sin errores y con los datos de la planta.
const PESTANAS_ESPERADAS = [
  ['resumen', 'Cultivo'],
  ['usos', 'Usos tradicionales documentados'],
  ['preparacion', 'Precauciones y contraindicaciones'],
  ['fuentes', 'Fuentes consultadas'],
];

for (const planta of PLANTAS) {
  for (const [pestana, marcador] of PESTANAS_ESPERADAS) {
    try {
      const htmlFicha = renderToString(
        React.createElement(FichaPlanta, { planta, onClose: () => {}, pestanaInicial: pestana }),
      );
      const texto = htmlFicha.replace(/<!--.*?-->/g, '');
      if (!texto.includes(marcador)) {
        errores.push(`«${planta.id}» (${pestana}): falta «${marcador}»`);
      }
      if (htmlFicha.includes('undefined') || htmlFicha.includes('NaN')) {
        errores.push(`«${planta.id}» (${pestana}): la ficha contiene valores indefinidos`);
      }
    } catch (e) {
      console.error(`FichaPlanta ha fallado (${planta.id}, ${pestana}):`, e);
      errores.push(`FichaPlanta ${planta.id}/${pestana}`);
    }
  }
}
comprobar(
  errores.filter((e) => e.startsWith('FichaPlanta') || e.includes('«')).length === 0,
  `las 4 pestañas de las ${PLANTAS.length} fichas se renderizan`,
);

console.log(errores.length === 0 ? '\nTodas las comprobaciones han pasado' : `\n${errores.length} fallos`);
process.exit(errores.length === 0 ? 0 : 1);
