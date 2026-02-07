import React from 'react';
import { User, ThemeProps } from './types';
import { LogOut, Menu, X, Bell, Moon, Sun, Search } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface DashboardLayoutProps {
  user: User;
  themeProps: ThemeProps;
  menuItems: MenuItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  user, 
  themeProps, 
  menuItems, 
  activeTab, 
  setActiveTab, 
  onLogout,
  children 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-indigo-700 dark:bg-gray-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-indigo-800 dark:bg-gray-900 border-b border-indigo-600 dark:border-gray-700">
          <span className="text-2xl font-bold tracking-wider">EduManage</span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-6 p-3 bg-indigo-600 dark:bg-gray-700 rounded-lg">
             <div className="w-10 h-10 rounded-full bg-white text-indigo-700 flex items-center justify-center font-bold text-lg">
                {user.avatar ? <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full" /> : user.name.charAt(0)}
             </div>
             <div className="overflow-hidden">
               <p className="font-medium truncate">{user.name}</p>
               <p className="text-xs text-indigo-200 truncate">{user.role}</p>
             </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors
                  ${activeTab === item.id 
                    ? 'bg-white text-indigo-700 shadow-md' 
                    : 'text-indigo-100 hover:bg-indigo-600 hover:text-white dark:hover:bg-gray-700'}
                `}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-indigo-700' : 'text-indigo-300'}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-indigo-600 dark:border-gray-700">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-indigo-100 hover:text-white hover:bg-indigo-600 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10 h-16 flex items-center justify-between px-6 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-1.5 border border-gray-200 dark:border-gray-600">
               <Search className="w-4 h-4 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Search..." 
                 className="bg-transparent border-none focus:ring-0 text-sm ml-2 text-gray-600 dark:text-gray-200 placeholder-gray-400 w-48"
               />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 block w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
            <button 
              type="button"
              onClick={themeProps.toggle}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
              title={themeProps.isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {themeProps.isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
