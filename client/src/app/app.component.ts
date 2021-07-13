import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { FacesService } from './services/faces.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
  trigger('flyInOut', [
    state('in', style({ transform: 'translateX(0)' })),
    transition('void => *', [
      style({ transform: 'translateX(-100%)' }),
      animate(500)
    ]),
    transition('* => void', [
      animate(500, style({ transform: 'translateX(100%)' }))
    ])
  ])
]
})
export class AppComponent implements OnInit{
  isRunning: boolean=false;
  myFunction(){
  this.isRunning=!this.isRunning;
  }
ip:any;
ngOnInit(){
  this.deviceInfo = this.deviceService.getDeviceInfo();
  this.deviceInfo['width'] = window.innerWidth;
  this.deviceInfo['height'] = window.innerHeight;
//  this.getIpCliente();
//   this.facesService.info(this.deviceInfo).subscribe(
//     res => {
//           console.log(res);
//   }, err => console.log(err)
//   )
}

getIpCliente() {
  this.http.get('http://api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK')
   .subscribe( res => {
     console.log(res);
 }, err => 
     this.facesService.info(JSON.parse((err.error.text.slice(15)).slice(0, err.error.text.slice(15).length -2))).subscribe(
       res => {
             console.log(res);
     }, err => console.log(err)
     )
   )
 }

  deviceInfo = null;
  public innerWidth: any;
  public innerHeight: any;

  @HostListener('window:resize', ['$event'])
onResize(event) {
  this.innerWidth = window.innerWidth;
  this.innerHeight = window.innerHeight;
}

  hola: string = 'Made By Alex Kaiser';
  contact: string = 'i93kaiser@hotmail.com';

    constructor(private deviceService: DeviceDetectorService, private http: HttpClient, private facesService: FacesService) {
    }
}
