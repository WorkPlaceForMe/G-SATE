import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
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
    private pagerService: PagerService
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
      console.log('Uploaded:', status, response, headers)
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
      console.log('new name.............', newName)
      file.file.name = newName
      //const newStuff = this.datasetName.split(' ').join('_');
      //this.uploadName = newStuff + '.zip';
      // this.fileName += file.file.name + ",";

      // this.uploadFileNames.push(this.uploadName);
      // console.log(this.uploadFileNames);
    }
    this.photoUploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      //console.log('Uploaded:', status, response, headers)
      this.router.navigate(
        ['/annotations/' + 'object' + '/' + 'image' + '/0'],
        { state: { data: JSON.parse(response) } }
      )
      // this.router.navigate(['/objectDetection/img/label'], { state: { data: JSON.parse(response) } });
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
              //.split('_')
              //.join(' ')
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
              //.split('_')
              //.join(' ')
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
    let res1 = {
      id: 1,
      image:
        'https://ec2-3-211-144-140.compute-1.amazonaws.com/media/perumal/NiceKitchen_RBE1hUp.png',
      width: 719,
      height: 487,
      results: {
        Object: [
          {
            confidence: 0.999895,
            class: 'person',
            boundingBox: {
              top: 186,
              left: 375,
              width: 94,
              height: 144
            },
            objectId: '0'
          },
          {
            confidence: 0.99876,
            class: 'microwave',
            boundingBox: {
              top: 151,
              left: 210,
              width: 112,
              height: 54
            },
            objectId: '1'
          },
          {
            confidence: 0.995244,
            class: 'chair',
            boundingBox: {
              top: 304,
              left: 68,
              width: 97,
              height: 168
            },
            objectId: '2'
          },
          {
            confidence: 0.994914,
            class: 'refrigerator',
            boundingBox: {
              top: 173,
              left: 470,
              width: 131,
              height: 267
            },
            objectId: '3'
          },
          {
            confidence: 0.99339,
            class: 'bowl',
            boundingBox: {
              top: 317,
              left: 419,
              width: 61,
              height: 34
            },
            objectId: '4'
          },
          {
            confidence: 0.985508,
            class: 'oven',
            boundingBox: {
              top: 256,
              left: 196,
              width: 128,
              height: 107
            },
            objectId: '5'
          }
        ]
      }
    }
    let res2 = {
      id: 2,
      image:
        'https://ec2-3-211-144-140.compute-1.amazonaws.com/media/perumal/cup_t4At384.jpg',
      width: 3104,
      height: 1746,
      results: {
        Object: [
          {
            confidence: 0.998644,
            class: 'cup',
            boundingBox: {
              top: 650,
              left: 379,
              width: 967,
              height: 729
            },
            objectId: '0'
          }
        ],
        themes: {
          deep_themes: {
            themes: [
              {
                confidence: 0.8699,
                label: 'indoor-bathroom'
              }
            ]
          }
        },
        food: {},
        tags: {
          deep_lostFound: {
            tags1: [
              {
                confidence: 0.9984,
                label: 'electronics-Ipod'
              }
            ]
          },
          deep_tags: {
            tags2: [
              {
                confidence: 0.4261,
                label: 'WHISKEY JUG'
              }
            ]
          }
        },
        face: {},
        fashion: []
      }
    }
    let res3 = {
      id: 3,
      image:
        'https://ec2-3-211-144-140.compute-1.amazonaws.com/media/perumal/face_HNN5bcw.jpg',
      width: 1024,
      height: 575,
      results: {
        Object: [
          {
            confidence: 0.991882,
            class: 'person',
            boundingBox: {
              top: 3,
              left: 246,
              width: 546,
              height: 567
            },
            objectId: '0'
          }
        ]
      }
    }
    /* let res4 = {
          "id": 1,
          "image": "https://ec2-3-211-144-140.compute-1.amazonaws.com/media/perumal/NiceKitchen_iCVg45n.png",
          "image": "https://ec2-54-152-186-179.compute-1.amazonaws.com/media/perumal/NiceKitchen.png",
          "results": {
            "Object": [
                {
                    "confidence": 0.999895,
                    "class": "person",
                    "boundingBox": {
                        "top": 186,
                        "left": 375,
                        "width": 94,
                        "height": 144
                    },
                    "objectId": "0"
                },
                {
                    "confidence": 0.99876,
                    "class": "microwave",
                    "boundingBox": {
                        "top": 151,
                        "left": 210,
                        "width": 112,
                        "height": 54
                    },
                    "objectId": "1"
                },
                {
                    "confidence": 0.995244,
                    "class": "chair",
                    "boundingBox": {
                        "top": 304,
                        "left": 68,
                        "width": 97,
                        "height": 168
                    },
                    "objectId": "2"
                },
                {
                    "confidence": 0.994914,
                    "class": "refrigerator",
                    "boundingBox": {
                        "top": 173,
                        "left": 470,
                        "width": 131,
                        "height": 267
                    },
                    "objectId": "3"
                },
                {
                    "confidence": 0.99339,
                    "class": "bowl",
                    "boundingBox": {
                        "top": 317,
                        "left": 419,
                        "width": 61,
                        "height": 34
                    },
                    "objectId": "4"
                },
                {
                    "confidence": 0.985508,
                    "class": "oven",
                    "boundingBox": {
                        "top": 256,
                        "left": 196,
                        "width": 128,
                        "height": 107
                    },
                    "objectId": "5"
                }
            ],
            "themes": {
                "deep_themes": {
                    "themes": [
                        {
                            "confidence": 0.3101,
                            "label": "indoor-kitchen"
                        }
                    ]
                }
            },
            "food": {},
            "tags": {
                "deep_lostFound": {
                    "tags1": [
                        {
                            "confidence": 0.388,
                            "label": "electronics-Laptop"
                        }
                    ]
                },
                "deep_tags": {
                    "tags2": [
                        {
                            "confidence": 0.3963,
                            "label": "WARDROBE"
                        }
                    ]
                }
            },
            "face": {},
            "fashion": [
                {
                    "confidence": 0.999895,
                    "class": "person",
                    "boundingBox": {
                        "top": 186,
                        "left": 375,
                        "width": 94,
                        "height": 144
                    },
                    "objectId": "0",
                    "deep_fashion_color": {
                        "color": [
                            {
                                "confidence": 0.9782,
                                "label": "blue"
                            }
                        ]
                    },
                    "deep_fashion_pattern": {
                        "pattern": [
                            {
                                "confidence": 0.689,
                                "label": "embellished"
                            }
                        ]
                    },
                    "deep_fashion_tf": {
                        "neck_design": [
                            {
                                "confidence": 0.9864,
                                "label": "Invisible"
                            }
                        ],
                        "coat_length": [
                            {
                                "confidence": 0.7457,
                                "label": "Long"
                            }
                        ],
                        "sleeve_length": [
                            {
                                "confidence": 0.4187,
                                "label": "LongSleeves"
                            }
                        ],
                        "neckline_design": [
                            {
                                "confidence": 0.9994,
                                "label": "Invisible"
                            }
                        ],
                        "collar_design": [
                            {
                                "confidence": 0.999,
                                "label": "Invisible"
                            }
                        ],
                        "pant_length": [
                            {
                                "confidence": 0.6154,
                                "label": "Invisible"
                            }
                        ],
                        "skirt_length": [
                            {
                                "confidence": 0.539,
                                "label": "Floor"
                            }
                        ],
                        "lapel_design": [
                            {
                                "confidence": 0.9923,
                                "label": "Invisible"
                            }
                        ]
                    }
                }
            ]
        }
        }
        let res5 = {
          "id": 2,
          "image": "https://ec2-3-211-144-140.compute-1.amazonaws.com/media/perumal/cup_t4At384.jpg",
          "image": "https://ec2-54-152-186-179.compute-1.amazonaws.com/media/perumal/cup_MNUNepE.jpg",
          "results": {
            "Object": [
                {
                    "confidence": 0.998644,
                    "class": "cup",
                    "boundingBox": {
                        "top": 650,
                        "left": 379,
                        "width": 967,
                        "height": 729
                    },
                    "objectId": "0"
                }
            ],
            "themes": {
                "deep_themes": {
                    "themes": [
                        {
                            "confidence": 0.8699,
                            "label": "indoor-bathroom"
                        }
                    ]
                }
            },
            "food": {},
            "tags": {
                "deep_lostFound": {
                    "tags1": [
                        {
                            "confidence": 0.9984,
                            "label": "electronics-Ipod"
                        }
                    ]
                },
                "deep_tags": {
                    "tags2": [
                        {
                            "confidence": 0.4261,
                            "label": "WHISKEY JUG"
                        }
                    ]
                }
            },
            "face": {},
            "fashion": []
        }
        } */
    /* this.response.push(res1)
    this.response.push(res2)
    this.response.push(res3) */
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
    // for(let i = 0; i < this.datasetsNames.length; i++){
    //   if(this.fileName == this.datasetsNames[i]){
    //     this.fileName = '!' + this.fileName;
    //   }
    // }
    this.uploader.uploadAll()
    this.myInputVariable.nativeElement.value = null
    this.fileName = ''
    setTimeout(() => {
      this.unAnnDatasetsNames('data')
    }, 2000)
    this.showMyMessage4 = false
    this.showMyMessage3 = true
  }

  @ViewChild('img', { static: true }) myImgInputVariable: ElementRef

  checkImg () {
    // for(let i = 0; i < this.datasetsNames.length; i++){
    //   if(this.fileName == this.datasetsNames[i]){
    //     this.fileName = '!' + this.fileName;
    //   }
    // }
    this.photoUploader.uploadAll()
    this.myImgInputVariable.nativeElement.value = null
    this.imgFileName = ''
    /* setTimeout(() => {
            this.getDsets('data');
        }, 2000);
        this.showMyMessage4 = false;
        this.showMyMessage3 = true; */
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
    /* this.images.push({ contentUrl: 'https://images.unsplash.com/photo-1597404294360-feeeda04612e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80' });
        this.images.push({ contentUrl: 'https://media.wired.com/photos/5d09594a62bcb0c9752779d9/master/w_2560%2Cc_limit/Transpo_G70_TA-518126.jpg' });
        this.images.push({ contentUrl: 'https://www.acko.com/wp-content/uploads/2020/06/how-to-import-foreign-cars-to-india.png.webp' });
        this.images.push({ contentUrl: 'https://specials-images.forbesimg.com/imageserve/5d35eacaf1176b0008974b54/960x0.jpg?cropX1=790&cropX2=5350&cropY1=784&cropY2=3349' });
        this.images.push({ contentUrl: 'https://img.etimg.com/thumb/msid-61740103,width-650,imgsize-251731,,resizemode-4,quality-100/.jpg' });
        this.images.push({ contentUrl: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/carbon-fiber-shelby-mustang-1600685276.jpg?crop=0.9988636363636364xw:1xh;center,top&resize=980:*' });
        this.images.push({ contentUrl: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/bugatti-chiron-sport-mid-engined-w16-engine-exclusive-news-photo-1600704674.jpg?crop=1xw:0.99951xh;center,top&resize=980:*' });
        this.images.push({ contentUrl: 'https://images.unsplash.com/photo-1597404294360-feeeda04612e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80' });
        this.images.push({ contentUrl: 'https://media.wired.com/photos/5d09594a62bcb0c9752779d9/master/w_2560%2Cc_limit/Transpo_G70_TA-518126.jpg' });
    
        this.images.push({ contentUrl: 'https://hips.hearstapps.com/pop.h-cdn.co/assets/cm/15/05/768x516/54ca5c2806ace_-_100-cars-002-chevrolet-camaro-1211-xln-25039490.jpg?resize=980:*' });
        this.images.push({ contentUrl: 'https://www.acko.com/wp-content/uploads/2020/06/how-to-import-foreign-cars-to-india.png.webp' });
        this.images.push({ contentUrl: 'https://specials-images.forbesimg.com/imageserve/5d35eacaf1176b0008974b54/960x0.jpg?cropX1=790&cropX2=5350&cropY1=784&cropY2=3349' });
        this.images.push({ contentUrl: 'https://img.etimg.com/thumb/msid-61740103,width-650,imgsize-251731,,resizemode-4,quality-100/.jpg' });
        this.images.push({ contentUrl: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/the-bugatti-chiron-is-shown-to-the-goodwood-festival-of-news-photo-1600106522.jpg?crop=0.843xw:0.667xh;0.00160xw,0.230xh&resize=980:*' });
        this.images.push({ contentUrl: 'https://hips.hearstapps.com/pop.h-cdn.co/assets/cm/15/05/768x516/54ca5c294d9d2_-_100-cars-006-bugatti-type57-1211-xln.jpg?resize=980:*' }); */
    //this.images = this.images.map(obj=> ({ ...obj, checked: true }))
    this.annotationsServ.searchImages(this.searchKeyword).subscribe(res => {
      this.spinner = false
      this.images = res
      this.images = this.images.map(obj => ({ ...obj, checked: true }))
      this.setPage(1)
      this.searchFlag = true
      this.isSearchDisabled = true
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
      this.annotationsServ.deleteDataset(dataset.cam_id).subscribe(
        res => {
          console.log(res);
          this.unAnnRefresh();
        },
        err => console.error(err)
      )
    }
  }

  deleteAnnDataset(dataset:any) {
    if (confirm('Are you sure you want to delete "' + dataset.name +'" ?') ) {
      this.annotationsServ.deleteDataset(dataset.cam_id).subscribe(
        res => {
          console.log(res);
          this.annRefresh();
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

  showMyMessage: boolean = false
  newLabel: string

  label: string
  labels: any = []
}
