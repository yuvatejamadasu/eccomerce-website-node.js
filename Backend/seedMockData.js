import { db } from './src/config/firebase.js';
import { COLLECTIONS } from './src/utils/constants.js';
import admin from 'firebase-admin';

const mockProducts = [
  {
    title: "Premium Chronograph Quartz Watch",
    price: 129.99,
    description: "Elegant chronograph quartz wristwatch with a premium brown leather strap, water-resistant casing, and modern date display. Perfect for business meetings and casual outings alike.",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    rating: {
      rate: 4.8,
      count: 184
    }
  },
  {
    title: "Classic Retro Acetate Sunglasses",
    price: 45.00,
    description: "Retro-inspired acetate frame sunglasses featuring polarized UV400 protective lenses, reinforced metal hinges, and a lightweight, durable construction for all-day comfort.",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60",
    rating: {
      rate: 4.5,
      count: 96
    }
  },
  {
    title: "Minimalist Leather Court Sneakers",
    price: 89.99,
    description: "Ultra-comfortable minimalist sneakers crafted from premium full-grain white leather, featuring a cushioned footbed, breathable mesh lining, and a durable vulcanized rubber cupsole.",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=60",
    rating: {
      rate: 4.7,
      count: 215
    }
  },
  {
    title: "Urban Commuter Waterproof Backpack",
    price: 59.99,
    description: "Durable commuter backpack made from waterproof Oxford fabric, featuring a padded 15.6-inch laptop compartment, ergonomic shoulder straps, and a hidden anti-theft back pocket.",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
    rating: {
      rate: 4.6,
      count: 154
    }
  },
  {
    title: "Eco-Friendly Non-Slip Yoga Mat",
    price: 29.99,
    description: "High-density TPE yoga mat with dual-sided non-slip textures, 6mm cushioning for joint support, and alignment lines. Includes a free carrying strap.",
    category: "sports",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format&fit=crop&q=60",
    rating: {
      rate: 4.7,
      count: 320
    }
  },
  {
    title: "Adjustable Cast Iron Smart Dumbbell Set",
    price: 199.99,
    description: "Heavy-duty cast iron dumbbell set with an innovative dial mechanism that adjusts weight from 5 to 52.5 lbs instantly. Includes a molded storage tray.",
    category: "sports",
    image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&auto=format&fit=crop&q=60",
    rating: {
      rate: 4.9,
      count: 88
    }
  },
  {
    title: "Double-Wall Insulated Water Bottle",
    price: 24.99,
    description: "Premium food-grade 18/8 stainless steel bottle with double-wall vacuum insulation to keep drinks ice cold for 24 hours or piping hot for 12 hours. Sweat-free powder coat finish.",
    category: "sports",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60",
    rating: {
      rate: 4.4,
      count: 412
    }
  },
  {
    title: "Retro 15-Bar Pump Espresso Machine",
    price: 149.99,
    description: "Express your inner barista with this retro 15-bar Italian pump espresso machine. Features a manual steam wand for rich milk frothing, a removable water tank, and a cup warmer.",
    category: "home & living",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60",
    rating: {
      rate: 4.6,
      count: 128
    }
  },
  {
    title: "Minimalist Stepless Dimming Table Lamp",
    price: 39.99,
    description: "Sleek tabletop lamp featuring stepless touch-sensitive dimming, eye-caring warm white LED, an integrated USB fast-charging port, and a weighted solid wood base.",
    category: "home & living",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60",
    rating: {
      rate: 4.3,
      count: 95
    }
  },
  {
    title: "Handwoven Natural Rattan Plant Stand",
    price: 34.99,
    description: "Add a touch of organic warmth to your living room with this handwoven natural rattan plant stand. Sturdy design suitable for small-to-medium decorative planters.",
    category: "home & living",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop&q=60",
    rating: {
      rate: 4.5,
      count: 64
    }
  }
];

async function seed() {
  const productsRef = db.collection(COLLECTIONS.PRODUCTS);
  let count = 0;
  for (const p of mockProducts) {
    const product = {
      title: p.title,
      price: Number(p.price),
      description: p.description || '',
      category: p.category?.toLowerCase() || 'uncategorized',
      image: p.image || '',
      rating: {
        rate: Number(p.rating?.rate) || 0,
        count: Number(p.rating?.count) || 0,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    await productsRef.add(product);
    count++;
  }
  console.log(`Seeded ${count} mock products to Firebase Firestore.`);
  process.exit(0);
}

seed().catch(err => {
  console.error("Error seeding data:", err);
  process.exit(1);
});
