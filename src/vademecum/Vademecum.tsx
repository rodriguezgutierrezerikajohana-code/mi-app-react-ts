import { useEffect, useState } from 'react';
import './Vademecum.css';
import { CATEGORIAS, PLANTAS, nombreCategoria } from '../data/plantas';
import type { Planta } from '../data/plantas';
import {
  AVISO_LEGAL,
  CURIOSIDADES,
  GLOSARIO,
  JARDIN,
  PREGUNTAS_FRECUENTES,
  PREPARACIONES,
} from '../data/contenido';
import { FUENTES } from '../data/fuentes';
import { IMAGENES } from '../data/imagenes';
import FichaPlanta from './components/FichaPlanta';
import useAnimacionScroll from './hooks/useAnimacionScroll';

type EstadoSugerencia = 'inicial' | 'enviado' | 'error';

interface EnlaceNavegacion {
  id: string;
  etiqueta: string;
  /** Si existe, el enlace lleva a otra vista de la aplicación en vez de a una sección. */
  ruta?: string;
}

const NAVEGACION: EnlaceNavegacion[] = [
  { id: 'inicio', etiqueta: 'Inicio' },
  { id: 'calendario-lunar', etiqueta: 'Calendario Lunar' },
  { id: 'climas-recomendables', etiqueta: 'Climas Recomendables' },
  { id: 'semaforo', etiqueta: 'Semáforo de Precaución' },
  { id: 'catalogo', etiqueta: 'Catálogo' },
  { id: 'saberes', etiqueta: 'Saberes' },
  { id: 'preparaciones', etiqueta: 'Preparaciones' },
  { id: 'jardin', etiqueta: 'Jardín' },
  { id: 'glosario', etiqueta: 'Glosario' },
  { id: 'preguntas', etiqueta: 'Preguntas' },
  { id: 'fuentes', etiqueta: 'Fuentes' },
  { id: 'contacto', etiqueta: 'Contacto' },
  { id: 'clima', etiqueta: 'Clima', ruta: '/clima' },
  { id: 'ias', etiqueta: 'IA', ruta: '/ias' },
];

const CALENDARIO_LUNAR = [
  { fase: 'Luna Nueva', fecha: '01/11/2026', actividad: 'Ideal para sembrar raíces y bulbos. Momento de renovación.' },
  { fase: 'Cuarto Creciente', fecha: '08/11/2026', actividad: 'Óptimo para sembrar hojas y tallos. Crecimiento vigoroso.' },
  { fase: 'Luna Llena', fecha: '15/11/2026', actividad: 'Ideal para cosechar plantas medicinales. Máxima concentración de principios activos.' },
  { fase: 'Cuarto Menguante', fecha: '22/11/2026', actividad: 'Recomendado para podar, trasplantar y combatir plagas.' },
];

const CLIMAS_RECOMENDABLES = [
  { clima: 'Tropical', plantas: ['Jengibre', 'Cúrcuma', 'Ajo'], descripcion: 'Cálido y húmedo, ideal para plantas aromáticas tropicales.' },
  { clima: 'Mediterráneo', plantas: ['Lavanda', 'Romero', 'Tomillo', 'Salvia'], descripcion: 'Veranos secos e inviernos suaves, perfecto para hierbas aromáticas.' },
  { clima: 'Templado', plantas: ['Manzanilla', 'Menta piperita', 'Hierbabuena', 'Caléndula'], descripcion: 'Estaciones bien definidas, óptimo para la mayoría de plantas medicinales.' },
  { clima: 'Subtropical', plantas: ['Sábila', 'Eucalipto', 'Limoncillo'], descripcion: 'Sin heladas fuertes, ideal para plantas suculentas y aromáticas.' },
];

function obtenerPlantasMayorPrecaucion(): Planta[] {
  return PLANTAS.filter((p) => 
    p.precauciones.length >= 4 || 
    p.id === 'sabila' || 
    p.id === 'eucalipto' || 
    p.id === 'menta-piperita' || 
    p.id === 'ajo'
  ).slice(0, 6);
}

/** Planta destacada: se elige de forma estable según la semana del año. */
function plantaDeLaSemana(lista: Planta[]): Planta {
  const semanas = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
  return lista[semanas % lista.length];
}

function curiosidadDelDia() {
  const dias = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return CURIOSIDADES[dias % CURIOSIDADES.length];
}

