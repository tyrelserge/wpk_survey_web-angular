import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-unallowed',
  templateUrl: './unallowed.component.html',
  styleUrls: ['./unallowed.component.css']
})
export class UnallowedComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    //this.authService.checkAllowed();
    //if (this.authService.isAllowed)
      //this.router.navigate(['/dashboard']);
  }

  onSendSignupMail() {

  }

  onActiveAccount() {
    this.authService.activateAccount();
  }
}
