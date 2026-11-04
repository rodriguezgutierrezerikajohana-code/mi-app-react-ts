/* =====================================================================
   Catálogo único de fuentes de información.

   Antes, cada ficha de planta escribía sus fuentes como texto libre
   ('EMA – Monografía de Matricaria flos', 'Kew – Plants of the World
   Online'…) y la sección «Fuentes» mantenía su propia lista. Eso
   obligaba a repetir nombres y.urls y hacía imposible comprobar que
   todo cuadrase.

   Ahora hay un solo catálogo con identificadores estables: cada ficha
   declara qué fuentes ha usado y la aplicación las resuelve aquí.
   ===================================================================== */

export type SourceKey =
  | 'ema'
  | 'who'
  | 'nccih'
  | 'medlineplus'
  | 'kew'
  | 'ipni'
  | 'pubmed'
  | 'cochrane'
  | 'wikimedia';

export interface Fuente {
  /** Identificador estable, usado por las fichas de planta. */
  id: SourceKey;
  nombre: string;
  /** Enlace público de referencia. Algunas fuentes solo se citan por su nombre. */
  url?: string;
  descripcion: string;
}

export const FUENTES: Fuente[] = [
  {
    id: 'ema',
    nombre: 'EMA – European Medicines Agency',
    url: 'https://www.ema.europa.eu/en/human-regulatory/herbal-medicinal-products',
    descripcion:
      'Monografías europeas de productos medicinales vegetales y sus usos tradicionales reconocidos.',
  },
  {
    id: 'who',
    nombre: 'OMS – Medicina tradicional y complementaria',
    url: 'https://www.who.int/health-topics/traditional-complementary-and-integrative-medicine',
    descripcion:
      'Área temática de la Organización Mundial de la Salud sobre medicina tradicional, complementaria e integrativa.',
  },
  {
    id: 'nccih',
    nombre: 'NCCIH – National Center for Complementary and Integrative Health',
    url: 'https://www.nccih.nih.gov/health/herbsataglance',
    descripcion:
      'Fichas divulgativas en inglés sobre plantas y suplementos, con resúmenes de evidencia.',
  },
  {
    id: 'medlineplus',
    nombre: 'MedlinePlus – Herbal Medicine',
    url: 'https://medlineplus.gov/herbalmedicine.html',
    descripcion:
      'Información de salud de la Biblioteca Nacional de Medicina de EE. UU. sobre medicina herbolaria.',
  },
  {
    id: 'ipni',
    nombre: 'IPNI – International Plant Names Index',
    url: 'https://ipni.org/',
    descripcion:
      'Base de datos botánica (Kew, Harvard y Jardín de Melbourne) para verificar nombres científicos de plantas.',
  },
  {
    id: 'kew',
    nombre: 'Kew – Plants of the World Online',
    descripcion:
      'Base de datos botánica del Real Jardín Botánico de Kew para comprobar nombres aceptados y taxonomía. Se cita por su nombre: no se enlaza a una URL concreta.',
  },
  {
    id: 'pubmed',
    nombre: 'PubMed',
    url: 'https://pubmed.ncbi.nlm.nih.gov/',
    descripcion: 'Buscador de literatura científica biomédica para consultar ensayos y revisiones.',
  },
  {
    id: 'cochrane',
    nombre: 'Cochrane',
    url: 'https://www.cochrane.org/',
    descripcion:
      'Revisiones sistemáticas de alta calidad metodológica sobre intervenciones de salud.',
  },
  {
    id: 'wikimedia',
    nombre: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/',
    descripcion: 'Repositorio de las fotografías utilizadas, con autoría y licencia de cada archivo.',
  },
];

/** Acceso directo al catálogo por identificador. */
export const FUENTES_POR_ID: Record<SourceKey, Fuente> = Object.fromEntries(
  FUENTES.map((f) => [f.id, f]),
) as Record<SourceKey, Fuente>;

/** Devuelve la fuente de un identificador, o undefined si no existe. */
export function fuentePorId(id: SourceKey): Fuente | undefined {
  return FUENTES_POR_ID[id];
}
