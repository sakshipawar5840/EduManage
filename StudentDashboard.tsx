import React, { useState } from 'react';
import { User, ThemeProps, Task, AttendanceRecord, Payment, Placement } from './types';
import DashboardLayout from './DashboardLayout';
import { 
  LayoutDashboard, CheckSquare, Calendar, CreditCard, 
  Briefcase, Clock, FileText, CheckCircle, XCircle 
} from 'lucide-react';
import { MOCK_TASKS, MOCK_ATTENDANCE, MOCK_PAYMENTS, MOCK_PLACEMENTS, MOCK_BATCHES } from './constants';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
  themeProps: ThemeProps;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout, themeProps }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'placements', label: 'Placements', icon: Briefcase },
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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Tasks</h2>
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
                   <button className="text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400 font-medium">
                      Submit Task
                   </button>
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
      {activeTab === 'attendance' && renderAttendance()}
      {activeTab === 'payments' && renderPayments()}
      {activeTab === 'placements' && renderPlacements()}
    </DashboardLayout>
  );
};

export default StudentDashboard;
