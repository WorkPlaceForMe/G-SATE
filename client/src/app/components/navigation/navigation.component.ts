import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { NavigationService } from '../../shared/services/navigation.service';
import { ip } from '../../models/IpServer'

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
    isUserAdmin: boolean;
    hasService1: boolean;
    hasService2: boolean;
    hasService3: boolean;
    hasService4: boolean;
    hasService5: boolean;
    hasService6: boolean;
    constructor(private navigationService: NavigationService, public router: Router) {

        // Subscribe here, this will automatically update
        // "isUserLoggedIn" whenever a change to the subject is made.
        this.navigationService.isUserAdmin.subscribe(value => {
            this.isUserAdmin = value;
        });
        this.navigationService.hasService1.subscribe(value => {
            this.hasService1 = value;
        });
        this.navigationService.hasService2.subscribe(value => {
            this.hasService2 = value;
        });
        this.navigationService.hasService3.subscribe(value => {
            this.hasService3 = value;
        });
        this.navigationService.hasService4.subscribe(value => {
            this.hasService4 = value;
        });
        this.navigationService.hasService5.subscribe(value => {
            this.hasService5 = value;
        });
        this.navigationService.hasService6.subscribe(value => {
            this.hasService6 = value;
        });
    }
    ngOnInit() {
    }


    goToLink() {
        window.open("http://" + ip + ":3000/", "_blank");
    }

}
