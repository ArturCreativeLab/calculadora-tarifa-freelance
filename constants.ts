
import { Country, Sector, QuizQuestion, SptLevel, MicroLesson, ClientExperienceLevel, ClientProjectUrgency, DataSources } from './types';

export const COUNTRIES_DATA: Country[] = [
  { code: 'ES', name: 'España', currency: 'EUR', currencySymbol: '€', minMonthlySalary: 1134 },
  { code: 'MX', name: 'México', currency: 'MXN', currencySymbol: '$', minMonthlySalary: 7468 },
  { code: 'AR', name: 'Argentina', currency: 'ARS', currencySymbol: '$', minMonthlySalary: 202800 },
  { code: 'CO', name: 'Colombia', currency: 'COP', currencySymbol: '$', minMonthlySalary: 1300000 },
  { code: 'US', name: 'Estados Unidos', currency: 'USD', currencySymbol: '$', minMonthlySalary: 1256 }, // Federal minimum wage approx
  { code: 'CL', name: 'Chile', currency: 'CLP', currencySymbol: '$', minMonthlySalary: 460000 },
  { code: 'PE', name: 'Perú', currency: 'PEN', currencySymbol: 'S/', minMonthlySalary: 1025 },
];

export const SECTORS_DATA: Sector[] = [
  { id: 'design', name: 'Diseño Gráfico y Multimedia' },
  { id: 'writing', name: 'Redacción y Contenidos (Copywriting)' },
  { id: 'development', name: 'Desarrollo Web y Software' },
  { id: 'ux-ui', name: 'UX/UI y Producto Digital' },
  { id: 'audiovisual', name: 'Producción Audiovisual' },
  { id: 'education', name: 'Educación, Formación y Tutoría' },
  { id: 'consulting', name: 'Consultoría de Negocios y Estrategia' },
  { id: 'ai-data-devops', name: 'IA, Data y DevOps' },
  { id: 'marketing', name: 'Marketing Digital y SEO' },
  { id: 'admin', name: 'Asistencia Virtual y Soporte Administrativo'},
  { id: 'other', name: 'Otro / Freelancer Generalista' },
];

export const AVERAGE_HOURLY_RATES_DATA: Record<string, number> = {
  'ES_design': 35, 'ES_writing': 30, 'ES_development': 50, 'ES_ux-ui': 55, 'ES_audiovisual': 40, 'ES_education': 45, 'ES_consulting': 45, 'ES_ai-data-devops': 60, 'ES_marketing': 40, 'ES_admin': 25, 'ES_other': 28,
  'MX_design': 200, 'MX_writing': 150, 'MX_development': 300, 'MX_ux-ui': 330, 'MX_audiovisual': 250, 'MX_education': 180, 'MX_consulting': 350, 'MX_ai-data-devops': 360, 'MX_marketing': 250, 'MX_admin': 120, 'MX_other': 150,
  'AR_design': 3000, 'AR_writing': 2500, 'AR_development': 5000, 'AR_ux-ui': 5500, 'AR_audiovisual': 4000, 'AR_education': 2800, 'AR_consulting': 6000, 'AR_ai-data-devops': 6000, 'AR_marketing': 4500, 'AR_admin': 2000, 'AR_other': 2500,
  'CO_design': 30000, 'CO_writing': 25000, 'CO_development': 50000, 'CO_ux-ui': 55000, 'CO_audiovisual': 40000, 'CO_education': 28000, 'CO_consulting': 60000, 'CO_ai-data-devops': 60000, 'CO_marketing': 45000, 'CO_admin': 20000, 'CO_other': 25000,
  'US_design': 50, 'US_writing': 45, 'US_development': 75, 'US_ux-ui': 85, 'US_audiovisual': 60, 'US_education': 40, 'US_consulting': 80, 'US_ai-data-devops': 90, 'US_marketing': 65, 'US_admin': 30, 'US_other': 40,
  'CL_design': 15000, 'CL_writing': 12000, 'CL_development': 25000, 'CL_ux-ui': 27500, 'CL_audiovisual': 20000, 'CL_education': 10000, 'CL_consulting': 30000, 'CL_ai-data-devops': 30000, 'CL_marketing': 22000, 'CL_admin': 8000, 'CL_other': 10000,
  'PE_design': 30, 'PE_writing': 25, 'PE_development': 50, 'PE_ux-ui': 55, 'PE_audiovisual': 40, 'PE_education': 20, 'PE_consulting': 60, 'PE_ai-data-devops': 60, 'PE_marketing': 45, 'PE_admin': 18, 'PE_other': 25,
};

