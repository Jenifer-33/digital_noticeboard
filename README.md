# CampusBoard

A modern notice board application built with Next.js 14, Supabase, and TypeScript. Admins can manage headlines with cover images and attachments, while anonymous users can view published content in multiple formats and enjoy a fullscreen presentation mode.

## 🚀 Quick Start (5 minutes)

```bash
# 1. Clone and install
git clone https://github.com/your-username/notice-board.git
cd notice-board && npm install

# 2. Set up Supabase (create project at supabase.com)
# 3. Add your keys to .env.local
# 4. Run the complete schema in Supabase SQL Editor
# 5. Start the app
npm run dev
```

**That's it!** Visit [http://localhost:3000](http://localhost:3000) and go to `/admin-onboarding` to create your first admin account.

## Features

- 🔐 **Admin Authentication**: First admin onboarding and invite system
- 📝 **Headline Management**: Create, edit, and publish headlines with rich content
- 📎 **File Attachments**: Upload cover images and attachments (with size limits)
- 👥 **User Management**: Admin dashboard for user roles and invites
- 📱 **Multiple View Modes**: Table, Grid, and Card views for headlines
- 🎬 **Presentation Mode**: Fullscreen slideshow with auto-advance and controls
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🔒 **Row Level Security**: Secure data access with Supabase RLS

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **State Management**: Jotai
- **Styling**: Tailwind CSS + Radix UI
- **Forms**: React Hook Form + Zod
- **Animation**: Framer Motion
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account (free tier works fine)
- Git

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/your-username/notice-board.git
cd notice-board

# Install dependencies
npm install
```

### 2. Set up Supabase (5 minutes)

1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project
2. **Get API Keys**: In your Supabase dashboard:
   - Go to Settings → API
   - Copy your Project URL and anon key
   - Copy your Service Role key (from Service Role section)
3. **Enable Storage**: Go to Storage in your dashboard and enable it

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Create the environment file
touch .env.local
```

Add your Supabase credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Set up Database (One-click setup)

**Option A: Quick Setup (Recommended)**

1. Go to your Supabase dashboard → SQL Editor
2. Copy and paste the entire contents of `supabase/complete_schema.sql`
3. Click "Run" - this will create all tables, policies, and storage buckets automatically

**Option B: Manual Setup**

1. Go to Storage in your Supabase dashboard
2. Create these buckets:
   - **covers**: Public bucket for headline cover images
   - **attachments**: Public bucket for headline attachments
3. Run the SQL files in `supabase/migrations/` in order

### 5. Start the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### 6. Create Your First Admin

