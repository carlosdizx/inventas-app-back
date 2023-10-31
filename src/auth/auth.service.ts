import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import ErrorDatabaseService from '../common/service/error.database.service';
import JwtPayload from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import LoginUserDto from './dto/login.dto';

@Injectable()
export default class AuthService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly errorDatabaseService: ErrorDatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  private generateJWT = (payload: JwtPayload) => {
    return this.jwtService.sign(payload);
  };

  public login = async ({ email, password }: LoginUserDto) => {
    const userFound = await this.userRepository.findOne({
      where: { email },
      select: ['email', 'password'],
    });
    if (!userFound) throw new NotFoundException('Credenciales no encontradas');
    console.log(userFound);
    return userFound;
  };
}
