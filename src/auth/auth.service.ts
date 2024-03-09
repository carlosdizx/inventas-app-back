import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import ErrorDatabaseService from '../common/service/error.database.service';
import JwtPayload from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import LoginUserDto from './dto/login.dto';
import EncryptService from '../common/service/encrypt.service';
import { comparePasswords, hashPassword } from '../common/util/encrypt.util';
import { StatusEntity } from '../common/enums/status.entity.enum}';
import generatePasswordUtil from '../common/util/generate.password.util';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly errorDatabaseService: ErrorDatabaseService,
    private readonly encryptService: EncryptService,
    private readonly jwtService: JwtService,
  ) {}

  private generateRefreshToken = (payload: JwtPayload) =>
    this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

  private generateJWT = (payload: JwtPayload) => {
    return this.jwtService.sign(payload);
  };

  public login = async ({ email, password }: LoginUserDto) => {
    const userFound = await this.userRepository.findOne({
      where: { email, status: StatusEntity.ACTIVE },
      select: ['id', 'email', 'password', 'roles'],
    });
    if (!userFound)
      throw new NotFoundException('Email no encontrado o inactivo');
    const decryptPassword = this.encryptService.decrypt(userFound.password);
    if (decryptPassword === '')
      throw new ConflictException('Llave de encriptación es errada');
    const isValid = await comparePasswords(password, decryptPassword);
    if (isValid)
      return {
        token: this.generateJWT({ id: userFound.id, roles: userFound.roles }),
        refreshToken: this.generateRefreshToken({
          id: userFound.id,
          roles: userFound.roles,
        }),
      };
    else throw new BadRequestException('Credenciales erradas');
  };

  public refreshAndValidateToken = async (refreshToken: string) => {
    try {
      const payload = this.jwtService.verify(refreshToken);
      return {
        token: this.generateJWT({ id: payload.id, roles: payload.roles }),
        refreshToken: this.generateRefreshToken({
          id: payload.id,
          roles: payload.roles,
        }),
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  };

  public generateRandomPassword = async () => {
    const password = generatePasswordUtil(20);
    const passwordEncrypted = this.encryptService.encrypt(
      await hashPassword(password),
    );

    return { password, passwordEncrypted };
  };
}
