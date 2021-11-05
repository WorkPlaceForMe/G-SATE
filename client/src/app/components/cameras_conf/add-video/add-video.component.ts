import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FacesService } from "../../../services/faces.service";

@Component({
  selector: "app-add-video",
  templateUrl: "./add-video.component.html",
  styleUrls: ["./add-video.component.scss"],
})
export class AddVideoComponent implements OnInit {
  name: any = "";
  load: boolean = false;
  cameraList: any = [];
  cameraName: string = "";
  videoName: string = "";
  spin: boolean = false;

  constructor(private router: Router, private facesService: FacesService) {}

  ngOnInit() {
    this.getCameraList();
  }

  getCameraList() {
    this.facesService.getCameras().subscribe(
      (res) => {
        this.cameraList = res;

        console.log(this.cameraList);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  upload() {
    console.log(this.videoName);
    const format = this.videoName.split(".")[1];
    this.spin = true;
    if (format !== "mp4") {
      alert("File format not supported");
      this.spin = false;
    } else {
      if (this.name == "") {
        this.facesService.mergeVideo(this.cameraName, this.videoName).subscribe(
          (response: any) => {
            this.spin = false;
            console.log(response);
            this.clearFormAndNavigate(response.id);
          },
          (err) => {
            console.log(err);
            this.spin = false;
            alert(err.error.message);
          }
        );
      } else if (this.cameraName == "") {
        this.facesService.uploadVideo(this.videoName, this.name).subscribe(
          (response: any) => {
            console.log(response);
            this.spin = false;
            this.clearFormAndNavigate(response.id);
          },
          (err) => {
            console.log(err);
            this.spin = false;
            alert(err.error.message);
          }
        );
      }
    }
  }

  clearFormAndNavigate(id: string) {
    this.cameraName = "";
    this.name = "";
    this.videoName = "";
    this.facesService.doOneImage(id).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(["/cameras/algorithms/" + id]);
      },
      (err) => {
        console.log(err);
        this.router.navigate(["/cameras/algorithms/" + id]);
      }
    );
  }
}
