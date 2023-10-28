import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import JwtPayload from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import Oauth2Client from '../entities/oauth2.client.entity';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Oauth2Client)
    private readonly repository: Repository<Oauth2Client>,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  public validate = async (payload: JwtPayload): Promise<Oauth2Client> => {
    let client: Oauth2Client = null;
    try {
      client = await this.repository
        .createQueryBuilder('client')
        .where('client.id = :id', { id: payload.id })
        .getOne();
    } catch (error) {
      throw new UnauthorizedException('Failed validation token');
    }
    if (!client) throw new UnauthorizedException('Token not valid');
    if (!client.enabled)
      throw new UnauthorizedException('Client is inactive, talk with an admin');
    return client;
  };
}
