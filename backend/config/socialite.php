<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Laravel Socialite Configuration
    |--------------------------------------------------------------------------
    |
    | This file is for storing the configuration of Laravel Socialite.
    | You may configure your drivers here.
    |
    */

    'guzzle' => [
        'verify' => env('CURLOPT_SSL_VERIFYPEER', true),
        'curl' => [
            CURLOPT_SSL_VERIFYPEER => env('CURLOPT_SSL_VERIFYPEER', true),
            CURLOPT_SSL_VERIFYHOST => env('CURLOPT_SSL_VERIFYHOST', 2),
        ],
    ],
];