1. Go to [http://localhost:3000/admin-onboarding](http://localhost:3000/admin-onboarding)
2. Create your first admin account
3. Start managing headlines and inviting other admins!

## 🚀 **That's it!** Your notice board is ready to use.

## First Admin Setup

1. Visit `/admin-onboarding` to create the first admin account
2. Fill in your email and password
3. You'll be redirected to the admin dashboard
4. From there, you can invite other admins and manage headlines

## Database Schema

The complete database schema is available in `supabase/complete_schema.sql` - a single file containing all tables, policies, and configurations.

### Quick Schema Overview

**Users Table**

- `id` (UUID, FK to auth.users)
- `email` (TEXT)
- `role` (ENUM: 'admin' | 'user')
- `created_at` (TIMESTAMP)

**Headlines Table**

- `id` (UUID, PK)
- `title` (TEXT)
- `description` (TEXT)
- `cover_image_url` (TEXT, nullable)
- `files` (JSONB array of file objects)
- `status` (ENUM: 'DRAFT' | 'PUBLISHED' | 'CANCELLED')
- `auto_publish_date` (TIMESTAMP, nullable)
- `published_date` (TIMESTAMP, nullable)
- `published_by` (UUID, FK to users)
- `created_date` (TIMESTAMP)
- `created_by` (UUID, FK to users)
- `modified_date` (TIMESTAMP)
- `modified_by` (UUID, FK to users)

**Admin Invites Table**

- `id` (UUID, PK)
- `token` (UUID, unique)
- `email` (TEXT)
- `created_by` (UUID, FK to users)
- `created_at` (TIMESTAMP)
- `expires_at` (TIMESTAMP)
- `used` (BOOLEAN)
- `used_at` (TIMESTAMP, nullable)

### One-Click Database Setup

The `supabase/complete_schema.sql` file contains everything needed to set up the database:

- ✅ All tables and relationships
- ✅ Row Level Security (RLS) policies
- ✅ Storage buckets and policies
- ✅ Helper functions and triggers
- ✅ Performance indexes
- ✅ User auto-creation on signup

**To use it:**

1. Copy the entire contents of `supabase/complete_schema.sql`
2. Paste it into your Supabase SQL Editor
3. Click "Run" - that's it!

## API Endpoints

### Public Endpoints

- `GET /api/headlines/public` - Get published headlines (paginated)

### Admin Endpoints (require authentication)

- `GET /api/admin/check-first` - Check if any admins exist
- `POST /api/admin/setup` - Set user role to admin
- `POST /api/invite` - Create admin invite
- `GET /api/invite/validate` - Validate invite token
- `GET /api/users` - Get all users
- `PUT /api/users/[id]/role` - Update user role
- `DELETE /api/users/[id]` - Delete user
- `POST /api/headlines` - Create headline
- `PUT /api/headlines/[id]` - Update headline
- `DELETE /api/headlines/[id]` - Delete headline
- `GET /api/headlines/admin` - Get all headlines (admin view)

## File Upload Limits

- **Cover Images**: 2MB max, formats: JPG, PNG, WebP, GIF
- **Attachments**: 2MB per file, 10MB total per headline
- **Formats**: PDF, images, text files, Word documents

## Deployment

### Deploy to Vercel (Free)

1. **Fork this repository** to your GitHub account
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository
3. **Add Environment Variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL` (from your Supabase project)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from your Supabase project)
   - `SUPABASE_SERVICE_ROLE_KEY` (from your Supabase project)
   - `NEXT_PUBLIC_BASE_URL` (your Vercel domain - will be provided after deployment)
4. **Deploy!** - Vercel will automatically build and deploy your app

### Set up Production Database

After deployment, set up your production database:

1. **Run the complete schema**:

   - Go to your Supabase dashboard → SQL Editor
   - Copy and paste the entire contents of `supabase/complete_schema.sql`
   - Click "Run"

2. **Create your first admin**:
   - Visit `https://your-app.vercel.app/admin-onboarding`
   - Create your admin account
   - Start using your notice board!

### Alternative Deployment Options

- **Netlify**: Similar process to Vercel
- **Railway**: Great for full-stack apps
- **DigitalOcean App Platform**: More control over deployment

## Usage

### For Admins

1. **Create Headlines**: Go to Dashboard → Headlines → Add Headline
2. **Manage Users**: Go to Dashboard → Users to invite admins or manage roles
3. **Publish Content**: Change headline status to "Published" to make it visible publicly
4. **File Management**: Upload cover images and attachments with automatic validation

### For Public Users

1. **View Headlines**: Browse published headlines in table, grid, or card view
2. **Presentation Mode**: Click "Present" for fullscreen slideshow (10 seconds per slide)
3. **Navigation**: Use keyboard controls in presentation mode (arrows, space, escape)

## Keyboard Shortcuts (Presentation Mode)

- **Space**: Play/Pause
- **←**: Previous slide
- **→**: Next slide
- **Escape**: Exit presentation

## Development

### Project Structure

```
notice-board/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Admin dashboard pages
│   ├── admin-onboarding/  # First admin setup
│   └── present/           # Presentation mode
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
├── supabase/              # Database migrations
└── public/                # Static assets
```

### Key Technologies

- **Jotai**: Client state management
- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **Framer Motion**: Animations
- **Radix UI**: Accessible UI components
- **Tailwind CSS**: Styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:

1. Check the GitHub Issues
2. Review the documentation
3. Create a new issue with detailed information

## Roadmap

- [ ] Email notifications for admin invites
- [ ] Advanced search and filtering
- [ ] Headline categories and tags
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Content scheduling
- [ ] Export functionality
