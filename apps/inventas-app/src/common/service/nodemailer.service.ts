import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import SendEmailDto from '../dto/send.email.dto';
@Injectable()
export default class NodemailerService {
  private readonly transporter;

  constructor(private readonly configService: ConfigService) {
    const host = configService.get<string>('SMTP_HOST');
    const port = configService.get<number>('SMTP_PORT');
    const secure = configService.get<boolean>('SMTP_SECURE');
    const user = configService.get<string>('SMTP_USER');
    const pass = configService.get<string>('SMTP_PASSWORD');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
    this.transporter.verify();
  }

  public main = async ({ from, to, subject, html }: SendEmailDto) => {
    this.transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  };
}
