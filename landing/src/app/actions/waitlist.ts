'use server';

import { z } from 'zod';

// Define the schema for email validation
const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Server action to handle waitlist submission
export async function joinWaitlist(formData: FormData) {
  try {
    // Extract and validate the email
    const email = formData.get('email');
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

    // Here you would integrate with your preferred service:
    // 1. Supabase
    // 2. Formspree
    // 3. Direct database insertion
    // 4. Email service (like Mailchimp, Resend, etc.)

    // For now, we'll just log to console as a placeholder
    // You can replace this with actual integration code
    console.log('New waitlist submission:', validatedFields.data.email);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success
    return {
      success: true,
      message: 'Thanks for joining! We\'ll reach out to you soon.',
    };
  } catch (error) {
    // Handle any unexpected errors
    return {
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
}