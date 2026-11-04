/* Entrada para la verificación de renderizado (smoke test).
   Se compila con: npx vite build --ssr scripts/smoke-entrada.ts --outDir .smoke */
export { default as Vademecum } from '../src/vademecum/Vademecum';
export { default as App } from '../src/App';
export { default as FichaPlanta } from '../src/vademecum/components/FichaPlanta';
export { PLANTAS } from '../src/data/plantas';
