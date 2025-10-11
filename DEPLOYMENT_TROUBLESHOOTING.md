# Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. Environment Variables Not Working

**Problem**: APIs work locally but fail in Vercel
**Solution**: Check environment variables in Vercel dashboard

#### Steps to Fix:

1. Go to your Vercel project dashboard
2. Go to Settings → Environment Variables
3. Add these variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```
4. **Important**: Make sure to add them for "Production" environment
5. Redeploy your application

### 2. Test Your Environment Variables

Use these test endpoints to verify your setup:

#### Test Basic API:

```
GET https://your-app.vercel.app/api/test
```

This will show you which environment variables are set.

#### Test Database Connection:

```
GET https://your-app.vercel.app/api/test-db
```

This will test if your Supabase connection is working.

### 3. Common Environment Variable Issues

#### Issue: Variables not prefixed with NEXT*PUBLIC*

- **Problem**: Client-side code can't access environment variables
- **Solution**: Make sure client-side variables start with `NEXT_PUBLIC_`

#### Issue: Wrong Supabase URL format

- **Problem**: URL should be `https://your-project.supabase.co`
- **Solution**: Check your Supabase dashboard → Settings → API

#### Issue: Service Role Key vs Anon Key

- **Problem**: Using wrong key for server-side operations
- **Solution**:
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client-side
  - `SUPABASE_SERVICE_ROLE_KEY` for server-side API routes

### 4. Database Connection Issues

#### Check if your database is set up:

1. Go to your Supabase dashboard
2. Run the complete schema: `supabase/complete_schema.sql`
3. Verify tables exist in the Table Editor

#### Check RLS policies:

1. Go to Authentication → Policies
2. Make sure all policies are enabled
3. Test with a simple query in the SQL Editor

### 5. Vercel-Specific Issues

#### Issue: Build failures

- Check the Vercel build logs
- Look for TypeScript errors
- Ensure all dependencies are in `package.json`

#### Issue: Function timeouts

- Vercel has a 10-second timeout for API routes
- Check if your database queries are optimized
- Use indexes for better performance

### 6. Debugging Steps

#### Step 1: Check Environment Variables

```bash
# Test locally
curl http://localhost:3000/api/test

# Test in production
curl https://your-app.vercel.app/api/test
```

#### Step 2: Check Database Connection

```bash
# Test database connection
curl https://your-app.vercel.app/api/test-db
```

#### Step 3: Check Specific API Routes

```bash
# Test public headlines
curl https://your-app.vercel.app/api/headlines/public

# Test admin check
curl https://your-app.vercel.app/api/admin/check-first
```

### 7. Quick Fixes

#### If APIs return 500 errors:

1. Check Vercel function logs
2. Verify environment variables
3. Test database connection
4. Check RLS policies

#### If APIs return 404 errors:

1. Check if the route files exist
2. Verify the file structure
3. Check for typos in route names

#### If authentication fails:

1. Check Supabase auth settings
2. Verify RLS policies
3. Test with a simple user creation

### 8. Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Database schema deployed
- [ ] RLS policies enabled
- [ ] Storage buckets created
- [ ] CORS settings configured
- [ ] Domain settings correct

### 9. Getting Help

If you're still having issues:

1. Check the Vercel function logs
2. Check the Supabase logs
3. Test the endpoints manually
4. Compare local vs production behavior

### 10. Emergency Rollback

If nothing works:

1. Revert to a working commit
2. Redeploy from Vercel dashboard
3. Check if the issue persists
4. Gradually add changes back
