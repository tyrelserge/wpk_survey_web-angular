import { Component, OnInit } from '@angular/core';
import {Survey, SurveyQuestion, SurveyResponse, SelectedResponses} from "../../models/survey.model";
import {ActivatedRoute, Router} from "@angular/router";
import {SurveyServices} from "../../services/survey.services";
import {NgForm} from "@angular/forms";
import {ClientSurvey} from "../../models/user.model";
import {callback} from "chart.js/helpers";

declare const acreenInit: any;

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  survey: Survey | undefined;
  surveyQuestionList: SurveyQuestion[] = new Array<SurveyQuestion>();
  selectedQuestion: SurveyQuestion | undefined;
  suggestedResponse: SurveyResponse[] = new Array<SurveyResponse>();

  step: number = 0;
  previewBtnText: string | undefined;
  nextBtnText: string | undefined;

  currentUrl: string | undefined;
  surveyId: number | undefined;
  token: string | undefined;
  lang: string | undefined;
  country: string | undefined;
  action: string | undefined;
  tamplate: string | undefined;

  endSurvey: boolean = false;
  startSurvey: boolean = false;
  clientResponse: ClientSurvey | undefined;
  hidenext: boolean = false;
  selectedResponses: SelectedResponses[] = new Array<SelectedResponses>();

  constructor(private route: ActivatedRoute,
              private surveyServices: SurveyServices,
              private router: Router) { }

  ngOnInit(): void {

    acreenInit();

    this.currentUrl = this.router.url;

    this.surveyId = this.route.snapshot.params['surveyId'];
    this.action = this.route.snapshot.params['action'];
    this.tamplate = this.route.snapshot.params['tamplate'];
    this.token = this.route.snapshot.params['token'];
    this.lang = this.route.snapshot.params['lang'];
    this.country = this.route.snapshot.params['country'];

    this.surveyServices.getSurvey(this.surveyId, data => {
      this.survey = data;
    });

    this.route.queryParamMap.subscribe((params) => {
      let param:string | null = params.get('step');
      if (param!=null && param!='NaN') {
        this.step = parseInt(param);
      } else {
        this.step = 0;
      }
    });

    this.surveyServices.getQuestionsList(this.surveyId, (data) => {

      for (let question of data) {
        if (question.surveyQuestionStatus != 'deleted')
          this.surveyQuestionList.push(question);
      }

      if (this.surveyQuestionList.length>0) {
        this.stepManager(this.step);
      }
    });
  }

  goNextStep(step: number) {
    if (step <= this.surveyQuestionList.length +1) {
      this.router.navigate([this.currentUrl], { queryParams: { step: step }});
      this.stepManager(step);
    }

    if (step > this.surveyQuestionList.length + 1) {
      if (this.action!='preview') {
        this.surveyServices.endClientResponse(this.token, data => {
          this.router.navigate(['/dashboard']);
        })
      } else {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  goPreviewStep(step: number) {
    {
      if (!this.startSurvey || this.endSurvey) {
        this.router.navigate([this.currentUrl], {queryParams: {step: step}});
        this.stepManager(step);
      }

      if (this.startSurvey) {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  private stepManager(step: number) {

    this.selectedResponses = new Array<SelectedResponses>();
    this.selectedQuestion = new SurveyQuestion();
    this.suggestedResponse = new Array<SurveyResponse>();

    this.endSurvey = false;
    this.startSurvey = false;

    this.surveyServices.getClientSurveyResponses(this.token, data => {
      if (this.action != 'preview' && data.clientSurveyStatus == 'completed') {
        this.step = this.surveyQuestionList.length + 1;
        this.hidenext = true;
      } else {
        this.clientResponse = data;
      }
    })

    if (step == 0) {
      this.nextBtnText = "Démarrer";
      this.previewBtnText = 'Quitter';
      this.startSurvey = true;
    } else if (step == 1) {
      this.previewBtnText = "Quitter";
      this.nextBtnText = "Suivant";
      this.selectedQuestion = this.surveyQuestionList[step - 1];
      this.suggestedResponse = this.selectedQuestion.suggestedResponse;
    } else if (step > this.surveyQuestionList.length) {
      this.nextBtnText = "Quitter";
      this.previewBtnText = "Précédent";
      this.endSurvey = true;
    } else {
      // @ts-ignore
      this.selectedQuestion = this.surveyQuestionList[step - 1];
      this.suggestedResponse = this.selectedQuestion.suggestedResponse;
      this.nextBtnText = "Suivant";
      this.previewBtnText = "Précédent";
    }

    if (this.selectedQuestion.surveyQuestionId!=undefined) {
      this.surveyServices.getSelectedResponseDetails(
        this.token, this.selectedQuestion?.surveyQuestionId, (data) => {
          this.selectedResponses = data;
        });
    }
  }

  onSubmitResponseClient(responseForm: NgForm) {

    let fieldsType: string | undefined = this.selectedQuestion?.surveyQuestionFieldType;

    switch (fieldsType) {

      case 'radio':
        this.surveyServices.removeClientResponse(this.token, this.selectedQuestion?.surveyQuestionId, ()=> {
          for (let i = 0; i < this.suggestedResponse.length; i++) {
            let value: string = 'false';
            if (responseForm.value['radioResponse'] == this.suggestedResponse[i].surveyResponseId) value = 'true';
            this.sendResponseClient(this.suggestedResponse[i].surveyQuestionId, this.suggestedResponse[i].surveyResponseId, value);
          }
          this.goNextStep(this.step + 1);
        });
        break;

      case 'checkbox':
        this.surveyServices.removeClientResponse(this.token, this.selectedQuestion?.surveyQuestionId, ()=> {
          for (let i = 0; i < this.suggestedResponse.length; i++) {
            let value: string = 'false';
            if (responseForm.value[i] == true) value = 'true';
            this.sendResponseClient(this.suggestedResponse[i].surveyQuestionId, this.suggestedResponse[i].surveyResponseId, value);
          }
          this.goNextStep(this.step + 1);
        });
        break;

      case 'switch':
        this.surveyServices.removeClientResponse(this.token, this.selectedQuestion?.surveyQuestionId, ()=> {
          for (let i = 0; i < this.suggestedResponse.length; i++) {
            let value: string = 'false';
            if (responseForm.value[i] == true) value = 'true';
            this.sendResponseClient(this.suggestedResponse[i].surveyQuestionId, this.suggestedResponse[i].surveyResponseId, value);
          }
          this.goNextStep(this.step + 1);
        });
        break;

      case 'input':
        this.surveyServices.removeClientResponse(this.token, this.selectedQuestion?.surveyQuestionId, ()=> {
          for (let i = 0; i < this.suggestedResponse.length; i++) {
            let value: string = responseForm.value[i];
            this.sendResponseClient(this.suggestedResponse[i].surveyQuestionId, this.suggestedResponse[i].surveyResponseId, value);
          }
          this.goNextStep(this.step + 1);
        });
        break;

      default:
        this.goNextStep(this.step + 1);
        break;
    }
  }

  private sendResponseClient(questionId: number | undefined, responseId: number | undefined, details: string) {
    this.surveyServices.saveClientResponse(this.token, questionId, responseId, details, (data) => {
      this.clientResponse = data;
    });
  }

}
