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
  experience: [
    {
      title: 'Software Engineer – Career/Manager, P3',
      company: 'Equifax Analytics Private Limited',
      date: 'Nov 2023 - Present',
      description: 'Role: Tech Leader (Software Engineer – Career, P3)\nDeveloped secure and scalable APIs to generate credit reports and scores from customer registration information.\nEquifax data analytics and credit assessment tools help expand access to affordable mainstream financial services.'
    },
    {
      title: 'Lead 1 – Software Engineering, B1',
      company: 'PTEC Technology Solutions Private Limited',
      date: 'Jun 2023 - Oct 2023',
      description: 'Worked as a Lead 1 – Software Engineering, B1. The role transitioned from PTEC to Equifax.'
    },
    {
      title: 'Senior Consultant/Tech Lead',
      company: 'Capgemini',
      date: 'Sep 2021 - May 2023',
      description: 'Role: Tech Leader (Senior Consultant – C1)\nLed project teams and drove delivery of key initiatives.\nDeveloped a secure, scalable SMS-based account lookup API for credit card transactions, reducing fraud and improving customer convenience. The system also supported barcode generation for in-store purchases without physical cards.'
    },
    {
      title: 'Assistant System Analyst',
      company: 'C-EDGE Technologies Limited',
      date: 'Apr 2017 - Sep 2021',
      description: 'Contributed to system analysis and support initiatives.\nBuilt a centralized ATM management tool for EJ file pulling, advertisement uploads, error screen tracking, and patch updates, enabling daily reconciliation and reporting.\nDeveloped a reconciliation dashboard across ATM, POS, UPI, IMPS, and AEPS channels, with manual reconciliation and dispute tracking.'
    },
    {
      title: 'Trainee Software Engineer (Jr. Java Developer)',
      company: 'Green & Wise',
      date: 'Apr 2015 - Mar 2017',
      description: 'Contributed to software development while building Java experience.\nDeveloped a tool for call center agents to manage RuPay card inquiries, block lost cards, and raise disputes. Automated reporting and email alerts to client banks.'
    }
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
