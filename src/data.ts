import { Question, Subject, SubjectCategory, CourseDefinition, MotivationTip } from './types';

export const SUBJECTS: Subject[] = [
  'Mathematics', 
  'English Language', 
  'Biology', 
  'Chemistry', 
  'Physics', 
  'Economics', 
  'Government', 
  'Geography', 
  'Literature in English', 
  'Civic Education', 
  'Agricultural Science', 
  'Commerce', 
  'Financial Accounting', 
  'Christian Religious Studies', 
  'Islamic Religious Studies', 
  'Further Mathematics', 
  'Animal Husbandry', 
  'Data Processing',
  'Marketing',
  'Technical Drawing',
  'Office Practice',
  'Insurance',
  'History',
  'French',
  'Visual Arts',
  'Music',
  'Physical and Health Education',
  'Computer Studies',
  'Yoruba',
  'Hausa',
  'Igbo',
  'Catering Craft Practice',
  'Garment Making',
  'Photography',
  'Dyeing & Bleaching',
  'Cosmetology'
];

export const SUBJECT_GROUPS: Record<SubjectCategory, Subject[]> = {
  'Core': ['English Language', 'Mathematics', 'Civic Education', 'Data Processing', 'Computer Studies', 'Physical and Health Education'],
  'Science': ['Biology', 'Chemistry', 'Physics', 'Further Mathematics', 'Agricultural Science', 'Animal Husbandry', 'Technical Drawing'],
  'Art': ['Literature in English', 'Government', 'Geography', 'Christian Religious Studies', 'Islamic Religious Studies', 'History', 'French', 'Visual Arts', 'Music', 'Yoruba', 'Hausa', 'Igbo'],
  'Commercial': ['Economics', 'Commerce', 'Financial Accounting', 'Marketing', 'Office Practice', 'Insurance'],
  'Vocational': ['Catering Craft Practice', 'Garment Making', 'Photography', 'Dyeing & Bleaching', 'Cosmetology']
};

