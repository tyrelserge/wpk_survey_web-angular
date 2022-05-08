import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Client, Staff} from "../models/user.model";
import {UtilsResources} from "./utils.resources";
import {ResponseInterface} from "../models/response.interface";

@Injectable()
export class AuthService {

  isAuth: boolean = false;
  isAllowed: boolean = false;

  constructor(private router: Router,
              private httpClient: HttpClient) {}

  checkAuth() {
    let user = localStorage.getItem('user');
    if (user!=null) {
      return true;
    }
    return false;
  }

  checkAllowed() {
    if (this.checkAuth()) {
      // @ts-ignore
      let user = <Staff>(JSON.parse(localStorage.getItem('user')));
      if (user!= undefined && user.status=='active') {
        this.isAllowed = true;
      } else {
        this.isAllowed = false;
      }
      this.isAuth = true;
    } else {
      this.isAuth = false;
    }
  }

  signIn(username:string, password:string, callback: (data: Staff) => void) {

    const url = UtilsResources.baseUrl + '/staff/login';

    let params = {
      'username' : username,
      'password' : password
    }

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    })

    this.httpClient.post<ResponseInterface>(url, params, {headers}).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          localStorage.setItem('user', JSON.stringify(data.response));
          callback(data.response);
        } else {
          alert("Login ou mot passe Incorrect");
        }
      },
      error => console.error('There was an error!', error));
  }

  signOut() {
    localStorage.clear();
  }

  sendActivationMail(email: string, ) {

  }

  /*
  signInById(userId: number, password: string, redirectTo:string | null) {

    const url = UtilsResources.baseUrl + '/user/'+userId;

    this.httpClient.get<ResponseInterface>(url).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          if (data.response.email!=null)
            this.signIn(data.response.email, password, () => {
              this.router.navigate(['/']);
            });
        } else {
          alert("Erreur de création du mot de passe");
          alert('Verifiez que tous les champs son entré correctement');
        }
      },
      error => console.error('There was an error!', error));
  }

  setPassword(userId:number, oldPassword:string, newPassword:string, redirectTo:string | null) {

    const url = UtilsResources.baseUrl + '/user/'+userId+'/setpassword';

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    })

    this.httpClient.post<ResponseInterface>(url, {'oldPwd':oldPassword, 'pwd': newPassword}, {headers}).subscribe(
      data => {
        if (data.statusCode == "SUCCESS") {
          this.signInById(userId, newPassword, redirectTo);
        } else {
          console.error("Une erreur s'est produite");
        }
      },
      error => console.error('There was an error!', error));
  }
*/
  activateAccount() {

  }
}
