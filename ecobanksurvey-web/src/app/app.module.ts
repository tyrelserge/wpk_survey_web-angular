import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import {RouterModule, Routes} from "@angular/router";
import { NotFoundComponent } from './not-found/not-found.component';
import { SurveyQuestionComponent } from './moderator/survey-question/survey-question.component';

const appRoutes:Routes = [
  //{ path: 'connexion', component: SigninComponent },
  //{ path: 'inscription', component: SignupComponent },
  //{ path: 'unallowed', component: UnallowedComponent },

  { path: 'moderator/questions', component: SurveyQuestionComponent},

  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    NotFoundComponent,
    SurveyQuestionComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
