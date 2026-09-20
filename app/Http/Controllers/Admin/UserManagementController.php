<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->query('role', 'all');
        $search = $request->query('search', '');

        $query = User::with(['kycProfile', 'properties'])->latest();

        if ($role !== 'all') {
            $query->where('role', $role);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(15)->withQueryString();

        $counts = [
            'all' => User::count(),
            'tenant' => User::where('role', 'tenant')->count(),
            'owner' => User::where('role', 'owner')->count(),
            'agent' => User::where('role', 'agent')->count(),
            'admin' => User::where('role', 'admin')->count(),
        ];

        return Inertia::render('admin/users', [
            'users' => $users,
            'currentRole' => $role,
            'search' => $search,
            'counts' => $counts,
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|in:tenant,owner,agent,admin',
        ]);

        $newRole = $validated['role'];
        $user->update(['role' => $newRole]);

        // Sync with Role model in pivot table
        $roleModel = Role::firstOrCreate(['name' => $newRole]);
        $user->roles()->sync([$roleModel->id]);

        return redirect()->back()->with('success', "User '{$user->name}' role updated to " . strtoupper($newRole) . ".");
    }
}
