export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone.replace(/\D/g, ''));
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

export const validatePincode = (pincode) => {
  const re = /^[1-9][0-9]{5}$/;
  return re.test(pincode);
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/<[^>]*>/g, '');
};

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

export const formatNumber = (num) => {
  if (!num) return '';
  return new Intl.NumberFormat('en-IN').format(num);
};

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validatePincode,
  sanitizeInput,
  formatPrice,
  formatNumber,
};