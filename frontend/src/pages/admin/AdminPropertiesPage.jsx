import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2, Star, StarOff } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import Button from '../../components/common/Button.jsx';
import { PROPERTY_TYPES, PROPERTY_CATEGORIES, PROPERTY_STATUSES } from '../../utils/constants.js';
import { formatPriceRange, formatDate } from '../../utils/formatters.js';

// Placeholder data - will be replaced with API
const placeholderProperties = [
  {
    _id: '1',
    name: 'Prestige Lakeside Habitat',
    slug: 'prestige-lakeside',
    builder: 'Prestige Group',
    propertyType: 'apartment',
    category: 'ready-to-move',
    address: { city: 'Bangalore', locality: 'Whitefield' },
    priceRange: { min: 8500000, max: 15000000 },
    priceUnit: 'lac',
    status: 'published',
    featured: true,
    createdAt: '2024-01-10',
  },
  {
    _id: '2',
    name: 'DLF The Camellias',
    slug: 'dlf-camellias',
    builder: 'DLF Group',
    propertyType: 'apartment',
    category: 'ready-to-move',
    address: { city: 'Gurgaon', locality: 'Sector 42' },
    priceRange: { min: 5, max: 12 },
    priceUnit: 'cr',
    status: 'published',
    featured: true,
    createdAt: '2024-01-08',
  },
  {
    _id: '3',
    name: 'Godrej Eden Estate',
    slug: 'godrej-eden',
    builder: 'Godrej Properties',
    propertyType: 'villa',
    category: 'new-launch',
    address: { city: 'Bangalore', locality: 'Kanakapura Road' },
    priceRange: { min: 2, max: 5 },
    priceUnit: 'cr',
    status: 'draft',
    featured: false,
    createdAt: '2024-01-12',
  },
  {
    _id: '4',
    name: 'Sobha Dream Acres',
    slug: 'sobha-dream-acres',
    builder: 'Sobha Limited',
    propertyType: 'apartment',
    category: 'under-construction',
    address: { city: 'Bangalore', locality: 'Panathur' },
    priceRange: { min: 6500000, max: 12000000 },
    priceUnit: 'lac',
    status: 'published',
    featured: false,
    createdAt: '2024-01-05',
  },
];

const AdminPropertiesPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedProperties, setSelectedProperties] = useState([]);

  const filteredProperties = placeholderProperties.filter((property) => {
    const matchesSearch = property.name.toLowerCase().includes(search.toLowerCase()) ||
      property.builder.toLowerCase().includes(search.toLowerCase()) ||
      property.address.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || property.status === statusFilter;
    const matchesType = !typeFilter || property.propertyType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleSelect = (id) => {
    setSelectedProperties((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProperties.length === filteredProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(filteredProperties.map((p) => p._id));
    }
  };

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
            <Button className="flex items-center gap-2">
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
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </th>
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
                {filteredProperties.map((property) => (
                  <motion.tr
                    key={property._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProperties.includes(property._id)}
                        onChange={() => toggleSelect(property._id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
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
                      {property.address.locality}, {property.address.city}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatPriceRange(property.priceRange.min, property.priceRange.max, property.priceUnit)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        PROPERTY_STATUSES.find((s) => s.value === property.status)?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {PROPERTY_STATUSES.find((s) => s.value === property.status)?.label || property.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {property.featured ? (
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      ) : (
                        <StarOff className="w-5 h-5 text-gray-300" />
                      )}
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
                          className="p-2 text-gray-400 hover:text-blue-800 hover:bg-gray-100 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <Link
                          to={`/admin/properties/${property._id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-800 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg"
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
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {filteredProperties.length} of {placeholderProperties.length} properties
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1.5 bg-blue-800 text-white rounded-lg text-sm">
                1
              </button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPropertiesPage;