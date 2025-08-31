import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogOut, Upload, Eye, Home, Activity } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, roles: ['technician', 'dentist'] },
    { name: 'Upload Scans', href: '/upload', icon: Upload, roles: ['technician'] },
    { name: 'View Scans', href: '/viewer', icon: Eye, roles: ['dentist'] }
  ].filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-medical-light">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-medical-primary" />
                <span className="text-xl font-bold text-medical-dark">OralVis Healthcare</span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'text-medical-primary border-b-2 border-medical-primary'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-600">Welcome, </span>
                <span className="font-medium text-medical-dark">{user?.name}</span>
                <span className="ml-2 px-2 py-1 text-xs bg-medical-primary text-white rounded-full capitalize">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;