<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use App\Models\Tempimages;
use App\Models\ProductImage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductController extends Controller
{
    // Return all products
    public function index()
    {
        $product = Product::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => 200,
            'data'   => $product
        ]);
    }

    // Store a new product
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'             => 'required',
            'price'             => 'required|numeric',
            'compare_price'     => 'nullable|numeric',
            'category'          => 'required|integer',
            'brand'             => 'required|integer',
            'sku'               => 'required|string|max:255|unique:products,sku',
            'qty'               => 'required|integer',
            'is_featured'       => 'required|in:yes,no',
            'status'            => 'required|in:0,1',
            'gallery'           => 'array',
            'gallery.*'         => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 200);
        }

        // Create product
        $product = new Product();
        $product->title             = $request->title;
        $product->price             = $request->price;
        $product->compare_price     = $request->compare_price;
        $product->category_id       = $request->category;
        $product->brand_id          = $request->brand;
        $product->sku               = $request->sku;
        $product->qty               = $request->qty;
        $product->description       = $request->description;
        $product->short_description = $request->short_description;
        $product->is_featured       = $request->is_featured;
        $product->status            = $request->status;
        $product->save();

        // ---------------------------
        // Save product images
        // ---------------------------
        if (!empty($request->gallery)) {

            foreach ($request->gallery as $tempImageId) {

                $tempImage = Tempimages::find($tempImageId);

                if ($tempImage) {

                    $originalPath  = public_path('upload/temp/' . $tempImage->name);
                    $thumbPathTemp = public_path('upload/temp/thumb_' . $tempImage->name);

                    $newImageName = time() . rand(1000, 9999) . '.jpg';

                    // Create product folder if not exists
                    $productFolder = public_path('upload/products/');
                    if (!file_exists($productFolder)) {
                        mkdir($productFolder, 0777, true);
                    }

                    // Move main image
                    rename($originalPath, $productFolder . $newImageName);

                    // Move thumbnail
                    rename($thumbPathTemp, $productFolder . 'thumb_' . $newImageName);

                    // Save in product_images table
                    $productImage = new ProductImage();
                    $productImage->product_id = $product->id;
                    $productImage->image = $newImageName;
                    $productImage->save();

                    // Delete temp image record
                    $tempImage->delete();
                }
            }
        }

        return response()->json([
            'status'  => true,
            'message' => 'Product created successfully',
            'product' => $product
        ]);
    }

    // Return a single product
    public function show($id)
    {
        $product = Product::with('images')->find($id);

        if (!$product) {
            return response()->json([
                'status'  => 404,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data'   => $product
        ]);
    }

    // Update a product
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => 404,
                'message' => 'Product not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title'             => 'required',
            'price'             => 'required|numeric',
            'compare_price'     => 'nullable|numeric',
            'category'          => 'required|integer',
            'brand'             => 'required|integer',
            'sku'               => 'required|string|max:255|unique:products,sku,' . $id,
            'qty'               => 'required|integer',
            'is_featured'       => 'required|in:yes,no',
            'status'            => 'required|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 200);
        }

        // Update product
        $product->title             = $request->title;
        $product->price             = $request->price;
        $product->compare_price     = $request->compare_price;
        $product->category_id       = $request->category;
        $product->brand_id          = $request->brand;
        $product->sku               = $request->sku;
        $product->qty               = $request->qty;
        $product->description       = $request->description;
        $product->short_description = $request->short_description;
        $product->is_featured       = $request->is_featured;
        $product->status            = $request->status;
        $product->save();

        return response()->json([
            'status'  => true,
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }

    // Delete a product
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => 404,
                'message' => 'Product not found'
            ], 404);
        }

        $product->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Product deleted successfully'
        ]);
    }
}
