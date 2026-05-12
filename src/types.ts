export type SubjectCategory = 'Core' | 'Science' | 'Art' | 'Commercial' | 'Vocational';
export type ExamType = 'JAMB' | 'WAEC' | 'NECO';

export interface CourseDefinition {
  id: string;
  name: string;
  description: string;
  subjects: Subject[];
  careerPaths: string[];
}

export type Subject = 
  | 'Mathematics' 
  | 'English Language' 
  | 'Biology' 
  | 'Chemistry' 
  | 'Physics' 
  | 'Economics' 
  | 'Government' 
  | 'Geography' 
  | 'Literature in English' 
  | 'Civic Education' 
  | 'Agricultural Science' 
  | 'Commerce' 
  | 'Financial Accounting' 
  | 'Christian Religious Studies' 
  | 'Islamic Religious Studies' 
  | 'Further Mathematics' 
  | 'Animal Husbandry' 
  | 'Data Processing'
  | 'Marketing'
  | 'Technical Drawing'
  | 'Office Practice'
  | 'Insurance'
  | 'History'
  | 'French'
  | 'Visual Arts'
  | 'Music'
  | 'Physical and Health Education'
  | 'Computer Studies'
  | 'Yoruba'
  | 'Hausa'
  | 'Igbo'
  | 'Catering Craft Practice'
  | 'Garment Making'
  | 'Photography'
  | 'Dyeing & Bleaching'
  | 'Cosmetology';

export interface SubjectInfo {
  name: Subject;
  category: SubjectCategory;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizSession {
  subject: Subject;
  questions: Question[];
  startTime: number;
  userAnswers: (number | null)[];
}

export interface SubjectBreakdown {
  subject: Subject;
  score: number;
  total: number;
}

export interface QuizResult {
  id: string;
  subject: Subject | string;
  score: number;
  total: number;
  date: number;
  isMock?: boolean;
  breakdown?: SubjectBreakdown[];
}

export interface MotivationTip {
  id: string;
  text: string;
  author?: string;
  category: 'motivation' | 'study-tip';
}
