import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Payment from './entities/payment.entity';
import CreatePaymentDto from './dto/create-payment.dto';
import { TypeSaleEnum } from '../sales/enums/type-sale.enum';
import Enterprise from '../enterprise/entities/enterprise.entity';
import { StatusEntity } from '../common/enums/status.entity.enum}';
import ChangeStatusDto from '../common/dto/change-status.dto';
import { CRUD } from '../common/constants/messages.constant';

@Injectable()
export default class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  public findAllSalesWithCredit = async (
    { page, limit }: IPaginationOptions,
    { id: enterprise_id }: Enterprise,
  ) => {
    const offset = (+page - 1) * +limit;

    let result = await this.paymentRepository.query(
      `
        SELECT
            c.id,
            c.document_number,
            c.names,
            c.surnames,
            COALESCE(SUM(s.total_amount), 0) AS total_credits,
            COALESCE((SELECT SUM(p.total_amount) FROM payments p WHERE p.client_id = c.id AND p.status = '${StatusEntity.ACTIVE}'), 0) AS total_payments
        FROM sales s
                 LEFT JOIN clients c ON c.id = s.client_id
        WHERE s.enterprise_id = $1 AND s.type = '${TypeSaleEnum.CREDIT}' AND s.status = '${StatusEntity.ACTIVE}'
        GROUP BY c.id
        LIMIT $2 OFFSET $3;
    `,
      [enterprise_id, limit, offset],
    );
    Logger.log('pass');

    const total = await result.length;

    result = result.map(
      ({ document_number, total_credits, total_payments, ...dataRe }: any) => ({
        ...dataRe,
        documentNumber: document_number,
        totalCredits: +total_credits,
        totalPayments: +total_payments,
        diff: +total_credits - +total_payments,
        percentage: parseFloat(
          ((+total_payments / +total_credits) * 100).toFixed(2),
        ),
        inversePercentage: parseFloat(
          (
            100 -
            parseFloat(((+total_payments / +total_credits) * 100).toFixed(2))
          ).toFixed(2),
        ),
      }),
    );

    const meta = {
      totalItems: total,
      itemCount: result.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(total / +limit),
      currentPage: page,
    };

    const baseUrl = 'payments/find/all/credits';
    const links = {
      first: `${baseUrl}?limit=${limit}`,
      previous: page > 1 ? `${baseUrl}?page=${+page - 1}&limit=${limit}` : '',
      next:
        page < meta.totalPages
          ? `${baseUrl}?page=${+page + 1}&limit=${limit}`
          : '',
      last: `${baseUrl}?page=${meta.totalPages}&limit=${limit}`,
    };

    return {
      items: result,
      meta,
      links,
    };
  };

  public registerPayment = async (
    { clientId, totalAmount }: CreatePaymentDto,
    { id: enterpriseId }: Enterprise,
  ) => {
    const [dataResult] = await this.paymentRepository.query(
      `
          SELECT COALESCE(SUM(s.total_amount), 0) AS total_credits,
                 COALESCE((SELECT SUM(p.total_amount) FROM payments p WHERE p.client_id = c.id AND p.status = '${StatusEntity.ACTIVE}' AND p.status = '${StatusEntity.ACTIVE}'), 0) AS total_payments
          FROM sales s
                   LEFT JOIN clients c ON c.id = s.client_id
          WHERE s.type = '${TypeSaleEnum.CREDIT}' AND s.enterprise_id = $1 AND c.id = $2 AND s.status = '${StatusEntity.ACTIVE}'
          GROUP BY c.id;
    `,
      [enterpriseId, clientId],
    );

    if (!dataResult) throw new ConflictException(CRUD.NOT_FOUND);

    const { total_credits, total_payments } = dataResult;

    if (totalAmount > +total_credits - +total_payments)
      throw new ConflictException(CRUD.CONFLICT);

    const payment = this.paymentRepository.create({
      totalAmount,
      client: { id: clientId },
      enterprise: { id: enterpriseId },
    });

    await this.paymentRepository.save(payment);
  };

  public findAllPaymentsByClient = async (
    clientId: string,
    { id: enterpriseId }: Enterprise,
  ) => {
    return await this.paymentRepository.find({
      where: { client: { id: clientId }, enterprise: { id: enterpriseId } },
      order: {
        createdAt: 'DESC',
        updatedAt: 'DESC',
      },
    });
  };

  public changeStatus = async (
    id: string,
    enterprise: Enterprise,
    { status }: ChangeStatusDto,
  ) => {
    const payment = await this.paymentRepository.findOneBy({ id });
    if (!payment) throw new NotFoundException(CRUD.NOT_FOUND);

    if (
      (payment.status === StatusEntity.ACTIVE ||
        payment.status === StatusEntity.INACTIVE) &&
      (status === StatusEntity.PENDING_CONFIRMATION ||
        status === StatusEntity.PENDING_APPROVAL)
    )
      throw new ConflictException(CRUD.CONFLICT);

    payment.status = status;

    await this.paymentRepository.save(payment);
  };
}
