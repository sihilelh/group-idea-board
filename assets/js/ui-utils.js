/**
 * UI Utility Module
 * Handles DOM manipulation and reusable UI operations
 */

const UIUtils = (() => {
  /**
   * Show a success message
   * @param {string} message - Message text
   * @param {HTMLElement} container - Container to append message
   * @param {number} duration - Duration in ms to show message (0 = permanent)
   */
  const showSuccessMessage = (message, container = null, duration = 3000) => {
    const msgElement = document.createElement('div');
    msgElement.className = 'success-message fade-in';
    msgElement.textContent = message;

    const target = container || document.body;
    target.insertBefore(msgElement, target.firstChild);

    if (duration > 0) {
      setTimeout(() => {
        msgElement.style.opacity = '0';
        setTimeout(() => msgElement.remove(), 300);
      }, duration);
    }

    return msgElement;
  };

  /**
   * Format date/time for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
    }
  };

  /**
   * Populate a select dropdown
   * @param {string|HTMLElement} selector - Element selector or element
   * @param {Array} options - Array of options
   * @param {string} defaultValue - Default selected value
   */
  const populateSelect = (selector, options, defaultValue = '') => {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!element) return;

    element.innerHTML = '';

    if (defaultValue === '' && options.length > 0) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Select a name...';
      element.appendChild(option);
    }

    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      if (opt === defaultValue) {
        option.selected = true;
      }
      element.appendChild(option);
    });
  };

  /**
   * Show/hide element
   * @param {string|HTMLElement} selector - Element selector or element
   * @param {boolean} show - true to show, false to hide
   */
  const toggleVisibility = (selector, show = true) => {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (element) {
      element.classList.toggle('hidden', !show);
    }
  };

  /**
   * Get form values as object
   * @param {string|HTMLFormElement} formSelector - Form selector or element
   * @returns {Object} Form data
   */
  const getFormData = (formSelector) => {
    const form = typeof formSelector === 'string' ? document.querySelector(formSelector) : formSelector;
    if (!form) return {};

    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    return data;
  };

  /**
   * Clear form
   * @param {string|HTMLFormElement} formSelector - Form selector or element
   */
  const clearForm = (formSelector) => {
    const form = typeof formSelector === 'string' ? document.querySelector(formSelector) : formSelector;
    if (form) {
      form.reset();
    }
  };

  /**
   * Create a pagination element
   * @param {number} currentPage - Current page number
   * @param {number} totalPages - Total pages
   * @param {Function} onPageChange - Callback function for page changes
   * @returns {HTMLElement} Pagination element
   */
  const createPagination = (currentPage, totalPages, onPageChange) => {
    const container = document.createElement('div');
    container.className = 'pagination';

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => onPageChange(currentPage - 1);
    container.appendChild(prevBtn);

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      const firstBtn = document.createElement('button');
      firstBtn.textContent = '1';
      firstBtn.onclick = () => onPageChange(1);
      container.appendChild(firstBtn);

      if (startPage > 2) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        container.appendChild(dots);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      if (i === currentPage) {
        btn.classList.add('active');
      }
      btn.onclick = () => onPageChange(i);
      container.appendChild(btn);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        container.appendChild(dots);
      }

      const lastBtn = document.createElement('button');
      lastBtn.textContent = totalPages;
      lastBtn.onclick = () => onPageChange(totalPages);
      container.appendChild(lastBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next →';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => onPageChange(currentPage + 1);
    container.appendChild(nextBtn);

    return container;
  };

  /**
   * Debounce function for input events
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} Debounced function
   */
  const debounce = (func, wait = 300) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  /**
   * Escape HTML for safe display
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  return {
    showSuccessMessage,
    formatDate,
    populateSelect,
    toggleVisibility,
    getFormData,
    clearForm,
    createPagination,
    debounce,
    escapeHtml,
  };
})();
