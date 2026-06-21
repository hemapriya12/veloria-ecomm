import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const buyers = [
  { email: "buyer@gmail.com",     password: "buy",       firstName: "Buyer",     lastName: "One"   },
  { email: "abcd@gmail.com",      password: "abcdefgh",  firstName: "Abcd",      lastName: "User"  },
  { email: "efgh@gmail.com",      password: "abcdefgh",  firstName: "Efgh",      lastName: "User"  },
  { email: "ijkl@gmail.com",      password: "ijklmnop",  firstName: "Ijkl",      lastName: "User"  },
  { email: "mnop@gmail.com",      password: "ijklmnop",  firstName: "Mnop",      lastName: "User"  },
  { email: "qrst@gmail.com",      password: "qrstuvwx",  firstName: "Qrst",      lastName: "User"  },
  { email: "uvwx@gmail.com",      password: "qrstuvwx",  firstName: "Uvwx",      lastName: "User"  },
  { email: "hemapriya@gmail.com", password: "hemapriya", firstName: "Hemapriya", lastName: "User"  },
];

const sellers = [
  { email: "seller@gmail.com",          password: "sell",      firstName: "Seller",     lastName: "One"   },
  { email: "abcdseller@gmail.com",      password: "abcdefgh",  firstName: "Abcd",       lastName: "Seller"},
  { email: "efghseller@gmail.com",      password: "abcdefgh",  firstName: "Efgh",       lastName: "Seller"},
  { email: "ijklseller@gmail.com",      password: "ijklmnop",  firstName: "Ijkl",       lastName: "Seller"},
  { email: "mnopseller@gmail.com",      password: "ijklmnop",  firstName: "Mnop",       lastName: "Seller"},
  { email: "qrstseller@gmail.com",      password: "qrstuvwx",  firstName: "Qrst",       lastName: "Seller"},
  { email: "uvwxseller@gmail.com",      password: "qrstuvwx",  firstName: "Uvwx",       lastName: "Seller"},
  { email: "hemapriyaseller@gmail.com", password: "hemapriya", firstName: "Hemapriya",  lastName: "Seller"},
];

async function seedUsers() {
  let created = 0;
  let skipped = 0;

  const allUsers = [
    ...buyers.map(u => ({ ...u, role: "user" as const })),
    ...sellers.map(u => ({ ...u, role: "seller" as const })),
  ];

  for (const u of allUsers) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) { skipped++; continue; }

    await prisma.user.create({
      data: {
        id:           randomUUID(),
        firstName:    u.firstName,
        lastName:     u.lastName,
        email:        u.email,
        passwordHash: await bcrypt.hash(u.password, 10),
        role:         u.role,
      },
    });
    console.log(`  ✓ ${u.role.padEnd(6)} ${u.email}`);
    created++;
  }

  console.log(`\nDone — created: ${created}, skipped: ${skipped}`);
}

seedUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
