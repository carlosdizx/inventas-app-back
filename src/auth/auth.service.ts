import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
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
import { UserRoles } from './enums/user.roles.enum';

@Injectable()
export default class AuthService {
  private readonly logger = new Logger(AuthService.name);
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

  private validateEnterpriseIsActive = async (id: string) => {
    const enterpriseFound = await this.userRepository.findOne({
      where: { id },
      relations: ['enterprise'],
    });
    if (enterpriseFound?.enterprise.status === StatusEntity.INACTIVE)
      throw new UnauthorizedException('Tu empresa se encuentra inactiva');
  };

  public login = async ({ email, password }: LoginUserDto) => {
    const userFound = await this.userRepository.findOne({
      where: { email, status: StatusEntity.ACTIVE },
      select: ['id', 'email', 'password', 'roles'],
    });
    const notRequireValid = userFound.roles.some(
      (userRole) => userRole === UserRoles.SUPER_ADMIN,
    );
    if (!notRequireValid) await this.validateEnterpriseIsActive(userFound.id);
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
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
    await this.validateEnterpriseIsActive(payload.id);

    return {
      token: this.generateJWT({ id: payload.id, roles: payload.roles }),
      refreshToken: this.generateRefreshToken({
        id: payload.id,
        roles: payload.roles,
      }),
    };
  };

  public generateRandomPassword = async () => {
    const password = generatePasswordUtil(20);
    const passwordEncrypted = this.encryptService.encrypt(
      await hashPassword(password),
    );

    return { password, passwordEncrypted };
  };
}
