import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Users, MousePointer, Building2, Mail, MessageSquareText, Filter } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { analyticsAPI, leadsAPI, propertiesAPI } from '../../services/api.js';
import toast from 'react-hot-toast';

const statusColors = {
  'new': 'bg-blue-500',
  'in-progress': 'bg-yellow-500',
  'converted': 'bg-green-500',
  'lost': 'bg-red-500',
};

const sourceColors = {
  'homepage': 'bg-purple-500',
  'property-page': 'bg-indigo-500',
  'cta-price': 'bg-cyan-500',
  'cta-visit': 'bg-teal-500',
  'cta-brochure': 'bg-orange-500',
  'cta-callback': 'bg-pink-500',
  'contact-section': 'bg-emerald-500',
};

// Chart colors
const STATUS_CHART_COLORS = {
  'new': '#3b82f6',
  'in-progress': '#eab308',
  'converted': '#22c55e',
  'lost': '#ef4444',
};

const SOURCE_CHART_COLORS = {
  'homepage': '#8b5cf6',
  'property-page': '#6366f1',
  'cta-price': '#06b6d4',
  'cta-visit': '#14b8a6',
  'cta-brochure': '#f97316',
  'cta-callback': '#ec4899',
  'contact-section': '#10b981',
};

const getStatusColor = (status) => STATUS_CHART_COLORS[status] || '#6b7280';
const getSourceColor = (source) => SOURCE_CHART_COLORS[source] || '#6b7280';

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    fetchAnalytics();
    fetchRecentLeads();
  }, [dateRange, selectedProperty]);

  const fetchProperties = async () => {
    try {
      const response = await propertiesAPI.getAdminAll({ limit: 100, status: 'published' });
      setProperties(response.data.data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };
      if (selectedProperty) {
        params.propertyId = selectedProperty;
      }
      const response = await analyticsAPI.getDashboard(params);
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentLeads = async () => {
    try {
      const params = { limit: 5, sort: '-createdAt' };
      if (selectedProperty) {
        params.propertyId = selectedProperty;
      }
      const response = await leadsAPI.getAdminAll(params);
      setRecentLeads(response.data.data || []);
    } catch (error) {
      console.error('Error fetching recent leads:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Calculate stats from real data
  const stats = analytics ? [
    {
      label: 'Total Properties',
      value: analytics.summary?.totalProperties || 0,
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Leads',
      value: analytics.summary?.totalLeads || 0,
      icon: Users,
      color: 'bg-emerald-500',
    },
    {
      label: 'New Leads',
      value: analytics.summary?.newLeads || 0,
      icon: Mail,
      color: 'bg-amber-500',
    },
    {
      label: 'Page Views',
      value: analytics.summary?.totalPageViews?.toLocaleString() || 0,
      icon: Eye,
      color: 'bg-purple-500',
    },
    {
      label: 'CTA Clicks',
      value: analytics.summary?.ctaClicks?.toLocaleString() || 0,
      icon: MousePointer,
      color: 'bg-orange-500',
    },
  ] : [];

  // Get leads by status data
  const leadsByStatus = analytics?.leadsByStatus || [];

  // Get leads by source data
  const leadsBySource = analytics?.leadsBySource || [];

  // Get daily page views data - fill in missing dates
  const rawDailyData = analytics?.dailyPageViews || [];

  // Generate all dates in range and merge with actual data
  const generateDateRange = (start, end) => {
    const dates = [];
    const current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      dates.push(new Date(current).toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const allDates = generateDateRange(dateRange.startDate, dateRange.endDate);
  const dailyData = allDates.map(date => {
    const found = rawDailyData.find(d => d._id === date);
    return {
      _id: date,
      pageViews: found ? found.pageViews : 0,
    };
  });

  // Get top properties
  const topProperties = analytics?.topProperties || [];

  // Get top telecallers (for single property)
  const topTelecallers = analytics?.topTelecallers || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500 mt-1">Track your property performance and visitor engagement.</p>
          </div>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Property Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[200px]"
              >
                <option value="">All Properties</option>
                {properties.map((prop) => (
                  <option key={prop._id} value={prop._id}>
                    {prop.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Date Range */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
                  >
                    <div className={`p-2 sm:p-3 rounded-lg ${stat.color} w-fit`}>
                      <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="mt-3">
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Leads by Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Leads by Status</h2>
                {leadsByStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={leadsByStatus.map(item => ({
                          name: item._id?.replace(/-/g, ' ') || 'Unknown',
                          value: item.count,
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {leadsByStatus.map((item, index) => (
                          <Cell key={`cell-${index}`} fill={getStatusColor(item._id)} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No leads data available
                  </div>
                )}
              </motion.div>

              {/* Leads by Source */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Leads by Source</h2>
                {leadsBySource.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={leadsBySource.map(item => ({
                        name: (item._id?.replace(/-/g, ' ') || 'Unknown').replace(/\b\w/g, l => l.toUpperCase()),
                        count: item.count,
                      }))}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                      <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12, fill: '#374151' }}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                        formatter={(value) => [`${value} leads`, 'Count']}
                      />
                      <Bar
                        dataKey="count"
                        fill="#8b5cf6"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No leads data available
                  </div>
                )}
              </motion.div>
            </div>

            {/* Daily Page Views Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Page Views Over Time</h2>
                {dailyData.length > 0 && (
                  <div className="text-sm text-gray-500">
                    Total: <span className="font-semibold text-gray-900">{dailyData.reduce((sum, d) => sum + (d.pageViews || 0), 0).toLocaleString()}</span>
                  </div>
                )}
              </div>
              {dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyData.slice(-30).map(d => ({
                    date: new Date(d._id).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                    views: d.pageViews || 0,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                      labelStyle={{ color: '#9ca3af' }}
                    />
                    <Bar
                      dataKey="views"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No page views data available</p>
                </div>
              )}
            </motion.div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Properties OR Top Telecallers (when property selected) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                {selectedProperty ? (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Telecallers</h2>
                    {topTelecallers.length > 0 ? (
                      <div className="space-y-4">
                        {topTelecallers.map((telecaller, index) => (
                          <div key={telecaller._id} className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{telecaller.name}</p>
                              <p className="text-sm text-gray-500">{telecaller.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{telecaller.count}</p>
                              <p className="text-xs text-gray-500">converted</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No converted leads yet</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Properties by Views</h2>
                    {topProperties.length > 0 ? (
                      <div className="space-y-4">
                        {topProperties.map((prop, index) => (
                          <div key={prop._id} className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{prop.property?.name || 'Unknown Property'}</p>
                              <p className="text-sm text-gray-500">{prop.property?.address?.city || ''}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{prop.totalViews?.toLocaleString() || 0}</p>
                              <p className="text-xs text-gray-500">views</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No property views data available
                      </div>
                    )}
                  </>
                )}
              </motion.div>

              {/* Recent Leads */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedProperty ? 'Property Leads' : 'Recent Leads'}
                </h2>
                {recentLeads.length > 0 ? (
                  <div className="space-y-3">
                    {recentLeads.map((lead) => (
                      <div key={lead._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-800 font-medium text-sm">
                            {lead.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{lead.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            {lead.source === 'contact-section' ? (
                              <MessageSquareText className="w-3 h-3" />
                            ) : (
                              <Building2 className="w-3 h-3" />
                            )}
                            <span className="capitalize truncate">
                              {lead.source === 'contact-section' ? 'Enquiry' : lead.propertyId?.name || lead.source || 'Website'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            statusColors[lead.status] || 'bg-gray-100 text-gray-800'
                          }`}>
                            {lead.status?.replace(/-/g, ' ') || 'new'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No leads yet
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;