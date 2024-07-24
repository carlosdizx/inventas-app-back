import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { FirebaseOptions } from '@firebase/app';

@Injectable()
export default class FirebaseService {
  public firestore: ReturnType<typeof getFirestore>;

  constructor(private configService: ConfigService) {
    const firebaseConfig: FirebaseOptions = {
      apiKey: this.configService.getOrThrow<string>('FIREBASE_API_KEY'),
      authDomain: this.configService.getOrThrow<string>('FIREBASE_AUTH_DOMAIN'),
      projectId: this.configService.getOrThrow<string>('FIREBASE_PROJECT_ID'),
      storageBucket: this.configService.getOrThrow<string>(
        'FIREBASE_STORAGE_BUCKET',
      ),
      messagingSenderId: this.configService.getOrThrow<string>(
        'FIREBASE_MESSAGING_SENDER_ID',
      ),
      appId: this.configService.getOrThrow<string>('FIREBASE_APP_ID'),
      measurementId: this.configService.getOrThrow<string>(
        'FIREBASE_MEASUREMENT_ID',
      ),
    };

    const app = initializeApp(firebaseConfig);
    this.firestore = getFirestore(app);
  }
}
