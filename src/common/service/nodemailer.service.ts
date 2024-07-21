import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import SendEmailDto from '../dto/send.email.dto';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

@Injectable()
export default class NodemailerService {
  private readonly logger = new Logger(NodemailerService.name);
  private readonly transporter: nodemailer.Transporter<SentMessageInfo>;

  constructor(private readonly configService: ConfigService) {
    const host = configService.get<string>('SMTP_HOST');
    const port = configService.get<number>('SMTP_PORT');
    const secure = configService.get<boolean>('SMTP_SECURE');
    const user = configService.get<string>('SMTP_USER');
    const pass = configService.get<string>('SMTP_PASSWORD');

    /*
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
    this.transporter
      .verify()
      .then(() => this.logger.debug('Connected to email successfully'));
     */
  }

  public main = async ({ from, to, subject, html }: SendEmailDto) =>
    await this.transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
}
