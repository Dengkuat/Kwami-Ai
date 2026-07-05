export type Language = 'kinyarwanda' | 'english'

export const landingContent = {
  kinyarwanda: {
    headerLang: 'Ikinyarwanda',
    menuLabel: 'Fungura menu',
    heroTitle: 'Muraho! Ikaze muri Kigali Kwima.',
    heroSubtitle:
      'Umuyobozi wawe wa AI w\'ibikorwa bya Leta y\'u Rwanda. Yizewe, yihuse, kandi irashoboka mu rurimi ukoresha.',
    languageLabel: 'Hitamo ururimi rwawe',
    kinyarwandaSub: 'Ikinyarwanda',
    englishSub: 'Ururimi rw\'ibanze',
    cta: 'Tangira',
    featuresAria: 'Serivisi zatoranijwe',
    features: [
      {
        id: 'irembo',
        title: 'Ubufasha bwa Irembo',
        description:
          'Amabwiriza y\'intambwe ku mpamyabumenyi y\'amavuko, indangamuntu, n\'uruhushya.',
        route: 'chat' as const,
      },
      {
        id: 'health',
        title: 'Amakuru y\'Ubuzima',
        description: 'Shaka amakuru ku Mutuelle de Santé n\'ibitaro byo hafi.',
        route: 'chat' as const,
      },
      {
        id: 'legal',
        title: 'Ubufasha mu By\'amategeko',
        description: 'Amakuru yoroshye ku burenganzira bwawe n\'amategeko ya Leta.',
        route: 'chat' as const,
      },
    ],
    nav: {
      home: 'Ahabanza',
      services: 'Serivisi',
      chat: 'Ikiganiro',
      profile: 'Umwirondoro',
    },
    navAria: 'Imbuga nyamukuru',
    menuTitle: 'Menu',
    closeMenuLabel: 'Funga menu',
    menuChecklist: 'Urutonde rw\'ibikorwa',
  },
  english: {
    headerLang: 'English',
    menuLabel: 'Open menu',
    heroTitle: 'Muraho! Welcome to Kigali Kwima.',
    heroSubtitle:
      'Your AI guide to Rwandan government services. Reliable, fast, and accessible in the language of your choice.',
    languageLabel: 'Select your language',
    kinyarwandaSub: 'Ikinyarwanda',
    englishSub: 'Official Language',
    cta: 'Get Started',
    featuresAria: 'Featured services',
    features: [
      {
        id: 'irembo',
        title: 'Irembo Help',
        description: 'Step-by-step guidance for birth certificates, IDs, and permits.',
        route: 'chat' as const,
      },
      {
        id: 'health',
        title: 'Health Info',
        description: 'Access information about Mutuelle de Santé and local clinics.',
        route: 'chat' as const,
      },
      {
        id: 'legal',
        title: 'Legal Aid',
        description: 'Simplified information on your rights and public laws.',
        route: 'chat' as const,
      },
    ],
    nav: {
      home: 'Home',
      services: 'Services',
      chat: 'Chat',
      profile: 'Profile',
    },
    navAria: 'Main navigation',
    menuTitle: 'Menu',
    closeMenuLabel: 'Close menu',
    menuChecklist: 'Checklist',
  },
} as const
