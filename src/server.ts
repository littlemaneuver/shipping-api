import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { json } from "express";

import { ApplicationModule } from "./modules/app.module";

const PORT = process.env.PORT || 5000;
const API_DEFAULT_PREFIX = "/api/v1/";

const SWAGGER_TITLE = "Shipping API";
const SWAGGER_DESCRIPTION = "Basic shipping API";
const SWAGGER_PREFIX = "/docs";

process.on("SIGTERM", () => {
    process.exit(0);
});

function createSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle(SWAGGER_TITLE)
        .setDescription(SWAGGER_DESCRIPTION)
        .setVersion("1.0.0")
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(SWAGGER_PREFIX, app, document);
}

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(ApplicationModule, {
        logger: console,
        cors: true,
    });

    app.setGlobalPrefix(process.env.API_PREFIX || API_DEFAULT_PREFIX);
    createSwagger(app);

    app.use(json());

    await app.listen(PORT);
}

bootstrap().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
