// Default portfolio content, used until the admin saves changes.
export const defaults = {
  heroEyebrow: 'Senior Java Developer • Tech Lead • Cloud-Native Architect',
  heroName: 'LingaMoorthy Reddy Nandyala',
  heroTitle: 'Senior Java Developer | Tech Lead | Cloud-Native Architect',
  heroIntro: 'I build secure, scalable enterprise applications and cloud-native platforms with Java, Spring, and modern DevOps practices.',
  heroAvailability: 'Currently available',
  heroPanelText: 'Building secure, scalable systems that balance performance, reliability, and business impact.',
  aboutSummary: 'I’m a Senior Java Developer & Tech Lead with 11+ years of experience in building scalable enterprise applications, microservices, and cloud-native solutions.',
  aboutDetails: 'My work spans finance, credit analytics, and banking environments, where reliability, security, and business value are critical.',
  aboutCertifications: 'GCP Associate Cloud Engineer, Google Generative AI Leader',
  aboutDomains: 'Finance, Credit Analytics, Banking',
  contact: {
    email: 'nlmreddy.java2021@gmail.com',
    mobile: '+91-7799041264',
    linkedin: 'LingaMoorthy Reddy Nandyala',
    linkedinUrl: 'https://www.linkedin.com/in/lingamoorthy-reddy-nandyala'
  },
  skills: [
    { title: 'Languages', items: ['Java (8/17/21)', 'SQL', 'JavaScript'] },
    { title: 'Frameworks', items: ['Spring Boot', 'Spring Security', 'Spring Cloud', 'Hibernate'] },
    { title: 'Cloud', items: ['AWS', 'GCP', 'APIGEE'] },
    { title: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Cassandra'] },
    { title: 'Tools', items: ['Docker', 'Kubernetes', 'Jenkins', 'GitHub', 'Bitbucket'] },
    { title: 'Testing', items: ['JUnit', 'Mockito'] }
  ],
  projects: [
    { title: 'Your Credit & Identity (Equifax)', description: 'APIs for secure credit reports and scoring.' },
    { title: 'Customer Account Lookup API (Capgemini)', description: 'SMS-based fraud reduction system.' },
    { title: 'ATM EJ Pulling Tool (C-Edge)', description: 'Centralized ATM management and reconciliation.' },
    { title: 'RuPay Card Enquiry (Green & Wise)', description: 'Call center tool for card inquiries and disputes.' }
  ],
  certifications: [
    { title: 'B.Tech – Electrical & Electronics Engineering', detail: 'JNTU Hyderabad, 2012' },
    { title: 'GCP Associate Cloud Engineer', detail: 'Cloud certification focused on core GCP services and architecture principles.' },
    { title: 'Google - Generative AI Leader', detail: 'Cloud certification focused on core GCP services and architecture principles.' }
  ]
};

export const DEFAULT_PHOTO = 'assets/profile-photo.jpeg';
export const DEFAULT_RESUME = 'Resume_LingaMoorthyReddy(Java).doc';

// Merge saved content over the defaults so newly added fields always have a value.
export function withDefaults(saved = {}) {
  return { ...defaults, ...saved, contact: { ...defaults.contact, ...(saved.contact || {}) } };
}

export function fileUrl(kind, info) {
  return info ? `/api/files/${kind}?v=${info.version}` : null;
}
