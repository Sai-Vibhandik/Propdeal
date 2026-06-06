import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertiesAPI } from '../services/api.js';

// Get all public properties
export const useProperties = (params) => {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => propertiesAPI.getAll(params).then((res) => res.data),
    keepPreviousData: true,
  });
};

// Get featured properties
export const useFeaturedProperties = () => {
  return useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: () => propertiesAPI.getFeatured().then((res) => res.data),
  });
};

// Get single property by slug
export const useProperty = (slug) => {
  return useQuery({
    queryKey: ['property', slug],
    queryFn: () => propertiesAPI.getBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  });
};

// Admin: Get all properties
export const useAdminProperties = (params) => {
  return useQuery({
    queryKey: ['admin', 'properties', params],
    queryFn: () => propertiesAPI.getAdminAll(params).then((res) => res.data),
    keepPreviousData: true,
  });
};

// Admin: Get single property
export const useAdminProperty = (id) => {
  return useQuery({
    queryKey: ['admin', 'property', id],
    queryFn: () => propertiesAPI.getAdminOne(id).then((res) => res.data),
    enabled: !!id,
  });
};

// Admin: Create property
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => propertiesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
    },
  });
};

// Admin: Update property
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => propertiesAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'property', id] });
    },
  });
};

// Admin: Delete property
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => propertiesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
    },
  });
};

// Admin: Update status
export const useUpdatePropertyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => propertiesAPI.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'property', id] });
    },
  });
};

// Admin: Toggle featured
export const useToggleFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => propertiesAPI.toggleFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
    },
  });
};

export default {
  useProperties,
  useFeaturedProperties,
  useProperty,
  useAdminProperties,
  useAdminProperty,
  useCreateProperty,
  useUpdateProperty,
  useDeleteProperty,
  useUpdatePropertyStatus,
  useToggleFeatured,
};