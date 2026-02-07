import React, { useState, useEffect } from 'react';
import { User, UserRole, ThemeProps } from './types';
import { User as UserIcon, Mail, Phone, ArrowLeft, Moon, Sun, Lock, Shield, MapPin, Briefcase, BookOpen, Check } from 'lucide-react';
import { MOCK_USERS } from './constants';
import AdminDashboard from './AdminDashboard';
import TrainerDashboard from './TrainerDashboard';
import StudentDashboard from './StudentDashboard';

const ThemeToggle = ({ isDark, toggle }: ThemeProps) => (
  <button 
    type="button"
    onClick={toggle}
    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
  >
    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
);

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  themeProps: ThemeProps;
  children?: React.ReactNode;
  maxWidth?: string;
}

const AuthLayout = ({ title, subtitle, themeProps, children, maxWidth = "sm:max-w-md" }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="absolute top-4 right-4">
        <ThemeToggle {...themeProps} />
      </div>
      <div className={`sm:mx-auto sm:w-full ${maxWidth}`}>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
      <div className={`mt-8 sm:mx-auto sm:w-full ${maxWidth}`}>
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 dark:border-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin, onSwitchToSignup, themeProps }: { onLogin: (email: string, role: string) => void, onSwitchToSignup: () => void, themeProps: ThemeProps }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, role); 
  };

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back to EduManage" themeProps={themeProps}>
       <form className="space-y-4" onSubmit={handleSubmit}>
         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 border-gray-300 dark:border-gray-600 rounded-lg p-2.5 border sm:text-sm bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="admin@edumanage.com"
              />
            </div>
         </div>
         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 border-gray-300 dark:border-gray-600 rounded-lg p-2.5 border sm:text-sm bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
         </div>
         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Login As</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 border-gray-300 dark:border-gray-600 rounded-lg p-2.5 border sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value={UserRole.STUDENT}>Student</option>
                <option value={UserRole.TRAINER}>Trainer</option>
                <option value={UserRole.ADMIN}>Administrator</option>
              </select>
            </div>
         </div>
         <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Sign In
            </button>
         </div>
         <div className="mt-4 text-center">
            <button 
                type="button"
                onClick={onSwitchToSignup}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
                Don't have an account? Sign up
            </button>
        </div>
       </form>
    </AuthLayout>
  )
}

