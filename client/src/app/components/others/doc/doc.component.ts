import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocServiceService } from 'src/app/services/doc-service.service';
import { Subscription } from 'rxjs';
import { Document } from 'src/app/models/Document';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.css']
})
export class DocComponent implements OnInit, OnDestroy {
  document: Document;
  private _docSub: Subscription;
  constructor(private documentService: DocServiceService) { }

deact:boolean = true;

  ngOnInit() {
    this._docSub = this.documentService.currentDocument.pipe(
      startWith({
        id: '',
        doc: ''
    })
    ).subscribe(document => this.document = document);
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  editDoc() {
    this.documentService.editDocument(this.document);
  }

}
