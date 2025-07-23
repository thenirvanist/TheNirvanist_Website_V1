# The Nirvanist - Spiritual Tourism Platform

## Overview

The Nirvanist is a full-stack spiritual tourism platform that connects seekers with transformative spiritual journeys, sage wisdom, ashram retreats, and global meetups. The application facilitates spiritual growth through curated experiences in sacred destinations worldwide.

## Recent Changes (July 23, 2025)
✓ Updated brand assets with new logo variations (color, white, black)
✓ Implemented hero video autoplay with Heritage Film India footage
✓ Added transparency effects to navigation and partner strip
✓ Created interactive "About Us" section with word-by-word animation (sparklin.com style)
✓ Built dynamic spiritual collage section with hover animations
✓ Fixed meetup button placement to bottom of image
✓ Integrated OpenAI API key for future chatbot functionality
✓ Added PostgreSQL database with Drizzle ORM integration
✓ Migrated from in-memory storage to persistent database storage
✓ Seeded database with initial spiritual journeys, sages, and ashram data
✓ Increased logo size by 15% in navigation bar
✓ Changed navigation "Journeys" text to "Sacred Journeys"
✓ Updated interactive text section background from black to white
✓ Reverted collage section back to static image grid with hover effects
✓ Implemented alternating background pattern: white and #F7F2E8 sections
✓ Enhanced Sacred Journey cards with proper carousel functionality and navigation arrows
✓ Expanded database with 6 spiritual journeys, 5 sages, and 5 ashrams
✓ Redesigned Sages and Ashrams sections with 5-image carousels and improved visual design
✓ Fixed loading issues and added proper error handling throughout components
✓ Resolved homepage data loading issues with improved conditional rendering logic
✓ Standardized Sacred Journey cards with fixed CTA button positioning using flexbox layout
✓ Added full-width hero images to all main service pages (Sacred Journeys, Meetups, Ashrams)
✓ Complete overhaul of Sacred Journeys page with new structure:
  - Hero section with full-width background image
  - Fast-moving TourCarousel with clickable journey cards
  - "Why Do You Need One?" section with 3-column benefits
  - "How Are We Different" sections (Pricing First, Tech First, Partnership First) with alternating image/text layout
  - Fast-moving testimonial carousel with 15+ testimonials and auto-rotation
✓ Created individual journey detail pages with Overview/Description/Itinerary tabs
✓ Added testimonials database table with comprehensive seed data
✓ Enhanced journey schema with fullDescription, heroImage, and overview fields
✓ Implemented clickable journey cards linking to individual detail pages
✓ Built testimonial carousel with auto-play, navigation arrows, and featured testimonials
✓ Complete redesign of Sages main page with advanced functionality:
  - Grid layout displaying 3-4 sage cards per row (responsive: 2/3/4 columns)
  - Card content: Image, Location, Core Teachings, Notable Work, "Read Full Biography" CTA
  - Search bar for filtering sages by name, teachings, or books
  - Filter buttons: All, Living Sages, Modern Sages, Ancient Sages, Hindu, Buddhist, Sufi, Jain
  - Real-time dynamic filtering without page reload
  - Individual sage biography pages with detailed information
✓ Enhanced sages database with new fields: location, category, era, status
✓ Seeded database with 9 comprehensive sage profiles across traditions
✓ Created individual sage detail pages with full biography and teachings
✓ Complete redesign of Ashrams main page with advanced functionality:
  - Grid layout displaying 3-4 ashram cards per row (responsive: 2/3/4 columns)
  - Card content: Image, Location, Focus, Founders, Key Facilities, "Read More" CTA
  - Search bar for filtering ashrams by name, location, or focus
  - Filter buttons: All, North India, South India, West India, East India, Central India
  - Real-time dynamic filtering without page reload
  - Individual ashram detail pages with comprehensive information
✓ Enhanced ashrams database with new fields: region, focus, founders
✓ Seeded database with 10 comprehensive ashram profiles across India
✓ Created individual ashram detail pages with full descriptions and contact information

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **UI Framework**: Radix UI primitives with custom styling
- **Build Tool**: Vite for fast development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript throughout the application
- **API Design**: RESTful API with clear endpoint structure
- **File Structure**: Modular organization with separate concerns
- **Storage**: PostgreSQL database with Drizzle ORM for type-safe operations

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon serverless driver for PostgreSQL

## Key Components

### Core Entities
1. **Journeys**: Sacred retreats and spiritual experiences with pricing, locations, and itineraries
2. **Sages**: Spiritual teachers and masters with biographies, teachings, and books
3. **Ashrams**: Sacred spaces and retreat centers with facilities and contact information
4. **Meetups**: Global spiritual gatherings with online satsangs and community features
5. **Users**: User management and authentication system
6. **Blog Posts**: Spiritual content and insights
7. **Testimonials**: User experiences and feedback
8. **Contact Messages**: Customer inquiry management
9. **Newsletter**: Subscription system for spiritual insights

### Frontend Components
- **Navigation**: Fixed header with responsive design and brand integration
- **Hero Section**: Video background with call-to-action
- **Interactive Sections**: Scroll-triggered animations and carousels
- **Chatbot**: AI-powered spiritual guidance using OpenAI integration
- **Forms**: Contact, registration, and newsletter subscription forms
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Backend Services
- **Storage Layer**: Abstracted database operations with interface pattern
- **Route Handlers**: RESTful endpoints for all entities
- **OpenAI Integration**: Spiritual chatbot with contextual responses
- **Error Handling**: Centralized error management
- **Validation**: Zod schema validation for data integrity

## Data Flow

### Client-Server Communication
1. Frontend makes API requests using TanStack Query
2. Express routes handle requests with validation
3. Storage layer interfaces with Drizzle ORM
4. PostgreSQL database stores and retrieves data
5. Responses flow back through the same chain

### Real-time Features
- Chatbot interactions with OpenAI API
- Form submissions with immediate feedback
- Toast notifications for user actions

### State Management
- Server state managed by TanStack Query with caching
- Local state managed by React hooks
- Form state handled by React Hook Form with Zod validation

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **AI Service**: OpenAI API for chatbot functionality
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS framework
- **Fonts**: Google Fonts (Inter family)
- **Icons**: Lucide React icon library

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Full type safety across stack
- **ESBuild**: Server bundling for production
- **PostCSS**: CSS processing with Tailwind

### Third-party Integrations
- **Replit**: Development environment integration
- **Cartographer**: Replit-specific development tools
- **Connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- TSX for server development with hot reload
- Replit-specific plugins for cloud development

### Production Build
- Vite builds optimized frontend bundle
- ESBuild bundles server code for Node.js
- Static assets served from Express
- Database migrations handled via Drizzle Kit

### Environment Configuration
- Database URL from environment variables
- OpenAI API key configuration
- Production vs development environment detection
- Graceful fallbacks for missing configurations

### File Structure
```
/client           - React frontend application
/server           - Express backend services  
/shared           - Common types and schemas
/migrations       - Database migration files
/dist             - Production build output
```

The application follows a monorepo structure with clear separation between frontend, backend, and shared code, enabling efficient development and deployment workflows.