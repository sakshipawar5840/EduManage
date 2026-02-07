import React, { useState } from 'react';
import { User, Batch, ThemeProps, UserRole, Task, Payment, Placement, Submission, AttendanceRecord } from './types';
import DashboardLayout from './DashboardLayout';
import { 
  LayoutDashboard, Users, BookOpen, CalendarCheck, FileText, 
  TrendingUp, UserPlus, Trash2, Edit, CreditCard, Briefcase, PlusCircle, X, Search 
} from 'lucide-react';
import { MOCK_USERS, MOCK_BATCHES, MOCK_PAYMENTS, MOCK_PLACEMENTS, MOCK_TASKS, MOCK_ATTENDANCE } from './constants';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  themeProps: ThemeProps;
}

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
      <span className="text-green-500 font-medium">{trend}</span>
      <span className="text-gray-400 ml-1">vs last month</span>
    </div>
  </div>
);

// --- Modals ---

const AddTrainerModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (data: any) => void }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onAdd(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Trainer</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input name="name" required type="text" placeholder="John Doe" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input name="email" required type="email" placeholder="john@example.com" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
              <input name="phone" type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Specialization</label>
              <select name="specialization" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all">
                <option value="">Select Specialization</option>
                <option value="Java Full Stack">Java Full Stack</option>
                <option value="Python Data Science">Python Data Science</option>
                <option value="Frontend Development">Frontend Development</option>
                <option value="DevOps">DevOps</option>
                <option value="Mobile Development">Mobile Development</option>
              </select>
            </div>
             <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Experience (Years)</label>
              <input name="experience" type="number" min="0" defaultValue="0" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Join Date</label>
              <input name="joinDate" type="date" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all" />
            </div>
          </div>
           <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select name="status" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 font-medium transition-colors focus:ring-2 focus:ring-gray-400">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition-colors shadow-lg shadow-indigo-500/30 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
              Add Trainer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddBatchModal = ({ isOpen, onClose, onAdd, trainers, students }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAdd: (data: any) => void;
  trainers: User[];
  students: User[];
}) => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const formRef = React.useRef<HTMLFormElement>(null);

  if (!isOpen) return null;

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onAdd({ ...data, studentIds: selectedStudents });
  };
  
  const handleCreateClick = () => {
    if (formRef.current) {
        formRef.current.requestSubmit();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Batch</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 flex-1">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Name</label>
                <input name="name" type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trainer</label>
                <select name="trainerId" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select Trainer</option>
                {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Schedule</label>
                <input name="schedule" type="text" placeholder="e.g., Mon-Wed-Fri 10:00-12:00" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                <input name="startDate" type="date" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                <input name="endDate" type="date" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Students</label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg max-h-40 overflow-y-auto p-2 space-y-2 dark:bg-gray-700/50">
                {students.map(student => (
                    <label key={student.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-600/50 rounded cursor-pointer transition-colors">
                        <input 
                        type="checkbox" 
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleStudentToggle(student.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-200">{student.name}</span>
                    </label>
                ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">{selectedStudents.length} students selected</p>
            </div>
            </form>
        </div>
        
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors">Cancel</button>
            <button type="button" onClick={handleCreateClick} className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-500/30">Create Batch</button>
        </div>
      </div>
    </div>
  );
};

const AddTaskModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (data: any) => void }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onAdd(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Task</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
            <input name="title" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea name="description" rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Batch</label>
                <select name="batchId" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                    <option value="">Select Batch</option>
                    {MOCK_BATCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                <input name="dueDate" type="date" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
             </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
             <select name="status" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
             </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddPaymentModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (data: any) => void }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onAdd(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Payment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student Name</label>
            <input name="studentName" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
             <select name="course" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="">Select Course</option>
                <option value="Java Full Stack">Java Full Stack</option>
                <option value="Python Data Science">Python Data Science</option>
             </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₹)</label>
            <input name="amount" type="number" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
             <select name="method" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="Online">Online</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
             </select>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
             <input name="dueDate" type="date" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Add Payment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddPlacementModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (data: any) => void }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onAdd(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Placement</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student Name</label>
            <input name="studentName" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Email</label>
            <input name="email" type="email" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
            <input name="company" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <input name="role" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Package (₹)</label>
            <input name="package" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Batch</label>
             <select name="batchId" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="">Select Batch</option>
                {MOCK_BATCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
             </select>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
             <select name="status" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="INTERVIEWING">Interview</option>
                <option value="OFFER_RECEIVED">Offer Received</option>
                <option value="PLACED">Placed</option>
             </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Add Placement</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Component ---

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, themeProps }) => {
  const [activeTab, setActiveTab] = useState('overview');
  // Local state to simulate CRUD
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [batches, setBatches] = useState<Batch[]>(MOCK_BATCHES);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [placements, setPlacements] = useState<Placement[]>(MOCK_PLACEMENTS);

  const [isAddTrainerModalOpen, setIsAddTrainerModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isAddPlacementModalOpen, setIsAddPlacementModalOpen] = useState(false);
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Manage Students', icon: Users },
    { id: 'trainers', label: 'Manage Trainers', icon: BookOpen },
    { id: 'batches', label: 'Batches', icon: CalendarCheck },
    { id: 'tasks', label: 'Tasks', icon: FileText },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'placements', label: 'Placements', icon: Briefcase },
  ];

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleAddTrainer = (data: any) => {
    const newTrainer: User = {
      id: `tr-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: UserRole.TRAINER,
      courseOrExpertise: data.specialization,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`
    };
    setUsers([...users, newTrainer]);
    setIsAddTrainerModalOpen(false);
  };

  const handleAddBatch = (data: any) => {
    const newBatch: Batch = {
      id: `b-${Date.now()}`,
      name: data.name,
      trainerId: data.trainerId,
      studentIds: data.studentIds,
      schedule: data.schedule,
      course: data.name // Using course name as the batch name for now
    };
    setBatches([...batches, newBatch]);
    setIsAddBatchModalOpen(false);
  };

  const handleAddTask = (data: any) => {
    const newTask: Task = {
      id: `t-${Date.now()}`,
      batchId: data.batchId,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      assignedBy: user.id
    };
    setTasks([...tasks, newTask]);
    setIsAddTaskModalOpen(false);
  };

  const handleAddPayment = (data: any) => {
    // Find or mock student ID
    const student = users.find(u => u.name === data.studentName) || { id: 'u_mock' };
    const newPayment: Payment = {
        id: `p-${Date.now()}`,
        studentId: student.id,
        amount: Number(data.amount),
        date: new Date().toISOString().split('T')[0],
        status: 'PENDING',
        type: 'TUITION'
    };
    setPayments([...payments, newPayment]);
    setIsAddPaymentModalOpen(false);
  };

  const handleAddPlacement = (data: any) => {
    const student = users.find(u => u.name === data.studentName) || { id: 'u_mock' };
    const newPlacement: Placement = {
        id: `pl-${Date.now()}`,
        studentId: student.id,
        company: data.company,
        role: data.role,
        package: data.package,
        status: data.status,
        date: new Date().toISOString().split('T')[0]
    };
    setPlacements([...placements, newPlacement]);
    setIsAddPlacementModalOpen(false);
  };

  const renderOverview = () => {
    const totalStudents = users.filter(u => u.role === UserRole.STUDENT).length;
    const totalTrainers = users.filter(u => u.role === UserRole.TRAINER).length;
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Students" 
            value={totalStudents} 
            icon={Users} 
            trend="+12%" 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Total Trainers" 
            value={totalTrainers} 
            icon={BookOpen} 
            trend="+2%" 
            color="bg-indigo-500" 
          />
          <StatCard 
            title="Active Batches" 
            value={batches.length} 
            icon={CalendarCheck} 
            trend="+5%" 
            color="bg-purple-500" 
          />
          <StatCard 
            title="Revenue" 
            value="$45k" 
            icon={CreditCard} 
            trend="+8%" 
            color="bg-emerald-500" 
          />
        </div>
      </div>
    );
  };

  const renderUserTable = (role: UserRole) => {
    const filteredUsers = users.filter(u => u.role === role);
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Manage {role === UserRole.STUDENT ? 'Students' : 'Trainers'}
          </h2>
          <button 
            onClick={() => role === UserRole.TRAINER ? setIsAddTrainerModalOpen(true) : alert('Add Student feature coming soon')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add {role === UserRole.STUDENT ? 'Student' : 'Trainer'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {role === UserRole.STUDENT ? 'Course' : 'Expertise'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-200 font-bold">
                        {u.avatar ? <img src={u.avatar} className="h-8 w-8 rounded-full" alt="" /> : u.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {u.courseOrExpertise || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400 mr-3">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteUser(u.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">No {role.toLowerCase()}s found.</div>
          )}
        </div>
      </div>
    );
  };

  const renderBatches = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Batch Management</h2>
        <button 
          onClick={() => setIsAddBatchModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Batch
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {batches.map(batch => {
           const trainer = users.find(u => u.id === batch.trainerId);
           return (
             <div key={batch.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{batch.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{batch.course}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                     <Users className="w-4 h-4" />
                     <span>{batch.studentIds.length} Students Enrolled</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <BookOpen className="w-4 h-4" />
                     <span>Trainer: {trainer?.name || 'Unassigned'}</span>
                  </div>
                   <div className="flex items-center gap-2">
                     <CalendarCheck className="w-4 h-4" />
                     <span>{batch.schedule}</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400 font-medium">View Details</button>
                </div>
             </div>
           );
        })}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">All Tasks</h2>
        <button 
            onClick={() => setIsAddTaskModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Task
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Batch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.map(task => (
              <tr key={task.id}>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{task.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{task.batchId}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{task.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Attendance Logs</h2>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
          <PlusCircle className="w-4 h-4" />
          Add Attendance
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
           <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Date</label>
           <input type="date" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
           <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Batch</label>
           <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
             <option>All Batches</option>
             {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
           </select>
        </div>
        <div>
           <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Search</label>
           <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search students..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
           </div>
        </div>
      </div>

      {/* List of recent attendance logs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Detailed attendance logs.</p>
          <div className="grid gap-4">
              {MOCK_ATTENDANCE.slice(0, 3).map(a => {
                  const s = users.find(u => u.id === a.studentId);
                  return (
                      <div key={a.id} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                          <div>
                             <p className="font-medium text-gray-900 dark:text-white">{s?.name || a.studentId}</p>
                             <p className="text-xs text-gray-500">{a.date}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.status === 'PRESENT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.status}</span>
                      </div>
                  )
              })}
          </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Payments</h2>
        <button 
            onClick={() => setIsAddPaymentModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Payment
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {payments.map(p => {
              const s = users.find(u => u.id === p.studentId);
              return (
                <tr key={p.id}>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{s?.name || p.studentId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">${p.amount}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPlacements = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Placements</h2>
        <button 
            onClick={() => setIsAddPlacementModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Placement
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {placements.map(pl => {
          const s = users.find(u => u.id === pl.studentId);
          return (
            <div key={pl.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{pl.company}</h3>
              <p className="text-indigo-600 text-sm">{pl.role}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm">
                 <p className="text-gray-600 dark:text-gray-300">Student: {s?.name}</p>
                 <p className="text-gray-600 dark:text-gray-300">Package: {pl.package}</p>
                 <p className="mt-2 text-xs font-semibold uppercase text-gray-500">{pl.status.replace('_', ' ')}</p>
              </div>
            </div>
          )
        })}
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
      <AddTrainerModal 
        isOpen={isAddTrainerModalOpen} 
        onClose={() => setIsAddTrainerModalOpen(false)} 
        onAdd={handleAddTrainer} 
      />
      <AddTaskModal 
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAdd={handleAddTask}
      />
      <AddPaymentModal 
        isOpen={isAddPaymentModalOpen}
        onClose={() => setIsAddPaymentModalOpen(false)}
        onAdd={handleAddPayment}
      />
      <AddPlacementModal 
        isOpen={isAddPlacementModalOpen}
        onClose={() => setIsAddPlacementModalOpen(false)}
        onAdd={handleAddPlacement}
      />
      <AddBatchModal 
        isOpen={isAddBatchModalOpen} 
        onClose={() => setIsAddBatchModalOpen(false)} 
        onAdd={handleAddBatch} 
        trainers={users.filter(u => u.role === UserRole.TRAINER)}
        students={users.filter(u => u.role === UserRole.STUDENT)}
      />

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'students' && renderUserTable(UserRole.STUDENT)}
      {activeTab === 'trainers' && renderUserTable(UserRole.TRAINER)}
      {activeTab === 'batches' && renderBatches()}
      {activeTab === 'tasks' && renderTasks()}
      {activeTab === 'attendance' && renderAttendance()}
      {activeTab === 'payments' && renderPayments()}
      {activeTab === 'placements' && renderPlacements()}
    </DashboardLayout>
  );
};

export default AdminDashboard;
