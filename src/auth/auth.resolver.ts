import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { CurrentUser } from "../user/decorators/current-user.decorator";
import { User } from "../user/user.entity";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { TokenPayload } from "./dto/token-payload.dto";

@Resolver()
export class AuthResolver {
  public constructor(private readonly authService: AuthService) {
    return this;
  }

  @Mutation(() => TokenPayload)
  public async getToken(
    @Args("email") email: string,
    @Args("password") password: string
  ): Promise<TokenPayload> {
    const user = await this.authService.validateUser(email, password);
    const token = await this.authService.generateToken(user);
    return { token };
  }

  @UseGuards(AuthGuard)
  @Mutation(() => TokenPayload)
  public async refreshToken(@CurrentUser() user: User): Promise<TokenPayload> {
    const token = await this.authService.generateToken(user);
    return { token };
  }
}
