import React, { useState } from 'react';
import { User, ThemeProps, Task, AttendanceRecord, Payment, Placement } from './types';
import DashboardLayout from './DashboardLayout';
import { 
  LayoutDashboard, CheckSquare, Calendar, CreditCard, 
  Briefcase, Clock, FileText, CheckCircle, XCircle,
  MessageSquare, Send, Bot, X, Award, BookOpen, Upload, HelpCircle
} from 'lucide-react';
import { MOCK_TASKS, MOCK_ATTENDANCE, MOCK_PAYMENTS, MOCK_PLACEMENTS, MOCK_BATCHES, MOCK_QUIZZES, MOCK_MATERIALS, MOCK_CERTIFICATES } from './constants';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
  themeProps: ThemeProps;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout, themeProps }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: 'Hi there! I am your AI Study Assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Assignments', icon: CheckSquare },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'materials', label: 'Study Materials', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'placements', label: 'Placements', icon: Briefcase },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'chat', label: 'Trainer Chat', icon: MessageSquare },
  ];

  // Mock data filtering for current user
  const myTasks = MOCK_TASKS; // In real app, filter by batch/student
  const myAttendance = MOCK_ATTENDANCE.filter(a => a.studentId === user.id);
  const myPayments = MOCK_PAYMENTS.filter(p => p.studentId === user.id);
  const myPlacements = MOCK_PLACEMENTS; // Show all available or specific to student

  const renderOverview = () => {
    const presentCount = myAttendance.filter(a => a.status === 'PRESENT').length;
    const totalAttendance = myAttendance.length;
    const attendancePercentage = totalAttendance ? Math.round((presentCount / totalAttendance) * 100) : 0;
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Student Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
             <div className="flex justify-between items-center">
                <div>
                   <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance</p>
                   <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{attendancePercentage}%</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300">
                   <Calendar className="w-6 h-6" />
                </div>
             </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
             <div className="flex justify-between items-center">
                <div>
                   <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Tasks</p>
                   <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">2</p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg text-amber-600 dark:text-amber-300">
                   <Clock className="w-6 h-6" />
                </div>
             </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
             <div className="flex justify-between items-center">
                <div>
                   <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fees Status</p>
                   <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">Paid</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-green-600 dark:text-green-300">
                   <CreditCard className="w-6 h-6" />
                </div>
             </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
             <div className="flex justify-between items-center">
                <div>
                   <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Course</p>
                   <p className="text-lg font-bold text-gray-900 dark:text-white mt-2 truncate max-w-[120px]">
                      {user.courseOrExpertise || 'General'}
                   </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-600 dark:text-purple-300">
                   <FileText className="w-6 h-6" />
                </div>
             </div>
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Course Progress</h3>
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">65% Completed</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Modules Completed</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Assignments Done</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Average Score</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Certificates Earned</p>
                </div>
            </div>
        </div>

        {/* Recent Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upcoming Classes</h3>
            <div className="space-y-4">
                {MOCK_BATCHES.slice(0, 2).map(batch => (
                    <div key={batch.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">{batch.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{batch.schedule}</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                            Scheduled
                        </span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  };

  const renderTasks = () => (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Assignments</h2>
       </div>
       <div className="grid gap-4">
          {myTasks.map(task => (
             <div key={task.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
                   </div>
                   <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs rounded-full">
                      Pending
                   </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                   <span>Due: {task.dueDate}</span>
                   <div className="flex gap-2">
                     <label className="cursor-pointer text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400 font-medium flex items-center gap-1">
                        <Upload className="w-4 h-4" />
                        Upload PDF
                        <input type="file" className="hidden" accept=".pdf" />
                     </label>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Attendance Record</h2>
       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
             <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {myAttendance.map(record => (
                   <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${record.status === 'PRESENT' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                              record.status === 'ABSENT' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                            {record.status}
                         </span>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
          {myAttendance.length === 0 && (
              <p className="p-6 text-center text-gray-500 dark:text-gray-400">No attendance records found.</p>
          )}
       </div>
    </div>
  );

  const renderPayments = () => (
     <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Payment History</h2>
        <div className="grid gap-4">
           {myPayments.map(payment => (
              <div key={payment.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                       <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-900 dark:text-white">{payment.type}</h4>
                       <p className="text-sm text-gray-500 dark:text-gray-400">{payment.date}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">${payment.amount.toLocaleString()}</p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                       payment.status === 'PAID' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                       payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                       'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                       {payment.status}
                    </span>
                 </div>
              </div>
           ))}
        </div>
     </div>
  );

  const renderPlacements = () => (
     <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Placement Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {myPlacements.map(placement => (
              <div key={placement.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <h3 className="text-lg font-bold text-gray-900 dark:text-white">{placement.company}</h3>
                       <p className="text-indigo-600 dark:text-indigo-400">{placement.role}</p>
                    </div>
                    <Briefcase className="w-6 h-6 text-gray-400" />
                 </div>
                 <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <p>Package: <span className="font-medium">{placement.package}</span></p>
                    <p>Date: {placement.date}</p>
                 </div>
                 <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className={`block w-full text-center py-2 rounded-lg text-sm font-medium ${
                        placement.status === 'OFFER_RECEIVED' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        placement.status === 'INTERVIEWING' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                        {placement.status.replace('_', ' ')}
                    </span>
                 </div>
              </div>
           ))}
        </div>
     </div>
  );

  const renderQuizzes = () => (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Online Quizzes</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_QUIZZES.map(quiz => (
             <div key={quiz.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{quiz.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{quiz.questions.length} Questions</p>
                   </div>
                   <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg text-indigo-600 dark:text-indigo-300">
                      <HelpCircle className="w-5 h-5" />
                   </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                   <span className="text-gray-500 dark:text-gray-400">Due: {quiz.dueDate}</span>
                   <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Start Quiz
                   </button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderMaterials = () => (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Study Materials</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_MATERIALS.map(material => (
             <div key={material.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300">
                      <FileText className="w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{material.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{material.type}</p>
                   </div>
                </div>
                <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400 font-medium text-sm">
                   View
                </a>
             </div>
          ))}
       </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Certificates</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_CERTIFICATES.filter(c => c.studentId === user.id).map(cert => (
             <div key={cert.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-300 mb-4">
                   <Award className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{cert.courseName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Issued: {cert.issuedDate}</p>
                <button className="w-full py-2 border border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                   Download PDF
                </button>
             </div>
          ))}
          {MOCK_CERTIFICATES.filter(c => c.studentId === user.id).length === 0 && (
             <p className="text-gray-500 dark:text-gray-400 col-span-full">No certificates earned yet. Complete a course to get certified!</p>
          )}
       </div>
    </div>
  );

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    const input = chatInput;
    setChatInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: `I can help you with "${input}". Since I am a demo AI, I recommend checking your Study Materials or asking your Trainer for specific details.` 
      }]);
    }, 1000);
  };

  const renderChatbot = () => (
    <div className="fixed bottom-6 right-6 z-50">
      {isChatOpen ? (
        <div className="bg-white dark:bg-gray-800 w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold">AI Study Assistant</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-indigo-100 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900/50">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          
          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-full focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );

  const renderChat = () => {
    const [messages, setMessages] = useState([
      { id: 1, sender: 'Trainer', text: 'Hello! How is your React project coming along?', time: '10:00 AM', isMe: false },
      { id: 2, sender: 'You', text: 'Hi! I am stuck on the useEffect hook. Can you help?', time: '10:05 AM', isMe: true },
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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Trainer Chat</h1>
        </div>
        
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
              TR
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Your Trainer</h3>
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
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'tasks' && renderTasks()}
      {activeTab === 'quizzes' && renderQuizzes()}
      {activeTab === 'materials' && renderMaterials()}
      {activeTab === 'attendance' && renderAttendance()}
      {activeTab === 'payments' && renderPayments()}
      {activeTab === 'placements' && renderPlacements()}
      {activeTab === 'certificates' && renderCertificates()}
      {activeTab === 'chat' && renderChat()}
      
      {/* Floating AI Chatbot */}
      {renderChatbot()}
    </DashboardLayout>
  );
};

export default StudentDashboard;
