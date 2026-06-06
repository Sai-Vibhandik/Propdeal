import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';

// Placeholder stats - will be replaced with API data
const stats = [
  {
    label: 'Total Properties',
    value: '24',
    change: '+3',
    changeType: 'increase',
    icon: Building2,
    color: 'bg-blue-500',
  },
  {
    label: 'Total Leads',
    value: '156',
    change: '+12',
    changeType: 'increase',
    icon: Users,
    color: 'bg-emerald-500',
  },
  {
    label: 'Page Views',
    value: '8.5K',
    change: '+24%',
    changeType: 'increase',
    icon: Eye,
    color: 'bg-amber-500',
  },
  {
    label: 'Conversion Rate',
    value: '3.2%',
    change: '-0.5%',
    changeType: 'decrease',
    icon: TrendingUp,
    color: 'bg-purple-500',
  },
];

const recentLeads = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@email.com', property: 'Prestige Lakeside', status: 'new', date: '2024-01-15' },
  { id: 2, name: 'Priya Patel', email: 'priya@email.com', property: 'DLF Camellias', status: 'contacted', date: '2024-01-15' },
  { id: 3, name: 'Amit Kumar', email: 'amit@email.com', property: 'Brigade Gateway', status: 'qualified', date: '2024-01-14' },
  { id: 4, name: 'Sneha Reddy', email: 'sneha@email.com', property: 'Lodha World', status: 'new', date: '2024-01-14' },
  { id: 5, name: 'Vikram Singh', email: 'vikram@email.com', property: 'Godrej Eden', status: 'site-visit', date: '2024-01-13' },
];

const recentProperties = [
  { id: 1, name: 'Prestige Lakeside Habitat', city: 'Bangalore', status: 'published', leads: 45, date: '2024-01-10' },
  { id: 2, name: 'DLF The Camellias', city: 'Gurgaon', status: 'published', leads: 32, date: '2024-01-08' },
  { id: 3, name: 'Godrej Eden Estate', city: 'Bangalore', status: 'draft', leads: 0, date: '2024-01-12' },
  { id: 4, name: 'Sobha Dream Acres', city: 'Bangalore', status: 'published', leads: 28, date: '2024-01-05' },
];

const getStatusColor = (status) => {
  const colors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    'site-visit': 'bg-purple-100 text-purple-800',
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const DashboardPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your properties.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.changeType === 'increase' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Leads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
                <a href="/admin/leads" className="text-sm text-blue-800 hover:text-blue-900">
                  View all
                </a>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-800 font-medium text-sm">
                        {lead.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.property}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{lead.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Properties */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Properties</h2>
                <a href="/admin/properties" className="text-sm text-blue-800 hover:text-blue-900">
                  View all
                </a>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentProperties.map((property) => (
                <div key={property.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{property.name}</p>
                    <p className="text-sm text-gray-500">{property.city}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{property.leads} leads</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/properties/new"
              className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <Building2 className="w-8 h-8 text-blue-800 mb-2" />
              <span className="text-sm font-medium text-gray-900">Add Property</span>
            </a>
            <a
              href="/admin/leads"
              className="flex flex-col items-center justify-center p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              <Users className="w-8 h-8 text-emerald-800 mb-2" />
              <span className="text-sm font-medium text-gray-900">View Leads</span>
            </a>
            <a
              href="/admin/analytics"
              className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
            >
              <TrendingUp className="w-8 h-8 text-amber-800 mb-2" />
              <span className="text-sm font-medium text-gray-900">Analytics</span>
            </a>
            <a
              href="/admin/settings"
              className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <Eye className="w-8 h-8 text-purple-800 mb-2" />
              <span className="text-sm font-medium text-gray-900">View Site</span>
            </a>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;