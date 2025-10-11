-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can read their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update user roles" ON public.users;
DROP POLICY IF EXISTS "Admins can read all headlines" ON public.headlines;
DROP POLICY IF EXISTS "Admins can insert headlines" ON public.headlines;
DROP POLICY IF EXISTS "Admins can update headlines" ON public.headlines;
DROP POLICY IF EXISTS "Admins can delete headlines" ON public.headlines;
DROP POLICY IF EXISTS "Admins can manage invites" ON public.admin_invites;

-- Create a function to check if current user is admin (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate policies using the function (avoids recursion)
CREATE POLICY "Users can read their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON public.users
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update user roles" ON public.users
    FOR UPDATE USING (public.is_admin());

-- Recreate headlines policies
CREATE POLICY "Admins can read all headlines" ON public.headlines
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert headlines" ON public.headlines
    FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update headlines" ON public.headlines
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete headlines" ON public.headlines
    FOR DELETE USING (public.is_admin());

-- Recreate admin invites policies
CREATE POLICY "Admins can manage invites" ON public.admin_invites
    FOR ALL USING (public.is_admin());
