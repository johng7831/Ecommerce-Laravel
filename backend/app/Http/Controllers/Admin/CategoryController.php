<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    // Return all categories
    public function index()
    {
        try {
            // Check if this is a public request (no auth) - return only active categories
            // If authenticated admin request, return all categories
            if (auth()->check() && auth()->user()->role === 'admin') {
                $categories = Category::orderBy('created_at', 'DESC')->get();
            } else {
                $categories = Category::where('status', 1)->orderBy('created_at', 'DESC')->get();
            }
            
            return response()->json([
                'status' => 200,
                'data'   => $categories,
                'count'  => $categories->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error fetching categories: ' . $e->getMessage(),
                'data' => []
            ], 500);
        }
    }


    // Store a new category
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name',
            'status' => 'nullable|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        $category = new Category();
        $category->name = $request->name;
        $category->slug = Str::slug($request->name);
        $category->status = $request->status ?? 1;
        $category->save();

        return response()->json([
            'status' => 200,
            'message' => 'Category added successfully',
            'data' => $category
        ]);
    }



    // Show a single category
    public function show($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => 404,
                'message' => 'Category not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $category
        ]);
    }



    // Update a category
    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => 404,
                'message' => 'Category not found'
            ], 404);
        }

        // Validation
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
            'status' => 'nullable|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // Update data
        $category->name = $request->name;
        $category->slug = Str::slug($request->name);
        $category->status = $request->status ?? $category->status;
        $category->save();

        return response()->json([
            'status' => 200,
            'message' => 'Category updated successfully',
            'data' => $category
        ]);
    }



    // Delete a category
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => 404,
                'message' => 'Category not found'
            ], 404);
        }

        $category->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Category deleted successfully'
        ]);
    }
}
