import { Component, OnInit } from '@angular/core';
import { Question, Survey } from "../../../../models/survey.model";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {SurveyServices} from "../../../../services/survey.services";

@Component({
  selector: 'app-analysis-table',
  templateUrl: './analysis-table.component.html',
  styleUrls: ['./analysis-table.component.css']
})
export class AnalysisTableComponent implements OnInit {

  survey: Survey | undefined;
  questions: Question[] = new Array<Question>();
  //suggestions: SurveyResponse[] = new Array<SurveyResponse>();
  //selectedResponse: SelectedResponses[] = new Array<SelectedResponses>();

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private surveyServices: SurveyServices) { }

  ngOnInit(): void {

    if (!this.authService.checkAuth()) this.router.navigate(['/']);
    let surveyId: number = this.route.snapshot.params['surveyId'];

    this.surveyServices.getSurvey(surveyId, data => {
      this.survey = data;
    });

    this.surveyServices.getSurveyGroupedResponses(surveyId, data => {
      this.questions = data.questions;
    });

  }

  responseCount(i: number, sugesstionId: number | undefined) {

    let question = this.questions[i];
    let responses = question.responses;

    if (question.surveyQuestionFieldType!=='switch' && question.surveyQuestionFieldType!=='input') {

      let count: number = 0;

      for(let j=0; j<responses.length; j++) {
        if (sugesstionId===responses[j].surveyResponseId) {
          if (responses[j].surveyResponseDetails==='true')
            count +=1;
        }
      }

     return count;

    } else if (question.surveyQuestionFieldType==='switch') {

      let countTrue = 0;
      let countFalse = 0;

      for(let j=0; j<responses.length; j++) {
        if (sugesstionId===responses[j].surveyResponseId) {
          if (responses[j].surveyResponseDetails==='true') {
            countTrue +=1;
          } else {
            countFalse +=1;
          }
        }
      }

      return countFalse + ' | ' + countTrue;

    } else {}

    return;
  }
}
