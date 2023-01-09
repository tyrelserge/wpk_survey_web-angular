import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {Staff} from "../../models/user.model";

@Component({
  selector: 'app-unallowed',
  templateUrl: './unallowed.component.html',
  styleUrls: ['./unallowed.component.css']
})
export class UnallowedComponent implements OnInit {

  staff: Staff | undefined;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    if (this.authService.isAuth()) {
      if (this.authService.isAllowed()) {
        this.router.navigate(['/dashboard']);
      } else {
        this.staff = <Staff>(JSON.parse(<string>localStorage.getItem('staff')));
      }
    } else {
      this.router.navigate(['/connexion']);
    }

  }

  onSendSignupMail() {

  }

  onActiveAccount() {
    this.authService.activateAccount();
  }
}
