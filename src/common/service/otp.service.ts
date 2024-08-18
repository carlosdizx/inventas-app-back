import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserOtp from '../../users/entities/user-otp.entity';
import { Repository } from 'typeorm';
import { OTP } from '../constants/messages.constant';
import generateNumberCodeUtil from '../util/generate-number-code.util';
import NodemailerService from './nodemailer.service';
import User from '../../users/entities/user.entity';
import notificationOtpUserEmail from '../templates/mails/notification-otp-user.email';

@Injectable()
export default class OtpService {
  constructor(
    @InjectRepository(UserOtp)
    private readonly otpRepository: Repository<UserOtp>,
    private readonly nodemailerService: NodemailerService,
  ) {}

  public generateOtp = async ({ id, email }: User) => {
    const otp = generateNumberCodeUtil(6);
    const expiresAt = new Date(Date.now() + 10 * 60000);

    let userOtp = await this.otpRepository.findOne({
      where: { user: { id } },
    });

    if (userOtp) {
      userOtp.otp = otp;
      userOtp.expiresAt = expiresAt;
    } else {
      userOtp = this.otpRepository.create({
        otp,
        expiresAt,
        user: { id },
      });
    }

    await this.nodemailerService.main({
      from: `Confirmación de acción ${otp} <noreply_inventa@gmail.com>`,
      to: email,
      subject: 'Código de verificación Inventas-App',
      html: notificationOtpUserEmail(otp),
    });

    await this.otpRepository.save(userOtp);
    return { message: OTP.SUCCESS };
  };

  public validateOtp = async (
    userId: string,
    otp: string,
  ): Promise<boolean> => {
    const userOtp = await this.otpRepository.findOne({
      where: { user: { id: userId }, otp },
    });

    if (!userOtp || userOtp.expiresAt < new Date())
      throw new BadRequestException(`${OTP.EXPIRED} o ${OTP.NOT_FOUND}`);

    await this.otpRepository.remove(userOtp);

    return true;
  };
}
