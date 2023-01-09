import { Component, OnInit } from '@angular/core';
import {SurveyServices} from "../services/survey.services";
import {Company, Staff} from "../models/user.model";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  staff: Staff | undefined;
  company: Company | undefined;

  constructor(private surveyServices: SurveyServices) { }

  ngOnInit(): void {
    this.staff = <Staff>(JSON.parse(<string>localStorage.getItem('staff')));
    this.surveyServices.getCompany(this.staff?.companyId);
    this.surveyServices.company.subscribe(company => {
      this.company = company;
    });
  }

}
