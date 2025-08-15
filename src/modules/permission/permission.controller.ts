import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Permission')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller({
  path: 'permission',
  version: '1',
})
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {
    this.permissionService = permissionService;
  }

  @Post()
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.createPermission(createPermissionDto);
  }

  @Put(':id')
  async updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return await this.permissionService.updatePermission(
      id,
      updatePermissionDto,
    );
  }

  @Delete(':id')
  async deletePermission(@Param('id') id: string) {
    return await this.permissionService.deletePermission(id);
  }

  @Get(':id')
  async getPermission(@Param('id') id: string) {
    return await this.permissionService.getPermission(id);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false, default: '' })
  @ApiQuery({ name: 'skip', required: false, default: 0 })
  @ApiQuery({ name: 'take', required: false, default: 10 })
  async getAllPermissions(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('search') search: string,
  ) {
    return await this.permissionService.getAllPermissions(+skip, +take, search);
  }
}
