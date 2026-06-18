// Enhanced Theme System
// Supports preset themes, custom colors, and dark/light modes

export const getThemeStyles = (theme = {}) => {
  const { preset = 'classic-blue' } = theme;

  // Preset definitions with full color schemes
  const presets = {
    'classic-blue': {
      primary: '#1e40af',
      secondary: '#d4af37',
      accent: '#059669',
      isDark: false,
      background: '#ffffff',
      text: '#1e293b',
      cardBg: '#ffffff',
    },
    'luxury-gold': {
      primary: '#c9a227',
      secondary: '#fbbf24',
      accent: '#c9a227',
      isDark: true,
      background: '#111827',
      text: '#f9fafb',
      cardBg: '#1f2937',
    },
    'modern-green': {
      primary: '#059669',
      secondary: '#fbbf24',
      accent: '#10b981',
      isDark: false,
      background: '#ffffff',
      text: '#1e293b',
      cardBg: '#f0fdf4',
    },
    'bold-red': {
      primary: '#dc2626',
      secondary: '#f59e0b',
      accent: '#ef4444',
      isDark: false,
      background: '#ffffff',
      text: '#1e293b',
      cardBg: '#fef2f2',
    },
    'minimal-white': {
      primary: '#374151',
      secondary: '#3b82f6',
      accent: '#6b7280',
      isDark: false,
      background: '#ffffff',
      text: '#111827',
      cardBg: '#f9fafb',
    },
    'elegant-purple': {
      primary: '#7c3aed',
      secondary: '#c084fc',
      accent: '#8b5cf6',
      isDark: false,
      background: '#ffffff',
      text: '#1e293b',
      cardBg: '#faf5ff',
    },
    'warm-earth': {
      primary: '#b45309',
      secondary: '#d97706',
      accent: '#f59e0b',
      isDark: false,
      background: '#ffffff',
      text: '#1e293b',
      cardBg: '#fffbeb',
    },
    'dark-elegant': {
      primary: '#c9a227',
      secondary: '#e5e5e5',
      accent: '#fbbf24',
      isDark: true,
      background: '#0f172a',
      text: '#f1f5f9',
      cardBg: '#1e293b',
    },
  };

  // Get preset or default
  const presetColors = presets[preset] || presets['classic-blue'];

  // Build theme colors - custom overrides take precedence over preset
  const colors = {
    primary: theme.primaryColor || presetColors.primary,
    secondary: theme.secondaryColor || presetColors.secondary,
    accent: theme.accentColor || presetColors.accent,
  };

  // Determine dark mode - always respect explicit darkMode setting
  // User can toggle darkMode regardless of which preset is selected
  const isDark = theme.darkMode ?? presetColors.isDark ?? false;

  // Build background and text colors based on mode
  const backgroundColor = theme.backgroundColor || (isDark ? '#111827' : '#ffffff');
  const textColor = theme.textColor || (isDark ? '#f9fafb' : '#1e293b');
  const cardBackground = theme.cardBackground || (isDark ? '#1f2937' : '#ffffff');

  return {
    colors: {
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      background: backgroundColor,
      text: textColor,
      cardBg: cardBackground,
      // Derived colors for convenience
      textMuted: isDark ? '#9ca3af' : '#6b7280',
      border: isDark ? '#374151' : '#e5e7eb',
      surface: isDark ? '#1f2937' : '#ffffff',
    },
    isDark,
    fonts: {
      heading: getFontFamily(theme.fontStyle || 'modern'),
      body: "'Inter', sans-serif",
    },
  };
};

// Get font family based on style
const getFontFamily = (style) => {
  const fonts = {
    modern: "'Inter', sans-serif",
    classic: "'Georgia', serif",
    luxury: "'Playfair Display', serif",
  };
  return fonts[style] || fonts.modern;
};

// Apply theme to document - sets CSS variables and dark mode class
export const applyThemeToDocument = (theme = {}) => {
  const styles = getThemeStyles(theme);
  const root = document.documentElement;

  // Set CSS variables for all colors
  root.style.setProperty('--color-primary', styles.colors.primary);
  root.style.setProperty('--color-secondary', styles.colors.secondary);
  root.style.setProperty('--color-accent', styles.colors.accent);
  root.style.setProperty('--color-background', styles.colors.background);
  root.style.setProperty('--color-text', styles.colors.text);
  root.style.setProperty('--color-text-muted', styles.colors.textMuted);
  root.style.setProperty('--color-card-bg', styles.colors.cardBg);
  root.style.setProperty('--color-border', styles.colors.border);
  root.style.setProperty('--color-surface', styles.colors.surface);

  // Set font variables
  root.style.setProperty('--font-heading', styles.fonts.heading);
  root.style.setProperty('--font-body', styles.fonts.body);

  // Set dark mode class for Tailwind dark: variants
  if (styles.isDark) {
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = styles.colors.background;
    document.body.style.color = styles.colors.text;
  } else {
    document.documentElement.classList.remove('dark');
    document.body.style.backgroundColor = styles.colors.background;
    document.body.style.color = styles.colors.text;
  }
};

// Get theme CSS variables
export const getThemeCSS = (theme = {}) => {
  const styles = getThemeStyles(theme);
  return {
    '--color-primary': styles.colors.primary,
    '--color-secondary': styles.colors.secondary,
    '--color-accent': styles.colors.accent,
    '--color-background': styles.colors.background,
    '--color-text': styles.colors.text,
    '--color-text-muted': styles.colors.textMuted,
    '--color-card-bg': styles.colors.cardBg,
    '--color-border': styles.colors.border,
    '--color-surface': styles.colors.surface,
    '--font-heading': styles.fonts.heading,
    '--font-body': styles.fonts.body,
  };
};

// Convert hex to RGB
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Get contrasting text color (black or white) for a background
export const getContrastColor = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#000000';

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  return luminance > 0.5 ? '#000000' : '#ffffff';
};

// Get card background classes based on section background variant and theme
// This ensures cards always have contrast against their parent section
export const getCardClasses = (bgVariant = 'white', isDark = false) => {
  if (isDark) {
    // Dark mode: cards should be opposite tone of section
    // gray section (bg-gray-800) -> cards should be darker (bg-gray-900)
    // white section (bg-gray-900) -> cards should be lighter (bg-gray-800)
    return bgVariant === 'gray' ? 'bg-gray-900' : 'bg-gray-800';
  } else {
    // Light mode: cards are always white
    // For white sections, cards need border for definition
    return 'bg-white';
  }
};

// Get card border classes for additional definition when needed
export const getCardBorderClasses = (bgVariant = 'white', isDark = false) => {
  if (isDark) {
    // Dark mode: subtle border for definition
    return 'border border-gray-700';
  } else {
    // Light mode: border only needed for white sections
    return bgVariant === 'white' ? 'border border-gray-200' : '';
  }
};

// Get section background classes based on variant and theme
export const getSectionBgClasses = (bgVariant = 'white', isDark = false) => {
  if (isDark) {
    return bgVariant === 'gray' ? 'bg-gray-800' : 'bg-gray-900';
  } else {
    return bgVariant === 'gray' ? 'bg-gray-50' : 'bg-white';
  }
};

// Auto-suggest dark mode based on primary color
export const suggestDarkMode = (primaryColor) => {
  const rgb = hexToRgb(primaryColor);
  if (!rgb) return false;

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  // If primary color is dark, suggest light mode (false)
  // If primary color is light, suggest dark mode (true)
  return luminance > 0.5;
};

export default {
  getThemeStyles,
  applyThemeToDocument,
  getThemeCSS,
  hexToRgb,
  getContrastColor,
  suggestDarkMode,
};