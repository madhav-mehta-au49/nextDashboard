<?php

return [
    'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),
    
    'debug' => env('APP_DEBUG', false),
    
    'name' => env('APP_NAME', 'JobLumin'),
    
    'social_login' => [
        'google' => [
            'client_id' => env('GOOGLE_CLIENT_ID'),
            'client_secret' => env('GOOGLE_CLIENT_SECRET'),
            'redirect' => env('GOOGLE_REDIRECT_URI', '/auth/google/callback'),
        ],
        'linkedin' => [
            'client_id' => env('LINKEDIN_CLIENT_ID'),
            'client_secret' => env('LINKEDIN_CLIENT_SECRET'),
            'redirect' => env('LINKEDIN_REDIRECT_URI', '/auth/linkedin/callback'),
        ],
    ],
];
