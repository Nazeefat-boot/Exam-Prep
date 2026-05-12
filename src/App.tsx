/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ChevronRight, 
  Clock, 
  Home as HomeIcon, 
  BarChart2, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  GraduationCap,
  Trophy,
  History,
  Wifi,
  WifiOff,
  Lightbulb,
  Star
} from 'lucide-react';
import { SUBJECTS, QUESTIONS, SUBJECT_GROUPS, COURSE_DEFINITIONS, MOTIVATION_TIPS } from './data';
import { Subject, Question, QuizResult, SubjectCategory, ExamType, CourseDefinition, MotivationTip } from './types';

type View = 'home' | 'exams' | 'courses' | 'courseDetails' | 'subjects' | 'quiz' | 'results' | 'progress' | 'review' | 'motivation' | 'mockSetup';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseDefinition | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizStartTime, setQuizStartTime] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [lastQuizResult, setLastQuizResult] = useState<QuizResult | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showToast, setShowToast] = useState<{message: string, type: 'online' | 'offline'} | null>(null);
  const [activeCategory, setActiveCategory] = useState<SubjectCategory | 'All'>('All');
  
  // Mock Exam specific state
  const [isMockExam, setIsMockExam] = useState(false);
  const [mockQuestions, setMockQuestions] = useState<(Question & { subject: Subject })[]>([]);

  // Persistence Key
  const PROGRESS_KEY = 'exam_prep_progress';

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentView === 'quiz' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentView, timeLeft]);

  // Offline status tracking and Toast logic
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowToast({ message: 'You are back online! Data synced.', type: 'online' });
      setTimeout(() => setShowToast(null), 3000);
    };
    const handleOffline = () => {
      setIsOffline(true);
      setShowToast({ message: 'Switched to offline mode. All subjects available.', type: 'offline' });
      setTimeout(() => setShowToast(null), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load results
    const savedResults = localStorage.getItem('exam_results');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }

    // Restore quiz progress if exists
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setSelectedSubject(progress.subject);
      setCurrentQuestionIndex(progress.index);
      setUserAnswers(progress.answers);
      setTimeLeft(progress.timeLeft);
      setQuizStartTime(progress.startTime);
      setIsMockExam(!!progress.isMock);
      if (progress.mockQuestions) setMockQuestions(progress.mockQuestions);
      setCurrentView('quiz');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync quiz progress to localStorage
  useEffect(() => {
    if (currentView === 'quiz' && (selectedSubject || isMockExam)) {
      const progress = {
        subject: selectedSubject,
        index: currentQuestionIndex,
        answers: userAnswers,
        timeLeft: timeLeft,
        startTime: quizStartTime,
        isMock: isMockExam,
        mockQuestions: isMockExam ? mockQuestions : null
      };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } else if (currentView !== 'quiz') {
      localStorage.removeItem(PROGRESS_KEY);
    }
  }, [currentView, currentQuestionIndex, userAnswers, timeLeft, isMockExam]);

  const saveResult = (result: QuizResult) => {
    const updatedResults = [result, ...results];
    setResults(updatedResults);
    localStorage.setItem('exam_results', JSON.stringify(updatedResults));
  };

  const startQuiz = (subject: Subject) => {
    setIsMockExam(false);
    setSelectedSubject(subject);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(QUESTIONS[subject]?.length || 0).fill(null));
    setQuizStartTime(Date.now());
    
    // JAMB has 20 questions, others might have more.
    const questionCount = selectedExam === 'JAMB' ? 20 : (QUESTIONS[subject]?.length || 0);
    const timePerQuestion = 60; // 60 seconds per question
    setTimeLeft(questionCount * timePerQuestion);
    setCurrentView('quiz');
  };

  const startMockExam = (board: ExamType, subjects: Subject[]) => {
    setIsMockExam(true);
    setSelectedExam(board);
    
    const allQuestions: (Question & { subject: Subject })[] = [];
    const questionsPerSubject = board === 'JAMB' ? 15 : 10;

    subjects.forEach(subject => {
      const subjectPool = QUESTIONS[subject] || [];
      const shuffled = [...subjectPool].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, questionsPerSubject).map(q => ({ ...q, subject }));
      allQuestions.push(...selected);
    });

    setMockQuestions(allQuestions);
    setSelectedSubject(null); // Mock exams don't have a single fixed subject
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(allQuestions.length).fill(null));
    setQuizStartTime(Date.now());
    
    // Time limit: 2 hours for JAMB, 3 hours for WAEC/NECO
    setTimeLeft(board === 'JAMB' ? 120 * 60 : 180 * 60);
    setCurrentView('quiz');
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);

    const questionsLength = isMockExam ? mockQuestions.length : (QUESTIONS[selectedSubject!]?.length || 0);

    if (currentQuestionIndex < questionsLength - 1) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 300);
    }
  };

  const submitQuiz = () => {
    if (isMockExam) {
      const breakdownMap: Record<string, { correct: number, total: number }> = {};
      
      mockQuestions.forEach((q, idx) => {
        if (!breakdownMap[q.subject]) breakdownMap[q.subject] = { correct: 0, total: 0 };
        breakdownMap[q.subject].total += 1;
        if (userAnswers[idx] === q.correctAnswerIndex) {
          breakdownMap[q.subject].correct += 1;
        }
      });

      const score = Object.values(breakdownMap).reduce((acc, curr) => acc + curr.correct, 0);
      const total = mockQuestions.length;

      const result: QuizResult = {
        id: Math.random().toString(36).substr(2, 9),
        subject: `Mock: ${selectedExam}`,
        score,
        total,
        date: Date.now(),
        isMock: true,
        breakdown: Object.entries(breakdownMap).map(([sub, data]) => ({
          subject: sub as Subject,
          score: data.correct,
          total: data.total
        }))
      };

      setLastQuizResult(result);
      saveResult(result);
      setCurrentView('results');
      return;
    }

    if (!selectedSubject) return;
    
    const questions = QUESTIONS[selectedSubject];
    const score = userAnswers.reduce((acc, ans, idx) => {
      return acc + (ans === questions[idx].correctAnswerIndex ? 1 : 0);
    }, 0);

    const result: QuizResult = {
      id: Math.random().toString(36).substr(2, 9),
      subject: selectedSubject,
      score,
      total: questions.length,
      date: Date.now(),
      isMock: false
    };

    setLastQuizResult(result);
    saveResult(result);
    setCurrentView('results');
  };

  const renderHome = () => {
    const avgAccuracy = results.length > 0 
      ? Math.round((results.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / results.length) * 100)
      : 0;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 pb-12"
      >
        <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2 font-display">Welcome Back, Scholar!</h1>
            <p className="text-emerald-50 mb-6 max-w-xs">Ready to ace your exams? Choose your target exam to begin.</p>
            <button 
              onClick={() => setCurrentView('exams')}
              className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-emerald-50 transition-colors flex items-center gap-2"
            >
              Choose Exam <ChevronRight size={20} />
            </button>
          </div>
          <GraduationCap className="absolute -bottom-4 -right-4 text-emerald-500 opacity-20 w-48 h-48 rotate-12" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => setCurrentView('progress')}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart2 size={24} />
            </div>
            <h3 className="font-bold text-gray-900">Progress</h3>
            <p className="text-sm text-gray-500">View your stats</p>
          </div>
          <div 
            onClick={() => setCurrentView('mockSetup')}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Trophy size={24} />
            </div>
            <h3 className="font-bold text-gray-900">Mock Exam</h3>
            <p className="text-sm text-gray-500">Simulate Real Exam</p>
          </div>
          <div 
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-shadow group"
          >
            <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-bold text-gray-900">{avgAccuracy}%</h3>
            <p className="text-sm text-gray-500">Avg. Accuracy</p>
          </div>
          <div 
            onClick={() => setCurrentView('motivation')}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="bg-amber-50 text-amber-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Lightbulb size={24} />
            </div>
            <h3 className="font-bold text-gray-900">Motivation</h3>
            <p className="text-sm text-gray-500">Daily tips & quotes</p>
          </div>
        </div>

        <div 
          onClick={() => setCurrentView('motivation')}
          className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden cursor-pointer group hover:border-emerald-300 transition-all"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
            <Lightbulb size={64} className="text-emerald-500" />
          </div>
          <div className="relative z-10 flex gap-4 items-center">
            <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
              <Trophy size={28} />
            </div>
            <div>
              <h3 className="font-black text-gray-900 tracking-tight">Stay Motivated!</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                "{MOTIVATION_TIPS[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % MOTIVATION_TIPS.length].text}"
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap size={20} className="text-emerald-500" /> Exam Boards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'JAMB', nick: 'JAMB', color: 'bg-emerald-50 border-emerald-100 text-emerald-700', desc: 'University Entry' },
              { id: 'WAEC', nick: 'WAEC', color: 'bg-blue-50 border-blue-100 text-blue-700', desc: 'Senior Secondary' },
              { id: 'NECO', nick: 'NECO', color: 'bg-red-50 border-red-100 text-red-700', desc: 'National Exam' }
            ].map((exam) => (
              <button
                key={exam.id}
                onClick={() => {
                  setSelectedExam(exam.id as ExamType);
                  setCurrentView(exam.id === 'JAMB' ? 'courses' : 'subjects');
                }}
                className={`p-4 rounded-2xl border ${exam.color} shadow-sm hover:shadow-md transition-all flex flex-col items-start gap-1 group`}
              >
                <span className="text-lg font-black">{exam.nick}</span>
                <span className="text-[10px] opacity-70 font-bold uppercase tracking-wider">{exam.desc}</span>
              </button>
            ))}
          </div>
        </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <History size={20} className="text-gray-400" /> Recent Performance
        </h2>
        {results.length > 0 ? (
          results.slice(0, 3).map(result => (
            <div key={result.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
              <div>
                <h4 className="font-bold text-gray-900">{result.subject}</h4>
                <p className="text-xs text-gray-400">{new Date(result.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className={`text-lg font-bold ${result.score / result.total >= 0.5 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {result.score}/{result.total}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500">No recent quizzes found.</p>
          </div>
        )}
      </div>
    </motion.div>
    );
  };

  const renderExams = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <button onClick={() => setCurrentView('home')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-black font-display">Select Exam Board</h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { id: 'JAMB', name: 'JAMB (UTME)', color: 'bg-emerald-50 text-emerald-600', description: 'Joint Admissions and Matriculation Board' },
          { id: 'WAEC', name: 'WAEC (WASSCE)', color: 'bg-blue-50 text-blue-600', description: 'West African Examinations Council' },
          { id: 'NECO', name: 'NECO (SSCE)', color: 'bg-red-50 text-red-600', description: 'National Examinations Council' }
        ].map((exam) => (
          <button
            key={exam.id}
            onClick={() => {
              setSelectedExam(exam.id as ExamType);
              setCurrentView(exam.id === 'JAMB' ? 'courses' : 'subjects');
            }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${exam.color}`}>
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{exam.name}</h3>
                <p className="text-xs text-gray-400">{exam.description}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </button>
        ))}
      </div>
    </motion.div>
  );

  const renderMockSetup = () => {
    const fields = ['Science', 'Art', 'Commercial'] as const;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 pb-20"
      >
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView('home')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-black font-display">Mock Exam Setup</h1>
        </div>

        <div className="bg-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <Trophy size={48} className="mb-4 opacity-50" />
            <h2 className="text-2xl font-black mb-2">Simulate the Real Thing</h2>
            <p className="text-purple-100 text-sm">Strict timing, mixed subjects, and randomized questions. Test your true readiness.</p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500 rounded-full opacity-20 blur-xl" />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">1. Choose Exam Board</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['JAMB', 'WAEC', 'NECO'] as ExamType[]).map(board => (
                <button
                  key={board}
                  onClick={() => setSelectedExam(board)}
                  className={`py-4 rounded-2xl border-2 font-black transition-all ${
                    selectedExam === board 
                    ? 'border-purple-600 bg-purple-50 text-purple-700' 
                    : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                  }`}
                >
                  {board}
                </button>
              ))}
            </div>
          </div>

          {selectedExam && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">2. Select Your Field</h3>
              <div className="grid grid-cols-1 gap-3">
                {fields.map(field => (
                  <button
                    key={field}
                    onClick={() => {
                      const core = SUBJECT_GROUPS['Core'];
                      const fieldSubjects = SUBJECT_GROUPS[field];
                      let mockSubjects: Subject[] = [];
                      
                      if (selectedExam === 'JAMB') {
                        // JAMB: English + 3 from field
                        mockSubjects = ['English Language', ...fieldSubjects.slice(0, 3)];
                      } else {
                        // WAEC/NECO: Core + 4/5 from field
                        mockSubjects = [...core, ...fieldSubjects.slice(0, 4)];
                      }
                      
                      startMockExam(selectedExam!, mockSubjects);
                    }}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all text-left flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                        {field[0]}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 group-hover:text-purple-600">{field} Field</span>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                          {selectedExam === 'JAMB' ? '4 Subjects total' : '8-9 Subjects total'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-purple-500" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderCourses = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <button onClick={() => setCurrentView('exams')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-black font-display">JAMB: Select Course</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COURSE_DEFINITIONS.map(course => (
          <button
            key={course.id}
            onClick={() => {
              setSelectedCourse(course);
              setCurrentView('courseDetails');
            }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-left flex flex-col group"
          >
            <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{course.name}</h3>
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{course.description}</p>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-500 gap-1">
              View Details <ChevronRight size={14} />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );

  const renderCourseDetails = () => {
    if (!selectedCourse) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 pb-10"
      >
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView('courses')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-black font-display">Course Info</h1>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-emerald-600">{selectedCourse.name}</h2>
            <p className="text-gray-600 leading-relaxed">{selectedCourse.description}</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" /> Career Paths
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedCourse.careerPaths.map(path => (
                <span key={path} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100">
                  {path}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-50">
            <h3 className="font-bold text-gray-900">Subject Combination (JAMB)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedCourse.subjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => startQuiz(subject)}
                  className="bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-emerald-600 uppercase mb-1">Practice</span>
                    <span className="font-bold text-gray-900 group-hover:text-emerald-700">{subject}</span>
                  </div>
                  <Trophy size={20} className="text-gray-200 group-hover:text-emerald-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderMotivation = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-20"
    >
      <div className="flex items-center gap-3">
        <button onClick={() => setCurrentView('home')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-black font-display">Daily Motivation</h1>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Motivational Quotes</h2>
        <div className="grid grid-cols-1 gap-4">
          {MOTIVATION_TIPS.filter(tip => tip.category === 'motivation').map(tip => (
            <div key={tip.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <div className="relative z-10">
                <p className="text-lg font-medium text-gray-800 italic leading-relaxed">"{tip.text}"</p>
                {tip.author && <p className="mt-4 text-sm font-bold text-emerald-600">— {tip.author}</p>}
              </div>
              <Lightbulb className="absolute -bottom-2 -right-2 w-16 h-16 text-emerald-50 opacity-10 group-hover:scale-110 transition-transform" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Study Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOTIVATION_TIPS.filter(tip => tip.category === 'study-tip').map(tip => (
            <div key={tip.id} className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex gap-4 items-start">
              <div className="bg-white p-2 rounded-xl shadow-sm text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-sm font-medium text-emerald-900 leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderSubjects = () => {
    const categories: (SubjectCategory | 'All')[] = ['All', 'Core', 'Science', 'Art', 'Commercial', 'Vocational'];
    
    const filteredSubjects = activeCategory === 'All' 
      ? SUBJECTS 
      : SUBJECT_GROUPS[activeCategory];

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('exams')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-black font-display">{selectedExam || 'Subjects'}</h1>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-2 p-1 bg-gray-100 rounded-2xl">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 min-w-[80px] py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSubjects.map(subject => (
            <button
              key={subject}
              onClick={() => startQuiz(subject)}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  subject.includes('Math') ? 'bg-blue-50 text-blue-600' :
                  subject.includes('Eng') || subject.includes('Lit') ? 'bg-orange-50 text-orange-600' :
                  subject.includes('Bio') || subject.includes('Agri') || subject.includes('Anim') ? 'bg-emerald-50 text-emerald-600' :
                  subject.includes('Phys') || subject.includes('Chem') ? 'bg-indigo-50 text-indigo-600' :
                  subject.includes('Gov') || subject.includes('Civ') || subject.includes('Geo') ? 'bg-red-50 text-red-600' :
                  subject.includes('Econ') || subject.includes('Comm') || subject.includes('Acc') ? 'bg-amber-50 text-amber-600' :
                  subject.includes('Rel') ? 'bg-sky-50 text-sky-600' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  {subject.includes('Math') ? <span className="font-bold text-xl">∑</span> :
                   subject.includes('Eng') || subject.includes('Lit') ? <span className="font-bold text-xl">Aa</span> :
                   subject.includes('Bio') || subject.includes('Agri') || subject.includes('Anim') ? <span className="font-bold text-xl">☘</span> :
                   subject.includes('Phys') ? <span className="font-bold text-xl">⚛</span> :
                   subject.includes('Chem') ? <span className="font-bold text-xl">⚗</span> :
                   subject.includes('Gov') || subject.includes('Civ') ? <span className="font-bold text-xl">⚖</span> :
                   subject.includes('Econ') || subject.includes('Comm') || subject.includes('Acc') ? <span className="font-bold text-xl">₦</span> :
                   subject.includes('Geo') ? <span className="font-bold text-xl">🌍</span> :
                   subject.includes('Rel') ? <span className="font-bold text-xl">📖</span> :
                   <BookOpen size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">{subject}</h3>
                  <p className="text-xs text-gray-500">{QUESTIONS[subject]?.length || 0} Questions</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
            </button>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderQuiz = () => {
    if (!selectedSubject && !isMockExam) return null;
    const questions = isMockExam ? mockQuestions : QUESTIONS[selectedSubject!];
    const question = questions[currentQuestionIndex];
    if (!question) return null;
    
    // For mock exams, we show the subject of the current question
    const currentSubject = isMockExam ? (question as any).subject : selectedSubject;

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="h-full flex flex-col pt-4">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => {
            if (isMockExam) {
              setCurrentView('mockSetup');
            } else if (selectedExam === 'JAMB') {
              setCurrentView('courseDetails');
            } else {
              setCurrentView('subjects');
            }
          }} className="text-gray-500 flex items-center gap-1">
            <ArrowLeft size={16} /> Quit
          </button>
          <div className="flex flex-col items-center">
            <div className={`px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 transition-colors duration-500 ${
              timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <Clock size={14} /> {formatTime(timeLeft)}
            </div>
            {isMockExam && (
              <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest mt-1">
                {currentSubject}
              </span>
            )}
          </div>
          <div className="text-gray-400 text-sm font-medium">
            {currentQuestionIndex + 1}/{questions.length}
          </div>
        </div>

        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-8">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            className="h-full bg-emerald-500"
          />
        </div>

        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 space-y-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            {question.text}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full p-5 rounded-2xl text-left border-2 transition-all font-medium flex items-center justify-between ${
                  userAnswers[currentQuestionIndex] === idx
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : 'border-gray-100 bg-white hover:border-gray-200 text-gray-700'
                }`}
              >
                {option}
                {userAnswers[currentQuestionIndex] === idx && (
                  <CheckCircle2 size={24} className="text-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="mt-8 pb-8 flex gap-4">
          {currentQuestionIndex > 0 && (
            <button 
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              className="flex-1 py-4 px-6 rounded-2xl border-2 border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}
          {currentQuestionIndex === questions.length - 1 ? (
            <button 
              onClick={submitQuiz}
              disabled={userAnswers[currentQuestionIndex] === null}
              className="flex-[2] py-4 px-6 rounded-2xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none hover:bg-emerald-700 transition-colors"
            >
              Finish & See Results
            </button>
          ) : (
            <button 
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              disabled={userAnswers[currentQuestionIndex] === null}
              className="flex-1 py-4 px-6 rounded-2xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none hover:bg-emerald-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!lastQuizResult) return null;
    if (!selectedSubject && !isMockExam) return null;

    const percentage = Math.round((lastQuizResult.score / lastQuizResult.total) * 100);
    const isSuccess = percentage >= 50;
    
    let grade = 'F';
    let gradeColor = 'text-red-600';
    if (percentage >= 90) { grade = 'A+'; gradeColor = 'text-emerald-600'; }
    else if (percentage >= 75) { grade = 'A'; gradeColor = 'text-emerald-500'; }
    else if (percentage >= 65) { grade = 'B'; gradeColor = 'text-blue-500'; }
    else if (percentage >= 50) { grade = 'C'; gradeColor = 'text-amber-500'; }
    else if (percentage >= 40) { grade = 'D'; gradeColor = 'text-orange-500'; }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 text-center pt-4 pb-12"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className={`w-48 h-48 rounded-full border-8 flex flex-col items-center justify-center bg-white shadow-xl ${isSuccess ? 'border-emerald-500' : 'border-red-500'}`}>
              <span className={`text-5xl font-black ${gradeColor}`}>{percentage}%</span>
              <span className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-1">Score</span>
            </div>
            <div className={`absolute -bottom-2 -right-2 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`}>
              {grade}
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black font-display text-gray-900">
              {percentage >= 75 ? 'Outstanding!' : percentage >= 50 ? 'Well Done!' : 'Keep Pushing!'}
            </h1>
            <p className="text-gray-500 font-medium">
              You answered {lastQuizResult.score} out of {lastQuizResult.total} questions correctly in {lastQuizResult.subject}.
            </p>
          </div>
        </div>

        {lastQuizResult.isMock && lastQuizResult.breakdown && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1 text-left">Subject Breakdown</h3>
            <div className="grid grid-cols-1 gap-2">
              {lastQuizResult.breakdown.map(b => (
                <div key={b.subject} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                  <span className="font-bold text-gray-700 text-sm">{b.subject}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500" 
                        style={{ width: `${(b.score / b.total) * 100}%` }} 
                      />
                    </div>
                    <span className="font-black text-xs text-gray-900">{b.score}/{b.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Status</p>
            <p className={`text-xl font-black ${isSuccess ? 'text-emerald-600' : 'text-red-500'}`}>
              {isSuccess ? 'PASSED' : 'FAILED'}
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Accuracy</p>
            <p className={`text-xl font-black ${gradeColor}`}>{percentage}%</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {!isMockExam && lastQuizResult.score < lastQuizResult.total && (
            <button 
              onClick={() => setCurrentView('review')}
              className="w-full py-5 rounded-2xl bg-white border-2 border-emerald-100 text-emerald-600 font-bold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
            >
              Review Corrections <CheckCircle2 size={20} />
            </button>
          )}
          <button 
            onClick={() => {
              if (isMockExam) {
                setCurrentView('mockSetup');
              } else if (selectedExam === 'JAMB') {
                setCurrentView('courseDetails');
              } else {
                setCurrentView('subjects');
              }
            }}
            className="w-full py-5 rounded-2xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors"
          >
            {isMockExam ? 'New Mock Exam' : 'Take Another Quiz'}
          </button>
          <button 
            onClick={() => setCurrentView('home')}
            className="w-full py-5 rounded-2xl border-2 border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    );
  };

  const renderReview = () => {
    if (!selectedSubject || !lastQuizResult) return null;
    const questions = QUESTIONS[selectedSubject];
    const incorrectQuestions = questions.filter((q, idx) => userAnswers[idx] !== q.correctAnswerIndex);

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 pb-12"
      >
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView('results')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-black font-display">Corrections</h1>
        </div>

        <div className="space-y-6">
          {incorrectQuestions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No incorrect answers to review!</p>
            </div>
          ) : (
            incorrectQuestions.map((question, idx) => {
              const originalIdx = questions.findIndex(q => q.id === question.id);
              const userAnswerIdx = userAnswers[originalIdx];
              
              return (
                <div key={question.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                  <div className="flex gap-2">
                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold h-fit">Question {idx + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{question.text}</h3>
                  <div className="space-y-2">
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-red-400 font-bold uppercase mb-1">Your Answer</p>
                        <p className="font-bold text-red-700">{userAnswerIdx !== null ? question.options[userAnswerIdx] : 'No answer selected'}</p>
                      </div>
                      <XCircle className="text-red-400" size={20} />
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Correct Answer</p>
                        <p className="font-bold text-emerald-700">{question.options[question.correctAnswerIndex]}</p>
                      </div>
                      <CheckCircle2 className="text-emerald-400" size={20} />
                    </div>
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                    <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Explanation</p>
                    <p className="text-sm text-blue-700 leading-relaxed">{question.explanation}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button 
          onClick={() => setCurrentView('results')}
          className="w-full py-5 rounded-2xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors"
        >
          Back to Results
        </button>
      </motion.div>
    );
  };

  const renderProgress = () => {
    const totalQuizzes = results.length;
    const avgScore = totalQuizzes > 0 
      ? Math.round((results.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / totalQuizzes) * 100)
      : 0;
    
    // Group results by subject to find mastery
    const subjectStats: Record<string, { total: number, correct: number, count: number }> = {};
    results.forEach(res => {
      if (!subjectStats[res.subject]) {
        subjectStats[res.subject] = { total: 0, correct: 0, count: 0 };
      }
      subjectStats[res.subject].total += res.total;
      subjectStats[res.subject].correct += res.score;
      subjectStats[res.subject].count += 1;
    });

    const topSubject = Object.entries(subjectStats).reduce((prev, curr) => {
      const prevAcc = prev[1].correct / prev[1].total;
      const currAcc = curr[1].correct / curr[1].total;
      return currAcc > prevAcc ? curr : prev;
    }, ['', { total: 1, correct: 0, count: 0 }] as [string, { total: number, correct: number, count: number }]);

    // Performance trend (last 5)
    const recentTrend = [...results].reverse().slice(-5);

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 pb-20"
      >
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView('home')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-black font-display">Growth Tracking</h1>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Avg. Accuracy</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-600">{avgScore}%</span>
              {results.length > 1 && (
                <span className="text-xs font-bold text-emerald-500 flex items-center">
                  +{Math.round(Math.random() * 5)}% growth
                </span>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Study Streak</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-orange-500">2 Days</span>
              <span className="text-xs font-bold text-gray-400">Keep it up!</span>
            </div>
          </div>
        </div>

        {/* Performance Trend Chart (Simple CSS) */}
        {results.length > 1 && (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="font-bold text-gray-900">Performance Trend</h2>
            <div className="flex items-end justify-between h-40 gap-2 pt-4">
              {results.slice(-7).map((res, i) => {
                const height = (res.score / res.total) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex flex-col justify-end h-full">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        className={`w-full rounded-t-lg transition-all ${
                          height >= 70 ? 'bg-emerald-500' : height >= 40 ? 'bg-amber-400' : 'bg-red-400'
                        }`}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] py-1 px-2 rounded font-bold whitespace-nowrap">
                        {Math.round(height)}%
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 rotate-45 mt-2 origin-left truncate max-w-[40px]">
                      {res.subject.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Subject Mastery */}
        <div className="space-y-4">
          <h2 className="font-bold text-gray-900">Subject Mastery</h2>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(subjectStats).map(([subject, stats]) => {
              const accuracy = Math.round((stats.correct / stats.total) * 100);
              return (
                <div key={subject} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">{subject}</span>
                    <span className={`font-black ${accuracy >= 70 ? 'text-emerald-600' : accuracy >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
                      {accuracy}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        accuracy >= 70 ? 'bg-emerald-500' : accuracy >= 40 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-right">
                    {stats.count} attempts • {stats.total} total questions
                  </p>
                </div>
              );
            })}
            {Object.keys(subjectStats).length === 0 && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400">
                Finish a quiz to see subject breakdowns
              </div>
            )}
          </div>
        </div>

        {/* Recent History */}
        <div className="space-y-4">
          <h2 className="font-bold text-gray-900">Recent Activity</h2>
          {results.length > 0 ? (
            results.slice(0, 5).map(result => (
              <div key={result.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${result.score / result.total >= 0.5 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {result.score / result.total >= 0.5 ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{result.subject}</h4>
                    <p className="text-xs text-gray-400">{new Date(result.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{result.score}/{result.total}</div>
                  <div className="text-[10px] font-black text-emerald-600 uppercase">Passed</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">Your growth story starts here!</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notifications */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-sm ${
              showToast.type === 'online' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-white'
            }`}
          >
            {showToast.type === 'online' ? <Wifi size={18} /> : <WifiOff size={18} />}
            {showToast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Network Status Header */}
      <AnimatePresence>
        {isOffline && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-center gap-4 text-white text-sm font-medium sticky top-0 z-40"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Offline Mode Active
            </div>
            <div className="h-4 w-[1px] bg-gray-600"></div>
            <div className="flex items-center gap-1 text-gray-300">
              <CheckCircle2 size={14} className="text-emerald-400" /> All Subjects Cached
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 pb-24 pt-8">
        <AnimatePresence mode="wait">
          {currentView === 'home' && renderHome()}
          {currentView === 'exams' && renderExams()}
          {currentView === 'courses' && renderCourses()}
          {currentView === 'courseDetails' && renderCourseDetails()}
          {currentView === 'subjects' && renderSubjects()}
          {currentView === 'quiz' && renderQuiz()}
          {currentView === 'results' && renderResults()}
          {currentView === 'progress' && renderProgress()}
          {currentView === 'review' && renderReview()}
          {currentView === 'motivation' && renderMotivation()}
          {currentView === 'mockSetup' && renderMockSetup()}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      {currentView !== 'quiz' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-around shadow-[0_-1px_15px_rgba(0,0,0,0.05)] z-20 backdrop-blur-md bg-white/90">
          <button 
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'home' ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <HomeIcon size={24} />
            <span className="text-xs font-bold">Home</span>
          </button>
          <button 
            onClick={() => setCurrentView('mockSetup')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'mockSetup' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Trophy size={24} />
            <span className="text-xs font-bold">Mock Exam</span>
          </button>
          <button 
            onClick={() => setCurrentView('progress')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'progress' ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BarChart2 size={24} />
            <span className="text-xs font-bold">Progress</span>
          </button>
          <button 
            onClick={() => setCurrentView('motivation')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'motivation' ? 'text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Lightbulb size={24} />
            <span className="text-xs font-bold">Motivation</span>
          </button>
        </nav>
      )}
    </div>
  );
}

