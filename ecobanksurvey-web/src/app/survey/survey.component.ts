import { Component, OnInit } from '@angular/core';
import {SurveyQuestion, SurveyResponse} from "../../models/survey.model";
import {ActivatedRoute, Router} from "@angular/router";
import {SurveyServices} from "../../services/survey.services";
import {NgForm} from "@angular/forms";
import {ClientSurvey} from "../../models/user.model";

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

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

  constructor(private route: ActivatedRoute,
              private surveyServices: SurveyServices,
              private router: Router) { }

  ngOnInit(): void {
    this.currentUrl = this.router.url;

    this.surveyId = this.route.snapshot.params['surveyId'];
    this.action = this.route.snapshot.params['action'];
    this.tamplate = this.route.snapshot.params['tamplate'];
    this.token = this.route.snapshot.params['token'];
    this.lang = this.route.snapshot.params['lang'];
    this.country = this.route.snapshot.params['country'];

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
      this.router.navigate(['/dashboard']);
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

    this.surveyServices.getClientSurveyResponses(this.token, data => {
      this.clientResponse = data;
    })

    this.selectedQuestion = new SurveyQuestion();
    this.suggestedResponse = new Array<SurveyResponse>();

    this.endSurvey = false;
    this.startSurvey = false;

    if (step==0) {
      this.nextBtnText = "Démarrer";
      this.previewBtnText = 'Quitter';
      this.startSurvey = true;
    } else if (step==1) {
      this.previewBtnText = "Quitter";
      this.nextBtnText = "Suivant";
      this.selectedQuestion = this.surveyQuestionList[step-1];
      this.suggestedResponse = this.selectedQuestion.suggestedResponse;
    } else if (step > this.surveyQuestionList.length) {
      this.nextBtnText = "Quitter";
      this.previewBtnText = "Précédent";
      this.endSurvey = true;
    } else {
      // @ts-ignore
      this.selectedQuestion = this.surveyQuestionList[step-1];
      this.suggestedResponse = this.selectedQuestion.suggestedResponse;
      this.nextBtnText = "Suivant";
      this.previewBtnText = "Précédent";
    }
  }

  onSubmitResponseClient(responseForm: NgForm) {

    console.log(responseForm.value);

    let responseId = undefined;
    let details = responseForm.value['details'];

    let fieldsType: string | undefined = this.selectedQuestion ? this.selectedQuestion.surveyQuestionFieldType : undefined;

    switch (fieldsType) {

      case 'radio':
        this.prepareResponseClient(this.token, this.suggestedResponse, ()=>{
          this.sendResponseClient(this.suggestedResponse[0].surveyQuestionId, responseForm.value['radioResponse'], details);
          this.goNextStep(this.step + 1);
        });
        break;

      case 'checkbox':
        this.prepareResponseClient(this.token, this.suggestedResponse, ()=>{
          for (let i=0; i<this.suggestedResponse.length; i++) {
            if (responseForm.value[i]==true) {
              this.sendResponseClient(this.suggestedResponse[i].surveyQuestionId, this.suggestedResponse[i].surveyResponseId, details);
            }
          } this.goNextStep(this.step + 1);
        });
        break;

      case 'switch':
        this.prepareResponseClient(this.token, this.suggestedResponse, ()=> {
          for (let i=0; i<this.suggestedResponse.length; i++) {
            details = responseForm.value[i]==true ? 'true' : 'false';
            this.sendResponseClient(this.suggestedResponse[i].surveyQuestionId, this.suggestedResponse[i].surveyResponseId, details);
          } this.goNextStep(this.step + 1);
        });
        break;

      case 'input':
        this.prepareResponseClient(this.token, this.suggestedResponse, ()=> {
          for (let i = 0; i < this.suggestedResponse.length; i++) {
            details = responseForm.value[i];
            this.sendResponseClient(this.suggestedResponse[i].surveyQuestionId, this.suggestedResponse[i].surveyResponseId, details);
          } this.goNextStep(this.step + 1);
        });
        break;

      default:
        this.goNextStep(this.step + 1);
        break;
    }

  }

  private sendResponseClient(questionId: number | undefined, responseId: number | undefined, details: string) {
    this.surveyServices.saveClientResponse(this.token, questionId, responseId, details, (data) => {});
  }

  private prepareResponseClient(tokenCode: string | undefined, responses: SurveyResponse[], callback:()=>void) {
    for (let i=0; i<responses.length; i++) {
      this.surveyServices.removeClientResponse(tokenCode, this.suggestedResponse[i].surveyQuestionId,
        this.suggestedResponse[i].surveyResponseId, (data)=>{});
    }
    callback();
  }

}
