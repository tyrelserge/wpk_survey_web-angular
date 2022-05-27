import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";
import {Staff} from "../models/user.model";

declare const acreenInit: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {

    acreenInit();

    this.authService.isAuth = this.authService.checkAuth();
    if (this.authService.isAuth) this.router.navigate(['/dashboard']);
  }

  onSubmitConnexion(form: NgForm) {
    this.authService.signIn(form.value['username'], form.value['password'], ()=>{
      this.router.navigate(['/dashboard']);
    });
  }

  onSubmitSignup(signupForm: NgForm) {
    this.userService.createUser(signupForm, data => {
      this.router.navigate(['/dashboard']);
    });
  }
}
