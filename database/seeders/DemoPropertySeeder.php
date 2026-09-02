<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyMedia;
use App\Models\PropertyUnit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoPropertySeeder extends Seeder
{
    public function run(): void
    {
        // Ensure we have a default landlord
        $owner = User::firstOrCreate(
            ['email' => 'owner@rentify.test'],
            [
                'name' => 'Verified Owner',
                'password' => Hash::make('password'),
            ]
        );

        $agent = User::firstOrCreate(
            ['email' => 'agent@rentify.test'],
            [
                'name' => 'Verified Agent',
                'password' => Hash::make('password'),
            ]
        );

        // Featured properties from the mockup
        $featured = [
            [
                'title' => 'Modern 1-Bedroom Apartment',
                'address' => 'Lekki Phase 1',
                'city' => 'Lagos',
                'state' => 'Lagos',
                'price' => 3500000,
                'units' => 3,
                'baths' => 2,
                'beds' => 1,
                'img' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
                'user_id' => $agent->id,
            ],
            [
                'title' => '4-Bedroom Luxury Duplex',
                'address' => 'Ikoyi',
                'city' => 'Lagos',
                'state' => 'Lagos',
                'price' => 12000000,
                'units' => 1,
                'baths' => 5,
                'beds' => 4,
                'img' => 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop',
                'user_id' => $owner->id,
            ],
            [
                'title' => 'Executive Studio Apartment',
                'address' => 'Yaba',
                'city' => 'Lagos',
                'state' => 'Lagos',
                'price' => 12000000, // It said 1.2m on mockup, I'll put 1200000
                'units' => 1,
                'baths' => 1,
                'beds' => 1,
                'img' => 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=800&auto=format&fit=crop',
                'user_id' => $agent->id,
            ],
            [
                'title' => 'Spacious 2-Bedroom Flat',
                'address' => 'Ikeja GRA',
                'city' => 'Lagos',
                'state' => 'Lagos',
                'price' => 5000000,
                'units' => 8,
                'baths' => 2,
                'beds' => 2,
                'img' => 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop',
                'user_id' => $agent->id,
            ],
        ];

        $featured[2]['price'] = 1200000;

        foreach ($featured as $data) {
            $prop = Property::create([
                'user_id' => $data['user_id'],
                'title' => $data['title'],
                'description' => 'A wonderful property located in ' . $data['address'],
                'address' => $data['address'],
                'city' => $data['city'],
                'state' => $data['state'],
                'type' => 'rent',
                'category' => 'residential',
                'structure_type' => 'apartment',
                'status' => 'published',
            ]);

            // Add multiple units if needed
            for ($i = 0; $i < $data['units']; $i++) {
                PropertyUnit::create([
                    'property_id' => $prop->id,
                    'title' => 'Unit ' . ($i + 1),
                    'bedrooms' => $data['beds'],
                    'bathrooms' => $data['baths'],
                    'rent_price' => $data['price'],
                    'status' => 'available',
                ]);
            }

            PropertyMedia::create([
                'property_id' => $prop->id,
                'path' => $data['img'],
                'type' => 'image',
                'is_primary' => true,
            ]);
        }

        // Add dummy properties to Abuja and Port Harcourt to pad the Top Places stats
        // We want Lagos to have 4 (done above), Abuja 3, Port Harcourt 2.
        
        $abujaData = [
            ['title' => 'Maitama Mansion', 'city' => 'Abuja', 'state' => 'FCT'],
            ['title' => 'Wuse 2 Flat', 'city' => 'Abuja', 'state' => 'FCT'],
            ['title' => 'Gwarinpa Estate', 'city' => 'Abuja', 'state' => 'FCT'],
        ];

        foreach ($abujaData as $data) {
            $prop = Property::create([
                'user_id' => $owner->id,
                'title' => $data['title'],
                'description' => 'Great property.',
                'address' => $data['city'],
                'city' => $data['city'],
                'state' => $data['state'],
                'type' => 'rent',
                'category' => 'residential',
                'structure_type' => 'duplex',
                'status' => 'published',
            ]);
            PropertyUnit::create([
                'property_id' => $prop->id,
                'title' => 'Unit 1',
                'bedrooms' => 3,
                'bathrooms' => 3,
                'rent_price' => 4500000,
                'status' => 'available',
            ]);
            // Reusing a random Unsplash image
            PropertyMedia::create([
                'property_id' => $prop->id,
                'path' => 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format&fit=crop',
                'type' => 'image',
                'is_primary' => true,
            ]);
        }

        $phData = [
            ['title' => 'GRA Phase 2 Home', 'city' => 'Port Harcourt', 'state' => 'Rivers'],
            ['title' => 'Peter Odili Flat', 'city' => 'Port Harcourt', 'state' => 'Rivers'],
        ];

        foreach ($phData as $data) {
            $prop = Property::create([
                'user_id' => $agent->id,
                'title' => $data['title'],
                'description' => 'Great property in PH.',
                'address' => $data['city'],
                'city' => $data['city'],
                'state' => $data['state'],
                'type' => 'rent',
                'category' => 'residential',
                'structure_type' => 'apartment',
                'status' => 'published',
            ]);
            PropertyUnit::create([
                'property_id' => $prop->id,
                'title' => 'Unit 1',
                'bedrooms' => 2,
                'bathrooms' => 2,
                'rent_price' => 2000000,
                'status' => 'available',
            ]);
            PropertyMedia::create([
                'property_id' => $prop->id,
                'path' => 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=800&auto=format&fit=crop',
                'type' => 'image',
                'is_primary' => true,
            ]);
        }
    }
}
