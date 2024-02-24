import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Client from './entities/client.entity';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import Enterprise from '../enterprise/entities/enterprise.entity';

@Injectable()
export default class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  public listClients = async (
    { page, limit }: IPaginationOptions,
    { id }: Enterprise,
  ) => {
    const queryBuilder = this.clientRepository
      .createQueryBuilder('client')
      .where('client.enterprise.id = :id', { id });
    return await paginate<Client>(queryBuilder, {
      page,
      limit,
      route: 'clients',
    });
  };
}
