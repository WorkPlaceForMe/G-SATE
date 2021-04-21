import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaceFormComponent } from './components/facial_recognition/face-form/face-form.component';
import { ImagesFormComponent } from './components/facial_recognition/images-form/images-form.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { ScheduleComponent } from './components/facial_recognition/schedule/schedule.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LiveComponent } from './components/cameras_conf/livestream/live.component';
import { HeatmapComponent } from './components/cameras_conf/heatmap/heatmap.component';
import { FaceListComponent } from './components/facial_recognition/face-list/face-list.component';
import { VidComponent } from './components/cameras_conf/add_camera/vid.component';
import { ROIComponent } from './components/cameras_conf/roi/roi.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { AlgorithmsComponent } from './components/cameras_conf/algorithms/algorithms.component';
import { SearchComponent } from './components/facial_recognition/search/search.component';
import { ButtomsComponent } from './components/t-cloud/main/buttoms.component';
import { ClimbingBarricadeComponent } from './components/others/main_docs/climbing-barricade.component';
import { LoiteringDetectionComponent } from './components/t-cloud/annotations/loitering-detection.component';
import { SpeedingVehicleComponent } from './components/t-cloud/video_to_frames/speeding-vehicle.component';
import { UnwantedVehicleComponent } from './components/t-cloud/images_classification/unwanted-vehicle.component';
import { LivestreamComponent } from './components/cameras_conf/camera_list/livestream.component';
import { ObjectDetectionComponent } from './components/t-cloud/object-detection/object-detection.component';
import { ObjDetImgComponent } from './components/t-cloud/obj-det-img/obj-det-img.component';
import { ObjDetMulImgsComponent } from './components/t-cloud/obj-det-mul-imgs/obj-det-mul-imgs.component';
import { AnnotationsDetailsComponent } from './components/t-cloud/annotations-details/annotations-details.component';
import { AddVideoComponent } from './components/cameras_conf/add-video/add-video.component';
import { AnnotationsConfirmComponent } from './components/t-cloud/annotations-confirm/annotations-confirm.component';
import { ObjectDetectionConfirmComponent } from './components/t-cloud/object-detection-confirm/object-detection-confirm.component';
import { ObjectDetectionDetailsComponent } from './components/t-cloud/object-detection-details/object-detection-details.component';
import { AuthGuard } from './services/auth.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'annotations',
    pathMatch: 'full'
  },
  {
    path: 'management',
    component: FaceListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user/schedule/:id',
    component: ScheduleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user/edit/:uuid',
    component: FaceFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user/add',
    component: FaceFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'annotations',
    component: ButtomsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user/images/:id',
    component: ImagesFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cameras/live/:id',
    component: LiveComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cameras/heatmap/:uuid',
    component: HeatmapComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'classify/:choose',
    component: UnwantedVehicleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'prediction/:choose',
    component: UnwantedVehicleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cameras/algorithms/:uuid/:id',
    component: ROIComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user/search',
    component: SearchComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'camerasList',
    component: LivestreamComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'annotations/dataset/:method/:folder/:image',
    component: ObjDetMulImgsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'annotations/dataset/:method/:folder/:image/details',
    component: ObjectDetectionDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'annotations/objectDetection/confirm',
    component: ObjectDetectionConfirmComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'annotations/:method/:folder/:image',
    component: LoiteringDetectionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'annotations/:method/:folder/:image/details',
    component: AnnotationsDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'annotations/confirm',
    component: AnnotationsConfirmComponent,
    canActivate: [AuthGuard]
  },
  /* {
    path: 'objectDetection/:folder/:image',
    component: LoiteringDetectionComponent
  }, */
  {
    path: 'annotation/video/:cam_name/:date',
    component: SpeedingVehicleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cameras/edit/:uuid',
    component: VidComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cameras/add_camera',
    component: VidComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cameras/add_video',
    component: AddVideoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cameras/algorithms/:uuid',
    component: AlgorithmsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'documents',
    component: ClimbingBarricadeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'objectDetection',
    component: ObjectDetectionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'objectDetection/img/label',
    component: LoiteringDetectionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: PagenotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
