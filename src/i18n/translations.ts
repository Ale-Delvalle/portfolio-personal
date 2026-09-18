export type Lang = 'es' | 'en';

export interface ProjectText {
  title: string;
  listTitle?: string;
  // Para títulos que se parten manualmente en dos líneas (ver ProjectDetail).
  titleLines?: [string, string];
  description: string;
  features?: string[];
}

export interface Translation {
  nav: {
    home: string;
    about: string;
    projects: string;
    stack: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    roleBase: string;
    roleHighlight: string;
    reviewProjects: string;
    downloadCv: string;
    contactMe: string;
    profileTitle: string;
    profileDesc: string;
    howITitle: string;
    howIDesc: string;
  };
  about: {
    heading: string;
    paragraphs: [string, string, string, string, string, string];
  };
  projects: {
    sectionLabel: string;
    items: Record<number, ProjectText>;
  };
  projectDetail: {
    viewRepo: string;
    viewRepoFront: string;
    viewRepoBack: string;
    featuresTitle: string;
    galleryLabel: string;
    back: string;
    backToProjects: string;
    prev: string;
    next: string;
    close: string;
    viewScreenshot: (n: number) => string;
    goToScreenshot: (n: number) => string;
    screenshotAlt: (title: string, n: number) => string;
  };
  cvModal: {
    closeAria: string;
    chooseTitle: string;
    chooseDescription: string;
    wordOption: string;
    pdfOption: string;
    successPrefix: string;
    successDeviceDesktop: string;
    successDeviceMobile: string;
    errorMessage: string;
    retry: string;
    docxDescription: string;
    pdfDescription: string;
  };
  loadingScreen: {
    label: string;
  };
}

