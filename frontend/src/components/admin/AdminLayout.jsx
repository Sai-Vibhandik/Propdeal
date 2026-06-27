import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCog,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Globe,
  MessageSquareText,
  Bell,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSiteContent } from '../../context/SiteContentContext.jsx';
import { getFileUrl } from '../../services/api.js';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { content } = useSiteContent();
  const location = useLocation();
  const navigate = useNavigate();

  // Get branding data
  const branding = content?.branding || {};
  const siteName = content?.seo?.siteName || 'PropertyHub';
  const logoUrl = branding.logo ? getFileUrl(branding.logo) : null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Render logo for sidebar
  const renderLogo = (showText = true) => {
    const logoHeight = branding.sidebarLogoHeight || 40;
    const displayName = branding.siteName || siteName || 'PropertyHub';
    const showName = branding.showSiteNameWithLogo !== false;

    if (logoUrl) {
      return (
        <>
          <img
            src={logoUrl}
            alt={branding.logoAlt || 'Logo'}
            style={{ maxHeight: logoHeight }}
            className="object-contain rounded-lg"
          />
          {showText && showName && (
            <span className="font-bold text-white ml-2">
              {displayName}
            </span>
          )}
        </>
      );
    }
    // Fallback to default logo icon + text
    const nameParts = siteName.split(' ');
    return (
      <>
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        {showText && (
          <div>
            <h1 className="font-bold text-white">{nameParts[0]}{nameParts[1] && <span className="text-amber-400">{nameParts[1]}</span>}</h1>
          </div>
        )}
      </>
    );
  };

  // Menu items with groups
  const getMenuGroups = () => {
    const adminGroups = [
      {
        label: 'Main',
        items: [
          { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        ],
      },
      {
        label: 'Management',
        items: [
          { path: '/admin/properties', label: 'Properties', icon: Building2 },
          { path: '/admin/telecallers', label: 'Telecallers', icon: UserCog },
          { path: '/admin/leads', label: 'Leads', icon: Users },
          { path: '/admin/enquiries', label: 'Enquiries', icon: MessageSquareText },
        ],
      },
      {
        label: 'Settings',
        items: [
          { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
          { path: '/admin/site-content', label: 'Site Content', icon: Globe },
          { path: '/admin/settings', label: 'Settings', icon: Settings },
        ],
      },
    ];

    const telecallerGroups = [
      {
        label: 'Main',
        items: [
          { path: '/telecaller', label: 'Dashboard', icon: LayoutDashboard },
        ],
      },
      {
        label: 'Work',
        items: [
          { path: '/telecaller/leads', label: 'My Leads', icon: Users },
          { path: '/telecaller/enquiries', label: 'My Enquiries', icon: MessageSquareText },
          { path: '/telecaller/properties', label: 'My Properties', icon: Building2 },
        ],
      },
    ];

    if (user?.role === 'telecaller') {
      return telecallerGroups;
    }
    return adminGroups;
  };

  const menuGroups = getMenuGroups();

  const isActive = (path) => {
    // Exact match for dashboard routes
    if (path === '/admin') return location.pathname === '/admin';
    if (path === '/telecaller') return location.pathname === '/telecaller';
    // For telecaller routes
    if (path === '/telecaller/leads') return location.pathname === '/telecaller/leads';
    if (path === '/telecaller/enquiries') return location.pathname === '/telecaller/enquiries';
    if (path === '/telecaller/properties') return location.pathname === '/telecaller/properties';
    // For other routes, check if pathname starts with the path
    return location.pathname.startsWith(path);
  };

  // Get initials from user name
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          {logoUrl ? (
            <>
              <img
                src={logoUrl}
                alt={branding.logoAlt || 'Logo'}
                style={{ maxHeight: 32 }}
                className="object-contain rounded-lg"
              />
              {branding.showSiteNameWithLogo !== false && (
                <span className="font-bold text-gray-900">
                  {branding.siteName || siteName.split(' ')[0]}
                </span>
              )}
            </>
          ) : (
            <span className="font-bold text-gray-900">{siteName.split(' ')[0]}{siteName.split(' ')[1] && <span className="text-amber-500">{siteName.split(' ')[1]}</span>} Admin</span>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-slate-900 to-slate-800 z-[60]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Logo */}
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  {renderLogo(true)}
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4 overflow-y-auto h-[calc(100%-140px)]">
                <div className="space-y-1">
                  {menuGroups.flatMap(group => group.items).map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          active
                            ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border-l-2 border-amber-500'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* User Card - Mobile */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(user?.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex fixed left-0 top-0 bottom-0 flex-col bg-gradient-to-b from-slate-900 to-slate-800 transition-all duration-300 z-30 shadow-2xl shadow-slate-900/50 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <>
                <img
                  src={logoUrl}
                  alt={branding.logoAlt || 'Logo'}
                  style={{ maxHeight: branding.sidebarLogoHeight || 40 }}
                  className="object-contain rounded-lg"
                />
                {sidebarOpen && branding.showSiteNameWithLogo !== false && (
                  <span className="font-bold text-white">
                    {branding.siteName || siteName.split(' ')[0]}
                  </span>
                )}
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                {sidebarOpen && (
                  <div>
                    <h1 className="font-bold text-white">{siteName.split(' ')[0]}{siteName.split(' ')[1] && <span className="text-amber-400">{siteName.split(' ')[1]}</span>}</h1>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto admin-sidebar-nav">
          <div className="space-y-1">
            {menuGroups.flatMap(group => group.items).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    active
                      ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border-l-2 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`} />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-white/10">
          {sidebarOpen && user && (
            <div className="mb-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-amber-500/20">
                  {getInitials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Toggle & Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex-1 flex items-center justify-center gap-2 p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm">Collapse</span>
                </>
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors ${
              sidebarOpen ? '' : 'justify-center'
            }`}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 pt-16 lg:pt-0 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;