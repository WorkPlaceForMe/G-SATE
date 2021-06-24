import { Component, OnInit, OnDestroy } from '@angular/core';
// import * as moment from 'moment-timezone';

@Component({
  selector: 'app-federated-learning',
  templateUrl: './federated-learning.component.html',
  styleUrls: ['./federated-learning.component.css']
})
export class FederatedLearningComponent implements OnInit, OnDestroy {

  isMeridian: boolean;

  inferencing_start_time: any;
  inferencing_end_time: any;

  traning_start_time: any;
  traning_end_time: any;

  federated_payload = {
    inferencing_time_slot: {
      start_time: "",
      end_time: ""
    },
    traning_time_slot: {
      start_time: "",
      end_time: ""
    }
  }

  constructor() {
    this.isMeridian = false;
    // this.inferencing_start_time = '';
    // this.inferencing_end_time = '';
    // this.traning_start_time = '';
    // this.traning_end_time = '';
  }

  ngOnInit() {

  }

  inferencingStartTimeChanged() {
    console.log('inferencing_start_time - ', this.inferencing_start_time);
  }


  ngOnDestroy() {
  }

}
