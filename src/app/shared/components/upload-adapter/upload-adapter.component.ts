import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FilePickerComponent, FilePreviewModel, UploaderCaptions, ValidationError } from 'ngx-awesome-uploader';
import { UploadFilePickerAdapter } from './upload.adapter';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'ssa-upload-adapter',
  templateUrl: './upload-adapter.component.html',
  styleUrls: ['./uplaod-adapter.component.scss']
})
export class UploadAdapterComponent {
  @Output() canBeImport: EventEmitter<any> = new EventEmitter();

  @ViewChild("uploader", { static: false }) uploader: FilePickerComponent;

  public adapter = new UploadFilePickerAdapter();
  public myFiles: FilePreviewModel[] = [];
  public errorMsg: string = null;

  captions: UploaderCaptions = {
    dropzone: {
      title: "Drag and drop file here",
      or: "or",
      browse: "browse files"
    },
    cropper: {
      crop: "crop",
      cancel: "cancel"
    },
    previewCard: {
      remove: "remove",
      uploadError: "upload error"
    }
  };
  constructor() { }

  public onValidationError(error: ValidationError): void {
    switch (error.error) {
      case "FILE_MAX_SIZE":
        this.errorMsg = 'Maximum allowed file(s) size is 3 MB'
        break;
      case "EXTENSIONS":
        this.errorMsg = "Allowed Extensions are [PDF - JPG - JPEG - PNG]"
        break;

      case "TOTAL_MAX_SIZE":
      this.errorMsg = 'Maximum allowed total files size is 3 MB';
      break;

      default:
        break;
    }
    // alert(`Validation Error ${error.error} in ${error.file.name}`);
  }

  public onRemoveSuccess(e: FilePreviewModel) {
    this.errorMsg = null;
    let i = this.myFiles.indexOf(this.myFiles.find((x: any) => x.fileName === e.fileName));
    this.myFiles.splice(i, 1);
    this.canBeImport.emit(this.myFiles)
  }
  public onFileAdded(file: FilePreviewModel) {
    this.errorMsg = null;
    this.myFiles.push(file);
    this.canBeImport.emit(this.myFiles)
  }
  public CustomValidatorFun(file: File): Observable<boolean> { 
    return of(true).pipe(delay(100));
  }
}
