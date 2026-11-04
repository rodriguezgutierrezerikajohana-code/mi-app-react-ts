/* =====================================================================
   Contenidos educativos del Vademécum Digital.

   El catálogo de fuentes vive aparte, en src/data/fuentes.ts, para que
   las fichas de planta y la sección «Fuentes» compartan la misma lista.
   ===================================================================== */

export interface Preparacion {
  id: string;
  titulo: string;
  icono: string;
  resumen: string;
  pasos: string[];
  advertencia: string;
}

export const PREPARACIONES: Preparacion[] = [
  {
    id: 'infusion',
    titulo: 'Infusión',
    icono: '🫖',
    resumen:
      'Se vierte agua caliente sobre la parte vegetal y se deja reposar tapado. Es la forma más habitual para hojas y flores.',
    pasos: [
      'Lavar y secar la parte vegetal; si es seca, medir una cucharadita por taza.',
      'Calentar el agua hasta justo antes de la ebullición, sin hervir a borbotones.',
      'Verter sobre la planta, tapar y dejar reposar entre 5 y 10 minutos.',
      'Colar y dejar templar antes de beber. No endulzar en exceso.',
    ],
    advertencia:
      'No todas las plantas son aptas para infusión. Verifica siempre la ficha de cada planta y evita mezclar muchas especies sin orientación.',
  },
  {
    id: 'decoccion',
    titulo: 'Decocción',
    icono: '🥣',
    resumen:
      'Se hierven suavemente las partes duras (raíces, cortezas, semillas) para extraer sus compuestos. No sirve para flores delicadas.',
    pasos: [
      'Colocar la parte vegetal en agua fría, en una olla sin aluminio.',
      'Llevar a ebullición y reducir el fuego hasta un hervor suave.',
      'Mantener entre 10 y 20 minutos, según la dureza de la planta.',
      'Apagar, tapar y dejar reposar 5-10 minutos antes de colar.',
    ],
    advertencia:
      'Las decocciones concentran más compuestos y también más irritantes. No prolongues la ebullición ni aumentes la dosis sin criterio profesional.',
  },
  {
    id: 'externo',
    titulo: 'Uso externo',
    icono: '🧴',
    resumen:
      'Compresas, cataplasmas, baños y aceites macerados. Se aplican sobre la piel y no deben ingerirse.',
    pasos: [
      'Preparar una infusión o decocción y dejarla enfriar hasta temperatura templada.',
      'Empapar una gasa o paño limpio y escurrir el exceso.',
      'Aplicar sobre piel intacta durante 10-15 minutos.',
      'Retirar, secar suavemente y lavar el material usado.',
    ],
    advertencia:
      'No aplicar sobre heridas abiertas, quemaduras profundas, mucosas o zonas con infección. Suspender si aparece enrojecimiento, picor o dolor.',
  },
  {
    id: 'recoleccion',
    titulo: 'Recolección y secado',
    icono: '🌾',
    resumen:
      'Una buena conservación empieza en la recolección: identificar bien la planta, cosechar en el momento adecuado y secar rápido.',
    pasos: [
      'Identificar la especie con certeza antes de recolectar; ante la duda, no usar.',
      'Recolectar en día seco, por la mañana, evitando plantas junto a carreteras o cultivos tratados.',
      'Secar a la sombra, en lugar ventilado y sobre rejilla o papel, sin amontonar.',
      'Guardar cuando esté crujiente en frascos herméticos, etiquetados con nombre y fecha.',
    ],
    advertencia:
      'No recolectes especies protegidas ni en zonas donde la recolección esté regulada. Una identificación errónea puede ser peligrosa.',
  },
  {
    id: 'tradicional-vs-evidencia',
    titulo: 'Tradición y evidencia',
    icono: '🔬',
    resumen:
      'Que una planta se use desde hace siglos no demuestra que funcione, ni que sea segura. Son dos fuentes de información distintas.',
    pasos: [
      'El uso tradicional aporta pistas y contexto cultural, pero no prueba de eficacia.',
      'La evidencia científica se ordena por calidad: desde estudios de laboratorio hasta ensayos clínicos y revisiones.',
      'Un resultado preliminar no equivale a recomendación terapéutica.',
      'La ausencia de evidencia no siempre significa que no funcione: puede significar que no se ha estudiado.',
    ],
    advertencia:
      'Desconfía de promesas de curación, dosis universales o productos "100 % naturales sin efectos". Natural no es sinónimo de seguro.',
  },
];

export interface TarjetaJardin {
  id: string;
  titulo: string;
  icono: string;
  texto: string;
  puntos: string[];
}

