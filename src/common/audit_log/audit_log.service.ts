import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async createAuditLog(userId: string, action: string, data: any) {
    await this.prisma.auditLog.create({
      data: {
        userId,
        action,
        data,
      },
    });
  }
}
