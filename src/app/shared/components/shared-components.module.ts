import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@shared/material.module';
import { InnerPageLayoutComponent } from './inner-page-layout/inner-page-layout.component';
import { LinkComponent } from './link/link.component';
import { NoResultComponent } from './no-result/no-result.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { FilePickerModule } from  'ngx-awesome-uploader';
import { UploadAdapterComponent } from './upload-adapter/upload-adapter.component';
import { FilterMenuComponent } from './filter-menu/filter-menu.component';
import { ArchiveDeleteComponent } from './archive-delete/archive-delete.component';
import { ValidationModule } from '@shared/modules/validation/validation.module';
import { ModalsModule } from '@shared/modules/modals/modals.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, RouterModule, MaterialModule,FilePickerModule, ValidationModule, ModalsModule, ReactiveFormsModule ],
    exports: [InnerPageLayoutComponent, NoResultComponent, SearchInputComponent, LinkComponent, UploadAdapterComponent,FilterMenuComponent],
    declarations: [InnerPageLayoutComponent, NoResultComponent, SearchInputComponent, LinkComponent,UploadAdapterComponent, FilterMenuComponent, ArchiveDeleteComponent],
    providers: [],
})
export class SharedComponentsModule {
 }
