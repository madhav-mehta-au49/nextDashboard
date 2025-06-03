// This script updates the login page redirection to go to the home page
// rather than directly to the dashboard after login

const fs = require('fs');
const path = require('path');

const loginPagePath = path.join(process.cwd(), 'app', 'login', 'page.tsx');

// Read the current file
let content = fs.readFileSync(loginPagePath, 'utf8');

// Replace the redirect code
content = content.replace(
  /\/\/ Redirect based on user role[\s\S]*?const redirectUrl = data\.data\.role === 'employer' \? '\/companies\/dashboard' : '\/user\/dashboard';/,
  `// Redirect to home page instead of dashboard
          const redirectUrl = '/';`
);

// Update the console logs
content = content.replace(
  /console\.log\('Will redirect to:', redirectUrl\);/,
  `console.log('Will redirect to home page');`
);

content = content.replace(
  /console\.log\('Redirecting now to', redirectUrl\);/,
  `console.log('Redirecting now to home page');`
);

// Write the file back
fs.writeFileSync(loginPagePath, content, 'utf8');

console.log('Updated login page redirection to go to home page after login');
