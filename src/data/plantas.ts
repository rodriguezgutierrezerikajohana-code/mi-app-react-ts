/* =====================================================================
   Fuente única de verdad de las plantas medicinales.

   Antes existían dos catálogos paralelos (src/data/plantas.ts y
   src/vademecum/data/plantas.ts) con esquemas distintos. Este archivo
   los unifica en un único registro con el esquema más completo: cada
   planta conserva toda la información de ambas fuentes (cultivo,
   curiosidad, fuentes, varios niveles de evidencia, varias categorías).

   Criterios editoriales:
   - Los "usos tradicionales" describen prácticas documentadas
     históricamente; NO afirman eficacia.
   - Cada entrada de evidencia indica su nivel y describe honestamente
     el estado de los estudios.
   - No se publican dosis terapéuticas: esa información requiere
     valoración profesional individualizada.
   ===================================================================== */

import type { SourceKey } from './fuentes';

export type NivelEvidencia = 'tradicional' | 'preliminar' | 'moderada';

export interface Evidencia {
  nivel: NivelEvidencia;
  texto: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
}

export interface CultivoPlanta {
  luz: string;
  suelo: string;
  riego: string;
  propagacion: string;
}

export interface Planta {
  /** Identificador estable: también es la clave de la fotografía. */
  id: string;
  nombre: string;
  /** Nombre local o nombre con el que se conoce en casa, si lo tiene. */
  nombreLocal?: string;
  cientifico: string;
  familia: string;
  /** Ids de categoría (ver CATEGORIAS). Una planta puede estar en varias. */
  categorias: string[];
  /** Descripción corta para la tarjeta del catálogo. */
  resumen: string;
  /** Descripción e identificación de la especie. */
  descripcion: string;
  distribucion: string;
  parteUsada: string;
  usosTradicionales: string[];
  /** Evidencia disponible, ordenada de menor a mayor solidez. */
  evidencia: Evidencia[];
  preparaciones: string[];
  precauciones: string[];
  conservacion: string;
  cultivo: CultivoPlanta;
  /** Curiosidad verificada para la sección "¿Sabías que?". */
  sabiasQue: string;
  /** Claves del catálogo de fuentes (ver src/data/fuentes.ts). */
  fuentes: SourceKey[];
  /** Clave de la fotografía en src/data/imagenes.ts. */
  imagen: string;
  /** Artículo de Wikipedia del que procede la fotografía. */
  wikipedia: string;
}

/**
 * Taxonomía única de categorías de uso.
 * Reúne los criterios de ambas versiones anteriores: se conservan
 * «Nerviosas y sueño», «Antiinflamatorias y dolor», «Inmunitarias y
 * defensas», «Tónicas y energéticas» y «Dermatológicas y uso externo».
 */
export const CATEGORIAS: Categoria[] = [
  {
    id: 'digestivas',
    nombre: 'Digestivas',
    icono: '🌾',
    descripcion: 'Tradición para malestares digestivos leves',
  },
  {
    id: 'relajantes',
    nombre: 'Nerviosas y sueño',
    icono: '🌙',
    descripcion: 'Plantas asociadas a la calma, el descanso y el sueño',
  },
  {
    id: 'respiratorias',
    nombre: 'Respiratorias',
    icono: '🍃',
    descripcion: 'Vapores e infusiones para las vías respiratorias',
  },
  {
    id: 'piel',
    nombre: 'Dermatológicas y uso externo',
    icono: '🩹',
    descripcion: 'Uso externo, cuidado cutáneo y cicatrización',
  },
  {
    id: 'antiinflamatorias',
    nombre: 'Antiinflamatorias y dolor',
    icono: '🔥',
    descripcion: 'Tradición antiinflamatoria, antioxidante y alivio del dolor',
  },
  {
    id: 'inmunitarias',
    nombre: 'Inmunitarias y defensas',
    icono: '🛡️',
    descripcion: 'Uso tradicional para las defensas del organismo',
  },
  {
    id: 'vitalidad',
    nombre: 'Tónicas y energéticas',
    icono: '☀️',
    descripcion: 'Energía, circulación y bienestar general',
  },
];

export const NIVELES_EVIDENCIA: Record<
  NivelEvidencia,
  { etiqueta: string; descripcion: string; detalle: string }
> = {
  tradicional: {
    etiqueta: 'Uso tradicional',
    descripcion: 'Documentado históricamente, sin eficacia clínica demostrada.',
    detalle:
      'Práctica recogida en monografías de uso tradicional. No existen ensayos clínicos modernos suficientes para confirmar su eficacia.',
  },
  preliminar: {
    etiqueta: 'Evidencia preliminar',
    descripcion: 'Estudios pequeños o de laboratorio; resultados no concluyentes.',
    detalle:
      'Estudios en células, en animales o ensayos pequeños y con limitaciones. Falta confirmación clínica en personas.',
  },
  moderada: {
    etiqueta: 'Evidencia moderada',
    descripcion: 'Varios estudios o revisiones respaldan un efecto, con limitaciones.',
    detalle:
      'Existen ensayos clínicos y revisiones sistemáticas, pero con resultados modestos, heterogéneos o no concluyentes de forma consistente.',
  },
};

/** Orden de menor a mayor solidez, para comparar niveles de evidencia. */
const ORDEN_EVIDENCIA: NivelEvidencia[] = ['tradicional', 'preliminar', 'moderada'];

/**
 * Nivel de evidencia global de una planta: el más alto de los que
 * registra su ficha. Deriva de `evidencia`, de modo que nunca se
 * desincroniza del detalle.
 */
export function nivelEvidenciaDe(planta: Planta): NivelEvidencia {
  return planta.evidencia.reduce<NivelEvidencia>(
    (mayor, actual) =>
      ORDEN_EVIDENCIA.indexOf(actual.nivel) > ORDEN_EVIDENCIA.indexOf(mayor) ? actual.nivel : mayor,
    'tradicional',
  );
}

/** Nombre legible de una categoría, o el propio id si no está en el catálogo. */
export function nombreCategoria(id: string): string {
  return CATEGORIAS.find((c) => c.id === id)?.nombre ?? id;
}

/** Icono legible de una categoría, o un emoji neutro si no está en el catálogo. */
export function iconoCategoria(id: string): string {
  return CATEGORIAS.find((c) => c.id === id)?.icono ?? '🌿';
}

