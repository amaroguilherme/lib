import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';

@NgModule({
  imports: [
    SharedModule,
    DashboardRoutingModule
  ],
  declarations: [DashboardHomeComponent, DashboardHeaderComponent]
})
export class DashboardModule { }
