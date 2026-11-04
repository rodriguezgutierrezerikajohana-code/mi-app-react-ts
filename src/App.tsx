import { useEffect, useMemo, useState } from 'react';
import Clima from './Clima';
import InteligenciasArtificiales from './components/InteligenciasArtificiales';
import { CATEGORIAS, NIVELES_EVIDENCIA, PLANTAS, nivelEvidenciaDe } from './data/plantas';
import type { Planta } from './data/plantas';
import { urlImagen } from './data/imagenes';
import './App.css';

type Vista = 'plantas' | 'clima' | 'ias';

/** Ruta real de cada vista para que el navegador la recuerde y funcione el botón «atrás». */
const RUTAS_VISTA: Record<Vista, string> = { plantas: '/guia', clima: '/clima', ias: '/ias' };

function vistaDesdeRuta(ruta: string): Vista {
  const limpia = ruta.replace(/\/+$/, '').toLowerCase();
  if (limpia.endsWith('/clima')) return 'clima';
  if (limpia.endsWith('/ias')) return 'ias';
  return 'plantas';
}

const SECCIONES: Record<Vista, { icono: string; titulo: string; subtitulo: string }> = {
  plantas: {
    icono: '🌿',
    titulo: 'Plantas Medicinales',
    subtitulo: 'Guía de plantas medicinales: usos tradicionales, evidencia disponible y precauciones',
  },
  clima: {
    icono: '🌤️',
    titulo: 'Clima',
    subtitulo: 'Pronóstico de los próximos 7 días (datos de prueba)',
  },
  ias: {
    icono: '🤖',
    titulo: 'Inteligencias Artificiales',
    subtitulo: 'Directorio de IAs organizadas por categoría',
  },
};

const CATEGORIA_ICONO: Record<string, string> = Object.fromEntries(
  CATEGORIAS.map((c) => [c.nombre, c.icono]),
);