export const JARDIN: TarjetaJardin[] = [
  {
    id: 'luz',
    titulo: 'Luz',
    icono: '☀️',
    texto:
      'La mayoría de las aromáticas mediterráneas necesitan sol directo. Las de bosque o humedal prefieren semisombra.',
    puntos: [
      'Romero, tomillo, lavanda e hinojo: al menos 6 horas de sol.',
      'Menta, toronjil y llantén: toleran media sombra.',
      'Gira las macetas periódicamente para un crecimiento uniforme.',
    ],
  },
  {
    id: 'suelo',
    titulo: 'Suelo y drenaje',
    icono: '🪴',
    texto:
      'El exceso de agua pudre las raíces con más frecuencia que la sequía. El drenaje es la prioridad.',
    puntos: [
      'Mezcla sustrato con arena o perlita para aromáticas mediterráneas.',
      'Usa macetas con agujeros y un plato vacío.',
      'Evita suelos compactados; airea la superficie sin dañar raíces.',
    ],
  },
  {
    id: 'riego',
    titulo: 'Riego',
    icono: '💧',
    texto:
      'Riega cuando la capa superficial esté seca. Es mejor un riego profundo y espaciado que varios superficiales.',
    puntos: [
      'Comprueba la humedad introduciendo un dedo en el sustrato.',
      'Reduce el riego en invierno, cuando el crecimiento se frena.',
      'Riega por la mañana para evitar hongos nocturnos.',
    ],
  },
  {
    id: 'reproduccion',
    titulo: 'Reproducción',
    icono: '🌱',
    texto:
      'Muchas plantas medicinales se multiplican fácilmente por esqueje, división o semilla.',
    puntos: [
      'Menta, hierbabuena y romero: esquejes en agua o sustrato húmedo.',
      'Lavanda y tomillo: esquejes semileñosos en primavera.',
      'Albahaca y caléndula: siembra directa en primavera.',
    ],
  },
  {
    id: 'cosecha',
    titulo: 'Cosecha responsable',
    icono: '✂️',
    texto:
      'Cosecha solo lo necesario y deja siempre suficiente planta para que se recupere y cumpla su función ecológica.',
    puntos: [
      'No arranques plantas silvestres de raíz; corta hojas o flores.',
      'Recolecta como máximo un tercio de la planta y evita ejemplares aislados.',
      'Respeta épocas de floración y polinizadores.',
    ],
  },
  {
    id: 'biodiversidad',
    titulo: 'Biodiversidad',
    icono: '🐝',
    texto:
      'Un jardín medicinal también es un refugio para insectos, aves y microorganismos del suelo.',
    puntos: [
      'Combina aromáticas con flores nativas de tu región.',
      'Evita pesticidas y fertilizantes sintéticos.',
      'Deja zonas sin podar y refugios para insectos benéficos.',
      'Prioriza especies locales y no introduzcas plantas invasoras.',
    ],
  },
];

export interface TerminoGlosario {
  termino: string;
  definicion: string;
}

export const GLOSARIO: TerminoGlosario[] = [
  {
    termino: 'Adaptógeno',
    definicion:
      'Término tradicional para plantas que se supone ayudan al organismo a adaptarse al estrés. Es un concepto poco definido y no una categoría clínica reconocida de forma universal.',
  },
  {
    termino: 'Antraquinona',
    definicion:
      'Grupo de compuestos presentes en algunas plantas laxantes. Pueden irritar el intestino y no se recomiendan para uso prolongado.',
  },
  {
    termino: 'Carminativo',
    definicion:
      'Dícese de lo que ayuda a expulsar gases intestinales. Es una acción tradicional, no un diagnóstico ni una garantía de eficacia.',
  },
  {
    termino: 'Decocción',
    definicion:
      'Preparación en la que la planta se hierve suavemente en agua para extraer compuestos de partes duras como raíces o cortezas.',
  },
  {
    termino: 'Emoliente',
    definicion:
      'Sustancia que suaviza o protege la piel y las mucosas, formando una película que reduce la irritación.',
  },
  {
    termino: 'Fitoterapia',
    definicion:
      'Uso de plantas o preparados vegetales con fines de salud. Debe distinguirse del uso culinario y del consumo autoprescrito sin criterio.',
  },
  {
    termino: 'Infusión',
    definicion:
      'Preparación en la que se vierte agua caliente sobre hojas o flores y se deja reposar sin hervir la planta.',
  },
  {
    termino: 'Mucílago',
    definicion:
      'Sustancia vegetal que forma un gel al contacto con el agua. Aporta sensación demulcente y puede modular el tránsito intestinal.',
  },
  {
    termino: 'Principio activo',
    definicion:
      'Compuesto o conjunto de compuestos a los que se atribuye una acción biológica. En una planta suele haber muchos, con efectos que se influyen entre sí.',
  },
  {
    termino: 'Sinergia',
    definicion:
      'Efecto conjunto de varios compuestos que puede ser distinto de la suma de sus efectos por separado. Es un fenómeno descrito, pero difícil de medir.',
  },
  {
    termino: 'Taninos',
    definicion:
      'Compuestos que precipitan proteínas y pueden tener efecto astringente. En dosis altas dificultan la absorción de hierro y otras sustancias.',
  },
  {
    termino: 'Uso tradicional',
    definicion:
      'Empleo documentado históricamente en una cultura. No implica que haya sido evaluado con métodos científicos ni que sea eficaz.',
  },
];

export interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

export const PREGUNTAS_FRECUENTES: PreguntaFrecuente[] = [
  {
    pregunta: '¿Las plantas medicinales pueden sustituir un tratamiento médico?',
    respuesta:
      'No. La información de este vademécum es educativa y no sustituye la valoración, el diagnóstico ni el tratamiento de un profesional de la salud. Si tienes una enfermedad, síntomas persistentes o tomas medicamentos, consulta antes de usar plantas con fines terapéuticos.',
  },
  {
    pregunta: '¿Si es natural es seguro?',
    respuesta:
      'No necesariamente. Las plantas contienen compuestos activos que pueden causar efectos adversos, irritaciones, alergias e interacciones con medicamentos. La dosis, la preparación y la persona que la consume influyen en el riesgo.',
  },
  {
    pregunta: '¿Qué diferencia hay entre uso tradicional y evidencia científica?',
    respuesta:
      'El uso tradicional es un saber transmitido históricamente; la evidencia científica proviene de estudios diseñados para medir efectos y riesgos. En cada ficha se indica el nivel de evidencia disponible: tradicional, preliminar o moderada.',
  },
  {
    pregunta: '¿Puedo usar plantas durante el embarazo o la lactancia?',
    respuesta:
      'Requiere especial precaución. Muchas plantas no se han estudiado en el embarazo y algunas pueden afectar al útero, la lactancia o el desarrollo del bebé. Consulta siempre con un profesional antes de usar cualquier planta medicinal en esta etapa.',
  },
  {
    pregunta: '¿Puedo combinar plantas con mis medicamentos?',
    respuesta:
      'Algunas plantas modifican cómo se absorben o metabolizan los fármacos. Por ejemplo, el ajo, el jengibre o el ginseng pueden influir en el riesgo de sangrado. Informa a tu médico y farmacéutico de todas las plantas o suplementos que uses.',
  },
  {
    pregunta: '¿De dónde salen las fotografías?',
    respuesta:
      'Las fotografías proceden de Wikimedia Commons y cuentan con licencias libres. En cada imagen se indica el autor, la licencia y el enlace a la página original del archivo. Puedes consultarlas en la galería y en el pie de cada ficha.',
  },
  {
    pregunta: '¿Cómo puedo aportar información o corregir un dato?',
    respuesta:
      'En la sección de contacto puedes enviar sugerencias. El formulario funciona de forma local: no se envía a ningún servidor y el texto queda guardado únicamente en tu navegador para que puedas revisarlo.',
  },
];

export interface Curiosidad {
  texto: string;
  fuente: string;
}

export const CURIOSIDADES: Curiosidad[] = [
  {
    texto:
      'El nombre "manzanilla" se relaciona con el aroma a manzana de sus flores; su nombre científico actual, Matricaria chamomilla, agrupa plantas antes clasificadas en géneros distintos.',
    fuente: 'Kew – Plants of the World Online',
  },
  {
    texto:
      'La menta piperita es un híbrido estéril: no produce semillas viables y se propaga principalmente por estolones, por eso casi siempre se cultiva a partir de esquejes.',
    fuente: 'Kew – Plants of the World Online',
  },
  {
    texto:
      'El gel de áloe y el látex amarillo de la misma hoja no son lo mismo: el gel se usa sobre la piel, mientras que el látex tiene un fuerte efecto laxante y no se recomienda ingerir.',
    fuente: 'NCCIH – Aloe Vera',
  },
  {
    texto:
      'El aroma del ajo aparece cuando sus células se rompen: se forma alicina a partir de un compuesto inodoro llamado aliína. Por eso un diente entero apenas huele.',
    fuente: 'NCCIH – Garlic',
  },
  {
    texto:
      'La cúrcuma debe su color naranja a los curcuminoides. Su baja biodisponibilidad oral es una de las razones por las que los resultados de los estudios no son concluyentes.',
    fuente: 'NCCIH – Turmeric',
  },
  {
    texto:
      'La pasiflora debe su nombre a los misioneros españoles, que vieron en su flor una representación de la Pasión de Cristo. La relación es simbólica, no botánica.',
    fuente: 'Kew – Plants of the World Online',
  },
];

export const AVISO_LEGAL =
  'La información de este vademécum es educativa y divulgativa. No sustituye la valoración, el diagnóstico ni el tratamiento de un profesional de la salud. Natural no significa necesariamente seguro: las plantas pueden causar efectos adversos e interacciones con medicamentos. Requiere especial precaución durante el embarazo, la lactancia, la infancia y cuando se utilizan medicamentos.';
