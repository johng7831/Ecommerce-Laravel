<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{
    // ======================
    // User Registration
    // ======================
    public function register(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $user = new User;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->role = 'customer';
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'Registration successful',
            'data' => $user
        ], 200);
    }

    // ======================
    // User Login
    // ======================
    public function authenticate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        // Check user credentials
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {

            $user = User::find(Auth::user()->id);

            // Create Sanctum token
            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'message' => 'Login successful',
                'token' => $token,
                'id' => $user->id,
                'name' => $user->name,
            ], 200);
        }

        return response()->json([
            'status' => 401,
            'message' => 'Invalid email or password',
        ], 401);
    }

    // ======================
    // Get All User Orders
    // ======================
    public function getOrders()
    {
        $user = auth()->user();
        
        if (!$user) {
            return response()->json([
                'status' => 401,
                'message' => 'Unauthorized',
            ], 401);
        }

        $orders = Order::where('user_id', $user->id)
            ->with('orderItems')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $orders,
        ], 200);
    }

    // ======================
    // Get Order Details
    // ======================
    public function getOrdersdetail($id)
    {
        $user = auth()->user();
        
        if (!$user) {
            return response()->json([
                'status' => 401,
                'message' => 'Unauthorized',
            ], 401);
        }

        $order = Order::where('user_id', $user->id)
            ->where('id', $id)
            ->with('orderItems')
            ->first();

        if (!$order) {
            return response()->json([
                'status' => 404,
                'message' => 'Order not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'order' => $order,
        ], 200);
    }
}
