# 🚀 GitHub + Netlify Deployment Guide

## Step 1: Initialize Git Repository

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: The Nirvanist spiritual tourism platform"
```

## Step 2: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "New repository" 
3. Name it: `nirvanist-spiritual-platform` (or your preferred name)
4. Keep it **Public** or **Private** (your choice)
5. **Do NOT** initialize with README (we already have one)
6. Click "Create repository"

## Step 3: Connect Local Code to GitHub

```bash
# Add GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/nirvanist-spiritual-platform.git

# Push code to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Netlify

1. Go to [Netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Select your repository: `nirvanist-spiritual-platform`
5. Configure build settings:
   - **Build command**: `npm run build && node scripts/build-functions.js`
   - **Publish directory**: `dist/public`
   - **Functions directory**: `netlify/functions`
6. Click "Deploy site"

## Step 5: Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables, add:

```
DATABASE_URL=your_postgresql_database_url
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_secure_random_string_here
NODE_ENV=production
```

### Getting a PostgreSQL Database:

**Option 1: Neon (Recommended)**
1. Go to [Neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy connection string

**Option 2: Supabase**
1. Go to [Supabase.com](https://supabase.com)
2. Create project
3. Go to Settings → Database
4. Copy connection string

**Option 3: Railway**
1. Go to [Railway.app](https://railway.app)
2. Create PostgreSQL service
3. Copy connection string

## Step 6: Custom Domain (Optional)

1. In Netlify Dashboard → Domain Settings
2. Add your custom domain
3. Configure DNS records as shown
4. SSL certificate auto-generates

## 🎉 Your Site is Live!

- **Netlify URL**: `https://your-site-name.netlify.app`
- **Custom Domain**: `https://yourdomain.com` (if configured)

## 📱 Features Ready:

✅ User authentication system
✅ Spiritual journeys booking
✅ Sage wisdom profiles  
✅ Ashram directory
✅ Global meetups
✅ Newsletter subscription
✅ AI-powered chatbot
✅ Mobile responsive design

## 🔄 Future Updates:

To update your live site:

```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push origin main
```

Netlify automatically rebuilds and deploys when you push to GitHub!

---

**Need Help?**
- Netlify Support: [docs.netlify.com](https://docs.netlify.com)
- Database Issues: Check connection string format
- Build Errors: Check Netlify build logs