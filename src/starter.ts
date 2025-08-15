import { Logger } from '@nestjs/common';
import { ENUM_USER_STATUS } from './libs/enum';
import { PrismaClient } from '@prisma/client';
import { BcryptService } from './common/bcrypt/bcrypt.service';

const prisma = new PrismaClient();
const bcryptService = new BcryptService();

export async function createSuperAdmin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    const hashedPassword = await bcryptService.hash(password);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isSuperAdmin: true,
        status: ENUM_USER_STATUS.ACTIVE,
      },
    });
    Logger.log(`Super admin user created`);
  } else {
    Logger.log(`Super admin user already exists`);
  }
}
