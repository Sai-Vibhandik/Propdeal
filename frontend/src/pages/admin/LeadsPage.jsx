import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Phone, Mail, Calendar, Building2, Search, Filter, Download, Eye, MessageSquare, CheckCircle, Clock, XCircle, UserCog, ChevronDown } from 'lucide-react';
import { leadsAPI, adminAPI } from '../../services/api.js';
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

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [telecallers, setTelecallers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchTelecallers();
  }, [statusFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const response = await leadsAPI.getAdminAll(params);
      setLeads(response.data.data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchTelecallers = async () => {
    try {
      const response = await adminAPI.getTelecallers();
      setTelecallers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching telecallers:', error);
    }
  };

  const handleAssignLead = async (leadId, telecallerId) => {
    try {
      await leadsAPI.assign(leadId, telecallerId);
      toast.success(telecallerId ? 'Lead assigned successfully' : 'Lead unassigned successfully');
      fetchLeads();
      if (selectedLead && selectedLead._id === leadId) {
        const telecaller = telecallers.find(t => t._id === telecallerId);
        setSelectedLead({ ...selectedLead, assignedTo: telecaller || null });
      }
    } catch (error) {
      console.error('Error assigning lead:', error);
      toast.error('Failed to assign lead');
    }
  };

  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      await leadsAPI.updateStatus(leadId, newStatus);
      toast.success('Status updated successfully');
      fetchLeads();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.propertyId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleExport = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;

      const response = await leadsAPI.export(params);

      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
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

  return (
    <AdminLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500">Manage and track property inquiries</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Leads</p>
              <p className="text-xl font-bold text-gray-900">{leads.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-xl font-bold text-gray-900">
                {leads.filter(l => l.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Converted</p>
              <p className="text-xl font-bold text-gray-900">
                {leads.filter(l => l.status === 'converted').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Lost</p>
              <p className="text-xl font-bold text-gray-900">
                {leads.filter(l => l.status === 'lost').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            <h3 className="text-lg font-medium text-gray-900">No leads found</h3>
            <p className="text-gray-500">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <motion.tr
                    key={lead._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
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
                      <p className="text-gray-900">{lead.propertyId?.name || lead.property?.name || '-'}</p>
                      <p className="text-sm text-gray-500">{lead.propertyId?.address?.city || lead.property?.address?.city}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative">
                        <select
                          value={lead.assignedTo?._id || ''}
                          onChange={(e) => handleAssignLead(lead._id, e.target.value)}
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none pr-8 ${
                            lead.assignedTo
                              ? 'border-blue-200 bg-blue-50 text-blue-800'
                              : 'border-gray-200 bg-gray-50 text-gray-500'
                          }`}
                        >
                          <option value="">Unassigned</option>
                          {telecallers.map((telecaller) => (
                            <option key={telecaller._id} value={telecaller._id}>
                              {telecaller.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      {lead.assignedTo?.phone && (
                        <p className="text-xs text-gray-500 mt-1">{lead.assignedTo.phone}</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600 capitalize">{lead.source || 'Website'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${
                          statusColors[lead.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
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
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowModal(true);
                        }}
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
      </div>

      {/* Lead Detail Modal */}
      {showModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Lead Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium text-gray-900">{selectedLead.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="font-medium text-gray-900">{selectedLead.phone}</p>
              </div>
              {selectedLead.email && (
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium text-gray-900">{selectedLead.email}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-500">Property</label>
                <p className="font-medium text-gray-900">{selectedLead.propertyId?.name || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Source</label>
                <p className="font-medium text-gray-900 capitalize">{selectedLead.source || 'Website'}</p>
              </div>
              {selectedLead.message && (
                <div>
                  <label className="text-sm text-gray-500">Message</label>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{selectedLead.message}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[selectedLead.status]
                }`}>
                  {statusLabels[selectedLead.status]}
                </span>
              </div>
              <div>
                <label className="text-sm text-gray-500">Assigned Telecaller</label>
                <select
                  value={selectedLead.assignedTo?._id || ''}
                  onChange={(e) => {
                    const telecallerId = e.target.value;
                    handleAssignLead(selectedLead._id, telecallerId);
                    const telecaller = telecallers.find(t => t._id === telecallerId);
                    setSelectedLead({ ...selectedLead, assignedTo: telecaller || null });
                  }}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {telecallers.map((telecaller) => (
                    <option key={telecaller._id} value={telecaller._id}>
                      {telecaller.name} {telecaller.phone ? `(${telecaller.phone})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500">Created</label>
                <p className="text-gray-900">{new Date(selectedLead.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex gap-3">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="flex-1 py-2 px-4 bg-blue-800 text-white text-center font-medium rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                >
                  Call Now
                </a>
                {selectedLead.email && (
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="flex-1 py-2 px-4 bg-white border border-gray-200 text-gray-700 text-center font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Send Email
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default LeadsPage;