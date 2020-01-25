import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { EntityService } from "../common/entity.service";
import { User } from "./user.entity";

@Injectable()
export class UserService extends EntityService<User> {
  public constructor(
    @InjectRepository(User)
    public readonly userRepository: Repository<User>
  ) {
    super(userRepository);
  }
}
