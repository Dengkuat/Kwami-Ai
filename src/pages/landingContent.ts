export type Language = 'kinyarwanda' | 'english'

export const landingContent = {
  kinyarwanda: {
    headerLang: 'Ikinyarwanda',
    menuLabel: 'Fungura menu',
    heroTitle: 'Muraho! Ikaze muri Kwima.',
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
      },
      {
        id: 'health',
        title: 'Amakuru y\'Ubuzima',
        description: 'Shaka amakuru ku Mutuelle de Santé n\'ibitaro byo hafi.',
      },
      {
        id: 'legal',
        title: 'Ubufasha mu By\'amategeko',
        description: 'Amakuru yoroshye ku burenganzira bwawe n\'amategeko ya Leta.',
      },
    ],
    nav: {
      home: 'Ahabanza',
      services: 'Serivisi',
      chat: 'Ikiganiro',
      checklist: 'Urutonde',
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
    heroTitle: 'Muraho! Welcome to Kwima.',
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
      },
      {
        id: 'health',
        title: 'Health Info',
        description: 'Access information about Mutuelle de Santé and local clinics.',
      },
      {
        id: 'legal',
        title: 'Legal Aid',
        description: 'Simplified information on your rights and public laws.',
      },
    ],
    nav: {
      home: 'Home',
      services: 'Services',
      chat: 'Chat',
      checklist: 'Checklist',
      profile: 'Profile',
    },
    navAria: 'Main navigation',
    menuTitle: 'Menu',
    closeMenuLabel: 'Close menu',
    menuChecklist: 'Checklist',
  },
} as const
