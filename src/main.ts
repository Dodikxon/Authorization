import * as process from "process";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    });

    const config = new DocumentBuilder()
        .setTitle("Authorization")
        .setDescription(
            "It`s simple api for you`re site, created on NestJS\n Please give me star https://github.com/Dodikxon/Authorization"
        )
        .setVersion("1.0.0")
        .addTag("DODIKxon")
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/api/docs", app, document);
    await app.listen(PORT, () => console.log(`SERVER START ON PORT = ${PORT}`));
}

start();
