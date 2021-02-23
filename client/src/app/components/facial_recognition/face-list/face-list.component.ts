import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { FacesService } from '../../../services/faces.service';


@Component({
  selector: 'app-face-list',
  templateUrl: './face-list.component.html',
  styleUrls: ['./face-list.component.css']
})
export class FaceListComponent implements OnInit {


    @HostBinding('class') classes ='row';
    users: any = [];
    images: any = [];
    constructor(private facesService: FacesService) { }
        
    ngOnInit() {
      this.getUsers();
    }


    
  getUsers(){
    this.facesService.getUsers().subscribe(
      res => {
        this.users = res;
        console.log(this.users)
      },
      err => console.error(err)
    );
  }

    deleteUser(id: string){
      if(confirm('Do you want to delete this user?')){
      this.facesService.deleteUser(id).subscribe(
        res =>{
          console.log(res);
          this.facesService.getSome(id)
                  .subscribe(
                    res =>{
                      this.images = res;
                      for(let i = 0; i < this.images.length; i++){
                        this.facesService.deleteImage(this.images[i]['id']).subscribe(
                          res =>{
                            console.log(res);
                          },
                          err => console.log(err)
                        )
                      }
                      this.facesService.deleteAllImageFile(id).subscribe(
                        res =>{
                        console.log(res);
                        },
                        err => console.error(err)
                        )
                    },
                      err => console.error(err)
                    );
          this.getUsers();
        },
        err => console.log(err)
      )
    }
  }

  comparatorName(a,b){
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
  }
  
  comparatorGender(a,b){
    if(a.gender < b.gender) return -1;
    if(a.gender > b.gender) return 1;
    return 0;
  }
  
  comparatorAge(a,b){
    if(a.age_group < b.age_group) return -1;
    if(a.age_group > b.age_group) return 1;
    return 0;
  }

  
  comparatorDes(a,b){
    if(a.role < b.role) return -1;
    if(a.role > b.role) return 1;
    return 0;
  }

  comparatorCat(a,b){
    if(a.category < b.category) return -1;
    if(a.category > b.category) return 1;
    return 0;
  }
  sortName(){    
    this.users.sort(this.comparatorName)
  }

  sortGender(){
    this.users.sort(this.comparatorGender)
  }

  sortAge(){
    this.users.sort(this.comparatorAge)
  }

  sortRole(){
    this.users.sort(this.comparatorDes)
  }

  sortCategory(){
    this.users.sort(this.comparatorCat)
  }
  }
