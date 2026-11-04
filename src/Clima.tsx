interface DiaPronostico {
  dia: string;
  tempMax: number;
  tempMin: number;
  icono: string;
  condicion: string;
}

interface DatosClima {
  ciudad: string;
  pais: string;
  temperatura: number;
  sensacion: number;
  condicion: string;
  icono: string;
  humedad: number;
  viento: number;
  presion: number;
  pronostico: DiaPronostico[];
}

const Clima = () => {
  // Datos de prueba (mock) - sin consumir API real
  const clima: DatosClima = {
    ciudad: 'Madrid',
    pais: 'ES',
    temperatura: 24,
    sensacion: 26,
    condicion: 'Soleado',
    icono: '☀️',
    humedad: 45,
    viento: 12,
    presion: 1015,
    pronostico: [
      { dia: 'Lunes', tempMax: 26, tempMin: 16, icono: '☀️', condicion: 'Soleado' },
      { dia: 'Martes', tempMax: 22, tempMin: 14, icono: '⛅', condicion: 'Parcialmente nublado' },
      { dia: 'Miércoles', tempMax: 19, tempMin: 12, icono: '🌧️', condicion: 'Lluvia ligera' },
      { dia: 'Jueves', tempMax: 21, tempMin: 13, icono: '⛅', condicion: 'Nublado' },
      { dia: 'Viernes', tempMax: 25, tempMin: 15, icono: '☀️', condicion: 'Soleado' },
      { dia: 'Sábado', tempMax: 27, tempMin: 17, icono: '☀️', condicion: 'Soleado' },
      { dia: 'Domingo', tempMax: 23, tempMin: 15, icono: '🌤️', condicion: 'Mayormente soleado' },
    ],
  };

  const estilos: any = {
    contenedor: {
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '700px',
      margin: '2rem auto',
      padding: '0 1rem',
    },
    tarjeta: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      borderRadius: '24px',
      padding: '2rem',
      color: '#ffffff',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    },
    encabezado: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    ubicacion: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    nombreCiudad: {
      fontSize: '2rem',
      fontWeight: 700,
      margin: 0,
    },
    pais: {
      fontSize: '1rem',
      opacity: 0.9,
      margin: 0,
    },
    temperaturaGrande: {
      fontSize: '5rem',
      fontWeight: 800,
      margin: '0.5rem 0',
      lineHeight: 1,
    },
    condicion: {
      fontSize: '1.25rem',
      opacity: 0.95,
      margin: 0,
    },
    sensacion: {
      fontSize: '0.95rem',
      opacity: 0.9,
      marginTop: '0.25rem',
    },
    detalles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      marginTop: '2rem',
    },
    detalle: {
      background: 'rgba(255,255,255,0.15)',
      padding: '1rem',
      borderRadius: '12px',
      textAlign: 'center',
    },
    etiqueta: {
      fontSize: '0.85rem',
      opacity: 0.85,
      display: 'block',
      marginBottom: '0.25rem',
    },
    valor: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    seccionPronostico: {
      marginTop: '2.5rem',
    },
    tituloPronostico: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: '#111827',
      marginBottom: '1rem',
    },
    listaPronostico: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '0.75rem',
    },
    tarjetaDia: {
      background: '#f3f4f6',
      padding: '1rem 0.75rem',
      borderRadius: '16px',
      textAlign: 'center',
    },
    nombreDia: {
      fontSize: '0.9rem',
      fontWeight: 600,
      color: '#111827',
      marginBottom: '0.5rem',
    },
    iconoDia: {
      fontSize: '1.5rem',
      marginBottom: '0.5rem',
    },
    tempDia: {
      fontSize: '1rem',
      fontWeight: 700,
      color: '#111827',
      marginBottom: '0.25rem',
    },
    condicionDia: {
      fontSize: '0.8rem',
      color: '#6b7280',
    },
    nota: {
      marginTop: '1.5rem',
      fontSize: '0.85rem',
      color: '#6b7280',
      textAlign: 'center',
    },
  };

  return (
    <section style={estilos.contenedor}>
      <article style={estilos.tarjeta}>
        <div style={estilos.encabezado}>
          <div style={estilos.ubicacion}>
            <span>📍</span>
            <p style={estilos.nombreCiudad}>{clima.ciudad}</p>
            <p style={estilos.pais}>{clima.pais}</p>
          </div>
          <span style={{ fontSize: '3rem' }}>{clima.icono}</span>
        </div>

        <p style={estilos.temperaturaGrande}>{clima.temperatura}°C</p>
        <p style={estilos.condicion}>{clima.condicion}</p>
        <p style={estilos.sensacion}>
          Sensación térmica: {clima.sensacion}°C
        </p>

        <div style={estilos.detalles}>
          <div style={estilos.detalle}>
            <span style={estilos.etiqueta}>Humedad</span>
            <span style={estilos.valor}>{clima.humedad}%</span>
          </div>
          <div style={estilos.detalle}>
            <span style={estilos.etiqueta}>Viento</span>
            <span style={estilos.valor}>{clima.viento} km/h</span>
          </div>
          <div style={estilos.detalle}>
            <span style={estilos.etiqueta}>Presión</span>
            <span style={estilos.valor}>{clima.presion} hPa</span>
          </div>
        </div>

        <div style={estilos.seccionPronostico}>
          <h3 style={estilos.tituloPronostico}>Pronóstico de los próximos 7 días</h3>
          <div style={estilos.listaPronostico}>
            {clima.pronostico.map((dia) => (
              <div key={dia.dia} style={estilos.tarjetaDia}>
                <div style={estilos.nombreDia}>{dia.dia}</div>
                <div style={estilos.iconoDia}>{dia.icono}</div>
                <div style={estilos.tempDia}>
                  {dia.tempMax}° / {dia.tempMin}°
                </div>
                <div style={estilos.condicionDia}>{dia.condicion}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={estilos.nota}>
          ⚠️ Datos de prueba. Esta información no proviene de una API real.
        </p>
      </article>
    </section>
  );
};

export default Clima;

