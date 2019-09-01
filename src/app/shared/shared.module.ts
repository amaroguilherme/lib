import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatToolbarModule, MatFormFieldModule, MatInputModule,
  MatButtonModule, MatSnackBarModule, MatProgressSpinnerModule, MatSlideToggleModule,
  MatListModule, MatIconModule, MatLineModule, MatSidenavModule, MatTabsModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoRecordComponent } from './components/no-record/no-record.component';

@NgModule({
  declarations: [NoRecordComponent],
  imports: [MatIconModule],
  exports: [
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
    ReactiveFormsModule
  ]
})
export class SharedModule { }
