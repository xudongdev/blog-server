import {
  Args,
  Parent,
  Query,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import { ID } from "type-graphql";

import { Post } from "../post/post.entity";
import { PostService } from "../post/post.service";
import { User } from "./user.entity";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  public constructor(
    private readonly userService: UserService,
    private readonly postService: PostService
  ) {
    return this;
  }

  @Query(() => User)
  public async user(
    @Args({
      type: () => ID,
      name: "id",
      nullable: true
    })
    id: User["id"]
  ): Promise<User> {
    return this.userService.findOne({ where: { id } });
  }

  @Query(() => [User])
  public async users(): Promise<User[]> {
    return this.userService.find();
  }

  @ResolveProperty()
  public async posts(@Parent() user: User): Promise<Post[]> {
    return this.postService.find({ where: { user } });
  }
}