export const PLATFORM_EXAMPLES_BY_SECTOR: Record<string, string[]> = {
  design: ['Behance', 'Dribbble', 'Adobe Portfolio', 'Domestika'],
  writing: ['Medium', 'Contently', 'LinkedIn', 'Substack'],
  development: ['GitHub', 'GitLab', 'Stack Overflow', 'Upwork', 'Dev.to'],
  'ux-ui': ['Dribbble', 'Behance', 'Figma Community', 'UserTesting.com', 'LinkedIn'],
  audiovisual: ['Vimeo', 'YouTube', 'ArtStation', 'SoundCloud', 'Epidemic Sound'],
  education: ['Udemy', 'Coursera', 'Teachable', 'LinkedIn Learning', 'Domestika'],
  consulting: ['LinkedIn', 'Upwork', 'Malt', 'Clarity.fm'],
  'ai-data-devops': ['GitHub', 'Kaggle', 'AWS Marketplace', 'Hugging Face', 'Docker Hub', 'LinkedIn'],
  marketing: ['LinkedIn', 'Upwork', 'Fiverr', 'Google My Business', 'HubSpot Community'],
  admin: ['Upwork', 'Fiverr', 'LinkedIn', 'Asana', 'Trello', 'Clockify'],
  other: ['LinkedIn', 'Upwork', 'Fiverr', 'Malt', 'Workana', 'Freelancer.com'],
};

export const QUIZ_QUESTIONS_DATA: QuizQuestion[] = [
  {
    id: 'q1_experience',
    blockTitle: 'Experiencia Práctica',
    icon: '📈',
    questionText: '¿Cuánto tiempo llevas trabajando como freelancer o en tu especialidad principal?',
    options: [
      { text: 'Estoy empezando, menos de 1 año.', points: 5 },
      { text: 'Tengo algo de experiencia, entre 1 y 3 años.', points: 10 },
      { text: 'Llevo un buen tiempo, entre 3 y 5 años.', points: 15 },
      { text: 'Soy un veterano, ¡más de 5 años!', points: 20 },
    ],
  },
  {
    id: 'q2_portfolio',
    blockTitle: 'Portafolio y Casos de Éxito',
    icon: '💼',
    questionText: '¿Cómo describirías tu portafolio o los trabajos que puedes mostrar a tus clientes?',
    options: [
      { text: 'Aún estoy construyéndolo, no tengo mucho que mostrar.', points: 0 },
      { text: 'Tengo algunos ejemplos, pero necesito darles una mejor presentación.', points: 5 },
      { text: 'Cuento con un portafolio básico pero funcional con varios proyectos.', points: 10 },
      { text: 'Mi portafolio es sólido, variado y con algunos casos de éxito destacables.', points: 15 },
      { text: 'Tengo un portafolio impresionante que demuestra claramente mi valor y resultados.', points: 20 },
    ],
  },
  {
    id: 'q3_professionalism',
    blockTitle: 'Madurez Profesional y Procesos',
    icon: '⚙️',
    questionText: '¿Cómo gestionas tus proyectos, acuerdos y cobros con los clientes?',
    options: [
      { text: 'Generalmente es informal, acuerdos verbales o por mensaje.', points: 0 },
      { text: 'Tengo un proceso básico: envío presupuestos y luego facturas sencillas.', points: 5 },
      { text: 'Uso plantillas de presupuestos, sigo un flujo de trabajo y emito facturas formales.', points: 10 },
      { text: 'Utilizo contratos, herramientas de gestión de proyectos y facturación profesional.', points: 15 },
      { text: 'Mis procesos son muy definidos, eficientes, a menudo automatizados y totalmente profesionales.', points: 20 },
    ],
  },
  {
    id: 'q4_tools',
    blockTitle: 'Dominio de Herramientas y Certificaciones',
    icon: '🛠️',
    questionText: 'Respecto a las herramientas clave de tu profesión y/o certificaciones, ¿cómo te encuentras?',
    options: [
      { text: 'Estoy aprendiendo a usar las herramientas básicas.', points: 0 },
      { text: 'Manejo bien las herramientas estándar necesarias para mi trabajo.', points: 5 },
      { text: 'Domino herramientas avanzadas y/o tengo alguna certificación relevante.', points: 10 },
      { text: 'Soy experto en múltiples herramientas y/o poseo certificaciones importantes y reconocidas en mi sector.', points: 15 },
    ],
  },
  {
    id: 'q5_reputation',
    blockTitle: 'Reputación y Validación Externa',
    icon: '🌟',
    questionText: '¿Cuentas con testimonios, reseñas o referencias de clientes satisfechos?',
    options: [
      { text: 'No muchos por ahora, o son informales.', points: 0 },
      { text: 'He recibido buen feedback verbal de algunos clientes.', points: 3 },
      { text: 'Tengo algunos testimonios escritos o reseñas online positivas.', points: 7 },
      { text: 'Cuento con excelentes reseñas, testimonios destacados y clientes recurrentes que me recomiendan activamente.', points: 10 },
    ],
  },
  {
    id: 'q6_value_proposition',
    blockTitle: 'Propuesta de Valor Única',
    icon: '💡',
    questionText: '¿Qué crees que te hace destacar o ser diferente en tu campo profesional?',
    options: [
      { text: 'Aún estoy trabajando en definir claramente mi diferenciación.', points: 0 },
      { text: 'Ofrezco un servicio confiable y de buena calidad, similar al estándar del mercado.', points: 5 },
      { text: 'Tengo una especialización clara, un nicho definido o un enfoque particular que me distingue.', points: 10 },
      { text: 'Mi propuesta de valor es muy clara, innovadora y soluciona problemas específicos de mis clientes de forma excepcional y única.', points: 15 },
    ],
  },
  {
    id: 'q7_platforms',
    blockTitle: 'Tu Entorno Digital',
    icon: '🌐',
    questionText: 'Y sobre las plataformas online de tu sector, como {platformExamplesPlaceholder}, ¿qué tan familiarizado/a estás?', // Placeholder, will be replaced
    options: [
      { text: 'La verdad, no conozco ninguna específica para mi área.', points: 0 },
      { text: 'He oído hablar de algunas, pero no las he usado mucho.', points: 1 },
      { text: 'Sí, he usado alguna vez plataformas de este tipo.', points: 2 }, // Placeholder for option with examples
      { text: '¡Claro! Trabajo o me promociono activamente en una o más de ellas.', points: 3 },
    ],
  },
];

