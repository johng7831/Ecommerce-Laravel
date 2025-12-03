<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\SizeController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\TempImageController;
use App\Http\Controllers\front\ProductController as FrontProductController;

// Public Routes
Route::post('/admin/login', [AuthController::class, 'authenticate']);
Route::get('/sizes', [SizeController::class, 'index']);
Route::get('/latest-products', [FrontProductController::class, 'latestProducts']);
Route::get('/featured-products', [FrontProductController::class, 'featuredProduct']);

// Temp Image upload (public)
Route::post('/temp-images', [TempImageController::class, 'store']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {

    // Category CRUD Routes
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);


    // Brand CRUD Routes
    Route::resource('brands', BrandController::class);
        
    // Size CRUD Routes
    Route::resource('sizes', SizeController::class);


    // Product CRUD Routes (resource)
    Route::resource('products', ProductController::class);

    // Update a product
    Route::put('/products/{id}', [ProductController::class, 'update']);
    // Delete a product
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

});

// Get Authenticated User
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