export const COURSE_DEFINITIONS: CourseDefinition[] = [
  {
    id: 'medicine',
    name: 'Medicine and Surgery',
    description: 'The study of the principles and practice of medicine and surgery. It involves diagnosing and treating human diseases.',
    subjects: ['English Language', 'Biology', 'Chemistry', 'Physics'],
    careerPaths: ['Hospital Doctor', 'Medical Researcher', 'Surgeon', 'Public Health Officer']
  },
  {
    id: 'engineering',
    name: 'Mechanical Engineering',
    description: 'Deals with the design, construction, and use of machines. It applies principles of physics and materials science.',
    subjects: ['English Language', 'Mathematics', 'Physics', 'Chemistry'],
    careerPaths: ['Design Engineer', 'Automotive Engineer', 'Manufacturing Consultant', 'Systems Analyst']
  },
  {
    id: 'law',
    name: 'Law',
    description: 'The study of the rules and regulations that govern a society. It covers judicial processes and legal frameworks.',
    subjects: ['English Language', 'Literature in English', 'Government', 'Economics'],
    careerPaths: ['Lawyer', 'Judge', 'Legal Consultant', 'Diplomat', 'Politician']
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'The process of recording, summarizing, and analyzing financial transactions. It is vital for business transparency.',
    subjects: ['English Language', 'Mathematics', 'Economics', 'Financial Accounting'],
    careerPaths: ['Auditor', 'Financial Accountant', 'Tax Consultant', 'Budget Analyst']
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    description: 'The study of computers and computational systems. It includes software engineering, AI, and cybersecurity.',
    subjects: ['English Language', 'Mathematics', 'Physics', 'Chemistry'],
    careerPaths: ['Software Developer', 'Data Scientist', 'Network Architect', 'Security Analyst']
  },
  {
    id: 'business-admin',
    name: 'Business Administration',
    description: 'The management of business operations and decision-making. It covers marketing, finance, and human resources.',
    subjects: ['English Language', 'Mathematics', 'Economics', 'Government'],
    careerPaths: ['Business Manager', 'Consultant', 'HR Specialist', 'Operations Manager']
  },
  {
    id: 'nursing',
    name: 'Nursing Science',
    description: 'Focuses on the care of individuals, families, and communities to attain or recover optimal health. It combines medical theory with practical care.',
    subjects: ['English Language', 'Biology', 'Chemistry', 'Physics'],
    careerPaths: ['Registered Nurse', 'Nurse Practitioner', 'Public Health Nurse', 'Clinical Researcher']
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    description: 'The science and technique of preparing, dispensing, and reviewing drugs. It ensures the safe and effective use of pharmaceutical products.',
    subjects: ['English Language', 'Biology', 'Chemistry', 'Physics'],
    careerPaths: ['Pharmacist', 'Pharmacologist', 'Quality Control Analyst', 'Clinical Research Associate']
  },
  {
    id: 'architecture',
    name: 'Architecture',
    description: 'The art and science of designing buildings and other physical structures. It involves aesthetics, functionality, and structural integrity.',
    subjects: ['English Language', 'Mathematics', 'Physics', 'Geography'],
    careerPaths: ['Architect', 'Urban Planner', 'Interior Designer', 'Construction Manager']
  },
  {
    id: 'mass-comm',
    name: 'Mass Communication',
    description: 'The study of spreading information to a large audience through various media channels like journalism, broadcasting, and advertising.',
    subjects: ['English Language', 'Literature in English', 'Government', 'Christian Religious Studies'],
    careerPaths: ['Journalist', 'Public Relations Specialist', 'Broadcaster', 'Advertising Executive']
  },
  {
    id: 'economics-jamb',
    name: 'Economics',
    description: 'A social science that studies the production, distribution, and consumption of goods and services. It helps in making policy decisions.',
    subjects: ['English Language', 'Mathematics', 'Economics', 'Government'],
    careerPaths: ['Economist', 'Financial Analyst', 'Data Analyst', 'Policy Advisor']
  },
  {
    id: 'political-science',
    name: 'Political Science',
    description: 'The study of systems of government and the analysis of political activity and behavior. It covers international relations and public policy.',
    subjects: ['English Language', 'Government', 'Economics', 'Literature in English'],
    careerPaths: ['Political Analyst', 'Public Administrator', 'Diplomat', 'Legislative Assistant']
  },
  {
    id: 'civil-eng',
    name: 'Civil Engineering',
    description: 'Deals with the design, construction, and maintenance of the physical and naturally built environment, including works like roads and bridges.',
    subjects: ['English Language', 'Mathematics', 'Physics', 'Chemistry'],
    careerPaths: ['Civil Engineer', 'Structural Engineer', 'Geotechnical Engineer', 'Project Manager']
  },
  {
    id: 'biochemistry',
    name: 'Biochemistry',
    description: 'The study of chemical processes within and relating to living organisms. It bridges biology and chemistry.',
    subjects: ['English Language', 'Biology', 'Chemistry', 'Physics'],
    careerPaths: ['Biochemist', 'Laboratory Technician', 'toxicologist', 'Forensic Scientist']
  },
  {
    id: 'banking-finance',
    name: 'Banking and Finance',
    description: 'The study of financial systems, including banking, investments, and capital markets. It prepares students for the banking sector.',
    subjects: ['English Language', 'Mathematics', 'Economics', 'Government'],
    careerPaths: ['Investment Banker', 'Financial Analyst', 'Credit Manager', 'Stockbroker']
  },
  {
    id: 'sociology',
    name: 'Sociology',
    description: 'The study of social life, social change, and the social causes and consequences of human behavior. It examines human interactions.',
    subjects: ['English Language', 'Government', 'Economics', 'Geography'],
    careerPaths: ['Social Worker', 'Sociologist', 'Policy Analyst', 'Community Organizer']
  },
  {
    id: 'psychology',
    name: 'Psychology',
    description: 'The scientific study of the mind and behavior. It includes various fields like clinical, cognitive, and social psychology.',
    subjects: ['English Language', 'Biology', 'Mathematics', 'Economics'],
    careerPaths: ['Clinical Psychologist', 'Counselor', 'HR Specialist', 'Market Researcher']
  },
  {
    id: 'microbiology',
    name: 'Microbiology',
    description: 'The study of microscopic organisms, such as bacteria, viruses, archaea, fungi and protozoa. It involves research into infectious diseases.',
    subjects: ['English Language', 'Biology', 'Chemistry', 'Physics'],
    careerPaths: ['Microbiologist', 'Biomedical Scientist', 'Quality Control Scientist', 'Food Technologist']
  },
  {
    id: 'estate-management',
    name: 'Estate Management',
    description: 'The management of physical assets, typically real estate, and involves the appraisal and disposal of properties.',
    subjects: ['English Language', 'Mathematics', 'Economics', 'Geography'],
    careerPaths: ['Real Estate Manager', 'Valuer', 'Property Developer', 'Facility Manager']
  },
  {
    id: 'geology',
    name: 'Geology',
    description: 'The study of the Earth, the materials of which it is made, the structure of those materials, and the processes acting upon them.',
    subjects: ['English Language', 'Physics', 'Chemistry', 'Mathematics'],
    careerPaths: ['Geologist', 'Petroleum Engineer', 'Environmental Consultant', 'Seismologist']
  }
];

