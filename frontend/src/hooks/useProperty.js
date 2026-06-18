import { useState, useEffect, useCallback } from 'react';
import { propertiesAPI } from '../services/api.js';

// Check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const useProperty = (slug) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use preview endpoint if admin is logged in (can view drafts)
        // Use public endpoint for regular users (only published properties)
        const response = isAuthenticated()
          ? await propertiesAPI.getPreviewBySlug(slug)
          : await propertiesAPI.getBySlug(slug);

        if (response.data.success) {
          const { property: prop, media, content } = response.data.data;

          // Convert Mongoose document to plain object if needed
          const propData = prop.toObject ? prop.toObject() : prop;

          // Merge generatedContent from content array (if separate collection)
          const generatedContent = {};
          if (content && Array.isArray(content)) {
            content.forEach((c) => {
              generatedContent[c.section] = c.content;
            });
          }

          // Build the full property object
          const fullProperty = {
            ...propData,
            // Use embedded hero images or fallback
            heroImages: propData.heroImages?.length > 0
              ? propData.heroImages
              : propData.heroImage
                ? [{ url: propData.heroImage, publicId: '', title: '' }] // Legacy support
                : [],
            // Use embedded gallery or fallback to separate collection
            gallery: propData.gallery?.length > 0
              ? propData.gallery
              : media
                ? media
                    .filter((m) => m.section === 'gallery')
                    .map((m) => ({
                      url: m.cloudinaryUrl,
                      type: m.type,
                      title: m.title,
                    }))
                : [],
            floorPlans: propData.floorPlans?.length > 0
              ? propData.floorPlans
              : media
                ? media
                    .filter((m) => m.section === 'floorPlans')
                    .map((m) => ({
                      configuration: m.title,
                      size: m.metadata?.size || '',
                      price: m.metadata?.price || '',
                      image: m.cloudinaryUrl,
                    }))
                : [],
            // Merge generated content (embedded takes precedence)
            generatedContent: propData.generatedContent || generatedContent,
          };

          setProperty(fullProperty);
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err.response?.data?.message || 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [slug]);

  return { property, loading, error };
};

export const useProperties = (filters = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });

  // Serialize filters to avoid infinite loops from object reference changes
  const filterString = JSON.stringify(filters);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await propertiesAPI.getAll(JSON.parse(filterString));

        if (response.data.success) {
          setProperties(response.data.data);
          setPagination(response.data.pagination);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err.response?.data?.message || 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filterString]);

  const refetch = useCallback(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await propertiesAPI.getAll(JSON.parse(filterString));

        if (response.data.success) {
          setProperties(response.data.data);
          setPagination(response.data.pagination);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err.response?.data?.message || 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filterString]);

  return { properties, loading, error, pagination, refetch };
};

export const useFeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await propertiesAPI.getFeatured();

        if (response.data.success) {
          setProperties(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching featured properties:', err);
        setError(err.response?.data?.message || 'Failed to load featured properties');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { properties, loading, error };
};

export const useAdminProperties = (filters = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  // Serialize filters to avoid infinite loops from object reference changes
  const filterString = JSON.stringify(filters);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await propertiesAPI.getAdminAll(JSON.parse(filterString));

      if (response.data.success) {
        setProperties(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching admin properties:', err);
      setError(err.response?.data?.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [filterString]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const createProperty = async (data) => {
    const response = await propertiesAPI.create(data);
    await fetchProperties();
    return response.data;
  };

  const updateProperty = async (id, data) => {
    const response = await propertiesAPI.update(id, data);
    await fetchProperties();
    return response.data;
  };

  const deleteProperty = async (id) => {
    const response = await propertiesAPI.delete(id);
    await fetchProperties();
    return response.data;
  };

  const updateStatus = async (id, status) => {
    const response = await propertiesAPI.updateStatus(id, status);
    await fetchProperties();
    return response.data;
  };

  const toggleFeatured = async (id) => {
    const response = await propertiesAPI.toggleFeatured(id);
    await fetchProperties();
    return response.data;
  };

  return {
    properties,
    loading,
    error,
    pagination,
    refetch: fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    updateStatus,
    toggleFeatured,
  };
};

export const useAdminProperty = (id) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await propertiesAPI.getAdminOne(id);

        if (response.data.success) {
          const { property: prop, media, content } = response.data.data;

          // Merge generatedContent from content array (if separate collection)
          const generatedContent = {};
          if (content && Array.isArray(content)) {
            content.forEach((c) => {
              generatedContent[c.section] = c.content;
            });
          }

          // Build the full property object
          const propData = prop.toObject ? prop.toObject() : prop;
          const fullProperty = {
            ...propData,
            // Use embedded hero images or fallback
            heroImages: propData.heroImages?.length > 0
              ? propData.heroImages
              : propData.heroImage
                ? [{ url: propData.heroImage, publicId: '', title: '' }] // Legacy support
                : [],
            // Use embedded gallery or fallback to separate collection
            gallery: propData.gallery?.length > 0
              ? propData.gallery
              : media
                ? media
                    .filter((m) => m.section === 'gallery')
                    .map((m) => ({
                      url: m.cloudinaryUrl,
                      type: m.type,
                      title: m.title,
                    }))
                : [],
            floorPlans: prop.floorPlans?.length > 0
              ? prop.floorPlans
              : media
                ? media
                    .filter((m) => m.section === 'floorPlans')
                    .map((m) => ({
                      configuration: m.title,
                      size: m.metadata?.size || '',
                      price: m.metadata?.price || '',
                      image: m.cloudinaryUrl,
                    }))
                : [],
            // Merge generated content (embedded takes precedence)
            generatedContent: prop.generatedContent || generatedContent,
          };

          setProperty(fullProperty);
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err.response?.data?.message || 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, loading, error };
};