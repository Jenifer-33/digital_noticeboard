# Debug Changes Made - TO REVERT AFTER FIXING

## Files Created (DELETE THESE):

- `app/api/debug/route.ts`
- `app/api/simple-test/route.ts`
- `app/api/vercel-debug/route.ts`
- `app/api/test-headlines/route.ts`
- `app/api/test-public-headlines/route.ts`
- `app/api/test-rls/route.ts`
- `app/api/test-schema/route.ts`
- `app/api/headlines/test/route.ts`
- `DEPLOYMENT_TROUBLESHOOTING.md`
- `HEADLINES_API_FIX.md`
- `DEBUG_CHANGES_TO_REVERT.md` (this file)

## Files Modified (REVERT THESE):

### 1. `lib/supabase-server.ts`

**BEFORE:**

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

**AFTER (CURRENT):**

```typescript
import { createClient } from "@supabase/supabase-js";

// Add error handling for missing environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!supabaseServiceKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
```

### 2. `lib/supabase-client.ts`

**BEFORE:**

```typescript
import { createBrowserClient } from "@supabase/ssr";

// Singleton pattern to prevent multiple instances
let supabaseClientInstance: ReturnType<typeof createBrowserClient> | null =
  null;

export const supabaseClient = (() => {
  if (typeof window === "undefined") {
    // Server-side: return a new instance
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  if (!supabaseClientInstance) {
    supabaseClientInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseClientInstance;
})();
```

**AFTER (CURRENT):**

```typescript
import { createBrowserClient } from "@supabase/ssr";

// Add error handling for missing environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
}

// Singleton pattern to prevent multiple instances
let supabaseClientInstance: ReturnType<typeof createBrowserClient> | null =
  null;

export const supabaseClient = (() => {
  if (typeof window === "undefined") {
    // Server-side: return a new instance
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  if (!supabaseClientInstance) {
    supabaseClientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClientInstance;
})();
```

### 3. `app/api/headlines/public/route.ts`

**BEFORE:**

```typescript
if (error) {
  return NextResponse.json(
    { error: "Failed to fetch headlines" },
    { status: 500 }
  );
}
```

**AFTER (CURRENT):**

```typescript
if (error) {
  console.error("Public headlines API error:", error);
  return NextResponse.json(
    {
      error: "Failed to fetch headlines",
      details: error.message,
      code: error.code,
      hint: error.hint,
    },
    { status: 500 }
  );
}
```

### 4. `app/api/admin/check-first/route.ts`

**BEFORE:**

```typescript
if (error) {
  return NextResponse.json(
    { error: "Failed to check admin status" },
    { status: 500 }
  );
}
```

**AFTER (CURRENT):**

```typescript
if (error) {
  console.error("Admin check API error:", error);
  return NextResponse.json(
    {
      error: "Failed to check admin status",
      details: error.message,
      code: error.code,
      hint: error.hint,
    },
    { status: 500 }
  );
}
```

## REVERT COMMANDS:

### Delete Debug Files:

```bash
rm app/api/debug/route.ts
rm app/api/simple-test/route.ts
rm app/api/vercel-debug/route.ts
rm app/api/test-headlines/route.ts
rm app/api/test-public-headlines/route.ts
rm app/api/test-rls/route.ts
rm app/api/test-schema/route.ts
rm app/api/headlines/test/route.ts
rm DEPLOYMENT_TROUBLESHOOTING.md
rm HEADLINES_API_FIX.md
rm DEBUG_CHANGES_TO_REVERT.md
```

### Revert Modified Files:

```bash
# Revert supabase-server.ts to original
git checkout HEAD -- lib/supabase-server.ts

# Revert supabase-client.ts to original
git checkout HEAD -- lib/supabase-client.ts

# Revert API routes to original
git checkout HEAD -- app/api/headlines/public/route.ts
git checkout HEAD -- app/api/admin/check-first/route.ts
```

## SUMMARY:

- **9 debug files created** (DELETE)
- **4 files modified** (REVERT)
- **3 documentation files created** (DELETE)

All changes were made for debugging purposes and should be reverted after fixing the main issue.
