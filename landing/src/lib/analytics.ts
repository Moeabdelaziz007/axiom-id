// Initialize PostHog analytics
export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    // Check if PostHog is already loaded
    if ((window as any).posthog?.__loaded) return;

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdn.posthog.com/posthog.js';
    script.async = true;
    script.onload = () => {
      (window as any).posthog.init('YOUR_POSTHOG_API_KEY', {
        api_host: 'https://app.posthog.com',
        autocapture: true,
        capture_pageview: true,
        capture_pageleave: true,
      });
    };
    document.head.appendChild(script);
  }
};// Initialize PostHog analytics
export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    // Check if PostHog is already loaded
    if ((window as any).posthog?.__loaded) return;

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdn.posthog.com/posthog.js';
    script.async = true;
    script.onload = () => {
      (window as any).posthog.init('YOUR_POSTHOG_API_KEY', {
        api_host: 'https://app.posthog.com',
        autocapture: true,
        capture_pageview: true,
        capture_pageleave: true,
      });
    };
    document.head.appendChild(script);
  }
};