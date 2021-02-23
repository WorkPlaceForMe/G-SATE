import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css'],
  animations: [
  trigger('flyInOut', [
    transition('void => *', [
      style({ transform: 'translateX(-100%)' }),
      animate(400)
    ])
  ]),
  trigger('flyIn', [
    transition('void => *', [
      style({ transform: 'translateX(100%)' }),
      animate(400)
    ])
  ])
]
})

export class CamerasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
