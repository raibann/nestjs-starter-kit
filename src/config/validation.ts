import * as Joi from 'joi';

export const nestValidationSchema = Joi.object({
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
