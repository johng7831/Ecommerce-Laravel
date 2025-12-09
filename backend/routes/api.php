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
use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\OrderController;

// Public Routes
Route::post('/admin/login', [AuthController::class, 'authenticate']);
Route::get('/sizes', [SizeController::class, 'index']);
Route::get('/latest-products', [FrontProductController::class, 'latestProducts']);
Route::get('/featured-products', [FrontProductController::class, 'featuredProduct']);
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);   
Route::post('/register', [AccountController::class, 'register']);
Route::post('/login', [AccountController::class, 'authenticate']);



// Save Order protected route
Route::middleware('auth:sanctum','checkCustomer')->group(function () {
    Route::post('/save-order', [OrderController::class, 'saveOrder']);
    Route::get('/order/{id}', [OrderController::class, 'getOrder']);
});

// Save Order protected routes
Route::middleware(['auth:sanctum', 'checkCustomer'])->group(function () {
    Route::post('/save-order', [OrderController::class, 'saveOrder']);
    Route::get('/get-order-details/{id}', [AccountController::class, 'getOrdersdetail']);
});


// Temp Image upload (public)
Route::post('/temp-images', [TempImageController::class, 'store']);

// Protected Routes
Route::middleware('auth:sanctum','checkAdmin')->group(function () {

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
