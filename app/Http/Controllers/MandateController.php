<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AgentMandate;
use App\Models\Property;
use App\Models\User;

class MandateController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Fetch mandates where user is owner OR agent
        $mandates = AgentMandate::with(['property', 'owner', 'agent'])
            ->where('owner_id', $user->id)
            ->orWhere('agent_id', $user->id)
            ->latest()
            ->get();

        return Inertia::render('mandates/index', [
            'mandates' => $mandates,
            'isOwner' => $user->hasRole('owner')
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'agent_id' => 'required|exists:users,id',
            'owner_split' => 'required|numeric|min:0|max:100',
            'agent_split' => 'required|numeric|min:0|max:100',
        ]);

        $property = Property::findOrFail($validated['property_id']);

        if ($property->user_id !== $request->user()->id) {
            abort(403, 'You do not own this property.');
        }

        AgentMandate::create([
            'property_id' => $validated['property_id'],
            'owner_id' => $request->user()->id,
            'agent_id' => $validated['agent_id'],
            'owner_split' => $validated['owner_split'],
            'agent_split' => $validated['agent_split'],
            'status' => 'pending'
        ]);

        return redirect()->back()->with('success', 'Mandate proposed successfully.');
    }

    public function update(Request $request, AgentMandate $mandate)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        if ($mandate->agent_id !== $request->user()->id) {
            abort(403, 'You are not the designated agent for this mandate.');
        }

        $mandate->update([
            'status' => $validated['status']
        ]);

        return redirect()->back()->with('success', 'Mandate updated successfully.');
    }
}
