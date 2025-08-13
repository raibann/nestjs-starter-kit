import { createKeyv, Keyv } from '@keyv/redis';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { CacheableMemory } from 'cacheable';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  BASE_PATH: Joi.string().default('/api'),
  SWAGGER_TITLE: Joi.string().default('Catalog API'),
  SWAGGER_DESCRIPTION: Joi.string().default('Author : Raibann'),
  SWAGGER_VERSION: Joi.string().default('1.0'),
  SWAGGER_DOCS_PATH: Joi.string().default('/docs'),
  SWAGGER_JSON_DOCUMENT_URL: Joi.string().default('/api/docs/json'),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  THROTTLE_TTL: Joi.number().default(60000), // 1 minute
  THROTTLE_LIMIT: Joi.number().default(10), // 10 requests
  CACHE_TTL: Joi.number().default(60000), // 1 minute
  CACHE_MAX: Joi.number().default(5000), // 5000 requests
});

@Global()
@Module({
  imports: [
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
      imports: [ConfigModule],
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
      imports: [ConfigModule],
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
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
