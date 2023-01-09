import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {SurveyServices} from "../../services/survey.services";
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {Survey} from "../../models/survey.model";
import {Client, ClientSurvey, Staff} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
// @ts-ignore
import Any = jasmine.Any;

declare const acreenInit: any;

@Component({
  selector: 'app-survey-resource',
  templateUrl: './survey-resource.component.html',
  styleUrls: ['./survey-resource.component.css']
})
export class SurveyResourceComponent implements OnInit {

  staff: Staff | undefined;

  action: string | undefined;
  //createSurvey: boolean = false;
  isEmptySurveyList: boolean = true;

  surveyList: Survey[] = new Array<Survey>();

  client: Client | undefined;

  displayBox: boolean = false;
  bxTitle: string | undefined;
  bxContent: string | undefined;
  bxAction: string | undefined;
  affected: string | undefined;
  surveyId: number | undefined;

  constructor(private authService: AuthService,
              private surveyServive: SurveyServices,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    acreenInit();

    this.staff = <Staff>(JSON.parse(<string>localStorage.getItem('staff')));

    this.action = this.route.snapshot.params['action'];

    this.surveyServive.getSurveysList(this.staff.companyId, (data) => {

      for (let survey of data) {
        if (survey.surveyStatus != 'deleted') {
          this.surveyList.push(survey);
        }
      }

      if (this.surveyList.length != 0)
        this.isEmptySurveyList = false;
    });
  }

  onSurveySubmit(surveyForm: NgForm) {
    this.surveyServive.saveSurvey(surveyForm, (data) => {
      this.surveyId = data.surveyId;
      this.surveyList.push(data);
      this.bxTitle = data.surveyName;
      this.bxContent = 'Aller à la gestion du survey';
      this.isEmptySurveyList = false;
      this.generatePreviewClient(this.staff?.user, data.surveyId);
    });
  }

  generatePreviewClient(user: Any | undefined, surveyId: number | undefined) {
    this.surveyServive.saveClient(this.staff?.companyId, user, (client) => {
      this.surveyServive.saveSurveyClient(client.clientId, surveyId, 30, (data) => {
        this.displayBox = true;
        this.bxAction = 'go';
        this.affected = 'question';
      });
    });
  }

  onCancel() {
    this.displayBox = false;
    this.bxTitle = undefined;
    this.bxContent = undefined;
  }

  onConfirm() {
      switch (this.affected) {
        case 'question':
          this.router.navigate(['survey/'+ this.surveyId +'/question']);
          break;
      }
  }

}
