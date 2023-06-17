/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styles: [
    `  
      :host {
        display: block;
      }
      button:disabled{
      cursor:default;
      opacity:0.5;
      }
    `
  ]
})
export class FilterMenuComponent {
  
  @ViewChild(MatMenuTrigger) menu:MatMenuTrigger;

  @Input() label: string = 'Menu';
  @Input() count: number = 0;
  @Input() isClearEnable: boolean = false;
  @Input() isShowClearBtn: boolean = true;
  @Output() public clearClick = new EventEmitter<any>();
  constructor() {}

  clear($event) {
    this.clearClick.emit($event);
  }

  stopPropagation(event) {
    event.stopPropagation();
  }
}
