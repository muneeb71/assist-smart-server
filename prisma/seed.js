import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = ['employee', 'contractor', 'supervisor'];
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Roles seeded:', roles);

  // Seed company branding if not exists
  let companyBranding = await prisma.companyBranding.findFirst();
  if (!companyBranding) {
    companyBranding = await prisma.companyBranding.create({
      data: {
        name: 'Seed Company',
        documentControlNumber: 'DOC-001',
        logo: 'https://example.com/logo.png',
      },
    });
    console.log('Company branding seeded');
  }

  // Seed user
  const email = 'xyz@gmail.com';
  const fullName = 'Seed User';
  const role = await prisma.role.findUnique({ where: { name: 'supervisor' } });

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      fullName,
      roleId: role.id,
    },
  });
  console.log('User seeded:', email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 