export default function Vademecum() {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState<string>('todas');
  const [soloEvidencia, setSoloEvidencia] = useState(false);
  const [plantaAbierta, setPlantaAbierta] = useState<Planta | null>(null);
  const [mostrarArriba, setMostrarArriba] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [preguntaAbierta, setPreguntaAbierta] = useState<number | null>(0);
  const [sugerencia, setSugerencia] = useState('');
  const [correo, setCorreo] = useState('');
  const [estadoSugerencia, setEstadoSugerencia] = useState<EstadoSugerencia>('inicial');
  const [mensajeError, setMensajeError] = useState('');
  const [enlacesCopiados, setEnlacesCopiados] = useState(false);
  const [mostrarBienvenida, setMostrarBienvenida] = useState(() => {
    return localStorage.getItem('vademecum-bienvenida-mostrada') !== 'true';
  });

  const destacada = plantaDeLaSemana(PLANTAS);
  const curiosidad = curiosidadDelDia();
  const plantasPrecaucion = obtenerPlantasMayorPrecaucion();
  const fechaActualizacion = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  useAnimacionScroll({ dependencias: `${busqueda}-${categoria}-${soloEvidencia}` });

  useEffect(() => {
    document.title = 'Vademécum Digital de Plantas Medicinales';
    if (mostrarBienvenida) {
      localStorage.setItem('vademecum-bienvenida-mostrada', 'true');
    }
  }, []);

  const cerrarBienvenida = () => {
    setMostrarBienvenida(false);
    localStorage.setItem('vademecum-bienvenida-mostrada', 'true');
  };

  useEffect(() => {
    const alDesplazar = () => setMostrarArriba(window.scrollY > 600);
    window.addEventListener('scroll', alDesplazar, { passive: true });
    alDesplazar();
    return () => window.removeEventListener('scroll', alDesplazar);
  }, []);

  const plantasFiltradas = PLANTAS.filter((p) => {
    const texto = busqueda.toLowerCase().trim();
    const coincideTexto =
      !texto ||
      p.nombre.toLowerCase().includes(texto) ||
      p.cientifico.toLowerCase().includes(texto) ||
      p.familia.toLowerCase().includes(texto) ||
      p.resumen.toLowerCase().includes(texto);
    const coincideCategoria = categoria === 'todas' || p.categorias.includes(categoria);
    const coincideEvidencia =
      !soloEvidencia || p.evidencia.some((e) => e.nivel === 'moderada');
    return coincideTexto && coincideCategoria && coincideEvidencia;
  });

  const irASeccion = (id: string) => {
    setMenuAbierto(false);
    const destino = document.getElementById(id);
    if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoria('todas');
    setSoloEvidencia(false);
  };

  const enviarSugerencia = (e: React.FormEvent) => {
    e.preventDefault();
    if (sugerencia.trim().length < 10) {
      setEstadoSugerencia('error');
      setMensajeError('Escribe al menos 10 caracteres para que la sugerencia sea útil.');
      return;
    }
    try {
      const guardadas = JSON.parse(localStorage.getItem('vademecum-sugerencias') ?? '[]');
      guardadas.push({ texto: sugerencia.trim(), correo: correo.trim(), fecha: new Date().toISOString() });
      localStorage.setItem('vademecum-sugerencias', JSON.stringify(guardadas));
      setEstadoSugerencia('enviado');
      setMensajeError('');
      setSugerencia('');
      setCorreo('');
    } catch {
      setEstadoSugerencia('error');
      setMensajeError('No se pudo guardar la sugerencia en este navegador.');
    }
  };

  const copiarFuentes = async () => {
    const texto = FUENTES.map((f) => (f.url ? `${f.nombre} — ${f.url}` : f.nombre)).join('\n');
    try {
      await navigator.clipboard.writeText(texto);
      setEnlacesCopiados(true);
      setTimeout(() => setEnlacesCopiados(false), 2500);
    } catch {
      setEnlacesCopiados(false);
    }
  };

  return (
    <div className="vd-app">
      {mostrarBienvenida && (
        <div className="vd-bienvenida-fondo" onClick={cerrarBienvenida}>
          <div className="vd-bienvenida-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button className="vd-bienvenida-cerrar" type="button" aria-label="Cerrar" onClick={cerrarBienvenida}>
              ×
            </button>
            <div className="vd-bienvenida-contenido">
              <span className="vd-bienvenida-icono">🌿</span>
              <h2>¡Bienvenido al mundo de las plantas medicinales!</h2>
              <p>
                Descubre la riqueza de la naturaleza, explora los saberes tradicionales y conoce la información científica que nos ayuda a comprender mejor las plantas que nos rodean.
              </p>
              <p className="vd-bienvenida-destacado">
                La naturaleza nos inspira, el conocimiento nos orienta.
              </p>
              <button className="vd-boton vd-boton-primario" type="button" onClick={cerrarBienvenida}>
                Comenzar a explorar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <header className="vd-nav">
        <div className="vd-nav-interno">
          <a
            className="vd-marca"
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              irASeccion('inicio');
            }}
          >
            <span className="vd-marca-icono">🌿</span>
            <span>
              <strong>Vademécum</strong>
              <em>de plantas medicinales</em>
            </span>
          </a>

          <button
            className="vd-menu-boton"
            type="button"
            aria-expanded={menuAbierto}
            aria-label="Abrir menú de secciones"
            onClick={() => setMenuAbierto((v) => !v)}
          >
            ☰
          </button>

          <nav className={menuAbierto ? 'vd-nav-enlaces abierto' : 'vd-nav-enlaces'} aria-label="Secciones del vademécum">
            {NAVEGACION.map((enlace) => (
              <a
                key={enlace.id}
                href={enlace.ruta ?? `#${enlace.id}`}
                onClick={(e) => {
                  if (enlace.ruta) return; // navegación real a otra vista
                  e.preventDefault();
                  irASeccion(enlace.id);
                }}
              >
                {enlace.etiqueta}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {/* Portada */}
        <section id="inicio" className="vd-hero">
          <img className="vd-hero-imagen" src={IMAGENES.hero.url} alt="" aria-hidden="true" />
          <div className="vd-hero-capa" />
          <div className="vd-hero-contenido">
            <span className="vd-hero-etiqueta">Guía botánica digital y divulgativa</span>
            <h1 className="vd-hero-titulo-principal">VADEMÉCUM DIGITAL DE PLANTAS MEDICINALES</h1>
            <p className="vd-hero-lema">«La sabiduría de la naturaleza, el conocimiento que florece»</p>
            <p className="vd-hero-texto">
              Las plantas medicinales acompañan a la humanidad desde antes de la escritura: son alimento, remedio,
              símbolo y memoria. Preservar ese conocimiento exige cuidarlo con rigor, distinguir la tradición de la
              evidencia y proteger las especies y los saberes que las sostienen. Este vademécum reúne {PLANTAS.length}{' '}
              plantas de uso frecuente con información clara sobre sus usos tradicionales, la evidencia disponible y sus
              precauciones.
            </p>
            <div className="vd-hero-acciones">
              <button className="vd-boton vd-boton-primario" type="button" onClick={() => irASeccion('catalogo')}>
                🌿 EXPLORAR PLANTAS
              </button>
              <button className="vd-boton vd-boton-borde" type="button" onClick={() => irASeccion('saberes')}>
                📚 DESCUBRIR SABERES ANCESTRALES
              </button>
              <button className="vd-boton vd-boton-borde" type="button" onClick={() => irASeccion('calendario-lunar')}>
                🌙 CALENDARIO LUNAR
              </button>
              <button className="vd-boton vd-boton-borde" type="button" onClick={() => irASeccion('semaforo')}>
                ⚠️ PRECAUCIONES
              </button>
            </div>
            <dl className="vd-hero-datos">
              <div>
                <dt>{PLANTAS.length}</dt>
                <dd>fichas documentadas</dd>
              </div>
              <div>
                <dt>{CATEGORIAS.length}</dt>
                <dd>categorías de uso</dd>
              </div>
              <div>
                <dt>3</dt>
                <dd>niveles de evidencia</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Aviso sanitario */}
        <section className="vd-aviso">
          <div className="vd-contenedor vd-aviso-interno">
            <span className="vd-aviso-icono" aria-hidden="true">
              ⚕️
            </span>
            <p>
              <strong>Aviso sanitario:</strong> {AVISO_LEGAL}
            </p>
          </div>
        </section>

        {/* Calendario Lunar según los saberes ancestrales */}
        <section id="calendario-lunar" className="vd-seccion vd-seccion-crema">
          <div className="vd-contenedor">
            <header className="vd-seccion-cabecera vd-animar">
              <span className="vd-kicker">Saberes ancestrales</span>
              <h2>Calendario Lunar según los saberes ancestrales</h2>
              <p>
                Las tradiciones agrícolas y botánicas han utilizado las fases lunares para determinar los mejores momentos
                para sembrar, cultivar, podar y cosechar plantas medicinales.
              </p>
            </header>

            <div className="vd-calendario-lunar">
              {CALENDARIO_LUNAR.map((item, index) => (
                <article key={index} className="vd-luna-card vd-animar">
                  <div className="vd-luna-fase">
                    <span className="vd-luna-icono">
                      {item.fase.includes('Nueva') && '🌑'}
                      {item.fase.includes('Creciente') && '🌓'}
                      {item.fase.includes('Llena') && '🌕'}
                      {item.fase.includes('Menguante') && '🌗'}
                    </span>
                    <h3>{item.fase}</h3>
                    <span className="vd-luna-fecha">{item.fecha}</span>
                  </div>
                  <p className="vd-luna-actividad">{item.actividad}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Climas más recomendables para plantarlas */}
        <section id="climas-recomendables" className="vd-seccion">
          <div className="vd-contenedor">
            <header className="vd-seccion-cabecera vd-animar">
              <span className="vd-kicker">Cultivo óptimo</span>
              <h2>Climas más recomendables para plantarlas</h2>
              <p>
                Conoce qué plantas medicinales se adaptan mejor a cada tipo de clima para obtener mejores resultados
                en tu huerto o jardín.
              </p>
            </header>

            <div className="vd-climas-grid">
              {CLIMAS_RECOMENDABLES.map((clima, index) => (
                <article key={index} className="vd-clima-card vd-animar">
                  <div className="vd-clima-header">
                    <span className="vd-clima-icono">
                      {clima.clima === 'Tropical' && '🌴'}
                      {clima.clima === 'Mediterráneo' && '🏛️'}
                      {clima.clima === 'Templado' && '🍂'}
                      {clima.clima === 'Subtropical' && '☀️'}
                    </span>
                    <h3>{clima.clima}</h3>
                  </div>
                  <p className="vd-clima-descripcion">{clima.descripcion}</p>
                  <div className="vd-clima-plantas">
                    <strong>Plantas recomendadas:</strong>
                    <div className="vd-clima-plantas-lista">
                      {clima.plantas.map((planta, i) => (
                        <span key={i} className="vd-clima-planta-tag">🌿 {planta}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Semáforo de advertencia */}
        <section id="semaforo" className="vd-seccion vd-seccion-crema">
          <div className="vd-contenedor">
            <header className="vd-seccion-cabecera vd-animar">
              <span className="vd-kicker">Precaución</span>
              <h2>Semáforo de advertencia - Mayor precaución</h2>
              <p>
                Estas plantas requieren mayor cuidado, supervisión profesional o tienen contraindicaciones importantes.
                Úsalas con extrema prudencia.
              </p>
            </header>

            <div className="vd-semaforo">
              <div className="vd-semaforo-luces vd-animar">
                <div className="vd-luz-roja">
                  <span className="vd-luz-icono">🔴</span>
                  <span className="vd-luz-texto">ALTA PRECAUCIÓN</span>
                </div>
              </div>
              <div className="vd-semaforo-plantas">
                {plantasPrecaucion.map((planta) => (
                  <article key={planta.id} className="vd-semaforo-planta vd-animar">
                    <div className="vd-semaforo-planta-info">
                      <h3>{planta.nombre}</h3>
                      <p className="vd-cientifico">{planta.cientifico}</p>
                      <p className="vd-semaforo-alerta">⚠️ {planta.precauciones.length} precauciones documentadas</p>
                    </div>
                    <button 
                      className="vd-boton vd-boton-primario" 
                      type="button" 
                      onClick={() => setPlantaAbierta(planta)}
                    >
                      Ver precauciones
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Planta destacada + curiosidad */}
        <section className="vd-contenedor vd-destacados">
          <article className="vd-destacada vd-animar">
            <div className="vd-destacada-foto">
              <img src={IMAGENES[destacada.imagen].url} alt={`Fotografía de ${destacada.nombre}`} loading="lazy" />
              <span className="vd-destacada-sello">Planta destacada de la semana</span>
            </div>
            <div className="vd-destacada-info">
              <h2>{destacada.nombre}</h2>
              <p className="vd-cientifico">{destacada.cientifico}</p>
              <p>{destacada.resumen}</p>
              <button className="vd-boton vd-boton-primario" type="button" onClick={() => setPlantaAbierta(destacada)}>
                Ver ficha completa
              </button>
            </div>
          </article>

          <aside className="vd-curiosidad vd-animar">
            <span className="vd-curiosidad-sello">¿Sabías que…?</span>
            <p>{curiosidad.texto}</p>
            <span className="vd-curiosidad-fuente">Fuente: {curiosidad.fuente}</span>
          </aside>
        </section>

        {/* Catálogo */}
        <section id="catalogo" className="vd-seccion">
          <div className="vd-contenedor">
            <header className="vd-seccion-cabecera vd-animar">
              <span className="vd-kicker">Catálogo interactivo</span>
              <h2>Las {PLANTAS.length} plantas del vademécum</h2>
              <p>
                Busca por nombre común, nombre científico o familia, filtra por categoría de uso y abre la ficha
                completa de cada planta. Cada ficha diferencia los usos tradicionales de la evidencia científica.
              </p>
            </header>

            <div className="vd-filtros vd-animar">
              <label className="vd-buscador">
                <span className="vd-visually-hidden">Buscar planta</span>
                <input
                  type="search"
                  placeholder="Buscar por nombre o familia…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </label>
              <div className="vd-chips" role="group" aria-label="Filtrar por categoría">
                <button
                  type="button"
                  className={categoria === 'todas' ? 'vd-chip activo' : 'vd-chip'}
                  aria-pressed={categoria === 'todas'}
                  onClick={() => setCategoria('todas')}
                >
                  Todas
                </button>
                {CATEGORIAS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={categoria === c.id ? 'vd-chip activo' : 'vd-chip'}
                    aria-pressed={categoria === c.id}
                    onClick={() => setCategoria(c.id)}
                    title={c.descripcion}
                  >
                    <span aria-hidden="true">{c.icono}</span> {c.nombre}
                  </button>
                ))}
              </div>
              <div className="vd-filtros-pie">
                <label className="vd-interruptor">
                  <input
                    type="checkbox"
                    checked={soloEvidencia}
                    onChange={(e) => setSoloEvidencia(e.target.checked)}
                  />
                  <span>Solo plantas con evidencia moderada</span>
                </label>
                <span className="vd-resultado">
                  {plantasFiltradas.length} de {PLANTAS.length} plantas
                </span>
                <button className="vd-boton-texto" type="button" onClick={limpiarFiltros}>
                  Limpiar filtros
                </button>
              </div>
            </div>

            {plantasFiltradas.length === 0 ? (
              <div className="vd-sin-resultados vd-animar" role="status">
                <span aria-hidden="true">🌱</span>
                <h3>No encontramos plantas con ese criterio</h3>
                <p>
                  Prueba con otro nombre, revisa la ortografía o quita algunos filtros. También puedes consultar las{' '}
                  {PLANTAS.length} plantas completas.
                </p>
                <button className="vd-boton vd-boton-primario" type="button" onClick={limpiarFiltros}>
                  Ver todas las plantas
                </button>
              </div>
            ) : (
              <ul className="vd-galeria">
                {plantasFiltradas.map((planta) => {
                  const imagen = IMAGENES[planta.imagen];
                  return (
                    <li key={planta.id} className="vd-tarjeta vd-animar">
                      <button
                        className="vd-tarjeta-foto"
                        type="button"
                        onClick={() => setPlantaAbierta(planta)}
                        aria-label={`Abrir ficha de ${planta.nombre}`}
                      >
                        <img src={imagen.url} alt={`Fotografía de ${planta.nombre}`} loading="lazy" />
                        <span className="vd-tarjeta-categorias">
                          {planta.categorias.slice(0, 2).map((c) => (
                            <span key={c} className="vd-chip-mini">
                              {nombreCategoria(c)}
                            </span>
                          ))}
                        </span>
                      </button>
                      <div className="vd-tarjeta-texto">
                        <h3>{planta.nombre}</h3>
                        <p className="vd-cientifico">{planta.cientifico}</p>
                        <p className="vd-resumen">{planta.resumen}</p>
                        <button className="vd-boton vd-boton-suave" type="button" onClick={() => setPlantaAbierta(planta)}>
                          Consultar ficha completa
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {/* Saberes ancestrales */}
        <section id="saberes" className="vd-seccion vd-seccion-crema">
          <div className="vd-contenedor">
            <header className="vd-seccion-cabecera vd-animar">
              <span className="vd-kicker">Memoria viva</span>
              <h2>Saberes ancestrales</h2>
              <p>
                Los conocimientos sobre plantas se transmiten de generación en generación, en huertas, mercados y
                cocinas. Esta sección está preparada para documentarlos, siempre con reconocimiento y consentimiento
                de las personas y comunidades que los comparten.
              </p>
            </header>

            <div className="vd-saberes">
              <figure className="vd-saberes-foto vd-animar">
                <img src={IMAGENES.saberes.url} alt="Plantas medicinales secas dispuestas para su venta" loading="lazy" />
                <figcaption>
                  Plantas medicinales puestas a la venta en un mercado tradicional. Foto: {IMAGENES.saberes.autor} ·{' '}
                  {IMAGENES.saberes.licencia} ·{' '}
                  <a href={IMAGENES.saberes.pagina} target="_blank" rel="noreferrer noopener">
                    Wikipedia
                  </a>
                </figcaption>
              </figure>

              <div className="vd-saberes-texto vd-animar">
                <h3>Cómo se incorporarán los testimonios</h3>
                <p>
                  Para que esta sección sea confiable y respetuosa, cada aporte debe cumplir tres condiciones: contar
                  con autorización expresa de la persona o comunidad, registrar el territorio y el contexto del saber,
                  y acompañarse de la forma de uso tal como fue compartida.
                </p>
                <ul className="vd-lista">
                  <li>Ficha de la persona o colectivo que comparte el saber, con su consentimiento.</li>
                  <li>Nombre local y nombre en lengua propia, cuando la comunidad autorice su publicación.</li>
                  <li>Territorio, ecosistema y época de recolección asociados a la práctica.</li>
                  <li>Fotografías propias o con licencia, nunca imágenes tomadas sin permiso.</li>
                </ul>
                <aside className="vd-nota">
                  <strong>Integridad:</strong> esta sección no contiene testimonios inventados ni atribuye
                  conocimientos a comunidades específicas. Su contenido se publicará únicamente cuando exista
                  información verificada y autorizada.
                </aside>
                <button className="vd-boton vd-boton-primario" type="button" onClick={() => irASeccion('contacto')}>
                  Compartir un saber
                </button>
              </div>
            </div>

            <div className="vd-tarjetas-tres">
              {[
                {
                  icono: '🧺',
                  titulo: 'Prácticas de recolección',
                  texto:
                    'Recolectar con criterio, respetar ciclos de floración y no agotar poblaciones silvestres son principios comunes a muchas tradiciones.',
                },
                {
                  icono: '🏡',
                  titulo: 'Cultivo en casa',
                  texto:
                    'Huertos familiares y patios han funcionado históricamente como farmacias vivas y como espacios de aprendizaje intergeneracional.',
                },
                {
                  icono: '🤝',
                  titulo: 'Reconocimiento',
                  texto:
                    'Nombrar a quienes comparten su conocimiento, y devolver a la comunidad los resultados, es parte del compromiso de esta sección.',
                },
              ].map((t) => (
                <article key={t.titulo} className="vd-tarjeta-info vd-animar">
                  <span aria-hidden="true">{t.icono}</span>
                  <h3>{t.titulo}</h3>
                  <p>{t.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Preparaciones */}
        <section id="preparaciones" className="vd-seccion">
          <div className="vd-contenedor">
            <header className="vd-seccion-cabecera vd-animar">
              <span className="vd-kicker">Aprende a preparar</span>
              <h2>Preparaciones tradicionales</h2>
              <p>
                La forma de preparación cambia qué compuestos se extraen y cuánto se concentran. Estas pautas son
                generales y educativas: no sustituyen las indicaciones de un profesional ni incluyen dosis
                terapéuticas.
              </p>
            </header>

            <div className="vd-tarjetas-tres">
              {PREPARACIONES.map((p) => (
                <article key={p.id} className="vd-tarjeta-info vd-animar">
                  <span className="vd-tarjeta-info-icono" aria-hidden="true">
                    {p.icono}
                  </span>
                  <h3>{p.titulo}</h3>
                  <p>{p.resumen}</p>
                  <ol className="vd-pasos">
                    {p.pasos.map((paso) => (
                      <li key={paso}>{paso}</li>
                    ))}
                  </ol>
                  <aside className="vd-nota vd-nota-aviso">
                    <strong>Ojo:</strong> {p.advertencia}
                  </aside>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Jardín */}
        <section id="jardin" className="vd-seccion vd-seccion-verde">
          <div className="vd-contenedor">
            <header className="vd-seccion-cabecera vd-animar">
              <span className="vd-kicker">Cultivo y conservación</span>
              <h2>Jardín medicinal</h2>
              <p>
                Cultivar tus propias plantas permite conocerlas mejor y reduce la presión sobre poblaciones
                silvestres. Estas recomendaciones sirven para huertos, patios y macetas.
              </p>
            </header>

            <div className="vd-jardin">
              <div className="vd-jardin-grid">
                {JARDIN.map((j) => (
                  <article key={j.id} className="vd-tarjeta-info vd-animar">
                    <span className="vd-tarjeta-info-icono" aria-hidden="true">
                      {j.icono}
                    </span>
                    <h3>{j.titulo}</h3>
                    <p>{j.texto}</p>
                    <ul className="vd-lista vd-lista-compacta">
                      {j.puntos.map((punto) => (
                        <li key={punto}>{punto}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
              <figure className="vd-jardin-foto vd-animar">
                <img src={IMAGENES.jardin.url} alt="Huerto de plantas medicinales con distintas especies" loading="lazy" />
                <figcaption>
                  Huerto botánico con caléndula y manzanilla. Foto: {IMAGENES.jardin.autor} · {IMAGENES.jardin.licencia} ·{' '}
                  <a href={IMAGENES.jardin.pagina} target="_blank" rel="noreferrer noopener">
                    Wikipedia
                  </a>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* Galería */}
        <section className="vd-seccion">
          <div className="vd-contenedor">
            <header className="vd-seccion-cabecera vd-animar">
              <span className="vd-kicker">Galería</span>
              <h2>Las plantas en imágenes</h2>
              <p>Fotografías de Wikimedia Commons con su autoría y licencia. Pulsa sobre cualquier imagen para abrir su ficha.</p>
            </header>
            <ul className="vd-galeria-fotos">
              {PLANTAS.map((p) => (
                <li key={p.id} className="vd-animar">
                  <button
                    type="button"
                    className="vd-foto"
                    onClick={() => setPlantaAbierta(p)}
                    aria-label={`Abrir ficha de ${p.nombre}`}
                    title={`${p.nombre} — ${p.cientifico}`}
                  >
                    <img src={IMAGENES[p.imagen].url} alt={`Fotografía de ${p.nombre}`} loading="lazy" />
                    <span className="vd-foto-pie">{p.nombre}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Glosario */}
        <section id="glosario" className="vd-seccion vd-seccion-crema">
          <div className="vd-contenedor">
            <header className="vd-seccion-cabecera vd-animar">
              <span className="vd-kicker">Vocabulario</span>
              <h2>Glosario botánico y sanitario</h2>
              <p>Términos que aparecen en las fichas, explicados de forma sencilla.</p>
            </header>

            <dl className="vd-glosario">
              {GLOSARIO.map((g) => (
                <div key={g.termino} className="vd-glosario-item vd-animar">
                  <dt>{g.termino}</dt>
                  <dd>{g.definicion}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <section id="preguntas" className="vd-seccion">
          <div className="vd-contenedor vd-contenedor-angosto">
            <header className="vd-seccion-cabecera vd-animar">
              <span className="vd-kicker">Dudas habituales</span>
              <h2>Preguntas frecuentes</h2>
            </header>

            <div className="vd-acordeon">
              {PREGUNTAS_FRECUENTES.map((f, i) => {
                const abierta = preguntaAbierta === i;
                return (
                  <article key={f.pregunta} className="vd-acordeon-item vd-animar">
                    <h3>
                      <button
                        type="button"
                        aria-expanded={abierta}
                        onClick={() => setPreguntaAbierta(abierta ? null : i)}
                      >
                        <span>{f.pregunta}</span>
                        <span className="vd-acordeon-signo" aria-hidden="true">
                          {abierta ? '−' : '+'}
                        </span>
                      </button>
                    </h3>
                    {abierta && <p className="vd-acordeon-respuesta">{f.respuesta}</p>}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Fuentes */}
        <section id="fuentes" className="vd-seccion vd-seccion-verde">
          <div className="vd-contenedor">
            <header className="vd-seccion-cabecera vd-animar">
              <span className="vd-kicker">Referencias</span>
              <h2>Fuentes científicas y de información</h2>
              <p>
                Recursos institucionales utilizados para orientar y verificar el contenido. Cada ficha indica además
                sus fuentes específicas.
              </p>
            </header>

            <ul className="vd-fuentes">
              {FUENTES.map((f) => (
                <li key={f.id} className="vd-animar">
                  {f.url ? (
                    <a href={f.url} target="_blank" rel="noreferrer noopener">
                      {f.nombre}
                    </a>
                  ) : (
                    <span className="vd-fuente-sin-enlace">{f.nombre}</span>
                  )}
                  <p>{f.descripcion}</p>
                </li>
              ))}
            </ul>

            <button className="vd-boton vd-boton-suave vd-animar" type="button" onClick={copiarFuentes}>
              {enlacesCopiados ? '✓ Enlaces copiados' : 'Copiar todos los enlaces'}
            </button>
          </div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="vd-seccion">
          <div className="vd-contenedor vd-contenedor-angosto">
            <header className="vd-seccion-cabecera vd-animar">
              <span className="vd-kicker">Participa</span>
              <h2>Contacto y sugerencias</h2>
              <p>
                ¿Encontraste un error, quieres proponer una planta o compartir una corrección? Este formulario
                funciona de forma local: la sugerencia se guarda solo en tu navegador y no se envía a ningún
                servidor.
              </p>
            </header>

            <form className="vd-formulario vd-animar" onSubmit={enviarSugerencia}>
              <label>
                <span>Tu sugerencia</span>
                <textarea
                  rows={5}
                  value={sugerencia}
                  onChange={(e) => setSugerencia(e.target.value)}
                  placeholder="Describe tu aporte, corrección o propuesta…"
                  required
                  minLength={10}
                />
              </label>
              <label>
                <span>Correo de contacto (opcional)</span>
                <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="nombre@correo.com" />
              </label>
              <div className="vd-formulario-acciones">
                <button className="vd-boton vd-boton-primario" type="submit">
                  Guardar sugerencia
                </button>
                {estadoSugerencia === 'enviado' && (
                  <p className="vd-mensaje ok" role="status">
                    ✓ Sugerencia guardada en este navegador. Gracias por contribuir.
                  </p>
                )}
                {estadoSugerencia === 'error' && (
                  <p className="vd-mensaje error" role="alert">
                    {mensajeError}
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="vd-pie">
        <div className="vd-contenedor vd-pie-interno">
          <div>
            <h2 className="vd-pie-titulo">Vademécum Digital de Plantas Medicinales</h2>
            <p>
              Proyecto educativo y divulgativo. La información no sustituye la consulta con profesionales de la
              salud. Las fotografías pertenecen a Wikimedia Commons y conservan su autoría y licencia.
            </p>
            <p className="vd-pie-fecha-actualizacion">
              <strong>Fecha de actualización:</strong> {fechaActualizacion}
            </p>
          </div>
          <nav className="vd-pie-nav" aria-label="Enlaces del pie">
            {NAVEGACION.map((e) => (
              <a
                key={e.id}
                href={e.ruta ?? `#${e.id}`}
                onClick={(ev) => {
                  if (e.ruta) return; // navegación real a otra vista
                  ev.preventDefault();
                  irASeccion(e.id);
                }}
              >
                {e.etiqueta}
              </a>
            ))}
          </nav>
        </div>
        <p className="vd-pie-legal">
          Contenido revisado con fines educativos · Natural no significa necesariamente seguro · Consulta antes de
          usar plantas medicinales.
        </p>
      </footer>

      {mostrarArriba && (
        <button
          className="vd-volver-arriba"
          type="button"
          aria-label="Volver al inicio de la página"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      )}

      {plantaAbierta && <FichaPlanta planta={plantaAbierta} onClose={() => setPlantaAbierta(null)} />}
    </div>
  );
}
