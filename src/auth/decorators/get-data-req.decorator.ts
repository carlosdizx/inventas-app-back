import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

const getDataReq = createParamDecorator(
  (reqEnterprise: boolean, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest();
    if (!user)
      throw new InternalServerErrorException('User not found (request)');
    if (!reqEnterprise) return user.enterprise;
    return user;
  },
);

export default getDataReq;
