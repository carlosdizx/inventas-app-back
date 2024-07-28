import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AUTH, SERVER } from '../constants/messages.constant';
import OtpService from '../service/otp.service';
import UserCrudService from '../../users/user.crud.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class OtpVerifyMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(OtpVerifyMiddleware.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly userCrudService: UserCrudService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('Verify otp');

    const authorization = req.headers.authorization;

    if (!authorization) throw new BadRequestException(AUTH.INVALID);

    const [token] = authorization.split(' ').reverse();

    let payload;
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException(AUTH.INVALID);
    }

    if (!payload) throw new BadRequestException(AUTH.INVALID);

    const user = await this.userCrudService.findUserById(payload.id);

    if (!user) throw new InternalServerErrorException(SERVER.FATAL);

    const { email } = user;
    const otp = req.headers['x-otp-code'] as string;

    if (!otp) throw new BadRequestException(AUTH.INVALID);

    this.logger.debug(`email: ${email}`);

    await this.otpService.verifyOtp(email, otp);

    next();
  }
}
