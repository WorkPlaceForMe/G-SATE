import { Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PopupComponent implements OnInit {
  @Input() id:string;
  private element :any;
  constructor(private popupService : PopupService, private el:ElementRef) { 
    this.element = el.nativeElement;
  }

  ngOnInit() :void {
    if (!this.id) {
      console.error('popup must have an id!');
      return;
    }

    //move element to bottom so it can displays above everything else
    document.body.appendChild(this.element);

    //close dialog on background click
    this.element.addEventListener('click', el=>{
      if(el.target.className === 'popup-modal'){
        this.close();
      }
    });

    this.popupService.add(this);

  }

  ngOnDestroy():void {
    this.popupService.remove(this.id);
    this.element.remove();
  }

  open():void {
    this.element.style.display = "block";
    document.body.classList.add("popup-modal-open"); 
  }

  close():void {
    this.element.style.display = "none";
    document.body.classList.remove("popup-modal-open"); 
  }

}
