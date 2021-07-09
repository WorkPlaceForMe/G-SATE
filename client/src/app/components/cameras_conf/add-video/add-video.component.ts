import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { ip } from '../../../models/IpServer';
import { ActivatedRoute, Router } from '@angular/router';
import { FacesService } from '../../../services/faces.service';

const URL = 'http://' + ip + ':3000/api/video/upload';
@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss']
})
export class AddVideoComponent implements OnInit {

  name: any;
  fileName: any;
  load: boolean = false;
  up: boolean = false;
  finished: boolean = false;
  progress: number = 0;

  constructor(private router: Router, private facesService: FacesService) { }

  @ViewChild('fileInput', { static: false }) fileInputVariable: any;
  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'file',
    allowedFileType: ['video'],
  });

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      const format = file.file.name.split('.')[1];
      const name = this.name.split(' ').join('_');
      const newName = name + '.' + format;
      file.file.name = newName;
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      console.log(response);
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.up = false;
      // this.load = false;
      this.fileInputVariable.nativeElement.value = '';
      this.fileName = null;
      this.name = null;
      this.facesService.doOneImage(JSON.parse(response).id).subscribe(res => {
        console.log(res)
        this.router.navigate(['/cameras/algorithms/' + JSON.parse(response).id]);
      }, err => {
        console.log(err)
        this.router.navigate(['/cameras/algorithms/' + JSON.parse(response).id]);
      }
      )
    };
    this.uploader.onProgressItem = (progress: any) => {
      this.progress = progress['progress'];
      console.log(this.progress);
      if (progress['progress'] === 100) {
        this.finished = true;
        console.log('uploaded');
      }
    };
  }

  change() {
    console.log(this.fileInputVariable.nativeElement.files);
    const format = this.fileInputVariable.nativeElement.files[0]['name'].split('.')[1];
    const file = this.fileInputVariable.nativeElement.files[0]['type'].split('/')[0];
    if (file !== 'video') {
      this.up = false;
      alert('File format not supported');
    } else if (format === 'avi' || format === 'AVI') {
      this.up = false;
      alert('File format not supported');
    } else {
      this.fileName = null;
      if (this.fileInputVariable.nativeElement.files.length !== 0) {
        this.up = true;
        this.fileName = this.fileInputVariable.nativeElement.files[0]['name'];
        this.load = false;
      } else {
        this.up = false;
      }
    }
  }

  uploa() {
    this.up = true;
    this.load = true;
    this.fileInputVariable.nativeElement.value = '';
    this.uploader.uploadAll();
  }
}
