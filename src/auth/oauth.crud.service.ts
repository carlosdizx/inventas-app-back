import { Injectable } from '@nestjs/common';
import Oauth2Client from './entities/oauth2.client.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import CreateOauth2ClientDto from './dto/create.oauth2-client.dto';
import PaginationDto from '../common/dto/pagination.dto';
import generateClientCredentialsUtil from '../common/util/generate.client.credentials.util';

@Injectable()
export default class OauthCrudService {
  constructor(
    @InjectRepository(Oauth2Client)
    private readonly oauth2ClientRepository: Repository<Oauth2Client>,
  ) {}

  public createClient = async (dto: CreateOauth2ClientDto) => {
    const { clientId, clientSecret } = generateClientCredentialsUtil();

    const oauth2Client = this.oauth2ClientRepository.create({
      ...dto,
      clientId,
      clientSecret,
    });
    return await this.oauth2ClientRepository.save(oauth2Client);
  };

  public listClients = async ({ offset, limit }: PaginationDto) => {
    return await this.oauth2ClientRepository.find({
      take: limit,
      skip: offset,
      select: ['id', 'businessName', 'email'],
    });
  };
}
