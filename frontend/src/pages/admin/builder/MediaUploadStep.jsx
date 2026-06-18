import { useState } from 'react';
import { Upload, X, Image, Video, Plus, AlertCircle, Grid3X3, FileDown, FileText, Map, Layers, Ruler } from 'lucide-react';
import { mediaAPI, getFileUrl } from '../../../services/api.js';

// Plan types based on property category
const planTypesByCategory = {
  residential: [
    { key: 'masterPlan', label: 'Master Plan', description: 'Overall project layout showing buildings, amenities, roads', icon: Map, multiple: false },
    { key: 'floorPlans', label: 'Floor Plans', description: 'Floor-wise layouts (for apartments)', icon: Layers, multiple: true },
  ],
  land: [
    { key: 'masterPlan', label: 'Master Plan', description: 'Overall layout with plot divisions', icon: Map, multiple: false },
    { key: 'dimensionPlans', label: 'Dimension Plans', description: 'Individual plot dimensions', icon: Ruler, multiple: true },
  ],
  commercial: [
    { key: 'masterPlan', label: 'Master Plan', description: 'Commercial complex layout', icon: Map, multiple: false },
    { key: 'floorPlans', label: 'Floor Plans', description: 'Floor-wise layouts', icon: Layers, multiple: true },
  ],
  industrial: [
    { key: 'masterPlan', label: 'Master Plan', description: 'Industrial layout', icon: Map, multiple: false },
  ],
};

// Property type to category mapping
const propertyCategoryMap = {
  apartment: 'residential', studio: 'residential', duplex: 'residential', penthouse: 'residential',
  villa: 'residential', 'row-house': 'residential', 'builder-floor': 'residential', bungalow: 'residential', 'farm-house': 'residential',
  'residential-plot': 'land', 'commercial-plot': 'land', 'agricultural-land': 'land',
  shop: 'commercial', office: 'commercial', showroom: 'commercial', warehouse: 'commercial',
  'industrial-shed': 'industrial', factory: 'industrial',
};

