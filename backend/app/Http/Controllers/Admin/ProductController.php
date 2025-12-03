<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use App\Models\Tempimages;
use App\Models\ProductImage;
use App\Models\ProductSize;

class ProductController extends Controller
{
    // Return all products
    public function index()
    {
        try {
            $products = Product::orderBy('created_at', 'DESC')->get();
            
            // Ensure we return an array, not a collection issue
            $productsArray = $products->toArray();

            return response()->json([
                'status' => 200,
                'data'   => $productsArray,
                'count'  => count($productsArray)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error fetching products: ' . $e->getMessage(),
                'data' => []
            ], 600);
        }
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
            'gallery.*'         => 'integer',
            'sizes'             => 'array',
            'sizes.*'           => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 200);
        }

        // Create product
        try {
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
            
            if (!$product->save()) {
                return response()->json([
                    'status' => 500,
                    'message' => 'Failed to save product',
                    'errors' => ['Failed to create product in database']
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error creating product: ' . $e->getMessage(),
                'errors' => [$e->getMessage()]
            ], 500);
        }

        // Save product images
        if (!empty($request->gallery)) {

            foreach ($request->gallery as $key => $tempImageId) {

                $tempImage = Tempimages::find($tempImageId);
                if (!$tempImage) continue;

                // Extract extension
                $ext = pathinfo($tempImage->name, PATHINFO_EXTENSION);

                // New image name
                $newImageName = time() . rand(1000, 9999) . '.' . $ext;

                $originalPath = public_path('upload/temp/' . $tempImage->name);
                $thumbPathTemp = public_path('upload/temp/thumb_' . $tempImage->name);

                // If this is the FIRST image, save it as MAIN product image
                if ($key == 0) {
                    $product->image = $newImageName;
                    $product->save();
                }

                // Create products folder if not exists
                $productFolder = public_path('upload/products/');
                if (!file_exists($productFolder)) {
                    mkdir($productFolder, 0777, true);
                }

                // Move main image
                if (file_exists($originalPath)) {
                    rename($originalPath, $productFolder . $newImageName);
                }

                // Move thumbnail
                if (file_exists($thumbPathTemp)) {
                    rename($thumbPathTemp, $productFolder . 'thumb_' . $newImageName);
                }

                // Save to product_images table
                $productImage = new ProductImage();
                $productImage->product_id = $product->id;
                $productImage->image = $newImageName;
                $productImage->save();

                // Delete temp image record
                $tempImage->delete();
            }
        }

        // Save product sizes
        if (!empty($request->sizes) && is_array($request->sizes)) {
            // Delete existing sizes
            ProductSize::where('product_id', $product->id)->delete();
            
            // Attach new sizes
            foreach ($request->sizes as $sizeId) {
                ProductSize::create([
                    'product_id' => $product->id,
                    'size_id' => $sizeId
                ]);
            }
        }

        // Refresh product to get latest data
        $product->refresh();

        return response()->json([
            'status'  => 200,
            'message' => 'Product created successfully',
            'data'    => $product
        ], 200);
    }

    // Return single product
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
            'status'            => 'required|in:0,1',
            'sizes'             => 'array',
            'sizes.*'           => 'integer'
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

        // Update product sizes
        if (isset($request->sizes) && is_array($request->sizes)) {
            // Delete existing sizes
            ProductSize::where('product_id', $product->id)->delete();
            
            // Attach new sizes
            foreach ($request->sizes as $sizeId) {
                ProductSize::create([
                    'product_id' => $product->id,
                    'size_id' => $sizeId
                ]);
            }
        }

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

