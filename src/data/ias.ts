export type TipoIA = 'Gratis' | 'Freemium' | 'De pago';

export interface InteligenciaArtificial {
  id: string;
  nombre: string;
  descripcion: string;
  detalle: string;
  categoria: string;
  sitioWeb: string;
  tipo: TipoIA;
  lanzamiento?: string;
  emoji: string;
  color: string;
}

export const CATEGORIAS = [
  'Todas',
  'Texto y Chat',
  'Imagen',
  'Video',
  'Código',
  'Audio',
  'Productividad',
  'Diseño',
  '3D y Modelado',
  'Investigación',
  'Empresarial',
];

export const IAS: InteligenciaArtificial[] = [
  // ---------- Texto y Chat ----------
  {
    id: 'chatgpt',
    nombre: 'ChatGPT',
    descripcion:
      'El modelo de lenguaje más popular del mundo para conversar, escribir, programar y analizar información.',
    detalle:
      'Desarrollado por OpenAI, ChatGPT es un asistente conversacional basado en GPT-4o capaz de responder preguntas, redactar textos, programar, analizar datos y generar imágenes con DALL·E 3.',
    categoria: 'Texto y Chat',
    sitioWeb: 'https://chat.openai.com',
    tipo: 'Freemium',
    lanzamiento: 'Noviembre 2022',
    emoji: '💬',
    color: '#6366f1',
  },
  {
    id: 'claude',
    nombre: 'Claude',
    descripcion:
      'IA segura y capaz con una ventana de contexto muy amplia para análisis y redacción de textos largos.',
    detalle:
      'Creado por Anthropic, Claude destaca por su seguridad, su gran memoria de contexto y su habilidad para resumir documentos extensos y programar.',
    categoria: 'Texto y Chat',
    sitioWeb: 'https://claude.ai',
    tipo: 'Freemium',
    lanzamiento: 'Marzo 2023',
    emoji: '🧠',
    color: '#a855f7',
  },
  {
    id: 'gemini',
    nombre: 'Gemini',
    descripcion:
      'Modelo multimodal de Google integrado en su ecosistema que entiende texto, imagen, audio y código.',
    detalle:
      'Gemini es la familia de modelos de Google DeepMind. Puede procesar y combinar distintos tipos de información y está integrado en Android, Gmail, Docs y más.',
    categoria: 'Texto y Chat',
    sitioWeb: 'https://gemini.google.com',
    tipo: 'Freemium',
    lanzamiento: 'Diciembre 2023',
    emoji: '✨',
    color: '#4285f4',
  },
  {
    id: 'llama',
    nombre: 'Llama 3',
    descripcion:
      'Modelo de lenguaje de código abierto de Meta que puedes ejecutar localmente o en la nube.',
    detalle:
      'Llama es el modelo abierto de Meta. Es ampliamente usado por desarrolladores para crear asistentes propios sin depender de APIs cerradas.',
    categoria: 'Texto y Chat',
    sitioWeb: 'https://llama.meta.com',
    tipo: 'Gratis',
    lanzamiento: 'Abril 2024',
    emoji: '🦙',
    color: '#10b981',
  },
  {
    id: 'mistral',
    nombre: 'Mistral',
    descripcion:
      'Modelos europeos eficientes y abiertos, conocidos por su velocidad y bajo consumo de recursos.',
    detalle:
      'Mistral AI desarrolla modelos de lenguaje de vanguardia con versiones abiertas y comerciales, muy populares en Europa.',
    categoria: 'Texto y Chat',
    sitioWeb: 'https://mistral.ai',
    tipo: 'Freemium',
    lanzamiento: '2023',
    emoji: '🇪🇺',
    color: '#f59e0b',
  },
  {
    id: 'grok',
    nombre: 'Grok',
    descripcion:
      'IA de xAI con acceso en tiempo real a la red social X y respuestas con sentido del humor.',
    detalle:
      'Desarrollado por xIA de Elon Musk, Grok está integrado en X y se distingue por tener información actualizada en tiempo real.',
    categoria: 'Texto y Chat',
    sitioWeb: 'https://grok.x.ai',
    tipo: 'De pago',
    lanzamiento: 'Noviembre 2023',
    emoji: '🚀',
    color: '#000000',
  },
  {
    id: 'deepseek',
    nombre: 'DeepSeek',
    descripcion:
      'Modelo abierto potente en razonamiento matemático y programación, desarrollado en China.',
    detalle:
      'DeepSeek ha ganado popularidad por sus modelos de razonamiento (R1) con rendimiento comparable a los mejores modelos cerrados.',
    categoria: 'Texto y Chat',
    sitioWeb: 'https://deepseek.com',
    tipo: 'Gratis',
    lanzamiento: '2023',
    emoji: '🔍',
    color: '#2563eb',
  },
  {
    id: 'perplexity',
    nombre: 'Perplexity',
    descripcion:
      'Motor de respuestas con citas de fuentes web que combina búsqueda e IA conversacional.',
    detalle:
      'Perplexity responde preguntas buscando en internet y cita sus fuentes, ideal para investigación rápida y verificación de datos.',
    categoria: 'Texto y Chat',
    sitioWeb: 'https://perplexity.ai',
    tipo: 'Freemium',
    lanzamiento: '2022',
    emoji: '🔎',
    color: '#000000',
  },
  {
    id: 'cohere',
    nombre: 'Cohere',
    descripcion:
      'IA empresarial para búsqueda semántica, resumen y clasificación de textos.',
    detalle:
      'Cohere ofrece modelos de lenguaje enfocados al uso empresarial, con énfasis en búsqueda, generación y entendimiento de texto.',
    categoria: 'Texto y Chat',
    sitioWeb: 'https://cohere.com',
    tipo: 'De pago',
    lanzamiento: '2019',
    emoji: '🏢',
    color: '#166534',
  },
  {
    id: 'pi',
    nombre: 'Pi',
    descripcion:
      'IA conversacional personal y empática diseñada para ser un asistente diario y útil.',
    detalle:
      'Creado por Inflection AI, Pi se centra en conversaciones naturales, amables y útiles para el día a día.',
    categoria: 'Texto y Chat',
    sitioWeb: 'https://pi.ai',
    tipo: 'Gratis',
    lanzamiento: 'Mayo 2023',
    emoji: '🤗',
    color: '#db2777',
  },

  // ---------- Imagen ----------
  {
    id: 'midjourney',
    nombre: 'Midjourney',
    descripcion:
      'Generación de arte digital y fotorrealismo de alta calidad a partir de texto.',
    detalle:
      'Midjourney es uno de los generadores de imágenes más avanzados, accesible a través de Discord y su web, ideal para artistas y diseñadores.',
    categoria: 'Imagen',
    sitioWeb: 'https://midjourney.com',
    tipo: 'De pago',
    lanzamiento: 'Julio 2022',
    emoji: '🎨',
    color: '#000000',
  },
  {
    id: 'dalle3',
    nombre: 'DALL·E 3',
    descripcion:
      'Generación de imágenes a partir de lenguaje natural, integrada en ChatGPT.',
    detalle:
      'DALL·E 3 de OpenAI comprende matices del lenguaje y genera imágenes precisas, útil para ilustraciones y conceptos visuales.',
    categoria: 'Imagen',
    sitioWeb: 'https://openai.com/dall-e-3',
    tipo: 'Freemium',
    lanzamiento: 'Octubre 2023',
    emoji: '🖼️',
    color: '#6366f1',
  },
  {
    id: 'stable-diffusion',
    nombre: 'Stable Diffusion',
    descripcion:
      'Generación de imágenes de código abierto que puedes ejecutar en tu propio hardware.',
    detalle:
      'Desarrollado por Stability AI, es el estándar de código abierto para generación de imágenes con gran comunidad y personalización.',
    categoria: 'Imagen',
    sitioWeb: 'https://stability.ai',
    tipo: 'Gratis',
    lanzamiento: 'Agosto 2022',
    emoji: '🌀',
    color: '#f43f5e',
  },
  {
    id: 'flux',
    nombre: 'Flux.1',
    descripcion:
      'Generación de imágenes de alta calidad con renderizado preciso de texto y anatomía.',
    detalle:
      'Creado por Black Forest Labs, Flux destaca por su realismo, adherencia al prompt y generación de texto legible dentro de las imágenes.',
    categoria: 'Imagen',
    sitioWeb: 'https://blackforestlabs.ai',
    tipo: 'Freemium',
    lanzamiento: 'Agosto 2024',
    emoji: '⚡',
    color: '#0f172a',
  },
  {
    id: 'ideogram',
    nombre: 'Ideogram',
    descripcion:
      'Imágenes con texto legible y herramientas de diseño gráfico generativo.',
    detalle:
      'Ideogram se especializa en generar imágenes que contienen texto correctamente escrito, ideal para logotipos, pósters y material gráfico.',
    categoria: 'Imagen',
    sitioWeb: 'https://ideogram.ai',
    tipo: 'Freemium',
    lanzamiento: 'Agosto 2023',
    emoji: '🅰️',
    color: '#22d3ee',
  },
  {
    id: 'leonardo',
    nombre: 'Leonardo.ai',
    descripcion:
      'Generación de assets para videojuegos, concept art y arte conceptual con IA.',
    detalle:
      'Plataforma enfocada en crear elementos visuales para juegos, con control preciso sobre estilos, personajes y escenarios.',
    categoria: 'Imagen',
    sitioWeb: 'https://leonardo.ai',
    tipo: 'Freemium',
    lanzamiento: '2022',
    emoji: '🎮',
    color: '#f59e0b',
  },
  {
    id: 'firefly',
    nombre: 'Adobe Firefly',
    descripcion:
      'Generación ética de imágenes integrada en Creative Cloud y Adobe Express.',
    detalle:
      'Firefly está entrenado con contenido de Adobe Stock y permite generar, rellenar y editar imágenes de forma comercialmente segura.',
    categoria: 'Imagen',
    sitioWeb: 'https://firefly.adobe.com',
    tipo: 'Freemium',
    lanzamiento: 'Marzo 2023',
    emoji: '🖌️',
    color: '#bd10e0',
  },

  // ---------- Video ----------
  {
    id: 'sora',
    nombre: 'Sora',
    descripcion:
      'Generación de video realista a partir de texto, desarrollado por OpenAI.',
    detalle:
      'Sora crea clips de video de hasta un minuto con alta calidad visual y coherencia temporal a partir de instrucciones de texto.',
    categoria: 'Video',
    sitioWeb: 'https://openai.com/sora',
    tipo: 'De pago',
    lanzamiento: 'Febrero 2024',
    emoji: '🎬',
    color: '#6366f1',
  },
  {
    id: 'runway',
    nombre: 'Runway Gen-2',
    descripcion:
      'Generación y edición de video con IA directamente desde el navegador.',
    detalle:
      'Runway permite generar video desde texto o imagen, aplicar efectos, eliminar fondos y editar video con IA generativa.',
    categoria: 'Video',
    sitioWeb: 'https://runwayml.com',
    tipo: 'Freemium',
    lanzamiento: '2023',
    emoji: '🎥',
    color: '#0ea5e9',
  },
  {
    id: 'pika',
    nombre: 'Pika Labs',
    descripcion:
      'Generación y animación de video con estilo cinematográfico y anime.',
    detalle:
      'Pika es una plataforma de video generativo accesible desde web y Discord, enfocada en creadores de contenido y animadores.',
    categoria: 'Video',
    sitioWeb: 'https://pika.art',
    tipo: 'Freemium',
    lanzamiento: '2023',
    emoji: '✨',
    color: '#ec4899',
  },
  {
    id: 'luma',
    nombre: 'Luma Dream Machine',
    descripcion:
      'Generación de video realista y de alta velocidad a partir de texto e imágenes.',
    detalle:
      'Luma Labs crea video fotorrealista rápidamente, con buen entendimiento del movimiento y la consistencia entre frames.',
    categoria: 'Video',
    sitioWeb: 'https://lumalabs.ai',
    tipo: 'Freemium',
    lanzamiento: 'Junio 2024',
    emoji: '🌌',
    color: '#8b5cf6',
  },
  {
    id: 'kling',
    nombre: 'Kling',
    descripcion:
      'Generación de video de larga duración con movimientos realistas y 3D.',
    detalle:
      'Desarrollado por Kuaishou, Kling genera clips de video largos con simulación física y movimientos naturales.',
    categoria: 'Video',
    sitioWeb: 'https://klingai.com',
    tipo: 'Freemium',
    lanzamiento: 'Junio 2024',
    emoji: '🎞️',
    color: '#ef4444',
  },
  {
    id: 'heygen',
    nombre: 'HeyGen',
    descripcion:
      'Avatares hablantes y doblaje de video con IA para creación de contenido.',
    detalle:
      'HeyGen permite crear videos con avatares de IA que hablan varios idiomas, ideal para entrenamiento, marketing y ventas.',
    categoria: 'Video',
    sitioWeb: 'https://www.heygen.com',
    tipo: 'Freemium',
    lanzamiento: '2020',
    emoji: '🗣️',
    color: '#10b981',
  },
  {
    id: 'synthesia',
    nombre: 'Synthesia',
    descripcion:
      'Videos corporativos con presentadores de IA sin necesidad de cámara ni estudio.',
    detalle:
      'Synthesia convierte texto en video con presentadores realistas, muy usado para tutoriales corporativos y comunicaciones internas.',
    categoria: 'Video',
    sitioWeb: 'https://www.synthesia.io',
    tipo: 'De pago',
    lanzamiento: '2017',
    emoji: '📺',
    color: '#f59e0b',
  },

  // ---------- Código ----------
  {
    id: 'copilot',
    nombre: 'GitHub Copilot',
    descripcion:
      'Programación en pareja con IA dentro de tu editor de código favorito.',
    detalle:
      'Copilot sugiere bloques de código, funciones completas y ayuda a depurar mientras programas, integrado en VS Code y otros editores.',
    categoria: 'Código',
    sitioWeb: 'https://github.com/features/copilot',
    tipo: 'De pago',
    lanzamiento: 'Junio 2022',
    emoji: '🐙',
    color: '#24292e',
  },
  {
    id: 'cursor',
    nombre: 'Cursor',
    descripcion:
      'Editor de código nativo con IA integrado para escribir, editar y entender código.',
    detalle:
      'Cursor es un fork de VS Code con IA profunda: puede editar múltiples archivos, generar código y responder sobre tu base de código.',
    categoria: 'Código',
    sitioWeb: 'https://cursor.sh',
    tipo: 'Freemium',
    lanzamiento: '2023',
    emoji: '🖥️',
    color: '#8b5cf6',
  },
  {
    id: 'replit',
    nombre: 'Replit Agent',
    descripcion:
      'Crea aplicaciones completas desde cero describiendo lo que quieres en lenguaje natural.',
    detalle:
      'Replit Agent puede planificar, programar y desplegar aplicaciones web enteras desde una sola descripción.',
    categoria: 'Código',
    sitioWeb: 'https://replit.com',
    tipo: 'Freemium',
    lanzamiento: '2024',
    emoji: '🧩',
    color: '#000000',
  },
  {
    id: 'codeium',
    nombre: 'Codeium',
    descripcion:
      'Autocompletado y chat de código gratuito con soporte para decenas de lenguajes.',
    detalle:
      'Codeium ofrece autocompletado inteligente y chat de IA para desarrolladores con una versión gratuita muy generosa.',
    categoria: 'Código',
    sitioWeb: 'https://codeium.com',
    tipo: 'Gratis',
    lanzamiento: '2022',
    emoji: '⚡',
    color: '#0ea5e9',
  },
  {
    id: 'tabnine',
    nombre: 'Tabnine',
    descripcion:
      'Asistente de código centrado en la privacidad y la seguridad empresarial.',
    detalle:
      'Tabnine predice y sugiere código basado en tus patrones, con opciones de modelo privado para equipos.',
    categoria: 'Código',
    sitioWeb: 'https://www.tabnine.com',
    tipo: 'Freemium',
    lanzamiento: '2018',
    emoji: '🔖',
    color: '#f59e0b',
  },
  {
    id: 'devin',
    nombre: 'Devin',
    descripcion:
      'Ingeniero de software autónomo capaz de planificar y ejecutar proyectos de código.',
    detalle:
      'Creado por Cognition, Devin puede escribir código, depurar, desplegar y entrenar modelos de forma autónoma.',
    categoria: 'Código',
    sitioWeb: 'https://www.cognition-labs.com',
    tipo: 'De pago',
    lanzamiento: 'Marzo 2024',
    emoji: '👨‍💻',
    color: '#6366f1',
  },

  // ---------- Audio ----------
  {
    id: 'elevenlabs',
    nombre: 'ElevenLabs',
    descripcion:
      'Clonación y generación de voz ultrarealista en decenas de idiomas.',
    detalle:
      'ElevenLabs genera voz sintética casi indistinguible de la humana, ideal para doblaje, audiolibros y asistentes de voz.',
    categoria: 'Audio',
    sitioWeb: 'https://elevenlabs.io',
    tipo: 'Freemium',
    lanzamiento: '2022',
    emoji: '🔊',
    color: '#ec4899',
  },
  {
    id: 'murf',
    nombre: 'Murf AI',
    descripcion:
      'Voz en off profesional para videos, presentaciones y e-learning.',
    detalle:
      'Murf permite crear narraciones con IA ajustando tono, velocidad y énfasis, con una gran biblioteca de voces.',
    categoria: 'Audio',
    sitioWeb: 'https://murf.ai',
    tipo: 'Freemium',
    lanzamiento: '2020',
    emoji: '🎙️',
    color: '#22d3ee',
  },
  {
    id: 'suno',
    nombre: 'Suno',
    descripcion:
      'Generación de canciones completas con letra, voz e instrumentación.',
    detalle:
      'Suno crea música original desde cero con solo una descripción, incluyendo letras y voz sintética.',
    categoria: 'Audio',
    sitioWeb: 'https://suno.com',
    tipo: 'Freemium',
    lanzamiento: '2023',
    emoji: '🎵',
    color: '#f43f5e',
  },
  {
    id: 'udio',
    nombre: 'Udio',
    descripcion:
      'Generación de música con IA impulsada por una comunidad de creadores.',
    detalle:
      'Udio permite generar canciones de alta calidad y editarlas estructura por estructura, muy popular entre músicos.',
    categoria: 'Audio',
    sitioWeb: 'https://www.udio.com',
    tipo: 'Freemium',
    lanzamiento: 'Abril 2024',
    emoji: '🎶',
    color: '#a855f7',
  },
  {
    id: 'whisper',
    nombre: 'Whisper',
    descripcion:
      'Transcripción de audio a texto multilingüe y precisa de OpenAI.',
    detalle:
      'Whisper es un modelo de reconocimiento de voz de código abierto que transcribe audio en muchos idiomas con alta precisión.',
    categoria: 'Audio',
    sitioWeb: 'https://openai.com/whisper',
    tipo: 'Gratis',
    lanzamiento: 'Septiembre 2022',
    emoji: '📝',
    color: '#6366f1',
  },

  // ---------- Productividad ----------
  {
    id: 'notion-ai',
    nombre: 'Notion AI',
    descripcion:
      'Escritura, resumen y organización dentro de tu espacio de Notion.',
    detalle:
      'Notion AI ayuda a redactar, resumir páginas, generar tareas y organizar información directamente en tus notas y bases de datos.',
    categoria: 'Productividad',
    sitioWeb: 'https://www.notion.so',
    tipo: 'De pago',
    lanzamiento: 'Febrero 2023',
    emoji: '📄',
    color: '#000000',
  },
  {
    id: 'grammarly',
    nombre: 'Grammarly',
    descripcion:
      'Corrección y mejora de escritura en tiempo real en cualquier aplicación web.',
    detalle:
      'Grammarly revisa ortografía, gramática, tono y claridad mientras escribes en el navegador y en aplicaciones de escritorio.',
    categoria: 'Productividad',
    sitioWeb: 'https://www.grammarly.com',
    tipo: 'Freemium',
    lanzamiento: '2009',
    emoji: '✅',
    color: '#14922d',
  },
  {
    id: 'otter',
    nombre: 'Otter.ai',
    descripcion:
      'Transcripción y notas automáticas de reuniones y llamadas.',
    detalle:
      'Otter graba y transcribe reuniones en tiempo real, identifica hablantes y genera resúmenes automáticos.',
    categoria: 'Productividad',
    sitioWeb: 'https://otter.ai',
    tipo: 'Freemium',
    lanzamiento: '2016',
    emoji: '🎧',
    color: '#ef4444',
  },
  {
    id: 'tome',
    nombre: 'Tome',
    descripcion:
      'Presentaciones y narración visual generadas por IA a partir de un texto.',
    detalle:
      'Tome crea diapositivas, imágenes y texto coherente para contar historias visuales, ideal para pitches y presentaciones.',
    categoria: 'Productividad',
    sitioWeb: 'https://tome.app',
    tipo: 'Freemium',
    lanzamiento: '2020',
    emoji: '📊',
    color: '#dc2626',
  },
  {
    id: 'gamma',
    nombre: 'Gamma',
    descripcion:
      'Documentos, presentaciones y páginas web generadas con IA en segundos.',
    detalle:
      'Gamma permite crear presentaciones interactivas, documentos y micro-sitios web con diseño automático y contenido generado por IA.',
    categoria: 'Productividad',
    sitioWeb: 'https://gamma.app',
    tipo: 'Freemium',
    lanzamiento: '2020',
    emoji: '🌐',
    color: '#7c3aed',
  },

  // ---------- Diseño ----------
  {
    id: 'canva-ai',
    nombre: 'Canva AI',
    descripcion:
      'Diseño gráfico con herramientas de IA integradas para redes sociales y marketing.',
    detalle:
      'Canva incluye Magic Design, generación de imágenes y edición de video con IA para crear contenido visual sin saber diseñar.',
    categoria: 'Diseño',
    sitioWeb: 'https://www.canva.com',
    tipo: 'Freemium',
    lanzamiento: '2013',
    emoji: '🎨',
    color: '#00c4cc',
  },
  {
    id: 'figma-ai',
    nombre: 'Figma AI',
    descripcion:
      'Diseño de interfaces con asistencia de IA para componer y editar UI.',
    detalle:
      'Figma agregó herramientas de IA para generar diseños, reescribir textos, organizar capas y crear prototipos más rápido.',
    categoria: 'Diseño',
    sitioWeb: 'https://www.figma.com',
    tipo: 'Freemium',
    lanzamiento: '2024',
    emoji: '﹟',
    color: '#f24e1e',
  },
  {
    id: 'looka',
    nombre: 'Looka',
    descripcion:
      'Creación de logotipos e identidad de marca con IA.',
    detalle:
      'Looka genera logotipos, paletas de colores y materiales de marca automáticamente desde el nombre de tu empresa.',
    categoria: 'Diseño',
    sitioWeb: 'https://looka.com',
    tipo: 'De pago',
    lanzamiento: '2016',
    emoji: '🏷️',
    color: '#f97316',
  },
  {
    id: 'removebg',
    nombre: 'Remove.bg',
    descripcion:
      'Eliminación automática de fondos de imágenes con un solo clic.',
    detalle:
      'Remove.bg usa IA para detectar y eliminar el fondo de cualquier foto, dejando el sujeto aislado en segundos.',
    categoria: 'Diseño',
    sitioWeb: 'https://www.remove.bg',
    tipo: 'Freemium',
    lanzamiento: '2018',
    emoji: '✂️',
    color: '#ec4899',
  },

  // ---------- 3D ----------
  {
    id: 'meshy',
    nombre: 'Meshy',
    descripcion:
      'Generación de modelos 3D y texturas con IA a partir de texto o imagen.',
    detalle:
      'Meshy permite crear modelos 3D listos para usar en videojuegos y animación desde una descripción o foto de referencia.',
    categoria: '3D y Modelado',
    sitioWeb: 'https://www.meshy.ai',
    tipo: 'Freemium',
    lanzamiento: '2023',
    emoji: '📦',
    color: '#10b981',
  },
  {
    id: 'luma-ai',
    nombre: 'Luma AI',
    descripcion:
      'Captura y modelado 3D desde video de tu móvil o cámara.',
    detalle:
      'Luma AI crea escenas y modelos 3D fotorrealistas usando solo videos grabados con un smartphone (NeRF y Gaussian Splatting).',
    categoria: '3D y Modelado',
    sitioWeb: 'https://lumalabs.ai',
    tipo: 'Freemium',
    lanzamiento: '2022',
    emoji: '🪐',
    color: '#8b5cf6',
  },
  {
    id: 'spline-ai',
    nombre: 'Spline AI',
    descripcion:
      'Diseño 3D y experiencias web interactivas con asistencia de IA.',
    detalle:
      'Spline permite modelar en 3D en tiempo real y generar objetos y escenas con IA para insertar en sitios web.',
    categoria: '3D y Modelado',
    sitioWeb: 'https://spline.design',
    tipo: 'Freemium',
    lanzamiento: '2022',
    emoji: '🔷',
    color: '#06b6d4',
  },

  // ---------- Investigación ----------
  {
    id: 'consensus',
    nombre: 'Consensus',
    descripcion:
      'Motor de búsqueda académica basado en evidencia científica revisada.',
    detalle:
      'Consensus busca entre millones de papers y extrae conclusiones basadas en estudios reales, ideal para investigación médica y científica.',
    categoria: 'Investigación',
    sitioWeb: 'https://consensus.app',
    tipo: 'Freemium',
    lanzamiento: '2022',
    emoji: '🔬',
    color: '#6b7280',
  },
  {
    id: 'elicit',
    nombre: 'Elicit',
    descripcion:
      'Asistente de investigación con IA para revisar y resumir papers académicos.',
    detalle:
      'Elicit automatiza revisiones bibliográficas, encuentra papers relevantes y extrae datos clave de artículos de investigación.',
    categoria: 'Investigación',
    sitioWeb: 'https://elicit.com',
    tipo: 'Freemium',
    lanzamiento: '2021',
    emoji: '📚',
    color: '#2563eb',
  },

  // ---------- Empresarial ----------
  {
    id: 'zapier-ai',
    nombre: 'Zapier AI',
    descripcion:
      'Automatización de flujos de trabajo entre miles de aplicaciones con IA.',
    detalle:
      'Zapier conecta apps y permite crear automatizaciones (Zaps) con lenguaje natural, sin escribir código.',
    categoria: 'Empresarial',
    sitioWeb: 'https://zapier.com',
    tipo: 'Freemium',
    lanzamiento: '2011',
    emoji: '⚡',
    color: '#f5423b',
  },
  {
    id: 'microsoft-copilot',
    nombre: 'Microsoft Copilot',
    descripcion:
      'IA integrada en Windows, Microsoft 365 y Edge para productividad empresarial.',
    detalle:
      'Copilot está integrado en Word, Excel, Outlook, Teams y Windows para redactar, resumir y analizar con IA.',
    categoria: 'Empresarial',
    sitioWeb: 'https://copilot.microsoft.com',
    tipo: 'Freemium',
    lanzamiento: '2023',
    emoji: '🪟',
    color: '#00a4ef',
  },
];

export const CONTADOR_POR_CATEGORIA: Record<string, number> = {
  'Texto y Chat': 10,
  Imagen: 7,
  Video: 7,
  Código: 6,
  Audio: 5,
  Productividad: 5,
  Diseño: 4,
  '3D y Modelado': 3,
  Investigación: 2,
  Empresarial: 2,
};