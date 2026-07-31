# Cache Fix Deployment Guide

## Problem
Your Next.js 14 project deployed on Vercel was not reflecting database changes due to aggressive caching at multiple levels.

## Solution Applied

### 1. API Route Cache Control Headers
Added cache control headers to all API routes to prevent caching:
- `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`
- `Pragma: no-cache`
- `Expires: 0`
- `Surrogate-Control: no-store`

### 2. Next.js Configuration Updates
- Added `experimental.serverComponentsExternalPackages: ['mongoose']`
- Configured for dynamic rendering

### 3. Frontend Cache-Busting
- Added timestamp parameters to all API calls
- Created axios interceptor for automatic cache-busting
- Updated fetch calls with cache-busting

### 4. Vercel Configuration
- Added `vercel.json` with cache control headers for all API routes
- Configured edge caching to be disabled

## Files Modified

### API Routes (Cache Headers Added)
- `app/api/jobs/get-jobs/route.js`
- `app/api/jobs/get-filtered-jobs/route.js`
- `app/api/user/candidate/get-candidates/route.js`
- `app/api/user/candidate/get-all-candidates/route.js`

### Configuration Files
- `next.config.js` - Added experimental settings
- `vercel.json` - Added cache control headers
- `lib/api.js` - Added cache-busting interceptor
- `utils/api-utils.js` - New utility for cache-busting

### Frontend Updates
- `app/context/JobContext.js` - Added cache-busting to fetch calls
- `lib/api.js` - Updated API calls with timestamps

## Deployment Steps

### 1. Commit and Push Changes
```bash
git add .
git commit -m "Fix: Add cache control headers and cache-busting to prevent stale data"
git push origin main
```

### 2. Deploy to Vercel
The changes will automatically deploy via Vercel's Git integration.

### 3. Clear Vercel Cache (If Needed)
If you still see cached data after deployment:

1. Go to your Vercel dashboard
2. Navigate to your project
3. Go to "Functions" tab
4. Click "Redeploy" on the latest deployment
5. Or use Vercel CLI: `vercel --prod --force`

### 4. Test the Fix
1. Make a change to your MongoDB database
2. Refresh your live website
3. The changes should now appear immediately

## Additional API Routes to Update

If you have other API routes that fetch data, add these cache control headers:

```javascript
const response = NextResponse.json(yourData);

// Add cache control headers
response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
response.headers.set('Pragma', 'no-cache');
response.headers.set('Expires', '0');
response.headers.set('Surrogate-Control', 'no-store');

return response;
```

## Browser Cache Clearing

If users still see cached data, they should:
1. Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Open in incognito/private mode

## Monitoring

After deployment, monitor:
1. API response times (should be slightly slower due to no caching)
2. Database load (may increase due to more frequent queries)
3. User experience (data should update immediately)

## Rollback Plan

If issues arise, you can:
1. Revert the changes in Git
2. Redeploy the previous version
3. Or selectively remove cache control headers from specific routes

## Performance Considerations

- **Pros**: Data is always fresh, no stale data issues
- **Cons**: Slightly higher database load, slower response times
- **Recommendation**: Monitor performance and consider selective caching for read-heavy endpoints

## Next Steps

1. Deploy the changes
2. Test with database modifications
3. Monitor performance
4. Consider implementing selective caching for non-critical data if needed