export default function App() {
  const [vista, setVista] = useState<Vista>(() => vistaDesdeRuta(window.location.pathname));
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState<string>('Todas');
  const [plantaAbierta, setPlantaAbierta] = useState<Planta | null>(null);

  const plantasFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    return PLANTAS.filter((p) => {
      const coincideTexto =
        !texto ||
        p.nombre.toLowerCase().includes(texto) ||
        p.cientifico.toLowerCase().includes(texto) ||
        p.familia.toLowerCase().includes(texto) ||
        p.resumen.toLowerCase().includes(texto);
      const coincideCategoria =
        categoria === 'Todas' || p.categorias.some((c) => CATEGORIAS.find((cat) => cat.id === c)?.nombre === categoria);
      return coincideTexto && coincideCategoria;
    });
  }, [busqueda, categoria]);

  // Cerrar el modal con la tecla Escape
  useEffect(() => {
    if (!plantaAbierta) return;
    const manejarTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPlantaAbierta(null);
    };
    document.addEventListener('keydown', manejarTecla);
    return () => document.removeEventListener('keydown', manejarTecla);
  }, [plantaAbierta]);

  // Bloquear el scroll del fondo mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = plantaAbierta ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [plantaAbierta]);

  // Sincronizar la vista con el botón «atrás»/«adelante» del navegador
  useEffect(() => {
    const sincronizar = () => {
      setPlantaAbierta(null);
      setVista(vistaDesdeRuta(window.location.pathname));
    };
    window.addEventListener('popstate', sincronizar);
    return () => window.removeEventListener('popstate', sincronizar);
  }, []);

  const cambiarVista = (nueva: Vista) => {
    setPlantaAbierta(null);
    setVista(nueva);
    window.history.pushState(null, '', RUTAS_VISTA[nueva]);
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoria('Todas');
  };

  const seccion = SECCIONES[vista];
  const imagenAbierta = plantaAbierta ? urlImagen(plantaAbierta.imagen) : undefined;

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <h1 className="logo">
            {seccion.icono} {seccion.titulo}
          </h1>
          <p className="subtitle">{seccion.subtitulo}</p>
          <a className="enlace-vademecum" href="/">
            🌿 Volver al Vademécum Digital de Plantas Medicinales
          </a>
        </div>
      </header>

      <nav className="nav-principal container" aria-label="Secciones">
        {(Object.keys(SECCIONES) as Vista[]).map((id) => (
          <button
            key={id}
            type="button"
            className={vista === id ? 'btn-primario' : 'btn-secundario'}
            aria-current={vista === id ? 'page' : undefined}
            onClick={() => cambiarVista(id)}
          >
            {SECCIONES[id].icono} {SECCIONES[id].titulo}
          </button>
        ))}
      </nav>

      <main className="container">
        {vista === 'plantas' && (
          <>
            <section className="intro">
              <p>
                Cada ficha distingue los <strong>usos tradicionales</strong> de la{' '}
                <strong>evidencia científica disponible</strong>. No se incluyen dosis: esa valoración requiere
                atención profesional individualizada. La información es educativa y no sustituye el consejo médico.
              </p>
              <div className="controls">
                <input
                  type="text"
                  id="buscador"
                  placeholder="Buscar por nombre, especie o familia..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <button id="btn-ver-todos" type="button" onClick={limpiarFiltros}>
                  Ver todas
                </button>
              </div>
              <div className="filtros-categoria" role="group" aria-label="Filtrar por categoría">
                <button
                  type="button"
                  className={categoria === 'Todas' ? 'chip-categoria activo' : 'chip-categoria'}
                  aria-pressed={categoria === 'Todas'}
                  onClick={() => setCategoria('Todas')}
                >
                  Todas
                </button>
                {CATEGORIAS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={categoria === c.nombre ? 'chip-categoria activo' : 'chip-categoria'}
                    aria-pressed={categoria === c.nombre}
                    title={c.descripcion}
                    onClick={() => setCategoria(c.nombre)}
                  >
                    <span aria-hidden="true">{c.icono}</span> {c.nombre}
                  </button>
                ))}
              </div>
              <p className="resultado-conteo">
                Mostrando {plantasFiltradas.length} de {PLANTAS.length} plantas
              </p>
            </section>

            <section className="galeria">
              {plantasFiltradas.length === 0 ? (
                <div className="sin-resultados" role="status">
                  <h3>No se encontraron plantas con ese criterio</h3>
                  <p>Prueba con otro nombre o quita el filtro de categoría.</p>
                  <button className="btn-primario" type="button" onClick={limpiarFiltros}>
                    Ver todas las plantas
                  </button>
                </div>
              ) : (
                plantasFiltradas.map((planta) => {
                  const imagen = urlImagen(planta.imagen);
                  return (
                    <article className="tarjeta" key={planta.id}>
                      <div className="tarjeta-imagen">
                        {imagen ? (
                          <img src={imagen} alt={`Fotografía de ${planta.nombre}`} loading="lazy" />
                        ) : (
                          <div className="tarjeta-sin-imagen" role="img" aria-label={`Sin imagen de ${planta.nombre}`}>
                            🌿
                          </div>
                        )}
                        <span className="tarjeta-categoria">
                          {planta.categorias.map((c) => {
                            const nombre = CATEGORIAS.find((cat) => cat.id === c)?.nombre ?? c;
                            return (
                              <span key={c}>
                                {CATEGORIA_ICONO[nombre]} {nombre}
                              </span>
                            );
                          })}
                        </span>
                      </div>
                      <div className="tarjeta-info">
                        <h3>{planta.nombre}</h3>
                        {planta.nombreLocal && <p className="nombre-local">{planta.nombreLocal}</p>}
                        <p className="cientifico">{planta.cientifico}</p>
                        <p className="familia">{planta.familia}</p>
                        <p>{planta.resumen}</p>
                        <span className={`badge-evidencia nivel-${nivelEvidenciaDe(planta)}`}>
                          {NIVELES_EVIDENCIA[nivelEvidenciaDe(planta)].etiqueta}
                        </span>
                        <button
                          className="btn-ver btn-primario"
                          type="button"
                          onClick={() => setPlantaAbierta(planta)}
                        >
                          Ver detalles
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </section>

            {plantaAbierta && (
              <div className="modal-fondo" onClick={() => setPlantaAbierta(null)}>
                <div
                  className="modal activo"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="titulo-planta"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="cerrar"
                    type="button"
                    aria-label="Cerrar detalle"
                    onClick={() => setPlantaAbierta(null)}
                  >
                    &times;
                  </button>
                  <div className="modal-contenido">
                    <div className="modal-imagen">
                      {imagenAbierta ? (
                        <img src={imagenAbierta} alt={`Fotografía de ${plantaAbierta.nombre}`} />
                      ) : (
                        <span aria-hidden="true">🌿</span>
                      )}
                    </div>
                    <div className="modal-info">
                      <h2 id="titulo-planta">{plantaAbierta.nombre}</h2>
                      {plantaAbierta.nombreLocal && <p className="nombre-local">{plantaAbierta.nombreLocal}</p>}
                      <p className="modal-cientifico">{plantaAbierta.cientifico}</p>
                      <p className="modal-familia">
                        Familia: {plantaAbierta.familia} · Categorías:{' '}
                        {plantaAbierta.categorias
                          .map((c) => CATEGORIAS.find((cat) => cat.id === c)?.nombre ?? c)
                          .join(', ')}
                      </p>

                      <h3>Identificación</h3>
                      <p className="modal-descripcion">{plantaAbierta.descripcion}</p>

                      <h3>Distribución y hábitat</h3>
                      <p className="modal-descripcion">{plantaAbierta.distribucion}</p>

                      <h3>Parte utilizada</h3>
                      <p className="modal-descripcion">{plantaAbierta.parteUsada}</p>

                      <h3>Usos tradicionales documentados</h3>
                      <ul className="modal-usos">
                        {plantaAbierta.usosTradicionales.map((uso) => (
                          <li key={uso}>{uso}</li>
                        ))}
                      </ul>

                      <h3>Evidencia científica disponible</h3>
                      <p className={`badge-evidencia nivel-${nivelEvidenciaDe(plantaAbierta)}`}>
                        {NIVELES_EVIDENCIA[nivelEvidenciaDe(plantaAbierta)].etiqueta}
                      </p>
                      <p className="nivel-detalle">
                        {NIVELES_EVIDENCIA[nivelEvidenciaDe(plantaAbierta)].detalle}
                      </p>
                      <ul className="modal-usos">
                        {plantaAbierta.evidencia.map((e) => (
                          <li key={e.nivel + e.texto}>
                            <strong>{NIVELES_EVIDENCIA[e.nivel].etiqueta}:</strong> {e.texto}
                          </li>
                        ))}
                      </ul>

                      <h3>Formas tradicionales de preparación</h3>
                      <ul className="modal-usos">
                        {plantaAbierta.preparaciones.map((prep) => (
                          <li key={prep}>{prep}</li>
                        ))}
                      </ul>

                      <h3>Precauciones y contraindicaciones</h3>
                      <div className="modal-alerta">
                        <strong>⚠️ Atención:</strong>
                        <ul className="modal-usos">
                          {plantaAbierta.precauciones.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </div>

                      <h3>Conservación</h3>
                      <p className="modal-descripcion">{plantaAbierta.conservacion}</p>

                      <h3>Cultivo</h3>
                      <dl className="modal-cultivo">
                        <div>
                          <dt>Luz</dt>
                          <dd>{plantaAbierta.cultivo.luz}</dd>
                        </div>
                        <div>
                          <dt>Suelo</dt>
                          <dd>{plantaAbierta.cultivo.suelo}</dd>
                        </div>
                        <div>
                          <dt>Riego</dt>
                          <dd>{plantaAbierta.cultivo.riego}</dd>
                        </div>
                        <div>
                          <dt>Propagación</dt>
                          <dd>{plantaAbierta.cultivo.propagacion}</dd>
                        </div>
                      </dl>

                      <h3>¿Sabías que…?</h3>
                      <p className="modal-descripcion">{plantaAbierta.sabiasQue}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {vista === 'clima' && <Clima />}

        {vista === 'ias' && <InteligenciasArtificiales />}
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>
            &copy; 2026 Guía de Plantas Medicinales. Fines informativos y educativos. No sustituye el consejo médico
            profesional. Natural no significa necesariamente seguro.
          </p>
        </div>
      </footer>
    </>
  );
}
