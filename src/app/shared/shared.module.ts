import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatToolbarModule, MatFormFieldModule, MatInputModule,
  MatButtonModule, MatSnackBarModule, MatProgressSpinnerModule, MatSlideToggleModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  exports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatToolbarModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }