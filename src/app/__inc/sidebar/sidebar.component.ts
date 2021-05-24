import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/session.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  userID: any;
  username: any;
  roleID: any;
  corporateID: any;
  isManager: any;
  isEditor: any;
  isViewer: any;
  constructor(private sess: SessionService) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.roleID = localStorage.getItem('role_id');
    this.userID = localStorage.getItem('id'); 
 

  }


}
