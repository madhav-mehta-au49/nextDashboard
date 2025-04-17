<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

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
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'User registered successfully',
            'data'    => $user
        ], 201);
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

        // Authenticate user (sanctum handles session cookie)
        auth()->login($user);

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
}
