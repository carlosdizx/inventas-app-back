import { Injectable } from '@nestjs/common';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
  startAt,
  getDoc,
  DocumentData,
  Query,
} from 'firebase/firestore';
import FirebaseService from './firebase.service';

@Injectable()
export default class FirestoreService {
  constructor(private readonly firebaseService: FirebaseService) {}

  public getCollection = async (collectionName: string) => {
    const colRef = collection(this.firebaseService.firestore, collectionName);
    const colSnapshot = await getDocs(colRef);
    return colSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  public addDocument = async (collectionName: string, data: any) => {
    const colRef = collection(this.firebaseService.firestore, collectionName);
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  };

  public updateDocument = async (
    collectionName: string,
    docId: string,
    data: any,
  ) => {
    const docRef = doc(this.firebaseService.firestore, collectionName, docId);
    await updateDoc(docRef, data);
    return docRef.id;
  };

  public deleteDocument = async (collectionName: string, docId: string) => {
    const docRef = doc(this.firebaseService.firestore, collectionName, docId);
    await deleteDoc(docRef);
  };

  public getPaginatedCollection = async (
    collectionName: string,
    orderByField: string,
    pageSize: number,
    startAfterDocId?: string,
  ) => {
    const colRef = collection(this.firebaseService.firestore, collectionName);
    let q: Query<DocumentData, DocumentData>;

    if (startAfterDocId) {
      const startAfterDoc = await getDoc(
        doc(this.firebaseService.firestore, collectionName, startAfterDocId),
      );
      q = query(
        colRef,
        orderBy(orderByField),
        startAt(startAfterDoc),
        limit(pageSize),
      );
    } else {
      q = query(colRef, orderBy(orderByField), limit(pageSize));
    }

    const colSnapshot = await getDocs(q);
    return colSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };
}
