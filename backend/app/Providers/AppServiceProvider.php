<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Configure SSL bypass for development environment
        if (config('app.env') === 'local') {
            // Set default curl options for all HTTP requests
            $default_opts = [
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_CAINFO => '',
                CURLOPT_CAPATH => '',
            ];
            
            // Apply to Guzzle HTTP client
            $this->app->when(\GuzzleHttp\Client::class)
                ->needs('$config')
                ->give([
                    'verify' => false,
                    'curl' => $default_opts,
                    'timeout' => 30,
                    'connect_timeout' => 10,
                ]);
        }
    }
}
