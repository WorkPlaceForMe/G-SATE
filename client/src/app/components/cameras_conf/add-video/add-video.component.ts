import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.css']
})
export class AddVideoComponent implements OnInit {

  name: any;
  fileName: any;
  load: boolean = true;

  constructor() { }
  
  ngOnInit() {
    this.name = 'search';
  }

  uploa() {

  }
}
