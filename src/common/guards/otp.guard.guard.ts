import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AUTH } from '../constants/messages.constant';
import User from '../../users/entities/user.entity';
import OtpService from '../service/otp.service';

@Injectable()
export default class OtpGuardGuard implements CanActivate {
  private readonly logger: Logger = new Logger(OtpGuardGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.debug('Verify otp');
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);
    if (!token) throw new UnauthorizedException(AUTH.INVALID);

    let user: User;
    try {
      req['user'] = await this.jwtService.verifyAsync(token);
      user = req['user'];
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(AUTH.INVALID);
    }

    const otp = req.headers['x-otp-code'] as string;

    if (!otp) throw new BadRequestException(AUTH.INVALID);

    this.logger.debug(`user: ${user}`);

    await this.otpService.validateOtp(user.id, otp);

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
