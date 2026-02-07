import React, { useState } from 'react';
import { User, Batch, ThemeProps, Task } from './types';
import DashboardLayout from './DashboardLayout';
import { 
  LayoutDashboard, BookOpen, UserCheck, CheckSquare, 
  Calendar, Clock, PlusCircle, GraduationCap, Star, 
  FileText, CheckCircle, Search, Download, Users, X, Save
} from 'lucide-react';
import { MOCK_BATCHES } from './constants';

interface TrainerDashboardProps {
  user: User;
  onLogout: () => void;
  themeProps: ThemeProps;
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

const TrainerDashboard: React.FC<TrainerDashboardProps> = ({ user, onLogout, themeProps }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  // Local state for submissions to demonstrate UI updates
  const [submissions, setSubmissions] = useState([
    { id: 1, student: 'John Doe', task: 'React Hooks Assignment', batch: 'React Batch 1', submitted: '27/1/2024', file: 'john_react_assignment.zip', grade: null as number | null, feedback: '' },
    { id: 2, student: 'Jane Smith', task: 'React Hooks Assignment', batch: 'React Batch 1', submitted: '28/1/2024', file: 'jane_react_assignment.zip', grade: 90, feedback: 'Excellent work!' },
    { id: 3, student: 'Mike Johnson', task: 'Component Lifecycle Quiz', batch: 'React Batch 1', submitted: '29/1/2024', file: 'mike_quiz_answers.pdf', grade: null as number | null, feedback: '' },
    { id: 4, student: 'Sarah Wilson', task: 'JavaScript ES6 Features', batch: 'Advanced JavaScript', submitted: '26/1/2024', file: 'sarah_es6_project.zip', grade: 85, feedback: 'Good usage of arrow functions.' },
  ]);
  
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
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mark Attendance</h1>
            <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString()}</span>
            </div>
         </div>
         
         <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Batch</label>
                     <select className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                        <option value="">Choose a batch</option>
                        {MOCK_BATCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                     </select>
                 </div>
                 <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                     <input 
                        type="date" 
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                     />
                 </div>
             </div>
             
             {/* Placeholder for attendance list state */}
             <div className="mt-12 text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                 <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <UserCheck className="w-8 h-8 text-gray-400" />
                 </div>
                 <h3 className="text-lg font-medium text-gray-900 dark:text-white">Ready to mark attendance</h3>
                 <p className="text-gray-500 dark:text-gray-400 mt-1">Select a batch and date to view student list</p>
             </div>
         </div>
      </div>
    );
  };

  const renderTasks = () => (
     <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Task Management</h1>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md">
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
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'attendance' && renderAttendance()}
      {activeTab === 'tasks' && renderTasks()}
      {activeTab === 'grading' && renderGrading()}
    </DashboardLayout>
  );
};

export default TrainerDashboard;