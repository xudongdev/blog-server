import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { EntityService } from "../common/entity.service";
import { Post } from "./post.entity";

@Injectable()
export class PostService extends EntityService<Post> {
  public constructor(
    @InjectRepository(Post)
    public readonly postRepository: Repository<Post>
  ) {
    super(postRepository);
  }
}
