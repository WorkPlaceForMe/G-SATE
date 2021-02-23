import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Day } from 'src/app/models/Day';
import { FacesService } from '../../../services/faces.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {


  day: Day = {
    id: 0,
    user_id: 0,
    day: 0,
    entrance: "",
    leave: ""
  };

  oriStart: string[] = ["", "", "", "", "", "", ""];
  oriEnd: string[] = ["", "", "", "", "", "", ""];

  constructor(
    private activatedRoute: ActivatedRoute,
    private facesService: FacesService,
    private router: Router
  ) { }


  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.day.user_id = params.id;
    this.init_sub();
}

  init_sub() {
    this.facesService.getAllSchedule(this.day.user_id)
        .subscribe(
          (res:any[]) =>{
            console.log(res);
            for(var i = 0; i < res.length; i++){
              this.oriStart[res[i].day] = res[i].entrance;
              this.oriEnd[res[i].day] = res[i].leave_time;
            }
            console.log(this.oriEnd);
          },
          err => console.error(err)
      )
  }

  submit(startOne, startTwo, startThr, startFou, startFif, startSix, startSev,
  endOne, endTwo, endThr, endFou, endFif, endSix, endSev) {
    this.submit_sub(startOne, endOne, 0);
    this.submit_sub(startTwo, endTwo, 1);
    this.submit_sub(startThr, endThr, 2);
    this.submit_sub(startFou, endFou, 3);
    this.submit_sub(startFif, endFif, 4);
    this.submit_sub(startSix, endSix, 5);
    this.submit_sub(startSev, endSev, 6);
    this.router.navigate(['/management']);
  }

deleteSchedule(){
  const now_user = JSON.parse(localStorage.getItem('now_user'));
    if(confirm('Do you want to delete the schedule?')){
    this.facesService.deleteSchedule(this.day.user_id).subscribe(
      res =>{
        this.router.navigate(['/management']);
              },
      err => console.log(err)
    )
  }
}

  submit_sub(start, end, day){
      if(start.length == 5 && end.length == 5 && (this.oriStart[day] !== start || this.oriEnd[day] !== end)){
        var current_day : Day = {
          id: 0,
          user_id: this.day.user_id,
          day: day,
          entrance: start,
          leave: end
        };
        const now_user = JSON.parse(localStorage.getItem('now_user'));
            if(this.oriStart[day] === ""){
              const now_user = JSON.parse(localStorage.getItem('now_user'));
              this.facesService.saveSchedule(current_day)
              .subscribe(
                res=>{
                  console.log(res);
                  this.oriStart[day] = start;
                  this.oriEnd[day] = end;
                },
                err => console.error(err)
                )
              } else {
                const now_user = JSON.parse(localStorage.getItem('now_user'));
                this.facesService.updateSchedule(current_day)
                .subscribe(
                  res=>{
                    console.log(res);
                    this.oriStart[day] = start;
                    this.oriEnd[day] = end;
                  },
                  err => console.error(err)
                )
              }
      }
  }
}
