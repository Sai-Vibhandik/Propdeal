import { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, Eye, EyeOff, Phone, Mail, Search, X } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout.jsx';

const TelecallersPage = () => {
  const [telecallers, setTelecallers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTelecaller, setEditingTelecaller] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTelecallers();
  }, []);

  const fetchTelecallers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getTelecallers();
      setTelecallers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching telecallers:', error);
      toast.error('Failed to load telecallers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Client-side validation
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Contact Number is required';
    } else {
      // Remove all non-digit characters to count digits
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        newErrors.phone = 'Contact Number must have at least 10 digits';
      } else if (digitsOnly.length > 15) {
        newErrors.phone = 'Contact Number cannot have more than 15 digits';
      } else if (!/^[0-9+\-\s]+$/.test(formData.phone)) {
        newErrors.phone = 'Contact Number must contain only digits, +, - or spaces';
      }
    }

    if (!editingTelecaller && !formData.password) {
      newErrors.password = 'Password is required';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (editingTelecaller) {
        // When editing, only send password if it's provided
        const dataToSend = { ...formData };
        if (!dataToSend.password || dataToSend.password.trim() === '') {
          delete dataToSend.password;
        }
        await adminAPI.updateTelecaller(editingTelecaller._id, dataToSend);
        toast.success('Telecaller updated successfully');
      } else {
        await adminAPI.createTelecaller(formData);
        toast.success('Telecaller created successfully');
      }
      setShowModal(false);
      setEditingTelecaller(null);
      setFormData({ name: '', email: '', phone: '', password: '' });
      setErrors({});
      fetchTelecallers();
    } catch (error) {
      console.error('Error saving telecaller:', error);
      const message = error.response?.data?.message || 'Failed to save telecaller';
      toast.error(message);
    }
  };

  const handleEdit = (telecaller) => {
    setEditingTelecaller(telecaller);
    setFormData({
      name: telecaller.name,
      email: telecaller.email,
      phone: telecaller.phone || '',
      password: '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this telecaller?')) return;

    try {
      await adminAPI.deleteTelecaller(id);
      toast.success('Telecaller deleted successfully');
      fetchTelecallers();
    } catch (error) {
      console.error('Error deleting telecaller:', error);
      toast.error('Failed to delete telecaller');
    }
  };

  const handleToggleActive = async (telecaller) => {
    try {
      await adminAPI.updateTelecaller(telecaller._id, { isActive: !telecaller.isActive });
      toast.success(`Telecaller ${telecaller.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchTelecallers();
    } catch (error) {
      console.error('Error updating telecaller:', error);
      toast.error('Failed to update telecaller');
    }
  };

  const filteredTelecallers = telecallers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.phone && t.phone.includes(searchTerm))
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Telecallers</h1>
            <p className="text-gray-600 mt-1">Manage telecaller accounts for lead distribution</p>
          </div>
          <button
            onClick={() => {
              setEditingTelecaller(null);
              setFormData({ name: '', email: '', phone: '', password: '' });
              setErrors({});
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <UserPlus className="w-5 h-5" />
            Add Telecaller
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search telecallers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Telecallers List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
          </div>
        ) : filteredTelecallers.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-500">
            {searchTerm ? 'No telecallers found matching your search' : 'No telecallers added yet'}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTelecallers.map((telecaller) => (
                  <tr key={telecaller._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-800 font-medium text-sm">
                            {telecaller.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="ml-2 sm:ml-3 font-medium text-gray-900 truncate">{telecaller.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate max-w-[150px] sm:max-w-none">{telecaller.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{telecaller.phone || '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleActive(telecaller)}
                        className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                          telecaller.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {telecaller.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(telecaller.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => handleEdit(telecaller)}
                          className="p-2 text-gray-500 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(telecaller._id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingTelecaller ? 'Edit Telecaller' : 'Add New Telecaller'}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTelecaller(null);
                    setErrors({});
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name<sup className="text-red-500">*</sup>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Enter full name"
                    maxLength={100}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email<sup className="text-red-500">*</sup>
                  </label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Enter email address"
                    maxLength={100}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number<sup className="text-red-500">*</sup>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Enter contact number"
                    maxLength={20}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {editingTelecaller ? 'New Password (leave empty to keep current)' : 'Password'}
                    {!editingTelecaller && <sup className="text-red-500">*</sup>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (errors.password) setErrors({ ...errors, password: '' });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder={editingTelecaller ? 'Enter new password' : 'Enter password'}
                      maxLength={100}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingTelecaller(null);
                      setErrors({});
                    }}
                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    {editingTelecaller ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TelecallersPage;