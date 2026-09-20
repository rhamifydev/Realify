<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Property;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $properties = $request->user()->properties()->with('media')->latest()->get();
        return Inertia::render('properties/index', [
            'properties' => $properties
        ]);
    }

    public function create(Request $request)
    {
        // Auto-create a draft and redirect to edit
        $property = $request->user()->properties()->create([
            'status' => 'draft',
            'current_stage' => 1
        ]);
        
        // Also auto-create a default unit to attach rent/sale data
        $property->units()->create([
            'status' => 'available'
        ]);

        return redirect()->route('properties.edit', $property->id);
    }

    public function edit(Request $request, Property $property)
    {
        if ($property->user_id !== $request->user()->id) {
            abort(403);
        }

        $property->load(['units', 'media', 'availabilities']);

        return Inertia::render('properties/edit', [
            'property' => $property
        ]);
    }

    public function update(Request $request, Property $property)
    {
        if ($property->user_id !== $request->user()->id) {
            abort(403);
        }

        // Validate based on the step being submitted
        $step = $request->input('step', $property->current_stage);

        if ($step == 1) {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'address' => 'required|string|max:255',
                'state' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'type' => 'required|in:rent,sale,sale_or_rent',
                'structure_type' => 'required|in:single_unit,multi_unit',
            ]);
            $property->update($validated);
            $property->update(['current_stage' => 2]);
        } elseif ($step == 3) {
            // Step 2 is media upload (handled by MediaController)
            $validated = $request->validate([
                'rent_price' => 'nullable|numeric',
                'sale_price' => 'nullable|numeric',
                'bedrooms' => 'nullable|integer',
                'bathrooms' => 'nullable|integer',
            ]);
            
            $unit = $property->units()->first();
            $unit->update($validated);
            $property->update(['current_stage' => 4]);
        } elseif ($step == 4) {
            // Documents
            $property->update(['current_stage' => 5]);
        } elseif ($step == 5) {
            // Final submit
            $property->update(['status' => 'pending_review']);
            return redirect()->route('properties.index')->with('success', 'Property submitted for review.');
        }

        return redirect()->route('properties.edit', $property->id);
    }

    public function destroy(Request $request, Property $property)
    {
        if ($property->user_id !== $request->user()->id) {
            abort(403);
        }
        $property->delete();
        return redirect()->route('properties.index');
    }
}