const es: Translation = {
  nav: {
    home: 'Home',
    about: 'Acerca de mi',
    projects: 'Proyectos',
    stack: 'Stack',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
  },
  hero: {
    roleBase: 'Full Stack Developer · Backend con NestJS y TypeScript ·',
    roleHighlight: 'Lo humano vale.',
    reviewProjects: 'Revisar proyectos',
    downloadCv: 'Descargar CV',
    contactMe: 'Contáctame',
    profileTitle: 'Mi perfil profesional',
    profileDesc:
      'Estoy enfocado en el desarrollo backend, y desarrollo aplicaciones full stack de principio a fin: desde el diseño del modelo de datos y la API REST hasta la integración de servicios externos y el cliente web.',
    howITitle: '¿Cómo trabajo?',
    howIDesc:
      'Comunicación directa y constante, empatía, SCRUM, documentación y código limpio para entregar proyectos mantenibles y escalables.',
  },
  about: {
    heading: 'Acerca de mi',
    paragraphs: [
      'Soy Full Stack Developer con orientación al backend, formado en Soy Henry y con una primer experiencia laboral real trabajando en remoto para Fresh & Dash, empresa con sede en Suiza, como Mobile Developer en su aplicación Vitality+.',
      'Antes de dedicarme a la programación de forma profesional, cursé la Licenciatura en Sistemas en la Universidad Nacional del Nordeste (UNNE - Argentina) lo que me dio una base sólida en fundamentos de programación, algoritmos y pensamiento lógico que hoy aplico en cada proyecto.',
      'Me especializo en backend porque es donde más disfruto: diseñar el modelo de datos, estudiar las entidades y sus relaciones, y definir la lógica de negocio antes de escribir código.',
      'Creo que el buen software se construye con criterio técnico y buenas prácticas — no como un fin en sí mismo, sino porque un código mantenible y escalable es lo que le da valor real al producto. Es el estándar con el que trabajo y el que busco en el equipo donde me desempeñe.',
      'Vivimos una transición tecnológica acelerada. Hay quienes creen que la IA reemplazará a los trabajadores — yo creo que nos potencia: nos hace más productivos y libera tiempo para lo que realmente importa.',
      'El criterio para analizar, la capacidad de tomar decisiones y la calidez humana que potencia a los equipos de trabajo no se automatizan. Esto es lo que creo: lo humano vale y es determinante para el logro de los objetivos y la calidad del software.',
    ],
  },
  projects: {
    sectionLabel: 'Mis proyectos',
    items: {
      1: {
        title: 'Astro Tech',
        description:
          'Plataforma de e-commerce full stack con carrito de compras, panel de administración y autenticación JWT.',
        features: [
          'Backend con NestJS y TypeScript, organizado por módulos de negocio',
          'Autenticación segura con JWT y permisos por rol de usuario',
          'Base de datos relacional con PostgreSQL',
          'Frontend en Next.js con manejo de estado (Zustand) y consumo de datos con React Query',
          'Documentación de API con Swagger',
          'Proyecto containerizado con Docker',
        ],
      },
      2: {
        title: 'Hearts & Paws',
        listTitle: 'Hearts & Paws',
        description:
          'Proyecto grupal · Educativo \nPlataforma para ONGs de rescate animal que conecta organizaciones protectoras con adoptantes. Gestiona adopciones, donaciones con pasarela de pago y mensajería en tiempo real. Trabajé en un grupo conformado por 6 personas, en donde participé del equipo de backend.',
        features: [
          'Backend con NestJS y TypeScript, organizado por dominio de negocio',
          'Base de datos relacional con PostgreSQL y Prisma',
          'Autenticación segura con JWT y permisos por rol de usuario',
          'Donaciones integradas con pasarela de pago Stripe',
          'Moderación automática de imágenes sensibles con Sightengine, con Google Cloud Vision integrado en el backend',
          'Chat en tiempo real entre organizaciones y adoptantes',
        ],
      },
      3: {
        title: 'Punto de partida',
        description:
          'Primer proyecto personal desarrollado con tecnologías web fundamentales, sin frameworks ni librerías externas.',
        features: [
          'Página de perfil personal con gestor de actividades favoritas',
          'Desarrollado con HTML5, CSS3 y JavaScript puro, sin frameworks',
          'Diseño responsivo con CSS Grid',
          'Tests unitarios con Jasmine',
        ],
      },
      4: {
        title: 'Clínica San Sebastián',
        titleLines: ['Clínica', 'San Sebastián'],
        description:
          'Sistema de gestión de turnos médicos con autenticación, validaciones de negocio y panel de usuario.',
        features: [
          'Backend con Express y TypeScript, organizado en capas',
          'Base de datos relacional con PostgreSQL',
          'Sistema de turnos con reglas de negocio: anticipación mínima, días y horarios hábiles',
          'Autenticación de usuarios con sesión persistida',
          'Frontend en React con Vite y formularios gestionados con Formik',
          'Rutas protegidas según sesión activa',
        ],
      },
      5: {
        title: 'Pelisplay',
        description:
          'Aplicación full stack de gestión de películas con carrusel 3D inmersivo, construida con Node.js y MongoDB.',
        features: [
          'Backend con Node.js y Express',
          'Base de datos NoSQL con MongoDB',
          'Catálogo de películas con carrusel 3D animado (GSAP) y vista en grilla',
          'Gestión completa de películas: alta y baja con confirmación',
          'Frontend empaquetado con Webpack',
          'Tests unitarios con Jest',
        ],
      },
    },
  },
  projectDetail: {
    viewRepo: 'Ver repositorio',
    viewRepoFront: 'Ver repositorio (Front)',
    viewRepoBack: 'Ver repositorio (Back)',
    featuresTitle: 'Características principales',
    galleryLabel: 'Capturas del proyecto',
    back: 'Atrás',
    backToProjects: 'Volver a proyectos',
    prev: 'Anterior',
    next: 'Siguiente',
    close: 'Cerrar',
    viewScreenshot: (n) => `Ver captura ${n}`,
    goToScreenshot: (n) => `Ir a captura ${n}`,
    screenshotAlt: (title, n) => `${title} — captura ${n}`,
  },
  cvModal: {
    closeAria: 'Cerrar',
    chooseTitle: 'Estás por descargar el CV',
    chooseDescription: 'A continuación elige el formato',
    wordOption: 'Word (.docx)',
    pdfOption: 'PDF',
    successPrefix: 'CV descargado, ya puedes revisar el archivo en tu',
    successDeviceDesktop: 'PC',
    successDeviceMobile: 'dispositivo',
    errorMessage: 'Ocurrió un error al descargar el CV. Intenta nuevamente.',
    retry: 'Volver a intentar',
    docxDescription: 'Documento Word',
    pdfDescription: 'Documento PDF',
  },
  loadingScreen: {
    label: 'Cargando experiencia...',
  },
};

