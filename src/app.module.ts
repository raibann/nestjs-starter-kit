import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';

@Module({
  imports: [AppConfigModule, AuthModule, PermissionModule, RoleModule],
})
export class AppModule {}
