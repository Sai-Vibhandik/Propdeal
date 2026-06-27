import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Save, Eye, EyeOff, Check } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { authAPI } from '../../services/api.js';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Account form state
  const [accountForm, setAccountForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Error states
  const [accountErrors, setAccountErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Password validation
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('At least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('At least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('At least one digit');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('At least one special character');
    }
    return errors;
  };

  const getPasswordRequirements = (password) => {
    return [
      { label: '8+ characters', valid: password.length >= 8 },
      { label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
      { label: 'Lowercase letter', valid: /[a-z]/.test(password) },
      { label: 'Number', valid: /[0-9]/.test(password) },
      { label: 'Special character', valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
    ];
  };

  const isNewPasswordValid = passwordForm.newPassword.length > 0 && validatePassword(passwordForm.newPassword).length === 0;

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getMe();
      const user = response.data.data;
      setAccountForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setAccountErrors({});

    // Validate
    const errors = {};
    if (!accountForm.name?.trim()) {
      errors.name = 'Name is required';
    }
    if (!accountForm.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (accountForm.phone && !/^[\d\s\-+()]{10,}$/.test(accountForm.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (Object.keys(errors).length > 0) {
      setAccountErrors(errors);
      return;
    }

    try {
      setSaving(true);
      await authAPI.updateProfile({
        name: accountForm.name,
        email: accountForm.email,
        phone: accountForm.phone,
      });
      toast.success('Profile updated successfully');
      setAccountErrors({});
    } catch (error) {
      console.error('Error updating profile:', error);
      let message = error.response?.data?.message || 'Failed to update profile';
      message = message.replace(/<[^>]*>/g, '');
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setPasswordErrors({});

    // Validate
    const errors = {};
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else {
      const passwordValidationErrors = validatePassword(passwordForm.newPassword);
      if (passwordValidationErrors.length > 0) {
        errors.newPassword = passwordValidationErrors.join(', ');
      }
    }
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      setSaving(true);
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
    } catch (error) {
      console.error('Error changing password:', error);
      let message = error.response?.data?.message || 'Failed to change password';
      message = message.replace(/<[^>]*>/g, '');
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account and preferences.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabs Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            {/* Mobile: Horizontal tabs */}
            <div className="lg:hidden bg-white rounded-xl shadow-sm overflow-x-auto">
              <div className="flex">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-800 border-b-2 border-blue-800'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Desktop: Vertical tabs */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-800'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
                </div>
              </div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                {activeTab === 'account' && (
                  <form onSubmit={handleAccountSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name<sup className="text-red-500">*</sup>
                          </label>
                          <input
                            type="text"
                            value={accountForm.name}
                            onChange={(e) => {
                              setAccountForm({ ...accountForm, name: e.target.value });
                              if (accountErrors.name) {
                                setAccountErrors({ ...accountErrors, name: '' });
                              }
                            }}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${accountErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter your name"
                            maxLength={100}
                          />
                          {accountErrors.name && (
                            <p className="text-sm text-red-500 mt-1">{accountErrors.name}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email ID<sup className="text-red-500">*</sup>
                          </label>
                          <input
                            type="email"
                            value={accountForm.email}
                            onChange={(e) => {
                              setAccountForm({ ...accountForm, email: e.target.value });
                              if (accountErrors.email) {
                                setAccountErrors({ ...accountErrors, email: '' });
                              }
                            }}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${accountErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter your email"
                            maxLength={100}
                          />
                          {accountErrors.email && (
                            <p className="text-sm text-red-500 mt-1">{accountErrors.email}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input
                            type="tel"
                            value={accountForm.phone || ''}
                            onChange={(e) => {
                              setAccountForm({ ...accountForm, phone: e.target.value });
                              if (accountErrors.phone) {
                                setAccountErrors({ ...accountErrors, phone: '' });
                              }
                            }}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${accountErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter phone number"
                            maxLength={20}
                          />
                          {accountErrors.phone && (
                            <p className="text-sm text-red-500 mt-1">{accountErrors.phone}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                            value="Administrator"
                            disabled
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'security' && (
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password<sup className="text-red-500">*</sup>
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.current ? 'text' : 'password'}
                              value={passwordForm.currentPassword}
                              onChange={(e) => {
                                setPasswordForm({ ...passwordForm, currentPassword: e.target.value });
                                if (passwordErrors.currentPassword) {
                                  setPasswordErrors({ ...passwordErrors, currentPassword: '' });
                                }
                              }}
                              className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="Enter current password"
                              maxLength={100}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {passwordErrors.currentPassword && (
                            <p className="text-sm text-red-500 mt-1">{passwordErrors.currentPassword}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password<sup className="text-red-500">*</sup>
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.new ? 'text' : 'password'}
                              value={passwordForm.newPassword}
                              onChange={(e) => {
                                setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                                if (passwordErrors.newPassword) {
                                  setPasswordErrors({ ...passwordErrors, newPassword: '' });
                                }
                              }}
                              className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="Enter new password"
                              maxLength={100}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {passwordErrors.newPassword && (
                            <p className="text-sm text-red-500 mt-1">{passwordErrors.newPassword}</p>
                          )}

                          {/* Password Requirements */}
                          {passwordForm.newPassword && (
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-gray-500 font-medium">Password must contain:</p>
                              <div className="flex flex-wrap gap-1.5">
                                {getPasswordRequirements(passwordForm.newPassword).map((req, idx) => (
                                  <span
                                    key={idx}
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      req.valid
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}
                                  >
                                    {req.valid ? '✓' : '○'} {req.label}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password<sup className="text-red-500">*</sup>
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.confirm ? 'text' : 'password'}
                              value={passwordForm.confirmPassword}
                              onChange={(e) => {
                                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
                                if (passwordErrors.confirmPassword) {
                                  setPasswordErrors({ ...passwordErrors, confirmPassword: '' });
                                }
                              }}
                              className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="Confirm new password"
                              maxLength={100}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {passwordErrors.confirmPassword && (
                            <p className="text-sm text-red-500 mt-1">{passwordErrors.confirmPassword}</p>
                          )}
                          {passwordForm.confirmPassword && passwordForm.newPassword && !passwordErrors.confirmPassword && (
                            <p className={`text-xs mt-1 ${passwordForm.newPassword === passwordForm.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                              {passwordForm.newPassword === passwordForm.confirmPassword ? (
                                <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Passwords match</span>
                              ) : (
                                'Passwords do not match'
                              )}
                            </p>
                          )}
                        </div>
                        <button
                          type="submit"
                          disabled={saving || !isNewPasswordValid || passwordForm.newPassword !== passwordForm.confirmPassword}
                          className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {saving ? (
                            <span className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Updating...
                            </span>
                          ) : (
                            'Update Password'
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;