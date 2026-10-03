// Default portfolio content, used until the admin saves changes.
export const defaults = {
  heroName: 'LingaMoorthy Reddy Nandyala',
  heroTitle: 'Senior Java Developer | Tech Lead | Cloud-Native Architect',
  heroIntro: 'I build secure, scalable enterprise applications and cloud-native platforms with Java, Spring, and modern DevOps practices.',
  heroAvailability: 'Currently available',
  heroPanelText: 'Building scalable, secure, and cloud-native systems that turn complex business challenges into reliable technology solutions.',
  aboutSummary: 'I’m a Senior Java Developer & Tech Lead with 11+ years of experience in building scalable enterprise applications, microservices, and cloud-native solutions.',
  aboutDetails: 'My work spans finance, credit analytics, and banking environments, where reliability, security, and business value are critical.',
  aboutParagraphs: [
    { text: 'I’m a **Senior Java Developer & Tech Lead with 11+ years of experience** designing, developing, and delivering scalable enterprise applications, distributed systems, and cloud-native solutions.' },
    { text: 'My expertise lies in **Java, Spring Boot, Microservices, REST APIs, event-driven architecture, and cloud technologies**, with a strong focus on building secure, resilient, and high-performance systems that can scale with evolving business needs.' },
    { text: 'Throughout my career, I’ve worked extensively across **finance, credit analytics, and banking domains**, where reliability, security, data integrity, and regulatory considerations are essential. I enjoy translating complex business requirements into **clean, maintainable, and production-ready technology solutions**.' },
    { text: 'As a Tech Lead, I combine hands-on engineering with **technical leadership, architecture design, code quality, mentoring, and engineering best practices**. I work closely with cross-functional teams to establish scalable architectures, improve development processes, and deliver solutions that create measurable business value.' },
    { text: 'I’m particularly passionate about **distributed systems, cloud-native architecture, microservices, system design, and modern engineering practices**, and I continuously explore emerging technologies to build better, smarter, and more reliable software.' },
    { text: '**My goal is simple:** build technology that is **scalable, secure, maintainable, and meaningful to the business.**' }
  ],
  aboutCertifications: 'GCP Associate Cloud Engineer\nGoogle Generative AI Leader',
  aboutDomains: 'Finance, Credit Analytics, Banking',
  contact: {
    email: 'nlmreddy.java2021@gmail.com',
    mobile: '+91-7799041264',
    linkedin: 'LingaMoorthy Reddy Nandyala',
    linkedinUrl: 'https://www.linkedin.com/in/lingamoorthy-reddy-nandyala'
  },
  skills: [
    { title: 'Languages', items: ['Java (8/17/21)', 'SQL', 'JavaScript'] },
    { title: 'Frameworks', items: ['Spring Boot', 'Spring Security', 'Spring Cloud', 'Hibernate', 'REST APIs'] },
    { title: 'Frontend', items: ['HTML', 'CSS', 'React'] },
    { title: 'Architectures', items: ['Microservices', 'System Design'] },
    { title: 'AI Tools', items: ['Claude', 'ChatGPT', 'Gemini AI', 'Copilot'] },
    { title: 'Cloud', items: ['AWS', 'GCP', 'APIGEE'] },
    { title: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB'] },
    { title: 'Tools', items: ['Docker', 'Kubernetes', 'Jenkins', 'GitHub', 'Bitbucket', 'CI/CD'] },
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
  const content = { ...defaults, ...saved, contact: { ...defaults.contact, ...(saved.contact || {}) } };
  if (typeof content.aboutCertifications === 'string') {
    content.aboutCertifications = content.aboutCertifications.replace(/,\s*/g, '\n');
  }
  return content;
}

export function fileUrl(kind, info) {
  return info ? `/api/files/${kind}?v=${info.version}` : null;
}