const MediaUploadStep = ({ propertyData, updatePropertyData }) => {
  const [uploading, setUploading] = useState({ hero: false, gallery: false, video: false, amenities: false, brochure: false, masterPlan: false, floorPlans: false, dimensionPlans: false });
  const [error, setError] = useState(null);
  const [videoInputType, setVideoInputType] = useState('url'); // 'url' or 'upload'

  // Upload file to Cloudinary via backend API
  const uploadFile = async (file, type = 'image') => {
    try {
      let response;
      if (type === 'image') {
        response = await mediaAPI.uploadImage(file);
      } else if (type === 'video') {
        response = await mediaAPI.uploadVideo(file);
      } else {
        response = await mediaAPI.uploadDocument(file);
      }

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Upload failed');
    } catch (err) {
      console.error('Upload error:', err);
      throw err;
    }
  };

  const handleHeroUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check max limit
    const currentImages = propertyData.heroImages || [];
    const remainingSlots = 4 - currentImages.length;
    if (remainingSlots <= 0) {
      setError('Maximum 4 hero images allowed. Please remove some images first.');
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    setUploading((prev) => ({ ...prev, hero: true }));
    setError(null);

    try {
      const uploadPromises = filesToUpload.map((file) => uploadFile(file, 'image'));
      const results = await Promise.all(uploadPromises);
      const newImages = [
        ...currentImages,
        ...results.map((r) => ({ url: r.url, publicId: r.publicId, title: '' })),
      ];
      updatePropertyData('heroImages', newImages);
    } catch (err) {
      setError('Failed to upload hero images. Please try again.');
    } finally {
      setUploading((prev) => ({ ...prev, hero: false }));
    }
  };

  const removeHeroImage = (index) => {
    const newImages = [...(propertyData.heroImages || [])];
    newImages.splice(index, 1);
    updatePropertyData('heroImages', newImages);
  };

  const updateHeroImageTitle = (index, title) => {
    const newImages = [...(propertyData.heroImages || [])];
    newImages[index].title = title;
    updatePropertyData('heroImages', newImages);
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading((prev) => ({ ...prev, gallery: true }));
    setError(null);

    try {
      const uploadPromises = files.map((file) => uploadFile(file, 'image'));
      const results = await Promise.all(uploadPromises);
      const currentGallery = propertyData.gallery || [];
      const newGallery = [
        ...currentGallery,
        ...results.map((r) => ({ url: r.url, publicId: r.publicId, type: 'image' })),
      ];
      updatePropertyData('gallery', newGallery);
    } catch (err) {
      setError('Failed to upload gallery images. Please try again.');
    } finally {
      setUploading((prev) => ({ ...prev, gallery: false }));
    }
  };

  const removeGalleryImage = (index) => {
    const newGallery = [...(propertyData.gallery || [])];
    newGallery.splice(index, 1);
    updatePropertyData('gallery', newGallery);
  };

  // Amenities - Manual entry with images
  const handleAmenityImageUpload = async (index, file) => {
    if (!file) return;

    setUploading((prev) => ({ ...prev, amenities: true }));
    setError(null);

    try {
      const result = await uploadFile(file, 'image');
      const newAmenities = [...(propertyData.amenities || [])];
      newAmenities[index] = {
        ...newAmenities[index],
        image: result.url,
        publicId: result.publicId,
      };
      updatePropertyData('amenities', newAmenities);
    } catch (err) {
      setError('Failed to upload amenity image. Please try again.');
    } finally {
      setUploading((prev) => ({ ...prev, amenities: false }));
    }
  };

  const addAmenity = () => {
    const newAmenities = [...(propertyData.amenities || []), { name: '', image: '', publicId: '' }];
    updatePropertyData('amenities', newAmenities);
  };

  const updateAmenity = (index, field, value) => {
    const newAmenities = [...(propertyData.amenities || [])];
    newAmenities[index] = { ...newAmenities[index], [field]: value };
    updatePropertyData('amenities', newAmenities);
  };

  const removeAmenity = (index) => {
    const newAmenities = [...(propertyData.amenities || [])];
    newAmenities.splice(index, 1);
    updatePropertyData('amenities', newAmenities);
  };

  // Handle video upload
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid video file (MP4, WebM, OGG, MOV)');
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('Video file size must be less than 100MB');
      return;
    }

    setUploading((prev) => ({ ...prev, video: true }));
    setError(null);

    try {
      const result = await uploadFile(file, 'video');
      updatePropertyData('videoTour', result.url);
    } catch (err) {
      setError('Failed to upload video. Please try again.');
    } finally {
      setUploading((prev) => ({ ...prev, video: false }));
    }
  };

  const removeVideo = () => {
    updatePropertyData('videoTour', '');
  };

  // Handle brochure upload
  const handleBrochureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF file');
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError('File size must be less than 20MB');
      return;
    }

    setUploading((prev) => ({ ...prev, brochure: true }));
    setError(null);

    try {
      const result = await uploadFile(file, 'document');
      updatePropertyData('brochure', {
        url: result.url,
        publicId: result.publicId,
        name: file.name,
      });
    } catch (err) {
      setError('Failed to upload brochure. Please try again.');
    } finally {
      setUploading((prev) => ({ ...prev, brochure: false }));
    }
  };

  const removeBrochure = () => {
    updatePropertyData('brochure', { url: '', publicId: '', name: '' });
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Media Upload</h2>
        <p className="text-gray-600 mt-1">Upload images, videos, and floor plans</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Images */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Image className="w-5 h-5" />
          Hero Images
          <span className="text-sm font-normal text-gray-500">(Main banner images - Max 4)</span>
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          These images will be displayed in the hero carousel on the property page. Recommended: 1920x1080px
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {propertyData.heroImages?.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={getFileUrl(image.url)}
                alt={`Hero ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
              <button
                onClick={() => removeHeroImage(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 bg-blue-800 text-white text-xs px-2 py-0.5 rounded">
                  Primary
                </span>
              )}
            </div>
          ))}

          {uploading.hero ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
              <p className="mt-2 text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            (propertyData.heroImages?.length || 0) < 4 && (
              <label className="block border-2 border-dashed border-gray-300 rounded-lg h-40 cursor-pointer hover:border-blue-500 transition-colors">
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleHeroUpload} />
                <div className="h-full flex flex-col items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-500 mt-1">Add Image</p>
                  <p className="text-xs text-gray-400">{4 - (propertyData.heroImages?.length || 0)} slots left</p>
                </div>
              </label>
            )
          )}
        </div>

        {(propertyData.heroImages?.length || 0) === 0 && (
          <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors mt-4">
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleHeroUpload} disabled={uploading.hero} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Click to upload hero images</p>
            <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB (Max 4 images)</p>
          </label>
        )}
      </div>

      {/* Gallery */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Image className="w-5 h-5" />
          Property Gallery
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Add multiple images to showcase the property. Recommended: 800x600px
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {propertyData.gallery?.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={getFileUrl(image.url)}
                alt={`Gallery ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeGalleryImage(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {uploading.gallery ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
              <p className="mt-2 text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-gray-300 rounded-lg h-32 cursor-pointer hover:border-blue-500 transition-colors">
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
              <div className="h-full flex flex-col items-center justify-center">
                <Plus className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-500 mt-1">Add Image</p>
              </div>
            </label>
          )}
        </div>
      </div>

      {/* Plans - Master Plan, Floor Plans, Dimension Plans */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Grid3X3 className="w-5 h-5" />
          Project Plans
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Upload project layout plans based on property type. These help buyers understand the overall project and individual units.
        </p>

        {/* Dynamic Plans based on Property Category */}
        {(() => {
          const propertyType = propertyData.propertyType || 'apartment';
          const category = propertyCategoryMap[propertyType] || 'residential';
          const planTypes = planTypesByCategory[category] || planTypesByCategory.residential;

          return (
            <div className="space-y-6">
              {planTypes.map((planType) => {
                const PlanIcon = planType.icon;
                const isMultiple = planType.multiple;
                const plansData = isMultiple
                  ? (propertyData.plans?.[planType.key] || [])
                  : (propertyData.plans?.[planType.key] || null);

                return (
                  <div key={planType.key} className="border border-gray-200 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <PlanIcon className="w-5 h-5 text-blue-800" />
                      {planType.label}
                    </h4>
                    <p className="text-sm text-gray-500 mb-3">{planType.description}</p>

                    {isMultiple ? (
                      /* Multiple plans (Floor Plans, Dimension Plans) */
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.isArray(plansData) && plansData.map((plan, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={getFileUrl(plan.url)}
                              alt={`${planType.label} ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              onClick={() => {
                                const newPlans = [...(propertyData.plans?.[planType.key] || [])];
                                newPlans.splice(index, 1);
                                updatePropertyData(['plans', planType.key], newPlans);
                              }}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {uploading[planType.key] ? (
                          <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                            <div className="w-6 h-6 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                setUploading((prev) => ({ ...prev, [planType.key]: true }));
                                try {
                                  const response = await mediaAPI.uploadImage(file);
                                  const currentPlans = propertyData.plans?.[planType.key] || [];
                                  const newPlan = {
                                    url: response.data.data.url,
                                    publicId: response.data.data.publicId,
                                  };
                                  updatePropertyData(['plans', planType.key], [...currentPlans, newPlan]);
                                } catch (err) {
                                  console.error('Upload failed:', err);
                                } finally {
                                  setUploading((prev) => ({ ...prev, [planType.key]: false }));
                                }
                              }}
                            />
                            <Plus className="w-6 h-6 text-gray-400" />
                            <span className="text-sm text-gray-500 mt-1">Add</span>
                          </label>
                        )}
                      </div>
                    ) : (
                      /* Single plan (Master Plan) */
                      <div className="space-y-3">
                        {plansData?.url ? (
                          <div className="relative group">
                            <img
                              src={getFileUrl(plansData.url)}
                              alt={plansData.title || 'Master Plan'}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => updatePropertyData(['plans', planType.key], { url: '', publicId: '' })}
                              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : uploading[planType.key] ? (
                          <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg">
                            <div className="w-8 h-8 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : (
                          <label className="block border-2 border-dashed border-gray-300 rounded-lg h-48 cursor-pointer hover:border-blue-500 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                setUploading((prev) => ({ ...prev, [planType.key]: true }));
                                try {
                                  const response = await mediaAPI.uploadImage(file);
                                  updatePropertyData(['plans', planType.key], {
                                    url: response.data.data.url,
                                    publicId: response.data.data.publicId,
                                    title: 'Master Plan',
                                  });
                                } catch (err) {
                                  console.error('Upload failed:', err);
                                } finally {
                                  setUploading((prev) => ({ ...prev, [planType.key]: false }));
                                }
                              }}
                            />
                            <div className="h-full flex flex-col items-center justify-center">
                              <Upload className="w-10 h-10 text-gray-400 mb-2" />
                              <p className="text-gray-600">Upload {planType.label}</p>
                              <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                            </div>
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Video Tour */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Video className="w-5 h-5" />
          Video Tour
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Add a video tour for the property. You can either upload a video file or paste a YouTube/Vimeo embed link.
        </p>

        {/* Input Type Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setVideoInputType('url')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              videoInputType === 'url'
                ? 'bg-blue-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Embed Link
          </button>
          <button
            type="button"
            onClick={() => setVideoInputType('upload')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              videoInputType === 'upload'
                ? 'bg-blue-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Upload Video
          </button>
        </div>

        {/* URL Input */}
        {videoInputType === 'url' && (
          <div>
            <input
              type="text"
              value={propertyData.videoTour && !propertyData.videoTour.includes('cloudinary.com') ? propertyData.videoTour : ''}
              onChange={(e) => updatePropertyData('videoTour', e.target.value)}
              placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-2">
              Paste a YouTube or Vimeo embed URL (e.g., https://www.youtube.com/embed/dQw4w9WgXcQ)
            </p>
          </div>
        )}

        {/* Upload Input */}
        {videoInputType === 'upload' && (
          <div>
            {propertyData.videoTour && propertyData.videoTour.includes('cloudinary.com') ? (
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative">
                  <video
                    src={getFileUrl(propertyData.videoTour)}
                    className="w-full h-full object-cover"
                    controls
                  />
                  <button
                    onClick={removeVideo}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={removeVideo}
                  className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Remove Video
                </button>
              </div>
            ) : uploading.video ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <div className="w-12 h-12 border-2 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Uploading video...</p>
                <p className="text-sm text-gray-400 mt-1">This may take a few moments</p>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  className="hidden"
                  onChange={handleVideoUpload}
                  disabled={uploading.video}
                />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Click to upload video</p>
                <p className="text-sm text-gray-400 mt-1">MP4, WebM, OGG, MOV (max 100MB)</p>
              </label>
            )}
          </div>
        )}

        {/* Preview for URL */}
        {videoInputType === 'url' && propertyData.videoTour && !propertyData.videoTour.includes('cloudinary.com') && (
          <div className="mt-4">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
              <iframe
                src={getFileUrl(propertyData.videoTour)}
                title="Video Tour"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        )}

        {/* Show uploaded video preview if exists */}
        {propertyData.videoTour && propertyData.videoTour.includes('cloudinary.com') && videoInputType === 'url' && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-emerald-700 text-sm">
              <strong>✓ Video uploaded:</strong> A video file has been uploaded. Switch to "Upload Video" tab to view or remove it.
            </p>
          </div>
        )}
      </div>

      {/* Amenities - Manual Entry */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Grid3X3 className="w-5 h-5" />
              Amenities
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Add amenities with images. Each amenity will be displayed as a card with its image.
            </p>
          </div>
          <button
            onClick={addAmenity}
            className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Amenity
          </button>
        </div>

        {(!propertyData.amenities || propertyData.amenities.length === 0) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-800 text-sm">
              No amenities added yet. Click "Add Amenity" to add amenities like Swimming Pool, Gym, Clubhouse, etc.
            </p>
          </div>
        )}

        {propertyData.amenities && propertyData.amenities.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {propertyData.amenities.map((amenity, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Image Upload Area */}
                <div className="h-32 bg-gray-50 relative">
                  {amenity.image ? (
                    <div className="relative group h-full">
                      <img
                        src={getFileUrl(amenity.image)}
                        alt={amenity.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="cursor-pointer bg-white px-3 py-1.5 rounded text-sm font-medium text-gray-700 hover:bg-gray-100">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) handleAmenityImageUpload(index, file);
                            }}
                            disabled={uploading.amenities}
                          />
                          Replace
                        </label>
                        <button
                          onClick={() => updateAmenity(index, 'image', '')}
                          className="bg-red-500 px-3 py-1.5 rounded text-sm font-medium text-white hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleAmenityImageUpload(index, file);
                        }}
                        disabled={uploading.amenities}
                      />
                      {uploading.amenities ? (
                        <div className="w-6 h-6 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-300 mb-1" />
                          <span className="text-xs text-gray-500">Upload image</span>
                        </>
                      )}
                    </label>
                  )}
                </div>

                {/* Amenity Name Input */}
                <div className="p-3">
                  <input
                    type="text"
                    value={amenity.name || ''}
                    onChange={(e) => updateAmenity(index, 'name', e.target.value)}
                    placeholder="e.g., Swimming Pool"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeAmenity(index)}
                    className="w-full mt-2 py-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded text-sm transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggested Amenities */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Quick add common amenities:</p>
          <div className="flex flex-wrap gap-2">
            {['Swimming Pool', 'Gym', 'Clubhouse', 'Children\'s Play Area', 'Garden', 'Parking', '24/7 Security', 'Power Backup', 'Jogging Track', 'Tennis Court', 'Basketball Court', 'Indoor Games'].map((amenity) => (
              <button
                key={amenity}
                onClick={() => {
                  if (!(propertyData.amenities || []).some(a => a.name === amenity)) {
                    updatePropertyData('amenities', [...(propertyData.amenities || []), { name: amenity, image: '', publicId: '' }]);
                  }
                }}
                disabled={(propertyData.amenities || []).some(a => a.name === amenity)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  (propertyData.amenities || []).some(a => a.name === amenity)
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Brochure Upload */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileDown className="w-5 h-5" />
          Property Brochure
          <span className="text-sm font-normal text-gray-400">(Optional)</span>
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Upload a PDF brochure for visitors to download. This will appear as a floating download button on the property page.
        </p>

        {propertyData.brochure?.url ? (
          <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{propertyData.brochure.name || 'Brochure.pdf'}</p>
                <p className="text-sm text-gray-500">PDF uploaded successfully</p>
              </div>
            </div>
            <button
              onClick={removeBrochure}
              className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          </div>
        ) : uploading.brochure ? (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <div className="w-12 h-12 border-2 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Uploading brochure...</p>
            <p className="text-sm text-gray-400 mt-1">This may take a few moments</p>
          </div>
        ) : (
          <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleBrochureUpload}
              disabled={uploading.brochure}
            />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Click to upload brochure</p>
            <p className="text-sm text-gray-400 mt-1">PDF only (max 20MB)</p>
          </label>
        )}
      </div>
    </div>
  );
};

export default MediaUploadStep;