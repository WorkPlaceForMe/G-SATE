import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Document } from '../models/Document';

@Injectable({
  providedIn: 'root'
})
export class DocServiceService {
  currentDocument = this.socket.fromEvent<Document>('document');
  documents = this.socket.fromEvent<string[]>('documents');

  constructor(private socket: Socket) { }

  getDocument(id: string) {
    this.socket.emit('getDoc', id);
  }

  newDocument() {
    this.socket.emit('addDoc', { id: this.docId(), doc: '' });
  }
  
  newDefDoc(name:string){
    this.socket.emit('addDoc', { id: name, doc: '' });
  }

  editDocument(document: Document) {
    this.socket.emit('editDoc', document);
  }

  delDocument(id:string){
    this.socket.emit('delDoc', id);
  }

  private docId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
