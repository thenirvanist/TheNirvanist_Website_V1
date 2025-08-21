# The Nirvanist - Spiritual Tourism Platform

A sophisticated spiritual tourism platform that offers immersive, personalized, and technologically advanced spiritual travel experiences across diverse sacred landscapes.

## 🚀 Deployment Instructions

### GitHub + Netlify Deployment

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/nirvanist.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account and select the repository
   - Set build settings:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
     - **Functions directory:** `netlify/functions`

3. **Environment Variables:**
   Add these in Netlify Dashboard → Site Settings → Environment Variables:
   ```
   DATABASE_URL=your_postgresql_database_url
   OPENAI_API_KEY=your_openai_api_key
   JWT_SECRET=your_secure_random_string
   NODE_ENV=production
   ```

4. **Database Setup:**
   - Create a PostgreSQL database (recommended: Neon, Supabase, or Heroku Postgres)
   - Copy the connection string to `DATABASE_URL`
   - The database schema will be automatically created on first deploy

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, PostgreSQL
- **Database:** Drizzle ORM with PostgreSQL
- **Authentication:** JWT with bcrypt
- **Deployment:** Netlify with serverless functions
- **Email:** SendGrid integration (optional)
- **AI:** OpenAI API integration

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configs
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data access layer
│   └── auth.ts            # Authentication logic
├── shared/                 # Shared types and schemas
├── netlify/               # Netlify Functions
└── attached_assets/       # Static assets

```

## 🔧 Content Management

### Easy Image & Text Updates

**For Journey/Sage/Ashram content:**
- Edit `server/storage.ts` (lines 105+)
- Change image URLs and text directly in the data objects

**For Homepage content:**
- Hero section: `client/src/components/HeroSection.tsx`
- About section: `client/src/components/InteractiveAbout.tsx`
- Navigation: `client/src/components/Navigation.tsx`

**For new images:**
1. Upload to a service like Unsplash, Cloudinary, or your own hosting
2. Replace the `image:` URL in the appropriate data object
3. Changes are automatic after deployment

## 🔐 Features

- **User Authentication:** Registration, login, password reset
- **Email Verification:** For user accounts and newsletter
- **Spiritual Journeys:** Curated retreats with detailed itineraries
- **Sacred Wisdom:** Profiles of spiritual teachers and masters
- **Ashram Directory:** Sacred spaces and retreat centers
- **Global Meetups:** Community gatherings and events
- **AI Chatbot:** OpenAI-powered spiritual guidance
- **Newsletter:** Subscription system with verification
- **Responsive Design:** Mobile-first approach

## 📱 Pages

- **Homepage:** Hero video, journeys carousel, sages, ashrams
- **Sacred Journeys:** Browse and book spiritual retreats
- **Spiritual Sages:** Learn from masters and teachers
- **Sacred Ashrams:** Find retreat centers and sacred spaces
- **Global Meetups:** Join community gatherings
- **Authentication:** Login, register, password reset
- **Contact:** Get in touch form

## 🎨 Design System

- **Primary Green:** #70c92e
- **Dark Green:** #4f8638
- **Darker Green:** #253e1a
- **Light Background:** #F7F2E8
- **Typography:** Inter font family
- **Icons:** Lucide React
- **Components:** Radix UI + shadcn/ui

## 🔄 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Database operations
npm run db:push
```

## 📧 Contact

For support or questions about The Nirvanist platform:
- Email: hello@nirvanist.com
- Phone: +1 (555) 123-PEACE

---

*Made with ❤️ for seekers on their spiritual journey*