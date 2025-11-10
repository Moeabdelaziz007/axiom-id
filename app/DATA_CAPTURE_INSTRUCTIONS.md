# Axiom ID Data Capture Configuration Instructions

This document provides instructions for configuring the data capture tools in the Axiom ID waitlist form.

## Configuration Options

The waitlist form in `app/index.html` supports multiple data capture methods with the following priority:
1. Supabase (if configured)
2. Formspree endpoint (if configured)
3. localStorage fallback (default)

Optional PostHog analytics can be enabled for tracking user interactions.

## Setting Up Formspree

1. Go to [Formspree.io](https://formspree.io/) and create an account
2. Create a new form and copy the endpoint URL
3. In `app/index.html`, find the line:
   ```javascript
   const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
   ```
4. Replace `'https://formspree.io/f/YOUR_FORM_ID'` with your actual endpoint

## Setting Up Supabase

1. Create a Supabase account at [supabase.io](https://supabase.io/)
2. Create a new project
3. Get your project URL and anon key from the project settings
4. In `app/index.html`, find the lines:
   ```javascript
   const SUPABASE_URL = ''; // e.g. 'https://your-project.supabase.co'
   const SUPABASE_ANON_KEY = ''; // Get from your Supabase dashboard
   ```
5. Update these variables with your actual values
6. Create a `waitlist` table with this SQL:
   ```sql
   create table waitlist (
     id uuid default gen_random_uuid() primary key,
     email text not null,
     name text,
     phone text,
     wallet text,
     ts timestamptz default now()
   );
   ```
7. Set up Row Level Security (RLS) policies to allow anonymous inserts:
   ```sql
   -- Allow anonymous inserts
   alter table waitlist enable row level security;
   
   create policy "Allow anonymous inserts"
   on waitlist for insert
   to anon
   with check (true);
   ```

## Setting Up PostHog Analytics

1. Create a PostHog account at [posthog.com](https://posthog.com/)
2. Create a new project and get your API key
3. In `app/index.html`, find the line:
   ```javascript
   const POSTHOG_API_KEY = ''; // e.g. 'phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
   ```
4. Update this variable with your actual API key

## Testing Locally

### Simple Python Server

```bash
cd "/Users/cryptojoker710/Desktop/Axiom ID/axiom_id/app"
python3 -m http.server 8080
# Open http://localhost:8080 in your browser
```

### With npx serve

```bash
cd "/Users/cryptojoker710/Desktop/Axiom ID/axiom_id/app"
npx serve -l 8080
# Open http://localhost:8080 in your browser
```

## Testing the Form

1. Enter an email, optional name/phone, check the consent box, click "Join waitlist"
2. If Supabase is configured, check the waitlist table for new rows
3. If using Formspree, you'll see submissions in your dashboard
4. If neither is configured, data is stored in localStorage under key `axiom_waitlist`

## Testing Wallet Connection

1. Install Phantom wallet browser extension
2. Click "Connect Wallet" - you should see a partial public key in the status message

## Privacy Considerations

1. Never store unencrypted PII on-chain
2. When using Supabase anon key on the frontend, ensure your table policies are secure
3. Provide clear privacy notices to users about data collection and usage
4. Consider implementing additional security measures like CAPTCHA for production use
5. Regularly audit data access logs and permissions