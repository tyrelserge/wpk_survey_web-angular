import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import {RouterModule, Routes} from "@angular/router";
import { NotFoundComponent } from './not-found/not-found.component';
import { SurveyQuestionComponent } from './moderator/survey-question/survey-question.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SurveyServices} from "./services/survey.services";
import {HttpClientModule} from "@angular/common/http";
import { SigninComponent } from './signin/signin.component';
import { SurveyComponent } from './survey/survey.component';
import { SurveyResourceComponent } from './moderator/survey-resource/survey-resource.component';
import { UnallowedComponent } from './signin/unallowed/unallowed.component';
import {GuardService} from "./services/guard.service";
import {AuthService} from "./services/auth.service";
import {UserService} from "./services/user.service";
import { DashboadComponent } from './moderator/dashboad/dashboad.component';
import {NgChartsModule} from "ng2-charts";
import { AnalysisTableComponent } from './moderator/dashboad/analysis-table/analysis-table.component';

const appRoutes: Routes = [
  { path: 'connexion', component: SigninComponent },
  { path: 'unallowed', component: UnallowedComponent },

  { path: '', component: SigninComponent },
  { path: 'survey/:surveyId/:action/:tamplate/:token/:country/lang/:lang', component: SurveyComponent },

  { path: 'dashboard', component: DashboadComponent },
  { path: 'dashboard/survey/:surveyId', component: AnalysisTableComponent },
  { path: 'survey/manager', component: SurveyResourceComponent },
  { path: 'survey/:surveyId/:option', component: SurveyQuestionComponent },
  { path: 'survey/:surveyId/:option/:action',  component: SurveyQuestionComponent },
  { path: 'survey/:surveyId/:option/:action/:questionId', component: SurveyQuestionComponent },

  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    NotFoundComponent,
    SurveyQuestionComponent,
    SigninComponent,
    SurveyComponent,
    SurveyResourceComponent,
    UnallowedComponent,
    DashboadComponent,
    AnalysisTableComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    FormsModule,
    HttpClientModule
],
  providers: [
    AuthService,
    GuardService,
    UserService,
    SurveyServices
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
