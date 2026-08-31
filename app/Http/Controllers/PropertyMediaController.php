<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Property;

class PropertyMediaController extends Controller
{
    public function store(Request $request, Property $property)
    {
        if ($property->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,mp4,mov|max:51200', // max 50MB
        ]);

        $file = $request->file('file');
        $type = str_contains($file->getMimeType(), 'video') ? 'video' : 'photo';
        
        $path = $file->store('property_media', 'public');

        $media = $property->media()->create([
            'path' => $path,
            'type' => $type,
            'status' => 'ready', // We assume ready for MVP without S3 queues
        ]);

        return response()->json($media);
    }

    public function destroy(Request $request, Property $property, $mediaId)
    {
        if ($property->user_id !== $request->user()->id) {
            abort(403);
        }

        $media = $property->media()->findOrFail($mediaId);
        // \Storage::disk('public')->delete($media->path);
        $media->delete();

        return response()->json(['success' => true]);
    }
}
