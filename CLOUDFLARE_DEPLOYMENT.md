# Cloudflare Pages Deployment Guide

## ✅ Why Cloudflare Pages?

- **UNLIMITED FREE BANDWIDTH** for static assets (images, CSS, JS)
- **100,000 free dynamic requests/day** for server-side rendering
- **Full Next.js support** (App Router, SSR, API routes, etc.)
- **No surprise bills** - service pauses if you hit limits, never charges
- **Better than Netlify/Vercel** - No 100GB bandwidth limitation

## 🚀 Deployment Steps

### Option 1: GitHub Integration (Recommended)

1. **Push your code to GitHub** (if not already done)

2. **Go to Cloudflare Pages**
   - Visit: https://dash.cloudflare.com/
   - Navigate to: Workers & Pages → Create application → Pages → Connect to Git

3. **Connect your repository**
   - Select your GitHub repository
   - Click "Begin setup"

4. **Configure build settings** ⚠️ CRITICAL - Set these exactly:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next` (leave as default)
   - **Root directory (path)**: `axiom_id` ← THIS IS CRITICAL!
   - **Environment variables**: 
     - `NODE_VERSION` = `18` (or higher)

5. **Environment Variables** (if needed)
   - Add any environment variables your app needs
   - Example: `NODE_VERSION = 18`

6. **Deploy**
   - Click "Save and Deploy"
   - Cloudflare will build and deploy your app
   - You'll get a URL like: `your-project.pages.dev`

### Option 2: Wrangler CLI (Alternative)

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy from axiom_id directory
cd axiom_id
npx @cloudflare/next-on-pages

# Deploy
wrangler pages deploy .vercel/output/static --project-name=axiom-id
```

## 📊 What You Get (Free Tier)

- ✅ Unlimited bandwidth for static assets
- ✅ 100,000 requests/day for dynamic content
- ✅ 500 builds/month
- ✅ Unlimited sites
- ✅ Custom domains
- ✅ Free SSL certificates
- ✅ DDoS protection
- ✅ Global CDN

## 🔧 Configuration Changes Made

1. **Removed `output: 'export'`** from `next.config.js`
   - Your app now supports full Next.js features (SSR, API routes, etc.)

2. **Updated `cloudflare.json`**
   - Configured for Next.js SSR deployment
   - Added Node.js compatibility flags

## 🎯 Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Go to your Pages project → Custom domains
   - Add your domain and update DNS records

2. **Environment Variables**
   - Set production environment variables in Cloudflare dashboard
   - Workers & Pages → Your project → Settings → Environment variables

3. **Monitor Usage**
   - Check analytics in Cloudflare dashboard
   - You'll see requests, bandwidth, and build usage

## ⚠️ Important Notes

- **No static export**: Your app is now a full-stack Next.js application
- **Server components work**: You can use React Server Components
- **API routes work**: `/pages/api/*` routes are fully supported
- **Image optimization**: Next.js Image component works with Cloudflare
- **No billing surprises**: Service pauses at limits, never charges

## 🆘 Troubleshooting

If deployment fails:
1. Check build logs in Cloudflare dashboard
2. Ensure `NODE_VERSION` environment variable is set to 18+
3. Verify `package.json` has all dependencies
4. Check that build command succeeds locally: `npm run build`

## 📚 Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Pricing Details](https://developers.cloudflare.com/pages/platform/limits/)