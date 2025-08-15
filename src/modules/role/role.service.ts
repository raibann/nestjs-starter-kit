import {
  ConflictException,
  // Inject,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
// import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    try {
      const { name, description, permissions } = createRoleDto;

      const existingRole = await this.prisma.role.findFirst({
        where: { name },
      });

      if (existingRole) {
        throw new ConflictException('Role already exists');
      }

      const permissionIds = permissions.map((permission) => permission.id);

      const permission = await this.prisma.permission.findMany({
        where: { id: { in: permissionIds } },
        select: {
          id: true,
        },
      });

      if (permission.length !== permissionIds.length) {
        throw new NotFoundException('Permission not found');
      }
      const role = await this.prisma.role.create({
        data: {
          name,
          description,
          rolePermission: {
            createMany: {
              data: permissionIds.map((permissionId) => ({
                permissionId,
              })),
            },
          },
        },
      });

      // await this.cacheManager.clear();

      return role;
    } catch (error) {
      Logger.error(error);
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ServiceUnavailableException('Failed to create role');
    }
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      const { name, description, permissions } = updateRoleDto;

      const existingRole = await this.prisma.role.findFirst({
        where: { id },
      });

      if (!existingRole) {
        throw new NotFoundException('Role not found');
      }

      const permissionIds = permissions.map((permission) => permission.id);

      const permission = await this.prisma.permission.findMany({
        where: { id: { in: permissionIds } },
        select: {
          id: true,
        },
      });

      if (permission.length !== permissionIds.length) {
        throw new NotFoundException('Permission not found');
      }

      const data = await this.prisma.$transaction(async (tx) => {
        // delete existing role permission
        await tx.rolePermission.deleteMany({
          where: { roleId: id },
        });

        // update role
        const role = await tx.role.update({
          where: { id },
          data: {
            name,
            description,
            rolePermission: {
              createMany: {
                data: permissionIds.map((permissionId) => ({
                  permissionId,
                })),
              },
            },
          },
        });

        return role;
      });

      // await this.cacheManager.clear();

      return data;
    } catch (error) {
      Logger.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ServiceUnavailableException('Failed to update role');
    }
  }

  async deleteRole(id: string) {
    try {
      const role = await this.prisma.role.delete({
        where: { id },
      });

      // await this.cacheManager.clear();

      return role;
    } catch (error) {
      Logger.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ServiceUnavailableException('Failed to delete role');
    }
  }
}
