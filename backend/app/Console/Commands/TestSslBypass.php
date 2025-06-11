<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client;

class TestSslBypass extends Command
{
    protected $signature = 'test:ssl-bypass';
    protected $description = 'Test SSL bypass configuration for OAuth';

    public function handle()
    {
        $this->info('=== OAuth SSL Bypass Test ===');

        // Test 1: Environment variables
        $this->info("\n1. Environment Variables:");
        $this->line("APP_ENV: " . config('app.env'));
        $this->line("GOOGLE_CLIENT_ID: " . (config('services.google.client_id') ? 'Set (' . strlen(config('services.google.client_id')) . ' chars)' : 'Not set'));
        $this->line("GOOGLE_CLIENT_SECRET: " . (config('services.google.client_secret') ? 'Set (' . strlen(config('services.google.client_secret')) . ' chars)' : 'Not set'));
        $this->line("GOOGLE_REDIRECT_URI: " . config('services.google.redirect'));

        // Test 2: Test Guzzle HTTP client with SSL bypass
        $this->info("\n2. Testing Guzzle HTTP client with SSL bypass:");
        try {
            $client = new Client([
                'verify' => false,
                'timeout' => 10,
                'connect_timeout' => 5,
                'curl' => [
                    CURLOPT_SSL_VERIFYPEER => false,
                    CURLOPT_SSL_VERIFYHOST => false,
                ],
            ]);
            
            $response = $client->post('https://oauth2.googleapis.com/token', [
                'form_params' => [
                    'grant_type' => 'authorization_code',
                    'code' => 'invalid_test_code',
                    'client_id' => config('services.google.client_id'),
                    'client_secret' => config('services.google.client_secret'),
                    'redirect_uri' => config('services.google.redirect'),
                ]
            ]);
            
            $this->line("HTTP Code: " . $response->getStatusCode());
            $this->info("✅ SSL bypass working - Got successful HTTP response");
            
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            $this->line("HTTP Code: " . $e->getResponse()->getStatusCode());
            $this->line("Response: " . $e->getResponse()->getBody());
            if ($e->getResponse()->getStatusCode() == 400) {
                $this->info("✅ SSL bypass working - Got expected 400 error for invalid code");
            }
        } catch (\Exception $e) {
            $this->error("❌ Error: " . $e->getMessage());
            if (strpos($e->getMessage(), 'SSL') !== false || strpos($e->getMessage(), 'certificate') !== false) {
                $this->error("❌ SSL bypass NOT working");
            }
        }

        // Test 3: Test Socialite configuration
        $this->info("\n3. Testing Socialite Configuration:");
        try {
            $driver = \Laravel\Socialite\Facades\Socialite::driver('google');
            $this->info("✅ Socialite Google driver loaded successfully");
            
            // Try to get redirect URL (this doesn't make HTTP requests)
            $redirectUrl = $driver->redirect()->getTargetUrl();
            $this->line("Redirect URL: " . substr($redirectUrl, 0, 100) . "...");
            $this->info("✅ Socialite redirect URL generation working");
            
        } catch (\Exception $e) {
            $this->error("❌ Socialite error: " . $e->getMessage());
        }

        $this->info("\n=== Test Complete ===");
        return 0;
    }
}
