import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import { AppConfigService } from './config/config.service';
import { createSuperAdmin } from './starter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(AppConfigService);
  const configValue = configService.getConfig();

  // variables
  const basePath = configValue.basePath;
  const port = configValue.port;
  const swaggerTitle = configValue.swagger.title;
  const swaggerDescription = configValue.swagger.description;
  const swaggerVersion = configValue.swagger.version;
  const docsPath = configValue.swagger.docsPath;
  const docsJsonPath = configValue.swagger.jsonDocumentUrl;
  const docsVersion = swaggerVersion.split('.')[0];

  // Swagger
  const docUrl = `${basePath}/v${docsVersion}/${docsPath}`;
  const docsJsonUrl = `${basePath}/v${docsVersion}/${docsJsonPath}`;
  const config = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDescription)
    .setVersion(swaggerVersion)
    .setExternalDoc('API COLLECTION', docsJsonUrl)
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docUrl, app, documentFactory, {
    jsonDocumentUrl: docsJsonUrl,
  });

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix(basePath);
  app.enableCors({
    origin: '*',
  });

  await app.listen(port ?? 3000);
  // log variables
  console.table({
    basePath,
    port,
    swaggerTitle,
    swaggerDescription,
    swaggerVersion,
    docsVersion,
  });
  Logger.log(`
    -------------------------------------------------------
    * Server running on http://localhost:${port}${docUrl}
    * Docs: http://localhost:${port}${docsJsonUrl}
    -------------------------------------------------------
  `);

  await createSuperAdmin({
    email: configValue.superAdmin.email,
    password: configValue.superAdmin.password,
  });
}
bootstrap();
