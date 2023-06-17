import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ssa-info-field',
  templateUrl: './info-field.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      .profilePicture{
        margin-right:1.7rem;
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }
      .profilePicture mat-icon{
        font-size: 45px;
        width: 45px;
        height: 45px;
      }
    `
  ]
})
export class InfoFieldComponent implements OnInit {

  constructor() { }

  @Input() public label: string;
  @Input() public value: any;
  @Input() public type: string;
  @Input() public contentClasses: string | string[];


  ngOnInit(): void {
  }

}