const en: Translation = {
  nav: {
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    stack: 'Stack',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  hero: {
    roleBase: 'Full Stack Developer · Backend with NestJS and TypeScript ·',
    roleHighlight: 'People matter.',
    reviewProjects: 'View projects',
    downloadCv: 'Download resume',
    contactMe: 'Contact me',
    profileTitle: 'Professional profile',
    profileDesc:
      "I focus on backend development, and I build full stack applications from start to finish: from designing the data model and REST API to integrating external services and the web client.",
    howITitle: 'How I Work',
    howIDesc:
      'Direct, constant communication, empathy, Scrum, documentation, and clean code to deliver maintainable, scalable projects.',
  },
  about: {
    heading: 'About me',
    paragraphs: [
      "I'm a Full Stack Developer with a backend focus, trained at Soy Henry, and I got my first real work experience remotely at Fresh & Dash, a Switzerland-based company, as a Mobile Developer on their Vitality+ app.",
      'Before going into programming professionally, I studied Systems Engineering at the Universidad Nacional del Nordeste (UNNE - Argentina), which gave me a solid foundation in programming fundamentals, algorithms, and logical thinking that I still apply in every project today.',
      "I specialize in backend development because that's what I enjoy most: designing the data model, studying entities and their relationships, and defining the business logic before writing a single line of code.",
      "I believe good software is built on technical judgment and good practices — not as an end in itself, but because maintainable, scalable code is what gives a product real value. That's the standard I hold myself to, and the one I look for in any team I'm part of.",
      "We're living through a fast-moving tech shift. Some believe AI will replace workers — I believe it empowers us: it makes us more productive and frees up time for what really matters.",
      "The judgment to analyze, the ability to make decisions, and the human warmth that strengthens a team — none of that can be automated. This is what I believe: people matter, and that's what ultimately drives both team success and software quality.",
    ],
  },
  projects: {
    sectionLabel: 'My projects',
    items: {
      1: {
        title: 'Astro Tech',
        description:
          'A full stack e-commerce platform with a shopping cart, an admin dashboard, and JWT authentication.',
        features: [
          'Backend built with NestJS and TypeScript, organized by business modules',
          'Secure authentication with JWT and role-based permissions',
          'Relational database with PostgreSQL',
          'Next.js frontend with state management (Zustand) and data fetching via React Query',
          'API documentation with Swagger',
          'Containerized with Docker',
        ],
      },
      2: {
        title: 'Hearts & Paws',
        listTitle: 'Hearts & Paws',
        description:
          'Group project · Educational \nA platform for animal-rescue nonprofits that connects shelters with adopters. It handles adoptions, donations through a payment gateway, and real-time messaging. I worked in a team of 6, on the backend side.',
        features: [
          'Backend built with NestJS and TypeScript, organized by business domain',
          'Relational database with PostgreSQL and Prisma',
          'Secure authentication with JWT and role-based permissions',
          'Donations integrated with the Stripe payment gateway',
          'Automatic moderation of sensitive images with Sightengine, with Google Cloud Vision integrated on the backend',
          'Real-time chat between shelters and adopters',
        ],
      },
      3: {
        title: 'Starting Point',
        description:
          'My first personal project, built with core web technologies — no frameworks, no external libraries.',
        features: [
          'A personal profile page with a favorite-activities manager',
          'Built with plain HTML5, CSS3, and JavaScript — no frameworks',
          'Responsive design with CSS Grid',
          'Unit tests with Jasmine',
        ],
      },
      4: {
        title: 'San Sebastián Clinic',
        titleLines: ['San Sebastián', 'Clinic'],
        description:
          'A medical appointment management system with authentication, business rule validation, and a user dashboard.',
        features: [
          'Backend built with Express and TypeScript, organized in layers',
          'Relational database with PostgreSQL',
          'Appointment scheduling with business rules: minimum notice, business days and hours',
          'User authentication with persisted sessions',
          'React frontend built with Vite, forms managed with Formik',
          'Protected routes based on active session',
        ],
      },
      5: {
        title: 'Pelisplay',
        description:
          'A full stack movie management app with an immersive 3D carousel, built with Node.js and MongoDB.',
        features: [
          'Backend built with Node.js and Express',
          'NoSQL database with MongoDB',
          'Movie catalog with an animated 3D carousel (GSAP) and a grid view',
          'Full movie management: add and remove with confirmation',
          'Frontend bundled with Webpack',
          'Unit tests with Jest',
        ],
      },
    },
  },
  projectDetail: {
    viewRepo: 'View repository',
    viewRepoFront: 'View repository (Frontend)',
    viewRepoBack: 'View repository (Backend)',
    featuresTitle: 'Key features',
    galleryLabel: 'Project screenshots',
    back: 'Back',
    backToProjects: 'Back to projects',
    prev: 'Previous',
    next: 'Next',
    close: 'Close',
    viewScreenshot: (n) => `View screenshot ${n}`,
    goToScreenshot: (n) => `Go to screenshot ${n}`,
    screenshotAlt: (title, n) => `${title} — screenshot ${n}`,
  },
  cvModal: {
    closeAria: 'Close',
    chooseTitle: "You're about to download my resume",
    chooseDescription: 'Choose a format below',
    wordOption: 'Word (.docx)',
    pdfOption: 'PDF',
    successPrefix: 'Resume downloaded, you can now check the file on your',
    successDeviceDesktop: 'computer',
    successDeviceMobile: 'device',
    errorMessage: 'Something went wrong downloading the resume. Please try again.',
    retry: 'Try again',
    docxDescription: 'Word Document',
    pdfDescription: 'PDF Document',
  },
  loadingScreen: {
    label: 'Loading experience...',
  },
};

export const translations: Record<Lang, Translation> = { es, en };
