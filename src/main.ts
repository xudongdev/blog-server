import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";
import { install as sourceMapSupportInstall } from "source-map-support";

import { AppModule } from "./app.module";

sourceMapSupportInstall();

(async (): Promise<void> => {
  const app = await NestFactory.create(AppModule, {
    ...(process.env.NODE_ENV === "production" ? { logger: false } : {})
  });

  if (process.env.NODE_ENV === "production") {
    app.useLogger(app.get(Logger));
  }

  await app.listen(app.get(ConfigService).get("PORT", 5000));
})();