export const SPT_LEVELS: SptLevel[] = [
  { 
    level: 'Explorador/a Inicial 🧭', 
    minSpt: 0, 
    maxSpt: 39, 
    mentorMessage: "Estás empezando, céntrate en portafolio, procesos y visibilidad.",
    mentorTip: "Construye tu portafolio (¡incluso con proyectos pequeños!), define procesos básicos de trabajo y empieza a hacerte visible en plataformas de tu sector o LinkedIn.",
    recommendations: [
      "Enfócate en ganar experiencia con proyectos pequeños para construir tu portafolio.",
      "Pide testimonios a tus primeros clientes.",
      "Define procesos básicos de trabajo y comunicación. La organización es clave.",
      "Sigue aprendiendo y mejorando tus habilidades."
    ] 
  },
  { 
    level: 'Desarrollador/a de Marca 🚀', 
    minSpt: 40, 
    maxSpt: 69, 
    mentorMessage: "Vas bien, mejora posicionamiento y propuesta de valor.",
    mentorTip: "Pule tu portafolio, define con más claridad qué te hace diferente (tu propuesta de valor) y busca formas de posicionarte mejor ante tu cliente ideal.",
    recommendations: [
      "Profesionaliza tu portafolio. Muestra tus mejores trabajos y resultados.",
      "Establece procesos de cobro más formales (facturas, contratos sencillos).",
      "Identifica tus puntos fuertes y considera una especialización.",
      "Busca activamente feedback y testimonios."
    ] 
  },
  { 
    level: 'Profesional Consolidado/a ✅', 
    minSpt: 70, 
    maxSpt: 89, 
    mentorMessage: "Perfil sólido. Mantén tus estándares y defiende tu tarifa.",
    mentorTip: "Asegúrate de que tu propuesta de valor sea clarísima y comunícala con fuerza. No dudes en defender el valor de tu tiempo y experiencia en tus negociaciones.",
    recommendations: [
      "Refina tu propuesta de valor. ¿Qué te hace realmente único?",
      "Considera aumentar tus tarifas gradualmente.",
      "Optimiza tus procesos de trabajo para ser más eficiente.",
      "Fortalece tu red de contactos."
    ] 
  },
  { 
    level: 'Experto/a Referente ✨', 
    minSpt: 90, 
    maxSpt: 100, 
    mentorMessage: "Nivel senior. Puedes trabajar con clientes premium.",
    mentorTip: "Considera empaquetar servicios de alto valor, ofrecer consultoría estratégica o mentorías. Tu branding personal debe reflejar este nivel de expertise. Apunta a clientes que valoren tu experiencia.",
    recommendations: [
      "Posiciónate como un experto en tu nicho.",
      "Apunta a proyectos más grandes y clientes premium.",
      "Delega tareas no esenciales.",
      "Sigue innovando y aprendiendo.",
      "Recuerda que las tarifas promedio varían. Si tu perfil es fuerte, pero tu tarifa no es tan alta, investiga nichos de alta demanda o mercados con mayor potencial."
    ]
  },
];

