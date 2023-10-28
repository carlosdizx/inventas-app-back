import { Test, TestingModule } from '@nestjs/testing';
import OauthCrudController from './oauth.crud.controller';
import OauthCrudService from './oauth.crud.service';
import CreateOauth2ClientDto from './dto/create.oauth2-client.dto';
import Oauth2Client from './entities/oauth2.client.entity';
import PaginationDto from '../common/dto/pagination.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('OauthCrudController', () => {
  let controller: OauthCrudController;
  let service: OauthCrudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OauthCrudController],
      providers: [
        OauthCrudService,
        {
          provide: getRepositoryToken(Oauth2Client),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<OauthCrudController>(OauthCrudController);
    service = module.get<OauthCrudService>(OauthCrudService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerClient', () => {
    it('should create a new client', async () => {
      const createOauth2ClientDto: CreateOauth2ClientDto = {
        businessName: 'Enterprise',
        email: 'email@enterprise.com',
      };

      const createdClient = new Oauth2Client();

      jest.spyOn(service, 'createClient').mockResolvedValue(createdClient);

      const result = await controller.registerClient(createOauth2ClientDto);

      expect(result).toBe(createdClient);
    });
  });

  describe('listClients', () => {
    it('should list clients', async () => {
      const paginationDto: PaginationDto = {};

      const clientList = [];

      jest.spyOn(service, 'listClients').mockResolvedValue(clientList);

      const result = await controller.listClients(paginationDto);

      expect(result).toBe(clientList);
    });
  });
});
