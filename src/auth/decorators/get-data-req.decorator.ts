import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { SERVER } from '../../common/constants/messages.error.constant';

const getDataReq = createParamDecorator(
  (reqEnterprise: boolean, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new InternalServerErrorException(SERVER.FATAL);
    if (!reqEnterprise) return user.enterprise;
    return user;
  },
);

export default getDataReq;
