<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    /**
     * Get all orders with user and order items
     */
    public function index()
    {
        $orders = Order::with(['user', 'orderItems'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $orders
        ], 200);
    }

    /**
     * Get order details by ID
     */
    public function show($id)
    {
        $order = Order::with(['user', 'orderItems'])
            ->find($id);

        if (!$order) {
            return response()->json([
                'status' => 404,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $order
        ], 200);
    }
}

