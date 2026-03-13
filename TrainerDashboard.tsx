import React, { useState } from 'react';
import { User, Batch, ThemeProps, Task } from './types';
import DashboardLayout from './DashboardLayout';
import { 
  LayoutDashboard, BookOpen, UserCheck, CheckSquare, 
  Calendar, Clock, PlusCircle, GraduationCap, Star, 
  FileText, CheckCircle, Search, Download, Users, X, Save,
  Sparkles, Bot, Loader2, HelpCircle, Upload, MessageSquare, Send
} from 'lucide-react';
import { MOCK_BATCHES, MOCK_USERS, MOCK_QUIZZES, MOCK_MATERIALS } from './constants';
import { generateLearningContent, analyzeStudentProgress } from './services/geminiService';
import Markdown from 'react-markdown';

interface TrainerDashboardProps {
  user: User;
  onLogout: () => void;
  themeProps: ThemeProps;
  registeredUsers?: User[];
  setRegisteredUsers?: React.Dispatch<React.SetStateAction<User[]>>;
}

// --- Modals ---

const GradeSubmissionModal = ({ 
  isOpen, 
  onClose, 
  submission, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  submission: any;
  onSave: (id: number, grade: number, feedback: string) => void;
}) => {
  const [grade, setGrade] = useState(submission?.grade || '');
  const [feedback, setFeedback] = useState(submission?.feedback || '');

  // Reset state when submission changes
  React.useEffect(() => {
    if (submission) {
        setGrade(submission.grade || '');
        setFeedback(submission.feedback || '');
    }
  }, [submission]);

  if (!isOpen || !submission) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(submission.id, Number(grade), feedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Grade Submission</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{submission.student} - {submission.task}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Score (0-100)
            </label>
            <input 
                type="number" 
                min="0" 
                max="100" 
                required
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-lg font-semibold" 
                placeholder="e.g. 85"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Feedback
            </label>
            <textarea 
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Enter constructive feedback for the student..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 font-medium">
                Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-lg shadow-blue-500/30">
                <Save className="w-4 h-4" />
                Save Grade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AIAssistantTab = ({ submissions }: { submissions: any[] }) => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('Beginners');
  const [format, setFormat] = useState('Lesson Plan');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentAnalysis, setStudentAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Get unique students from submissions
  const uniqueStudents = Array.from(new Set(submissions.map(s => s.student)));

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    
    setIsGeneratingContent(true);
    try {
      const content = await generateLearningContent(topic, audience, format);
      setGeneratedContent(content);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleAnalyzeStudent = async () => {
    if (!selectedStudent) return;
    
    setIsAnalyzing(true);
    try {
      const studentSubmissions = submissions.filter(s => s.student === selectedStudent);
      const analysis = await analyzeStudentProgress(selectedStudent, studentSubmissions);
      setStudentAnalysis(analysis);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
          <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-indigo-500" />
                AI Assistant
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Generate learning content and analyze student progress with Gemini AI</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Generator */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Bot className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Learning Content Generator</h2>
          </div>
          
          <form onSubmit={handleGenerateContent} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic</label>
              <input 
                type="text" 
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., React Context API, Async/Await"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Audience</label>
                <select 
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Beginners">Beginners</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Format</label>
                <select 
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Lesson Plan">Lesson Plan</option>
                  <option value="Quiz (5 questions)">Quiz</option>
                  <option value="Summary">Summary</option>
                  <option value="Code Example">Code Example</option>
                </select>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isGeneratingContent || !topic}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingContent ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isGeneratingContent ? 'Generating...' : 'Generate Content'}
            </button>
          </form>

          {generatedContent && (
            <div className="mt-4 flex-grow bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700 overflow-y-auto max-h-[400px]">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <Markdown>{generatedContent}</Markdown>
              </div>
            </div>
          )}
        </div>

        {/* Student Progress Analyzer */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Student Progress Analyzer</h2>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Student</label>
              <select 
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Choose a student...</option>
                {uniqueStudents.map(student => (
                  <option key={student} value={student}>{student}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleAnalyzeStudent}
              disabled={isAnalyzing || !selectedStudent}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isAnalyzing ? 'Analyzing...' : 'Analyze Progress'}
            </button>
          </div>

          {studentAnalysis && (
            <div className="mt-4 flex-grow bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-6 border border-emerald-100 dark:border-emerald-800/30 overflow-y-auto max-h-[400px]">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <Markdown>{studentAnalysis}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssignTaskModal = ({
  isOpen,
  onClose,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [batch, setBatch] = useState('');
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, batch, dueDate, id: Date.now(), status: 'Active', submissions: 0, total: 25 });
    onClose();
    setTitle('');
    setDescription('');
    setBatch('');
    setDueDate('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assign New Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task Title
            </label>
            <input 
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., React Hooks Assignment"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
            </label>
            <textarea 
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Describe the task requirements..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Batch
              </label>
              <select 
                  required
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                  <option value="">Select Batch</option>
                  {MOCK_BATCHES.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date
              </label>
              <input 
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 font-medium">
                Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-lg shadow-blue-500/30">
                <Save className="w-4 h-4" />
                Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TrainerDashboard: React.FC<TrainerDashboardProps> = ({ user, onLogout, themeProps, registeredUsers = [], setRegisteredUsers }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  // Local state for submissions to demonstrate UI updates
  const [submissions, setSubmissions] = useState([
    { id: 1, student: 'John Doe', task: 'React Hooks Assignment', batch: 'React Batch 1', submitted: '27/1/2024', file: 'john_react_assignment.zip', grade: null as number | null, feedback: '' },
    { id: 2, student: 'Jane Smith', task: 'React Hooks Assignment', batch: 'React Batch 1', submitted: '28/1/2024', file: 'jane_react_assignment.zip', grade: 90, feedback: 'Excellent work!' },
    { id: 3, student: 'Mike Johnson', task: 'Component Lifecycle Quiz', batch: 'React Batch 1', submitted: '29/1/2024', file: 'mike_quiz_answers.pdf', grade: null as number | null, feedback: '' },
    { id: 4, student: 'Sarah Wilson', task: 'JavaScript ES6 Features', batch: 'Advanced JavaScript', submitted: '26/1/2024', file: 'sarah_es6_project.zip', grade: 85, feedback: 'Good usage of arrow functions.' },
  ]);
  
  const pendingApprovalsCount = registeredUsers.filter(u => u.status === 'pending').length;

  // Mock data for specific UI elements shown in screenshots
  const todaysClasses = [
    { id: 1, name: 'React Fundamentals', time: '10:00 AM', students: 15, room: 'Room A1' },
    { id: 2, name: 'JavaScript Advanced', time: '2:00 PM', students: 12, room: 'Room B2' },
    { id: 3, name: 'Node.js Basics', time: '4:00 PM', students: 18, room: 'Room C3' },
  ];

  const recentSubmissions = [
    { id: 1, student: 'John Doe', task: 'React Component Assignment', time: '2 hours ago', status: 'pending' },
    { id: 2, student: 'Sarah Wilson', task: 'JavaScript Quiz', time: '4 hours ago', status: 'graded' },
    { id: 3, student: 'Mike Johnson', task: 'Portfolio Project', time: '1 day ago', status: 'reviewed' },
  ];

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'grading', label: 'Grading', icon: GraduationCap },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'materials', label: 'Materials', icon: BookOpen },
    { id: 'chat', label: 'Student Chat', icon: MessageSquare },
    { id: 'approvals', label: `Approvals (${pendingApprovalsCount})`, icon: Users },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles },
  ];

  const handleOpenGrading = (sub: any) => {
      setSelectedSubmission(sub);
      setIsGradingModalOpen(true);
  };

  const handleSaveGrade = (id: number, grade: number, feedback: string) => {
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, grade, feedback } : s));
      // In a real app, this would make an API call
      console.log(`Saved grade for submission ${id}: Grade=${grade}, Feedback=${feedback}`);
  };

  const handleViewSubmissionsFromTask = () => {
      setActiveTab('grading');
  };

  const renderOverview = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trainer Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your classes and track student progress</p>
            </div>
            <div className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-bold">Rating: 4.8/5</span>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all">
               <div className="relative z-10">
                   <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">My Students</p>
                   <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">45</h3>
                   <p className="text-green-500 text-sm mt-2 font-medium">+5 this month</p>
               </div>
               <div className="absolute right-4 top-6 p-3 bg-blue-500 rounded-xl text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                   <Users className="w-6 h-6" />
               </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all">
               <div className="relative z-10">
                   <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Tasks</p>
                   <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">8</h3>
                   <p className="text-gray-400 text-sm mt-2">2 due today</p>
               </div>
               <div className="absolute right-4 top-6 p-3 bg-purple-500 rounded-xl text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                   <CheckSquare className="w-6 h-6" />
               </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all">
               <div className="relative z-10">
                   <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Average Grade</p>
                   <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">8.7</h3>
                   <p className="text-green-500 text-sm mt-2 font-medium">+0.3 this month</p>
               </div>
               <div className="absolute right-4 top-6 p-3 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                   <GraduationCap className="w-6 h-6" />
               </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Today's Classes */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        Today's Classes
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">3 classes</span>
                </div>
                <div className="space-y-4">
                    {todaysClasses.map(cls => (
                        <div key={cls.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{cls.name}</h4>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {cls.time}</span>
                                        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {cls.students} students</span>
                                        <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {cls.room}</span>
                                    </div>
                                </div>
                                <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-blue-700">
                                    Start
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-500" />
                        Recent Submissions
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">3 pending</span>
                </div>
                <div className="space-y-4">
                    {recentSubmissions.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{sub.student}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{sub.task}</p>
                                <p className="text-xs text-gray-400 mt-1">{sub.time}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                                    ${sub.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' : 
                                      sub.status === 'graded' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                                      'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                    }`}>
                                    {sub.status}
                                </span>
                                <div className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-gray-400">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    );
  };

  const renderAttendance = () => {
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Mock students for the selected batch
    const students = MOCK_USERS.filter(u => u.role === 'student');

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mark Attendance</h1>
            <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(selectedDate).toLocaleDateString()}</span>
            </div>
         </div>
         
         <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                 <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Batch</label>
                     <select 
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                     >
                        <option value="">Choose a batch</option>
                        {MOCK_BATCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                     </select>
                 </div>
                 <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                     <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                     />
                 </div>
             </div>
             
             {selectedBatch ? (
                 <div className="space-y-4">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Student List</h3>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                            Save Attendance
                        </button>
                     </div>
                     <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                             <thead className="bg-gray-50 dark:bg-gray-900/50">
                                 <tr>
                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Student</th>
                                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                 {students.map(student => (
                                     <tr key={student.id}>
                                         <td className="px-6 py-4 whitespace-nowrap">
                                             <div className="flex items-center gap-3">
                                                 <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full" />
                                                 <span className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</span>
                                             </div>
                                         </td>
                                         <td className="px-6 py-4 whitespace-nowrap text-center">
                                             <div className="flex items-center justify-center gap-4">
                                                 <label className="flex items-center gap-2 cursor-pointer">
                                                     <input type="radio" name={`attendance-${student.id}`} value="present" defaultChecked className="text-green-600 focus:ring-green-500" />
                                                     <span className="text-sm text-gray-700 dark:text-gray-300">Present</span>
                                                 </label>
                                                 <label className="flex items-center gap-2 cursor-pointer">
                                                     <input type="radio" name={`attendance-${student.id}`} value="absent" className="text-red-600 focus:ring-red-500" />
                                                     <span className="text-sm text-gray-700 dark:text-gray-300">Absent</span>
                                                 </label>
                                             </div>
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 </div>
             ) : (
                 <div className="mt-12 text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                     <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <UserCheck className="w-8 h-8 text-gray-400" />
                     </div>
                     <h3 className="text-lg font-medium text-gray-900 dark:text-white">Ready to mark attendance</h3>
                     <p className="text-gray-500 dark:text-gray-400 mt-1">Select a batch and date to view student list</p>
                 </div>
             )}
         </div>
      </div>
    );
  };

  const renderTasks = () => (
     <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Task Management</h1>
            <button 
                onClick={() => setIsAssignTaskModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md"
            >
                <PlusCircle className="w-5 h-5" />
                Assign New Task
            </button>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
                    <Clock className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Tasks</p>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white">3</h4>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-600 dark:text-green-400">
                    <Clock className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Tasks</p>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white">2</h4>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-lg text-red-600 dark:text-red-400">
                    <Clock className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Overdue</p>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white">1</h4>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-600 dark:text-purple-400">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Avg Submissions</p>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white">68%</h4>
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Task Card 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">React Hooks Assignment</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">Active</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-grow">Create a todo app using React hooks (useState, useEffect, useContext)</p>
                
                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4" />
                        <span>Batch: React Batch 1</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>Due: 28/1/2024</span>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-300">Submissions: 18/25</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                </div>

                <button 
                    onClick={handleViewSubmissionsFromTask}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <BookOpen className="w-4 h-4" />
                    View Submissions
                </button>
            </div>

            {/* Task Card 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Component Lifecycle Quiz</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">Active</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-grow">Complete the quiz on React component lifecycle methods</p>
                
                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4" />
                        <span>Batch: React Batch 1</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>Due: 30/1/2024</span>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-300">Submissions: 12/25</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '48%' }}></div>
                    </div>
                </div>

                <button 
                    onClick={handleViewSubmissionsFromTask}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <BookOpen className="w-4 h-4" />
                    View Submissions
                </button>
            </div>

            {/* Task Card 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">JavaScript ES6 Features</h3>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded uppercase">Overdue</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-grow">Implement examples of arrow functions, destructuring, and async/await</p>
                
                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4" />
                        <span>Batch: Advanced JavaScript</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>Due: 25/1/2024</span>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-300">Submissions: 15/18</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '83%' }}></div>
                    </div>
                </div>

                <button 
                    onClick={handleViewSubmissionsFromTask}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <BookOpen className="w-4 h-4" />
                    View Submissions
                </button>
            </div>
        </div>
     </div>
  );

  const renderGrading = () => (
     <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Grade Submissions</h1>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                Pending: {submissions.filter(s => s.grade === null).length}  <span className="mx-2">•</span>  Graded: {submissions.filter(s => s.grade !== null).length}
            </div>
        </div>

         {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl text-amber-600 dark:text-amber-400">
                    <Star className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Pending Grades</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {submissions.filter(s => s.grade === null).length}
                    </h3>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl text-green-600 dark:text-green-400">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Graded</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {submissions.filter(s => s.grade !== null).length}
                    </h3>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
                    <Star className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Submissions</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {submissions.length}
                    </h3>
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Student Submissions</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Task</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Batch</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submitted</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{sub.student}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="font-medium text-gray-900 dark:text-white">{sub.task}</div>
                                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                    <FileText className="w-3 h-3" /> {sub.file}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{sub.batch}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{sub.submitted}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {sub.grade ? (
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                        sub.grade >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                                        sub.grade >= 75 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                    }`}>
                                        {sub.grade > 90 ? 'A' : sub.grade > 80 ? 'B+' : sub.grade > 70 ? 'B' : 'C'} ({sub.grade})
                                    </span>
                                ) : (
                                    <span className="text-gray-400 italic">Not graded</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button 
                                    onClick={() => handleOpenGrading(sub)}
                                    className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 flex items-center justify-end gap-1 w-full"
                                >
                                    {sub.grade ? 'Edit Grade' : 'Grade'} <Download className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
     </div>
  );

  const handleApprove = (userId: string) => {
    if (setRegisteredUsers) {
      setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'approved' } : u));
    }
  };

  const handleReject = (userId: string) => {
    if (setRegisteredUsers) {
      setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'rejected' } : u));
    }
  };

  const renderApprovals = () => {
    const pendingUsers = registeredUsers.filter(u => u.status === 'pending');

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pending Approvals</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course/Expertise</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {pendingUsers.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                No pending approvals at the moment.
                            </td>
                        </tr>
                    ) : (
                        pendingUsers.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs font-medium rounded-full">
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                    {u.courseOrExpertise || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => handleApprove(u.id)}
                                            className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900 rounded-lg transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleReject(u.id)}
                                            className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 rounded-lg transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    );
  };

  const renderQuizzes = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Quizzes</h1>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-sm">
                <PlusCircle className="w-5 h-5" />
                Create Quiz
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_QUIZZES.map(quiz => (
                <div key={quiz.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{quiz.title}</h3>
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded uppercase">Active</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
                        <p>Questions: {quiz.questions.length}</p>
                        <p>Due: {quiz.dueDate}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            Edit
                        </button>
                        <button className="flex-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 py-2 rounded-lg font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                            Results
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const renderMaterials = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Study Materials</h1>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-sm">
                <Upload className="w-5 h-5" />
                Upload Material
            </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uploaded</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {MOCK_MATERIALS.map(material => (
                        <tr key={material.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{material.title}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded uppercase">
                                    {material.type}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {material.uploadedAt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-red-600 hover:text-red-800 dark:hover:text-red-400">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderChat = () => {
    const [messages, setMessages] = useState([
      { id: 1, sender: 'Student', text: 'Hi! I am stuck on the useEffect hook. Can you help?', time: '10:05 AM', isMe: false },
      { id: 2, sender: 'You', text: 'Sure! What specifically are you having trouble with?', time: '10:10 AM', isMe: true },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim()) return;
      setMessages([...messages, {
        id: Date.now(),
        sender: 'You',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      }]);
      setNewMessage('');
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-12rem)] flex flex-col">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Student Chat</h1>
        </div>
        
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
              ST
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">John Doe</h3>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'}`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.isMe ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex gap-2">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button type="submit" className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout 
      user={user} 
      themeProps={themeProps} 
      menuItems={menuItems} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onLogout={onLogout}
    >
      <GradeSubmissionModal 
        isOpen={isGradingModalOpen}
        onClose={() => setIsGradingModalOpen(false)}
        submission={selectedSubmission}
        onSave={handleSaveGrade}
      />
      <AssignTaskModal
        isOpen={isAssignTaskModalOpen}
        onClose={() => setIsAssignTaskModalOpen(false)}
        onSave={(task) => {
          console.log('Assigned new task:', task);
          // In a real app, this would make an API call to save the task
        }}
      />
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'attendance' && renderAttendance()}
      {activeTab === 'tasks' && renderTasks()}
      {activeTab === 'grading' && renderGrading()}
      {activeTab === 'quizzes' && renderQuizzes()}
      {activeTab === 'materials' && renderMaterials()}
      {activeTab === 'chat' && renderChat()}
      {activeTab === 'approvals' && renderApprovals()}
      {activeTab === 'ai-assistant' && <AIAssistantTab submissions={submissions} />}
    </DashboardLayout>
  );
};

export default TrainerDashboard;