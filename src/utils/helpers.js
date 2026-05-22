/**
 * Formats a numeric value as USD currency
 * @param {number} value
 * @returns {string}
 */
export const formatCurrency = (value) => {
  const inrValue = value * 83;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inrValue);
};

/**
 * Validates an email address format
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates password strength (minimum 6 characters)
 * @param {string} password
 * @returns {boolean}
 */
export const validatePassword = (password) => {
  return password.length >= 6;
};

/**
 * Simulates a delay for showing beautiful loading indicators
 * @param {number} ms 
 * @returns {Promise}
 */
export const mockDelay = (ms = 800) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
