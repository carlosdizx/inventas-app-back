import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import User from '../../auth/entities/user.entity';
import { AUTH, SERVER } from '../constants/messages.constant';
import OtpService from '../service/otp.service';
import UserCrudService from '../../auth/user.crud.service';
@Injectable()
export class OtpVerifyMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(OtpVerifyMiddleware.name);

  constructor(
    private readonly otpService: OtpService,
    private readonly userCrudService: UserCrudService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('Verify otp');

    const authorization = req.headers.authorization;

    if (!authorization) throw new BadRequestException(AUTH.INVALID);

    const [token] = authorization.split(' ').reverse();

    this.logger.debug(token);
    //this.userCrudService.findUserById()

    // if (!user) throw new InternalServerErrorException(SERVER.FATAL);
    //
    // const { email } = user;
    // const otp = req.headers['x-otp-code'] as string;
    //
    // if (!otp) throw new BadRequestException(AUTH.INVALID);
    //
    // this.logger.debug(`email: ${email}`);
    //
    // await this.otpService.verifyOtp(email, otp);

    next();
  }
}
