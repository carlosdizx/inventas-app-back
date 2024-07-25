import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AUTH, SERVER } from '../../common/constants/messages.constant';
import OtpService from '../../common/service/otp.service';
import User from '../entities/user.entity';

const VerifyOtp = createParamDecorator(
  async (_: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request['user'] as User;
    if (!user) throw new InternalServerErrorException(SERVER.FATAL);

    const email = user.email;
    const otp = request.headers['x-otp-code'];

    if (!otp) throw new BadRequestException(AUTH.INVALID);

    const otpService = new OtpService(request.firebaseService);
    await otpService.verifyOtp(email, otp);

    return true;
  },
);

export default VerifyOtp;
