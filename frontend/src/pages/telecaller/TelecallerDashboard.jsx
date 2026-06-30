import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Phone, Mail, Calendar, Building2, Search, Eye, CheckCircle, Clock, XCircle, MapPin, ExternalLink, TrendingUp, ArrowRight, MessageSquareText, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { telecallerAPI } from '../../services/api.js';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout.jsx';

const statusColors = {
  'new': 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  'converted': 'bg-green-100 text-green-800',
  'lost': 'bg-red-100 text-red-800',
};

const statusLabels = {
  'new': 'New',
  'in-progress': 'In Progress',
  'converted': 'Converted',
  'lost': 'Lost',
};

const ITEMS_PER_PAGE = 10;

const TelecallerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  // Pagination states
  const [leadsPage, setLeadsPage] = useState(1);
  const [enquiriesPage, setEnquiriesPage] = useState(1);

  // Determine current page
  const isLeadsPage = location.pathname === '/telecaller/leads';
  const isPropertiesPage = location.pathname === '/telecaller/properties';
  const isEnquiriesPage = location.pathname === '/telecaller/enquiries';
  const isDashboard = !isLeadsPage && !isPropertiesPage && !isEnquiriesPage;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [propertiesRes, leadsRes, enquiriesRes] = await Promise.all([
        telecallerAPI.getMyProperties(),
        telecallerAPI.getMyLeads({}),
        telecallerAPI.getMyEnquiries({}),
      ]);
      setProperties(propertiesRes.data.data || []);
      setLeads(leadsRes.data.data || []);
      setEnquiries(enquiriesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    // Search filter
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.propertyId?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = !statusFilter || lead.status === statusFilter;

    // Property filter
    const matchesProperty = !propertyFilter || lead.propertyId?._id === propertyFilter || lead.propertyId === propertyFilter;

    // Source filter
    const matchesSource = !sourceFilter || lead.source === sourceFilter;

    // Date range filter
    let matchesDate = true;
    if (dateRange.start) {
      const leadDate = new Date(lead.createdAt);
      const startDate = new Date(dateRange.start);
      matchesDate = matchesDate && leadDate >= startDate;
    }
    if (dateRange.end) {
      const leadDate = new Date(lead.createdAt);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && leadDate <= endDate;
    }

    return matchesSearch && matchesStatus && matchesProperty && matchesSource && matchesDate;
  });

  // Get unique sources for filter
  const uniqueSources = [...new Set(leads.map(l => l.source).filter(Boolean))];

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPropertyFilter('');
    setSourceFilter('');
    setDateRange({ start: '', end: '' });
  };

  const hasActiveFilters = searchTerm || statusFilter || propertyFilter || sourceFilter || dateRange.start || dateRange.end;

  // Update lead status
  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      await telecallerAPI.updateLeadStatus(leadId, newStatus);
      toast.success('Status updated successfully');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Export leads for telecaller
  const handleExportLeads = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (propertyFilter) params.propertyId = propertyFilter;
      if (sourceFilter) params.source = sourceFilter;
      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;

      const response = await telecallerAPI.exportLeads(params);

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `my-leads-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Leads exported successfully');
    } catch (error) {
      console.error('Error exporting leads:', error);
      toast.error('Failed to export leads');
    }
  };

  // Export enquiries for telecaller
  const handleExportEnquiries = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;

      const response = await telecallerAPI.exportEnquiries(params);

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `my-enquiries-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Enquiries exported successfully');
    } catch (error) {
      console.error('Error exporting enquiries:', error);
      toast.error('Failed to export enquiries');
    }
  };

  // Stats calculations
  const stats = {
    properties: properties.length,
    leads: leads.length,
    enquiries: enquiries.length,
    converted: leads.filter(l => l.status === 'converted').length,
  };

  // Enquiries filtered
  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch =
      enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.phone?.includes(searchTerm);
    const matchesStatus = !statusFilter || enquiry.status === statusFilter;

    // Date range filter
    let matchesDate = true;
    if (dateRange.start) {
      const enquiryDate = new Date(enquiry.createdAt);
      const startDate = new Date(dateRange.start);
      matchesDate = matchesDate && enquiryDate >= startDate;
    }
    if (dateRange.end) {
      const enquiryDate = new Date(enquiry.createdAt);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && enquiryDate <= endDate;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Update enquiry status
  const handleUpdateEnquiryStatus = async (enquiryId, newStatus) => {
    try {
      await telecallerAPI.updateEnquiryStatus(enquiryId, newStatus);
      toast.success('Status updated successfully');
      fetchData();
      if (selectedEnquiry && selectedEnquiry._id === enquiryId) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating enquiry status:', error);
      toast.error('Failed to update status');
    }
  };

  // Dashboard View
  if (isDashboard) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome back! Here's your overview.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Assigned Properties</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.properties}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Total Leads</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.leads}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Enquiries</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.enquiries}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquareText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Converted</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.converted}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/telecaller/leads')}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">My Leads</h3>
                  <p className="text-sm text-gray-500">View and manage your assigned leads</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>
            <button
              onClick={() => navigate('/telecaller/enquiries')}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquareText className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">My Enquiries</h3>
                  <p className="text-sm text-gray-500">Manage contact form enquiries</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </button>
            <button
              onClick={() => navigate('/telecaller/properties')}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">My Properties</h3>
                  <p className="text-sm text-gray-500">View your assigned properties</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </button>
          </div>

          {/* Recent Leads */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Recent Leads</h3>
              <button
                onClick={() => navigate('/telecaller/leads')}
                className="text-sm text-blue-800 hover:underline"
              >
                View All
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800"></div>
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No leads assigned yet
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {leads.slice(0, 5).map((lead) => (
                  <div key={lead._id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-800 font-medium text-sm">
                          {lead.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{lead.name}</p>
                        <p className="text-sm text-gray-500 truncate">{lead.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 pl-13 sm:pl-0">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${statusColors[lead.status]}`}>
                        {statusLabels[lead.status]}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">{formatDate(lead.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  }

  // My Leads Page
  if (isLeadsPage) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Leads</h1>
              <p className="text-gray-500">All leads assigned to you</p>
            </div>
            <button
              onClick={handleExportLeads}
              className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="new">🆕 New</option>
                <option value="in-progress">🔄 In Progress</option>
                <option value="converted">✅ Converted</option>
                <option value="lost">❌ Lost</option>
              </select>

              {/* Property Filter */}
              <select
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Properties</option>
                {properties.map((property) => (
                  <option key={property._id} value={property._id}>
                    {property.name}
                  </option>
                ))}
              </select>

              {/* Source Filter */}
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sources</option>
                {uniqueSources.map((source) => (
                  <option key={source} value={source}>
                    {source.charAt(0).toUpperCase() + source.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500 whitespace-nowrap">From:</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500 whitespace-nowrap">To:</label>
                <input
                  type="date"
                  value={dateRange.end}
                  min={dateRange.start || ''}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-500">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Search: {searchTerm}
                    <button onClick={() => setSearchTerm('')} className="hover:bg-blue-200 rounded-full p-0.5">×</button>
                  </span>
                )}
                {statusFilter && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Status: {statusLabels[statusFilter]}
                    <button onClick={() => setStatusFilter('')} className="hover:bg-blue-200 rounded-full p-0.5">×</button>
                  </span>
                )}
                {propertyFilter && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Property: {properties.find(p => p._id === propertyFilter)?.name || 'Selected'}
                    <button onClick={() => setPropertyFilter('')} className="hover:bg-blue-200 rounded-full p-0.5">×</button>
                  </span>
                )}
                {sourceFilter && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Source: {sourceFilter}
                    <button onClick={() => setSourceFilter('')} className="hover:bg-blue-200 rounded-full p-0.5">×</button>
                  </span>
                )}
                {(dateRange.start || dateRange.end) && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Date Range
                    <button onClick={() => setDateRange({ start: '', end: '' })} className="hover:bg-blue-200 rounded-full p-0.5">×</button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {filteredLeads.length} of {leads.length} leads
            </p>
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No leads assigned</h3>
                <p className="text-gray-500">You will see leads here when they are assigned to you</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">Sr. No.</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLeads.slice((leadsPage - 1) * ITEMS_PER_PAGE, leadsPage * ITEMS_PER_PAGE).map((lead, index) => (
                      <motion.tr key={lead._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-gray-600 font-medium">
                          {(leadsPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{lead.name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <Phone className="w-3 h-3" />
                              <span>{lead.phone}</span>
                            </div>
                            {lead.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Mail className="w-3 h-3" />
                                <span>{lead.email}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-gray-900">{lead.propertyId?.name || '-'}</p>
                          <p className="text-sm text-gray-500">{lead.propertyId?.address?.city}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600 capitalize">{lead.source || 'Website'}</span>
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateStatus(lead._id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${statusColors[lead.status] || 'bg-gray-100 text-gray-800'}`}
                          >
                            <option value="new">New</option>
                            <option value="in-progress">In Progress</option>
                            <option value="converted">Converted</option>
                            <option value="lost">Lost</option>
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(lead.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => { setSelectedLead(lead); setShowModal(true); }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Leads Pagination */}
            {Math.ceil(filteredLeads.length / ITEMS_PER_PAGE) > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {((leadsPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(leadsPage * ITEMS_PER_PAGE, filteredLeads.length)} of {filteredLeads.length} leads
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLeadsPage(prev => Math.max(prev - 1, 1))}
                    disabled={leadsPage === 1}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, Math.ceil(filteredLeads.length / ITEMS_PER_PAGE)) }, (_, i) => {
                      const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (leadsPage <= 3) {
                        pageNum = i + 1;
                      } else if (leadsPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = leadsPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setLeadsPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium ${
                            leadsPage === pageNum
                              ? 'bg-blue-800 text-white'
                              : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setLeadsPage(prev => Math.min(prev + 1, Math.ceil(filteredLeads.length / ITEMS_PER_PAGE)))}
                    disabled={leadsPage === Math.ceil(filteredLeads.length / ITEMS_PER_PAGE)}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Lead Detail Modal */}
          {showModal && selectedLead && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Lead Details</h2>
                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                  <div><label className="text-sm text-gray-500">Name</label><p className="font-medium text-gray-900">{selectedLead.name}</p></div>
                  <div><label className="text-sm text-gray-500">Phone</label><p className="font-medium text-gray-900">{selectedLead.phone}</p></div>
                  {selectedLead.email && <div><label className="text-sm text-gray-500">Email</label><p className="font-medium text-gray-900">{selectedLead.email}</p></div>}
                  <div><label className="text-sm text-gray-500">Property</label><p className="font-medium text-gray-900">{selectedLead.propertyId?.name || '-'}</p></div>
                  {selectedLead.message && <div><label className="text-sm text-gray-500">Message</label><p className="font-medium text-gray-900">{selectedLead.message}</p></div>}
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <p><span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedLead.status]}`}>{statusLabels[selectedLead.status]}</span></p>
                  </div>
                  <div><label className="text-sm text-gray-500">Created</label><p className="text-gray-900">{new Date(selectedLead.createdAt).toLocaleString()}</p></div>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                  <div className="flex gap-3">
                    <a href={`tel:${selectedLead.phone}`} className="flex-1 py-2 px-4 bg-blue-800 text-white text-center font-medium rounded-lg hover:bg-blue-900 transition-colors cursor-pointer">Call Now</a>
                    {selectedLead.email && (
                      <button
                        onClick={() => {
                          const subject = `Follow up - ${selectedLead.propertyId?.name || 'Property Inquiry'}`;
                          const body = `Hi ${selectedLead.name},\n\nI'm reaching out regarding your inquiry for ${selectedLead.propertyId?.name || 'our property'}.\n\nBest regards`;
                          window.open(`https://mail.google.com/mail/?view=cm&to=${selectedLead.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                        }}
                        className="flex-1 py-2 px-4 bg-white border border-gray-200 text-gray-700 text-center font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        Send Email
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  // My Enquiries Page
  if (isEnquiriesPage) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Enquiries</h1>
              <p className="text-gray-500">Contact form enquiries assigned to you</p>
            </div>
            <button
              onClick={handleExportEnquiries}
              className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  maxLength={100}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="new">🆕 New</option>
                <option value="in-progress">🔄 In Progress</option>
                <option value="converted">✅ Converted</option>
                <option value="lost">❌ Lost</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500 whitespace-nowrap">From:</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500 whitespace-nowrap">To:</label>
                <input
                  type="date"
                  value={dateRange.end}
                  min={dateRange.start || ''}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {(statusFilter || dateRange.start || dateRange.end) && (
                <button
                  onClick={() => {
                    setStatusFilter('');
                    setDateRange({ start: '', end: '' });
                  }}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {filteredEnquiries.length} of {enquiries.length} enquiries
            </p>
          </div>

          {/* Enquiries Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
              </div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquareText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No enquiries assigned</h3>
                <p className="text-gray-500">You will see enquiries here when they are assigned to you</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">Sr. No.</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredEnquiries.slice((enquiriesPage - 1) * ITEMS_PER_PAGE, enquiriesPage * ITEMS_PER_PAGE).map((enquiry, index) => (
                      <motion.tr key={enquiry._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-gray-600 font-medium">
                          {(enquiriesPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{enquiry.name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <Phone className="w-3 h-3" />
                              <span>{enquiry.phone}</span>
                            </div>
                            {enquiry.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Mail className="w-3 h-3" />
                                <span>{enquiry.email}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={enquiry.status || 'new'}
                            onChange={(e) => handleUpdateEnquiryStatus(enquiry._id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${statusColors[enquiry.status] || 'bg-gray-100 text-gray-800'}`}
                          >
                            <option value="new">New</option>
                            <option value="in-progress">In Progress</option>
                            <option value="converted">Converted</option>
                            <option value="lost">Lost</option>
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(enquiry.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => { setSelectedEnquiry(enquiry); setShowEnquiryModal(true); }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Enquiries Pagination */}
            {Math.ceil(filteredEnquiries.length / ITEMS_PER_PAGE) > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {((enquiriesPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(enquiriesPage * ITEMS_PER_PAGE, filteredEnquiries.length)} of {filteredEnquiries.length} enquiries
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEnquiriesPage(prev => Math.max(prev - 1, 1))}
                    disabled={enquiriesPage === 1}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, Math.ceil(filteredEnquiries.length / ITEMS_PER_PAGE)) }, (_, i) => {
                      const totalPages = Math.ceil(filteredEnquiries.length / ITEMS_PER_PAGE);
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (enquiriesPage <= 3) {
                        pageNum = i + 1;
                      } else if (enquiriesPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = enquiriesPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setEnquiriesPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium ${
                            enquiriesPage === pageNum
                              ? 'bg-blue-800 text-white'
                              : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setEnquiriesPage(prev => Math.min(prev + 1, Math.ceil(filteredEnquiries.length / ITEMS_PER_PAGE)))}
                    disabled={enquiriesPage === Math.ceil(filteredEnquiries.length / ITEMS_PER_PAGE)}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enquiry Detail Modal */}
          {showEnquiryModal && selectedEnquiry && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Enquiry Details</h2>
                    <button onClick={() => setShowEnquiryModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                  <div><label className="text-sm text-gray-500">Name</label><p className="font-medium text-gray-900">{selectedEnquiry.name}</p></div>
                  <div><label className="text-sm text-gray-500">Phone</label><p className="font-medium text-gray-900">{selectedEnquiry.phone}</p></div>
                  {selectedEnquiry.email && <div><label className="text-sm text-gray-500">Email</label><p className="font-medium text-gray-900">{selectedEnquiry.email}</p></div>}
                  {selectedEnquiry.message && <div><label className="text-sm text-gray-500">Message</label><p className="text-gray-700 bg-gray-50 rounded-lg p-3">{selectedEnquiry.message}</p></div>}
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <p><span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedEnquiry.status]}`}>{statusLabels[selectedEnquiry.status]}</span></p>
                  </div>
                  <div><label className="text-sm text-gray-500">Submitted</label><p className="text-gray-900">{new Date(selectedEnquiry.createdAt).toLocaleString()}</p></div>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                  <div className="flex gap-3">
                    <a href={`tel:${selectedEnquiry.phone}`} className="flex-1 py-2 px-4 bg-blue-800 text-white text-center font-medium rounded-lg hover:bg-blue-900 transition-colors cursor-pointer">Call Now</a>
                    {selectedEnquiry.email && (
                      <button
                        onClick={() => {
                          const subject = 'Follow up - Your Inquiry';
                          const body = `Hi ${selectedEnquiry.name},\n\nI'm reaching out regarding your inquiry.\n\nBest regards`;
                          window.open(`https://mail.google.com/mail/?view=cm&to=${selectedEnquiry.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                        }}
                        className="flex-1 py-2 px-4 bg-white border border-gray-200 text-gray-700 text-center font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        Send Email
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  // My Properties Page
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-500">Properties assigned to you for lead distribution</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No properties assigned</h3>
            <p className="text-gray-500">Contact your admin to get assigned to properties</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => {
              const propertyLeads = leads.filter(lead => lead.propertyId?._id === property._id || lead.propertyId === property._id);

              return (
                <div key={property._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="px-4 pt-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${property.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {property.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg">{property.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 mt-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{property.address?.locality && `${property.address.locality}, `}{property.address?.city}</span>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 mt-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-800 font-medium">{propertyLeads.length} Leads</span>
                      </div>
                    </div>
                    {property.distributeLeads && (
                      <div className="flex items-center gap-2 mt-3 text-sm text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Lead distribution active</span>
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      {property.status === 'published' && property.slug && (
                        <a href={`/property/${property.slug}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                          View Page
                        </a>
                      )}
                      <button onClick={() => navigate('/telecaller/leads')} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        View Leads
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TelecallerDashboard;