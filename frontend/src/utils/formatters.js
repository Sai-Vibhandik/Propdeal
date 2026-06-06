// Format price to Indian format
export const formatPrice = (price, unit = 'lac') => {
  if (!price) return '';

  const units = {
    lac: { divisor: 100000, suffix: 'Lac' },
    cr: { divisor: 10000000, suffix: 'Cr' },
  };

  const { divisor, suffix } = units[unit] || units.lac;
  const formatted = (price / divisor).toFixed(2);
  return `${formatted} ${suffix}`;
};

// Format price range
export const formatPriceRange = (min, max, unit = 'lac') => {
  if (!min && !max) return 'Price on Request';
  if (min && max) {
    return `${formatPrice(min, unit)} - ${formatPrice(max, unit)}`;
  }
  return min ? `Starting from ${formatPrice(min, unit)}` : `Up to ${formatPrice(max, unit)}`;
};

// Format number with commas (Indian format)
export const formatNumber = (num) => {
  if (!num) return '';
  return new Intl.NumberFormat('en-IN').format(num);
};

// Format date
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-IN', { ...defaultOptions, ...options });
};

// Format short date
export const formatShortDate = (date) => {
  return formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' });
};

// Format relative time
export const formatRelativeTime = (date) => {
  if (!date) return '';

  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return formatDate(date);
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

// Format phone number
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

// Format area
export const formatArea = (size, unit = 'sq.ft.') => {
  if (!size) return '';
  return `${formatNumber(size)} ${unit}`;
};

// Slugify string
export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Truncate text
export const truncate = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
};

// Capitalize first letter
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Title case
export const titleCase = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

// Parse configuration (e.g., "2BHK" -> { bhk: 2 })
export const parseConfiguration = (config) => {
  const match = config?.match(/(\d+)BHK/i);
  return match ? parseInt(match[1]) : null;
};

// Get possession status text
export const getPossessionStatus = (date) => {
  if (!date) return '';

  const now = new Date();
  const possession = new Date(date);
  const diff = possession - now;
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));

  if (months <= 0) return 'Ready to Move';
  if (months <= 6) return `Possession in ${months} month${months > 1 ? 's' : ''}`;
  if (months <= 12) return 'Possession within a year';
  return `Possession by ${formatDate(date, { year: 'numeric', month: 'short' })}`;
};

export default {
  formatPrice,
  formatPriceRange,
  formatNumber,
  formatDate,
  formatShortDate,
  formatRelativeTime,
  formatPhone,
  formatArea,
  slugify,
  truncate,
  capitalize,
  titleCase,
  parseConfiguration,
  getPossessionStatus,
};