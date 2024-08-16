import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Client from './entities/client.entity';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import Enterprise from '../enterprise/entities/enterprise.entity';
import CreateClientDto from './dto/create-client.dto';
import UpdateClientDto from './dto/update-client.dto';
import { StatusEntity } from '../common/enums/status.entity.enum}';
import { CRUD, PAYMENTS } from '../common/constants/messages.constant';
import { TypeSaleEnum } from '../sales/enums/type-sale.enum';
import simplePaymentReminderEmail from '../common/templates/mails/simple-payment-reminder.email';
import NodemailerService from '../common/service/nodemailer.service';

@Injectable()
export default class ClientsService {
  constructor(
    private readonly nodemailerService: NodemailerService,
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

    if (!clientFound) throw new NotFoundException(CRUD.NOT_FOUND);
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

  public sendEmailForPayment = async (
    clientId: string,
    inventoryId: string,
    enterprise: Enterprise,
  ) => {
    const client = await this.findClientById(clientId, enterprise);
    if (!client) throw new NotFoundException(CRUD.NOT_FOUND);

    const [dataResult] = await this.clientRepository.query(
      `
          SELECT COALESCE(SUM(s.total_amount), 0) AS total_credits,
                 COALESCE((SELECT SUM(p.total_amount) FROM payments p WHERE p.client_id = c.id AND p.status = '${StatusEntity.ACTIVE}' AND p.status = '${StatusEntity.ACTIVE}' AND p.inventory_id= $3), 0) AS total_payments
          FROM sales s
                   LEFT JOIN clients c ON c.id = s.client_id
          WHERE s.type = '${TypeSaleEnum.CREDIT}' AND s.enterprise_id = $1 AND c.id = $2 AND s.status = '${StatusEntity.ACTIVE}'
               AND s.inventory_id = $3
          GROUP BY c.id;
    `,
      [enterprise.id, clientId, inventoryId],
    );

    let { total_credits, total_payments } = dataResult;

    if (!total_credits) throw new NotFoundException(CRUD.CONFLICT);

    total_credits = +total_credits;
    total_payments = +total_payments;

    const diff = Math.abs(total_payments - total_credits);

    if (diff === 0) throw new ConflictException(PAYMENTS.NO_CREDITS);

    const html = simplePaymentReminderEmail(
      `${client.names} ${client.surnames}`,
      diff,
      enterprise.name,
    );

    await this.nodemailerService.main({
      from: 'Notificaciones',
      subject: `Deuda pendiente por pagar ${enterprise.name}`,
      to: client.email,
      html,
    });
    return { message: PAYMENTS.NOTIFICATE };
  };
}
