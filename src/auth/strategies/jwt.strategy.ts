import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import JwtPayload from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import User from '../entities/user.entity';
@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  public validate = async (payload: JwtPayload): Promise<User> => {
    let user: User = null;
    try {
      user = await this.repository
        .createQueryBuilder('user')
        .where('client.id = :id', { id: payload.id })
        .getOne();
    } catch (error) {
      throw new UnauthorizedException('Failed validation token');
    }
    if (!user) throw new UnauthorizedException('Token not valid');
    if (!user.isActive)
      throw new UnauthorizedException('Client is inactive, talk with an admin');
    return user;
  };
}
