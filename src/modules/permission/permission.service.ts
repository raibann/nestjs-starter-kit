import {
  // Inject,
  Injectable,
  NotFoundException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
// import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class PermissionService {
  constructor(
    private readonly prisma: PrismaService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createPermission(createPermissionDto: CreatePermissionDto) {
    try {
      const permission = await this.prisma.permission.create({
        data: createPermissionDto,
      });
      // await this.cacheManager.clear();
      return permission;
    } catch (error) {
      Logger.error(error);
      throw new ServiceUnavailableException('Failed to create permission');
    }
  }

  async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto) {
    try {
      const permission = await this.prisma.permission.update({
        where: { id },
        data: updatePermissionDto,
      });
      // await this.cacheManager.clear();
      return permission;
    } catch (error) {
      Logger.error(error);
      throw new ServiceUnavailableException('Failed to update permission');
    }
  }

  async deletePermission(id: string) {
    try {
      const permission = await this.prisma.permission.delete({
        where: { id },
      });

      // await this.cacheManager.clear();
      return permission;
    } catch (error) {
      Logger.error(error);
      throw new ServiceUnavailableException('Failed to delete permission');
    }
  }

  async getPermission(id: string) {
    try {
      const permission = await this.prisma.permission.findUnique({
        where: { id },
      });

      if (!permission) {
        throw new NotFoundException('Permission not found');
      }

      return permission;
    } catch (error) {
      Logger.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ServiceUnavailableException('Failed to get permission');
    }
  }

  async getAllPermissions(skip: number, take: number, search: string) {
    try {
      const permissions = await this.prisma.permission.findMany({
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      });

      const total = await this.prisma.permission.count();

      return {
        data: permissions,
        total,
      };
    } catch (error) {
      Logger.error(error);
      throw new ServiceUnavailableException('Failed to get all permissions');
    }
  }
}
