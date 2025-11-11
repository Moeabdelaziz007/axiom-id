// This file contains functions to handle waitlist submissions
// Since we're using Vite (not Next.js), we can't use Server Actions
// Instead, we'll create API functions that can be called from components

import { z } from 'zod';

// Define the schema for email validation
const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Function to handle waitlist submission
export async function joinWaitlist(email: string) {
  try {
    // Validate the email
    const validatedFields = waitlistSchema.safeParse({
      email,
    });

    // Return early if validation fails
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Invalid email format',
      };
    }

    // Track event with PostHog if available
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('waitlist_submitted', {
        email: validatedFields.data.email,
      });
    }

    // Try to submit to Formspree first
    try {
      const response = await fetch('https://formspree.io/f/xblqrblj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: validatedFields.data.email,
          subject: 'Axiom ID Waitlist Signup',
        }),
      });

      if (response.ok) {
        // Success - Formspree accepted the submission
        return {
          success: true,
          message: 'Thanks for joining! We\'ll reach out to you soon.',
        };
      }
    } catch (formspreeError) {
      // Formspree failed, continue to localStorage fallback
      console.warn('Formspree submission failed:', formspreeError);
    }

    // Fallback to localStorage if Formspree fails
    try {
      const waitlistData = JSON.parse(localStorage.getItem('axiom-waitlist') || '[]');
      waitlistData.push({
        email: validatedFields.data.email,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('axiom-waitlist', JSON.stringify(waitlistData));
      
      // Track localStorage save with PostHog if available
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('waitlist_saved_local', {
          email: validatedFields.data.email,
        });
      }

      return {
        success: true,
        message: 'Thanks for joining! We\'ll reach out to you soon. (Data saved locally)',
      };
    } catch (localStorageError) {
      // Both Formspree and localStorage failed
      console.error('Both Formspree and localStorage failed:', localStorageError);
      
      // Track error with PostHog if available
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('waitlist_error', {
          email: validatedFields.data.email,
          error: 'Both Formspree and localStorage failed',
        });
      }

      return {
        message: 'An unexpected error occurred. Please try again later.',
      };
    }
  } catch (error: unknown) {
    // Handle any unexpected errors
    console.error('Unexpected error in joinWaitlist:', error);
    
    // Track error with PostHog if available
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('waitlist_error', {
        email: email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return {
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
}