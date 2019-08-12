import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatToolbarModule, MatFormFieldModule, MatInputModule,
  MatButtonModule, MatSnackBarModule, MatProgressSpinnerModule, MatSlideToggleModule,
  MatListModule, MatIconModule, MatLineModule, MatSidenavModule, MatTabsModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  exports: [
    CommonModule,
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
    ReactiveFormsModule
  ]
})
export class SharedModule { }
