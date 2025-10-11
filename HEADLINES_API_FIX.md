# Headlines API Fix Guide

## Current Issue

- ✅ Login works (authentication is working)
- ❌ Fetching headlines fails with "Failed to fetch headlines"

## Root Cause Analysis

The issue is likely one of these:

### 1. Database Schema Not Deployed

**Most Likely Cause**: The database schema hasn't been deployed to your Supabase project.

**Solution**:

1. Go to your Supabase dashboard
2. Go to SQL Editor
3. Copy and paste the entire contents of `supabase/complete_schema.sql`
4. Click "Run"
5. Verify tables exist in Table Editor

### 2. Environment Variables Missing

**Check in Vercel Dashboard**:

1. Go to your Vercel project → Settings → Environment Variables
2. Verify these are set for **Production**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_BASE_URL=https://campus-board-pi.vercel.app
   ```

### 3. RLS Policies Blocking Access

**Check RLS Policies**:

1. Go to Supabase → Authentication → Policies
2. Make sure these policies exist and are enabled:
   - "Published headlines are publicly readable" on headlines table
   - "Admins can read all headlines" on headlines table

## Debug Steps

### Step 1: Test the Debug Endpoint

After deploying the fixes, test:

```
GET https://campus-board-pi.vercel.app/api/debug
```

This will show you exactly what's wrong.

### Step 2: Check Database Schema

1. Go to Supabase → Table Editor
2. Check if these tables exist:
   - `headlines`
   - `users`
   - `admin_invites`

### Step 3: Test Database Connection

1. Go to Supabase → SQL Editor
2. Run this query:
   ```sql
   SELECT * FROM headlines LIMIT 1;
   ```
3. If this fails, the schema isn't deployed

### Step 4: Check RLS Policies

1. Go to Supabase → Authentication → Policies
2. Look for policies on the `headlines` table
3. Make sure they're enabled

## Quick Fixes

### Fix 1: Deploy Database Schema

```sql
-- Run this in Supabase SQL Editor
-- Copy the entire contents of supabase/complete_schema.sql
```

### Fix 2: Check Environment Variables

Make sure these are set in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_BASE_URL`

### Fix 3: Test with Service Role

The API uses `supabaseAdmin` (service role) which should bypass RLS, so if it's still failing, it's likely a schema issue.

## Expected Results After Fix

### Working API Response:

```json
{
  "headlines": [],
  "nextCursor": null,
  "hasMore": false
}
```

### Error Response (if still failing):

```json
{
  "error": "Failed to fetch headlines",
  "details": "relation \"headlines\" does not exist",
  "code": "42P01",
  "hint": null
}
```

## Next Steps

1. **Deploy the fixes** (commit and push)
2. **Run the database schema** in Supabase
3. **Test the debug endpoint** to verify the fix
4. **Test the headlines API** again

## Common Error Messages and Solutions

### "relation \"headlines\" does not exist"

- **Cause**: Database schema not deployed
- **Solution**: Run `supabase/complete_schema.sql` in Supabase

### "permission denied for table headlines"

- **Cause**: RLS policies blocking access
- **Solution**: Check RLS policies in Supabase dashboard

### "Failed to fetch headlines"

- **Cause**: Generic database error
- **Solution**: Check the debug endpoint for specific error details

## Verification

After applying fixes, test these endpoints:

1. **Debug endpoint**: `GET /api/debug`
2. **Public headlines**: `GET /api/headlines/public`
3. **Admin check**: `GET /api/admin/check-first`

All should return proper JSON responses, not HTML 404 pages.
