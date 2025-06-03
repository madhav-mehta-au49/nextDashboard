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
        return match($role) {
            'employer' => '/companies/create',
            'candidate' => '/user/candidate/create',
            'hr' => '/user/dashboard',
            default => '/dashboard'
        };
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
        $allowedProviders = ['google', 'linkedin'];
        
        if (!in_array($provider, $allowedProviders)) {
            return response()->json(['error' => 'Provider not supported'], 400);
        }

        // Store role in session for later use
        if ($request->has('role')) {
            session(['oauth_role' => $request->get('role')]);
        }

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle OAuth provider callback
     */
    public function handleProviderCallback(Request $request, $provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();
            
            // Get role from session or default to candidate
            $role = session('oauth_role', 'candidate');
            session()->forget('oauth_role');

            // Check if user already exists
            $user = User::where('email', $socialUser->getEmail())->first();

            if ($user) {
                // User exists, log them in
                auth()->login($user, true);
            } else {
                // Create new user
                $user = User::create([
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                    'role' => $role,
                    'email_verified_at' => now(),
                    'password' => Hash::make(Str::random(24)), // Random password for OAuth users
                    $provider . '_id' => $socialUser->getId(),
                ]);

                auth()->login($user, true);
            }

            // Redirect based on role
            $redirectUrl = $this->getRedirectUrlForRole($user->role);
            return redirect()->to(config('app.frontend_url') . $redirectUrl);

        } catch (\Exception $e) {
            return redirect()->to(config('app.frontend_url') . '/login?error=oauth_failed');
        }
    }
}
