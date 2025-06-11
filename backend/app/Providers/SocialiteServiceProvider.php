<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Socialite\SocialiteServiceProvider as BaseSocialiteServiceProvider;
use Laravel\Socialite\Contracts\Factory;
use GuzzleHttp\Client as HttpClient;

class SocialiteServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(Factory::class, function ($app) {
            return new \Laravel\Socialite\SocialiteManager($app);
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Configure HTTP client with SSL bypass for development
        if (config('app.env') === 'local') {
            $this->app->extend('Laravel\Socialite\Contracts\Factory', function ($socialite, $app) {
                // Configure Guzzle HTTP client with SSL bypass
                $httpClientConfig = [
                    'verify' => false,
                    'curl' => [
                        CURLOPT_SSL_VERIFYPEER => false,
                        CURLOPT_SSL_VERIFYHOST => false,
                        CURLOPT_CAINFO => '',
                        CURLOPT_CAPATH => '',
                    ],
                    'timeout' => 30,
                    'connect_timeout' => 10,
                ];

                $httpClient = new HttpClient($httpClientConfig);

                // Override the default HTTP client for all drivers
                $socialite->extend('google', function ($app) use ($httpClient) {
                    $config = $app['config']['services.google'];
                    $driver = new \Laravel\Socialite\Two\GoogleProvider(
                        $app['request'],
                        $config['client_id'],
                        $config['client_secret'],
                        $config['redirect']
                    );
                    $driver->setHttpClient($httpClient);
                    return $driver;
                });

                return $socialite;
            });
        }
    }
}