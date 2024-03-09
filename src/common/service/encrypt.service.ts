import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class EncryptService {
  private readonly secretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get('ENCRYPT_SECRET_KEY');
  }

  public encrypt = (data: string): string => {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  };

  public decrypt = (cipherText: string): string => {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  public applyEncryption = (data: any, fieldsToEncrypt: string[]): void => {
    const keys = Object.keys(data);

    for (const field of fieldsToEncrypt) {
      if (keys.includes(field)) {
        data[field] = this.encrypt(`${data[field]}`);
      }
    }
  };

  public applyDecryption = (data: any, fieldsToDecrypt: string[]): void => {
    const keys = Object.keys(data);

    for (const field of fieldsToDecrypt) {
      if (keys.includes(field) && data[field]) {
        data[field] = this.decrypt(data[field]);
      }
    }
  };
}
