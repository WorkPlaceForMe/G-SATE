import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { TCloudDashboardComponent } from "./components/t-cloud/t-cloud-dashboard/t-cloud-dashboard.component";
import { FacesService } from "./services/faces.service";
import { AnnotationsService } from "./services/annotations.service";
import { ColorsService } from "./services/colors";
import { StrService } from "./services/strArray";
import { FaceFormComponent } from "./components/facial_recognition/face-form/face-form.component";
import { FaceListComponent } from "./components/facial_recognition/face-list/face-list.component";
import { ImagesFormComponent } from "./components/facial_recognition/images-form/images-form.component";
import { TrustedUrlPipe } from "./pipes/trusted-url.pipe";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileUploadModule } from "ng2-file-upload";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { UrlPipe } from "./pipes/url.pipe";
import { NavigationService } from "./shared/services/navigation.service";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { PagenotfoundComponent } from "./components/pagenotfound/pagenotfound.component";
import { ScheduleComponent } from "./components/facial_recognition/schedule/schedule.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { LiveComponent } from "./components/cameras_conf/livestream/live.component";
import { HeatmapComponent } from "./components/cameras_conf/heatmap/heatmap.component";
import { VidComponent } from "./components/cameras_conf/add_camera/vid.component";
import { LivestreamComponent } from "./components/cameras_conf/camera_list/livestream.component";
import { CamerasButtomsComponent } from "./components/cameras_conf/cameras-buttoms_on_main/cameras-buttoms.component";
import { ROIComponent } from "./components/cameras_conf/roi/roi.component";
import { AlgorithmsComponent } from "./components/cameras_conf/algorithms/algorithms.component";
import { TrustedStylePipe } from "./pipes/trusted-style.pipe";
import { AnalyticsComponent } from "./components/analytics/analytics.component";
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { DocListComponent } from "./components/others/doc-list/doc-list.component";
import { DocComponent } from "./components/others/doc/doc.component";
import { ip } from "./models/IpServer";
import { ClimbingBarricadeComponent } from "./components/others/main_docs/climbing-barricade.component";
import { SingleImageDetectionComponent } from "./components/t-cloud/single-image-detection/single-image-detection.component";
import { SpeedingVehicleComponent } from "./components/t-cloud/video_to_frames/speeding-vehicle.component";
import { UnwantedVehicleComponent } from "./components/t-cloud/images_classification/unwanted-vehicle.component";
import { MatExpansionModule, MatButtonModule } from "@angular/material";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SearchComponent } from "./components/facial_recognition/search/search.component";
import { DeviceDetectorModule } from "ngx-device-detector";
import { MatVideoModule } from "mat-video";
import { MatPaginatorModule } from "@angular/material/paginator";
import { NgxPaginationModule } from "ngx-pagination";
import {
  NgScrollbarModule,
  NG_SCROLLBAR_OPTIONS,
  ScrollViewport,
} from "ngx-scrollbar";
import { CamerasComponent } from "./components/cameras_conf/main/cameras.component";
import { ResumeComponent } from "./components/facial_recognition/resume/resume.component";
import { ObjectDetectionComponent } from "./components/t-cloud/object-detection/object-detection.component";
import { ObjDetImgComponent } from "./components/t-cloud/obj-det-img/obj-det-img.component";
import { MultipleImageDetectionComponent } from "./components/t-cloud/multiple-image-detection/multiple-image-detection.component";
import { AnnotationsDetailsComponent } from "./components/t-cloud/annotations-details/annotations-details.component";
import { PagerService } from "./services/pager.service";
import { AddVideoComponent } from "./components/cameras_conf/add-video/add-video.component";
import { AnnotationsConfirmComponent } from "./components/t-cloud/annotations-confirm/annotations-confirm.component";
import { ObjectDetectionConfirmComponent } from "./components/t-cloud/object-detection-confirm/object-detection-confirm.component";
import { ObjectDetectionDetailsComponent } from "./components/t-cloud/object-detection-details/object-detection-details.component";
import { FederatedLearningComponent } from "./components/federated-learning/federated-learning.component";
import { TestYourModelComponent } from "./components/test-your-model/test-your-model.component";
import { HomePageComponent } from "./components/home-page/home-page.component";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { FooterComponent } from "./components/footer/footer.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { ChartsModule, ThemeService } from "ng2-charts";
import { TestResultComponent } from "./components/test-results/test-results.component";
import { UiSwitchModule } from "ngx-toggle-switch";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ModalModule } from "ngx-bootstrap/modal";
const config: SocketIoConfig = { url: "http://" + ip + ":4444", options: {} };

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomePageComponent,
    FaceFormComponent,
    ImagesFormComponent,
    TrustedUrlPipe,
    UrlPipe,
    PagenotfoundComponent,
    FaceListComponent,
    TCloudDashboardComponent,
    ScheduleComponent,
    SettingsComponent,
    LiveComponent,
    HeatmapComponent,
    VidComponent,
    LivestreamComponent,
    CamerasButtomsComponent,
    ROIComponent,
    AlgorithmsComponent,
    TrustedStylePipe,
    AnalyticsComponent,
    DocListComponent,
    DocComponent,
    ClimbingBarricadeComponent,
    SingleImageDetectionComponent,
    SpeedingVehicleComponent,
    UnwantedVehicleComponent,
    SearchComponent,
    CamerasComponent,
    ResumeComponent,
    ObjectDetectionComponent,
    ObjDetImgComponent,
    MultipleImageDetectionComponent,
    AnnotationsDetailsComponent,
    AddVideoComponent,
    AnnotationsConfirmComponent,
    ObjectDetectionConfirmComponent,
    ObjectDetectionDetailsComponent,
    FederatedLearningComponent,
    TestYourModelComponent,
    FooterComponent,
    TestResultComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    BrowserAnimationsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SocketIoModule.forRoot(config),
    MatExpansionModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    DeviceDetectorModule.forRoot(),
    TimepickerModule.forRoot(),
    MatVideoModule,
    MatPaginatorModule,
    NgxPaginationModule,
    NgScrollbarModule,
    ScrollingModule,
    BsDatepickerModule.forRoot(),
    AngularSvgIconModule.forRoot(),
    TooltipModule.forRoot(),
    PerfectScrollbarModule,
    ChartsModule,
    UiSwitchModule,
    NgxDatatableModule,
    ModalModule.forRoot(),
  ],
  providers: [
    FacesService,
    DatePipe,
    NavigationService,
    ColorsService,
    StrService,
    AnnotationsService,
    PagerService,
    ThemeService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
