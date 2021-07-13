import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {

  }

  goto(page) {
    this.router.navigate([page]);
  }

  ngOnDestroy() {
  }

}
