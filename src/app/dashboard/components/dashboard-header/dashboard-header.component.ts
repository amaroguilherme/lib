import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {

  @Input() sidenav: MatSidenav;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  onLogout(): void {
    this.authService.logout();
  }
}
