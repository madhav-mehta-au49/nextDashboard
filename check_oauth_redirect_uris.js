/**
 * This script helps you verify if your Google OAuth redirect URIs are properly configured.
 * Run this in the browser console or in a Node.js environment.
 */

// Google OAuth client ID from your project
const clientId = '455773941890-a1vdqn0rouq10c82sqn5d26e8j7mbr37.apps.googleusercontent.com';

// The redirect URIs that should be configured in Google Developer Console
const requiredRedirectUris = [
  'http://localhost:8000/auth/google/callback',  // Laravel backend callback
  'http://localhost:3000/api/auth/callback/google'  // Next.js frontend callback
];

console.log('=== Google OAuth Redirect URI Checker ===');
console.log('Please verify that the following redirect URIs are configured in the Google Developer Console:');
console.log('https://console.developers.google.com/apis/credentials');
console.log('\nClient ID:', clientId);
console.log('\nRequired Redirect URIs:');
requiredRedirectUris.forEach(uri => console.log('- ' + uri));

console.log('\nInstructions:');
console.log('1. Go to Google Developer Console');
console.log('2. Find your OAuth 2.0 Client ID');
console.log('3. Click "Edit" and verify the Authorized redirect URIs section includes both URIs above');
console.log('4. If any are missing, add them and click "Save"');
console.log('5. Wait a few minutes for changes to propagate before testing again');

console.log('\nNote: Missing or incorrect redirect URIs are the most common cause of OAuth errors!');
