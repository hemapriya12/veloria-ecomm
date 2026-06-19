import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  // Electronics
  { name: "Electronics",                    slug: "electronics"                   },
  { name: "Mobile Phones",                  slug: "mobile-phones"                 },
  { name: "Laptops & Computers",            slug: "laptops-computers"             },
  { name: "Tablets",                        slug: "tablets"                       },
  { name: "Cameras & Photography",          slug: "cameras-photography"           },
  { name: "Headphones & Earbuds",           slug: "headphones-earbuds"            },
  { name: "Smart Home",                     slug: "smart-home"                    },
  { name: "TV & Home Theatre",              slug: "tv-home-theatre"               },
  { name: "Wearable Technology",            slug: "wearable-technology"           },
  { name: "Gaming Consoles & Accessories",  slug: "gaming-consoles"               },
  { name: "PC Gaming",                      slug: "pc-gaming"                     },
  { name: "Printers & Ink",                 slug: "printers-ink"                  },
  { name: "Networking & Wi-Fi",             slug: "networking-wifi"               },

  // Fashion
  { name: "Men's Clothing",                 slug: "mens-clothing"                 },
  { name: "Women's Clothing",               slug: "womens-clothing"               },
  { name: "Kids' Clothing",                 slug: "kids-clothing"                 },
  { name: "Men's Shoes",                    slug: "mens-shoes"                    },
  { name: "Women's Shoes",                  slug: "womens-shoes"                  },
  { name: "Kids' Shoes",                    slug: "kids-shoes"                    },
  { name: "Handbags & Wallets",             slug: "handbags-wallets"              },
  { name: "Jewelry",                        slug: "jewelry"                       },
  { name: "Watches",                        slug: "watches"                       },
  { name: "Sunglasses",                     slug: "sunglasses"                    },
  { name: "Luggage & Travel Bags",          slug: "luggage-travel-bags"           },
  { name: "T-Shirts",                       slug: "t-shirts"                      },

  // Beauty & Health
  { name: "Skincare",                       slug: "skincare"                      },
  { name: "Haircare",                       slug: "haircare"                      },
  { name: "Makeup & Cosmetics",             slug: "makeup-cosmetics"              },
  { name: "Fragrances",                     slug: "fragrances"                    },
  { name: "Men's Grooming",                 slug: "mens-grooming"                 },
  { name: "Health & Wellness",              slug: "health-wellness"               },
  { name: "Vitamins & Supplements",         slug: "vitamins-supplements"          },
  { name: "Personal Care",                  slug: "personal-care"                 },
  { name: "Baby Care",                      slug: "baby-care"                     },

  // Home & Kitchen
  { name: "Kitchen & Dining",              slug: "kitchen-dining"                },
  { name: "Furniture",                     slug: "furniture"                     },
  { name: "Bedding & Pillows",             slug: "bedding-pillows"               },
  { name: "Bath & Towels",                 slug: "bath-towels"                   },
  { name: "Home Décor",                    slug: "home-decor"                    },
  { name: "Lighting",                      slug: "lighting"                      },
  { name: "Storage & Organization",        slug: "storage-organization"          },
  { name: "Cleaning Supplies",             slug: "cleaning-supplies"             },
  { name: "Appliances",                    slug: "appliances"                    },
  { name: "Air Purifiers & Fans",          slug: "air-purifiers-fans"            },

  // Books & Media
  { name: "Books",                          slug: "books"                         },
  { name: "eBooks",                         slug: "ebooks"                        },
  { name: "Music",                          slug: "music"                         },
  { name: "Movies & TV",                    slug: "movies-tv"                     },
  { name: "Video Games",                    slug: "video-games"                   },
  { name: "Software",                       slug: "software"                      },

  // Sports & Outdoors
  { name: "Sports & Outdoors",              slug: "sports-outdoors"               },
  { name: "Exercise & Fitness",             slug: "exercise-fitness"              },
  { name: "Cycling",                        slug: "cycling"                       },
  { name: "Camping & Hiking",               slug: "camping-hiking"                },
  { name: "Swimming & Water Sports",        slug: "swimming-water-sports"         },
  { name: "Yoga & Pilates",                 slug: "yoga-pilates"                  },

  // Toys & Kids
  { name: "Toys & Games",                   slug: "toys-games"                    },
  { name: "Board Games & Puzzles",          slug: "board-games-puzzles"           },
  { name: "Baby & Toddler Toys",            slug: "baby-toddler-toys"             },
  { name: "Action Figures & Collectibles",  slug: "action-figures"                },
  { name: "Educational Toys",               slug: "educational-toys"              },

  // Automotive
  { name: "Car Accessories",               slug: "car-accessories"               },
  { name: "Motorcycle Accessories",        slug: "motorcycle-accessories"        },
  { name: "Car Care",                      slug: "car-care"                      },
  { name: "Tools & Equipment",             slug: "tools-equipment"               },

  // Office & Stationery
  { name: "Office Supplies",               slug: "office-supplies"               },
  { name: "Stationery & Writing",          slug: "stationery-writing"            },
  { name: "Arts & Crafts",                 slug: "arts-crafts"                   },
  { name: "Musical Instruments",           slug: "musical-instruments"           },

  // Food & Grocery
  { name: "Grocery & Gourmet",             slug: "grocery-gourmet"               },
  { name: "Snacks & Beverages",            slug: "snacks-beverages"              },
  { name: "Organic & Natural Foods",       slug: "organic-natural-foods"         },

  // Garden & Pets
  { name: "Garden & Outdoors",             slug: "garden-outdoors"               },
  { name: "Plants & Seeds",               slug: "plants-seeds"                  },
  { name: "Pet Supplies",                  slug: "pet-supplies"                  },
  { name: "Dog Supplies",                  slug: "dog-supplies"                  },
  { name: "Cat Supplies",                  slug: "cat-supplies"                  },

  // Industrial
  { name: "Industrial & Scientific",       slug: "industrial-scientific"         },
];

async function main() {
  console.log(`Seeding ${categories.length} categories...`);
  let created = 0;
  let skipped = 0;

  for (const cat of categories) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (existing) {
      skipped++;
      continue;
    }
    await prisma.category.create({ data: cat });
    created++;
  }

  console.log(`✓ Created: ${created}  |  Already existed: ${skipped}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
