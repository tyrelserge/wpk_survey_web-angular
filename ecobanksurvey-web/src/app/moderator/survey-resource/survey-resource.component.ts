import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {SurveyServices} from "../../../services/survey.services";
import {Router} from "@angular/router";
import {Survey} from "../../../models/survey.model";
import {Client, ClientSurvey, Staff} from "../../../models/user.model";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-survey-resource',
  templateUrl: './survey-resource.component.html',
  styleUrls: ['./survey-resource.component.css']
})
export class SurveyResourceComponent implements OnInit {

  user: Staff | undefined;

  isEmptySurveyList: boolean = true;
  surveyList: Survey[] = new Array<Survey>();

  userId: number | undefined;
  client: Client | undefined;

  displayBox: boolean = false;
  bxTitle: string | undefined;
  bxContent: string | undefined;
  bxAction: string | undefined;
  affected: string | undefined;
  private surveyId: number | undefined;

  constructor(private authService: AuthService,
              private surveyServive: SurveyServices,
              private router: Router) { }

  ngOnInit(): void {

    if (!this.authService.checkAuth()) this.router.navigate(['/']);
    //this.authService.isAuth = this.authService.checkAuth();
    //if (!this.authService.isAuth) this.router.navigate(['/']);
    // @ts-ignore
    this.user = <Staff>(JSON.parse(localStorage.getItem('user')));
    this.userId = this.user.staffId;

    this.surveyServive.getSurveysList((data) => {

      for (let survey of data) {
        if (survey.surveyStatus!='deleted') {
          this.surveyList.push(survey);
        }
      }

      if (this.surveyList.length!=0)
        this.isEmptySurveyList=false;
    });
  }

  onSurveySubmit(surveyForm: NgForm) {
    this.surveyServive.saveSurvey(surveyForm, (data) => {
      this.surveyId = data.surveyId;
      this.surveyList.push(data);
      this.bxTitle = data.surveyName;
      this.bxContent = 'Aller à la gestion du survey';
      this.generatePreviewClient(this.userId, data.surveyId);
    });
  }

  generatePreviewClient(clientId: number | undefined, surveyId: number | undefined) {
    this.surveyServive.createSurveyClient(clientId, surveyId, 30, (data: ClientSurvey) => {
      this.displayBox = true;
      this.bxAction = 'go';
      this.affected = 'question';
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
