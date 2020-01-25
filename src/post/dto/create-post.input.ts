import { GraphQLJSONObject } from "graphql-type-json";
import { Field, InputType } from "type-graphql";
import { DeepPartial } from "typeorm";

import { Post } from "../post.entity";

@InputType()
export class CreatePostInput implements DeepPartial<Post> {
  @Field({ nullable: true })
  slug?: string;

  @Field()
  title: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source?: any;

  @Field({ nullable: true })
  html?: string;
}
