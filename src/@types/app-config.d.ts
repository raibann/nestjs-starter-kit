declare namespace AppConfig {
  interface Configuration {
    port: number;
    basePath: string;
    swagger: {
      title: string;
      description: string;
      version: string;
      docsPath: string;
      jsonDocumentUrl: string;
    };
    database: {
      url: string;
    };
    jwt: {
      secret: string;
      accessTokenExpiration: number;
      refreshTokenExpiration: number;
      algorithms: string;
    };
    bcrypt: {
      saltRounds: number;
    };
    redis: {
      url: string;
    };
    throttle: {
      ttl: number;
      limit: number;
    };
    cache: {
      ttl: number;
      max: number;
    };
    superAdmin: {
      email: string;
      password: string;
    };
  }
}
