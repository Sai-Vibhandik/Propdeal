import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteContent } from '../../context/SiteContentContext.jsx';
import { FileText, Loader2, ArrowLeft } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const { content, loading } = useSiteContent();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-800" />
      </div>
    );
  }

  const privacyPolicy = content?.privacyPolicy || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-4 mb-4">
            <FileText className="w-10 h-10 text-amber-400" />
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {privacyPolicy ? (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: privacyPolicy.replace(/\n/g, '<br />') }}
            />
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">
                Privacy policy content is not available yet. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;