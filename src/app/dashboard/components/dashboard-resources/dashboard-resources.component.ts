import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-resources',
  templateUrl: './dashboard-resources.component.html',
  styleUrls: ['./dashboard-resources.component.scss']
})
export class DashboardResourcesComponent implements OnInit {

  @Input() isMenu = false;
  @Output() close = new EventEmitter<void>();

  resources: any[] = [
    {
      url: '/dashboard/chat',
      icon: 'chat_bubble',
      title: 'Meetings'
    }
  ];

  ngOnInit(): void {
    if (this.isMenu) {
      this.resources.unshift({
        url: '/dashboard',
        icon: 'home',
        title: 'Home'
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

}
