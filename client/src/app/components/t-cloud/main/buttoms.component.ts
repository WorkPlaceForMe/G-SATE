import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core'
import { AnnotationsService } from '../../../services/annotations.service'
import { ActivatedRoute, Router } from '@angular/router'
import { FileUploader, FileLikeObject } from 'ng2-file-upload'
import { ip } from '../../../models/IpServer'
import { FacesService } from '../../../services/faces.service'
import { PagerService } from '../../../services/pager.service'
import { DatePipe } from '@angular/common'

const zipURL = 'http://' + ip + ':3000/api/datasets/upZip'
const imgURL = 'http://' + ip + ':3000/api/upload/pic'

@Component({
  selector: 'app-buttoms',
  templateUrl: './buttoms.component.html',
  styleUrls: ['./buttoms.component.css']
})
export class ButtomsComponent implements OnInit {
  constructor (
    private router: Router,
    private annotationsServ: AnnotationsService,
    private facesservices: FacesService,
    private datepipe: DatePipe,
    private pagerService: PagerService,
    private cdref: ChangeDetectorRef
  ) {}

  uploadFileNames: Array<string> = []

  public uploader: FileUploader = new FileUploader({
    url: zipURL,
    itemAlias: 'zip'
  })

  public photoUploader: FileUploader = new FileUploader({
    url: imgURL,
    itemAlias: 'photo'
  })

  fileName: string = ''
  searchcount:number=50
  imgFileName: string = ''
  uploadName: string
  unAnnDatasetsNames: any = []
  annDatasetsNames: any = []
  classNames: any = []
  datasetName: string = null
  searchDatasetName: string = null
  searchKeyword: string = null
  searchFlag: boolean = true
  isSearchDisabled: boolean = true
  public showMyMessage2 = false
  public showMyMessage3 = false
  public showMyMessage4 = false
  public showMyMessage5 = false
  public showMyWatch = false
  public showClass = false
  public badFile = true
  public badImgFile = true
  public open = false
  spinner: boolean = false
  unAnnSpin: boolean = false
  annSpin: boolean = false
  choosenDataset: string
  choosenDatasetForVista: string
  choosenDatasetForAnalytics: string
  choosenClass: string
  cameras: any = []
  camera: any
  rtsp_in: any
  selectedDate: any
  date: any
  response: any = []
  images: any = []
  pagedImages: any = []
  selectedImages: any = []
  pager: any = {}
  uploadImage:boolean = false;
  showMyMessage: boolean = false
  newLabel: string

  label: string
  labels: any = []

  public date_now = new Date(Date.now()).toString()
  public max = new Date(this.date_now)

