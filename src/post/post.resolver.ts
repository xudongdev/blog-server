import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import { ID } from "type-graphql";

import { CurrentUser } from "../user/decorators/current-user.decorator";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { CreatePostInput } from "./dto/create-post.input";
import { UpdatePostInput } from "./dto/update-post.input";
import { Post } from "./post.entity";
import { PostService } from "./post.service";

@Resolver(() => Post)
export class PostResolver {
  public constructor(
    private readonly postService: PostService,
    private readonly userService: UserService
  ) {
    return this;
  }

  @Query(() => Post)
  public async post(
    @Args({
      type: () => ID,
      name: "id",
      nullable: true
    })
    id: Post["id"]
  ): Promise<Post> {
    return this.postService.findOne({ where: { id } });
  }

  @Query(() => [Post])
  public async posts(): Promise<Post[]> {
    return this.postService.find();
  }

  @Mutation(() => Post)
  public async createPost(
    @CurrentUser() author: User,
    @Args("input") input: CreatePostInput
  ): Promise<Post> {
    const post = this.postService.create({ ...input, author });
    return this.postService.save(post);
  }

  @Mutation(() => Post)
  public async updatePost(
    @CurrentUser() author: User,
    @Args({ type: () => ID, name: "id" }) id: string,
    @Args("input") input: UpdatePostInput
  ): Promise<Post> {
    const post = await this.postService.findOne({ id, author });

    Object.keys(input).forEach(key => {
      post[key] = input[key];
    });

    return this.postService.save(post);
  }

  @Mutation(() => Post)
  public async deletePost(
    @CurrentUser() author: User,
    @Args({ type: () => ID, name: "id" }) id: string
  ): Promise<Post> {
    const post = await this.postService.findOne({ id, author });
    await this.postService.remove(post);
    post.id = id;
    return post;
  }

  @ResolveProperty()
  public async author(@Parent() post: Post): Promise<User> {
    return this.userService.findOne({ where: { post } });
  }
}
