export type Language = 'uz' | 'en' | 'ru';

export interface LanguageOption {
  code: Language;
  label: string;
  shortLabel: string;
  flag: string;
}

export interface TranslationSchema {
  nav: {
    about: string;
    skills: string;
    projects: string;
    experience: string;
    contact: string;
    resumeSpec: string;
    telegramCta: string;
  };
  hero: {
    badgeAvailable: string;
    typewriter: string[];
    subtext: string;
    exploreProjects: string;
    getInTouch: string;
    statFreelance: string;
    statSchool21: string;
    statPython: string;
    statLocation: string;
  };
  visualizer: {
    telemetryTitle: string;
    runtimeTitle: string;
    apiLatency: string;
    latencyHealthy: string;
    asyncWorkers: string;
    workersActive: string;
    subsystem: string;
    engineProtocol: string;
    status: string;
    apiGateway: string;
    dbCluster: string;
    authSecurity: string;
    onlineStatus: string;
  };
  terminal: {
    titleBadge: string;
    heading: string;
    subheading: string;
    tabBio: string;
    tabPhilosophy: string;
    tabStack: string;
    bioP1: string;
    bioP2: string;
    bioP3: string;
    philosophyP1: string;
    philosophyP2: string;
    philosophyP3: string;
    activeContracts: string;
    responseTime: string;
    codeQuality: string;
  };
  skills: {
    titleBadge: string;
    heading: string;
    subheading: string;
    experienceLevel: string;
    categories: {
      backendTitle: string;
      backendDesc: string;
      dbTitle: string;
      dbDesc: string;
      devopsTitle: string;
      devopsDesc: string;
      archTitle: string;
      archDesc: string;
    };
  };
  projects: {
    titleBadge: string;
    heading: string;
    subheading: string;
    allFilter: string;
    viewCode: string;
    liveDemo: string;
    viewArchitecture: string;
    architectureTitle: string;
    keyFeaturesTitle: string;
    techStackTitle: string;
    items: {
      buddyTeam: {
        category: string;
        summary: string;
        features: string[];
        architecture: string;
      };
      esportsBot: {
        category: string;
        summary: string;
        features: string[];
        architecture: string;
      };
      peerLearn: {
        category: string;
        summary: string;
        features: string[];
        architecture: string;
      };
    };
  };
  timeline: {
    titleBadge: string;
    heading: string;
    subheading: string;
    workTitle: string;
    workSubtitle: string;
    eduTitle: string;
    eduSubtitle: string;
    workItems: {
      kwork: {
        role: string;
        company: string;
        badge: string;
        period: string;
        responsibilities: string[];
      };
      paynet: {
        role: string;
        company: string;
        badge: string;
        period: string;
        responsibilities: string[];
      };
      rrrAcademy: {
        role: string;
        company: string;
        badge: string;
        period: string;
        responsibilities: string[];
      };
    };
    eduItems: {
      school21: {
        institution: string;
        period: string;
        field: string;
        status: string;
        description: string;
      };
      mohirdev: {
        institution: string;
        period: string;
        field: string;
        status: string;
        description: string;
      };
      proUnity: {
        institution: string;
        period: string;
        field: string;
        status: string;
        description: string;
      };
      itCenter: {
        institution: string;
        period: string;
        field: string;
        status: string;
        description: string;
      };
    };
  };
  contact: {
    titleBadge: string;
    heading: string;
    subheading: string;
    phoneLabel: string;
    emailLabel: string;
    telegramLabel: string;
    locationLabel: string;
    clientNameLabel: string;
    clientNamePlaceholder: string;
    emailInputLabel: string;
    emailInputPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendBtn: string;
    sendingNote: string;
    successTitle: string;
    successMsg: string;
    sendAnother: string;
  };
  resume: {
    title: string;
    printPdf: string;
    summaryTitle: string;
    experienceTitle: string;
    educationTitle: string;
    close: string;
  };
  footer: {
    roleDesc: string;
    location: string;
    rightsReserved: string;
    techStackNote: string;
  };
  visitorModal: {
    badge: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    roleLabel: string;
    roles: {
      recruiter: string;
      client: string;
      developer: string;
      guest: string;
    };
    submitBtn: string;
    skipBtn: string;
    submitting: string;
    welcomeBack: string;
    toastIntro: string;
    toastAnon: string;
    badgeStatus: string;
  };
}

