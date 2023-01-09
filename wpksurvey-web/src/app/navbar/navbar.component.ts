import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {SurveyServices} from "../services/survey.services";
import {Company, Staff} from "../models/user.model";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isAuth: boolean = false;

  company: Company | undefined;
  staff: Staff | undefined;

  constructor(private authService: AuthService,
              private surveyServices: SurveyServices,
              private router: Router) { }

  ngOnInit(): void {

    this.authService.auth.subscribe(isAuth=> {
      this.isAuth = isAuth;
    });

    this.staff = <Staff>(JSON.parse(<string>localStorage.getItem('staff')));
    this.surveyServices.getCompany(this.staff?.companyId);

    this.surveyServices.company.subscribe(company => {
      this.company = company;
    });
  }

  onSignOut() {
    this.authService.signOut();
  }
}
