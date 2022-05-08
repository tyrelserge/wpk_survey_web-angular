import {Injectable} from "@angular/core";
import {NgForm} from "@angular/forms";
import {UtilsResources} from "./utils.resources";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Survey, SurveyQuestion, SurveyResponse} from "../models/survey.model";
import {ResponseInterface} from "../models/response.interface";
import {error} from "@angular/compiler/src/util";
import {Client, ClientSurvey} from "../models/user.model";
// @ts-ignore
import Any = jasmine.Any;

@Injectable()
export class SurveyServices {

  constructor(private httpClient: HttpClient) {
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
  getSelectedSurveyQuestion(questionId:number, callback: (data: SurveyQuestion) => void) {

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


  getSurveysList(callback: (data:Survey[]) => void) {

    let url = UtilsResources.baseUrl + '/surveys';

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

  saveClientResponse(token: string | undefined,
                     questionId: number | undefined,
                     responseId: number | undefined,
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

  removeClientResponse(token: string | undefined,
                       questionId: number | undefined,
                       responseId: number | undefined, callback: (data: ClientSurvey) => void) {

    let url = UtilsResources.baseUrl + '/survey/client/'+ token +'/question/'+ questionId +'/response/' + responseId;

    this.httpClient.delete<ResponseInterface>(url).subscribe(
      data => {},
      error => console.error('There was an error !', error));
  }

  getClientSurveyResponses(token: string | undefined, callback: (data: ClientSurvey) => void) {

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

  saveClient(client: Any, expiration: number | undefined, callback: (data: Client) => void) {

    let url = UtilsResources.baseUrl + '/client';

    let params = {
      "clientName" : client.name,
      "clientEmail" : client.email,
      "clientPhone" : client.mobile,
      "clientCountry" : client.country,
      "clientCountryCode" : client.countryCode,
      "clientCity" : client.city,
      "clientAddress" : client.address,
      "clientLanguage" : client.language,
      "clientStatus" : "active"
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

  createSurveyClient(clientId: number | undefined, surveyId: number | undefined, expiration: number | undefined, callback: (data: ClientSurvey) => void) {

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

  getClientSurveyResponsesList(surveyId: number | undefined, callback: (data: ClientSurvey[]) => void) {

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

  getAllClients(callback: (data: Client[]) => void) {

    let url = UtilsResources.baseUrl + '/clients';

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

  publishClientSurveyMessage(p: NgForm, token: string | undefined,
                             country: string | undefined,
                             lang: string | undefined,
                             callback: (data: string) => void) {

    let url = 'https://otp.wirepick.com/httptest/send?transaction=y&'
      + 'staff=serge&password=wpk@ADMIN\\\\5874&phone=2250709672948&text='
      + p.value['subject']+': ' + p.value['message'] + ' &from=WIREPICK';

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
