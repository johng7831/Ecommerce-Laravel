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
    public function getProductById($id)
    {
        $product = Product::where('status', 1)
            ->with('images')
            ->find($id);
        if (!$product) {
            return response()->json([
                'status' => 404,
                'message' => 'Product not found'
            ], 404);
        }
        return response()->json([
            'status' => 200,
            'data' => $product,
        ], 200);
    }
    public function getProductByCategory($categoryId)
    {
        $products = Product::where('category_id', $categoryId)
            ->where('status', 1)
            ->with('images')
            ->get();
        return response()->json([
            'status' => 200,
            'data' => $products,
        ], 200);
    }
    public function getProductByBrand($brandId)
    {
        $products = Product::where('brand_id', $brandId)
            ->where('status', 1)
            ->with('images')
            ->get();
        return response()->json([
            'status' => 200,
            'data' => $products,
        ], 200);
    }

    public function getFilteredProducts(Request $request)
    {
        try {
            $query = Product::where('status', 1)->with('images');

            // Filter by category if provided and not 'all'
            if ($request->has('category_id') && $request->category_id != 'all' && $request->category_id != null) {
                $query->where('category_id', $request->category_id);
            }

            // Filter by brand if provided and not 'all'
            if ($request->has('brand_id') && $request->brand_id != 'all' && $request->brand_id != null) {
                $query->where('brand_id', $request->brand_id);
            }

            $products = $query->orderBy('created_at', 'DESC')->get();

            return response()->json([
                'status' => 200,
                'data' => $products,
                'count' => $products->count(),
                'filters' => [
                    'category_id' => $request->category_id ?? 'all',
                    'brand_id' => $request->brand_id ?? 'all'
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error fetching filtered products: ' . $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    public function getAllProducts()
    {
        $products = Product::where('status', 1)
            ->with('images')
            ->orderBy('created_at', 'DESC')
            ->get();
        
        return response()->json([
            'status' => 200,
            'data' => $products,
        ], 200);
    }
}