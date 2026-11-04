/**
 * Descarga fotografías reales de las plantas del vademécum desde Wikipedia/Wikimedia
 * y genera src/data/imagenes.ts con los créditos (autor + licencia) de cada imagen.
 *
 * Uso:  node scripts/obtener-imagenes.mjs
 *
 * La lista de plantas NO se mantiene aquí: se toma de src/data/plantas.ts, que es
 * la fuente única de verdad. Cada planta declara en su campo `wikipedia` el
 * artículo del que se obtiene la fotografía, así que añadir una planta al
 * catálogo la incorpora automáticamente a este script.
 *
 * No agrega dependencias: usa el fetch nativo de Node 18+.
 */
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { PLANTAS as CATALOGO } from '../src/data/plantas.ts';

const UA = 'VademecumDigitalApp/1.0 (proyecto educativo estatico sin fines de lucro)';

/** id -> título del artículo de Wikipedia (tomado del catálogo de plantas) */
const PLANTAS = Object.fromEntries(CATALOGO.map((p) => [p.id, p.wikipedia]));

/** imágenes de portada y secciones */
const SECCIONES = {
  hero: ['Herbalism', 1600],
  saberes: ['Ethnobotany', 1200],
  preparaciones: ['Herbal tea', 1200],
  jardin: ['Herb garden', 1200],
};

/**
 * Fotos elegidas a mano para evitar regenerar archivos no deseados
 * (p. ej. la sábila venía como un collage PNG de 1,3 MB; se reemplazó
 * por la fotografía de portada de es.wikipedia, en JPEG).
 */
const FIJOS = {
  sabila: {
    archivo: 'Aloe_vera_JRVdH_10.jpg',
    px: 960,
    pagina: 'https://es.wikipedia.org/wiki/Aloe_vera',
  },
};

/** URL de miniatura de un archivo de Wikimedia Commons (ruta = md5 del nombre). */
function urlThumbCommons(archivo, px) {
  const nombre = archivo.replace(/ /g, '_');
  const hex = createHash('md5').update(nombre).digest('hex');
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${hex[0]}/${hex.slice(0, 2)}/${nombre}/${px}px-${nombre}`;
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(host, params) {
  const u = new URL(`https://${host}/w/api.php`);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  u.searchParams.set('format', 'json');
  u.searchParams.set('formatversion', '2');

  for (let intento = 1; intento <= 5; intento++) {
    const r = await fetch(u, { headers: { 'User-Agent': UA } });
    if (r.status === 429) {
      const esperaMs = 5000 * intento;
      console.log(`  ...limitado (429), espero ${esperaMs / 1000}s`);
      await espera(esperaMs);
      continue;
    }
    if (!r.ok) throw new Error(`API ${host} -> ${r.status}`);
    await espera(1200); // respeto el ritmo de la API
    return r.json();
  }
  throw new Error(`API ${host}: demasiados 429`);
}

