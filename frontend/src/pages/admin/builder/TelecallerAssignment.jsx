import { useState, useEffect } from 'react';
import { UserCog, Users, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI, propertiesAPI } from '../../../services/api.js';

const TelecallerAssignment = ({ propertyId }) => {
  const [telecallers, setTelecallers] = useState([]);
  const [assignedTelecallers, setAssignedTelecallers] = useState([]);
  const [distributeLeads, setDistributeLeads] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTelecallers();
    if (propertyId) {
      fetchPropertyTelecallers();
    } else {
      setLoading(false);
    }
  }, [propertyId]);

  const fetchTelecallers = async () => {
    try {
      const response = await adminAPI.getTelecallers();
      const activeTelecallers = (response.data.data || []).filter(t => t.isActive !== false);
      setTelecallers(activeTelecallers);
    } catch (error) {
      console.error('Error fetching telecallers:', error);
    }
  };

  const fetchPropertyTelecallers = async () => {
    try {
      const response = await propertiesAPI.getAdminOne(propertyId);
      const property = response.data.data?.property || response.data.data;
      if (property) {
        setAssignedTelecallers(property.assignedTelecallers?.map(t => t._id || t) || []);
        setDistributeLeads(property.distributeLeads || false);
      }
    } catch (error) {
      console.error('Error fetching property telecallers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTelecaller = async (telecallerId) => {
    if (!propertyId) {
      toast.error('Please save the property first before assigning sales partners');
      return;
    }

    setSaving(true);
    try {
      let newAssigned;
      if (assignedTelecallers.includes(telecallerId)) {
        newAssigned = assignedTelecallers.filter(id => id !== telecallerId);
      } else {
        newAssigned = [...assignedTelecallers, telecallerId];
      }

      await propertiesAPI.assignTelecallers(propertyId, newAssigned, distributeLeads);
      setAssignedTelecallers(newAssigned);
      toast.success('Sales partner assignment updated');
    } catch (error) {
      console.error('Error assigning telecaller:', error);
      toast.error('Failed to update assignment');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDistribute = async () => {
    if (!propertyId) {
      toast.error('Please save the property first');
      return;
    }

    if (assignedTelecallers.length === 0) {
      toast.error('Please assign at least one sales partner first');
      return;
    }

    setSaving(true);
    try {
      const newValue = !distributeLeads;
      await propertiesAPI.toggleDistributeLeads(propertyId, newValue);
      setDistributeLeads(newValue);
      toast.success(`Lead distribution ${newValue ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling distribute leads:', error);
      toast.error('Failed to update lead distribution');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-800" />
      </div>
    );
  }

  if (!propertyId) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-amber-700">
          <UserCog className="w-5 h-5" />
          <p className="text-sm">Save the property as draft first to assign sales partners</p>
        </div>
      </div>
    );
  }

  if (telecallers.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-5 h-5" />
          <p className="text-sm">
            No sales partners available.{' '}
            <a href="/admin/telecallers" className="text-blue-800 hover:underline">
              Add sales partners
            </a>{' '}
            first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Distribute Leads Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          {distributeLeads ? (
            <ToggleRight className="w-6 h-6 text-emerald-600" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-gray-400" />
          )}
          <div>
            <p className="font-medium text-gray-900">Distribute Leads</p>
            <p className="text-sm text-gray-500">
              {distributeLeads
                ? 'Leads will be distributed in round-robin order'
                : 'All leads will go to admin'}
            </p>
          </div>
        </div>
        <button
          onClick={handleToggleDistribute}
          disabled={saving || assignedTelecallers.length === 0}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            distributeLeads ? 'bg-emerald-600' : 'bg-gray-300'
          } ${assignedTelecallers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              distributeLeads ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {assignedTelecallers.length === 0 && (
        <div className="text-sm text-amber-600 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Assign at least one sales partner to enable lead distribution
        </div>
      )}

      {/* Telecaller List */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Assigned Sales Partners</h4>
        <p className="text-sm text-gray-500">
          Select sales partners to receive leads from this property. Leads will be distributed in round-robin order when enabled.
        </p>

        <div className="grid gap-3">
          {telecallers.map((telecaller) => {
            const isAssigned = assignedTelecallers.includes(telecaller._id);
            return (
              <button
                key={telecaller._id}
                onClick={() => handleAssignTelecaller(telecaller._id)}
                disabled={saving}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border transition-all text-left gap-3 ${
                  isAssigned
                    ? 'border-blue-800 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isAssigned ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {telecaller.name?.charAt(0)?.toUpperCase() || 'T'}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-medium truncate ${isAssigned ? 'text-blue-900' : 'text-gray-900'}`}>
                      {telecaller.name}
                    </p>
                    <p className={`text-sm truncate ${isAssigned ? 'text-blue-700' : 'text-gray-500'}`}>
                      {telecaller.email}
                    </p>
                    {telecaller.phone && (
                      <p className={`text-xs ${isAssigned ? 'text-blue-600' : 'text-gray-400'}`}>
                        {telecaller.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div
                  className={`self-start sm:self-auto px-3 py-1.5 rounded-full text-xs font-medium ${
                    isAssigned
                      ? 'bg-blue-800 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isAssigned ? 'Assigned' : 'Click to assign'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Round Robin Info */}
      {assignedTelecallers.length > 0 && distributeLeads && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm text-emerald-700">
            <strong>Active:</strong> Leads will be distributed to {assignedTelecallers.length} sales partner
            {assignedTelecallers.length > 1 ? 's' : ''} in round-robin order.
          </p>
        </div>
      )}

      {assignedTelecallers.length > 0 && !distributeLeads && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-700">
            <strong>Disabled:</strong> Enable lead distribution to assign leads to sales partners.
          </p>
        </div>
      )}
    </div>
  );
};

export default TelecallerAssignment;