import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class TokenPayload {
  @Field()
  public token: string;
}
