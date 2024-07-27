import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import FirebaseService from './firebase.service';
import generateNumberCodeUtil from '../util/generate-number-code.util';
import { OTP } from '../constants/messages.constant';
import NodemailerService from './nodemailer.service';
import notificationOtpUserMail from '../templates/mails/notification-otp-user.mail';

@Injectable()
export default class OtpService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly nodemailerService: NodemailerService,
  ) {}

  public async saveOtp(email: string) {
    const otp = generateNumberCodeUtil(6);
    const data = {
      otp,
      expiresAt: Date.now() + 600 * 1000,
    };
    const docRef = doc(this.firebaseService.firestore, 'otps', email);
    await setDoc(docRef, data);
    await this.nodemailerService.main({
      from: 'Registro exitoso <noreply_inventa@gmail.com>',
      to: email,
      subject: 'Código de verificación Inventas-App',
      html: notificationOtpUserMail(otp),
    });
    return { message: OTP.SUCCESS };
  }

  private async getOtpByEmail(email: string) {
    const docRef = doc(this.firebaseService.firestore, 'otps', email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) return docSnap.data();

    throw new NotFoundException(OTP.NOT_FOUND);
  }

  public async verifyOtp(email: string, otp: string) {
    const otpData = await this.getOtpByEmail(email);

    if (!otpData) throw new NotFoundException(OTP.NOT_FOUND);

    if (otpData.expiresAt < Date.now()) {
      await this.deleteOtp(email);
      throw new BadRequestException(OTP.EXPIRED);
    }

    if (otpData.otp === otp) {
      await this.deleteOtp(email);
      return true;
    } else throw new BadRequestException(OTP.INVALID);
  }

  public async deleteOtp(email: string) {
    const docRef = doc(this.firebaseService.firestore, 'otps', email);
    await deleteDoc(docRef);
  }
}
