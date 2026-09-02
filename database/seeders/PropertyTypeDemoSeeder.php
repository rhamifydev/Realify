<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyMedia;
use App\Models\PropertyUnit;
use App\Models\User;
use Illuminate\Database\Seeder;

class PropertyTypeDemoSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::query()->first();

        if (! $owner) {
            $this->command->warn('No user found. Run the main property seeder first.');
            return;
        }

        $properties = [
            [
                'title' => 'Serviced Apartment in Victoria Island',
                'category' => 'apartment',
                'city' => 'Victoria Island',
                'state' => 'Lagos',
                'address' => '12 Ocean View Road, Victoria Island',
                'price' => 6500000,
                'beds' => 2,
                'baths' => 2,
                'image' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=900&auto=format&fit=crop',
            ],
            [
                'title' => 'Modern Warehouse in Ikeja',
                'category' => 'industrial',
                'city' => 'Ikeja',
                'state' => 'Lagos',
                'address' => '8 Industrial Estate Road, Ikeja',
                'price' => 12000000,
                'beds' => 0,
                'baths' => 2,
                'image' => 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?q=80&w=900&auto=format&fit=crop',
            ],
            [
                'title' => 'Approved Commercial Building Site in Abuja',
                'category' => 'building-code',
                'city' => 'Maitama',
                'state' => 'FCT',
                'address' => '4 Development Avenue, Maitama',
                'price' => 25000000,
                'beds' => 0,
                'baths' => 0,
                'image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=900&auto=format&fit=crop',
            ],
        ];

        foreach ($properties as $data) {
            $property = Property::firstOrCreate(
                ['title' => $data['title']],
                [
                    'user_id' => $owner->id,
                    'description' => 'A verified Rentify demo property available for testing the property type flow.',
                    'address' => $data['address'],
                    'state' => $data['state'],
                    'city' => $data['city'],
                    'type' => 'rent',
                    'category' => $data['category'],
                    'structure_type' => 'single_unit',
                    'status' => 'published',
                    'current_stage' => 5,
                ]
            );

            if ($property->wasRecentlyCreated) {
                $property->units()->create([
                    'title' => $data['title'],
                    'bedrooms' => $data['beds'],
                    'bathrooms' => $data['baths'],
                    'rent_price' => $data['price'],
                    'status' => 'available',
                ]);

                PropertyMedia::create([
                    'property_id' => $property->id,
                    'path' => $data['image'],
                    'type' => 'image',
                    'is_primary' => true,
                    'status' => 'ready',
                ]);
            }
        }
    }
}
