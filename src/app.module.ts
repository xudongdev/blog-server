import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoggerModule } from "nestjs-pino";
import { SnakeNamingStrategy } from "typeorm-snake-naming-strategy";

import { AuthModule } from "./auth/auth.module";
import { InstallModule } from "./install/install.module";
import { Post } from "./post/post.entity";
import { PostModule } from "./post/post.module";
import { User } from "./user/user.entity";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    LoggerModule.forRoot(),
    GraphQLModule.forRoot({
      tracing: true,
      autoSchemaFile: true,
      introspection: true,
      playground: true,
      context: ({ req }) => ({ req })
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        url: configService.get("DATABASE_URL"),
        extra: {
          ssl: configService.get("DATABASE_SSL")
        },
        timezone: "Z",
        entities: [Post, User],
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    InstallModule,
    PostModule,
    UserModule
  ]
})
export class AppModule {}
