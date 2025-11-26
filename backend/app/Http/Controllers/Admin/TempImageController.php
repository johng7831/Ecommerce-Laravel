<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Models\Tempimages;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class TempImageController extends Controller
{
    public function store(Request $request)
    {
        // Validate image
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 200);
        }

        // Upload image
        $image = $request->file('image');
        $imageName = time() . '.' . $image->getClientOriginalExtension();
        $image->move(public_path('upload/temp'), $imageName);

        // Save to database
        $tempImage = new Tempimages();
        $tempImage->name = $imageName;
        $tempImage->save();

        // Create thumbnail (Intervention v3 syntax)
        try {
            $manager = new ImageManager(new Driver());
            $img = $manager->read(public_path('upload/temp/' . $imageName));

            // Resize and save thumbnail
            $img->cover(400, 450);
            $img->save(public_path('upload/temp/thumb_' . $imageName));
            
        } catch (\Throwable $e) {
            Log::error('Thumbnail generation failed: ' . $e->getMessage());
        }

        return response()->json([
            'status' => 200,
            'message' => 'Image uploaded successfully',
            'data' => $tempImage
        ]);
    }
}
