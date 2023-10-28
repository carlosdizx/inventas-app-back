import { Injectable, NotFoundException } from '@nestjs/common';
import Oauth2Client from './entities/oauth2.client.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { ConfigService } from '@nestjs/config';
import JwtPayload from './interfaces/jwt-payload.interface';
import OauthLoginDto from './dto/oauth.login.dto';

@Injectable()
export default class OauthAuthorizerService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Oauth2Client)
    private readonly oauth2ClientRepository: Repository<Oauth2Client>,
    private readonly jwtService: JwtService,
  ) {}

  public authenticateClient = async ({
    clientSecret,
    clientId,
    scope,
  }: OauthLoginDto) => {
    const oauth2Client = await this.oauth2ClientRepository.findOneBy({
      clientId,
    });
    if (!oauth2Client)
      throw new NotFoundException(
        `No se encontró a un cliente con esas credenciales`,
      );
    if (oauth2Client.clientSecret !== clientSecret)
      throw new NotFoundException(`El client secret no es correcto`);
    return {
      access_token: this.generateJWT({ id: oauth2Client.id, scope }),
    };
  };

  private generateJWT = (payload: JwtPayload) =>
    this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });
}
