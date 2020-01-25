import { createParamDecorator } from "@nestjs/common";

import { User } from "../user.entity";

export const CurrentUser = createParamDecorator((data, [, , ctx]) => {
  return ctx.req.user instanceof User ? ctx.req.user : null;
});
