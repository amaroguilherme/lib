import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatToolbarModule, MatFormFieldModule, MatInputModule,
  MatButtonModule, MatSnackBarModule, MatProgressSpinnerModule, MatSlideToggleModule,
  MatListModule, MatIconModule, MatLineModule, MatSidenavModule, MatTabsModule, MatDialogModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoRecordComponent } from './components/no-record/no-record.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
import { ReadFilePipe } from './pipes/read-file.pipe';

@NgModule({
  declarations: [NoRecordComponent, AvatarComponent, ImagePreviewComponent, ReadFilePipe],
  imports: [CommonModule,
            MatIconModule,
            MatCardModule, MatToolbarModule, MatButtonModule, MatDialogModule],
  entryComponents: [
    ImagePreviewComponent
  ],
  exports: [
    AvatarComponent,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatLineModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
    NoRecordComponent,
    ReactiveFormsModule,
    ImagePreviewComponent,
    MatDialogModule,
    ReadFilePipe
  ]
})
export class SharedModule { }
