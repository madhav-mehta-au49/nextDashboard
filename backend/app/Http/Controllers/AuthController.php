<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|confirmed|min:8',
            'role'     => 'required|string|in:candidate,employer,hr',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role'     => $validated['role'],
        ]);

        // Automatically login the user after registration with persistent session
        auth()->login($user, true); // Remember the user (24-hour persistent session)

        return response()->json([
            'status'  => 'success',
            'message' => 'User registered successfully',
            'data'    => [
                'user' => $user,
                'role' => $user->role,
                'redirect_url' => $this->getRedirectUrlForRole($user->role)
            ]
        ], 201);
    }

    /**
     * Get redirect URL based on user role
     */
    private function getRedirectUrlForRole(string $role): string
    {
        // Redirect to auth callback page so frontend can handle authentication state
        return '/auth/callback';
    }

    /**
     * Login the user and issue a Sanctum token (using cookie).
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.']
            ]);
        }

        // Authenticate user with persistent session (24-hour)
        auth()->login($user, true);

        return response()->json([
            'status'  => 'success',
            'message' => 'Login successful',
            'data'    => $user
        ]);
    }

    /**
     * Get the currently authenticated user.
     */
    public function user(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'user'   => $request->user()
        ]);
    }

    /**
     * Logout the user (invalidate cookie).
     */
    public function logout(Request $request)
    {
        auth()->guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'status'  => 'success',
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Redirect to OAuth provider
     */
    public function redirectToProvider(Request $request, $provider)
    {
        \Log::info("OAuth redirect initiated for provider: {$provider}");
        \Log::info("Request data: " . json_encode($request->all()));
        
        $allowedProviders = ['google', 'linkedin'];
        
        if (!in_array($provider, $allowedProviders)) {
            \Log::warning("Unsupported OAuth provider: {$provider}");
            return response()->json(['error' => 'Provider not supported'], 400);
        }

        // Store role in session for later use
        if ($request->has('role')) {
            $role = $request->get('role');
            \Log::info("Storing role in session: {$role}");
            session(['oauth_role' => $role]);
            \Log::info("Session after storing role: " . json_encode(session()->all()));
        } else {
            \Log::info("No role provided in request, defaulting to 'candidate'");
        }

        \Log::info("Redirecting to {$provider} OAuth");
        
        // Store role in state parameter and encrypt it
        $state = [
            'role' => $request->get('role', 'candidate'),
            'nonce' => bin2hex(random_bytes(16))  // Add a nonce for security
        ];
        $encodedState = base64_encode(json_encode($state));
        
        // Store in cache instead of session
        \Cache::put('oauth_state_' . $state['nonce'], $encodedState, now()->addMinutes(5));
        
        \Log::info("OAuth state stored in cache: " . json_encode([
            'state' => $state,
            'encoded' => $encodedState
        ]));
        
        return Socialite::driver($provider)
            ->with(['state' => $encodedState])
            ->redirect();
    }

    /**
     * Handle OAuth provider callback
     */
    public function handleProviderCallback(Request $request, $provider)
    {
        try {
            \Log::info("OAuth callback started for provider: {$provider}");
            \Log::info("Session data: " . json_encode(session()->all()));
            \Log::info("Request data: " . json_encode($request->all()));
            
            if ($request->has('error')) {
                \Log::error("OAuth provider returned error: " . $request->get('error'));
                return redirect()->to(config('app.frontend_url') . '/login?error=oauth_provider_error');
            }
            
            // Configure HTTP client with SSL bypass for development
            $httpClientConfig = [
                'verify' => env('CURL_VERIFY_SSL', config('app.env') !== 'local'),
                'timeout' => 30,
                'connect_timeout' => 10
            ];
            
            // Only add SSL bypass options if SSL verification is disabled
            if (!$httpClientConfig['verify']) {
                \Log::info("Configuring SSL bypass for development environment");
                $httpClientConfig['curl'] = [
                    CURLOPT_SSL_VERIFYPEER => false,
                    CURLOPT_SSL_VERIFYHOST => false,
                ];
            }
            
            // Create Guzzle HTTP client and configure Socialite
            $httpClient = new \GuzzleHttp\Client($httpClientConfig);
            $socialiteDriver = Socialite::driver($provider)->setHttpClient($httpClient);
            
            try {
                \Log::info("Attempting to retrieve user from OAuth provider");
                
                // First get the access token
                $token = $socialiteDriver->getAccessTokenResponse($request->get('code'));
                \Log::info("Got access token response: " . json_encode($token));
                
                // Then get the user info using the token
                $socialUser = $socialiteDriver->userFromToken($token['access_token']);
                
                \Log::info("Retrieved social user: " . json_encode([
                    'id' => $socialUser->getId(),
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                    'avatar' => $socialUser->getAvatar()
                ]));
            } catch (\Exception $e) {
                \Log::error("Failed to retrieve user from OAuth provider: " . $e->getMessage());
                \Log::error("Exception trace: " . $e->getTraceAsString());
                return redirect()->to(config('app.frontend_url') . '/login?error=' . urlencode($e->getMessage()));
            }
            
            // Validate state parameter
            $receivedState = $request->get('state');
            if (!$receivedState) {
                \Log::error("No state received from OAuth provider");
                return redirect()->to(config('app.frontend_url') . '/login?error=missing_state');
            }
            
            // Decode the received state
            try {
                $stateData = json_decode(base64_decode($receivedState), true);
                if (!isset($stateData['nonce'])) {
                    throw new \Exception("No nonce in state");
                }
                
                // Get stored state from cache
                $storedState = \Cache::get('oauth_state_' . $stateData['nonce']);
                \Cache::forget('oauth_state_' . $stateData['nonce']); // Clear used state
                
                \Log::info("OAuth state validation:", [
                    'received' => $receivedState,
                    'stored' => $storedState,
                    'nonce' => $stateData['nonce']
                ]);
                
                if (!$storedState || $receivedState !== $storedState) {
                    throw new \Exception("State mismatch");
                }
            } catch (\Exception $e) {
                \Log::error("OAuth state validation failed: " . $e->getMessage());
                return redirect()->to(config('app.frontend_url') . '/login?error=invalid_state');
            }
            
            // Get role from validated state
            $role = $stateData['role'] ?? 'candidate';
            \Log::info("User role from state: {$role}");
            
            // Store role in session for later use
            session(['user_role' => $role]);

            // Check if user already exists
            $user = User::where('email', $socialUser->getEmail())->first();
            \Log::info("User exists: " . ($user ? 'true' : 'false'));

            if ($user) {
                // User exists, log them in
                \Log::info("Logging in existing user with ID: {$user->id}");
                auth()->login($user, true);
                \Log::info("User authenticated: " . (auth()->check() ? 'true' : 'false'));
            } else {
                // Create new user
                \Log::info("Creating new user with email: {$socialUser->getEmail()}");
                $userData = [
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                    'role' => $role,
                    'email_verified_at' => now(),
                    'password' => Hash::make(Str::random(24)), // Random password for OAuth users
                    $provider . '_id' => $socialUser->getId(),
                ];
                \Log::info("User data for creation: " . json_encode($userData));
                
                $user = User::create($userData);
                \Log::info("New user created with ID: {$user->id}");

                auth()->login($user, true);
                \Log::info("New user authenticated: " . (auth()->check() ? 'true' : 'false'));
            }

            // Set additional cookies for frontend compatibility
            $response = redirect()->to(config('app.frontend_url') . '/auth/callback');
            
            // Set unencrypted cookies that the frontend can read (using plain cookie() helper)
            // These cookies are NOT encrypted and can be read by JavaScript
            $response->headers->setCookie(new \Symfony\Component\HttpFoundation\Cookie(
                'auth_user_role', $user->role, time() + 7200, '/', null, false, false
            ));
            $response->headers->setCookie(new \Symfony\Component\HttpFoundation\Cookie(
                'auth_user_name', urlencode($user->name), time() + 7200, '/', null, false, false
            ));
            $response->headers->setCookie(new \Symfony\Component\HttpFoundation\Cookie(
                'auth_user_email', $user->email, time() + 7200, '/', null, false, false
            ));
            $response->headers->setCookie(new \Symfony\Component\HttpFoundation\Cookie(
                'auth_status', 'authenticated', time() + 7200, '/', null, false, false
            ));
            
            \Log::info("OAuth redirect with unencrypted cookies set for user: {$user->name}, role: {$user->role}");
            
            return $response;

        } catch (\Exception $e) {
            \Log::error("OAuth failed: " . $e->getMessage());
            \Log::error("Exception trace: " . $e->getTraceAsString());
            return redirect()->to(config('app.frontend_url') . '/login?error=oauth_failed');
        }
    }
}
