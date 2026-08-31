<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyUnit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class NigerianPropertySeeder extends Seeder
{
    /**
     * All 36 Nigerian states + FCT with real towns and GPS coordinates.
     * Each state has 3-5 towns with lat/lng for accurate geolocation.
     */
    private array $statesAndTowns = [
        'Abia' => [
            ['city' => 'Umuahia', 'lat' => 5.5261, 'lng' => 7.4939],
            ['city' => 'Aba', 'lat' => 5.1066, 'lng' => 7.3667],
            ['city' => 'Ohafia', 'lat' => 5.6247, 'lng' => 7.8336],
            ['city' => 'Arochukwu', 'lat' => 5.3833, 'lng' => 7.9167],
        ],
        'Adamawa' => [
            ['city' => 'Yola', 'lat' => 9.2035, 'lng' => 12.4954],
            ['city' => 'Jimeta', 'lat' => 9.2800, 'lng' => 12.4600],
            ['city' => 'Mubi', 'lat' => 10.2669, 'lng' => 13.2671],
            ['city' => 'Numan', 'lat' => 9.4634, 'lng' => 12.0362],
        ],
        'Akwa Ibom' => [
            ['city' => 'Uyo', 'lat' => 5.0377, 'lng' => 7.9128],
            ['city' => 'Ikot Ekpene', 'lat' => 5.1824, 'lng' => 7.7148],
            ['city' => 'Eket', 'lat' => 4.6426, 'lng' => 7.9244],
            ['city' => 'Oron', 'lat' => 4.8173, 'lng' => 8.2363],
        ],
        'Anambra' => [
            ['city' => 'Awka', 'lat' => 6.2100, 'lng' => 7.0700],
            ['city' => 'Onitsha', 'lat' => 6.1456, 'lng' => 6.7846],
            ['city' => 'Nnewi', 'lat' => 6.0186, 'lng' => 6.9175],
            ['city' => 'Ekwulobia', 'lat' => 6.0391, 'lng' => 7.0785],
        ],
        'Bauchi' => [
            ['city' => 'Bauchi', 'lat' => 10.3158, 'lng' => 9.8442],
            ['city' => 'Azare', 'lat' => 11.6753, 'lng' => 10.1936],
            ['city' => 'Misau', 'lat' => 11.3094, 'lng' => 10.4664],
            ['city' => 'Jama\'are', 'lat' => 11.6700, 'lng' => 9.9400],
        ],
        'Bayelsa' => [
            ['city' => 'Yenagoa', 'lat' => 4.9261, 'lng' => 6.2676],
            ['city' => 'Ogbia', 'lat' => 4.6833, 'lng' => 6.3333],
            ['city' => 'Brass', 'lat' => 4.3121, 'lng' => 6.2415],
        ],
        'Benue' => [
            ['city' => 'Makurdi', 'lat' => 7.7333, 'lng' => 8.5333],
            ['city' => 'Gboko', 'lat' => 7.3167, 'lng' => 9.0000],
            ['city' => 'Otukpo', 'lat' => 7.1904, 'lng' => 8.1300],
            ['city' => 'Katsina-Ala', 'lat' => 7.1667, 'lng' => 9.2833],
        ],
        'Borno' => [
            ['city' => 'Maiduguri', 'lat' => 11.8311, 'lng' => 13.1510],
            ['city' => 'Biu', 'lat' => 10.6113, 'lng' => 12.1947],
            ['city' => 'Bama', 'lat' => 11.5215, 'lng' => 13.6856],
            ['city' => 'Dikwa', 'lat' => 12.0333, 'lng' => 13.9167],
        ],
        'Cross River' => [
            ['city' => 'Calabar', 'lat' => 4.9757, 'lng' => 8.3417],
            ['city' => 'Ogoja', 'lat' => 6.6543, 'lng' => 8.7978],
            ['city' => 'Ikom', 'lat' => 5.9646, 'lng' => 8.7122],
            ['city' => 'Obudu', 'lat' => 6.6669, 'lng' => 9.1669],
        ],
        'Delta' => [
            ['city' => 'Asaba', 'lat' => 6.1944, 'lng' => 6.7336],
            ['city' => 'Warri', 'lat' => 5.5167, 'lng' => 5.7500],
            ['city' => 'Sapele', 'lat' => 5.8940, 'lng' => 5.6766],
            ['city' => 'Ughelli', 'lat' => 5.4887, 'lng' => 6.0050],
            ['city' => 'Agbor', 'lat' => 6.2500, 'lng' => 6.1990],
        ],
        'Ebonyi' => [
            ['city' => 'Abakaliki', 'lat' => 6.3249, 'lng' => 8.1137],
            ['city' => 'Afikpo', 'lat' => 5.8929, 'lng' => 7.9353],
            ['city' => 'Onueke', 'lat' => 6.1500, 'lng' => 8.0333],
        ],
        'Edo' => [
            ['city' => 'Benin City', 'lat' => 6.3350, 'lng' => 5.6037],
            ['city' => 'Auchi', 'lat' => 7.0679, 'lng' => 6.2645],
            ['city' => 'Ekpoma', 'lat' => 6.7435, 'lng' => 6.1369],
            ['city' => 'Uromi', 'lat' => 6.7000, 'lng' => 6.3300],
        ],
        'Ekiti' => [
            ['city' => 'Ado-Ekiti', 'lat' => 7.6211, 'lng' => 5.2214],
            ['city' => 'Ikere-Ekiti', 'lat' => 7.4969, 'lng' => 5.2308],
            ['city' => 'Ikole-Ekiti', 'lat' => 7.7833, 'lng' => 5.5167],
            ['city' => 'Efon-Alaaye', 'lat' => 7.6500, 'lng' => 4.9167],
        ],
        'Enugu' => [
            ['city' => 'Enugu', 'lat' => 6.4403, 'lng' => 7.4942],
            ['city' => 'Nsukka', 'lat' => 6.8567, 'lng' => 7.3958],
            ['city' => 'Agbani', 'lat' => 6.3167, 'lng' => 7.5500],
            ['city' => 'Udi', 'lat' => 6.3156, 'lng' => 7.4203],
        ],
        'FCT' => [
            ['city' => 'Abuja Central', 'lat' => 9.0579, 'lng' => 7.4951],
            ['city' => 'Garki', 'lat' => 9.0183, 'lng' => 7.4875],
            ['city' => 'Wuse', 'lat' => 9.0765, 'lng' => 7.4880],
            ['city' => 'Maitama', 'lat' => 9.0882, 'lng' => 7.4994],
            ['city' => 'Kubwa', 'lat' => 9.1541, 'lng' => 7.3215],
        ],
        'Gombe' => [
            ['city' => 'Gombe', 'lat' => 10.2897, 'lng' => 11.1711],
            ['city' => 'Kumo', 'lat' => 10.0472, 'lng' => 11.2094],
            ['city' => 'Billiri', 'lat' => 9.8606, 'lng' => 11.2253],
        ],
        'Imo' => [
            ['city' => 'Owerri', 'lat' => 5.4836, 'lng' => 7.0333],
            ['city' => 'Orlu', 'lat' => 5.7959, 'lng' => 7.0350],
            ['city' => 'Okigwe', 'lat' => 5.8286, 'lng' => 7.3500],
            ['city' => 'Oguta', 'lat' => 5.7100, 'lng' => 6.8100],
        ],
        'Jigawa' => [
            ['city' => 'Dutse', 'lat' => 11.7561, 'lng' => 9.3386],
            ['city' => 'Hadejia', 'lat' => 12.4489, 'lng' => 10.0440],
            ['city' => 'Gumel', 'lat' => 12.6269, 'lng' => 9.3839],
            ['city' => 'Kazaure', 'lat' => 12.6475, 'lng' => 8.4108],
        ],
        'Kaduna' => [
            ['city' => 'Kaduna', 'lat' => 10.5222, 'lng' => 7.4383],
            ['city' => 'Zaria', 'lat' => 11.0855, 'lng' => 7.7106],
            ['city' => 'Kafanchan', 'lat' => 9.5833, 'lng' => 8.3000],
            ['city' => 'Kagoro', 'lat' => 9.6000, 'lng' => 8.3833],
        ],
        'Kano' => [
            ['city' => 'Kano', 'lat' => 11.9964, 'lng' => 8.5167],
            ['city' => 'Wudil', 'lat' => 11.8092, 'lng' => 8.8422],
            ['city' => 'Gwarzo', 'lat' => 12.0642, 'lng' => 8.0833],
            ['city' => 'Rano', 'lat' => 11.5500, 'lng' => 8.5833],
        ],
        'Katsina' => [
            ['city' => 'Katsina', 'lat' => 13.0059, 'lng' => 7.6000],
            ['city' => 'Daura', 'lat' => 13.0333, 'lng' => 8.3167],
            ['city' => 'Funtua', 'lat' => 11.5239, 'lng' => 7.3092],
            ['city' => 'Malumfashi', 'lat' => 11.7833, 'lng' => 7.6167],
        ],
        'Kebbi' => [
            ['city' => 'Birnin Kebbi', 'lat' => 12.4539, 'lng' => 4.1975],
            ['city' => 'Argungu', 'lat' => 12.7500, 'lng' => 4.5167],
            ['city' => 'Yauri', 'lat' => 10.7833, 'lng' => 4.7500],
            ['city' => 'Zuru', 'lat' => 11.4333, 'lng' => 5.2333],
        ],
        'Kogi' => [
            ['city' => 'Lokoja', 'lat' => 7.7969, 'lng' => 6.7433],
            ['city' => 'Okene', 'lat' => 7.5514, 'lng' => 6.2358],
            ['city' => 'Kabba', 'lat' => 7.8283, 'lng' => 6.0736],
            ['city' => 'Idah', 'lat' => 7.1108, 'lng' => 6.7367],
        ],
        'Kwara' => [
            ['city' => 'Ilorin', 'lat' => 8.5000, 'lng' => 4.5500],
            ['city' => 'Offa', 'lat' => 8.1500, 'lng' => 4.7167],
            ['city' => 'Jebba', 'lat' => 9.1167, 'lng' => 4.8167],
            ['city' => 'Lafiagi', 'lat' => 8.8500, 'lng' => 5.4167],
        ],
        'Lagos' => [
            ['city' => 'Lekki', 'lat' => 6.4698, 'lng' => 3.5852],
            ['city' => 'Ikeja', 'lat' => 6.6018, 'lng' => 3.3515],
            ['city' => 'Victoria Island', 'lat' => 6.4281, 'lng' => 3.4219],
            ['city' => 'Ikoyi', 'lat' => 6.4474, 'lng' => 3.4345],
            ['city' => 'Surulere', 'lat' => 6.5008, 'lng' => 3.3574],
        ],
        'Nasarawa' => [
            ['city' => 'Lafia', 'lat' => 8.4966, 'lng' => 8.5197],
            ['city' => 'Keffi', 'lat' => 8.8489, 'lng' => 7.8736],
            ['city' => 'Akwanga', 'lat' => 8.9064, 'lng' => 8.4075],
            ['city' => 'Nasarawa', 'lat' => 8.5389, 'lng' => 7.7036],
        ],
        'Niger' => [
            ['city' => 'Minna', 'lat' => 9.6139, 'lng' => 6.5569],
            ['city' => 'Bida', 'lat' => 9.0833, 'lng' => 6.0167],
            ['city' => 'Suleja', 'lat' => 9.1833, 'lng' => 7.1833],
            ['city' => 'Kontagora', 'lat' => 10.4035, 'lng' => 5.4691],
        ],
        'Ogun' => [
            ['city' => 'Abeokuta', 'lat' => 7.1475, 'lng' => 3.3619],
            ['city' => 'Ijebu-Ode', 'lat' => 6.8167, 'lng' => 3.9167],
            ['city' => 'Sagamu', 'lat' => 6.8333, 'lng' => 3.6500],
            ['city' => 'Ota', 'lat' => 6.6833, 'lng' => 3.2333],
        ],
        'Ondo' => [
            ['city' => 'Akure', 'lat' => 7.2526, 'lng' => 5.1931],
            ['city' => 'Ondo', 'lat' => 7.0833, 'lng' => 4.8333],
            ['city' => 'Owo', 'lat' => 7.1964, 'lng' => 5.5868],
            ['city' => 'Ikare-Akoko', 'lat' => 7.5230, 'lng' => 5.7578],
        ],
        'Osun' => [
            ['city' => 'Osogbo', 'lat' => 7.7669, 'lng' => 4.5567],
            ['city' => 'Ife', 'lat' => 7.4667, 'lng' => 4.5667],
            ['city' => 'Ilesa', 'lat' => 7.6167, 'lng' => 4.7333],
            ['city' => 'Ede', 'lat' => 7.7333, 'lng' => 4.4333],
        ],
        'Oyo' => [
            ['city' => 'Ibadan', 'lat' => 7.3776, 'lng' => 3.9470],
            ['city' => 'Ogbomoso', 'lat' => 8.1333, 'lng' => 4.2500],
            ['city' => 'Oyo', 'lat' => 7.8500, 'lng' => 3.9333],
            ['city' => 'Iseyin', 'lat' => 7.9667, 'lng' => 3.6000],
        ],
        'Plateau' => [
            ['city' => 'Jos', 'lat' => 9.8965, 'lng' => 8.8583],
            ['city' => 'Bukuru', 'lat' => 9.8000, 'lng' => 8.8667],
            ['city' => 'Pankshin', 'lat' => 9.3333, 'lng' => 9.4333],
            ['city' => 'Shendam', 'lat' => 8.8833, 'lng' => 9.5333],
        ],
        'Rivers' => [
            ['city' => 'Port Harcourt', 'lat' => 4.8156, 'lng' => 7.0498],
            ['city' => 'Obio-Akpor', 'lat' => 4.8581, 'lng' => 7.0013],
            ['city' => 'Eleme', 'lat' => 4.7854, 'lng' => 7.1170],
            ['city' => 'Bonny', 'lat' => 4.4261, 'lng' => 7.1686],
        ],
        'Sokoto' => [
            ['city' => 'Sokoto', 'lat' => 13.0533, 'lng' => 5.2342],
            ['city' => 'Tambuwal', 'lat' => 12.4058, 'lng' => 4.6469],
            ['city' => 'Gwadabawa', 'lat' => 13.3567, 'lng' => 5.2322],
        ],
        'Taraba' => [
            ['city' => 'Jalingo', 'lat' => 8.8933, 'lng' => 11.3600],
            ['city' => 'Wukari', 'lat' => 7.8667, 'lng' => 9.7833],
            ['city' => 'Bali', 'lat' => 7.8500, 'lng' => 10.9500],
            ['city' => 'Gembu', 'lat' => 6.7167, 'lng' => 11.2500],
        ],
        'Yobe' => [
            ['city' => 'Damaturu', 'lat' => 11.7470, 'lng' => 11.9608],
            ['city' => 'Potiskum', 'lat' => 11.7121, 'lng' => 11.0808],
            ['city' => 'Nguru', 'lat' => 12.8768, 'lng' => 10.4531],
            ['city' => 'Gashua', 'lat' => 12.8711, 'lng' => 11.0467],
        ],
        'Zamfara' => [
            ['city' => 'Gusau', 'lat' => 12.1704, 'lng' => 6.6611],
            ['city' => 'Kaura Namoda', 'lat' => 12.5933, 'lng' => 6.5864],
            ['city' => 'Talata Mafara', 'lat' => 12.5667, 'lng' => 6.0667],
            ['city' => 'Anka', 'lat' => 12.1100, 'lng' => 5.9233],
        ],
    ];

    /**
     * Property title templates for generating realistic listings.
     */
    private array $titleTemplates = [
        'residential' => [
            '{beds} Bedroom Flat in {city}',
            'Spacious {beds} Bedroom Apartment in {city}',
            'Modern {beds} Bedroom Duplex in {city}',
            'Executive {beds} Bedroom Bungalow in {city}',
            'Luxury {beds} Bedroom Terrace in {city}',
            'Newly Built {beds} Bedroom Flat in {city}',
            'Furnished {beds} Bedroom Apartment in {city}',
            'Self-Contained Studio in {city}',
            '{beds} Bedroom Semi-Detached House in {city}',
            'Well-Finished {beds} Bedroom Flat in {city}',
        ],
        'commercial' => [
            'Office Space in {city}',
            'Shop Space in {city} Market',
            'Commercial Plaza in {city}',
            'Warehouse Space in {city}',
            'Co-Working Office in {city}',
        ],
    ];

    /**
     * Description templates.
     */
    private array $descriptionTemplates = [
        "A beautifully designed property located in the heart of {city}, {state}. This property features modern finishes, excellent ventilation, and is situated in a serene environment with 24/7 security. Close to major roads, schools, hospitals, and shopping centers.\n\nFeatures include:\n• Tiled floors throughout\n• Modern kitchen with fitted cabinets\n• All rooms en-suite\n• Spacious parking space\n• Prepaid meter\n• Good water supply",

        "Well-maintained property available for rent in {city}, {state}. Located in a gated estate with round-the-clock security personnel. The property is within walking distance of markets, banks, and public transportation.\n\nKey highlights:\n• Pop ceiling design\n• Water heater in bathrooms\n• Spacious compound\n• Children's play area nearby\n• Tarred road network within estate",

        "Prime location property in {city}, {state}. Perfect for families and professionals looking for comfort and convenience. This property boasts of quality construction, modern amenities, and a family-friendly neighborhood.\n\nAmenities:\n• Constant electricity supply (estate transformer)\n• Borehole water\n• DSTV/Cable-ready\n• Spacious bedrooms\n• Guest toilet\n• Dedicated security post",

        "Affordable and comfortable property now available in {city}, {state}. Ideal for small families or young professionals. The environment is peaceful and the property is well-ventilated with good natural lighting.\n\nProperty features:\n• Freshly painted walls\n• Tiled floors\n• Screened windows\n• Good drainage system\n• Close to worship centers\n• Easy access to major highways",
    ];

    /**
     * Address templates for each area.
     */
    private array $addressPrefixes = [
        'Plot', 'No.', 'Block', 'House', 'Flat',
    ];

    private array $streetSuffixes = [
        'Street', 'Road', 'Avenue', 'Crescent', 'Close', 'Drive', 'Lane', 'Way',
    ];

    private array $streetNames = [
        'Unity', 'Ahmadu Bello', 'Awolowo', 'Independence', 'Constitution',
        'Nnamdi Azikiwe', 'Tafawa Balewa', 'Herbert Macaulay', 'Murtala Mohammed',
        'Yakubu Gowon', 'Obafemi', 'Sapele', 'Calabar', 'Mission', 'Church',
        'Adeola Odeku', 'Broad', 'Marina', 'Kingsway', 'Bank', 'Market',
        'Hospital', 'School', 'Stadium', 'Airport', 'New Layout', 'GRA',
        'Okpara', 'Zik', 'Ojike', 'Oba Akran', 'Allen', 'Toyin',
    ];

    /**
     * Price ranges per tier (annual rent in Naira).
     */
    private array $priceTiers = [
        'premium' => ['min' => 2500000, 'max' => 8000000],   // Lagos, Abuja, PH
        'high'    => ['min' => 800000, 'max' => 3000000],     // State capitals
        'medium'  => ['min' => 350000, 'max' => 1200000],     // Secondary cities
        'low'     => ['min' => 120000, 'max' => 500000],      // Rural/smaller towns
    ];

    /**
     * Determine price tier for a state/city combo.
     */
    private function getPriceTier(string $state, string $city): string
    {
        $premiumAreas = [
            'Lagos' => ['Lekki', 'Victoria Island', 'Ikoyi', 'Ikeja'],
            'FCT' => ['Abuja Central', 'Maitama', 'Wuse', 'Garki'],
            'Rivers' => ['Port Harcourt', 'Obio-Akpor'],
        ];

        foreach ($premiumAreas as $premState => $premCities) {
            if ($state === $premState && in_array($city, $premCities)) {
                return 'premium';
            }
        }

        $highTierStates = ['Lagos', 'FCT', 'Rivers', 'Oyo', 'Anambra', 'Delta', 'Edo', 'Kaduna', 'Kano', 'Enugu'];
        if (in_array($state, $highTierStates)) {
            return 'high';
        }

        $mediumTierStates = [
            'Ogun', 'Ondo', 'Osun', 'Ekiti', 'Kwara', 'Abia', 'Imo',
            'Akwa Ibom', 'Cross River', 'Bayelsa', 'Ebonyi', 'Benue',
            'Plateau', 'Nasarawa', 'Niger', 'Kogi', 'Taraba',
        ];
        if (in_array($state, $mediumTierStates)) {
            return 'medium';
        }

        return 'low';
    }

    /**
     * Generate a realistic Nigerian address.
     */
    private function generateAddress(string $city): string
    {
        $prefix = $this->addressPrefixes[array_rand($this->addressPrefixes)];
        $number = rand(1, 45);
        $street = $this->streetNames[array_rand($this->streetNames)];
        $suffix = $this->streetSuffixes[array_rand($this->streetSuffixes)];

        return "{$prefix} {$number}, {$street} {$suffix}, {$city}";
    }

    /**
     * Seed the database with Nigerian demo properties.
     */
    public function run(): void
    {
        // Create demo owner users
        $owners = [];
        $ownerData = [
            ['name' => 'Chinedu Okonkwo', 'email' => 'chinedu@rentify.demo'],
            ['name' => 'Amina Ibrahim', 'email' => 'amina@rentify.demo'],
            ['name' => 'Oluwaseun Adeyemi', 'email' => 'seun@rentify.demo'],
            ['name' => 'Blessing Okafor', 'email' => 'blessing@rentify.demo'],
            ['name' => 'Musa Abdullahi', 'email' => 'musa@rentify.demo'],
            ['name' => 'Funke Adebanjo', 'email' => 'funke@rentify.demo'],
            ['name' => 'Emeka Nwachukwu', 'email' => 'emeka@rentify.demo'],
            ['name' => 'Hauwa Bello', 'email' => 'hauwa@rentify.demo'],
        ];

        foreach ($ownerData as $data) {
            $owners[] = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
        }

        $propertyCount = 0;

        foreach ($this->statesAndTowns as $state => $towns) {
            foreach ($towns as $townData) {
                $city = $townData['city'];
                $lat = $townData['lat'];
                $lng = $townData['lng'];

                // Create 1-2 properties per town
                $numProperties = rand(1, 2);
                for ($i = 0; $i < $numProperties; $i++) {
                    $owner = $owners[array_rand($owners)];
                    $category = rand(1, 5) <= 4 ? 'residential' : 'commercial';
                    $type = ['rent', 'sale', 'sale_or_rent'][array_rand(['rent', 'sale', 'sale_or_rent'])];
                    $structureType = $category === 'commercial' ? 'single_unit' : (rand(0, 1) ? 'single_unit' : 'multi_unit');

                    $beds = $category === 'commercial' ? 0 : rand(1, 5);
                    $baths = $category === 'commercial' ? rand(1, 2) : max(1, $beds - rand(0, 1));

                    // Generate title
                    $templates = $this->titleTemplates[$category];
                    $titleTemplate = $templates[array_rand($templates)];
                    $title = str_replace(['{beds}', '{city}'], [$beds, $city], $titleTemplate);

                    // Generate description
                    $descTemplate = $this->descriptionTemplates[array_rand($this->descriptionTemplates)];
                    $description = str_replace(['{city}', '{state}'], [$city, $state], $descTemplate);

                    // Generate pricing
                    $tier = $this->getPriceTier($state, $city);
                    $priceRange = $this->priceTiers[$tier];
                    $rentPrice = round(rand($priceRange['min'], $priceRange['max']) / 10000) * 10000;
                    $salePrice = $category === 'residential' ? $rentPrice * rand(15, 30) : $rentPrice * rand(20, 50);
                    $cautionDeposit = round($rentPrice * (rand(5, 15) / 100) / 10000) * 10000;
                    $agencyFee = round($rentPrice * (rand(8, 15) / 100) / 10000) * 10000;

                    // Add slight coordinate variation for properties in same town
                    $latOffset = (rand(-500, 500) / 100000);
                    $lngOffset = (rand(-500, 500) / 100000);

                    $property = Property::create([
                        'user_id' => $owner->id,
                        'title' => $title,
                        'description' => $description,
                        'address' => $this->generateAddress($city),
                        'state' => $state,
                        'city' => $city,
                        'latitude' => $lat + $latOffset,
                        'longitude' => $lng + $lngOffset,
                        'type' => $type,
                        'category' => $category,
                        'structure_type' => $structureType,
                        'status' => 'published',
                        'current_stage' => 5,
                    ]);

                    // Create unit(s) for the property
                    $numUnits = $structureType === 'multi_unit' ? rand(2, 8) : 1;
                    for ($u = 0; $u < $numUnits; $u++) {
                        $unitBeds = $category === 'commercial' ? 0 : ($numUnits > 1 ? rand(1, 3) : $beds);
                        $unitBaths = max(1, $unitBeds - rand(0, 1));
                        $unitRent = $numUnits > 1 ? round($rentPrice / rand(2, 4) / 10000) * 10000 : $rentPrice;

                        PropertyUnit::create([
                            'property_id' => $property->id,
                            'title' => $numUnits > 1 ? 'Unit ' . ($u + 1) : $title,
                            'bedrooms' => $unitBeds,
                            'bathrooms' => $unitBaths,
                            'rent_price' => $unitRent,
                            'sale_price' => $type !== 'rent' ? $salePrice : null,
                            'caution_deposit' => $cautionDeposit,
                            'agency_fee' => $agencyFee,
                            'status' => rand(1, 5) <= 4 ? 'available' : 'occupied',
                        ]);
                    }

                    $propertyCount++;
                }
            }
        }

        $this->command->info("✅ Seeded {$propertyCount} properties across all 36 Nigerian states + FCT.");
    }
}
