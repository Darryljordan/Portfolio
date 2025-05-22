// Internationalization (i18n) Module

// Default language
let currentLanguage = 'en';

// Translations storage
const translations = {
  en: {},
  fr: {}
};

// Initialize i18n system
async function initI18n() {
  // Try to load language preference from localStorage
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
    currentLanguage = savedLanguage;
  } else {
    // Default to browser language if available and supported
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'fr') {
      currentLanguage = 'fr';
    }
  }

  // Load translation files
  try {
    const response = await fetch(`/i18n/${currentLanguage}.json`);
    if (response.ok) {
      translations[currentLanguage] = await response.json();
    } else {
      console.error('Failed to load translations');
    }
  } catch (error) {
    console.error('Error loading translations:', error);
  }

  // Apply translations to the page
  applyTranslations();
  
  // Update language switcher
  updateLanguageSwitcher();
}

// Apply translations to all elements with data-i18n attribute
function applyTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[currentLanguage][key]) {
      element.innerHTML = translations[currentLanguage][key];
    }
  });
}

// Switch language
function switchLanguage(lang) {
  if (lang !== currentLanguage && (lang === 'en' || lang === 'fr')) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Reload translations and apply them
    initI18n();
  }
}

// Update the language switcher UI
function updateLanguageSwitcher() {
  const switchers = document.querySelectorAll('.language-switcher');
  switchers.forEach(switcher => {
    const enButton = switcher.querySelector('[data-lang="en"]');
    const frButton = switcher.querySelector('[data-lang="fr"]');
    
    if (enButton && frButton) {
      if (currentLanguage === 'en') {
        enButton.classList.add('active');
        frButton.classList.remove('active');
      } else {
        enButton.classList.remove('active');
        frButton.classList.add('active');
      }
    }
  });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', initI18n);

// Export functions for global use
window.i18n = {
  switchLanguage
};
