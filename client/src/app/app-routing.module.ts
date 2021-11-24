import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { FaceFormComponent } from "./components/facial_recognition/face-form/face-form.component";
import { ImagesFormComponent } from "./components/facial_recognition/images-form/images-form.component";
import { PagenotfoundComponent } from "./components/pagenotfound/pagenotfound.component";
import { ScheduleComponent } from "./components/facial_recognition/schedule/schedule.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { LiveComponent } from "./components/cameras_conf/livestream/live.component";
import { HeatmapComponent } from "./components/cameras_conf/heatmap/heatmap.component";
import { FaceListComponent } from "./components/facial_recognition/face-list/face-list.component";
import { VidComponent } from "./components/cameras_conf/add_camera/vid.component";
import { ROIComponent } from "./components/cameras_conf/roi/roi.component";
import { AnalyticsComponent } from "./components/analytics/analytics.component";
import { AlgorithmsComponent } from "./components/cameras_conf/algorithms/algorithms.component";
import { SearchComponent } from "./components/facial_recognition/search/search.component";
import { TCloudDashboardComponent } from "./components/t-cloud/t-cloud-dashboard/t-cloud-dashboard.component";
import { ClimbingBarricadeComponent } from "./components/others/main_docs/climbing-barricade.component";
import { SingleImageDetectionComponent } from "./components/t-cloud/single-image-detection/single-image-detection.component";
import { SpeedingVehicleComponent } from "./components/t-cloud/video_to_frames/speeding-vehicle.component";
import { UnwantedVehicleComponent } from "./components/t-cloud/images_classification/unwanted-vehicle.component";
import { LivestreamComponent } from "./components/cameras_conf/camera_list/livestream.component";
import { ObjectDetectionComponent } from "./components/t-cloud/object-detection/object-detection.component";
import { ObjDetImgComponent } from "./components/t-cloud/obj-det-img/obj-det-img.component";
import { MultipleImageDetectionComponent } from "./components/t-cloud/multiple-image-detection/multiple-image-detection.component";
import { AnnotationsDetailsComponent } from "./components/t-cloud/annotations-details/annotations-details.component";
import { AddVideoComponent } from "./components/cameras_conf/add-video/add-video.component";
import { AnnotationsConfirmComponent } from "./components/t-cloud/annotations-confirm/annotations-confirm.component";
import { ObjectDetectionConfirmComponent } from "./components/t-cloud/object-detection-confirm/object-detection-confirm.component";
import { ObjectDetectionDetailsComponent } from "./components/t-cloud/object-detection-details/object-detection-details.component";
import { FederatedLearningComponent } from "./components/federated-learning/federated-learning.component";
import { HomePageComponent } from "./components/home-page/home-page.component";
import { TestYourModelComponent } from "./components/test-your-model/test-your-model.component";
import { TestResultComponent } from "./components/test-results/test-results.component";
import { CustomTrainedModelsComponent } from "./components/custom-trained-models/custom-trained-models.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { SignupComponent } from "./components/auth/signup/signup.component";
import { AuthGuardService } from "./services/auth-guard.service";

const routes: Routes = [
  {
    path: "auth/signup",
    component: SignupComponent,
  },
  {
    path: "auth/login",
    component: LoginComponent,
  },
  {
    path: "management",
    component: FaceListComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "user/schedule/:id",
    component: ScheduleComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "user/edit/:uuid",
    component: FaceFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "user/add",
    component: FaceFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "annotations",
    component: TCloudDashboardComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "home",
    component: HomePageComponent,
  },
  {
    path: "federated-learning",
    component: FederatedLearningComponent,
  },
  {
    path: "test-results",
    component: TestResultComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "custom-trained-models",
    component: CustomTrainedModelsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "user/images/:id",
    component: ImagesFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "settings",
    component: SettingsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "cameras/live/:id",
    component: LiveComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "cameras/heatmap/:uuid",
    component: HeatmapComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "classify/:choose",
    component: UnwantedVehicleComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "prediction/:choose",
    component: UnwantedVehicleComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "cameras/algorithms/:uuid/:id",
    component: ROIComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "user/search",
    component: SearchComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "camerasList",
    component: LivestreamComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "annotations/dataset/:method/:folder/:image",
    component: MultipleImageDetectionComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "annotations/dataset/:method/:folder/:image/details",
    component: ObjectDetectionDetailsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "annotations/objectDetection/confirm",
    component: ObjectDetectionConfirmComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "annotations/:method/:folder/:image",
    component: SingleImageDetectionComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "annotations/:method/:folder/:image/details",
    component: AnnotationsDetailsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "annotations/save",
    component: AnnotationsDetailsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "annotations/confirm",
    component: AnnotationsConfirmComponent,
    canActivate: [AuthGuardService],
  },
  /* {
    path: 'objectDetection/:folder/:image',
    component: SingleImageDetectionComponent
  }, */
  {
    path: "annotation/video/:cam_name/:date",
    component: SpeedingVehicleComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "cameras/edit/:uuid",
    component: VidComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "cameras/add_camera",
    component: VidComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "cameras/add_video",
    component: AddVideoComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "analytics",
    component: AnalyticsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "cameras/algorithms/:uuid",
    component: AlgorithmsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "documents",
    component: ClimbingBarricadeComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "objectDetection",
    component: ObjectDetectionComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "objectDetection/img/label",
    component: SingleImageDetectionComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "test-your-model",
    component: TestYourModelComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "",
    // redirectTo: 'annotations',
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "**",
    component: PagenotfoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
