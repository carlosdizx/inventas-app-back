import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import JwtPayload from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import User from '../entities/user.entity';
import { StatusEntity } from '../../common/enums/status.entity.enum}';
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
      user = await this.repository.findOneBy({ id: payload.id });
    } catch (error) {
      throw new UnauthorizedException('Cliente no encontrado');
    }
    if (!user) throw new UnauthorizedException('Token invalido');
    if (user.status !== StatusEntity.ACTIVE)
      throw new UnauthorizedException('Cliente inactivo');
    return user;
  };
}
