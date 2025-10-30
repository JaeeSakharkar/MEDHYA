// Error handler to suppress common browser extension errors
export const suppressBrowserExtensionErrors = () => {
  // Suppress the common "message port closed" error from browser extensions
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('message port closed')) {
      event.preventDefault();
      return false;
    }
  });

  // Suppress unhandled promise rejections from browser extensions
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && 
        event.reason.message.includes('message port closed')) {
      event.preventDefault();
      return false;
    }
  });
};

// Initialize error suppression
suppressBrowserExtensionErrors();