import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('AlphaPanel@2026', 12);

  await prisma.user.upsert({
    where: { email: 'admin@alphapanel.local' },
    update: {},
    create: {
      email: 'admin@alphapanel.local',
      username: 'admin',
      passwordHash,
      displayName: 'AlphaPanel Admin',
      role: UserRole.SUPER_ADMIN,
    },
  });

  await prisma.server.upsert({
    where: { hostname: 'localhost' },
    update: {},
    create: {
      name: 'Primary Server',
      hostname: 'localhost',
      ipAddress: '127.0.0.1',
      isPrimary: true,
    },
  });

  await prisma.package.upsert({
    where: { name: 'Starter' },
    update: {},
    create: {
      name: 'Starter',
      description: 'Default AlphaPanel package',
      diskQuotaMb: 10240,
      bandwidthMb: 102400,
      maxDomains: 5,
      maxDatabases: 5,
      maxEmailAccounts: 10,
    },
  });

  await prisma.phpVersion.createMany({
    data: [
      { version: '8.1', isDefault: false },
      { version: '8.2', isDefault: false },
      { version: '8.3', isDefault: true },
    ],
    skipDuplicates: true,
  });

  await prisma.oneClickApp.createMany({
    data: [
      { slug: 'wordpress', name: 'WordPress', scriptPath: 'installers/wordpress.sh' },
      { slug: 'laravel', name: 'Laravel', scriptPath: 'installers/laravel.sh' },
      { slug: 'nextjs', name: 'Next.js', scriptPath: 'installers/nextjs.sh' },
      { slug: 'phpmyadmin', name: 'phpMyAdmin', scriptPath: 'installers/phpmyadmin.sh' },
    ],
    skipDuplicates: true,
  });

  console.log('AlphaPanel seed completed.');
  console.log('  Super Admin: admin@alphapanel.local / AlphaPanel@2026 (role: SUPER_ADMIN)');
  console.log('  Roles: SUPER_ADMIN, ADMIN, RESELLER, USER');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
