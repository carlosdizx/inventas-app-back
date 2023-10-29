import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import ErrorDatabaseService from '../common/service/error.database.service';

@Injectable()
export default class AuthService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly errorDatabaseService: ErrorDatabaseService,
  ) {}
}
