import { createContext, useContext, useState, useCallback } from 'react';

const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    city: '',
    propertyType: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    configuration: '',
    builder: '',
    search: '',
    sort: '-createdAt',
  });

  const [page, setPage] = useState(1);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filter changes
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      city: '',
      propertyType: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      configuration: '',
      builder: '',
      search: '',
      sort: '-createdAt',
    });
    setPage(1);
  }, []);

  const value = {
    filters,
    page,
    setPage,
    updateFilter,
    updateFilters,
    clearFilters,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

export default FilterContext;