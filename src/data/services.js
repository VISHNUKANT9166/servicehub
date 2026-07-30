import plumbing from "../assets/images/services/plumbing.jpg";
import electrician from "../assets/images/services/electrician.jpg";
import carpenter from "../assets/images/services/carpenter.jpg";
import cleaning from "../assets/images/services/home-cleaning.jpg";
import acRepair from "../assets/images/services/ac-repair.jpg";
import salon from "../assets/images/services/salon-at-home.jpg";
import pest from "../assets/images/services/pest-control.jpg";
import ro from "../assets/images/services/ro-service.jpg";

const services = [
    {
        id: 1,
        title: "Plumbing",
        image: plumbing,
        category: "Home Repair",
        professional: "Rahul Sharma",
        experience: 8,
        city: "Noida",
        price: 299,
        rating: 4.8,
        reviews: 250,
        availability: "Available Today",
        favorite: false,
        description: "Professional plumbing services including leakage repair, pipe installation, tap fitting, and bathroom maintenance.",
        includes: [
            "Leakage Repair",
            "Tap Installation",
            "Pipe Fitting",
            "Bathroom Plumbing",
            "Kitchen Plumbing",
            "Water Tank Cleaning"
        ],

        reviewsData: [
            {
                id: 1,
                name: "Aman Verma",
                rating: 5,
                comment: "Excellent service. The plumber arrived on time and fixed the leakage quickly."
            },
            {
                id: 2,
                name: "Priya Sharma",
                rating: 4,
                comment: "Very professional and polite. Highly recommended."
            },
            {
                id: 3,
                name: "Rohit Singh",
                rating: 5,
                comment: "Affordable pricing and quality work."
            }
        ]
    },

    {
        id: 2,
        title: "Electrician",
        image: electrician,
        category: "Home Repair",
        professional: "Amit Kumar",
        experience: 6,
        city: "Delhi",
        price: 399,
        rating: 4.7,
        reviews: 180,
        availability: "Available Today",
        favorite: false,
        description:
            "Electrical installation, switchboard repair, fan installation, wiring, and troubleshooting.",
        includes: [
            "Fan Installation",
            "Switch Board Repair",
            "House Wiring",
            "MCB Replacement",
            "Light Installation",
            "Power Backup Check"
        ],
        reviewsData: [
            {
                id: 1,
                name: "Vikas Gupta",
                rating: 5,
                comment: "Quick wiring repair and very professional."
            },
            {
                id: 2,
                name: "Neha Jain",
                rating: 4,
                comment: "Solved the electrical issue within an hour."
            }
        ]
    },

    {
        id: 3,
        title: "Carpenter",
        image: carpenter,
        category: "Furniture",
        professional: "Suresh Verma",
        experience: 10,
        city: "Ghaziabad",
        price: 499,
        rating: 4.9,
        reviews: 320,
        availability: "Available Tomorrow",
        favorite: false,
        description:
            "Furniture repair, modular furniture assembly, wooden door installation, and custom carpentry.",
        includes: [
            "Furniture Repair",
            "Door Installation",
            "Wardrobe Assembly",
            "Table Repair",
            "Wood Polishing",
            "Shelf Installation"
        ],
        reviewsData: [
            {
                id: 1,
                name: "Ankit Sharma",
                rating: 5,
                comment: "Excellent furniture repair work."
            },
            {
                id: 2,
                name: "Ritu Singh",
                rating: 5,
                comment: "Very skilled carpenter. Highly recommended."
            }
        ]
    },

    {
        id: 4,
        title: "Home Cleaning",
        image: cleaning,
        category: "Cleaning",
        professional: "Neha Sharma",
        experience: 5,
        city: "Noida",
        price: 699,
        rating: 4.9,
        reviews: 410,
        availability: "Available Today",
        favorite: false,
        description:
            "Complete home deep cleaning including kitchen, bathroom, bedroom, and living room.",
        includes: [
            "Kitchen Deep Cleaning",
            "Bathroom Cleaning",
            "Bedroom Cleaning",
            "Living Room Cleaning",
            "Floor Scrubbing",
            "Dust Removal"
        ],
        reviewsData: [
            {
                id: 1,
                name: "Sakshi Verma",
                rating: 5,
                comment: "My house looks brand new after the cleaning."
            },
            {
                id: 2,
                name: "Mohit Kumar",
                rating: 4,
                comment: "Professional staff and good equipment."
            }
        ]
    },

    {
        id: 5,
        title: "AC Repair",
        image: acRepair,
        category: "Appliance Repair",
        professional: "Rohit Singh",
        experience: 7,
        city: "Delhi",
        price: 599,
        rating: 4.8,
        reviews: 295,
        availability: "Available Today",
        favorite: false,
        description:
            "AC servicing, gas refill, installation, cooling issues, and annual maintenance.",
        includes: [
            "AC Installation",
            "Gas Refill",
            "Cooling Issue Repair",
            "AC Servicing",
            "Filter Cleaning",
            "Annual Maintenance"
        ],
        reviewsData: [
            {
                id: 1,
                name: "Pooja Singh",
                rating: 5,
                comment: "AC cooling issue resolved quickly."
            },
            {
                id: 2,
                name: "Rakesh Kumar",
                rating: 4,
                comment: "Very professional technician."
            }
        ]
    },

    {
        id: 6,
        title: "Salon at Home",
        image: salon,
        category: "Beauty",
        professional: "Priya Gupta",
        experience: 6,
        city: "Greater Noida",
        price: 499,
        rating: 4.9,
        reviews: 360,
        availability: "Available Tomorrow",
        favorite: false,
        description:
            "Haircut, facial, waxing, manicure, pedicure, makeup, and grooming services at home.",
        includes: [
            "Haircut",
            "Facial",
            "Waxing",
            "Manicure",
            "Pedicure",
            "Party Makeup"
        ],
        reviewsData: [
            {
                id: 1,
                name: "Sneha Gupta",
                rating: 5,
                comment: "Amazing service and very friendly beautician."
            },
            {
                id: 2,
                name: "Komal Verma",
                rating: 5,
                comment: "Loved the facial and manicure."
            }
        ]
    },

    {
        id: 7,
        title: "Pest Control",
        image: pest,
        category: "Cleaning",
        professional: "Deepak Yadav",
        experience: 9,
        city: "Delhi",
        price: 899,
        rating: 4.7,
        reviews: 145,
        availability: "Available This Week",
        favorite: false,
        description:
            "Cockroach, termite, mosquito, and rodent pest control with safe chemical treatment.",
        includes: [
            "Cockroach Treatment",
            "Termite Control",
            "Mosquito Control",
            "Rodent Control",
            "Herbal Treatment",
            "One Month Warranty"
        ],
        reviewsData: [
            {
                id: 1,
                name: "Rahul Yadav",
                rating: 5,
                comment: "No more cockroaches after the treatment."
            },
            {
                id: 2,
                name: "Deepa Sharma",
                rating: 4,
                comment: "Effective and safe pest control service."
            }
        ]
    },

    {
        id: 8,
        title: "RO Water Purifier Service",
        image: ro,
        category: "Appliance Repair",
        professional: "Vikas Mishra",
        experience: 5,
        city: "Noida",
        price: 349,
        rating: 4.8,
        reviews: 190,
        availability: "Available Today",
        favorite: false,
        description:
            "RO installation, filter replacement, maintenance, water quality testing, and repair.",
        includes: [
            "RO Installation",
            "Filter Replacement",
            "Water Quality Testing",
            "RO Repair",
            "Complete Servicing",
            "Leakage Check"
        ],
        reviewsData: [
            {
                id: 1,
                name: "Ajay Singh",
                rating: 5,
                comment: "RO service completed quickly and efficiently."
            },
            {
                id: 2,
                name: "Kiran Verma",
                rating: 4,
                comment: "Water quality improved after servicing."
            }
        ]
    }
];

export default services;