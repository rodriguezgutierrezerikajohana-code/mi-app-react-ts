import { useEffect, useState } from 'react';
import { NIVELES_EVIDENCIA, nombreCategoria } from '../../data/plantas';
import type { Planta } from '../../data/plantas';
import { FUENTES_POR_ID } from '../../data/fuentes';
import { IMAGENES } from '../../data/imagenes';

interface Props {
  planta: Planta;
  onClose: () => void;
  /** Pestana con la que se abre la ficha. Por defecto, la primera. */
  pestanaInicial?: Pestana;
}

type Pestana = 'resumen' | 'usos' | 'preparacion' | 'fuentes';

const PESTANAS: { id: Pestana; etiqueta: string }[] = [
  { id: 'resumen', etiqueta: 'Identificación y cultivo' },
  { id: 'usos', etiqueta: 'Usos y evidencia' },
  { id: 'preparacion', etiqueta: 'Preparación y seguridad' },
  { id: 'fuentes', etiqueta: 'Conservación y fuentes' },
];

export default function FichaPlanta({ planta, onClose, pestanaInicial = 'resumen' }: Props) {
  const [pestana, setPestana] = useState<Pestana>(pestanaInicial);
  const imagen = IMAGENES[planta.imagen];

  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', alPulsar);
    document.body.classList.add('vd-sin-scroll');
    return () => {
      document.removeEventListener('keydown', alPulsar);
      document.body.classList.remove('vd-sin-scroll');
    };
  }, [onClose]);

  return (
    <div className="vd-modal-fondo" role="dialog" aria-modal="true" aria-labelledby="vd-ficha-titulo">
      <div className="vd-ficha">
        <button className="vd-ficha-cerrar" type="button" onClick={onClose} aria-label="Cerrar ficha">
          ✕
        </button>

        <div className="vd-ficha-cabecera">
          {imagen && (
            <div className="vd-ficha-foto">
              <img src={imagen.url} alt={`Fotografía de ${planta.nombre}`} loading="eager" />
              <span className="vd-ficha-credito">
                Foto: {imagen.autor} · {imagen.licencia} ·{' '}
                <a href={imagen.pagina} target="_blank" rel="noreferrer noopener">
                  Wikipedia
                </a>
              </span>
            </div>
          )}
          <div className="vd-ficha-titulo">
            <span className="vd-ficha-familia">{planta.familia}</span>
            <h2 id="vd-ficha-titulo">{planta.nombre}</h2>
            {planta.nombreLocal && <span className="vd-ficha-local">{planta.nombreLocal}</span>}
            <p className="vd-ficha-cientifico">{planta.cientifico}</p>
            <div className="vd-ficha-etiquetas">
              {planta.categorias.map((c) => (
                <span key={c} className="vd-chip vd-chip-suave">
                  {nombreCategoria(c)}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="vd-ficha-pestanas" role="tablist" aria-label="Apartados de la ficha">
          {PESTANAS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={pestana === p.id}
              className={pestana === p.id ? 'vd-pestana activa' : 'vd-pestana'}
              onClick={() => setPestana(p.id)}
            >
              {p.etiqueta}
            </button>
          ))}
        </div>

        <div className="vd-ficha-cuerpo" role="tabpanel">
          {pestana === 'resumen' && (
            <div className="vd-bloques">
              <section>
                <h3>Descripción e identificación</h3>
                <p>{planta.descripcion}</p>
              </section>
              <section>
                <h3>Distribución y hábitat</h3>
                <p>{planta.distribucion}</p>
              </section>
              <section>
                <h3>Parte utilizada</h3>
                <p>{planta.parteUsada}</p>
              </section>
              <section>
                <h3>Cultivo</h3>
                <dl className="vd-ficha-cultivo">
                  <div>
                    <dt>Luz</dt>
                    <dd>{planta.cultivo.luz}</dd>
                  </div>
                  <div>
                    <dt>Suelo</dt>
                    <dd>{planta.cultivo.suelo}</dd>
                  </div>
                  <div>
                    <dt>Riego</dt>
                    <dd>{planta.cultivo.riego}</dd>
                  </div>
                  <div>
                    <dt>Propagación</dt>
                    <dd>{planta.cultivo.propagacion}</dd>
                  </div>
                </dl>
              </section>
              <aside className="vd-nota vd-nota-aviso">
                <strong>Nota de seguridad:</strong> esta ficha es divulgativa. No uses ninguna planta con fines
                terapéuticos sin consultar a un profesional de la salud.
              </aside>
            </div>
          )}

          {pestana === 'usos' && (
            <div className="vd-bloques">
              <section>
                <h3>Usos tradicionales documentados</h3>
                <ul className="vd-lista">
                  {planta.usosTradicionales.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Propiedades estudiadas y evidencia disponible</h3>
                <p className="vd-aclaracion">
                  Los niveles indican la solidez de la información disponible, no una recomendación de uso.
                </p>
                <div className="vd-evidencia">
                  {planta.evidencia.map((e, i) => (
                    <article key={i} className={`vd-evidencia-item nivel-${e.nivel}`}>
                      <div className="vd-evidencia-cabecera">
                        <span className={`vd-badge nivel-${e.nivel}`}>{NIVELES_EVIDENCIA[e.nivel].etiqueta}</span>
                        <span className="vd-evidencia-desc">{NIVELES_EVIDENCIA[e.nivel].descripcion}</span>
                      </div>
                      <p>{e.texto}</p>
                    </article>
                  ))}
                </div>
              </section>
              <aside className="vd-nota">
                <strong>¿Sabías que…?</strong> {planta.sabiasQue}
              </aside>
            </div>
          )}

          {pestana === 'preparacion' && (
            <div className="vd-bloques">
              <section>
                <h3>Formas tradicionales de preparación</h3>
                <ul className="vd-lista">
                  {planta.preparaciones.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Precauciones y contraindicaciones</h3>
                <ul className="vd-lista vd-lista-alerta">
                  {planta.precauciones.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </section>
              <aside className="vd-nota vd-nota-peligro">
                <strong>Importante:</strong> no se incluyen dosis terapéuticas. La dosis depende de la preparación,
                la concentración y la persona, y debe ser valorada por un profesional.
              </aside>
            </div>
          )}

          {pestana === 'fuentes' && (
            <div className="vd-bloques">
              <section>
                <h3>Recomendaciones de conservación</h3>
                <p>{planta.conservacion}</p>
              </section>
              <section>
                <h3>Fuentes consultadas</h3>
                <ul className="vd-lista vd-lista-fuentes">
                  {planta.fuentes.map((id) => {
                    const fuente = FUENTES_POR_ID[id];
                    if (!fuente) return null;
                    return (
                      <li key={id}>
                        {fuente.url ? (
                          <a href={fuente.url} target="_blank" rel="noreferrer noopener">
                            {fuente.nombre}
                          </a>
                        ) : (
                          <span className="vd-fuente-sin-enlace">{fuente.nombre}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p className="vd-aviso-fuentes">
                  Estas referencias remiten a recursos generales de instituciones reconocidas. Antes de tomar
                  decisiones de salud, verifica la información en la publicación original y consulta a un
                  profesional.
                </p>
              </section>
              {imagen && (
                <section>
                  <h3>Crédito de la imagen</h3>
                  <p className="vd-credito-texto">
                    Fotografía de {planta.nombre} por {imagen.autor}, licencia {imagen.licencia}. Consultada en{' '}
                    <a href={imagen.pagina} target="_blank" rel="noreferrer noopener">
                      Wikipedia
                    </a>
                    .
                  </p>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
