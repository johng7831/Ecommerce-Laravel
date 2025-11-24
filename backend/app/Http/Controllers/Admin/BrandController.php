<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Brand;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class BrandController extends Controller
{
    // Return all brands
    public function index()
    {
        $brands = Brand::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => 200,
            'data'   => $brands
        ]);
    }

    // Store a new brand
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'   => 'required|string|max:255|unique:brands,name',
            'status' => 'nullable|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        $brand = Brand::create([
            'name'   => $request->name,
            'slug'   => Str::slug($request->name) . '-' . time(),
            'status' => $request->status ?? 1
        ]);

        return response()->json([
            'status'  => 200,
            'message' => 'Brand added successfully',
            'data'    => $brand
        ]);
    }

    // Show a single brand
    public function show($id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                'status' => 404,
                'message' => 'Brand not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data'   => $brand
        ]);
    }

    // Update a brand
    public function update(Request $request, $id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                'status' => 404,
                'message' => 'Brand not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'   => "required|string|max:255|unique:brands,name,$id",
            'status' => 'nullable|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ]);
        }

        $brand->update([
            'name'   => $request->name,
            'slug'   => Str::slug($request->name) . '-' . time(),
            'status' => $request->status ?? $brand->status
        ]);

        return response()->json([
            'status'  => 200,
            'message' => 'Brand updated successfully',
            'data'    => $brand
        ]);
    }

    // Delete a brand
    public function destroy($id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                'status' => 404,
                'message' => 'Brand not found'
            ], 404);
        }

        $brand->delete();

        return response()->json([
            'status'  => 200,
            'message' => 'Brand deleted successfully'
        ]);
    }
}
