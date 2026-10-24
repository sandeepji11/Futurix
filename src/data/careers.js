export const careers = [
  {
    id: 'ai-engineer',
    name: 'AI Engineer',
    category: 'Technology & AI',
    type: 'emerging',
    description:
      'Design, train, and ship machine learning systems that solve real student and industry problems.',
    skills: ['Python', 'Math', 'Machine Learning', 'APIs', 'Deep Learning'],
    education: 'Class 11–12 PCM → B.Tech CSE / AI → internships and ML projects',
    salaryRange: '₹10 – 30 LPA',
    growth: 'Exponential (+45% by 2030)',
    exams: 'JEE Main, BITSAT, State CETs',
    icon: 'cpu',
  },
  {
    id: 'software-developer',
    name: 'Software Developer',
    category: 'Technology & AI',
    type: 'established',
    description:
      'Build websites, apps, and tools people use every day. Strong problem solving and clean code matter most.',
    skills: ['JavaScript', 'Data structures', 'Git', 'Databases', 'React'],
    education: 'Any stream with coding practice → B.Tech / BCA / self-taught portfolio',
    salaryRange: '₹6 – 22 LPA',
    growth: 'Very High (+25% by 2030)',
    exams: 'JEE, CUET, NIMCET (for MCA)',
    icon: 'code',
  },
  {
    id: 'robotics-engineer',
    name: 'Robotics Engineer',
    category: 'Technology & AI',
    type: 'emerging',
    description:
      'Combine mechanics, electronics, and software to make machines that move and sense the world.',
    skills: ['Physics', 'C/C++', 'Electronics', 'Control systems', 'ROS'],
    education: 'PCM → B.Tech Mechatronics / ECE / Mechanical with robotics labs',
    salaryRange: '₹8 – 24 LPA',
    growth: 'High (+30% by 2030)',
    exams: 'JEE Advanced, GATE',
    icon: 'bot',
  },
  {
    id: 'doctor',
    name: 'Doctor (Medical Specialist)',
    category: 'Healthcare & Science',
    type: 'established',
    description:
      'Diagnose, treat, and care for people. Requires deep science study and years of clinical training.',
    skills: ['Biology', 'Empathy', 'Diagnostic Reasoning', 'Communication'],
    education: 'PCB → NEET-UG → MBBS → internship → NEET-PG / specialization',
    salaryRange: '₹10 – 35 LPA',
    growth: 'Evergreen & Vital',
    exams: 'NEET-UG, NEET-PG, INI-CET',
    icon: 'stethoscope',
  },
  {
    id: 'uiux-designer',
    name: 'UI/UX Designer',
    category: 'Creative & Design',
    type: 'emerging',
    description:
      'Shape how products look and feel so students and users can finish tasks without confusion.',
    skills: ['Figma', 'User Research', 'Visual design', 'Prototyping', 'Design Systems'],
    education: 'Any stream → design diploma / B.Des / strong case-study portfolio',
    salaryRange: '₹6 – 18 LPA',
    growth: 'High (+28% by 2030)',
    exams: 'UCEED, NID DAT, NIFT',
    icon: 'palette',
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    category: 'Technology & AI',
    type: 'established',
    description:
      'Turn messy data into decisions with statistics, storytelling, and machine learning.',
    skills: ['Statistics', 'Python', 'SQL', 'Visualization', 'Pandas'],
    education: 'PCM or Commerce with maths → B.Sc / B.Tech / specialized M.Sc',
    salaryRange: '₹8 – 26 LPA',
    growth: 'Very High (+35% by 2030)',
    exams: 'JEE, CUET, ISI Admission Test',
    icon: 'chart',
  },
  {
    id: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst',
    category: 'Technology & AI',
    type: 'established',
    description:
      'Protect systems from attacks, find weak spots, and respond when something goes wrong.',
    skills: ['Networking', 'Linux', 'Risk thinking', 'Scripting', 'Ethical Hacking'],
    education: 'PCM or CS → B.Tech / certifications (Security+, CEH) + labs',
    salaryRange: '₹7 – 20 LPA',
    growth: 'Critical Demand (+33% by 2030)',
    exams: 'JEE, State CETs, CEH / CompTIA',
    icon: 'shield',
  },
  {
    id: 'entrepreneur',
    name: 'Startup Founder / Entrepreneur',
    category: 'Business & Management',
    type: 'emerging',
    description:
      'Spot a problem, build a product or service, and learn to sell, hire, and keep going after setbacks.',
    skills: ['Communication', 'Finance basics', 'Grit', 'Customer research', 'Leadership'],
    education: 'Any stream → real projects, internships, and small experiments over a fixed degree',
    salaryRange: 'Variable / Equity based',
    growth: 'High Impact',
    exams: 'IPMAT, CAT, CUET (or self-driven)',
    icon: 'rocket',
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst',
    category: 'Business & Management',
    type: 'established',
    description:
      'Bridge teams and data. Write clear requirements and help companies choose what to build next.',
    skills: ['Excel', 'Communication', 'Process mapping', 'SQL basics', 'Tableau'],
    education: 'Commerce or any stream → BBA / B.Com / B.Tech plus internships',
    salaryRange: '₹6 – 16 LPA',
    growth: 'Steady (+20% by 2030)',
    exams: 'CUET, IPMAT, CAT',
    icon: 'briefcase',
  },
  {
    id: 'digital-marketing',
    name: 'Digital Growth Strategist',
    category: 'Business & Management',
    type: 'emerging',
    description:
      'Grow an audience with content, ads, analytics, and honest storytelling across the web.',
    skills: ['Writing', 'Analytics', 'SEO', 'Ad Campaigns', 'Social Strategy'],
    education: 'Any stream → internships, Google certifications, and a public content portfolio',
    salaryRange: '₹5 – 15 LPA',
    growth: 'High (+24% by 2030)',
    exams: 'CUET, Digital Certifications',
    icon: 'megaphone',
  },
]

export const scenarios = [
  {
    id: 'first-day',
    title: 'First day on the job',
    prompt:
      'Walk me through my first day. What would I actually do, who would I meet, and what mistakes should I avoid?',
  },
  {
    id: 'hard-problem',
    title: 'A hard problem lands',
    prompt:
      'A difficult, realistic problem just landed on my desk. Simulate the next two hours, including the questions I should ask.',
  },
  {
    id: 'team-conflict',
    title: 'Team disagreement',
    prompt:
      'My teammate and I disagree about the next step. Simulate the conversation and a professional way to resolve it.',
  },
  {
    id: 'deadline',
    title: 'Tight deadline',
    prompt:
      'The deadline moved up by two days. Simulate how I should prioritize, communicate, and still ship something useful.',
  },
]
