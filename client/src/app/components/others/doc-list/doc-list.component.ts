import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DocServiceService } from 'src/app/services/doc-service.service';

@Component({
  selector: 'app-doc-list',
  templateUrl: './doc-list.component.html',
  styleUrls: ['./doc-list.component.css']
})
export class DocListComponent implements OnInit, OnDestroy {
  documents: Observable<string[]>;
  currentDoc: string;
  private _docSub: Subscription;

  constructor(private documentService: DocServiceService) { }

name:string = null;

  ngOnInit() {
    this.documents = this.documentService.documents;
    this._docSub = this.documentService.currentDocument.subscribe(doc => this.currentDoc = doc.id);
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  write(){
    if(this.name == null){
      this.newDoc()
    }else{
      this.newDefDoc(this.name)
      this.name = null;
    }
  }

  loadDoc(id: string) {
    this.documentService.getDocument(id);
  }

  delDoc(id:string){
    this.documentService.delDocument(id);
  }

  newDoc() {
    this.documentService.newDocument();
  }

  newDefDoc(name:string){
    this.documentService.newDefDoc(name);
  }
}
