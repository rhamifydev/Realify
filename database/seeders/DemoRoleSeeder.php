<?php

namespace Database\Seeders;

use App\Models\AgentMandate;
use App\Models\KycProfile;
use App\Models\Property;
use App\Models\PropertyUnit;
use App\Models\Role;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoRoleSeeder extends Seeder
{
    /**
     * Seed all 4 user roles, demo accounts, and role-specific interactive test data.
     */
    public function run(): void
    {
        // 1. Ensure the 4 core roles exist in roles table
        $roles = [
            'admin' => Role::firstOrCreate(['name' => 'admin']),
            'owner' => Role::firstOrCreate(['name' => 'owner']),
            'agent' => Role::firstOrCreate(['name' => 'agent']),
            'tenant' => Role::firstOrCreate(['name' => 'tenant']),
        ];

        // Update any existing users without a role to have 'owner' or 'tenant'
        User::whereNull('role')->orWhere('role', '')->update(['role' => 'tenant']);

        // 2. Create the 4 Demo Users
        // Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@rentify.demo'],
            [
                'name' => 'System Administrator',
                'role' => 'admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->roles()->sync([$roles['admin']->id]);

        // House Owner / Landlord
        $owner = User::updateOrCreate(
            ['email' => 'owner@rentify.demo'],
            [
                'name' => 'Chief Adeleke (Property Owner)',
                'role' => 'owner',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $owner->roles()->sync([$roles['owner']->id]);

        KycProfile::updateOrCreate(
            ['user_id' => $owner->id],
            [
                'status' => 'verified',
                'nin' => '12345678901',
                'bvn' => '22334455667',
                'id_type' => 'national_id',
            ]
        );

        // Real Estate Agent
        $agent = User::updateOrCreate(
            ['email' => 'agent@rentify.demo'],
            [
                'name' => 'Grace Okafor (Licensed Broker)',
                'role' => 'agent',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $agent->roles()->sync([$roles['agent']->id]);

        KycProfile::updateOrCreate(
            ['user_id' => $agent->id],
            [
                'status' => 'verified',
                'nin' => '98765432109',
                'bvn' => '33445566778',
                'id_type' => 'driver_license',
                'lasrera_number' => 'LASRERA/AGT/2026/0419',
                'esvarbon_license' => 'ESVARBON-7782',
            ]
        );

        // Tenant / Renter
        $tenant = User::updateOrCreate(
            ['email' => 'tenant@rentify.demo'],
            [
                'name' => 'Chinedu Okonkwo (Verified Tenant)',
                'role' => 'tenant',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $tenant->roles()->sync([$roles['tenant']->id]);

        KycProfile::updateOrCreate(
            ['user_id' => $tenant->id],
            [
                'status' => 'verified',
                'nin' => '55667788990',
                'bvn' => '44556677889',
                'id_type' => 'passport',
            ]
        );

        // 3. Assign properties to House Owner
        // Transfer 3-4 existing properties or create new ones for the owner
        $existingProperties = Property::take(4)->get();
        if ($existingProperties->isNotEmpty()) {
            foreach ($existingProperties as $idx => $prop) {
                $prop->update(['user_id' => $owner->id]);
            }
        } else {
            // Create a luxury property for owner if none exist
            $prop = Property::create([
                'user_id' => $owner->id,
                'title' => 'The Grand Crest Luxury Villa',
                'description' => 'A state of the art luxury duplex with private pool, cinema room, and solar power backup in Lekki Phase 1.',
                'address' => 'Plot 14 Admiralty Way, Lekki Phase 1',
                'city' => 'Lekki',
                'state' => 'Lagos',
                'type' => 'rent',
                'structure_type' => 'single_unit',
                'status' => 'published',
                'current_stage' => 5,
            ]);

            $prop->units()->create([
                'status' => 'available',
                'rent_price' => 12000000,
                'bedrooms' => 5,
                'bathrooms' => 6,
            ]);
        }

        // Also add 1 draft property for Owner so they can test continuing drafts
        Property::firstOrCreate(
            ['title' => 'Maitama Heights Luxury Penthouse (Draft)'],
            [
                'user_id' => $owner->id,
                'description' => 'Panoramic view penthouse overlooking Abuja city center.',
                'address' => '22 Mississippi Street, Maitama',
                'city' => 'Abuja',
                'state' => 'FCT Abuja',
                'type' => 'sale',
                'structure_type' => 'single_unit',
                'status' => 'draft',
                'current_stage' => 2,
            ]
        );

        $ownerProperties = Property::where('user_id', $owner->id)->get();
        $primaryProperty = $ownerProperties->first();
        $secondaryProperty = $ownerProperties->skip(1)->first() ?? $primaryProperty;

        // 4. Create Agent Mandates between Owner and Agent
        if ($primaryProperty) {
            AgentMandate::updateOrCreate(
                [
                    'property_id' => $primaryProperty->id,
                    'owner_id' => $owner->id,
                    'agent_id' => $agent->id,
                ],
                [
                    'owner_split' => 80.00,
                    'agent_split' => 20.00,
                    'status' => 'approved',
                ]
            );
        }

        if ($secondaryProperty && $secondaryProperty->id !== $primaryProperty->id) {
            AgentMandate::updateOrCreate(
                [
                    'property_id' => $secondaryProperty->id,
                    'owner_id' => $owner->id,
                    'agent_id' => $agent->id,
                ],
                [
                    'owner_split' => 85.00,
                    'agent_split' => 15.00,
                    'status' => 'pending',
                ]
            );
        }

        // 5. Create Transactions & Escrow Disputes for Admin & Tenant
        $units = PropertyUnit::take(4)->get();
        if ($units->count() >= 2) {
            $unit1 = $units[0];
            $unit2 = $units[1];

            // Dispute 1: Rent payment disputed due to inspection handover issues
            Transaction::firstOrCreate(
                ['payment_reference' => 'PAY-DISPUTE-RENT-001'],
                [
                    'property_unit_id' => $unit1->id,
                    'tenant_id' => $tenant->id,
                    'amount' => 3500000.00,
                    'type' => 'rent',
                    'status' => 'disputed',
                ]
            );

            // Dispute 2: Inspection fee dispute
            Transaction::firstOrCreate(
                ['payment_reference' => 'PAY-DISPUTE-INSP-002'],
                [
                    'property_unit_id' => $unit2->id,
                    'tenant_id' => $tenant->id,
                    'amount' => 25000.00,
                    'type' => 'inspection_fee',
                    'status' => 'disputed',
                ]
            );

            // Active Held Escrow transaction for Tenant
            Transaction::firstOrCreate(
                ['payment_reference' => 'PAY-ESCROW-HELD-003'],
                [
                    'property_unit_id' => $unit1->id,
                    'tenant_id' => $tenant->id,
                    'amount' => 1800000.00,
                    'type' => 'caution_deposit',
                    'status' => 'held',
                ]
            );

            // Completed Released Escrow transaction
            Transaction::firstOrCreate(
                ['payment_reference' => 'PAY-ESCROW-REL-004'],
                [
                    'property_unit_id' => $unit2->id,
                    'tenant_id' => $tenant->id,
                    'amount' => 2200000.00,
                    'type' => 'rent',
                    'status' => 'released',
                ]
            );

            // Refunded Escrow transaction
            Transaction::firstOrCreate(
                ['payment_reference' => 'PAY-ESCROW-REF-005'],
                [
                    'property_unit_id' => $unit1->id,
                    'tenant_id' => $tenant->id,
                    'amount' => 1500000.00,
                    'type' => 'rent',
                    'status' => 'refunded',
                ]
            );
        }

        // 6. Create Pending Review Properties for Admin Approvals
        $pendingProp1 = Property::firstOrCreate(
            ['title' => 'Ikoyi Imperial Towers & Luxury Residences'],
            [
                'user_id' => $owner->id,
                'description' => 'A premier modern residential high-rise with waterfront views, private gym, and 24/7 concierge security in Ikoyi.',
                'address' => '18 Bourdillon Road, Ikoyi',
                'city' => 'Ikoyi',
                'state' => 'Lagos',
                'type' => 'rent',
                'structure_type' => 'multi_unit',
                'status' => 'pending_review',
                'current_stage' => 5,
            ]
        );
        $pendingProp1->units()->firstOrCreate(
            ['property_id' => $pendingProp1->id],
            [
                'status' => 'available',
                'rent_price' => 18000000,
                'bedrooms' => 4,
                'bathrooms' => 5,
            ]
        );

        $pendingProp2 = Property::firstOrCreate(
            ['title' => 'Victoria Crest Smart Duplexes'],
            [
                'user_id' => $owner->id,
                'description' => 'Newly developed smart automated duplexes equipped with biometric entry, home automation, and solar inverters.',
                'address' => 'Orchid Road, Lekki',
                'city' => 'Lekki',
                'state' => 'Lagos',
                'type' => 'sale',
                'structure_type' => 'single_unit',
                'status' => 'pending_review',
                'current_stage' => 5,
            ]
        );
        $pendingProp2->units()->firstOrCreate(
            ['property_id' => $pendingProp2->id],
            [
                'status' => 'available',
                'sale_price' => 145000000,
                'bedrooms' => 5,
                'bathrooms' => 5,
            ]
        );

        // 7. Create Pending KYC submissions
        $pendingUser1 = User::where('email', 'seun@rentify.demo')->first();
        if ($pendingUser1) {
            KycProfile::updateOrCreate(
                ['user_id' => $pendingUser1->id],
                [
                    'status' => 'pending',
                    'nin' => '44332211009',
                    'bvn' => '55667788112',
                    'id_type' => 'voter_card',
                ]
            );
        }

        $pendingUser2 = User::where('email', 'amina@rentify.demo')->first();
        if ($pendingUser2) {
            KycProfile::updateOrCreate(
                ['user_id' => $pendingUser2->id],
                [
                    'status' => 'pending',
                    'nin' => '88776655443',
                    'bvn' => '99887766554',
                    'id_type' => 'driver_license',
                    'lasrera_number' => 'LASRERA/VERIF/2026/089',
                ]
            );
        }
    }
}
