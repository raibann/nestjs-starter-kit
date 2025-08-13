import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // variables
  const basePath = configService.get('BASE_PATH');
  const port = configService.get('PORT');
  const swaggerTitle = configService.get('SWAGGER_TITLE');
  const swaggerDescription = configService.get('SWAGGER_DESCRIPTION');
  const swaggerVersion = configService.get('SWAGGER_VERSION');
  const docsPath = configService.get('SWAGGER_DOCS_PATH');
  const docsJsonPath = configService.get('SWAGGER_JSON_DOCUMENT_URL');
  const docsVersion = swaggerVersion.split('.')[0];

  // log variables
  console.table({
    basePath,
    port,
    swaggerTitle,
    swaggerDescription,
    swaggerVersion,
    docsPath,
    docsJsonPath,
    docsVersion,
  });

  // Swagger
  const docUrl = `${basePath}/v${docsVersion}/${docsPath}`;
  const docsJsonUrl = `${basePath}/v${docsVersion}/${docsJsonPath}`;
  const config = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDescription)
    .setVersion(swaggerVersion)
    .setExternalDoc('API COLLECTION', docsJsonUrl)
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
  Logger.log(`
    -------------------------------------------------------
    * Server running on http://localhost:${port}${docUrl}
    * Docs: http://localhost:${port}${docsJsonUrl}
    -------------------------------------------------------
  `);
}
bootstrap();
