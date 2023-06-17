import { HttpEvent, HttpEventType } from "@angular/common/http";
import { FilePickerAdapter, FilePreviewModel, UploadResponse, UploadStatus } from "ngx-awesome-uploader";
import { merge, observable, Observable, of } from "rxjs";
import { catchError, delay, map } from "rxjs/operators";

export class UploadFilePickerAdapter extends FilePickerAdapter {
    
    public d:Observable<any>;

    constructor(){
        super();
    }
    uploadFile(fileItem: FilePreviewModel): Observable<UploadResponse> {
          const uploaded100 = {
            status: UploadStatus.UPLOADED,
            progress: 100
          } as UploadResponse;
          const observableUploaded100 = of(uploaded100).pipe(delay(100));
          return merge(observableUploaded100);
        }
    removeFile(fileItem: FilePreviewModel): Observable<any> {
        console.log('remove' , fileItem);
        return of(true)
        
    }
}
