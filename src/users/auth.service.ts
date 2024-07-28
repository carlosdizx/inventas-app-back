import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import JwtPayload from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import LoginUserDto from './dto/login.dto';
import EncryptService from '../common/service/encrypt.service';
import { comparePasswords, hashPassword } from '../common/util/encrypt.util';
import { StatusEntity } from '../common/enums/status.entity.enum}';
import generatePasswordUtil from '../common/util/generate.password.util';
import { UserRoles } from './enums/user.roles.enum';
import {
  AUTH,
  CRUD,
  ENTERPRISE,
  SERVER,
} from '../common/constants/messages.constant';

@Injectable()
export default class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
    const userEnterprise = await this.userRepository.findOne({
      where: { id },
      relations: ['enterprise'],
    });
    if (!userEnterprise?.enterprise)
      throw new UnauthorizedException(ENTERPRISE.NOT_FOUND);
    if (userEnterprise?.enterprise?.status === StatusEntity.INACTIVE)
      throw new UnauthorizedException(ENTERPRISE.NOT_FOUND);
  };

  public login = async ({ email, password }: LoginUserDto) => {
    this.logger.debug({ email, password });
    const userFound = await this.userRepository.findOne({
      where: { email, status: StatusEntity.ACTIVE },
      select: ['id', 'email', 'password', 'roles', 'status'],
    });
    if (!userFound) throw new NotFoundException(AUTH.NOT_FOUND);

    const notRequireValid = userFound.roles.some(
      (userRole) => userRole === UserRoles.SUPER_ADMIN,
    );
    if (!notRequireValid) await this.validateEnterpriseIsActive(userFound.id);

    let decryptPassword: string;
    try {
      decryptPassword = this.encryptService.decrypt(userFound.password);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(SERVER.FATAL);
    }
    if (decryptPassword === '') {
      this.logger.error('Llave de encriptación es errada');
      throw new InternalServerErrorException(SERVER.FATAL);
    }
    const isValid = await comparePasswords(password, decryptPassword);
    if (isValid)
      return {
        token: this.generateJWT({ id: userFound.id, roles: userFound.roles }),
        refreshToken: this.generateRefreshToken({
          id: userFound.id,
          roles: userFound.roles,
        }),
      };
    else throw new BadRequestException(AUTH.INVALID_CREDENTIALS);
  };

  public refreshAndValidateToken = async (refreshToken: string) => {
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch (error) {
      throw new UnauthorizedException(AUTH.EXPIRE_SESSION);
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

  public changePassword = async (id: string, password: string) => {
    const userPreload = await this.userRepository.preload({ id });
    if (!userPreload) throw new NotFoundException(AUTH.NOT_FOUND);

    userPreload.password = this.encryptService.encrypt(
      await hashPassword(password),
    );
    await this.userRepository.save(userPreload);
    return { message: CRUD.UPDATED };
  };
}
