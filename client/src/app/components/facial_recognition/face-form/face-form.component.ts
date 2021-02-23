import { Component, OnInit, HostBinding } from '@angular/core';
import { User } from 'src/app/models/User';
import { FacesService } from '../../../services/faces.service';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-face-form',
  templateUrl: './face-form.component.html',
  styleUrls: ['./face-form.component.css'],
  animations: [
  trigger('flyInOut', [
    transition('void => *', [
      style({ transform: 'translateX(100%)' }),
      animate(300)
    ])
  ])
]
})
export class FaceFormComponent implements OnInit {
  @HostBinding('class') classes ='row';

  user: User = {
    id: 0,
    name: '',
    gender: '',
    age_group: '',
    role: '',
    category: '',
    uuid: '',
    errors:''
  };

  mess0:boolean = false;
  edit : boolean = false;
  is_saving : boolean = false;
  constructor(private facesService: FacesService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    if(params.uuid){
      this.facesService.getUser(params.uuid)
      .subscribe(
        res =>{
          this.user = res;
          this.edit = true;
        },
        err => console.error(err)
      )
    }
  }
  saveUser(){
    if(this.user.name != '' && this.user.gender != '' && this.user.age_group != '' && this.user.role != ''){
    delete this.user.id;
    this.user.uuid = uuid();
    this.facesService.saveUser(this.user)
    .subscribe(
      res=>{
        this.is_saving = true;
        console.log(res);
        this.router.navigate(['/user/images/' + this.user.uuid]);
      },
      err => console.error(err)
    )
  } else {
    this.mess0 = true;
    setTimeout(() => {
      this.mess0 = false
    }, 5000)
  }
}

  updateUser(){
    const params = this.activatedRoute.snapshot.params.uuid;
    if(this.user.name != ''){
    this.facesService.updateUser(params, this.user)
    .subscribe(
    res => {
      this.is_saving = true;
      console.log(res);
      this.router.navigate(['/management']);
    },
    err => console.log(err)
  );
} else {
  this.mess0 = true;
  setTimeout(() => {
    this.mess0 = false
  }, 5000)
}
}
}
