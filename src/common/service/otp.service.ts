import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  getDoc,
  where,
} from 'firebase/firestore';
import FirebaseService from './firebase.service';
import generateNumberCodeUtil from '../util/generate-number-code.util';

@Injectable()
export default class OtpService {
  constructor(private readonly firebaseService: FirebaseService) {}

  public async saveOtp(email: string) {
    const otp = generateNumberCodeUtil(6);
    const data = {
      otp,
      expiresAt: Date.now() + 600 * 1000,
    };
    const docRef = doc(this.firebaseService.firestore, 'otps', email);
    await setDoc(docRef, data);
  }

  private async getOtpByEmail(email: string) {
    const docRef = doc(this.firebaseService.firestore, 'otps', email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }

    return null;
  }

  public async verifyOtp(email: string, otp: string) {
    const otpData = await this.getOtpByEmail(email);

    if (!otpData)
      throw new NotFoundException(
        'No se encontro una solicitud de confirmación via OTP',
      );

    if (otpData.expiresAt < Date.now()) {
      await this.deleteOtp(email);
      return false;
    }

    if (otpData.otp === otp) {
      await this.deleteOtp(email);
      return true;
    } else throw new BadRequestException('Otp invalido');
  }

  public async deleteOtp(email: string) {
    const colRef = collection(this.firebaseService.firestore, 'otps');
    const q = query(colRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = doc(
        this.firebaseService.firestore,
        'otps',
        querySnapshot.docs[0].id,
      );
      await deleteDoc(docRef);
    }
  }
}
