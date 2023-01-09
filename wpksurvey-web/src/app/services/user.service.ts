import {NgForm} from "@angular/forms";
import {UtilsResources} from "./utils.resources";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ResponseInterface} from "../models/response.interface";
import {Router} from "@angular/router";
import {Staff} from "../models/user.model";
import {Injectable} from "@angular/core";

@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  createUser(form: NgForm, callback: (data: Staff) => void) {

    let url = UtilsResources.baseUrl + '/staff';

    let name = form.value['civility'] + '. ' + form.value['lastname'] + '. ' + form.value['firstname'];

    let params = {
      "companyId": form.value['companyCode'],
      "user": {
        "name": name,
        "email": form.value['email'],
        "phone": form.value['mobile'],
        "country": "CI",
        "countryCode": "225",
        "city": "Abidjan",
        "address": "",
        "language": "fr",
        "status": ""
      },
      "role": "011",
      "department": "",
      "office": "",
      "password": form.value['password']
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    })

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {

        if (data.statusCode=='SUCCESS') {

          localStorage.setItem('staff', JSON.stringify(data.response));
          callback(data.response);

        } else if (data.statusCode=='ALREADY_EXISTS') {

          alert('Cette adresse e-mail est déjà enregistré');
          this.router.navigate(['/']);

        } else {
          alert('Verifiez que tous les champs son entré correctement');
        }
      },
      error => console.error('There was an error!', error));
  }
}
