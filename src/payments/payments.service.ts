import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import Enterprise from '../enterprise/entities/enterprise.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Payment from './entities/payment.entity';

@Injectable()
export default class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  public findAllSalesWithCredit = async (
    { page, limit }: IPaginationOptions,
    { id }: Enterprise,
  ) => {
    const queryBuilder = this.paymentRepository
      .createQueryBuilder('client')
      .select('client.document_number', 'documentNumber')
      .addSelect('client.names', 'names')
      .addSelect('client.surnames', 'surnames')
      .addSelect(
        `COALESCE((
      SELECT SUM(sale.total_amount) 
      FROM sales sale 
      WHERE sale.client_id = client.id 
      AND sale.type = :type 
      AND sale.enterprise_id = :enterpriseId
    ), 0)`,
        'totalCredits',
      )
      .addSelect(
        `COALESCE((
      SELECT SUM(payment.total_amount) 
      FROM payments payment 
      WHERE payment.client_id = client.id
    ), 0)`,
        'totalPayments',
      )
      .leftJoin('client.sales', 'sale')
      .where('sale.enterprise.id = :enterpriseId', { enterpriseId: id })
      .andWhere('sale.type = :type', { type: 1 })
      .groupBy('client.id')
      .addGroupBy('client.document_number')
      .addGroupBy('client.names')
      .addGroupBy('client.surnames')
      .orderBy('client.names', 'ASC');

    const total = await queryBuilder.getCount();

    let results = await queryBuilder
      .offset((+page - 1) * +limit)
      .limit(+limit)
      .getRawMany();

    results = results.map(
      ({ totalCredits, totalPayments, ...dataRe }: any) => ({
        ...dataRe,
        totalCredits: +totalCredits,
        totalPayments: +totalPayments,
        diff: totalCredits - totalPayments,
        percentage: parseFloat(
          ((+totalPayments / +totalCredits) * 100).toFixed(2),
        ),
      }),
    );

    const meta = {
      totalItems: total,
      itemCount: results.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(total / +limit),
      currentPage: page,
    };

    const baseUrl = 'sales/find/all/credits';
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
      items: results,
      meta,
      links,
    };
  };
}
