import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  constructor() { }

  link:string ='http://192.168.1.24:3000/d/ms1Q8xuiz/mine?orgId=1&from=1542844547390&to=1542941555392'

  ngOnInit() {
  }

}
