import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  getConfig(): AppConfig.Configuration {
    return {
      port: this.configService.get('PORT'),
      basePath: this.configService.get('BASE_PATH'),
      swagger: {
        title: this.configService.get('SWAGGER_TITLE'),
        description: this.configService.get('SWAGGER_DESCRIPTION'),
        version: this.configService.get('SWAGGER_VERSION'),
        docsPath: this.configService.get('SWAGGER_DOCS_PATH'),
        jsonDocumentUrl: this.configService.get('SWAGGER_JSON_DOCUMENT_URL'),
      },
      database: {
        url: this.configService.get('DATABASE_URL'),
      },
      jwt: {
        secret: this.configService.get('JWT_SECRET'),
        accessTokenExpiration: this.configService.get(
          'ACCESS_TOKEN_EXPIRATION',
        ),
        refreshTokenExpiration: this.configService.get(
          'REFRESH_TOKEN_EXPIRATION',
        ),
        algorithms: this.configService.get('JWT_ALGORITHMS'),
      },
      bcrypt: {
        saltRounds: this.configService.get('BCRYPT_SALT_ROUNDS'),
      },
      redis: {
        url: this.configService.get('REDIS_URL'),
      },
      throttle: {
        ttl: this.configService.get('THROTTLE_TTL'),
        limit: this.configService.get('THROTTLE_LIMIT'),
      },
      cache: {
        ttl: this.configService.get('CACHE_TTL'),
        max: this.configService.get('CACHE_MAX'),
      },
      superAdmin: {
        email: this.configService.get('SUPER_ADMIN_EMAIL'),
        password: this.configService.get('SUPER_ADMIN_PASSWORD'),
      },
    };
  }
}
