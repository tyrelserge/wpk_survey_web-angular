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
      'name': name,
      'phone': form.value['mobile'],
      'email': form.value['email'],
      'password': form.value['password']
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    })

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {

        if (data.statusCode=='SUCCESS') {
          localStorage.setItem('user', JSON.stringify(data.response));
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
