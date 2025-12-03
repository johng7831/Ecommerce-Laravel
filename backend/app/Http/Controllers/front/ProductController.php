<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function latestProducts()
    {
        $products = Product::orderBy('created_at', 'DESC')
            ->where('status', 1)
            ->where('is_featured', 'no')
            ->with('images')
            ->limit(8)
            ->get();
        
        return response()->json([
            'status' => 200,
            'data' => $products,
        ], 200);
    }
    
    public function featuredProduct()
    {
        $products = Product::orderBy('created_at', 'DESC')
            ->where('status', 1)
            ->where('is_featured', 'yes')
            ->with('images')
            ->limit(8)
            ->get();
        
        return response()->json([
            'status' => 200,
            'data' => $products,
        ], 200);
    }
}