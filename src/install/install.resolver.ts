import { UnauthorizedException } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { CreateUserInput } from "../user/dto/create-user.input";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";

@Resolver()
export class InstallResolver {
  constructor(private readonly userService: UserService) {
    return this;
  }

  @Mutation(() => User)
  public async install(@Args("input") input: CreateUserInput): Promise<User> {
    if (await this.userService.findOne()) {
      throw new UnauthorizedException(
        "If you need to reinstall, please delete all users first."
      );
    }

    const user = this.userService.create(input);

    return this.userService.save(user);
  }
}
