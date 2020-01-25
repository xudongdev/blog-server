import { GraphQLJSONObject } from "graphql-type-json";
import slugify from "slugify";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { User } from "../user/user.entity";

@ObjectType()
@Entity()
export class Post {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Field()
  @Column({ unique: true })
  public slug: string;

  @Field()
  @Column()
  public title: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column({ type: "simple-json", nullable: true })
  public source: object;

  @Field()
  @Column({ type: "text", default: "" })
  public html: string;

  @Field()
  @CreateDateColumn()
  public createdAt: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.posts
  )
  public author: User;

  @BeforeInsert()
  @BeforeUpdate()
  private beforeInsertOrUpdate(): void {
    // slugify
    if (!this.slug && this.title) {
      this.slug = slugify(this.title);
    }
  }
}
