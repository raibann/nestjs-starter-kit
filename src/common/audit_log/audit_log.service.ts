import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async createAuditLog(userId: string, action: string, data: any) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action,
          data,
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new ServiceUnavailableException('Failed to create audit log');
    }
  }
}
