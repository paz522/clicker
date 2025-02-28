// Import analytics from the module
import { inject } from '@vercel/analytics';

// Initialize Vercel Analytics with mode set to auto
// This ensures it only runs in production
inject({
  mode: 'auto'
});

console.log('Vercel Analytics initialized'); 