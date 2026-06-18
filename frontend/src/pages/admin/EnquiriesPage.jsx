import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, Phone, Mail, Calendar, Search, Eye, CheckCircle, Clock, XCircle, Download, ChevronDown, UserCog } from 'lucide-react';
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

const EnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [telecallers, setTelecallers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEnquiries();
    fetchTelecallers();
  }, [statusFilter]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = { source: 'contact-section' };
      if (statusFilter) params.status = statusFilter;
      const response = await leadsAPI.getAdminAll(params);
      setEnquiries(response.data.data || []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      toast.error('Failed to load enquiries');
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

  const handleStatusUpdate = async (enquiryId, newStatus) => {
    try {
      await leadsAPI.updateStatus(enquiryId, newStatus);
      toast.success('Status updated successfully');
      fetchEnquiries();
      if (selectedEnquiry && selectedEnquiry._id === enquiryId) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleAssignEnquiry = async (enquiryId, telecallerId) => {
    try {
      await leadsAPI.assign(enquiryId, telecallerId);
      toast.success(telecallerId ? 'Enquiry assigned successfully' : 'Enquiry unassigned successfully');
      fetchEnquiries();
      if (selectedEnquiry && selectedEnquiry._id === enquiryId) {
        const telecaller = telecallers.find(t => t._id === telecallerId);
        setSelectedEnquiry({ ...selectedEnquiry, assignedTo: telecaller || null });
      }
    } catch (error) {
      console.error('Error assigning enquiry:', error);
      toast.error('Failed to assign enquiry');
    }
  };

  const handleExport = async () => {
    try {
      const params = { source: 'contact-section' };
      if (statusFilter) params.status = statusFilter;

      const response = await leadsAPI.export(params);

      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `enquiries-${new Date().toISOString().split('T')[0]}.csv`;
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

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch =
      enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.phone?.includes(searchTerm) ||
      enquiry.message?.toLowerCase().includes(searchTerm.toLowerCase());
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
            <p className="text-gray-500">General enquiries from website contact form</p>
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
                <MessageSquareText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Enquiries</p>
                <p className="text-xl font-bold text-gray-900">{enquiries.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">New</p>
                <p className="text-xl font-bold text-gray-900">
                  {enquiries.filter(e => e.status === 'new').length}
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
                  {enquiries.filter(e => e.status === 'converted').length}
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
                  {enquiries.filter(e => e.status === 'lost').length}
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
                placeholder="Search by name, email, phone, or message..."
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
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
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
              <h3 className="text-lg font-medium text-gray-900">No enquiries found</h3>
              <p className="text-gray-500">Enquiries from the contact form will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEnquiries.map((enquiry) => (
                    <motion.tr
                      key={enquiry._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
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
                        <p className="text-gray-700 line-clamp-2 max-w-xs">
                          {enquiry.message || 'No message provided'}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="relative">
                          <select
                            value={enquiry.assignedTo?._id || ''}
                            onChange={(e) => handleAssignEnquiry(enquiry._id, e.target.value)}
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none pr-8 ${
                              enquiry.assignedTo
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
                        {enquiry.assignedTo?.phone && (
                          <p className="text-xs text-gray-500 mt-1">{enquiry.assignedTo.phone}</p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={enquiry.status || 'new'}
                          onChange={(e) => handleStatusUpdate(enquiry._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${
                            statusColors[enquiry.status] || 'bg-gray-100 text-gray-800'
                          }`}
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
                          onClick={() => {
                            setSelectedEnquiry(enquiry);
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

        {/* Enquiry Detail Modal */}
        {showModal && selectedEnquiry && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Enquiry Details</h2>
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
                  <p className="font-medium text-gray-900">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium text-gray-900">{selectedEnquiry.phone}</p>
                </div>
                {selectedEnquiry.email && (
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium text-gray-900">{selectedEnquiry.email}</p>
                  </div>
                )}
                {selectedEnquiry.message && (
                  <div>
                    <label className="text-sm text-gray-500">Message</label>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{selectedEnquiry.message}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-500">Source</label>
                  <p className="font-medium text-gray-900 capitalize">
                    {selectedEnquiry.source?.replace(/-/g, ' ') || 'Website'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <select
                    value={selectedEnquiry.status || 'new'}
                    onChange={(e) => handleStatusUpdate(selectedEnquiry._id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${
                      statusColors[selectedEnquiry.status] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Assign to Telecaller</label>
                  <select
                    value={selectedEnquiry.assignedTo?._id || ''}
                    onChange={(e) => {
                      const telecallerId = e.target.value;
                      handleAssignEnquiry(selectedEnquiry._id, telecallerId);
                      const telecaller = telecallers.find(t => t._id === telecallerId);
                      setSelectedEnquiry({ ...selectedEnquiry, assignedTo: telecaller || null });
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
                  <label className="text-sm text-gray-500">Submitted</label>
                  <p className="text-gray-900">{new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex gap-3">
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    className="flex-1 py-2 px-4 bg-blue-800 text-white text-center font-medium rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                  >
                    Call Now
                  </a>
                  {selectedEnquiry.email && (
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
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

export default EnquiriesPage;