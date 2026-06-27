import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { FilterProvider } from './context/FilterContext.jsx';
import { LeadProvider } from './context/LeadContext.jsx';
import { EnquiryProvider } from './context/EnquiryContext.jsx';
import { SiteContentProvider } from './context/SiteContentContext.jsx';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import LeadModal from './components/public/LeadModal.jsx';
import EnquiryModal from './components/public/EnquiryModal.jsx';

// Public Pages
import HomePage from './pages/public/HomePage.jsx';
import PropertiesPage from './pages/public/PropertiesPage.jsx';
import PropertyLandingPage from './pages/public/PropertyLandingPage.jsx';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage.jsx';
import TermsOfServicePage from './pages/public/TermsOfServicePage.jsx';
import DevelopersPage from './pages/public/DevelopersPage.jsx';

// Admin Pages
import LoginPage from './pages/admin/LoginPage.jsx';
import DashboardPage from './pages/admin/DashboardPage.jsx';
import AdminPropertiesPage from './pages/admin/AdminPropertiesPage.jsx';
import PropertyBuilderPage from './pages/admin/PropertyBuilderPage.jsx';
import TelecallersPage from './pages/admin/TelecallersPage.jsx';
import LeadsPage from './pages/admin/LeadsPage.jsx';
import EnquiriesPage from './pages/admin/EnquiriesPage.jsx';
import AnalyticsPage from './pages/admin/AnalyticsPage.jsx';
import SettingsPage from './pages/admin/SettingsPage.jsx';
import SiteContentPage from './pages/admin/SiteContentPage.jsx';

// Reset Password Page
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';

// Telecaller Pages
import TelecallerDashboard from './pages/telecaller/TelecallerDashboard.jsx';

// Placeholder pages
const AboutPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">About Page</h1>
      <p className="text-gray-600">Coming soon...</p>
    </div>
  </div>
);

const ContactPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Page</h1>
      <p className="text-gray-600">Coming soon...</p>
    </div>
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-6">Page not found</p>
      <a href="/" className="text-blue-800 hover:underline">Go back home</a>
    </div>
  </div>
);

// Protected Route for Admin
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Layout for public pages
const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FilterProvider>
          <LeadProvider>
            <EnquiryProvider>
              <SiteContentProvider>
              <Router>
              <ScrollToTop />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                  success: {
                    style: {
                      background: '#059669',
                    },
                  },
                  error: {
                    style: {
                      background: '#dc2626',
                    },
                  },
                }}
              />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<><Navbar /><DevelopersPage /></>} />
                <Route path="/discover" element={<PublicLayout><HomePage /></PublicLayout>} />
                <Route path="/properties" element={<PublicLayout><PropertiesPage /></PublicLayout>} />
                <Route path="/property/:slug" element={<PropertyLandingPage />} />
                <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
                <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
                <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicyPage /></PublicLayout>} />
                <Route path="/terms-of-service" element={<PublicLayout><TermsOfServicePage /></PublicLayout>} />

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/properties"
                  element={
                    <ProtectedRoute>
                      <AdminPropertiesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/properties/new"
                  element={
                    <ProtectedRoute>
                      <PropertyBuilderPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/properties/:id/edit"
                  element={
                    <ProtectedRoute>
                      <PropertyBuilderPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/telecallers"
                  element={
                    <ProtectedRoute>
                      <TelecallersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/leads"
                  element={
                    <ProtectedRoute>
                      <LeadsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/enquiries"
                  element={
                    <ProtectedRoute>
                      <EnquiriesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/site-content"
                  element={
                    <ProtectedRoute>
                      <SiteContentPage />
                    </ProtectedRoute>
                  }
                />

                {/* Telecaller Routes */}
                <Route
                  path="/telecaller"
                  element={
                    <ProtectedRoute>
                      <TelecallerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/telecaller/leads"
                  element={
                    <ProtectedRoute>
                      <TelecallerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/telecaller/properties"
                  element={
                    <ProtectedRoute>
                      <TelecallerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/telecaller/enquiries"
                  element={
                    <ProtectedRoute>
                      <TelecallerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Catch-all */}
                <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
              </Routes>
              <LeadModal />
              <EnquiryModal />
            </Router>
            </SiteContentProvider>
            </EnquiryProvider>
          </LeadProvider>
        </FilterProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;