import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Eye, Edit, Trash2, Star, StarOff, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import Button from '../../components/common/Button.jsx';
import { PROPERTY_TYPES, PROPERTY_CATEGORIES, PROPERTY_STATUSES } from '../../utils/constants.js';
import { formatPriceRange, formatDate } from '../../utils/formatters.js';
import { useAdminProperties } from '../../hooks/useProperty.js';
import { propertiesAPI } from '../../services/api.js';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;

const AdminPropertiesPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { properties, loading, error, refetch } = useAdminProperties({
    status: statusFilter,
    propertyType: typeFilter,
  });

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = !search ||
      property.name?.toLowerCase().includes(search.toLowerCase()) ||
      property.builder?.toLowerCase().includes(search.toLowerCase()) ||
      property.address?.city?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || property.status === statusFilter;
    const matchesType = !typeFilter || property.propertyType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Calculate Sr. No. based on current page
  const getSerialNumber = (index) => {
    return (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
  };

  // Reset to page 1 when filters change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      await propertiesAPI.delete(id);
      toast.success('Property deleted successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete property');
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await propertiesAPI.toggleFeatured(id);
      toast.success(currentFeatured ? 'Property unfeatured' : 'Property featured');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update property');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await propertiesAPI.updateStatus(id, newStatus);
      toast.success('Status updated successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-800" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-500 mt-1">Manage your property listings</p>
          </div>
          <Link to="/admin/properties/new">
            <Button className="flex items-center gap-2 cursor-pointer">
              <Plus className="w-5 h-5" />
              Add Property
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, builder, or city..."
                value={search}
                onChange={handleSearchChange}
                maxLength={100}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Status</option>
              {PROPERTY_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={handleTypeFilterChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No properties found</p>
              <Link to="/admin/properties/new">
                <Button>Create Your First Property</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">Sr. No.</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Property</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Location</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Featured</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Created</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedProperties.map((property, index) => (
                      <motion.tr
                        key={property._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-gray-600 font-medium">
                          {getSerialNumber(index)}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">{property.name}</p>
                            <p className="text-sm text-gray-500">{property.builder}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {property.propertyType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {property.address?.locality}, {property.address?.city}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {property.priceRange?.min && property.priceRange?.max
                            ? formatPriceRange(property.priceRange.min, property.priceRange.max, property.priceRange?.minUnit, property.priceRange?.maxUnit)
                            : 'N/A'
                          }
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={property.status}
                            onChange={(e) => handleStatusChange(property._id, e.target.value)}
                            className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                              property.status === 'published' ? 'bg-green-100 text-green-800' :
                              property.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {PROPERTY_STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleFeatured(property._id, property.featured)}
                            className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                          >
                            {property.featured ? (
                              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                            ) : (
                              <StarOff className="w-5 h-5 text-gray-300" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm">
                          {formatDate(property.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <a
                              href={`/property/${property.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-400 hover:text-blue-800 hover:bg-gray-100 rounded-lg cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <Link
                              to={`/admin/properties/${property._id}/edit`}
                              className="p-2 text-gray-400 hover:text-blue-800 hover:bg-gray-100 rounded-lg cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(property._id)}
                              className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProperties.length)} of {filteredProperties.length} properties
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium cursor-pointer ${
                              currentPage === pageNum
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
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Footer - show when only 1 page */}
              {totalPages === 1 && (
                <div className="px-4 py-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Showing {filteredProperties.length} of {properties.length} properties
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPropertiesPage;