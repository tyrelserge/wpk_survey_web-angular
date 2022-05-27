import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {Staff} from "../../../models/user.model";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {SurveyServices} from "../../../services/survey.services";
import {Survey} from "../../../models/survey.model";
import {UtilsResources} from "../../../services/utils.resources";

declare const diagramJsInit: any;

@Component({
  selector: 'app-dashboad',
  templateUrl: './dashboad.component.html',
  styleUrls: ['./dashboad.component.css']
})
export class DashboadComponent implements OnInit, AfterViewInit {

  today = new Date();

  user: Staff = new Staff();
  userId: number | undefined;
  surveyList: Survey[] = new Array<Survey>();
  surveyPublished: Survey[] = new Array<Survey>();
  surveyCompleted: Survey[] = new Array<Survey>();

  surveyId: number | undefined;

  constructor(private elementRef: ElementRef,
              private authService: AuthService,
              private router: Router,
              private surveyServive: SurveyServices) { }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#f9f9f9';
  }

  ngOnInit(): void {

    diagramJsInit(UtilsResources.baseUrl);

    if (!this.authService.checkAuth()) this.router.navigate(['/']);

    //this.authService.isAuth = this.authService.checkAuth();
    //if (!this.authService.isAuth) this.router.navigate(['/']);
    // @ts-ignore
    this.user = <Staff>(JSON.parse(localStorage.getItem('user')));
    this.userId = this.user.staffId;

    this.surveyServive.getSurveysList((data) => {
      for (let survey of data) {
        if (survey.surveyStatus!='deleted') {
          this.surveyList.push(survey);
          if (survey.surveyStatus=='published' || survey.surveyStatus=='completed') {
            this.surveyPublished.push(survey);
            if (survey.surveyStatus=='completed') {
              this.surveyCompleted.push(survey);
            }
          }
        }
      }
    });

  }

}