export const PLANTAS: Planta[] = [
  {
    id: 'sabila',
    nombre: 'Sábila',
    cientifico: 'Aloe vera (L.) Burm.f.',
    familia: 'Asphodelaceae',
    categorias: ['piel', 'digestivas'],
    resumen:
      'Suculenta de hojas carnosas cuyo gel interior se usa tradicionalmente sobre la piel, y cuyo látex amarillo exige máxima precaución.',
    descripcion:
      'Roseta basal de hojas lanceoladas, gruesas y carnosas, de color verde grisáceo con manchas claras y dientes suaves en los bordes. Produce una espiga alta con flores tubulares amarillentas. El interior de la hoja contiene un gel transparente y, justo debajo de la corteza, una capa de látex amarillo. Rara vez florece en cultivo doméstico.',
    distribucion:
      'Originaria del noreste de África y la península arábiga; cultivada y naturalizada en regiones cálidas y semiáridas de América, Asia, África y la cuenca mediterránea.',
    parteUsada:
      'El gel transparente del interior de la hoja, de uso tópico. El látex amarillo de la corteza es una parte distinta, de uso oral tradicional y de corta duración, que no debe confundirse con el gel.',
    usosTradicionales: [
      'Aplicación del gel fresco sobre piel seca, irritaciones leves y quemaduras solares superficiales.',
      'Hidratación de la piel seca y preparaciones cosméticas caseras.',
      'Uso oral tradicional del látex como laxante de corta duración, hoy desaconsejado sin supervisión.',
    ],
    evidencia: [
      {
        nivel: 'preliminar',
        texto:
          'Revisiones sistemáticas sobre quemaduras superficiales muestran resultados inconsistentes: algunos estudios sugieren una cicatrización algo más rápida, pero la calidad metodológica varía y no permiten afirmar superioridad frente a tratamientos convencionales.',
      },
      {
        nivel: 'tradicional',
        texto:
          'El gel se emplea ampliamente en cosmética por su contenido en polisacáridos y su efecto emoliente; esta tradición de uso está bien documentada, aunque no equivale a eficacia terapéutica demostrada.',
      },
      {
        nivel: 'tradicional',
        texto:
          'La EMA recoge el látex de aloe como planta de uso tradicional para el estreñimiento: es un uso reconocido, no una eficacia demostrada.',
      },
      {
        nivel: 'moderada',
        texto:
          'El efecto laxante estimulante del látex (aloína) está bien documentado, pero su uso crónico se considera inseguro por el riesgo de desequilibrios electrolíticos y dependencia intestinal.',
      },
    ],
    preparaciones: [
      'Gel fresco de la hoja aplicado directamente sobre la piel limpia y seca; retirar si aparece irritación.',
      'Geles y cosméticos comerciales: verificar que contengan gel, no látex.',
      'Infusión templada para lavados y compresas.',
      'Preparaciones del látex seco: solo bajo orientación profesional.',
    ],
    precauciones: [
      'No ingerir el látex: puede provocar diarrea intensa, dolor abdominal y pérdida de electrolitos.',
      'No usar en obstrucción intestinal, apendicitis ni dolor abdominal de causa desconocida.',
      'Evitar el consumo oral durante el embarazo, la lactancia y en menores de 12 años.',
      'El látex ingerido puede interactuar con anticoagulantes, diuréticos, digoxina y medicamentos para la diabetes.',
      'Probar el gel en una zona pequeña antes de aplicarlo en áreas extensas: existe alergia de contacto poco frecuente.',
    ],
    conservacion:
      'La planta viva se conserva en maceta o jardín con sustrato muy drenado y mucha luz, protegida del frío. El gel recién extraído se degrada rápido: conservarlo refrigerado y usarlo en 24-48 horas. La hoja seca se guarda en un lugar fresco y protegido de la luz.',
    cultivo: {
      luz: 'Mucha luz; sol directo o media sombra en las horas más fuertes.',
      suelo: 'Arenoso y muy drenado; evitar el encharcamiento a toda costa.',
      riego: 'Escaso: dejar secar el sustrato por completo entre riegos.',
      propagacion: 'Por hijales, las plantas hijas que brotan al pie de la matriz.',
    },
    sabiasQue:
      'El gel y el látex son dos sustancias distintas de la misma hoja: el gel es el de uso dermatológico y el látex amarillo, el que contiene las antraquinonas responsables del efecto laxante.',
    fuentes: ['ema', 'who', 'nccih', 'kew'],
    imagen: 'sabila',
    wikipedia: 'Aloe vera',
  },
  {
    id: 'manzanilla',
    nombre: 'Manzanilla',
    cientifico: 'Matricaria chamomilla L.',
    familia: 'Asteraceae',
    categorias: ['digestivas', 'relajantes', 'piel'],
    resumen:
      'Florcita de aroma dulce y centro amarillo, quizá la infusión más extendida del mundo para el malestar digestivo leve y la relajación.',
    descripcion:
      'Hierba anual de 20 a 60 cm, de tallos erguidos y hojas finamente divididas. Las flores son cabezillas con disco amarillo y rayos blancos; el receptáculo del capítulo es hueco y sin escamas, una clave para distinguirla de especies parecidas y no comestibles. Su aroma dulce la distingue de otras especies llamadas «manzanilla».',
    distribucion:
      'Nativa de Europa y Asia occidental; ampliamente cultivada y naturalizada en zonas templadas de todo el mundo. Crece en campos, bordes de caminos, praderas y suelos alterados.',
    parteUsada:
      'Los capítulos (flores) secos, recolectados al comienzo de la floración y secados a la sombra; en menor medida, las hojas.',
    usosTradicionales: [
      'Infusión para el malestar estomacal leve, la sensación de gases y la digestión pesada.',
      'Consumo tradicional para favorecer la calma y el descanso nocturno.',
      'Lavados, compresas templadas y vahos para irritaciones cutáneas leves.',
      'Enjuagues bucales tradicionales para molestias de encías.',
    ],
    evidencia: [
      {
        nivel: 'moderada',
        texto:
          'La monografía de la EMA reconoce el uso tradicional de la flor en molestias digestivas leves y como coadyuvante en el descanso. Los estudios clínicos son de tamaño pequeño y de resultados variables, aunque algunas revisiones sugieren un beneficio modesto en la ansiedad leve y los síntomas digestivos.',
      },
      {
        nivel: 'preliminar',
        texto:
          'Se han publicado ensayos sobre ansiedad y calidad del sueño con extractos estandarizados, con resultados prometedores pero heterogéneos.',
      },
      {
        nivel: 'preliminar',
        texto:
          'El uso tópico en irritaciones cutáneas leves tiene respaldo tradicional y estudios limitados; no sustituye el tratamiento de heridas infectadas.',
      },
    ],
    preparaciones: [
      'Infusión: una cucharadita de flores secas por taza de agua recién hervida, tapada, durante 5 a 10 minutos.',
      'Macerado en frío para lociones y lavados cutáneos.',
      'Compresas de la infusión templada sobre la piel intacta.',
      'Vahos: infusión caliente en recipiente, inhalando el vapor con distancia y supervisión.',
    ],
    precauciones: [
      'Evitar en personas alérgicas a plantas de la familia Asteraceae (margaritas, ambrosía, crisantemos).',
      'No usar aceite esencial de manzanilla en el ojo ni cerca de él.',
      'Precaución con anticoagulantes por su contenido en cumarinas; consultar antes de combinar.',
      'No se recomienda su uso medicinal habitual durante el embarazo sin supervisión.',
      'El uso prolongado de vahos muy calientes puede irritar las vías respiratorias.',
    ],
    conservacion:
      'Secar a la sombra, en un lugar ventilado, extendiendo las flores en una capa fina. Guardar en frasco opaco, hermético y etiquetado; desechar si pierde el aroma o cambia de color. Conserva aroma y propiedades aproximadamente 12 meses.',
    cultivo: {
      luz: 'Pleno sol o media sombra ligera.',
      suelo: 'Bien drenado, tolerante a suelos pobres y arenosos.',
      riego: 'Moderado; soporta bien la sequía una vez establecida.',
      propagacion: 'Semilla directa en primavera; siembra espontánea muy frecuente.',
    },
    sabiasQue:
      'El nombre científico Matricaria proviene del latín matrix (útero), por el uso tradicional de la planta en molestias femeninas: es un dato etimológico, no una confirmación de eficacia.',
    fuentes: ['ema', 'who', 'nccih', 'kew'],
    imagen: 'manzanilla',
    wikipedia: 'Matricaria chamomilla',
  },
  {
    id: 'hierbabuena',
    nombre: 'Hierbabuena',
    nombreLocal: 'La hierbabuena de la casa de mi mamá',
    cientifico: 'Mentha spicata L.',
    familia: 'Lamiaceae',
    categorias: ['digestivas', 'respiratorias'],
    resumen:
      'Hierba aromática de tallos cuadrados y aroma fresco, tradicionalmente usada en infusión después de las comidas.',
    descripcion:
      'Hierba perenne de porte rastrero que forma matas, con tallos cuadrados, hojas opuestas, lanceoladas, dentadas y de aroma característico al frotarlas. Las flores se agrupan en espigas terminales violáceas formadas por flores pequeñas, blancas o lilas. Se propaga con facilidad por estolones.',
    distribucion:
      'Originaria del sur de Europa y Asia occidental; cultivada y naturalizada en América y otras regiones templadas húmedas. Prefiere suelos frescos y con buen aporte de materia orgánica.',
    parteUsada: 'Las hojas aéreas frescas o secas, recolectadas antes de la floración, y en menor medida los tallos tiernos.',
    usosTradicionales: [
      'Infusión después de las comidas para la sensación de digestión pesada y los gases.',
      'Uso tradicional para náuseas leves y molestias gástricas puntuales.',
      'Enjuagues y aguas aromáticas como refrescante bucal.',
      'Hojas frescas masticadas en la tradición popular.',
    ],
    evidencia: [
      {
        nivel: 'tradicional',
        texto:
          'El uso como carminativo y digestivo está ampliamente documentado en la tradición europea y mediterránea; los ensayos clínicos específicos con Mentha spicata son escasos.',
      },
      {
        nivel: 'preliminar',
        texto:
          'Estudios pequeños sugieren cierto alivio de síntomas dispépticos, aunque la mayoría se han realizado con otras especies de menta o con aceites esenciales.',
      },
      {
        nivel: 'preliminar',
        texto:
          'La EMA recoge la menta de hoja como planta de uso tradicional para molestias digestivas leves. La evidencia clínica en personas es limitada y mayoritariamente trasladada de la menta piperita, cuyo aceite esencial sí cuenta con estudios específicos.',
      },
    ],
    preparaciones: [
      'Infusión de hojas secas o frescas, tapada de 5 a 10 minutos.',
      'Agua aromática por maceración en frío de las hojas.',
      'Uso culinario fresco en ensaladas, salsas y bebidas.',
      'Uso externo del aceite esencial diluido, nunca puro sobre la piel.',
    ],
    precauciones: [
      'Puede empeorar el reflujo gastroesofágico y el ardor de estómago.',
      'Precaución en personas con cálculos biliares; consultar antes de usar extractos concentrados.',
      'Evitar aceites esenciales ricos en mentol en la cara de lactantes y niños pequeños por riesgo de espasmo respiratorio.',
      'El aceite esencial no debe ingerirse sin indicación profesional.',
      'En caso de alergia a Lamiaceae (albahaca, tomillo, lavanda), usar con prudencia.',
    ],
    conservacion:
      'Las hojas frescas duran pocos días en refrigeración. Secar en manojos colgados, en lugar ventilado y oscuro, o en deshidratador a baja temperatura. Guardar en frasco hermético y etiquetado; conserva el aroma durante meses.',
    cultivo: {
      luz: 'Sol o media sombra; tolera bien la sombra parcial.',
      suelo: 'Fértil y con humedad constante, sin encharcarse.',
      riego: 'Regular y moderado; no dejar que se seque por completo.',
      propagacion: 'Esquejes, división de matas o estolones; se expande con facilidad.',
    },
    sabiasQue:
      'A diferencia de la menta piperita, cuyo aroma domina el mentol, la hierbabuena debe su sabor al carvona: por eso es más suave y menos fresca en boca.',
    fuentes: ['ema', 'who', 'kew', 'medlineplus'],
    imagen: 'hierbabuena',
    wikipedia: 'Mentha spicata',
  },
  {
    id: 'jengibre',
    nombre: 'Jengibre',
    cientifico: 'Zingiber officinale Roscoe',
    familia: 'Zingiberaceae',
    categorias: ['digestivas', 'antiinflamatorias'],
    resumen:
      'Rizoma picante y cálido de uso extendido en la cocina y en la tradición para las náuseas y la digestión lenta.',
    descripcion:
      'Planta herbácea perenne con tallos falsos formados por las vainas de las hojas, que pueden alcanzar un metro. El rizoma —el tallo subterráneo— es amarillento por dentro, fibroso y de aroma penetrante. Las flores verdaderas, vistosas, se forman en espigas cortas.',
    distribucion:
      'Originaria del sudeste asiático; cultivada en regiones tropicales y subtropicales de Asia, África, América y Oceanía, con producción importante en China, India, Nigeria y Jamaica.',
    parteUsada: 'El rizoma fresco o seco, recolectado cuando la planta entra en reposo.',
    usosTradicionales: [
      'Infusión o cocido del rizoma para náuseas y malestar gástrico.',
      'Uso tradicional en mareos por movimiento y en las náuseas del embarazo.',
      'Condimento culinario para facilitar la digestión de comidas pesadas.',
      'Bebida caliente para molestias de garganta y uso externo en cataplasmas para dolores musculares leves.',
    ],
    evidencia: [
      {
        nivel: 'moderada',
        texto:
          'Diversas revisiones sistemáticas respaldan un efecto antiemético del jengibre en náuseas del embarazo, posoperatorias y por quimioterapia, con resultados variables según la dosis y la preparación. La EMA reconoce además el uso tradicional del rizoma para las náuseas y el mareo por movimiento.',
      },
      {
        nivel: 'moderada',
        texto: 'Existe evidencia moderada de alivio del dolor menstrual en algunos ensayos controlados.',
      },
      {
        nivel: 'preliminar',
        texto:
          'En artrosis y dolor musculoesquelético los resultados son preliminares y no permiten recomendarlo como tratamiento único.',
      },
    ],
    preparaciones: [
      'Infusión de 1 o 2 rodajas finas de rizoma fresco por taza, tapada de 5 a 10 minutos.',
      'Decocción: hervir el rizoma en trozos pequeños durante 10 a 15 minutos y colar.',
      'Polvo seco añadido a infusiones o alimentos, en pequeñas cantidades.',
    ],
    precauciones: [
      'Puede aumentar el riesgo de sangrado con anticoagulantes y antiagregantes.',
      'Precaución en cálculos biliares y en reflujo severo; puede causar ardor.',
      'En el embarazo, usar dosis moderadas y consultar antes de superar el uso alimentario.',
      'Los extractos concentrados pueden interactuar con medicamentos para la diabetes.',
    ],
    conservacion:
      'El rizoma fresco se conserva en la nevera envuelto durante varias semanas, o congelado rallado. La versión seca se guarda en polvo hermético, protegida de la luz y la humedad; mantiene el aroma unos 12 meses.',
    cultivo: {
      luz: 'Media sombra o sombra ligera; no soporta el sol directo intenso.',
      suelo: 'Rico en materia orgánica, profundo y con buen drenaje.',
      riego: 'Alto y constante; el suelo debe mantenerse húmedo, sin encharcar.',
      propagacion: 'Por trozos de rizoma con yemas, sembrados en primavera.',
    },
    sabiasQue:
      'Lo que se usa y se come es un tallo subterráneo llamado rizoma, no una raíz: por eso conserva yemas, anillos y brotes, como cualquier otro tallo de la planta.',
    fuentes: ['ema', 'who', 'nccih', 'cochrane'],
    imagen: 'jengibre',
    wikipedia: 'Zingiber officinale',
  },
  {
    id: 'curcuma',
    nombre: 'Cúrcuma',
    cientifico: 'Curcuma longa L.',
    familia: 'Zingiberaceae',
    categorias: ['antiinflamatorias', 'digestivas'],
    resumen:
      'Rizoma anaranjado de la India, base del curry y sujeto de una intensa investigación sobre su compuesto activo, la curcumina.',
    descripcion:
      'Planta herbácea tropical perenne con hojas grandes y erguidas de hasta un metro. El rizoma, de corte anaranjado intenso, presenta anillos y ramificaciones. El rizoma seco y molido es la especia que da color al curry. Las flores se forman en espigas con brácteas rosadas o amarillas.',
    distribucion:
      'Originaria del sur de Asia, especialmente de la India; cultivada en regiones cálidas y húmedas de Asia, África y América, y en menor medida en América tropical.',
    parteUsada: 'El rizoma fresco o seco, y los extractos estandarizados de curcuminoides.',
    usosTradicionales: [
      'Uso culinario y tradicional como especia antiinflamatoria en la medicina ayurvédica y china.',
      'Infusiones y cocidos para la digestión.',
      'Uso tradicional en molestias articulares y procesos inflamatorios.',
      'Pastas con agua o aceite para uso externo en la piel.',
    ],
    evidencia: [
      {
        nivel: 'preliminar',
        texto:
          'Varios ensayos pequeños exploran la curcumina en artrosis y dispepsia, con resultados dispares. La baja biodisponibilidad oral dificulta interpretar los efectos.',
      },
      {
        nivel: 'preliminar',
        texto:
          'La curcumina —el pigmento principal— ha sido estudiada en cientos de trabajos de laboratorio, pero los ensayos clínicos en personas presentan resultados inconsistentes. Los estudios describen actividad antiinflamatoria y antioxidante, lo que no equivale a beneficio clínico demostrado.',
      },
      {
        nivel: 'tradicional',
        texto:
          'La EMA recoge la cúrcuma como planta de uso tradicional para molestias digestivas. El uso culinario y digestivo está muy extendido en Asia; su eficacia terapéutica específica no está establecida.',
      },
    ],
    preparaciones: [
      'Uso culinario en guisos, arroces y bebidas, en polvo o rizoma fresco rallado.',
      'Infusión o decocción del rizoma seco; «leche dorada» tradicional como bebida aromática, sin pretensión terapéutica.',
      'Uso externo en pasta con agua o aceite.',
      'Extractos estandarizados solo bajo orientación profesional por su concentración.',
    ],
    precauciones: [
      'Los suplementos de curcumina se han asociado a casos raros de lesión hepática: evita dosis altas sin supervisión.',
      'Precaución en obstrucción de vías biliares y en cálculos biliares.',
      'Puede interactuar con anticoagulantes y con medicamentos metabolizados por el hígado.',
      'Evita dosis medicinales durante el embarazo y la lactancia, y los suplementos concentrados sin indicación profesional.',
    ],
    conservacion:
      'El rizoma fresco se guarda en la nevera varios días, protegido de la humedad, o congelado rallado. El polvo se conserva en frasco opaco, lejos del calor y la humedad: pierde color y aroma con la luz.',
    cultivo: {
      luz: 'Sombra o media sombra; requiere calor y humedad ambiental alta.',
      suelo: 'Profundo, rico en materia orgánica y bien drenado.',
      riego: 'Alto y regular durante la temporada de crecimiento.',
      propagacion: 'Por trozos de rizoma con yemas, al inicio de la estación cálida.',
    },
    sabiasQue:
      'Su aroma y su color se deben a los curcuminoides. La pimienta negra aumenta la absorción de la curcumina: estudios farmacocinéticos en personas han mostrado que la piperina eleva notablemente sus niveles en sangre, un dato útil en cocina, no un tratamiento.',
    fuentes: ['ema', 'who', 'nccih', 'pubmed'],
    imagen: 'curcuma',
    wikipedia: 'Curcuma longa',
  },
  {
    id: 'menta-piperita',
    nombre: 'Menta piperita',
    cientifico: 'Mentha × piperita L.',
    familia: 'Lamiaceae',
    categorias: ['digestivas', 'respiratorias', 'relajantes'],
    resumen:
      'Híbrido cultivado de menta, de aroma intenso por su mentol, con uno de los aceites esenciales mejor estudiados en trastornos digestivos.',
    descripcion:
      'Hierba perenne estéril, híbrido entre la menta acuática y la menta verde, con tallos rectos y cuadrangulares, hojas ovaladas dentadas y flores lilas en espigas. Su aroma es más intenso y fresco que el de la hierbabuena. Se reproduce por estolones, no por semilla.',
    distribucion:
      'Originaria de Europa; cultivada hoy en Europa, América y Asia, en zonas templadas húmedas de todo el mundo.',
    parteUsada: 'Las hojas y sumidades floridas, y el aceite esencial, rico en mentol y mentona, obtenido por destilación.',
    usosTradicionales: [
      'Infusión paradigestión, gases y espasmos intestinales leves.',
      'Alivio de náuseas y sensación de plenitud.',
      'Aceite esencial encapsulado, tradicionalmente usado en adultos con síndrome de intestino irritable.',
      'Vahos para la congestión nasal leve y aceite diluido en sienes para el dolor de cabeza tensional.',
    ],
    evidencia: [
      {
        nivel: 'moderada',
        texto:
          'El aceite de menta con recubrimiento entérico ha mostrado en varios ensayos y revisiones un beneficio moderado sobre el dolor abdominal en el síndrome del intestino irritable. La hoja de menta piperita está recogida por la EMA como planta de uso tradicional en molestias digestivas leves.',
      },
      {
        nivel: 'preliminar',
        texto:
          'La aplicación tópica de aceite de menta diluido puede aliviar el dolor de cabeza tensional en algunos estudios pequeños.',
      },
      {
        nivel: 'preliminar',
        texto: 'En dispepsia funcional los resultados son limitados y no concluyentes.',
      },
    ],
    preparaciones: [
      'Infusión de una cucharadita de hojas secas por taza, tapada de 5 a 10 minutos.',
      'Aceite esencial diluido al 1-2 % en aceite portador para uso externo.',
      'Cápsulas entéricas de aceite esencial solo bajo indicación profesional.',
    ],
    precauciones: [
      'Puede empeorar el reflujo gastroesofágico, la hernia de hiato y la acidez en personas sensibles.',
      'Precaución en obstrucción biliar y en cálculos biliares.',
      'No aplicar mentol en la cara de bebés y niños pequeños por riesgo de apnea refleja.',
      'El aceite esencial puro es irritante y no debe ingerirse sin supervisión.',
      'Precaución en embarazo y lactancia sin consulta previa, y si tomas medicamentos de forma continuada, ya que el aceite esencial puede alterar su absorción.',
    ],
    conservacion:
      'Secar las hojas a la sombra y guardarlas en frasco hermético y oscuro hasta 12 meses. El aceite esencial debe conservarse bien cerrado, en frasco de cristal oscuro, fuera del alcance de los niños y sin superar su fecha de consumo preferente.',
    cultivo: {
      luz: 'Sol directo o media sombra; evita el calor extremo seco.',
      suelo: 'Fértil y con humedad estable, de buen drenaje.',
      riego: 'Constante y moderado; no tolera la sequía prolongada.',
      propagacion: 'Estolones, esquejes o división de matas; es muy invasora en jardín.',
    },
    sabiasQue:
      'La menta piperita es un híbrido estéril entre la menta de agua y la hierbabuena: en muchos jardines solo sobrevive si se propaga por estolones, porque no produce semillas viables.',
    fuentes: ['ema', 'who', 'nccih', 'cochrane'],
    imagen: 'menta-piperita',
    wikipedia: 'Peppermint',
  },
  {
    id: 'eucalipto',
    nombre: 'Eucalipto',
    cientifico: 'Eucalyptus globulus Labill.',
    familia: 'Myrtaceae',
    categorias: ['respiratorias'],
    resumen:
      'Árbol alto de hojas aromáticas ricas en 1,8-cineol, tradicionalmente usado en vapores e infusiones para despejar las vías respiratorias.',
    descripcion:
      'Árbol perenne de crecimiento rápido y porte alto, con corteza desprendible en bandas y hojas dimorfas: juveniles ovaladas y adultas lanceoladas y colgantes, glaucas y aromáticas. Las flores, con abundantes estambres blancos, preceden a frutos leñosos en forma de cápsula. Sus hojas contienen aceite esencial rico en 1,8-cineol (eucaliptol).',
    distribucion:
      'Originario del sureste de Australia y Tasmania; introducido en América, África y el sur de Europa, a menudo de forma invasora en zonas húmedas.',
    parteUsada: 'Las hojas adultas secas; el aceite esencial se obtiene por destilación.',
    usosTradicionales: [
      'Infusión de hojas para el resfriado común y la sensación de congestión.',
      'Vapores de las hojas o del aceite esencial para despejar la nariz.',
      'Friegas torácicas con aceite diluido en la tradición popular.',
      'Preparaciones comerciales con cineol para la tos y el catarro.',
    ],
    evidencia: [
      {
        nivel: 'moderada',
        texto:
          'La hoja de eucalipto está recogida por la EMA como planta de uso tradicional para la tos y el catarro asociados al resfriado común. El 1,8-cineol —su componente mayoritario— cuenta con ensayos clínicos en catarro y bronquitis que describen una mejoría modesta de los síntomas.',
      },
      {
        nivel: 'preliminar',
        texto:
          'Algunos estudios exploran el aceite de eucalipto en tos y bronquitis, con resultados limitados y riesgo de irritación. La infusión de hojas en sí misma no ha sido ampliamente estudiada.',
      },
      {
        nivel: 'tradicional',
        texto:
          'El uso en vapores para resfriados está documentado en la tradición de Europa meridional y América Latina; no sustituye la valoración de una infección respiratoria.',
      },
    ],
    preparaciones: [
      'Infusión de 1 o 2 hojas secas por taza, tapada de 5 a 10 minutos; filtrada, con sabor fuerte.',
      'Vapores: unas hojas o unas gotas de aceite esencial en agua caliente, inhalando a distancia y con precaución.',
      'Fricción torácica con aceite esencial diluido al 1-3 % en aceite portador.',
    ],
    precauciones: [
      'El aceite esencial no debe ingerirse: es tóxico en dosis pequeñas, especialmente para los niños.',
      'No usar eucaliptol en la cara de menores de 2 años por riesgo de espasmo respiratorio.',
      'Evitar en asma mal controlada y en personas con alergia a la familia Myrtaceae.',
      'No aplicar aceite esencial puro sobre la piel ni en mucosas.',
      'Ante dificultad respiratoria, fiebre alta o dolor torácico, acude al servicio de salud: no es una situación para automedicarse.',
    ],
    conservacion:
      'Secar las hojas adultas en manojos, en lugar ventilado y sin luz directa. Conservar en bolsas o frascos herméticos y etiquetados; el aroma se mantiene varios meses. El aceite esencial debe guardarse tapado y lejos del calor.',
    cultivo: {
      luz: 'Pleno sol; necesita espacio y buena ventilación.',
      suelo: 'Tolera suelos pobres, siempre que drenen bien.',
      riego: 'Bajo una vez adulto; joven requiere riegos moderados.',
      propagacion: 'Por semilla, con germinación irregular en muchas especies.',
    },
    sabiasQue:
      'Las hojas adultas cuelgan hacia abajo para recibir el sol de las horas más suaves y reducir la pérdida de agua, una adaptación a los climas áridos de su origen australiano.',
    fuentes: ['ema', 'who', 'nccih', 'kew'],
    imagen: 'eucalipto',
    wikipedia: 'Eucalyptus globulus',
  },
  {
    id: 'calendula',
    nombre: 'Caléndula',
    cientifico: 'Calendula officinalis L.',
    familia: 'Asteraceae',
    categorias: ['piel', 'antiinflamatorias'],
    resumen:
      'Flor naranja de jardín, tradicionalmente presente en ungüentos y lavados para la piel irritada o lastimada.',
    descripcion:
      'Hierba anual o bienal de 30 a 60 cm, con hojas lanceoladas, suaves y algo pegajosas, y cabezillas con pétalos naranjas, amarillos o cremosos. Florece durante buena parte del año en climas templados. Sus frutos son curvados y con ganchos que se enganchan a la ropa y al pelaje.',
    distribucion:
      'Originaria del sur de Europa y Asia Menor (cuenca mediterránea); cultivada como ornamental en todo el mundo y frecuente en huertos y jardines.',
    parteUsada: 'Los capítulos florales y pétalos, frescos o secos, recolectados en plena floración.',
    usosTradicionales: [
      'Lavados, compresas y pomadas sobre piel irritada, cortes leves, roces y heridas superficiales.',
      'Ungüentos y cremas tradicionales para la piel seca y agrietada.',
      'Gárgaras y enjuagues bucales de uso tradicional en molestias de boca y garganta.',
      'Infusión suave de uso externo en la tradición cosmética.',
    ],
    evidencia: [
      {
        nivel: 'preliminar',
        texto:
          'Estudios pequeños y revisiones sugieren posible beneficio en la cicatrización de heridas superficiales y en la dermatitis, con evidencia limitada y heterogénea.',
      },
      {
        nivel: 'tradicional',
        texto:
          'La EMA reconoce el uso tradicional de las flores en pequeñas inflamaciones de la piel y como coadyuvante en la cicatrización; se trata de un uso tradicional aceptado, no de eficacia probada en todos los contextos.',
      },
      {
        nivel: 'preliminar',
        texto: 'El uso en mucositis oral y radiodermatitis se ha estudiado con resultados variables.',
      },
    ],
    preparaciones: [
      'Infusión templada para lavados y compresas: una cucharada de flores secas por taza.',
      'Macerado oleoso de las flores, base de ungüentos caseros.',
      'Cataplasma de flores frescas machacadas.',
      'Enjuague bucal diluido, sin tragar.',
    ],
    precauciones: [
      'Evitar en alérgicos a la familia Asteraceae (ambrosía, manzanilla, artemisa).',
      'No aplicar sobre heridas profundas, infectadas o con sangrado activo sin valoración médica.',
      'El uso oral prolongado no está recomendado en el embarazo y la lactancia sin consulta.',
      'Puede interactuar con sedantes si se ingiere en grandes cantidades; el uso tópico no plantea ese riesgo.',
      'Si aparece enrojecimiento o picazón, suspende el uso.',
    ],
    conservacion:
      'Cosechar las flores en un día soleado y secarlas a la sombra, extendidas en una capa fina. Guardar en frasco opaco, oscuro y hermético: conservan color, aroma y propiedades unos 12 meses. Las pomadas caseras sin conservantes deben refrigerarse y duran pocos días.',
    cultivo: {
      luz: 'Pleno sol; tolera media sombra en climas muy cálidos.',
      suelo: 'Fértil y con buen drenaje; no exige suelos especiales.',
      riego: 'Moderado; no encharcar.',
      propagacion: 'Por semilla en otoño o primavera; se autosiembra con facilidad.',
    },
    sabiasQue:
      'Sus frutos están provistos de ganchos curvos: se enganchan al pelaje de los animales y a la ropa, un mecanismo de dispersión que le permite viajar largas distancias sin ayuda.',
    fuentes: ['ema', 'who', 'nccih', 'pubmed'],
    imagen: 'calendula',
    wikipedia: 'Calendula officinalis',
  },
{
    id: 'lavanda',
    nombre: 'Lavanda',
    cientifico: 'Lavandula angustifolia Mill.',
    familia: 'Lamiaceae',
    categorias: ['relajantes', 'piel'],
    resumen:
      'Arbustito mediterráneo de espigas violetas, célebre por su aroma asociado en muchas tradiciones a la calma y el descanso.',
    descripcion:
      'Subarbusto perenne leñoso de unos 60 cm, con hojas estrechas y grisáceas, muy aromáticas al frotarlas, y espigas de flores violeta en los extremos de los tallos. Pertenece a la familia de las labiadas, de tallos cuadrados. Prefiere suelos secos, pobres y soleados.',
    distribucion:
      'Originaria de la región mediterránea occidental; cultivada con intensidad en Provenza (Francia), España, Italia, Europa y otras zonas templadas.',
    parteUsada: 'Las espigas y sumidades florales en plena floración; el aceite esencial se obtiene por destilación de la parte aérea.',
    usosTradicionales: [
      'Infusión de las espigas para la tensión nerviosa y el descanso nocturno.',
      'Aromaterapia: difusión del aceite esencial en el ambiente antes de dormir.',
      'Aceite diluido en aceite portador para masajes suaves y cuidado de la piel.',
      'Almohadillas y saquitos de flores secas en el armario y la ropa de cama.',
    ],
    evidencia: [
      {
        nivel: 'moderada',
        texto:
          'El aceite esencial de lavanda estandarizado por vía oral ha mostrado en ensayos controlados reducción de síntomas de ansiedad, con un perfil de efectos adversos generalmente leve.',
      },
      {
        nivel: 'preliminar',
        texto:
          'Los ensayos con infusión son escasos, de tamaño pequeño y con resultados heterogéneos. Los estudios sobre sueño y aromaterapia son igualmente heterogéneos; parte del efecto observado puede relacionarse con el contexto relajante y las expectativas.',
      },
      {
        nivel: 'tradicional',
        texto:
          'El uso tradicional de la lavanda para la tensión mental leve y las dificultades del sueño está ampliamente recogido en monografías herbales europeas, y el uso de las flores en infusión y en preparados tópicos en la tradición mediterránea.',
      },
    ],
    preparaciones: [
      'Infusión de una cucharadita de espigas secas por taza, tapada de 5 a 10 minutos.',
      'Aceite esencial en difusor ambiental (nunca ingerido).',
      'Aceite esencial diluido al 1-2 % en aceite portador para masajes suaves.',
      'Saquito de flores secas junto a la almohada o en el armario.',
    ],
    precauciones: [
      'El aceite esencial no se ingiere y no se aplica puro sobre la piel: debe diluirse en un aceite portador.',
      'Puede sensibilizar y provocar irritación. Evita el contacto con los ojos.',
      'Puede potenciar el efecto de sedantes y del alcohol.',
      'Durante el embarazo y en niños pequeños, usar solo las flores en infusión y consultar antes; evita los suplementos orales en el embarazo, la lactancia y en menores.',
    ],
    conservacion:
      'Cosechar al comienzo de la floración y secar en manojos colgados, en lugar ventilado y protegido de la luz. Conservar en frasco hermético: el aroma se mantiene mejor si no se tritura hasta el momento de usarla.',
    cultivo: {
      luz: 'Pleno sol; es la clave para que produzca aroma.',
      suelo: 'Pobre, calizo y muy drenado; soporta la sequía.',
      riego: 'Bajo una vez arraigada; el exceso de agua la enferma.',
      propagacion: 'Semilla, esquejes semileñosos o división de matas.',
    },
    sabiasQue:
      'Su nombre proviene del latín lavare (lavar): los romanos añadían lavanda al agua de los baños, origen del uso que aún hoy tiene en jabones y detergentes.',
    fuentes: ['ema', 'who', 'nccih', 'cochrane'],
    imagen: 'lavanda',
    wikipedia: 'Lavandula angustifolia',
  },
  {
    id: 'ajo',
    nombre: 'Ajo',
    cientifico: 'Allium sativum L.',
    familia: 'Amaryllidaceae',
    categorias: ['vitalidad', 'inmunitarias', 'antiinflamatorias'],
    resumen:
      'Bulbo compartido en dientes, condimento universal y planta de uso tradicional muy antiguo en diversas medicinas.',
    descripcion:
      'Planta bulbosa perenne formada por dientes (bulbilos) envueltos en una túnica blanca o violácea. Las hojas son planas, largas y cerosas, y la escapo floral termina en una espiga con bulbilos aéreos y flores blancas poco frecuentes. Al machacarlo se libera alicina, compuesto azufrado responsable de su olor.',
    distribucion:
      'Originario del centro de Asia; cultivado en todo el mundo como alimento y planta medicinal, con gran producción en China, India y el sur de Europa.',
    parteUsada: 'El bulbo fresco o seco, formado por los dientes, o sus extractos y polvos estandarizados.',
    usosTradicionales: [
      'Uso culinario diario en prácticamente todas las cocinas del mundo.',
      'Tradición europea y asiática de consumo para el cuidado cardiovascular y las defensas.',
      'Consumo tradicional en crudo o en infusiones para «purificar la sangre».',
      'Preparados tradicionales con ajo crudo para molestias digestivas leves.',
    ],
    evidencia: [
      {
        nivel: 'moderada',
        texto:
          'Revisiones sistemáticas sugieren reducciones modestas de la presión arterial y del colesterol LDL en algunas personas, con efectos variables y estudios de calidad diversa. Monografías europeas de uso tradicional recogen el ajo para el colesterol elevado de grado leve.',
      },
      {
        nivel: 'preliminar',
        texto:
          'El efecto antimicrobiano de la alicina está bien descrito in vitro, pero su traducción a beneficios clínicos es limitada.',
      },
      {
        nivel: 'tradicional',
        texto:
          'El uso alimentario y medicinal está documentado desde antiguo en el Mediterráneo y Asia; la evidencia no respalda su uso como sustituto de fármacos antihipertensivos.',
      },
    ],
    preparaciones: [
      'Crudo, machacado y reposado unos minutos antes de añadirlo a la comida.',
      'Cocinado o asado como condimento habitual.',
      'Extractos secos y aceite de ajo en cápsulas, con concentraciones muy variables.',
      'No se recomienda preparar «aceite de ajo casero» conservado a temperatura ambiente por riesgo de botulismo.',
    ],
    precauciones: [
      'Puede aumentar el riesgo de sangrado con anticoagulantes, antiagregantes y antes de cirugía: coméntalo antes de una intervención.',
      'Puede causar ardor, reflujo y molestias digestivas, especialmente en ayunas.',
      'Si tomas antidiabéticos, vigila la glucemia: los efectos combinados no están bien establecidos.',
      'Evita suplementos concentrados en el embarazo, la lactancia y en niños sin consulta.',
    ],
    conservacion:
      'Los bulbos enteros se conservan en un lugar seco, fresco y ventilado, lejos de la luz. El ajo pelado, refrigerado en recipiente cerrado, dura unos días: pelar justo antes de usar.',
    cultivo: {
      luz: 'Pleno sol.',
      suelo: 'Profundo, fresco, rico y bien drenado.',
      riego: 'Moderado y regular, reduciendo hacia la cosecha.',
      propagacion: 'Por dientes (clavos) plantados en otoño o primavera.',
    },
    sabiasQue:
      'El aroma no está en la célula intacta: el compuesto precursor (la aliína) y su enzima (la alinasa) están separados y solo se encuentran al machacar o cortar el diente, momento en que se forma la alicina.',
    fuentes: ['who', 'nccih', 'ema', 'cochrane'],
    imagen: 'ajo',
    wikipedia: 'Garlic',
  },
  {
    id: 'toronjil',
    nombre: 'Toronjil',
    cientifico: 'Melissa officinalis L.',
    familia: 'Lamiaceae',
    categorias: ['relajantes', 'digestivas'],
    resumen:
      'Hierba de aroma a limón, tradicionalmente usada en infusión para el nerviosismo leve y la digestión nerviosa.',
    descripcion:
      'Hierba perenne de porte rastrero, con tallos cuadrados, hojas opuestas ovaladas, dentadas y ásperas, de verde claro, y pequeñas flores blancas o amarillentas en las axilas. Al frotar las hojas se percibe un aroma intenso a limón. Florece en verano.',
    distribucion:
      'Originaria del sur de Europa y Asia occidental; naturalizada en América y otras regiones templadas, frecuente en huertos.',
    parteUsada: 'Las hojas aéreas frescas o secas, recolectadas antes de la floración, y el aceite esencial concentrado.',
    usosTradicionales: [
      'Infusión para el nerviosismo leve y las dificultades del sueño.',
      'Uso tradicional en la digestión acompañada de nervios o tensión.',
      'Compresas frías en la tradición popular para el herpes labial.',
      'Lavados y lociones de uso tradicional.',
    ],
    evidencia: [
      {
        nivel: 'preliminar',
        texto:
          'Estudios pequeños sugieren reducción de ansiedad y mejora del sueño con extractos estandarizados, pero las muestras son limitadas y los resultados no siempre se replican.',
      },
      {
        nivel: 'preliminar',
        texto:
          'La aplicación tópica de crema de melisa en herpes labial ha mostrado resultados prometedores en ensayos pequeños.',
      },
      {
        nivel: 'tradicional',
        texto:
          'Existen monografías de uso tradicional que recogen la hoja de toronjil para la tensión mental leve y los trastornos del sueño leves. El uso como digestivo y calmante suave está documentado en la tradición europea y latinoamericana.',
      },
    ],
    preparaciones: [
      'Infusión de una cucharadita de hojas secas o frescas por taza, tapada de 5 a 10 minutos.',
      'Infusión o macerado en frío para lociones y compresas externas.',
      'Extractos y cápsulas estandarizadas solo bajo orientación profesional.',
    ],
    precauciones: [
      'Puede producir somnolencia: evita el alcohol y no conduzcas si notas efecto sedante.',
      'Puede potenciar sedantes y alcohol; no la combines con otros sedantes sin consultar.',
      'Precaución en personas con hipotiroidismo o tratamiento con levotiroxina: se ha descrito posible interferencia.',
      'Si tomas anticoagulantes, consulta antes de un uso continuado.',
      'El aceite esencial debe usarse diluido y no ingerirse sin supervisión; evita los suplementos concentrados en el embarazo y la lactancia.',
    ],
    conservacion:
      'Secar las hojas rápidamente a la sombra, en una capa fina, para conservar el aroma. Guardar en frasco hermético y opaco, etiquetado con la fecha; el aroma se pierde rápido si se expone a la humedad.',
    cultivo: {
      luz: 'Sol suave o media sombra.',
      suelo: 'Fértil y con humedad regular.',
      riego: 'Moderado; no dejar que se seque del todo.',
      propagacion: 'Semilla, esquejes o división de matas; se resembrará sola en el huerto.',
    },
    sabiasQue:
      'Su aroma a limón se debe al citral, el mismo grupo de compuestos que dan aroma a la citronela y a la hierbaluisa, aunque pertenezcan a familias botánicas distintas.',
    fuentes: ['ema', 'who', 'nccih', 'pubmed'],
    imagen: 'toronjil',
    wikipedia: 'Melissa officinalis',
  },
  {
    id: 'tomillo',
    nombre: 'Tomillo',
    cientifico: 'Thymus vulgaris L.',
    familia: 'Lamiaceae',
    categorias: ['respiratorias', 'antiinflamatorias'],
    resumen:
      'Arbustito mediterráneo de hojas diminutas y aroma penetrante, clásico en infusiones para la tos y el resfriado.',
    descripcion:
      'Subarbusto rastrero o erguido de pocos centímetros, leñoso en la base, con hojas diminutas, lineares y muy aromáticas con los bordes enrollados, y flores rosadas o lilas agrupadas. Contiene timol y carvacrol en su aceite esencial.',
    distribucion:
      'Originario de la cuenca mediterránea occidental; naturalizado en América y otras regiones templadas y secas, cultivado en suelos secos y soleados.',
    parteUsada: 'Las sumidades florales (ramitas con hojas y flores), recolectadas en plena floración.',
    usosTradicionales: [
      'Infusión para la tos y el catarro del resfriado común.',
      'Vapores para la congestión respiratoria leve.',
      'Gárgaras y enjuagues tradicionales en molestias de boca y garganta.',
      'Uso culinario cotidiano y condimento en la cocina mediterránea.',
    ],
    evidencia: [
      {
        nivel: 'moderada',
        texto:
          'La EMA reconoce el uso tradicional de la infusión de tomillo en la tos asociada al resfriado común y en la bronquitis leve. El timol, su principio activo mayoritario, se emplea como antiséptico en enjuagues bucales comerciales.',
      },
      {
        nivel: 'preliminar',
        texto:
          'El timol y el carvacrol tienen actividad antimicrobiana in vitro; los ensayos clínicos con preparados de tomillo son pocos y de tamaño reducido.',
      },
      {
        nivel: 'preliminar',
        texto:
          'Algunos jarabes con extractos de tomillo y hiedra se han estudiado en tos infantil, con resultados moderados y bajo supervisión pediátrica.',
      },
    ],
    preparaciones: [
      'Infusión de una cucharadita de sumidades secas por taza, tapada de 5 a 10 minutos, y colada.',
      'Decocción breve para inhalaciones de vapor (con precaución).',
      'Vapores con hojas o aceite esencial diluido en agua caliente.',
      'Gárgaras con la infusión templada, nunca tragada.',
    ],
    precauciones: [
      'El aceite esencial es muy concentrado y no debe ingerirse ni aplicarse puro: puede irritar piel y mucosas.',
      'Evita en niños pequeños sin supervisión pediátrica, especialmente por vía oral.',
      'Precaución en el embarazo y la lactancia: consulta antes de usar extractos.',
      'Puede interactuar con anticoagulantes si se consumen grandes cantidades de extracto.',
      'Ante dificultad respiratoria o fiebre alta, acude al servicio de salud.',
    ],
    conservacion:
      'Secar las ramitas en manojos, colgadas en lugar ventilado y sin sol directo. Guardar en frasco hermético: mantiene el aroma durante un año aproximadamente. El tomillo fresco se conserva envuelto en papel en la nevera unos días.',
    cultivo: {
      luz: 'Pleno sol.',
      suelo: 'Pobre y muy drenado; no tolera el encharcamiento.',
      riego: 'Bajo; tolera muy bien la sequía.',
      propagacion: 'Semilla, esquejes o estacas leñosas.',
    },
    sabiasQue:
      'El timol, compuesto del que toma su nombre, se usa como antiséptico en enjuagues bucales comerciales: es uno de los pocos componentes de plantas con uso antibacteriano reconocido y ampliamente difundido.',
    fuentes: ['ema', 'who', 'nccih', 'kew'],
    imagen: 'tomillo',
    wikipedia: 'Thymus vulgaris',
  },
  {
    id: 'ginseng',
    nombre: 'Ginseng',
    cientifico: 'Panax ginseng C.A.Mey.',
    familia: 'Araliaceae',
    categorias: ['vitalidad'],
    resumen:
      'Raíz de crecimiento lentísimo, celebrada en Asia como tónico de la vitalidad y sujeto de décadas de investigación.',
    descripcion:
      'Planta herbácea perenne muy lenta, de crecimiento lento, con un tallo único del que brotan varias hojas palmadas en abanico. La raíz principal es carnosa, ramificada y a veces recuerda a una figura humana, origen de su nombre. Las flores dan frutos rojos que maduran a final de verano. Las raíces de varios años se secan o se procesan al vapor para obtener el «ginseng rojo».',
    distribucion:
      'Nativa de bosques templados del noreste de Asia (China, Corea y Siberia oriental). Se cultiva intensivamente en condiciones de sombra, lo que ha reducido las poblaciones silvestres.',
    parteUsada: 'La raíz principal, seca o procesada al vapor, y extractos estandarizados de ginsenósidos.',
    usosTradicionales: [
      'Tónico tradicional chino y coreano para la fatiga y la falta de vigor.',
      'Uso en la medicina tradicional china como adaptógeno, para sostener la concentración y el rendimiento físico.',
      'Infusión de raíz en ceremonias y cuidados cotidianos en Asia.',
      'Uso culinario ocasional en caldos y bebidas tradicionales.',
    ],
    evidencia: [
      {
        nivel: 'preliminar',
        texto:
          'Los ensayos clínicos con preparados estandarizados de ginseng describen mejorías modestas y no siempre replicables en fatiga percibida, función cognitiva y control de la glucosa. Las revisiones sistemáticas señalan alta heterogeneidad y riesgo de sesgo, y varios estudios no encuentran diferencias frente al placebo.',
      },
      {
        nivel: 'preliminar',
        texto:
          'La calidad y composición de los extractos varía mucho entre productos, lo que dificulta comparar resultados.',
      },
      {
        nivel: 'tradicional',
        texto:
          'El uso como tónico está documentado en la medicina tradicional del este de Asia desde hace siglos, sin que ello implique eficacia demostrada para enfermedades.',
      },
    ],
    preparaciones: [
      'Infusión o decocción de la raíz seca en trozos, de sabor amargo.',
      'Extractos y cápsulas estandarizadas, con dosis variables.',
      'Uso culinario en caldos y bebidas tradicionales.',
    ],
    precauciones: [
      'Puede interactuar con anticoagulantes, antidiabéticos y estimulantes: consulta siempre antes de usarlo de forma continuada.',
      'Se han descrito insomnio, nerviosismo, dolor de cabeza y molestias digestivas.',
      'Precaución en hipertensión no controlada y en trastornos hormono-dependientes.',
      'Si tomas medicamentos para la glucosa o la presión, vigila con especial atención.',
      'Evita en el embarazo, la lactancia y en niños sin indicación profesional.',
    ],
    conservacion:
      'La raíz seca se guarda entera, en lugar fresco y seco y protegida de la luz, hasta 2 años. Los extractos líquidos se conservan según la indicación del fabricante.',
    cultivo: {
      luz: 'Sombra densa (70 a 80 %): imita el sotobosque de su origen.',
      suelo: 'Rico, profundo, con buena materia orgánica y drenaje perfecto.',
      riego: 'Humedad estable, sin encharcamiento; sensible a la sequía.',
      propagacion: 'Semilla con estratificación lenta (puede tardar más de un año en germinar).',
    },
    sabiasQue:
      'Su nombre científico Panax viene del griego panakes («que lo cura todo»); en la naturaleza, su raíz puede tardar entre cuatro y seis años en alcanzar el tamaño comercial, lo que explica su precio y la presión sobre las poblaciones silvestres.',
    fuentes: ['who', 'nccih', 'ema', 'kew'],
    imagen: 'ginseng',
    wikipedia: 'Panax ginseng',
  },
  {
    id: 'valeriana',
    nombre: 'Valeriana',
    cientifico: 'Valeriana officinalis L.',
    familia: 'Caprifoliaceae',
    categorias: ['relajantes'],
    resumen:
      'Raíz de olor fuerte al secarse, usada tradicionalmente para conciliar el sueño y calmar la tensión nerviosa.',
    descripcion:
      'Hierba perenne de tallo erguido y hueco, hojas opuestas y pinnadas, y flores diminutas rosadas o blancas en umbelas o corimbos. La raíz y el rizoma, de color pardo amarillento, desarrollan un olor característico y penetrante al secarse.',
    distribucion:
      'Nativa de Europa y Asia templada; también presente en Norteamérica. Crece en praderas húmedas, márgenes de ríos y claros de bosque.',
    parteUsada: 'El rizoma y las raíces, recolectados en otoño del primer año o al segundo.',
    usosTradicionales: [
      'Infusión o preparado de la raíz para las dificultades del sueño.',
      'Uso tradicional para la tensión nerviosa y la inquietud.',
      'Baños relajantes de uso tradicional y para los dolores de cabeza tensionales.',
    ],
    evidencia: [
      {
        nivel: 'moderada',
        texto:
          'Varias revisiones sistemáticas encuentran un efecto modesto sobre la latencia del sueño y la calidad subjetiva, aunque los estudios son heterogéneos y algunos no muestran beneficio. La EMA reconoce el uso tradicional de la raíz para el alivio de la tensión nerviosa leve y como ayuda para dormir.',
      },
      {
        nivel: 'preliminar',
        texto: 'Los resultados en ansiedad son menos consistentes que en sueño.',
      },
      {
        nivel: 'tradicional',
        texto:
          'Las monografías europeas recogen la valeriana como planta de uso tradicional para la tensión nerviosa leve y las dificultades del sueño leves. No se publica evidencia concluyente para ninguna de ellas.',
      },
    ],
    preparaciones: [
      'Infusión de 1 o 2 g de raíz seca por taza, tapada durante 10 a 15 minutos, o en frío durante la noche.',
      'Extracto seco o líquido y cápsulas comerciales según el fabricante.',
      'Tinturas alcohólicas diluidas en agua.',
    ],
    precauciones: [
      'Puede causar somnolencia: no conduzcas ni operes maquinaria tras su consumo.',
      'No la combines con alcohol, sedantes o hipnóticos (benzodiacepinas, antihistamínicos) sin supervisión médica.',
      'Suspende su uso con antelación a una intervención quirúrgica.',
      'Se han descrito casos raros de toxicidad hepática: suspende ante síntomas y consulta.',
      'Evita en el embarazo, la lactancia y en menores de 12 años sin consulta.',
    ],
    conservacion:
      'Secar la raíz en espesores finos, en lugar ventilado y oscuro, hasta que quede quebradiza. Conservar en frasco hermético y opaco: mantiene su aroma varios años si está bien seca.',
    cultivo: {
      luz: 'Sol o media sombra.',
      suelo: 'Húmedo, rico y bien drenado.',
      riego: 'Regular; no tolera la sequía prolongada.',
      propagacion: 'Semilla o división de matas en primavera.',
    },
    sabiasQue:
      'Su nombre proviene del latín valere («estar fuerte»), y su aroma poco agradable al secar es lo que ha hecho que se la asocie históricamente con gatos: solo algunos de sus compuestos sedan a los felinos.',
    fuentes: ['ema', 'who', 'nccih', 'cochrane'],
    imagen: 'valeriana',
    wikipedia: 'Valeriana officinalis',
  },
  {
    id: 'albahaca-sagrada',
    nombre: 'Albahaca sagrada',
    cientifico: 'Ocimum tenuiflorum L.',
    familia: 'Lamiaceae',
    categorias: ['relajantes', 'vitalidad', 'inmunitarias'],
    resumen:
      'La tulsi de la tradición ayurvédica: arbustito aromático de hojas pequeñas cultivado junto a las casas en la India.',
    descripcion:
      'Subarbusto aromático de 30 a 60 cm, con tallos cuadrados a menudo violáceos, hojas pequeñas ovaladas, ligeramente pubescentes, y flores diminutas agrupadas en racimos erguidos. Todo el conjunto desprende aroma intenso al frotarlo.',
    distribucion:
      'Originaria del centro de la India y el sudeste asiático; cultivada en jardines y patios de toda Asia tropical y en climas cálidos de América.',
    parteUsada: 'Las hojas y sumidades floridas, frescas o secas.',
    usosTradicionales: [
      'Infusión diaria en la tradición ayurvédica, donde se la conoce como tulsi.',
      'Uso tradicional en molestias respiratorias leves y en situaciones de estrés.',
      'Uso tradicional en resfriados y en la digestión.',
      'Hojas frescas en la cocina y en ofrendas culturales.',
    ],
    evidencia: [
      {
        nivel: 'preliminar',
        texto:
          'Existen ensayos clínicos pequeños con preparados de albahaca sagrada que describen mejorías modestas en estrés percibido, síntomas respiratorios leves y control de la glucosa. Las muestras son reducidas y los estudios heterogéneos.',
      },
      {
        nivel: 'preliminar',
        texto:
          'La actividad antioxidante y antimicrobiana se ha descrito in vitro; su relevancia en personas no está establecida.',
      },
      {
        nivel: 'tradicional',
        texto:
          'El uso ritual y medicinal está profundamente documentado en la tradición ayurvédica; se presenta aquí como saber tradicional, no como tratamiento validado.',
      },
    ],
    preparaciones: [
      'Infusión de una cucharadita de hojas secas o de 5 a 8 hojas frescas por taza, tapada 5 minutos.',
      'Hojas frescas añadidas a bebidas y alimentos.',
      'Extractos comerciales estandarizados solo bajo orientación profesional.',
    ],
    precauciones: [
      'Puede reducir la glucosa y aumentar el riesgo de sangrado: precaución en diabetes, con antidiabéticos y con anticoagulantes.',
      'Se ha descrito posible efecto sobre la fertilidad en estudios animales con dosis altas: evita suplementos en quienes buscan embarazo.',
      'Precaución en hipertiroidismo.',
      'Evita dosis medicinales durante el embarazo y la lactancia sin consulta, y mantén el aceite esencial fuera del alcance de los niños.',
    ],
    conservacion:
      'Secar las hojas a la sombra, en lugar ventilado, y guardarlas en frasco hermético y opaco, etiquetado con la fecha de recolección. Las hojas frescas se conservan pocos días refrigeradas.',
    cultivo: {
      luz: 'Pleno sol o sol de la mañana.',
      suelo: 'Fértil y con buen drenaje.',
      riego: 'Moderado; dejar secar la superficie entre riegos.',
      propagacion: 'Por semilla al inicio del calor; también por esquejes.',
    },
    sabiasQue:
      'En sánscrito se la llama tulsi, «la incomparable»: se considera planta sagrada en el hinduismo y todavía hoy se cultiva en patios y templos de la India.',
    fuentes: ['who', 'nccih', 'pubmed', 'kew'],
    imagen: 'albahaca-sagrada',
    wikipedia: 'Ocimum tenuiflorum',
  },
  {
    id: 'llanten',
    nombre: 'Llantén',
    cientifico: 'Plantago major L.',
    familia: 'Plantaginaceae',
    categorias: ['piel', 'respiratorias'],
    resumen:
      'Hojas de nervios marcados que crecen pegadas al suelo pisado, de uso tradicional en garganta y sobre la piel.',
    descripcion:
      'Roseta basal con hojas anchas, ovaladas y de nervadura paralela muy marcada, sostenidas por largos pecíolos. Los tallos, sin hojas, terminan en espigas densas de flores diminutas y verdosas, seguidas de cápsulas con numerosas semillas. Sus hojas soportan el pisado por su nervadura resistente.',
    distribucion:
      'Nativa de Europa y Asia; actualmente cosmopolita. Tolera suelos compactados y muy pisados: es común en caminos, plazas y bordes de acera.',
    parteUsada: 'Las hojas frescas o secas; las semillas, ricas en mucílago, se usan tradicionalmente.',
    usosTradicionales: [
      'Hojas frescas machacadas aplicadas sobre cortes, roces y picaduras de insectos.',
      'Infusión o jarabe tradicional para la tos y las molestias de garganta.',
      'Uso tradicional en la piel irritada y en las quemaduras leves.',
      'Semillas remojadas como laxante suave en algunas tradiciones.',
    ],
    evidencia: [
      {
        nivel: 'preliminar',
        texto:
          'Estudios pequeños sugieren posible beneficio de extractos de llantén en irritaciones de piel y mucosas. Los estudios de laboratorio describen actividad antimicrobiana, antiinflamatoria y cicatrizante, pero faltan ensayos clínicos bien diseñados en personas.',
      },
      {
        nivel: 'tradicional',
        texto:
          'El uso emoliente y demulcente de las hojas está documentado en la tradición europea; la EMA evalúa preparados de llantén para irritaciones respiratorias leves.',
      },
      {
        nivel: 'preliminar',
        texto:
          'Las semillas, ricas en mucílagos, tienen efecto laxante de tipo formador de masa; requieren abundante agua.',
      },
    ],
    preparaciones: [
      'Cataplasma de hoja fresca bien lavada y machacada sobre piel intacta.',
      'Infusión de una cucharadita de hojas secas por taza, tapada 10 minutos.',
      'Jarabe tradicional con la infusión concentrada y miel (uso casero, no terapéutico; no para menores de 1 año).',
    ],
    precauciones: [
      'Lavar bien las hojas recolectadas: crece en suelos urbanos que pueden contener residuos o metales; evita hojas de plantas silvestres contaminadas por pesticidas, animales o tráfico.',
      'No aplicar sobre heridas profundas, abiertas o infectadas: acude al equipo de salud en lugar de automedicarte.',
      'Las semillas mucilaginosas requieren mucha agua y están contraindicadas en obstrucción intestinal.',
      'Puede reducir la absorción de medicamentos orales si se toma al mismo tiempo: separa las tomas al menos 2 horas.',
      'Puede haber sensibilidad cruzada en personas alérgicas a Plantaginaceae.',
    ],
    conservacion:
      'Secar las hojas entre papel absorbente, en lugar ventilado, hasta que estén quebradizas; las semillas, en sobres de papel debidamente etiquetados.',
    cultivo: {
      luz: 'Sol o media sombra; tolera bien la sombra urbana.',
      suelo: 'Cualquiera, incluso compactado; prefiere con humedad.',
      riego: 'Moderado; crece sin riego en suelos frescos.',
      propagacion: 'Por semilla, muy abundante y de germinación rápida.',
    },
    sabiasQue:
      'Sus hojas soportan el pisado por su nervadura resistente y sus semillas se dispersan pegándose a los cascos y las suelas: por eso prospera justo en los caminos que más se pisan.',
    fuentes: ['ema', 'who', 'nccih', 'kew'],
    imagen: 'llanten',
    wikipedia: 'Plantago major',
  },
  {
    id: 'romero',
    nombre: 'Romero',
    cientifico: 'Salvia rosmarinus Spenn. (antes Rosmarinus officinalis)',
    familia: 'Lamiaceae',
    categorias: ['vitalidad', 'digestivas', 'antiinflamatorias'],
    resumen:
      'Arbusto mediterráneo de hojas en forma de aguja, aromático y resistente, tradicionalmente ligado a la memoria y la digestión.',
    descripcion:
      'Arbusto perenne de hojas estrechas, lineales y coriáceas, con el envés blanquecino y aroma intenso. Las flores, azuladas o violáceas, aparecen en primavera y son visitadas por abejas. Contiene aceite esencial rico en alcanfor, cineol y ácido rosmarínico.',
    distribucion:
      'Originario de la cuenca mediterránea; naturalizado en América y otras regiones templadas y secas, cultivado en huertos y jardines de todo el mundo. Tolera la calima, la sequía y los suelos pobres.',
    parteUsada: 'Las hojas y sumidades floridas, frescas o secas, y su aceite esencial.',
    usosTradicionales: [
      'Infusión o cocido tradicional para la digestión pesada.',
      'Uso culinario habitual con carnes y grasas.',
      'Uso externo en fricciones para musculatura cansada y para el dolor muscular.',
      'Enjuagues y lociones tradicionales para el cabello, y ramo aromático asociado a la memoria en la tradición europea.',
    ],
    evidencia: [
      {
        nivel: 'preliminar',
        texto:
          'Estudios pequeños sugieren posibles efectos sobre alerta y memoria con dosis bajas de aceite esencial, pero los resultados son inconsistentes y no permiten conclusiones firmes. Hay algunos estudios modestos sobre molestias digestivas y función cognitiva.',
      },
      {
        nivel: 'preliminar',
        texto:
          'Sus compuestos aromáticos (1,8-cineol, ácido carnósico, carnosol) han demostrado actividad antioxidante y antiinflamatoria en estudios de laboratorio. El uso tópico en caída del cabello y dolor muscular cuenta con evidencia limitada.',
      },
      {
        nivel: 'tradicional',
        texto:
          'El uso digestivo y circulatorio está ampliamente documentado en la tradición mediterránea; no hay evidencia de que mejore la memoria ni trate la dispepsia.',
      },
    ],
    preparaciones: [
      'Infusión de una cucharadita de hojas secas por taza, tapada de 5 a 10 minutos.',
      'Aceite esencial diluido al 1-2 % para masaje.',
      'Infusión fría para enjuagues capilares externos.',
      'Uso culinario fresco o seco, en pequeñas cantidades.',
    ],
    precauciones: [
      'El aceite esencial es rico en alcanfor: no lo ingieras ni lo apliques puro; en dosis altas puede causar convulsiones.',
      'No uses aceite esencial en la cara de niños pequeños.',
      'Evita dosis altas orales en el embarazo, la epilepsia y la hipertensión no controlada.',
      'Si tomas anticoagulantes, antidiabéticos o medicamentos que se metabolizan en el hígado, consulta antes de un uso medicinal continuado.',
      'Puede irritar la piel sensible: usa siempre diluido.',
    ],
    conservacion:
      'Secar las ramitas en manojos, colgadas en lugar ventilado y sin sol directo. Conservar en frasco hermético: el aroma se mantiene varios meses. El aceite esencial, en vidrio oscuro, lejos del calor.',
    cultivo: {
      luz: 'Pleno sol; es imprescindible para que produzca sus aceites.',
      suelo: 'Pobre y muy drenado; soporta la caliza y la sequía.',
      riego: 'Bajo; el exceso de agua provoca hongos.',
      propagacion: 'Semilla, esquejes semileñosos o estacas.',
    },
    sabiasQue:
      'Su nombre viene del latín ros marinus («rocío del mar»), por los bosquecillos costeros donde crece; en español conserva ese mismo origen en la palabra «romero».',
    fuentes: ['ema', 'who', 'nccih', 'kew'],
    imagen: 'romero',
    wikipedia: 'Rosmarinus officinalis',
  },
{
    id: 'limoncillo',
    nombre: 'Limoncillo',
    cientifico: 'Cymbopogon citratus (DC.) Stapf',
    familia: 'Poaceae',
    categorias: ['relajantes', 'digestivas'],
    resumen:
      'Hierba alta de aroma a limón, conocida como hierbaluisa, muy usada en infusiones y en la cocina del sudeste asiático.',
    descripcion:
      'Mata densa de tallos y hojas largas, estrechas y filosas, de color verde azulado, que pueden superar el metro. Al frotarlas desprende un aroma fuerte a limón debido al citral. Las flores son raras en cultivo, ya que se propaga por división.',
    distribucion:
      'Originaria del sur y sureste de Asia; cultivada en regiones tropicales y subtropicales de América, África y Asia, frecuente en huertos y macetas.',
    parteUsada: 'Las hojas frescas o secas, y el aceite esencial.',
    usosTradicionales: [
      'Infusión tradicional calmante y digestiva, muy popular en América Latina.',
      'Bebida aromática para acompañar las comidas y para el resfriado y la inquietud.',
      'Uso culinario en sopas y platos del sudeste asiático.',
      'Vahos con hojas para ambientar y refrescar.',
    ],
    evidencia: [
      {
        nivel: 'preliminar',
        texto:
          'Estudios pequeños y de laboratorio sugieren efectos ansiolíticos y sedantes suaves del extracto de hojas, pero la evidencia clínica es escasa. Los estudios preclínicos describen además actividad antioxidante, antibacteriana y posibles efectos sobre la glucosa y los lípidos.',
      },
      {
        nivel: 'tradicional',
        texto:
          'El uso como digestivo y calmante está ampliamente documentado en la tradición de América Latina y el sudeste asiático; no hay evidencia suficiente para afirmar beneficios en enfermedades.',
      },
      {
        nivel: 'preliminar',
        texto:
          'El citral y otros componentes tienen actividad antimicrobiana in vitro; su relevancia clínica no está establecida.',
      },
    ],
    preparaciones: [
      'Infusión de 1 o 2 hojas frescas, o una cucharadita de hojas secas, por taza, tapada 5 minutos.',
      'Decocción breve de hojas frescas para bebida aromática.',
      'Agua aromática por maceración en frío.',
      'Aceite esencial solo para uso externo diluido o ambientación.',
    ],
    precauciones: [
      'El aceite esencial es irritante y no debe ingerirse sin supervisión.',
      'Puede causar molestias digestivas en personas sensibles o en ayunas.',
      'Precaución en el embarazo y la lactancia: evita suplementos concentrados.',
      'Si tomas anticoagulantes o antidiabéticos, consulta antes de un uso continuado.',
      'No sustituyas el tratamiento del ansiedad o el insomnio persistentes.',
    ],
    conservacion:
      'Las hojas frescas se conservan refrigeradas unos días; las secas, en frasco hermético y opaco, unos 12 meses. También se congela fresca en porciones.',
    cultivo: {
      luz: 'Sol o media sombra; en trópico soporta media sombra.',
      suelo: 'Rico en materia orgánica y con humedad, de buen drenaje.',
      riego: 'Regular y abundante durante la temporada de crecimiento.',
      propagacion: 'División de matas; en ocasiones por semilla.',
    },
    sabiasQue:
      'Su aroma a limón se debe al citral, un compuesto que también está presente en la citronela: por eso se la usa de forma natural en repelentes artesanales.',
    fuentes: ['who', 'ema', 'nccih', 'kew'],
    imagen: 'limoncillo',
    wikipedia: 'Cymbopogon citratus',
  },
  {
    id: 'pasiflora',
    nombre: 'Pasiflora',
    cientifico: 'Passiflora incarnata L.',
    familia: 'Passifloraceae',
    categorias: ['relajantes'],
    resumen:
      'Trepadora de flores espectaculares, usada tradicionalmente en América para la inquietud y el sueño.',
    descripcion:
      'Planta trepadora perenne y vigorosa, con zarcillos en espiral, hojas trilobuladas en tres brazos y flores grandes con corona de filamentos morados o azules. Produce frutos ovoidos, la granadilla, aromáticos y comestibles. Las sumidades aéreas secas son la parte medicinal.',
    distribucion:
      'Nativa del sureste de Estados Unidos y de América tropical; cultivada en jardines de zonas templadas y subtropicales, y naturalizada en otras regiones templadas y cálidas.',
    parteUsada: 'Las sumidades aéreas (hojas, tallos y flores) secas, recolectadas en plena floración.',
    usosTradicionales: [
      'Infusión tradicional para la inquietud, el nerviosismo y las dificultades del sueño.',
      'Ayuda tradicional para conciliar el sueño.',
      'Uso popular en América Latina en situaciones de nerviosismo.',
      'Uso en dolores de cabeza tensionales en la tradición popular.',
    ],
    evidencia: [
      {
        nivel: 'preliminar',
        texto:
          'Ensayos pequeños sugieren reducción de ansiedad preoperatoria y mejora subjetiva del sueño; las revisiones señalan falta de estudios grandes y bien controlados.',
      },
      {
        nivel: 'preliminar',
        texto:
          'Los extractos combinados con otras plantas relajantes se han estudiado con resultados difíciles de atribuir a la pasiflora sola.',
      },
      {
        nivel: 'tradicional',
        texto:
          'La EMA reconoce el uso tradicional de las sumidades aéreas para el alivio de la tensión nerviosa leve y las dificultades del sueño leves.',
      },
    ],
    preparaciones: [
      'Infusión de 1 o 2 g de sumidades secas por taza, tapada 10 minutos.',
      'Extractos secos y tinturas, según indicación del fabricante.',
      'Cápsulas combinadas con otras plantas, solo bajo orientación profesional.',
    ],
    precauciones: [
      'Puede causar somnolencia: no conduzcas tras su consumo.',
      'Puede potenciar sedantes, hipnóticos y alcohol.',
      'Precaución en hipotensión y en personas que toman medicamentos para la presión.',
      'Evita en el embarazo y la lactancia sin consulta, y en niños solo bajo indicación profesional.',
    ],
    conservacion:
      'Secar las sumidades con flor rápidamente, a la sombra y en capas finas. Conservar en frasco hermético y opaco hasta 12 meses.',
    cultivo: {
      luz: 'Pleno sol o media sombra.',
      suelo: 'Fértil, húmedo y con buen drenaje.',
      riego: 'Moderado y regular durante la crecida.',
      propagacion: 'Semilla o esqueje; trepadora que necesita soporte.',
    },
    sabiasQue:
      'Su nombre viene de los misioneros españoles, que interpretaron cada parte de la flor como un símbolo de la Pasión de Cristo: los tres estigmas, los cinco pétalos, la corona de filamentos y los zarcillos.',
    fuentes: ['ema', 'who', 'nccih', 'cochrane'],
    imagen: 'pasiflora',
    wikipedia: 'Passiflora incarnata',
  },
  {
    id: 'hinojo',
    nombre: 'Hinojo',
    cientifico: 'Foeniculum vulgare Mill.',
    familia: 'Apiaceae',
    categorias: ['digestivas'],
    resumen:
      'Planta alta de sabor anisado cuyos frutos machacados son un clásico de las infusiones postprandiales.',
    descripcion:
      'Hierba bienal o perenne de 1 a 2 metros, con tallos lisos y cerosos, hojas divididas en finos hilos verdes y flores amarillas agrupadas en umbelas. Los frutos (semillas) maduros tienen aroma anisado por su contenido en anetol, y todo el aparato aromático tiene sabor y olor característicos a anís.',
    distribucion:
      'Originaria del Mediterráneo y Asia occidental; naturalizada y cultivada en zonas templadas y subtropicales de todo el mundo, frecuente en huertos y bordes de caminos.',
    parteUsada: 'Los frutos (semillas) maduros, ligeramente machacados; las hojas y la raíz se usan según la tradición local.',
    usosTradicionales: [
      'Infusión de frutos para la digestión pesada, los gases y la hinchazón.',
      'Uso tradicional en molestias gástricas puntuales de adultos y niños.',
      'Masticar semillas para refrescar el aliento.',
      'Uso culinario como especia y en licores tradicionales.',
    ],
    evidencia: [
      {
        nivel: 'tradicional',
        texto:
          'La EMA reconoce el uso tradicional de los frutos de hinojo en molestias digestivas leves, como gases y espasmos, y la flatulencia.',
      },
      {
        nivel: 'preliminar',
        texto:
          'Algunos ensayos pequeños sugieren alivio de cólicos infantiles con preparados de hinojo, pero los resultados son limitados y exigen supervisión pediátrica. Las preparaciones combinadas con hinojo han mostrado en algunos trabajos mejoría de síntomas digestivos, sin resultados concluyentes de forma aislada.',
      },
      {
        nivel: 'preliminar',
        texto:
          'El anetol tiene actividad antimicrobiana y relajante muscular in vitro; su traducción clínica es incierta.',
      },
    ],
    preparaciones: [
      'Infusión de una cucharadita de frutos ligeramente machacados por taza, tapada de 5 a 10 minutos.',
      'Decocción breve de los frutos.',
      'Semillas masticadas en pequeña cantidad tras las comidas.',
      'Aceite esencial solo para uso externo o industrial, nunca ingerido sin supervisión.',
    ],
    precauciones: [
      'El aceite esencial es rico en estragol y anetol: no lo ingieras ni lo uses en niños pequeños.',
      'Quien tiene alergia a Apiaceae (apio, zanahoria, apio-nabo, anís) puede reaccionar también al hinojo.',
      'Evita dosis altas y prolongadas de extractos, especialmente en menores y en el embarazo.',
      'En caso de obstrucción o cirugía digestiva reciente, no lo uses.',
      'Puede interactuar con medicamentos hormonales y anticoagulantes en extractos concentrados.',
    ],
    conservacion:
      'Los frutos se recogen cuando empiezan a dorarse y se secan a la sombra; guardarlos en frasco hermético, donde conservan aroma unos 12 meses. Moler justo antes de usar. Las hojas frescas se conservan pocos días en la nevera.',
    cultivo: {
      luz: 'Pleno sol.',
      suelo: 'Profundo, rico, fresco y bien drenado.',
      riego: 'Moderado y regular.',
      propagacion: 'Semilla directa; es bienal y se autosiembra con facilidad.',
    },
    sabiasQue:
      'El hinojo y el anís son especies distintas, pero comparten el anetol, el compuesto que les da ese sabor tan reconocible: por eso se confunden tan a menudo en la cocina.',
    fuentes: ['ema', 'who', 'nccih', 'kew'],
    imagen: 'hinojo',
    wikipedia: 'Foeniculum vulgare',
  },
  {
    id: 'salvia',
    nombre: 'Salvia',
    cientifico: 'Salvia officinalis L.',
    familia: 'Lamiaceae',
    categorias: ['respiratorias'],
    resumen:
      'Hoja aterciopelada y aromática, tradicionalmente reservada para gárgaras y enjuagues de boca y garganta.',
    descripcion:
      'Subarbusto de 40 a 70 cm, con hojas ovaladas, grises y suaves al tacto por su densa pubescencia, y flores violáceas dispuestas en verticilos. El aroma es fuerte y característico al frotarlas.',
    distribucion:
      'Originaria del Mediterráneo; naturalizada en América y otras regiones templadas. Cultivada en jardines y como ornamental.',
    parteUsada: 'Las hojas secas, recolectadas antes de la floración.',
    usosTradicionales: [
      'Gárgaras y enjuagues templados tradicionales en molestias de boca y garganta.',
      'Infusión de uso tradicional para la digestión y para la sudoración excesiva.',
      'Uso culinario en pequeñas cantidades.',
    ],
    evidencia: [
      {
        nivel: 'tradicional',
        texto:
          'Las monografías europeas recogen la hoja de salvia como planta de uso tradicional para la inflamación leve de boca y garganta y para la sudoración excesiva.',
      },
      {
        nivel: 'preliminar',
        texto:
          'Algunos estudios pequeños describen beneficio de los enjuagues en la placa dental y en los síntomas bucales, pero la evidencia clínica general es limitada.',
      },
    ],
    preparaciones: [
      'Infusión templada para gárgaras y enjuagues (no tragada).',
      'Decocción breve de las hojas.',
      'Uso culinario seco o fresco en pequeñas cantidades.',
    ],
    precauciones: [
      'Contiene tujona: evita el uso prolongado y las dosis altas del aceite esencial, y no lo ingieras.',
      'Contraindicada en epilepsia y no se recomienda en dosis medicinales durante el embarazo.',
      'Tradicionalmente se ha usado para reducir la producción de leche: durante la lactancia, solo bajo indicación profesional.',
      'En uso culinario es segura para la mayoría de las personas.',
    ],
    conservacion:
      'Secar las hojas a la sombra, en lugar ventilado. Guardar en frasco opaco y hermético; pierde aroma con el tiempo si queda expuesta a la luz.',
    cultivo: {
      luz: 'Pleno sol.',
      suelo: 'Pobre y muy drenado; tolera la caliza.',
      riego: 'Bajo; el exceso de humedad la debilita.',
      propagacion: 'Semilla o esquejes; los esquejes enraízan con facilidad.',
    },
    sabiasQue:
      'Su nombre científico, officinalis, indica que figuraba entre las plantas de la «oficina» o despensa de remedios de los boticarios; y «salvia» viene del latín salvare (salvar, sanar).',
    fuentes: ['ema', 'who', 'nccih', 'kew'],
    imagen: 'salvia',
    wikipedia: 'Salvia officinalis',
  },
  {
    id: 'tila',
    nombre: 'Tila',
    cientifico: 'Tilia spp. (tilos)',
    familia: 'Malvaceae',
    categorias: ['relajantes'],
    resumen:
      'Flores perfumadas del tilo, base de una de las infusiones calmantes más extendidas del mundo occidental.',
    descripcion:
      'Árbol grande, de copa amplia, hojas cordadas y aserradas, y flores amarillentas agrupadas en umbelas unidas a una bráctea alada y pálida que facilita la dispersión de los frutos.',
    distribucion:
      'Género del hemisferio norte templado; presente en bosques y ciudades de Europa, Asia y Norteamérica, frecuente como arbolado urbano.',
    parteUsada: 'Las flores con su bráctea, recolectadas en plena floración y secadas con rapidez.',
    usosTradicionales: [
      'Infusión tradicional para la inquietud y el descanso nocturno.',
      'Uso popular acompañado de limón en las noches de calor.',
      'Baños y aromaterapia doméstica de tradición europea.',
      'Macerados en frío para preparados cosméticos suaves.',
    ],
    evidencia: [
      {
        nivel: 'tradicional',
        texto:
          'El uso tradicional de la tila está ampliamente extendido en Europa: la infusión de flores se asocia a la calma y al descanso nocturno.',
      },
      {
        nivel: 'preliminar',
        texto:
          'Los ensayos clínicos modernos son escasos y pequeños: algunos describen mejoría subjetiva de la relajación y del sueño, sin resultados concluyentes.',
      },
      {
        nivel: 'tradicional',
        texto: 'No hay evidencia de que trate el insomnio crónico.',
      },
    ],
    preparaciones: [
      'Infusión de flores con bráctea, tapada de 5 a 10 minutos.',
      'Macerado en frío para preparados cosméticos suaves.',
      'Decocción breve para uso externo tradicional.',
    ],
    precauciones: [
      'Puede causar alergia en personas sensibles a Malvaceae (malvas, hibiscos).',
      'Produce somnolencia leve en algunas personas: ten precaución al conducir si notas efecto.',
      'Durante el embarazo, evita dosis medicinales por falta de datos de seguridad.',
      'Si tomas sedantes, consulta antes.',
    ],
    conservacion:
      'Secar las flores con sombra y calor suave: pierden aroma con facilidad. Conservar en frasco hermético y opaco, alejadas de fuentes de humedad.',
    cultivo: {
      luz: 'Pleno sol o media sombra.',
      suelo: 'Fértil y con humedad regular; soporta suelos urbanos.',
      riego: 'Regular en los primeros años, hasta arraigar.',
      propagacion: 'Semilla (con estratificación), estaca o injerto.',
    },
    sabiasQue:
      'La bráctea alada que sostiene el grupo de flores funciona como hélice al caer: transporta a los frutos girando y alejando la semilla del árbol madre.',
    fuentes: ['ema', 'who', 'nccih', 'kew'],
    imagen: 'tila',
    wikipedia: 'Tilia',
  },
  {
    id: 'diente-de-leon',
    nombre: 'Diente de león',
    cientifico: 'Taraxacum officinale F.H.Wigg',
    familia: 'Asteraceae',
    categorias: ['digestivas'],
    resumen:
      'La amarga de los huertos: hojas dentadas, leche blanca y flor amarilla convertida en bollo de vilanos.',
    descripcion:
      'Roseta basal de hojas dentadas hacia atrás, tallo hueco que desprende leche blanca al cortarlo, cabezillas amarillas que se cierran de noche y frutos con vilano emplumado que vuela con el viento.',
    distribucion:
      'Originaria de Eurasia; actualmente cosmopolita. Prospera en praderas, jardines, bordes de caminos y suelos alterados.',
    parteUsada: 'Las hojas tiernas y la raíz, recolectada en otoño o primavera.',
    usosTradicionales: [
      'Infusión o decocción de raíz de uso tradicional para la digestión de grasas.',
      'Hojas tiernas como diurético tradicional y en ensaladas.',
      'Preparados tradicionales asociados al cuidado hepático.',
    ],
    evidencia: [
      {
        nivel: 'preliminar',
        texto:
          'Los estudios preclínicos describen actividad diurética, antioxidante y efectos modestos sobre lípidos y glucosa, y su amargor estimula la secreción biliar en condiciones experimentales.',
      },
      {
        nivel: 'tradicional',
        texto:
          'Los ensayos clínicos en personas son escasos y de calidad limitada: no hay evidencia de que «limpie» o «proteja» el hígado en enfermedades.',
      },
    ],
    preparaciones: [
      'Infusión de raíz tostada o seca, tapada de 5 a 10 minutos.',
      'Decocción de la raíz, con hervido breve.',
      'Hojas tiernas en ensalada, en crudo.',
    ],
    precauciones: [
      'Puede causar alergia en personas sensibles a Asteraceae.',
      'Contraindicado en obstrucción biliar y cálculos biliares.',
      'Puede potenciar el efecto de diuréticos, litio y antidiabéticos: si tomas estos medicamentos, consulta antes de un uso continuado.',
      'Durante el embarazo, no automedicarse.',
      'Recolectar lejos de zonas tratadas con pesticidas o contaminadas.',
    ],
    conservacion:
      'La raíz se lava, se corta y se seca al horno a baja temperatura o al sol; se guarda en frasco opaco. Las hojas frescas se consumen en pocos días.',
    cultivo: {
      luz: 'Sol o media sombra; muy poco exigente.',
      suelo: 'Cualquiera, incluso compacto; prefiere fresco.',
      riego: 'Moderado; casi no necesita cuidados.',
      propagacion: 'Por semilla con vilano, dispersada por el viento.',
    },
    sabiasQue:
      'Su nombre viene del francés dent de lion («diente de león») por sus hojas dentadas, el mismo origen del inglés dandelion: las lenguas europeas coincidieron en esa imagen.',
    fuentes: ['ema', 'who', 'nccih', 'kew'],
    imagen: 'diente-de-leon',
    wikipedia: 'Taraxacum officinale',
  },
];
