-- =====================================================
-- NOTICE BOARD - COMPLETE DATABASE SCHEMA
-- =====================================================
-- This file contains the complete database schema for the Notice Board application
-- It combines all migrations into a single, easy-to-share SQL file
-- =====================================================
-- =====================================================
-- 1. CUSTOM TYPES
-- =====================================================
-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE headline_status AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED');
-- =====================================================
-- 2. TABLES
-- =====================================================
-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create headlines table
CREATE TABLE public.headlines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image_url TEXT,
  files JSONB DEFAULT '[]'::jsonb,
  status headline_status NOT NULL DEFAULT 'DRAFT',
  auto_publish_date TIMESTAMP WITH TIME ZONE,
  published_date TIMESTAMP WITH TIME ZONE,
  published_by UUID REFERENCES public.users(id),
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id) NOT NULL,
  modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  modified_by UUID REFERENCES public.users(id) NOT NULL
);
-- Create admin_invites table
CREATE TABLE public.admin_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE
);
-- =====================================================
-- 3. STORAGE BUCKETS
-- =====================================================
-- Create storage buckets
INSERT INTO storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
  )
VALUES (
    'covers',
    'covers',
    true,
    2097152,
    ARRAY ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'attachments',
    'attachments',
    true,
    2097152,
    ARRAY ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  );
-- =====================================================
-- 4. ROW LEVEL SECURITY
-- =====================================================
-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.headlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;
-- =====================================================
-- 5. HELPER FUNCTIONS
-- =====================================================
-- Create a function to check if current user is admin (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$ BEGIN RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()
      AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Create function to automatically create user record on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.users (id, email, role)
VALUES (NEW.id, NEW.email, 'user');
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- =====================================================
-- 6. RLS POLICIES
-- =====================================================
-- RLS Policies for users table
CREATE POLICY "Users can read their own profile" ON public.users FOR
SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all users" ON public.users FOR
SELECT USING (public.is_admin());
CREATE POLICY "Admins can update user roles" ON public.users FOR
UPDATE USING (public.is_admin());
-- RLS Policies for headlines table
CREATE POLICY "Published headlines are publicly readable" ON public.headlines FOR
SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can read all headlines" ON public.headlines FOR
SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert headlines" ON public.headlines FOR
INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update headlines" ON public.headlines FOR
UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete headlines" ON public.headlines FOR DELETE USING (public.is_admin());
-- RLS Policies for admin_invites table
CREATE POLICY "Admins can manage invites" ON public.admin_invites FOR ALL USING (public.is_admin());
-- =====================================================
-- 7. STORAGE POLICIES
-- =====================================================
-- Storage policies for covers bucket
CREATE POLICY "Covers are publicly readable" ON storage.objects FOR
SELECT USING (bucket_id = 'covers');
CREATE POLICY "Authenticated users can upload covers" ON storage.objects FOR
INSERT WITH CHECK (
    bucket_id = 'covers'
    AND auth.role() = 'authenticated'
  );
CREATE POLICY "Admins can update covers" ON storage.objects FOR
UPDATE USING (
    bucket_id = 'covers'
    AND public.is_admin()
  );
CREATE POLICY "Admins can delete covers" ON storage.objects FOR DELETE USING (
  bucket_id = 'covers'
  AND public.is_admin()
);
-- Storage policies for attachments bucket
CREATE POLICY "Attachments are publicly readable" ON storage.objects FOR
SELECT USING (bucket_id = 'attachments');
CREATE POLICY "Authenticated users can upload attachments" ON storage.objects FOR
INSERT WITH CHECK (
    bucket_id = 'attachments'
    AND auth.role() = 'authenticated'
  );
CREATE POLICY "Admins can update attachments" ON storage.objects FOR
UPDATE USING (
    bucket_id = 'attachments'
    AND public.is_admin()
  );
CREATE POLICY "Admins can delete attachments" ON storage.objects FOR DELETE USING (
  bucket_id = 'attachments'
  AND public.is_admin()
);
-- =====================================================
-- 8. INDEXES
-- =====================================================
-- Create indexes for better performance
CREATE INDEX idx_headlines_status ON public.headlines(status);
CREATE INDEX idx_headlines_published_date ON public.headlines(published_date DESC);
CREATE INDEX idx_headlines_created_date ON public.headlines(created_date DESC);
CREATE INDEX idx_admin_invites_token ON public.admin_invites(token);
CREATE INDEX idx_admin_invites_email ON public.admin_invites(email);
CREATE INDEX idx_users_role ON public.users(role);
-- =====================================================
-- 9. TRIGGERS
-- =====================================================
-- Create trigger to call the function
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================
-- This completes the Notice Board database schema setup
-- All tables, policies, functions, and triggers are now in place
-- =====================================================