import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Client from './entities/client.entity';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import Enterprise from '../enterprise/entities/enterprise.entity';
import CreateClientDto from './dto/create-client.dto';
import UpdateClientDto from './dto/update-client.dto';
import { StatusEntity } from '../common/enums/status.entity.enum}';

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

  public createClient = async (
    dto: CreateClientDto,
    enterprise: Enterprise,
  ) => {
    const client = this.clientRepository.create({ ...dto, enterprise });
    return this.clientRepository.save(client);
  };

  public findClientById = async (id: string, enterprise: Enterprise) =>
    await this.clientRepository.findOne({
      where: { id, enterprise: { id: enterprise.id } },
      select: [
        'id',
        'names',
        'surnames',
        'documentType',
        'documentNumber',
        'phone',
        'email',
        'status',
      ],
    });

  public updateClientById = async (id: string, dto: UpdateClientDto) => {
    const clientFound = await this.clientRepository.preload({
      id,
      ...dto,
    });

    if (!clientFound) throw new NotFoundException('Cliente no encontrado');
    return this.clientRepository.save(clientFound);
  };

  public findClientByFilter = async (filter: any) =>
    await this.clientRepository.findOne({
      where: { ...filter },
    });

  public findAllClients = (enterprise: Enterprise) =>
    this.clientRepository.find({
      where: { enterprise: { id: enterprise.id }, status: StatusEntity.ACTIVE },
    });
}
