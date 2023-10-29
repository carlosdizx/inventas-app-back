import { Injectable } from '@nestjs/common';
import Enterprise from './entities/enterprise.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import CreateEnterpriseDTO from './dto/create-enterprise.dto';

@Injectable()
export default class EnterpriseService {
  constructor(
    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,
  ) {}

  public registerEnterprise = (dto: CreateEnterpriseDTO) => {
    return dto;
  };
}