export const COMPANY_NAME = "Calculadora de Tarifas v3";
export const ARTUR_LAB_NAME = "Artur Creative Lab";
export const MAIN_APP_TITLE = "Calculadora de Tarifas Freelance y Costes para Clientes";
export const APP_FOOTER_MESSAGE = `Este es un proyecto experimental del ${ARTUR_LAB_NAME}. Buscamos ayudar a freelancers y clientes a entender el valor del trabajo creativo con herramientas justas y abiertas.`;


export const HOURS_PER_MONTH_REFERENCE = 160;
export const NEW_QUESTION_ID = 'q7_platforms';
export const MAX_PLATFORM_EXAMPLES = 3;
export const SIMILAR_PROJECTS_HOURS_WARNING_THRESHOLD = 180; // Monthly hours

export const MICRO_LESSONS_DATA: MicroLesson[] = [
  {
    id: 'ml1',
    title: '¿Qué es una Tarifa Justa?',
    content: 'Una tarifa justa cubre tus gastos, reconoce tu experiencia y habilidades, y se alinea con lo que el mercado valora para servicios como el tuyo. No se trata solo de sobrevivir, sino de prosperar y reinvertir en tu crecimiento.',
  },
  {
    id: 'ml2',
    title: 'Claves para Negociar con un Cliente',
    content: '1. Conoce tu valor y ten confianza. 2. Escucha activamente las necesidades del cliente. 3. Presenta tu presupuesto como una inversión, no un costo. 4. Ten claros tus límites y qué estás dispuesto/a a ceder (y qué no). 5. Siempre formaliza los acuerdos por escrito.',
    link: 'https://www.arturcreativelab.com/blog/negociar-presupuesto', // Example link
    linkText: 'Leer más sobre negociación',
  },
  {
    id: 'ml3',
    title: 'Elementos Esenciales de un Presupuesto Freelance',
    content: 'Debe incluir: Tus datos y los del cliente, descripción detallada del servicio/proyecto, desglose de fases o entregables (si aplica), precio por hora o proyecto, precio total, condiciones de pago (plazos, métodos), validez de la oferta y qué incluye (ej. revisiones) y qué no.',
  },
];

// Client Mode Constants
export const CLIENT_EXPERIENCE_LEVEL_OPTIONS = {
  [ClientExperienceLevel.BASIC]: { label: 'Básico / Junior', multiplierMin: 0.8, multiplierMax: 1.0 }, // Applied to PH_Medio
  [ClientExperienceLevel.PROFESSIONAL]: { label: 'Intermedio / Profesional', multiplierMin: 1.0, multiplierMax: 1.3 },
  [ClientExperienceLevel.SPECIALIZED]: { label: 'Experto / Especializado', multiplierMin: 1.3, multiplierMax: 1.8 },
};

export const CLIENT_URGENCY_MULTIPLIERS = {
  [ClientProjectUrgency.NORMAL]: { label: 'Normal (Plazo Estándar)', multiplier: 1.0 },
  [ClientProjectUrgency.FAST]: { label: 'Rápida (Prioridad Alta)', multiplier: 1.25 },
  [ClientProjectUrgency.IMMEDIATE]: { label: 'Inmediata (Urgencia Máxima)', multiplier: 1.75 }, // Corrected from 1.5_2.0
};

export const CLIENT_EDUCATIONAL_TIPS = [
  "Pagar tarifas justas y a tiempo fomenta una relación profesional positiva y asegura un trabajo de calidad.",
  "Un brief claro y detallado es clave: especifica tus objetivos, público, entregables esperados y plazos.",
  "Al contratar, valora la experiencia, el portafolio, los testimonios y la comunicación del freelancer, no solo el precio.",
  "Recuerda que un buen freelancer es una inversión que puede aportar mucho valor a tu proyecto o negocio."
];

export const DATA_SOURCES_LIST: DataSources[] = [
  { name: "Estudios de mercado de plataformas freelance (ej. Malt, Upwork, Fiverr)."},
  { name: "Informes de procesadores de pago (ej. Payoneer)."},
  { name: "Indicadores salariales y de costo de vida (ej. WageIndicator, Numbeo)."},
  { name: "Datos públicos de salarios mínimos y promedios por país."},
  { name: "Encuestas y datos de comunidades freelance."}
];

export const DEFAULT_CLIENT_ESTIMATED_HOURS = 8; // Default hours for "one_task" if not specified