const SignupPage = ({ onSignup, onSwitchToLogin, themeProps }: { onSignup: (user: Partial<User>) => void, onSwitchToLogin: () => void, themeProps: ThemeProps }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: UserRole.STUDENT,
    courseOrExpertise: '',
    experience: '',
    address: '',
    terms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation Logic
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
        newErrors.phone = "Invalid phone number";
    }
    setErrors(newErrors);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const isFormValid = () => {
     return (
        formData.name && 
        formData.email && 
        formData.phone && 
        formData.password && 
        formData.confirmPassword &&
        formData.password === formData.confirmPassword &&
        formData.courseOrExpertise && 
        formData.terms &&
        Object.keys(errors).length === 0 &&
        (formData.role !== UserRole.TRAINER || formData.experience)
     );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (isFormValid()) {
       // Simulate API delay
       setTimeout(() => {
           setIsSuccess(true);
           setTimeout(() => {
               onSignup({
                 name: formData.name,
                 email: formData.email,
                 role: formData.role as UserRole,
                 courseOrExpertise: formData.courseOrExpertise
               });
           }, 1500);
       }, 500);
    }
  };

  if (isSuccess) {
      return (
        <AuthLayout title="Account Created!" subtitle="Redirecting you to dashboard..." themeProps={themeProps}>
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/50">
                    <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-center text-gray-600 dark:text-gray-300">
                    Registration successful! Welcome to EduManage.
                </p>
            </div>
        </AuthLayout>
      );
  }

  return (
    <AuthLayout title="Create Account" subtitle="Join EduManage as a Student or Trainer" themeProps={themeProps} maxWidth="sm:max-w-2xl">
      <form className="space-y-6" onSubmit={handleSubmit}>
        
        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            <label className={`
                relative flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-all
                ${formData.role === UserRole.STUDENT 
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-600' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-gray-600'}
            `}>
                <input 
                    type="radio" name="role" value={UserRole.STUDENT} 
                    checked={formData.role === UserRole.STUDENT} 
                    onChange={handleChange} 
                    className="sr-only" 
                />
                <GraduationCapIcon className={`w-8 h-8 mb-2 ${formData.role === UserRole.STUDENT ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${formData.role === UserRole.STUDENT ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'}`}>
                    Student
                </span>
            </label>

            <label className={`
                relative flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-all
                ${formData.role === UserRole.TRAINER 
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-600' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-gray-600'}
            `}>
                <input 
                    type="radio" name="role" value={UserRole.TRAINER} 
                    checked={formData.role === UserRole.TRAINER} 
                    onChange={handleChange} 
                    className="sr-only" 
                />
                <Briefcase className={`w-8 h-8 mb-2 ${formData.role === UserRole.TRAINER ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${formData.role === UserRole.TRAINER ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'}`}>
                    Trainer
                </span>
            </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                 </div>
                 <input
                   name="name" type="text" required
                   value={formData.name} onChange={handleChange}
                   className="block w-full pl-10 border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border"
                   placeholder="John Doe"
                 />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                 </div>
                 <input
                   name="email" type="email" required
                   value={formData.email} onChange={handleChange}
                   className="block w-full pl-10 border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border"
                   placeholder="john@example.com"
                 />
              </div>
            </div>

             {/* Phone */}
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                 </div>
                 <input
                   name="phone" type="tel" required
                   value={formData.phone} onChange={handleChange}
                   className={`block w-full pl-10 rounded-lg p-2.5 bg-white dark:bg-gray-700 dark:text-white sm:text-sm border 
                        ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'}`}
                   placeholder="+1 (555) 987-6543"
                 />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Role Specific Field */}
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   {formData.role === UserRole.STUDENT ? 'Select Course' : 'Primary Expertise'}
               </label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                 </div>
                 {formData.role === UserRole.STUDENT ? (
                     <select
                        name="courseOrExpertise"
                        required
                        value={formData.courseOrExpertise}
                        onChange={handleChange}
                        className="block w-full pl-10 py-2.5 text-base border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg border bg-white dark:bg-gray-700 dark:text-white"
                     >
                        <option value="">Select a course...</option>
                        <option value="Java Full Stack">Java Full Stack</option>
                        <option value="Python Data Science">Python Data Science</option>
                        <option value="React Frontend">React Frontend</option>
                        <option value="DevOps Engineering">DevOps Engineering</option>
                     </select>
                 ) : (
                    <input
                        name="courseOrExpertise" type="text" required
                        value={formData.courseOrExpertise} onChange={handleChange}
                        className="block w-full pl-10 border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border"
                        placeholder="e.g. Artificial Intelligence"
                    />
                 )}
               </div>
            </div>

             {/* Trainer Experience */}
             {formData.role === UserRole.TRAINER && (
                 <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Years of Experience</label>
                    <input
                        name="experience" type="number" min="0" required
                        value={formData.experience} onChange={handleChange}
                        className="block w-full border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border"
                        placeholder="e.g. 5"
                    />
                 </div>
             )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
               <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    name="password" type="password" required
                    value={formData.password} onChange={handleChange}
                    className={`block w-full pl-10 rounded-lg p-2.5 bg-white dark:bg-gray-700 dark:text-white sm:text-sm border 
                        ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="••••••••"
                />
               </div>
               {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

             {/* Confirm Password */}
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
               <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    name="confirmPassword" type="password" required
                    value={formData.confirmPassword} onChange={handleChange}
                    className={`block w-full pl-10 rounded-lg p-2.5 bg-white dark:bg-gray-700 dark:text-white sm:text-sm border 
                        ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="••••••••"
                />
               </div>
               {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>
        </div>

        {/* Address */}
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <div className="relative">
                 <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                 </div>
                <textarea
                    name="address" rows={3}
                    value={formData.address} onChange={handleChange}
                    className="block w-full pl-10 border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border resize-none"
                    placeholder="Enter your full address..."
                />
            </div>
        </div>

        {/* Terms */}
        <div className="flex items-center">
            <input
                id="terms" name="terms" type="checkbox"
                checked={formData.terms} onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a>
            </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all
                ${isFormValid() 
                    ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' 
                    : 'bg-gray-400 cursor-not-allowed opacity-70'}`}
          >
            Create Account
          </button>
        </div>
        
        <div className="mt-4 text-center">
            <button 
                type="button"
                onClick={onSwitchToLogin}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center justify-center w-full gap-1"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </button>
        </div>
      </form>
    </AuthLayout>
  );
};

// Helper Icon for Signup
const GraduationCapIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
);

export default function App() {
  const [authView, setAuthView] = useState<'LOGIN' | 'SIGNUP'>('SIGNUP');
  
  // Initialize states from localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const themeProps = { isDark: isDarkMode, toggle: toggleTheme };

  const handleSignup = (userData: Partial<User>) => {
    // Create a mock user
    const newUser: User = {
      id: `u${Date.now()}`,
      name: userData.name!,
      email: userData.email!,
      role: userData.role!,
      courseOrExpertise: userData.courseOrExpertise,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name!)}&background=random`
    };
    
    // In a real app, this would hit an API
    console.log('User signed up:', newUser);
    setCurrentUser(newUser);
  };

  const handleLogin = (email: string, role: string) => {
    // Mock Login: Check against mock users or default admin logic
    let user = MOCK_USERS.find(u => u.email === email);
    
    // Special case for the admin email mentioned in prompt
    if (email === 'sakshipawar5840@gmail.com') {
        user = {
            id: 'admin-special',
            name: 'Sakshi Pawar',
            email: email,
            role: UserRole.ADMIN,
            avatar: 'https://ui-avatars.com/api/?name=Sakshi+Pawar&background=random'
        };
    }

    if (user) {
        // If user exists in DB/Mocks, we respect their stored role (or maybe override if this was a real DB check)
        // For the sake of the demo, if the user matches a mock, we log them in as that user.
        setCurrentUser(user);
    } else {
        // Create a temporary session user for demo if email not in mock DB
        // Use the selected role from the dropdown
        const tempUser: User = {
            id: `temp-${Date.now()}`,
            name: email.split('@')[0],
            email: email,
            role: role as UserRole, 
            avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}`
        }
        setCurrentUser(tempUser);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthView('LOGIN');
  };

  // Rendering Logic
  if (!currentUser) {
     if (authView === 'LOGIN') {
         return <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setAuthView('SIGNUP')} themeProps={themeProps} />;
     } else {
         return <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setAuthView('LOGIN')} themeProps={themeProps} />;
     }
  }

  // Dashboard Routing
  if (currentUser.role === UserRole.ADMIN) {
      return <AdminDashboard user={currentUser} onLogout={handleLogout} themeProps={themeProps} />;
  }

  if (currentUser.role === UserRole.TRAINER) {
      return <TrainerDashboard user={currentUser} onLogout={handleLogout} themeProps={themeProps} />;
  }

  // Student Dashboard
  if (currentUser.role === UserRole.STUDENT) {
      return <StudentDashboard user={currentUser} onLogout={handleLogout} themeProps={themeProps} />;
  }

  return <div>Loading...</div>;
}