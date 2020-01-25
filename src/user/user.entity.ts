import bcrypt from "bcryptjs";
import slugify from "slugify";
import { Field, ID, ObjectType } from "type-graphql";
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { Post } from "../post/post.entity";

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Field()
  @Column()
  public slug: string;

  @Field()
  @Column()
  public name: string;

  @Field()
  @Column()
  public email: string;

  @Column()
  public password: string;

  @Field()
  @CreateDateColumn()
  public createdAt: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field(() => [Post])
  @OneToMany(
    () => Post,
    post => post.author
  )
  public posts: Post[];

  private tempPassword: string;

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private beforeInsertOrUpdate(): void {
    // encrypt password
    if (this.tempPassword !== this.password) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
      this.loadTempPassword();
    }

    // slugify
    if (!this.slug && this.name) {
      this.slug = slugify(this.name);
    }
  }
}
