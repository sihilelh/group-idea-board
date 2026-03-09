/**
 * Theme Manager Module
 * Handles light/dark mode toggling
 */

const ThemeManager = (() => {
  const THEME_KEY = 'ideakart_theme';
  const LIGHT_MODE = 'light';
  const DARK_MODE = 'dark';

  /**
   * Initialize theme
   */
  const init = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = savedTheme || (prefersDark ? DARK_MODE : LIGHT_MODE);
    applyTheme(theme);
  };

  /**
   * Apply theme
   * @param {string} theme - Theme to apply (light or dark)
   */
  const applyTheme = (theme) => {
    const body = document.body;

    if (theme === LIGHT_MODE) {
      body.classList.add('light-mode');
      localStorage.setItem(THEME_KEY, LIGHT_MODE);
      updateLogoColors();
    } else {
      body.classList.remove('light-mode');
      localStorage.setItem(THEME_KEY, DARK_MODE);
      updateLogoColors();
    }
  };

  /**
   * Toggle theme
   */
  const toggleTheme = () => {
    const body = document.body;
    const newTheme = body.classList.contains('light-mode') ? DARK_MODE : LIGHT_MODE;
    applyTheme(newTheme);
  };

  /**
   * Update logo colors based on theme
   */
  const updateLogoColors = () => {
    const logoIcons = document.querySelectorAll('.logo-icon');
    const isLightMode = document.body.classList.contains('light-mode');

    logoIcons.forEach(icon => {
      if (isLightMode) {
        // Set light mode colors
        icon.style.stroke = '#ffffff';
        icon.style.fill = 'white';
      } else {
        // Set dark mode colors
        icon.style.stroke = 'white';
        icon.style.fill = 'none';
      }
    });
  };

  /**
   * Get current theme
   * @returns {string} Current theme
   */
  const getCurrentTheme = () => {
    return document.body.classList.contains('light-mode') ? LIGHT_MODE : DARK_MODE;
  };

  return {
    init,
    toggleTheme,
    applyTheme,
    getCurrentTheme,
  };
})();