function limpiarHtml(html = '') {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function obtenerFoto(titulo, px) {
  const d = await api('en.wikipedia.org', {
    action: 'query',
    prop: 'pageimages',
    piprop: 'name|thumbnail|original',
    pithumbsize: String(px),
    redirects: '1',
    titles: titulo,
  });
  const page = d.query?.pages?.[0];
  if (!page || page.missing || !page.thumbnail?.source) return null;
  return {
    thumb: page.thumbnail.source,
    archivo: page.pageimage || null,
    titulo: page.title,
  };
}

async function obtenerCreditos(fileTitle) {
  if (!fileTitle) return { autor: 'Wikimedia Commons', licencia: 'Sin datos' };
  try {
    const d = await api('en.wikipedia.org', {
      action: 'query',
      prop: 'imageinfo',
      iiprop: 'extmetadata',
      titles: `File:${fileTitle}`,
    });
    const meta = d.query?.pages?.[0]?.imageinfo?.[0]?.extmetadata || {};
    return {
      autor: limpiarHtml(meta.Artist?.value) || 'Autor no indicado',
      licencia: limpiarHtml(meta.LicenseShortName?.value) || 'Licencia no indicada',
    };
  } catch {
    return { autor: 'Wikimedia Commons', licencia: 'Sin datos' };
  }
}

/** Devuelve la URL del artículo en español si existe; si no, la del inglés. */
async function paginaDelArticulo(titulo) {
  const es = `https://es.wikipedia.org/wiki/${encodeURIComponent(titulo.replace(/ /g, '_'))}`;
  try {
    const r = await fetch(es, { method: 'HEAD', headers: { 'User-Agent': UA } });
    if (r.ok) return es;
  } catch {
    /* se usa el inglés */
  }
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(titulo.replace(/ /g, '_'))}`;
}

async function descargar(url, destino) {
  for (let intento = 1; intento <= 4; intento++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (r.status === 429) {
      await espera(4000 * intento);
      continue;
    }
    if (!r.ok) throw new Error(`descarga ${r.status}: ${url}`);
    const buf = Buffer.from(await r.arrayBuffer());
    await writeFile(destino, buf);
    await espera(600);
    return buf.length;
  }
  throw new Error(`descarga: demasiados 429 en ${url}`);
}

async function main() {
  const dirImagenes = path.resolve('public/images/plantas');
  await mkdir(dirImagenes, { recursive: true });

  const todo = [
    ...Object.entries(PLANTAS).map(([id, titulo]) => [id, titulo, 900]),
    ...Object.entries(SECCIONES).map(([id, [titulo, px]]) => [id, titulo, px]),
  ];

  const creditos = {};
  let ok = 0;
  let fallos = 0;

  for (const [id, titulo, px] of todo) {
    try {
      const fijo = FIJOS[id];
      const foto = fijo
        ? { thumb: urlThumbCommons(fijo.archivo, fijo.px), archivo: fijo.archivo, titulo: null }
        : await obtenerFoto(titulo, px);
      if (!foto) {
        console.warn(`[sin foto] ${id} (${titulo})`);
        fallos++;
        continue;
      }
      const ext = (foto.thumb.match(/\.(jpe?g|png|webp)(?:\/|$)/i) || [,'jpg'])[1].toLowerCase().replace('jpeg', 'jpg');
      const archivo = path.join(dirImagenes, `${id}.${ext}`);
      let bytes = 0;
      if (existsSync(archivo)) {
        bytes = 1; // ya descargada en una corrida anterior
      } else {
        bytes = await descargar(foto.thumb, archivo);
      }
      const { autor, licencia } = await obtenerCreditos(foto.archivo);
      const pagina = fijo ? fijo.pagina : await paginaDelArticulo(foto.titulo);
      creditos[id] = {
        url: `/images/plantas/${id}.${ext}`,
        autor: autor || 'Wikimedia Commons',
        licencia,
        pagina,
      };
      ok++;
      console.log(`[ok] ${id} -> ${id}.${ext} (${(bytes / 1024).toFixed(0)} KB) | ${licencia}`);
    } catch (e) {
      fallos++;
      console.error(`[error] ${id}: ${e.message}`);
    }
  }

  const orden = [...Object.keys(PLANTAS), ...Object.keys(SECCIONES)];
  const ts = `// Archivo generado automáticamente por scripts/obtener-imagenes.mjs
// Fotografías de Wikimedia Commons: cada imagen conserva su licencia y autoría.
// Es la única fuente de verdad de las imágenes: tanto el vademécum como la
// guía de plantas consultan este mapa.

export interface CreditoImagen {
  /** Ruta pública del archivo (dentro de public/) */
  url: string;
  autor: string;
  licencia: string;
  /** Artículo de Wikipedia donde se consultó la imagen */
  pagina: string;
}

export const IMAGENES: Record<string, CreditoImagen> = ${JSON.stringify(
    Object.fromEntries(orden.filter((k) => creditos[k]).map((k) => [k, creditos[k]])),
    null,
    2,
  )};

/** Devuelve la ruta de la imagen o undefined si no está disponible. */
export function urlImagen(id: string): string | undefined {
  return IMAGENES[id]?.url;
}
`;
  await writeFile(path.resolve('src/data/imagenes.ts'), ts, 'utf8');
  console.log(`\nListo: ${ok} imágenes descargadas, ${fallos} fallos. -> src/data/imagenes.ts`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
