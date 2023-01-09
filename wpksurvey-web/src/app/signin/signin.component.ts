import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";
import {Staff} from "../models/user.model";
import {SurveyServices} from "../services/survey.services";

declare const acreenInit: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private surveyServices: SurveyServices) { }

  ngOnInit(): void {

    acreenInit();

    if (this.authService.isAuth())
      this.router.navigate(['/dashboard']);
  }

  onSubmitConnexion(form: NgForm) {
    this.authService.signIn(form.value['username'], form.value['password'], (staff)=>{
      this.surveyServices.getCompany(staff?.companyId);
      this.router.navigate(['/dashboard']);
    });
  }

  onSubmitSignup(signupForm: NgForm) {
    this.userService.createUser(signupForm, data => {
      this.router.navigate(['/unallowed']);
    });
  }
}
