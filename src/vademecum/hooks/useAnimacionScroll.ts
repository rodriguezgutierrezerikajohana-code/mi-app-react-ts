import { useEffect, useState } from 'react';

interface Props {
  /** Elementos observados: cualquier cambio en el listado reinicia la observación. */
  dependencias: unknown;
}

/**
 * Añade la clase .vd-visible a los elementos marcados con .vd-animar
 * cuando entran en el viewport. Se desactiva si el usuario prefiere
 * reducir el movimiento.
 */
export default function useAnimacionScroll({ dependencias }: Props) {
  const [reduceMovimiento, setReduceMovimiento] = useState(false);

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMovimiento(consulta.matches);
    const manejar = () => setReduceMovimiento(consulta.matches);
    consulta.addEventListener('change', manejar);
    return () => consulta.removeEventListener('change', manejar);
  }, []);

  useEffect(() => {
    if (reduceMovimiento) return;
    const elementos = Array.from(document.querySelectorAll<HTMLElement>('.vd-animar:not(.vd-visible)'));
    if (elementos.length === 0) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('vd-visible');
            observador.unobserve(entrada.target);
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.08 },
    );

    elementos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, [dependencias, reduceMovimiento]);

  return reduceMovimiento;
}
