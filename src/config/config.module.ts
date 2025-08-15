// import { createKeyv, Keyv } from '@keyv/redis';
// import { CacheInterceptor } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
// import { CacheableMemory } from 'cacheable';
import { AppConfigService } from './config.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { BcryptModule } from 'src/common/bcrypt/bcrypt.module';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';
import { AuditLogModule } from 'src/common/audit_log/audit_log.module';
import { AuditLogService } from 'src/common/audit_log/audit_log.service';

const validationSchema = Joi.object({
  // App
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  BASE_PATH: Joi.string().default('/api'),
  // Swagger
  SWAGGER_TITLE: Joi.string().default('Catalog API'),
  SWAGGER_DESCRIPTION: Joi.string().default('Author : Raibann'),
  SWAGGER_VERSION: Joi.string().default('1.0'),
  SWAGGER_DOCS_PATH: Joi.string().default('/docs'),
  SWAGGER_JSON_DOCUMENT_URL: Joi.string().default('/api/docs/json'),
  // Database
  DATABASE_URL: Joi.string().required(),
  // Redis
  REDIS_URL: Joi.string().required(),
  // Throttler
  THROTTLE_TTL: Joi.number().default(60000), // 1 minute
  THROTTLE_LIMIT: Joi.number().default(10), // 10 requests
  // Cache
  CACHE_TTL: Joi.number().default(60000), // 1 minute
  CACHE_MAX: Joi.number().default(5000), // 5000 requests
  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_ALGORITHMS: Joi.string().default('HS256'),
  ACCESS_TOKEN_EXPIRATION: Joi.number().default(3600), // 1 hour in seconds
  REFRESH_TOKEN_EXPIRATION: Joi.number().default(604800), // 7 days in seconds
  // Bcrypt
  BCRYPT_SALT_ROUNDS: Joi.number().default(10),
  // Super Admin
  SUPER_ADMIN_EMAIL: Joi.string().email().required(),
  SUPER_ADMIN_PASSWORD: Joi.string().required(),
});

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
      validationSchema: validationSchema,
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
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   imports: [AppConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => {
    //     return {
    //       stores: [
    //         new Keyv({
    //           store: new CacheableMemory({
    //             ttl: config.get('CACHE_TTL'),
    //             lruSize: config.get('CACHE_MAX'),
    //           }),
    //         }),
    //         createKeyv(config.get('REDIS_URL')),
    //       ],
    //     };
    //   },
    // }),
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
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
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
