import { Component, OnInit, HostBinding, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Image } from 'src/app/models/Image';
import { FacesService } from '../../../services/faces.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { ip } from '../../../models/IpServer';
import { v4 as uuid } from 'uuid';
import { User } from 'src/app/models/User';
import { AnnotationsService } from 'src/app/services/annotations.service';

const URL = 'http://' + ip + ':3000/upload';

@Component({
  selector: 'app-images-form',
  templateUrl: './images-form.component.html',
  styleUrls: ['./images-form.component.css']
})
export class ImagesFormComponent implements OnInit {

  @HostBinding('class') classes = 'row';

  form: FormGroup;
  uploadName: string;
  id: string;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  images: any = [];
  imagesFiles: any = [];
  fileName: string = "";
  image: Image = {
    id: 0,
    user_id: '',
    location: '',
    name: ''
  };
  user: User = {
    id: 0,
    name: '',
    gender: '',
    age_group: '',
    role: '',
    category: '',
    uuid: ''
  };

  uploadFileNames: Array<string> = [];
  constructor(private facesService: FacesService, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private annserv: AnnotationsService) {
    const params = this.activatedRoute.snapshot.params;
    this.facesService.getUser(params.id)
      .subscribe(
        res => {
          this.user = res;
        },
        err => console.error(err)
      )
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      id: null,
      user_id: this.id,
      location: null
    });
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.uploadName = this.activatedRoute.snapshot.params.id + '_' + uuid() + '.jpg';
      this.fileName += file.file.name + ",";
      file.file.name = this.uploadName;
      this.uploadFileNames.push(this.uploadName);
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.getImagesFiles();
      console.log("Uploaded:", item, status, response);
    };
    this.getImagesFiles();
  }

  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'file'
  });

  size: any;
  name: any;
  delImages: any = [];

  // saveImage(index: number){
  //   delete this.image.id;
  //   // this.image.location = 'assets/pictures/'+ this.uploadFileNames[index];
  //   const path = this.uploadFileNames[index].split('_');
  //   this.image.location = 'http://' +ip+':6503/pictures/' + path[0] + '/' + path[1];
  //   this.image.name = path[1];
  //   this.image.user_id = this.user.uuid;
  //   this.facesService.saveImage(this.image)
  //           .subscribe(
  //             res=>{
  //               console.log(res);
  //             },
  //             err => console.error(err),
  //            () => index < this.uploadFileNames.length -1 ? this.saveImage(index +1) : this.saveImage_complete()
  //   )
  // }

  getImagesFiles() {
    const hola = this.activatedRoute.snapshot.params.id;
    this.annserv.getImages(hola, 'images').subscribe(
      res => {
        this.imagesFiles = res;
        for (var a in this.imagesFiles) {
          this.imagesFiles[a]['location'] = "http://" + ip + ":6503/pictures/" + hola + '/' + this.imagesFiles[a]['name']
        }
      },
      err => console.log(err)
    )
  }

  //Not finished module of select the images to delete

  // getIt(imName:string,num){
  //   let a = 0;
  //   if(this.delImages.length == 0){
  //     console.log(num)
  //     this.delImages.push(imName);
  //   }else {
  //   for(let i = 0; i < this.delImages.length; i ++){
  //     if(imName == this.delImages[i]){
  //       this.delImages.splice(num,1);
  //     }else{
  //       a ++;
  //     }
  //   }
  //   if(a == this.delImages.length){
  //     console.log(num)
  //     this.delImages.push(imName);
  //   }
  // }
  // }

  saveImage_complete() {
    console.log("complete");
    this.uploadFileNames = [];
    this.fileName = "";
    this.getImagesFiles();
  }

  deleteImage(name: string) {
    if (confirm('Do you want to delete this image?')) {
      // this.facesService.deleteImage(id).subscribe(
      //   res =>{
      //     console.log(res);
      //     this.facesService.getSome(this.user.uuid)
      //     .subscribe(
      //       res =>{
      //         this.images = res;
      //       },
      //         err => console.error(err)
      //       );
      //   },
      //   err => console.log(err)
      // )
      this.facesService.deleteImageFile(name, this.activatedRoute.snapshot.params.id).subscribe(
        res => {
          console.log(res);
          this.getImagesFiles();
        },
        err => console.error(err)
      )
    }
  }

}
