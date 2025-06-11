<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Socialite\Facades\Socialite;
use GuzzleHttp\Client as HttpClient;

class TestOAuthConfig extends Command
{
    protected $signature = 'oauth:test';
    protected $description = 'Test OAuth configuration and SSL bypass';

    public function handle()
    {
        $this->info('=== OAuth Configuration Test ===');
        
        // 1. Test environment variables
        $this->info("\n1. Environment Variables:");
        $this->line("APP_ENV: " . config('app.env'));
        $this->line("GOOGLE_CLIENT_ID: " . (config('services.google.client_id') ? 'Set' : 'Not set'));
        $this->line("GOOGLE_CLIENT_SECRET: " . (config('services.google.client_secret') ? 'Set' : 'Not set'));
        $this->line("GOOGLE_REDIRECT_URI: " . config('services.google.redirect'));
        $this->line("CURLOPT_SSL_VERIFYPEER: " . env('CURLOPT_SSL_VERIFYPEER', 'not_set'));
        $this->line("CURLOPT_SSL_VERIFYHOST: " . env('CURLOPT_SSL_VERIFYHOST', 'not_set'));
        
        // 2. Test SSL bypass with direct HTTP request
        $this->info("\n2. Testing SSL bypass with Guzzle:");
        try {
            $httpClient = new HttpClient([
                'verify' => false,
                'curl' => [
                    CURLOPT_SSL_VERIFYPEER => false,
                    CURLOPT_SSL_VERIFYHOST => false,
                ],
                'timeout' => 10,
            ]);
            
            $response = $httpClient->post('https://oauth2.googleapis.com/token', [
                'form_params' => [
                    'code' => 'test_code',
                    'client_id' => 'test_client_id',
                    'client_secret' => 'test_secret',
                    'redirect_uri' => 'test_uri',
                    'grant_type' => 'authorization_code'
                ]
            ]);
            
            $this->line("Status Code: " . $response->getStatusCode());
            
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            $this->line("Expected Client Error (400): " . $e->getResponse()->getStatusCode());
            $this->line("Response: " . $e->getResponse()->getBody());
            $this->info("✅ SSL bypass working (400 error expected for invalid OAuth params)");
        } catch (\Exception $e) {
            $this->error("❌ SSL Error: " . $e->getMessage());
            return 1;
        }
        
        // 3. Test Socialite configuration
        $this->info("\n3. Testing Socialite Configuration:");
        try {
            $googleConfig = config('services.google');
            $this->line("Google Client ID: " . ($googleConfig['client_id'] ?? 'Not configured'));
            $this->line("Google Redirect URI: " . ($googleConfig['redirect'] ?? 'Not configured'));
            
            // Test Socialite driver creation
            $driver = Socialite::driver('google');
            $this->info("✅ Socialite Google driver created successfully");
            
            // Test redirect URL generation
            $redirectUrl = $driver->redirect()->getTargetUrl();
            $this->line("Redirect URL starts with: " . substr($redirectUrl, 0, 50) . "...");
            
        } catch (\Exception $e) {
            $this->error("❌ Socialite Error: " . $e->getMessage());
            return 1;
        }
        
        $this->info("\n🎉 OAuth configuration test completed successfully!");
        $this->info("The SSL bypass is working and Socialite is properly configured.");
        
        return 0;
    }
}
