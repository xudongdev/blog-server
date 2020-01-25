import { Field, InputType } from "type-graphql";

@InputType()
export class CreateUserInput {
  @Field({ nullable: true })
  public slug: string;

  @Field()
  public name: string;

  @Field()
  public email: string;

  @Field()
  public password: string;
}
