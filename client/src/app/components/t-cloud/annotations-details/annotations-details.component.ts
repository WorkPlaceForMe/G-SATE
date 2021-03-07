import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-annotations-details',
  templateUrl: './annotations-details.component.html',
  styleUrls: ['./annotations-details.component.css']
})
export class AnnotationsDetailsComponent implements OnInit {
  date: any;
  public date_now = new Date(Date.now()).toString();
  public max = new Date(this.date_now);
  constructor(private router: Router,  private datepipe: DatePipe) { }

  ngOnInit() {
  }

}
