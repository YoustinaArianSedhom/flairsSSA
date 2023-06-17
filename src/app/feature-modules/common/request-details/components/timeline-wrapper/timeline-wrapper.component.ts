import { RevertModalComponent } from './../revert-modal/revert-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';
import * as ALL_REQUESTS_ICONS from '@modules/common/model/status.model';


@Component({
  selector: 'ssa-timeline-wrapper',
  templateUrl: './timeline-wrapper.component.html',
  styleUrls: ['./timeline-wrapper.component.scss']
})
export class TimelineWrapperComponent {
  @Input() timelineItem: REQUEST_DETAILS_MODELS.TimelineDetailsModel;
  @Input() isFirst: boolean;
  @Input() showReverButton: boolean = false;
  @Input() readableId: number;
  @Output() getRevertData: EventEmitter<{}> = new EventEmitter;
  public matExpanded:boolean = false
  
  public ALL_REQUESTS_ICONS = ALL_REQUESTS_ICONS;
  constructor(private _matDialg: MatDialog) { }

  public openRevertModal() {
   const dialogRef = this._matDialg.open(RevertModalComponent , {
      data: this.readableId
    })
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.choiceNote) {
        this.getRevertData.emit({choiceNote: res.choiceNote,auditId: this.timelineItem})
      }
    })
  }

}
