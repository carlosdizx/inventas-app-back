import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import ErrorDatabaseService from '../common/service/error.database.service';
import JwtPayload from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import LoginUserDto from './dto/login.dto';
import EncryptService from '../common/service/encrypt.service';
import { comparePasswords } from '../common/util/encrypt.util';
import { StatusEntity } from '../common/enums/status.entity.enum}';

@Injectable()
export default class AuthService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly errorDatabaseService: ErrorDatabaseService,
    private readonly encryptService: EncryptService,
    private readonly jwtService: JwtService,
  ) {}

  private generateJWT = (payload: JwtPayload) => {
    return this.jwtService.sign(payload);
  };

  public login = async ({ email, password }: LoginUserDto) => {
    const userFound = await this.userRepository.findOne({
      where: { email, status: StatusEntity.ACTIVE },
      select: ['id', 'email', 'password'],
    });
    if (!userFound)
      throw new NotFoundException('Email no encontrado o inactivo');
    const decryptPassword = this.encryptService.decrypt(userFound.password);
    if (decryptPassword === '')
      throw new ConflictException('Llave de encriptación es errada');
    const isValid = await comparePasswords(password, decryptPassword);
    if (isValid)
      return {
        token: this.generateJWT({ id: userFound.id }),
      };
    else throw new BadRequestException('Credenciales erradas');
  };
}
