<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;

class ProductController extends Controller
{
    // This method will return all products
    public function index()
    {
        return response()->json(['message' => 'All products list']);
    }

    // This method will store a new product
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'             => 'required',
            'price'             => 'required|numeric',
            'compare_price'     => 'nullable|numeric',
            'category_id'       => 'required|integer',
            'status'            => 'required|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Store the product
        $product = new Product();
        $product->title             = $request->title;
        $product->price             = $request->price;
        $product->compare_price     = $request->compare_price;
        $product->category_id       = $request->category_id;
        $product->brand_id          = $request->brand_id;
        $product->sku               = $request->sku;
        $product->description       = $request->description;
        $product->short_description = $request->short_description;
        $product->status            = $request->status;
        $product->save();

        return response()->json([
            'status'  => true,
            'message' => 'Product created successfully',
            'product' => $product
        ]);
    }

    // This method will return a single product
    public function show($id)
    {
        return response()->json([
            'message' => "Single product with ID: $id"
        ]);
    }

    // This method will update a product
    public function update(Request $request, $id)
    {
        return response()->json([
            'message' => "Product updated with ID: $id"
        ]);
    }

    // This method will delete a product
    public function destroy($id)
    {
        return response()->json([
            'message' => "Product deleted with ID: $id"
        ]);
    }
}
