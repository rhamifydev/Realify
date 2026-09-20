<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyApprovalController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'pending_review');
        $search = $request->query('search', '');

        $query = Property::with(['user', 'units', 'media'])->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $properties = $query->paginate(12)->withQueryString();

        $counts = [
            'all' => Property::count(),
            'pending_review' => Property::where('status', 'pending_review')->count(),
            'published' => Property::where('status', 'published')->count(),
            'draft' => Property::where('status', 'draft')->count(),
        ];

        return Inertia::render('admin/properties', [
            'properties' => $properties,
            'currentStatus' => $status,
            'search' => $search,
            'counts' => $counts,
        ]);
    }

    public function show(Property $property)
    {
        $property->load(['user.kycProfile', 'units', 'media']);

        return Inertia::render('admin/properties/show', [
            'property' => $property,
        ]);
    }

    public function approve(Property $property)
    {
        $property->update([
            'status' => 'published',
            'current_stage' => 5,
        ]);

        return redirect()->back()->with('success', "Property '{$property->title}' approved and published successfully.");
    }

    public function reject(Request $request, Property $property)
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $property->update([
            'status' => 'draft',
        ]);

        return redirect()->back()->with('warning', "Property '{$property->title}' rejected and returned to draft.");
    }
}
