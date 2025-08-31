import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Upload, Eye, Activity, Users, FileImage, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Total Scans', value: '1,247', icon: FileImage, color: 'text-blue-600 bg-blue-100' },
    { name: 'Active Patients', value: '389', icon: Users, color: 'text-green-600 bg-green-100' },
    { name: 'Today\'s Uploads', value: '23', icon: Calendar, color: 'text-purple-600 bg-purple-100' },
    { name: 'System Status', value: 'Online', icon: Activity, color: 'text-emerald-600 bg-emerald-100' }
  ];

  const quickActions = user?.role === 'technician' 
    ? [
        {
          title: 'Upload New Scan',
          description: 'Upload patient dental scans and radiographs',
          icon: Upload,
          href: '/upload',
          color: 'bg-medical-primary hover:bg-medical-secondary'
        }
      ]
    : [
        {
          title: 'View All Scans',
          description: 'Review patient scans and generate reports',
          icon: Eye,
          href: '/viewer',
          color: 'bg-medical-primary hover:bg-medical-secondary'
        }
      ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-medical-dark mb-2">
          Welcome to OralVis Healthcare
        </h1>
        <p className="text-lg text-gray-600">
          Hello {user?.name}, you're logged in as a {user?.role}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-medical-dark">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              to={action.href}
              className="group"
            >
              <div className="card group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-medical-dark mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600">{action.description}</p>
                  </div>
                  <div className={`p-4 rounded-lg text-white ${action.color} transition-colors duration-200`}>
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-medical-dark mb-4">System Information</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">System Status</span>
            <span className="text-medical-success font-medium">All Systems Operational</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Last Backup</span>
            <span className="text-gray-800">Today, 3:00 AM</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">Server Uptime</span>
            <span className="text-gray-800">99.9%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;