  ngOnInit () {
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false
      const newStuff = this.datasetName.split(' ').join('_')
      this.uploadName = newStuff + '.zip'
      // this.fileName += file.file.name + ",";
      file.file.name = this.uploadName
      // this.uploadFileNames.push(this.uploadName);
      // console.log(this.uploadFileNames);
    }
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      console.log('Uploaded:', status, response, headers);
      this.uploadImage = false;
      this.getUnAnnDsets('data');
    }
    this.uploader.onProgressItem = (progress: any) => {
      console.log(progress['progress'])
      if (progress['progress'] == 100) {
        this.showMyMessage3 = undefined
        this.showMyMessage4 = true
      }
    }
    this.photoUploader.onAfterAddingFile = file => {
      console.log('****************************', file.file.name.split('.')[1])
      file.withCredentials = false
      const format = file.file.name.split('.')[1]
      const name = this.imgFileName.split(' ').join('_')
      const newName = name + '.' + format
      file.file.name = newName
    }
    this.photoUploader.onCompleteItem = (item: any, response: any, status: any, headers: any
    ) => {
      if(status == 500) {
        this.uploadImage = false;
        alert('There is an error Processing you request. Please try again.');
      } else {
        console.log('Image Upload Response - ', JSON.parse(response));
        this.router.navigate(
          ['/annotations/' + 'object' + '/' + 'image' + '/0'],
          { state: { data: JSON.parse(response) } }
        )
      }
    }
    this.photoUploader.onProgressItem = (progress: any) => {
      console.log(progress['progress'])
      if (progress['progress'] == 100) {
        this.showMyMessage3 = undefined
        this.showMyMessage4 = true
      }
    }

    this.getUnAnnDsets('data')
    this.getUnAnnDsets('class')
    this.getAnnDsets('data')
    this.getLabels()

    this.facesservices.getCameras().subscribe(
      res => {
        console.log('cameras..........', res)
        this.cameras = res
      },
      err => console.log(err)
    )
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
     }

  count = 0
  setPage (page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.images.length, page, 9)
    // get current page of items
    this.pagedImages = this.images.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    )
  }

  getUnAnnDsets (thing: string) {
    this.annotationsServ.getUnAnnDatasets(thing).subscribe(
      res => {
        if (thing == 'data') {
          this.unAnnDatasetsNames = res
          for (let i = 0; i < this.unAnnDatasetsNames.length; i++) {
            this.unAnnDatasetsNames[i]['open'] = false;
            this.unAnnDatasetsNames[i]['name'] = this.unAnnDatasetsNames[i]['name'];
            this.unAnnDatasetsNames[i]['id'] = this.unAnnDatasetsNames[i]['id'];          
          }
        } else if (thing == 'class') {
          this.classNames = res
          for (let i = 0; i < this.classNames.length; i++) {
            this.classNames[i]['open'] = false
            this.classNames[i]['name'] = this.classNames[i]['name']
              .split('_')
              .join(' ');
            this.classNames[i]['id'] = this.classNames[i]['id'];
          }
        }
      },
      err => console.log(err)
    )
  }

  getAnnDsets (thing: string) {
    this.annotationsServ.getAnnDatasets(thing).subscribe(
      res => {
        if (thing == 'data') {
          this.annDatasetsNames = res
          for (let i = 0; i < this.annDatasetsNames.length; i++) {
            this.annDatasetsNames[i]['open'] = false;
            this.annDatasetsNames[i]['name'] = this.annDatasetsNames[i]['name'];
            this.annDatasetsNames[i]['id'] = this.annDatasetsNames[i]['id'];          
          }
        } else if (thing == 'class') {
          this.classNames = res
          for (let i = 0; i < this.classNames.length; i++) {
            this.classNames[i]['open'] = false
            this.classNames[i]['name'] = this.classNames[i]['name']
              .split('_')
              .join(' ');
            this.classNames[i]['id'] = this.classNames[i]['id'];
          }
        }
      },
      err => console.log(err)
    )
  }

  getLabels () {
    this.annotationsServ.readLabels().subscribe(
      res => {
        this.labels = res
        this.labels = this.labels.split('\r\n')
        this.labels.pop()
      },
      err => console.log(err)
    )
  }

  addLabel () {
    this.annotationsServ.writeLabel(this.newLabel).subscribe(
      res => {
        this.newLabel = null
        this.getLabels()
      },
      err => console.log(err)
    )
  }

  go () {
    this.showMyMessage = true
  }

  annotateByVista () {
    this.router.navigate([
      '/annotations/dataset/' + 'object' + '/' + this.choosenDataset + '/vista'
    ])
  }

  annotateByAnalytics () {
    this.router.navigate([
      '/annotations/dataset/' + 'object' + '/' + this.choosenDataset + '/analytics'
    ])
  }

  @ViewChild('zip', { static: true }) myInputVariable: ElementRef

  check () {
    this.uploader.uploadAll()
    this.myInputVariable.nativeElement.value = null
    this.fileName = ''
    setTimeout(() => {
      this.getUnAnnDsets('data')
    }, 2000)
    this.showMyMessage4 = false
    this.showMyMessage3 = true
  }

  @ViewChild('img', { static: true }) myImgInputVariable: ElementRef

  checkImg () {
    this.uploadImage = true;
    this.photoUploader.uploadAll()
    this.myImgInputVariable.nativeElement.value = null
    this.imgFileName = ''
  }

  isCameraReady () {
    this.date = this.datepipe.transform(this.selectedDate, 'yyyy-M-dd')
    if (this.camera != undefined && this.date != undefined) {
      return true
    } else {
      return false;
    }
  }

  unAnnRefresh () {
    this.unAnnDatasetsNames = []
    this.unAnnSpin = true
    setTimeout(() => {
      this.getUnAnnDsets('data')
      this.unAnnSpin = false
    }, 100)
  }

  annRefresh () {
    this.annDatasetsNames = []
    this.annSpin = true
    setTimeout(() => {
      this.getAnnDsets('data')
      this.annSpin = false
    }, 100)
  }

  detect () {
    this.showMyMessage2 = true
    if (this.datasetName == '') {
      this.showMyMessage2 = false
    }
  }

  showPicInfo (event) {
    this.imgFileName = event.target.files[0].name
    console.log('imgFileName........', this.imgFileName)
    if (
      this.imgFileName.includes('.jpg') ||
      this.imgFileName.includes('.png')
    ) {
      this.badImgFile = false
      console.log(this.badImgFile)
      this.showMyMessage5 = true
    } else {
      this.badImgFile = true
    }
  }

  detectChange () {
    this.searchFlag = false
    if (this.searchDatasetName == '') {
      this.searchFlag = true
      this.isSearchDisabled = true
    }
    if (this.searchKeyword != '' && this.searchDatasetName != '') {
      this.isSearchDisabled = false
    }
  }

  detectSearchChange () {
    this.isSearchDisabled = false
    if (this.searchKeyword == '' || this.searchDatasetName == '') {
      this.isSearchDisabled = true
    }
  }

  search () {
    this.pagedImages = []
    this.images = []
    this.pager = {}
    this.spinner = true
    this.annotationsServ.searchImages(this.searchKeyword,this.searchcount).subscribe((res:any) => {
      this.spinner = false
      this.images = res.value
      this.images = this.images.map(obj => ({ ...obj, checked: true }))
      this.setPage(1)
      this.searchFlag = true
      // this.isSearchDisabled = true
    })
    /* this.images = this.images.map(obj=> ({ ...obj, checked: true }))
        setTimeout(() => {
          this.spinner = false;
          this.setPage(1);
        }, 3000) */
  }

  okay () {
    let data = {
      images: this.images,
      name: this.searchDatasetName
    }

    this.annotationsServ.createDataset(data).subscribe(res => {
      this.searchDatasetName = null
      this.searchKeyword = null
      this.images = []
      this.getUnAnnDsets('data')
    })
  }

  close () {
    this.searchDatasetName = null
    this.searchKeyword = null
  }

  info () {
    console.log(this.unAnnDatasetsNames)
  }

  showInfo (event) {
    this.fileName = event.target.files[0].name
    if (this.fileName.includes('.zip')) {
      this.badFile = false
    } else {
      this.badFile = true
    }
  }

  UnAnnDSetchange (e) {
    for (let i = 0; i < this.unAnnDatasetsNames.length; i++) {
      if (e == i) {
        this.unAnnDatasetsNames[i]['open'] = true
        this.choosenDatasetForAnalytics = undefined
        this.choosenDataset = this.unAnnDatasetsNames[i]['name']
        this.choosenDatasetForVista = this.unAnnDatasetsNames[i]['name']
      } else {
        this.unAnnDatasetsNames[i]['open'] = false
      }
    }
  }

  AnnDSetchange (e) {
    for (let i = 0; i < this.annDatasetsNames.length; i++) {
      if (e == i) {
        this.annDatasetsNames[i]['open'] = true
        this.choosenDatasetForVista = undefined
        this.choosenDataset = this.annDatasetsNames[i]['name']
        this.choosenDatasetForAnalytics = this.annDatasetsNames[i]['name']
      } else {
        this.annDatasetsNames[i]['open'] = false
      }
    }
  }

  change1 (e) {
    for (let i = 0; i < this.classNames.length; i++) {
      if (e == i) {
        this.classNames[i]['open'] = true
        this.choosenClass = this.classNames[i]['name']
      } else {
        this.classNames[i]['open'] = false
      }
    }
    if (this.choosenClass != undefined) {
      this.showClass = true
    }
  }

  deleteUnAnnDataset(dataset:any) {
    if (confirm('Are you sure you want to delete "' + dataset.name +'" ?') ) {
      this.annotationsServ.deleteDataset(dataset.snippet_id, dataset.type, dataset.name).subscribe(
        res => {
          console.log(res);
          this.unAnnRefresh();
          this.choosenDatasetForVista = undefined;
        },
        err => console.error(err)
      )
    }
  }

  deleteAnnDataset(dataset:any) {
    if (confirm('Are you sure you want to delete "' + dataset.name +'" ?') ) {
      this.annotationsServ.deleteDataset(dataset.snippet_id, dataset.type, dataset.name).subscribe(
        res => {
          console.log(res);
          this.annRefresh();
          this.choosenDatasetForAnalytics = undefined;
        },
        err => console.error(err)
      )
    }
  }

  handleSelected (data, isChecked) {
    isChecked = isChecked === true ? false : true
    let index = this.images.findIndex(x => x.imageId === data.imageId)
    this.images[index].checked = isChecked
  }

  confirm () {
    this.selectedImages = this.images.filter(itm => itm.checked === true)
  }

  realGo () {
    if (this.label != undefined) {
      this.router.navigate([
        '/annotations/' + this.label + '/' + this.choosenDataset + '/0'
      ])
    }
  }
}
