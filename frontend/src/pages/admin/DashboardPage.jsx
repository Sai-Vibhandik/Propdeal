import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp, Eye, Loader2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { analyticsAPI, leadsAPI, propertiesAPI } from '../../services/api.js';

const getStatusColor = (status) => {
  const colors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-orange-100 text-orange-800',
    qualified: 'bg-green-100 text-green-800',
    converted: 'bg-emerald-100 text-emerald-800',
    lost: 'bg-red-100 text-red-800',
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch analytics, leads, and properties in parallel
      const [analyticsRes, leadsRes, propertiesRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        leadsAPI.getAdminAll({ limit: 5, sort: '-createdAt' }),
        propertiesAPI.getAdminAll({ limit: 5, sort: '-createdAt' }),
      ]);

      // Process analytics for stats
      const analyticsData = analyticsRes.data?.data || {};
      const summary = analyticsData.summary || {};

      const statsData = [
        {
          label: 'Total Properties',
          value: summary.totalProperties || 0,
          icon: Building2,
          color: 'bg-blue-500',
        },
        {
          label: 'Total Leads',
          value: summary.totalLeads || 0,
          icon: Users,
          color: 'bg-emerald-500',
        },
        {
          label: 'Page Views',
          value: summary.totalPageViews?.toLocaleString() || '0',
          icon: Eye,
          color: 'bg-amber-500',
        },
        {
          label: 'CTA Clicks',
          value: summary.ctaClicks?.toLocaleString() || '0',
          icon: TrendingUp,
          color: 'bg-purple-500',
        },
      ];

      setStats(statsData);

      // Process recent leads
      const leads = leadsRes.data?.leads || leadsRes.data?.data || [];
      setRecentLeads(leads.slice(0, 5));

      // Process recent properties
      const properties = propertiesRes.data?.properties || propertiesRes.data?.data || [];
      setRecentProperties(properties.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

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
                <div className={`p-3 rounded-lg ${stat.color} w-fit`}>
                  <Icon className="w-6 h-6 text-white" />
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
                <a href="/admin/leads" className="text-sm text-blue-600 hover:text-blue-800">
                  View all
                </a>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentLeads.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No leads yet
                </div>
              ) : (
                recentLeads.map((lead) => (
                  <div key={lead._id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-800 font-medium text-sm">
                          {getInitials(lead.name)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.propertyId?.name || 'No Property'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(lead.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
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
                <a href="/admin/properties" className="text-sm text-blue-600 hover:text-blue-800">
                  View all
                </a>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentProperties.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No properties yet
                </div>
              ) : (
                recentProperties.map((property) => (
                  <div key={property._id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{property.name}</p>
                      <p className="text-sm text-gray-500">{property.address?.city || property.address?.locality || 'No Location'}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">{property.leadCount || 0} leads</p>
                    </div>
                  </div>
                ))
              )}
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
              <Building2 className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Add Property</span>
            </a>
            <a
              href="/admin/leads"
              className="flex flex-col items-center justify-center p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              <Users className="w-8 h-8 text-emerald-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">View Leads</span>
            </a>
            <a
              href="/admin/analytics"
              className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
            >
              <TrendingUp className="w-8 h-8 text-amber-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Analytics</span>
            </a>
            <a
              href="/admin/settings"
              className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <Eye className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">View Site</span>
            </a>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;