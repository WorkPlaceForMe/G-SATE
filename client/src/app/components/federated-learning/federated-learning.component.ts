import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-federated-learning',
  templateUrl: './federated-learning.component.html',
  styleUrls: ['./federated-learning.component.css']
})
export class FederatedLearningComponent implements OnInit, OnDestroy {

  isMeridian: boolean;

  inferencing_start_time: Date = new Date();
  inferencing_end_time: Date = new Date();

  traning_start_time: Date = new Date();
  traning_end_time: Date = new Date();

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
    this.inferencing_start_time.setHours(12);
    this.inferencing_start_time.setMinutes(0);
    this.inferencing_end_time.setHours(22);
    this.inferencing_end_time.setMinutes(59);

    this.traning_start_time.setHours(23);
    this.traning_start_time.setMinutes(0);
    this.traning_end_time.setHours(23);
    this.traning_end_time.setMinutes(59);
  }

  ngOnInit() {

  }

  inferencingStartTimeChanged() {
    console.log('inferencing_start_time - ', this.inferencing_start_time);
  }

  saveFederatedTiming() {
    this.federated_payload = {
      inferencing_time_slot: {
        start_time: moment(this.inferencing_start_time).format('HH:mm'),
        end_time: moment(this.inferencing_end_time).format('HH:mm')
      },
      traning_time_slot: {
        start_time: moment(this.traning_start_time).format('HH:mm'),
        end_time: moment(this.traning_end_time).format('HH:mm')
      }
    }
  }


  ngOnDestroy() {
  }

}
