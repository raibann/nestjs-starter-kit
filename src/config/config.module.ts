import { createKeyv, Keyv } from '@keyv/redis';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheableMemory } from 'cacheable';
import { AppConfigService } from './config.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { BcryptModule } from 'src/common/bcrypt/bcrypt.module';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';
import { AuditLogModule } from 'src/common/audit_log/audit_log.module';
import { AuditLogService } from 'src/common/audit_log/audit_log.service';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { AllExceptionsFilter } from 'src/filters/all-exceptions.filter';
import { CacheModule } from '@nestjs/cache-manager';
import { nestValidationSchema } from './validation';

@Global()
@Module({
  imports: [
    PrismaModule,
    BcryptModule,
    AuditLogModule,
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true, // expand variables in the env file allow to use ${variable} in the env file
      validationSchema: nestValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL'),
          limit: config.get('THROTTLE_LIMIT'),
        },
      ],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [AppConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({
                ttl: config.get('CACHE_TTL'),
                lruSize: config.get('CACHE_MAX'),
              }),
            }),
            createKeyv(config.get('REDIS_URL')),
          ],
        };
      },
    }),
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('ACCESS_TOKEN_EXPIRATION') },
        global: true,
        verifyOptions: { algorithms: [config.get('JWT_ALGORITHMS')] },
      }),
    }),
  ],
  providers: [
    ConfigService,
    AppConfigService,
    PrismaService,
    BcryptService,
    AuditLogService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [
    ConfigService,
    AppConfigService,
    PrismaService,
    JwtModule,
    BcryptService,
    AuditLogService,
  ],
})
export class AppConfigModule {}
