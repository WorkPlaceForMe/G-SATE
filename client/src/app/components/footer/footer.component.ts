import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  socialIocns: Array<any>;
  constructor() { }

  ngOnInit() {
    this.socialIocns = [
      {
        icon: 'facebook.svg',
        link: '#',
      },
      {
        icon: 'twitter.svg',
        link: '#',
      },
      {
        icon: 'youtube.svg',
        link: '#',
      }
    ];
  }

}
