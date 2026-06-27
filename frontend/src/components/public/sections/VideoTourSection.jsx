import { motion } from 'framer-motion';
import { Play, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { getThemeStyles, getCardClasses, getCardBorderClasses, getSectionBgClasses } from '../../../utils/theme.js';
import { getFileUrl } from '../../../services/api.js';
import { useLead } from '../../../context/LeadContext.jsx';

// Extract video thumbnail URL from YouTube/Vimeo
const getVideoThumbnail = (url) => {
  if (!url) return null;

  // YouTube URL patterns
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
  }

  // Vimeo URL patterns - return null, will use fallback
  // Vimeo requires API call for thumbnail, so we'll use fallback
  if (url.includes('vimeo.com')) {
    return null;
  }

  return null;
};

const VideoTourSection = ({ property, layout = 'full-width', theme = {}, bgVariant = 'white' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoUrl = property.videoTour;
  const { colors, isDark } = getThemeStyles(theme);
  const { openModal } = useLead();

  // Get section and card classes for proper contrast
  const sectionBgClass = getSectionBgClasses(bgVariant, isDark);
  const cardBgClass = getCardClasses(bgVariant, isDark);
  const cardBorderClass = getCardBorderClasses(bgVariant, isDark);

  if (!videoUrl) return null;

  // Check if video is uploaded (local or Cloudinary) or embedded (YouTube/Vimeo)
  const isUploadedVideo = videoUrl.includes('cloudinary.com') || videoUrl.includes('/uploads/videos/') || videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm');

  // Get video thumbnail - use YouTube thumbnail if available, otherwise fall back to hero/gallery image
  const videoThumbnail = getVideoThumbnail(videoUrl);
  const fallbackImage = property.heroImages?.[0]?.url || property.gallery?.[0]?.url;
  const thumbnailSrc = videoThumbnail || (fallbackImage ? getFileUrl(fallbackImage) : null);

  // Render uploaded video player
  const renderUploadedVideo = (height = '400px') => (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsPlaying(false)}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center cursor-pointer"
      >
        <X className="w-5 h-5 text-white" />
      </motion.button>
      <video
        src={videoUrl}
        className="w-full rounded-2xl"
        style={{ height }}
        controls
        autoPlay
        playsInline
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );

  // Render embedded video (YouTube/Vimeo)
  const renderEmbeddedVideo = (height = '400px') => (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsPlaying(false)}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center cursor-pointer"
      >
        <X className="w-5 h-5 text-white" />
      </motion.button>
      <iframe
        src={videoUrl}
        title="Property Video Tour"
        className="w-full rounded-2xl"
        style={{ height }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );

  // Render video player based on type
  const renderVideoPlayer = (height = '400px') => {
    if (isUploadedVideo) {
      return renderUploadedVideo(height);
    }
    return renderEmbeddedVideo(height);
  };

  return (
    <section className={`py-10 md:py-12 ${sectionBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: colors.secondary }}>Video Tour</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">Take a Virtual Tour</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">Experience the property from the comfort of your home with our detailed video walkthrough</p>
        </motion.div>

        {layout === 'full-width' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative rounded-2xl overflow-hidden">
            {!isPlaying ? (
              <div onClick={() => setIsPlaying(true)} className="relative cursor-pointer group">
                {thumbnailSrc ? (
                  <img src={thumbnailSrc} alt="Video Thumbnail" className="w-full h-[400px] md:h-[500px] object-cover" />
                ) : (
                  <div className="w-full h-[400px] md:h-[500px] bg-gray-800 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform" style={{ backgroundColor: colors.secondary }}>
                    <Play className="w-10 h-10 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">Watch Full Tour</div>
              </div>
            ) : (
              renderVideoPlayer('500px')
            )}
          </motion.div>
        )}

        {layout === 'compact' && (
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative rounded-2xl overflow-hidden">
              {!isPlaying ? (
                <div onClick={() => setIsPlaying(true)} className="relative cursor-pointer group">
                  {thumbnailSrc ? (
                    <img src={thumbnailSrc} alt="Video Thumbnail" className="w-full h-[300px] object-cover" />
                  ) : (
                    <div className="w-full h-[300px] bg-gray-800 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform" style={{ backgroundColor: colors.secondary }}>
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>
              ) : (
                renderVideoPlayer('300px')
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Watch the Video Tour?</h3>
              <ul className="space-y-3">
                {['Get a complete view of the property layout', 'See the actual condition of amenities', 'Understand the neighbourhood and surroundings', 'Experience the property at your convenience', 'Make informed decisions before site visit'].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${colors.accent}20` }}>
                      <Play className="w-3 h-3" style={{ color: colors.accent }} />
                    </div>
                    <span className="text-gray-600 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">Ready to see it in real life?</p>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openModal(property, 'cta-video-visit')}
            className="cta-bounce-shine inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
            style={{ backgroundColor: colors.primary }}
          >
            Explore In Person
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoTourSection;