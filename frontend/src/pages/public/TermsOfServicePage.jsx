import { useEffect } from 'react';
import { useSiteContent } from '../../context/SiteContentContext.jsx';
import { FileCheck, Loader2 } from 'lucide-react';

const TermsOfServicePage = () => {
  const { content, loading } = useSiteContent();

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

  const termsOfService = content?.termsOfService || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <FileCheck className="w-10 h-10 text-amber-400" />
            <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Please read these terms carefully before using our services.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {termsOfService ? (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: termsOfService.replace(/\n/g, '<br />') }}
            />
          ) : (
            <div className="text-center py-12">
              <FileCheck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">
                Terms of service content is not available yet. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;