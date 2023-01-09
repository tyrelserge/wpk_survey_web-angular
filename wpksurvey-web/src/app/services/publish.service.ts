import {Injectable} from "@angular/core";
import {UtilsResources} from "./utils.resources";
import {ResponseInterface} from "../models/response.interface";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {ShortUrl} from "../models/survey.model";
import {callback} from "chart.js/helpers";
import {Router} from "@angular/router";

@Injectable()
export class PublishService {

  constructor(private httpClient: HttpClient) {
  }

  publishClientSurveySMS(object: string, message: string, company: string | undefined, countryCode: string | undefined, phone: string | undefined,
                             callback: (data: string) => void) {

    if (!countryCode || !phone)
      return;

    let username = 'serge';
    let password = 'wpk@ADMIN\\\\5874';
    let from = company;
    let address = countryCode + phone;

    let url = 'https://otp.wirepick.com/httptest/send?transaction=y&' +'staff='+ username +'&password='
      + password +'&phone='+ address +'&text=' + object +': ' + message + ' &from='+ from;

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

  getClientsShortUrls(surveyId: number | undefined, callback: (data: ShortUrl[]) => void) {

    let url = UtilsResources.baseUrl + '/survey/'+ surveyId +'/published/shorturl/list';

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
  saveClientShortUrl(surveyId: number | undefined, length: number, domaine: string | undefined, clientLink: string,
                     callback: (shortUrl: ShortUrl) => void) {

    let url = UtilsResources.baseUrl + '/survey/published/shorturl';

    let params = {
      "surveyId": surveyId,
      "shortlength": length,
      "domaine": domaine,
      "fullUrl": clientLink
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
  getClientsShortUrl(publishedCode: string, callback: (data: ShortUrl | undefined) => void) {

    let url = UtilsResources.baseUrl + '/survey/published/shorturl/' + publishedCode;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback(data.response);
        //} else {
          //console.error('Not question found', data);
        }
      },
      error => callback(undefined));
      //error => console.error('There was an error !', error));
  }
  removeClientsShortUrls(surveyId: number | undefined, callback: () => void) {

    let url = UtilsResources.baseUrl + '/survey/'+surveyId+'/published/shorturls';

    this.httpClient.delete<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == UtilsResources.SUCCESS) {
          callback();
        } else {
          console.error('Not question found', data);
        }
      },
      error => console.error('There was an error !', error));
  }

  activateSurvey(surveyId: number | undefined) {

    let url = UtilsResources.baseUrl + '/survey/'+ surveyId +'/activate';

    this.httpClient.put<ResponseInterface>(url, {}).subscribe(
      data => {
        if (data.statusCode != UtilsResources.SUCCESS)
          console.error('Not question found', data);
      },
      error => console.error('There was an error !', error));
  }
  publishSurvey(surveyId: number | undefined) {

    let url = UtilsResources.baseUrl + '/survey/'+ surveyId +'/publish';

    this.httpClient.put<ResponseInterface>(url, {}).subscribe(
      data => {
        if (data.statusCode != UtilsResources.SUCCESS)
          console.error('Not question found', data);
      },
      error => console.error('There was an error !', error));
  }
  completSurvey(surveyId: number | undefined) {

    let url = UtilsResources.baseUrl + '/survey/'+ surveyId +'/complet';

    this.httpClient.put<ResponseInterface>(url, {}).subscribe(
      data => {
        if (data.statusCode != UtilsResources.SUCCESS)
          console.error('Not question found', data);
      },
      error => console.error('There was an error !', error));
  }



}
