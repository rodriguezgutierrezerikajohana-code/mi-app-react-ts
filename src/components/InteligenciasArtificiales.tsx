import { useMemo, useState } from 'react';
import {
  CATEGORIAS,
  IAS,
  InteligenciaArtificial,
  TipoIA,
} from '../data/ias';
import './InteligenciasArtificiales.css';

const TIPO_LABEL: Record<TipoIA, string> = {
  Gratis: 'Gratis',
  Freemium: 'Freemium',
  'De pago': 'De pago',
};

const TIPO_CLASS: Record<TipoIA, string> = {
  Gratis: 'gratis',
  Freemium: 'freemium',
  'De pago': 'de-pago',
};

export default function InteligenciasArtificiales() {
  const [query, setQuery] = useState('');
  const [categoria, setCategoria] = useState<string>('Todas');
  const [abierta, setAbierta] = useState<InteligenciaArtificial | null>(null);

  const filtradas = useMemo(() => {
    const q = query.toLowerCase().trim();
    return IAS.filter((ia) => {
      const coincideTexto =
        !q ||
        ia.nombre.toLowerCase().includes(q) ||
        ia.descripcion.toLowerCase().includes(q) ||
        ia.categoria.toLowerCase().includes(q);
      const coincideCategoria =
        categoria === 'Todas' || ia.categoria === categoria;
      return coincideTexto && coincideCategoria;
    });
  }, [query, categoria]);

  const cerrarModal = () => setAbierta(null);

  return (
    <div className="ia-app">
      <header className="ia-header">
        <span className="ia-badge">
          {'🤖'} Directorio de Inteligencias Artificiales
        </span>
        <h1 className="ia-title">Todas las IAS en un solo lugar</h1>
        <p className="ia-subtitle">
          Explora, compara y accede a las mejores inteligencias artificiales
          organizadas por categoría: texto, imagen, video, código, audio,
          productividad, diseño, 3D, investigación y empresa.
        </p>
        <div className="ia-stats">
          <div className="ia-stat">
            <strong>{filtradas.length}</strong> resultados
          </div>
          <div className="ia-stat">
            <strong>{IAS.length}</strong> IAs indexadas
          </div>
          <div className="ia-stat">
            <strong>{CATEGORIAS.length - 1}</strong> categorías
          </div>
        </div>
      </header>

      <div className="ia-toolbar">
        <div className="ia-search">
          <input
            type="text"
            placeholder="Buscar IA por nombre, descripción o categoría…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="ia-categories">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              className={`ia-chip ${categoria === cat ? 'active' : ''}`}
              onClick={() => setCategoria(cat)}
            >
              <span className="ia-chip-emoji">{emojiCategoria(cat)}</span>{' '}
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="ia-grid">
        {filtradas.length === 0 ? (
          <div className="ia-empty">
            <h2>No se encontraron IAs</h2>
            <p>Intenta con otro término o selecciona otra categoría.</p>
          </div>
        ) : (
          filtradas.map((ia) => (
            <article
              key={ia.id}
              className="ia-card"
              onClick={() => setAbierta(ia)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setAbierta(ia)}
            >
              <header className="ia-card-header">
                <div
                  className="ia-logo"
                  style={{ backgroundColor: ia.color, color: '#ffffff' }}
                >
                  {ia.emoji}
                </div>
                <h3>{ia.nombre}</h3>
                <span className={`ia-tipo ${TIPO_CLASS[ia.tipo]}`}>
                  {TIPO_LABEL[ia.tipo]}
                </span>
              </header>
              <div className="ia-card-body">
                <span className="ia-categoria">{ia.categoria}</span>
                <p className="ia-descripcion">{ia.descripcion}</p>
                {ia.lanzamiento && (
                  <p className="ia-lanzamiento">
                    📅 {ia.lanzamiento}
                  </p>
                )}
              </div>
              <footer className="ia-footer">
                <button
                  className="ia-visitar"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(ia.sitioWeb, '_blank', 'noopener,noreferrer');
                  }}
                >
                  Visitar sitio ↗
                </button>
              </footer>
            </article>
          ))
        )}
      </main>

      {abierta && (
        <div className="ia-overlay" onClick={cerrarModal}>
          <div className="ia-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ia-modal-close" onClick={cerrarModal}>
              ✕
            </button>
            <header className="ia-modal-header">
              <div className="ia-modal-top">
                <div
                  className="ia-modal-logo"
                  style={{ backgroundColor: abierta.color }}
                >
                  {abierta.emoji}
                </div>
                <h1>{abierta.nombre}</h1>
                <span
                  className={`ia-modal-tipo ${TIPO_CLASS[abierta.tipo]}`}
                >
                  {TIPO_LABEL[abierta.tipo]}
                </span>
              </div>
              <span className="ia-modal-categoria">
                {abierta.categoria}
              </span>
              <p className="ia-modal-detalle">{abierta.detalle}</p>
              <div className="ia-modal-info">
                <div className="ia-info-item">
                  <span className="ia-info-label">Tipo de acceso</span>
                  <span className="ia-info-value">
                    {TIPO_LABEL[abierta.tipo]}
                  </span>
                </div>
                {abierta.lanzamiento && (
                  <div className="ia-info-item">
                    <span className="ia-info-label">Lanzamiento</span>
                    <span className="ia-info-value">{abierta.lanzamiento}</span>
                  </div>
                )}
                <div className="ia-info-item">
                  <span className="ia-info-label">Categoría</span>
                  <span className="ia-info-value">{abierta.categoria}</span>
                </div>
              </div>
              <div className="ia-modal-actions">
                <button
                  className="ia-btn ia-btn-outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(abierta.sitioWeb, '_blank', 'noopener,noreferrer');
                  }}
                >
                  Ir al sitio web ↗
                </button>
                <button className="ia-btn ia-btn-primary" onClick={cerrarModal}>
                  Cerrar
                </button>
              </div>
            </header>
          </div>
        </div>
      )}
    </div>
  );
}

function emojiCategoria(cat: string): string {
  const map: Record<string, string> = {
    Todas: '🌐',
    'Texto y Chat': '💬',
    Imagen: '🖼️',
    Video: '🎬',
    Código: '💻',
    Audio: '🔊',
    Productividad: '📊',
    Diseño: '🎨',
    '3D y Modelado': '📦',
    Investigación: '🔬',
    Empresarial: '🏢',
  };
  return map[cat] ?? '🤖';
}