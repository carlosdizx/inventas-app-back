import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRoles } from './enums/user.roles.enum';
import UserDetails from './entities/user.details.entity';
import { UserTypeDocument } from './enums/user.type.document.enum';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
  ) {}

  public createUser = async () => {
    const user = this.userRepository.create({
      email: 'ernestodiaz@mail.com',
      password: '12345678',
      roles: [UserRoles.OWNER],
    });

    const details = this.userDetailsRepository.create({
      first_name: 'Ernesto',
      last_name: 'Díaz',
      documentType: UserTypeDocument.CC,
      documentNumber: '1082749257',
      gender: true,
      birthdate: new Date('1998-01-13'),
      phone: '3026508102',
    });

    try {
      details.user = await this.userRepository.save(user);
      await this.userDetailsRepository.save(details);
    } catch (error) {
      console.log(error);
    }
  };
}
