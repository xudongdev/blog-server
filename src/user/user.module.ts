import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PostModule } from "../post/post.module";
import { User } from "./user.entity";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => PostModule)],
  providers: [UserService, UserResolver],
  exports: [UserService]
})
export class UserModule {}