const createPlaceholderQuestions = (subject: Subject, count: number, startId: number): Question[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${subject.toLowerCase().slice(0, 3)}${startId + i}`,
    text: `Sample question ${startId + i} for ${subject}. This is a practice question to help you prepare.`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswerIndex: Math.floor(Math.random() * 4),
    explanation: `This is a detailed explanation for question ${startId + i} in ${subject}. Understanding the core concepts is key to success.`
  }));
};

const MATH_QUESTIONS: Question[] = [
    { id: 'm1', text: 'Solve for x if 2x + 5 = 15', options: ['5', '10', '7.5', '20'], correctAnswerIndex: 0, explanation: 'Subtract 5 from both sides: 2x = 10. Divide by 2: x = 5.' },
    { id: 'm2', text: 'What is the square root of 144?', options: ['10', '11', '12', '14'], correctAnswerIndex: 2, explanation: '12 multiplied by 12 equals 144.' },
    { id: 'm3', text: 'Find the area of a rectangle with length 8cm and width 5cm.', options: ['13cm²', '40cm²', '26cm²', '35cm²'], correctAnswerIndex: 1, explanation: 'Area = Length × Width = 8 × 5 = 40cm².' },
    { id: 'm4', text: 'What is the value of Pi (π) to two decimal places?', options: ['3.12', '3.14', '3.16', '3.18'], correctAnswerIndex: 1, explanation: 'Pi is approximately 3.14159...' },
    { id: 'm5', text: 'If a triangle has angles 60° and 40°, what is the third angle?', options: ['80°', '90°', '100°', '70°'], correctAnswerIndex: 0, explanation: 'Sum of angles in a triangle is 180°. 180 - (60 + 40) = 80°.' },
    { id: 'm6', text: 'What is 15% of 200?', options: ['20', '25', '30', '35'], correctAnswerIndex: 2, explanation: '0.15 × 200 = 30.' },
    { id: 'm7', text: 'Solve for y: 3y - 7 = 8', options: ['3', '5', '15', '2'], correctAnswerIndex: 1, explanation: '3y = 15, so y = 5.' },
    { id: 'm8', text: 'Which of these is a prime number?', options: ['4', '9', '11', '15'], correctAnswerIndex: 2, explanation: 'A prime number is only divisible by 1 and itself.' },
    { id: 'm9', text: 'What is the volume of a cube with side 3cm?', options: ['9cm³', '18cm³', '27cm³', '12cm³'], correctAnswerIndex: 2, explanation: 'Volume = side³ = 3 × 3 × 3 = 27cm³.' },
    { id: 'm10', text: 'What is the sum of 1/2 and 1/4?', options: ['1/6', '2/6', '3/4', '1/2'], correctAnswerIndex: 2, explanation: '1/2 + 1/4 = 2/4 + 1/4 = 3/4.' },
    ...createPlaceholderQuestions('Mathematics', 15, 11)
];

const ENGLISH_QUESTIONS: Question[] = [
    { id: 'e1', text: 'Choose the option that is most nearly opposite in meaning to "Vivid".', options: ['Bright', 'Clear', 'Dull', 'Strong'], correctAnswerIndex: 2, explanation: '"Vivid" means bright or intense, so "Dull" is its opposite.' },
    { id: 'e2', text: 'Which of these is a synonym for "Courageous"?', options: ['Fearful', 'Brave', 'Weak', 'Shy'], correctAnswerIndex: 1, explanation: '"Courageous" and "Brave" both mean showing courage.' },
    { id: 'e3', text: 'Complete the sentence: "He _____ to school every day."', options: ['go', 'goes', 'going', 'gone'], correctAnswerIndex: 1, explanation: 'The third-person singular "He" requires the verb form "goes".' },
    { id: 'e4', text: 'Identify the noun in this sentence: "The cat sat on the mat."', options: ['Sat', 'On', 'Cat', 'The'], correctAnswerIndex: 2, explanation: '"Cat" is a person, place, or thing.' },
    { id: 'e5', text: 'What is the past tense of "Bring"?', options: ['Bringed', 'Brought', 'Brang', 'Bought'], correctAnswerIndex: 1, explanation: 'The past tense of bring is brought.' },
    { id: 'e6', text: 'Which word is correctly spelled?', options: ['Receive', 'Recieve', 'Receve', 'Recive'], correctAnswerIndex: 0, explanation: 'Remember "i before e except after c".' },
    { id: 'e7', text: 'What is a collective noun for "lions"?', options: ['Pack', 'Herd', 'Pride', 'Flock'], correctAnswerIndex: 2, explanation: 'A group of lions is called a pride.' },
    { id: 'e8', text: 'Which of these is an adjective?', options: ['Run', 'Quickly', 'Beautiful', 'Happiness'], correctAnswerIndex: 2, explanation: 'Beautiful describes a noun.' },
    { id: 'e9', text: 'Choose the correct preposition: "She is interested ___ music."', options: ['In', 'At', 'On', 'With'], correctAnswerIndex: 0, explanation: 'The correct idiom is "interested in".' },
    { id: 'e10', text: 'What is the opposite of "Generous"?', options: ['Kind', 'Stingy', 'Happy', 'Rich'], correctAnswerIndex: 1, explanation: 'Stingy means unwilling to give or spend.' },
    ...createPlaceholderQuestions('English Language', 15, 11)
];

const BIOLOGY_QUESTIONS: Question[] = [
    { id: 'b1', text: 'Which organelle is known as the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Vacuole'], correctAnswerIndex: 1, explanation: 'Mitochondria are responsible for ATP production.' },
    { id: 'b2', text: 'What is the green pigment in plants used for photosynthesis?', options: ['Hemoglobin', 'Chlorophyll', 'Melanin', 'Carotene'], correctAnswerIndex: 1, explanation: 'Chlorophyll absorbs light energy.' },
    { id: 'b3', text: 'Which part of the blood carries oxygen?', options: ['White blood cells', 'Platelets', 'Red blood cells', 'Plasma'], correctAnswerIndex: 2, explanation: 'Red blood cells contain hemoglobin.' },
    { id: 'b4', text: 'The study of heredity is called:', options: ['Ecology', 'Genetics', 'Botany', 'Zoology'], correctAnswerIndex: 1, explanation: 'Genetics is the science of genes and heredity.' },
    { id: 'b5', text: 'Which of these is a sense organ?', options: ['Heart', 'Tongue', 'Lungs', 'Stomach'], correctAnswerIndex: 1, explanation: 'The tongue is the organ for taste.' },
    ...createPlaceholderQuestions('Biology', 20, 6)
];

const CHEMISTRY_QUESTIONS: Question[] = [
    { id: 'c1', text: 'What is the atomic number of Hydrogen?', options: ['1', '2', '3', '4'], correctAnswerIndex: 0, explanation: 'Hydrogen is the first element.' },
    { id: 'c2', text: 'What is the chemical symbol for Gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctAnswerIndex: 2, explanation: 'Au is from Aurum.' },
    { id: 'c3', text: 'Which gas is most abundant in the Earth\'s atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'], correctAnswerIndex: 1, explanation: 'Nitrogen is 78%.' },
    { id: 'c4', text: 'What is the pH of pure water?', options: ['0', '7', '14', '1'], correctAnswerIndex: 1, explanation: 'Pure water is neutral (7).' },
    { id: 'c5', text: 'What is the common name for NaCl?', options: ['Sugar', 'Salt', 'Baking Soda', 'Vinegar'], correctAnswerIndex: 1, explanation: 'Sodium Chloride.' },
    ...createPlaceholderQuestions('Chemistry', 20, 6)
];

const PHYSICS_QUESTIONS: Question[] = [
    { id: 'p1', text: 'What is the SI unit of force?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correctAnswerIndex: 1, explanation: 'The Newton (N) is the SI unit of force.' },
    { id: 'p2', text: 'What is the speed of light in a vacuum?', options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s'], correctAnswerIndex: 0, explanation: 'Light travels at approx 3 × 10⁸ m/s.' },
    { id: 'p3', text: 'Which law states that energy cannot be created or destroyed?', options: ['Hooke\'s Law', 'Ohm\'s Law', 'Law of Conservation of Energy', 'Newton\'s First Law'], correctAnswerIndex: 2, explanation: 'Energy only changes from one form to another.' },
    ...createPlaceholderQuestions('Physics', 22, 4)
];

const ECONOMICS_QUESTIONS: Question[] = [
    { id: 'ec1', text: 'The fundamental economic problem facing all societies is:', options: ['Unemployment', 'Inflation', 'Scarcity', 'Poverty'], correctAnswerIndex: 2, explanation: 'Scarcity refers to limited resources.' },
    ...createPlaceholderQuestions('Economics', 24, 2)
];

const GOVERNMENT_QUESTIONS: Question[] = [
    { id: 'g1', text: 'Who was the first ceremonial President of Nigeria?', options: ['Obafemi Awolowo', 'Nnamdi Azikiwe', 'Abubakar Tafawa Balewa', 'Shehu Shagari'], correctAnswerIndex: 1, explanation: 'Dr. Nnamdi Azikiwe.' },
    ...createPlaceholderQuestions('Government', 24, 2)
];

const GEOGRAPHY_QUESTIONS: Question[] = [
    { id: 'geo1', text: 'Which is the largest continent by land area?', options: ['Africa', 'Asia', 'Europe', 'South America'], correctAnswerIndex: 1, explanation: 'Asia is the largest.' },
    ...createPlaceholderQuestions('Geography', 24, 2)
];

const LITERATURE_QUESTIONS: Question[] = [
    { id: 'lit1', text: 'Who wrote the novel "Things Fall Apart"?', options: ['Wole Soyinka', 'Chinua Achebe', 'Chimamanda Ngozi Adichie', 'Ben Okri'], correctAnswerIndex: 1, explanation: 'Chinua Achebe.' },
    ...createPlaceholderQuestions('Literature in English', 24, 2)
];

const CIVIC_QUESTIONS: Question[] = [
    { id: 'civ1', text: 'What is national integration?', options: ['Unity', 'War', 'Trade', 'Debt'], correctAnswerIndex: 0, explanation: 'National unity.' },
    ...createPlaceholderQuestions('Civic Education', 24, 2)
];

export const QUESTIONS: Record<Subject, Question[]> = {
  'Mathematics': MATH_QUESTIONS,
  'English Language': ENGLISH_QUESTIONS,
  'Biology': BIOLOGY_QUESTIONS,
  'Chemistry': CHEMISTRY_QUESTIONS,
  'Physics': PHYSICS_QUESTIONS,
  'Economics': ECONOMICS_QUESTIONS,
  'Government': GOVERNMENT_QUESTIONS,
  'Geography': GEOGRAPHY_QUESTIONS,
  'Literature in English': LITERATURE_QUESTIONS,
  'Civic Education': CIVIC_QUESTIONS,
  'Agricultural Science': createPlaceholderQuestions('Agricultural Science', 25, 1),
  'Commerce': createPlaceholderQuestions('Commerce', 25, 1),
  'Financial Accounting': createPlaceholderQuestions('Financial Accounting', 25, 1),
  'Christian Religious Studies': createPlaceholderQuestions('Christian Religious Studies', 25, 1),
  'Islamic Religious Studies': createPlaceholderQuestions('Islamic Religious Studies', 25, 1),
  'Further Mathematics': createPlaceholderQuestions('Further Mathematics', 25, 1),
  'Animal Husbandry': createPlaceholderQuestions('Animal Husbandry', 25, 1),
  'Data Processing': createPlaceholderQuestions('Data Processing', 25, 1),
  'Marketing': createPlaceholderQuestions('Marketing', 25, 1),
  'Technical Drawing': createPlaceholderQuestions('Technical Drawing', 25, 1),
  'Office Practice': createPlaceholderQuestions('Office Practice', 25, 1),
  'Insurance': createPlaceholderQuestions('Insurance', 25, 1),
  'History': createPlaceholderQuestions('History', 25, 1),
  'French': createPlaceholderQuestions('French', 25, 1),
  'Visual Arts': createPlaceholderQuestions('Visual Arts', 25, 1),
  'Music': createPlaceholderQuestions('Music', 25, 1),
  'Physical and Health Education': createPlaceholderQuestions('Physical and Health Education', 20, 1),
  'Computer Studies': createPlaceholderQuestions('Computer Studies', 20, 1),
  'Yoruba': createPlaceholderQuestions('Yoruba', 20, 1),
  'Hausa': createPlaceholderQuestions('Hausa', 20, 1),
  'Igbo': createPlaceholderQuestions('Igbo', 20, 1),
  'Catering Craft Practice': createPlaceholderQuestions('Catering Craft Practice', 20, 1),
  'Garment Making': createPlaceholderQuestions('Garment Making', 20, 1),
  'Photography': createPlaceholderQuestions('Photography', 20, 1),
  'Dyeing & Bleaching': createPlaceholderQuestions('Dyeing & Bleaching', 20, 1),
  'Cosmetology': createPlaceholderQuestions('Cosmetology', 20, 1)
};

export const MOTIVATION_TIPS: MotivationTip[] = [
  {
    id: 'm1',
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
    category: 'motivation'
  },
  {
    id: 'm2',
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    category: 'motivation'
  },
  {
    id: 'm3',
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: 'motivation'
  },
  {
    id: 'm4',
    text: "Don't let what you cannot do interfere with what you can do.",
    author: "John Wooden",
    category: 'motivation'
  },
  {
    id: 'm5',
    text: "Take short breaks every 45-60 minutes to keep your mind fresh and focused.",
    category: 'study-tip'
  },
  {
    id: 'm6',
    text: "Teach what you've learned to someone else. It's the best way to solidify your knowledge.",
    category: 'study-tip'
  },
  {
    id: 'm7',
    text: "Stay hydrated and get enough sleep. A well-rested brain performs 50% better.",
    category: 'study-tip'
  },
  {
    id: 'm8',
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
    category: 'motivation'
  },
  {
    id: 'm9',
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: 'motivation'
  },
  {
    id: 'm10',
    text: "Practice active recall. Instead of re-reading, test yourself on the material.",
    category: 'study-tip'
  }
];
