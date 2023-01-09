import {EventEmitter, Injectable, Output} from "@angular/core";
import {NgForm} from "@angular/forms";
import {UtilsResources} from "./utils.resources";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SelectedResponses, GroupedResponses, Survey, SurveyQuestion, SurveyResponse} from "../models/survey.model";
import {ResponseInterface} from "../models/response.interface";
import {Client, ClientSurvey, Company} from "../models/user.model";
// @ts-ignore
import Any = jasmine.Any;

@Injectable()
export class SurveyServices {

  @Output()
  company: EventEmitter<Company> = new EventEmitter<Company>();

  constructor(private httpClient: HttpClient) {
  }

  getCompany(companyId: string | undefined) {

    let url = UtilsResources.baseUrl + '/company/'+ companyId;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          this.company.emit(data.response);
        } else {
          console.error('Not surveys found', data);
        }
      },
      error => console.error('There was an error !', error));
  };

  getSurveysList(companyId: string | undefined, callback: (data: Survey[]) => void) {

    let url = UtilsResources.baseUrl + '/company/'+ companyId +'/surveys';

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not surveys found', data);
        }
      },
      error => console.error('There was an error !', error));

  }
  saveSurvey(surveyForm: NgForm, callback: (data: Survey) => void) {

    let url = UtilsResources.baseUrl + '/survey';

    let params = {
      "companyId": surveyForm.value['companyCode'],
      "surveyName": surveyForm.value['surveyname'],
      "surveySubject": surveyForm.value['surveysubject'],
      "surveyDescrib": surveyForm.value['surveydescrib'],
      "surveyStatus": "active"
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not data found', data);
        }
      },
      error => console.error('There was an error !', error));
  }
  getSurvey(surveyId: number | undefined, callback: (data: Survey) => void) {

    let url = UtilsResources.baseUrl + '/survey/' + surveyId;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not survey found', data);
        }
      },
      error => console.error('There was an error !', error));
  }
  updateServey(surveyId: number | undefined, surveyForm: NgForm, callback: (data: Survey) => void) {

    let url = UtilsResources.baseUrl + '/survey/' + surveyId;

    let params = {
      "surveyName": surveyForm.value['surveyname'],
      "surveySubject": surveyForm.value['surveysubject'],
      "surveyDescrib": surveyForm.value['surveydescrib'],
      "surveyStatus": "active"
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });

    this.httpClient.put<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not data found', data);
        }
      },
      error => console.error('There was an error !', error));
  }
  deleteSurvey(surveyId: number | undefined, callback: (data: Survey) => void) {

    let url = UtilsResources.baseUrl + '/survey/' + surveyId;

    this.httpClient.delete<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not survey found', data);
        }
      },
      error => console.error('There was an error !', error));
  }

  getQuestionsList(surveyId: number | undefined, callback: (data: SurveyQuestion[]) => void) {

    let url = UtilsResources.baseUrl + '/survey/'+ surveyId +'/questions';

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode==UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not data found !', data);
        }
      },
      error => console.error('There was an error !', error));

  }
  saveSurveyQuestion(questionForm: NgForm, callback: (data: SurveyQuestion) => void) {

    let url = UtilsResources.baseUrl + '/survey/question';

    let params = {
      "surveyId": questionForm.value['survey'],
      "surveyQuestionSubject" : questionForm.value['surveysubject'],
      "surveyQuestionContent": questionForm.value['question'],
      "surveyQuestionFieldType": questionForm.value['questionType'],
      "surveyQuestionStatus" : "active"
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not data found', data);
        }
      },
      error => console.error('There was an error !', error));

  }
  getSurveyQuestion(questionId:number, callback: (data: SurveyQuestion) => void) {

    let url = UtilsResources.baseUrl + '/survey/question' + questionId;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode==UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not data found !', data);
        }
      },
      error => console.error('There was an error !', error));

  }
  deleteSurveyQuestion(questionId: number | undefined, callback: (data: SurveyQuestion) => void) {

    let url = UtilsResources.baseUrl + '/survey/question/' + questionId;

    this.httpClient.delete<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not question found', data);
        }
      },
      error => console.error('There was an error !', error));
  }

  getSurveyResponsesSuggestion(surveyId: number, callback: (data: GroupedResponses) => void) {

    let url = UtilsResources.baseUrl + '/survey/'+ surveyId +'/responses';

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not question found', data);
        }
      },
      error => console.error('There was an error !', error));

  }
  saveResponseSuggestion(responseForm: NgForm, callback: (data: SurveyResponse) => void) {

    let url = UtilsResources.baseUrl + '/survey/response';

    let params = {
      "surveyQuestionId": responseForm.value['selectedquestion'],
      "surveyResponseValue": responseForm.value['responsesuggestion']
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not data found', data);
        }
      },
      error => console.error('There was an error !', error));

  }

  getCompanyClients(companyId: string | undefined, callback: (data: Client[]) => void) {

    let url = UtilsResources.baseUrl + '/company/'+ companyId +'/clients';

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not question found', data);
        }
      },
      error => console.error('There was an error !', error));
  }
  saveClient(companyId: string | undefined, user: Any, callback: (data: Client) => void) {

    let url = UtilsResources.baseUrl + '/client';

    let params = {
      "companyId": companyId,
      "name": user.name,
      "email": user.email,
      "phone": user.phone,
      "country": user.country,
      "countryCode": user.countryCode,
      "city": user.city,
      "address": user.address,
      "language": user.language,
      "status": "active"
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not data found', data);
        }
      },
      error => console.error('There was an error !', error));
  }
  getClientByPhone(phone: string | undefined, callback: (data: Client) => void) {

    let url = UtilsResources.baseUrl + '/client/phone/'+ phone;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not question found', data);
        }
      },
      error => console.error('There was an error !', error));
  }
  getSurveyClients(surveyId: number | undefined, callback: (data: ClientSurvey[]) => void) {

    let url = UtilsResources.baseUrl + '/survey/'+ surveyId +'/clients';

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not question found', data);
        }
      },
      error => console.error('There was an error !', error));
  }
  saveSurveyClient(clientId: number | undefined, surveyId: number | undefined, expiration: number | undefined,
                     callback: (data: ClientSurvey) => void) {

    let url = UtilsResources.baseUrl + '/survey/'+ surveyId +'/client';

    let params = {
      "clientId" : clientId,
      "expiration" : expiration,
      "status" : "active"
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not data found', data);
        }
      },
      error => console.error('There was an error !', error));
  }

  getClientResponsesByToken(token: string | undefined, callback: (data: ClientSurvey) => void) {

    let url = UtilsResources.baseUrl + '/survey/client/'+ token +'/responses';

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not data found', data);
        }
      },
      error => console.error('There was an error !', error));
  }
  saveClientResponse(token: string | undefined, questionId: number | undefined,responseId: number | undefined,
                     details: string, callback: (data: ClientSurvey) => void) {

    let url = UtilsResources.baseUrl + '/survey/client/response';

    let params = {
      'tokenCode': token,
      'surveyQuestionId': questionId,
      'surveyResponseId': responseId,
      'selectedResponseDetails': details
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not data found', data);
        }
      },
      error => console.error('There was an error !', error));
  }
  removeClientResponse(token: string | undefined, questionId: number | undefined, callback: () => void) {

    let url = UtilsResources.baseUrl + '/survey/client/'+ token +'/question/'+ questionId +'/responses';

    this.httpClient.delete<ResponseInterface>(url).subscribe(
      data => callback(),
      error => console.error('There was an error !', error));
  }

  endClientResponse(token: string | undefined, callback: (data:ClientSurvey) => void) {

    let url = UtilsResources.baseUrl + '/survey/client/response/end';

    let params = {
      "tokenCode" : token
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not data found', data);
        }
      },
      error => console.error('There was an error !', error));
  }

  getSelectedResponseDetails(token: string | undefined, questionId: number | undefined, callback: (data: SelectedResponses[]) => void) {

    let url = UtilsResources.baseUrl + '/survey/client/'+ token +'/question/'+ questionId + '/responses/details';

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        } else {
          console.error('Not question found', data);
        }
      },
      error => console.error('There was an error !', error));
  }


}
