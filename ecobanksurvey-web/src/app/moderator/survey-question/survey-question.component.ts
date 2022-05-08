import { Component, OnInit } from '@angular/core';
import {FormGroup, NgForm} from "@angular/forms";
import {SurveyServices} from "../../../services/survey.services";
import {Survey, SurveyQuestion, SurveyResponse} from "../../../models/survey.model";
import {ActivatedRoute, Router} from "@angular/router";
import readXlsxFile from "read-excel-file";
// @ts-ignore
import Any = jasmine.Any;
import {Client, ClientSurvey, Staff} from "../../../models/user.model";
import {AuthService} from "../../../services/auth.service";
import {UtilsResources} from "../../../services/utils.resources";

@Component({
  selector: 'app-survey-question',
  templateUrl: './survey-question.component.html',
  styleUrls: ['./survey-question.component.css']
})
export class SurveyQuestionComponent implements OnInit {

  user: Staff | undefined;
  baseUrl: string | undefined;

  fieldTitle: string | undefined;
  previewText: string | undefined;
  checked: boolean = true;

  isEmptyQuestionList: boolean = true;
  isEmptyQuestionField: boolean = true;
  isQuestionSelected: boolean = false;

  selfSurveyManager: boolean = true;

  questionsList: SurveyQuestion[] = new Array<SurveyQuestion>();
  selectedQuestion: SurveyQuestion = new SurveyQuestion();
  suggestedResponse: SurveyResponse[] = new Array<SurveyResponse>();

  surveyId: number | undefined;
  questionId: number | undefined;
  survey: Survey | undefined;

  onUpdateSurvey: boolean = false;
  onUploadAdsress: boolean = false;
  onPublishSurvey: boolean = false;

  clientRecord: Any = [];
  clientList: Client[] = new Array<Client>()

  clientSurveyList: ClientSurvey[] = new Array<ClientSurvey>();

  today = new Date();
  expirationToken: number | undefined;

  allClient: Client[] = new Array<Client>();
  userId: number | undefined;
  previewToken: string | undefined;

  uploaded: boolean = false;

  displayBox: boolean = false;
  bxTitle: string | undefined;
  bxContent: string | undefined;
  bxAction: string | undefined;
  affected: string | undefined;

  constructor(private authService: AuthService,
              private surveyServices: SurveyServices,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {

    if (!this.authService.checkAuth()) this.router.navigate(['/']);

    //this.authService.isAuth = this.authService.checkAuth();
   // if (!this.authService.isAuth) this.router.navigate(['/']);
    // @ts-ignore
    this.user = <Staff>(JSON.parse(localStorage.getItem('user')));
    this.userId = this.user.staffId;
    this.baseUrl = document.location.hostname;

    let self = this;
    this.expirationToken = 7;

    this.fieldTitle = "Ajouter une question";
    this.previewText = "";

    let option: any = this.route.snapshot.params['option'];
    let action: any = this.route.snapshot.params['action'];
    this.surveyId = this.route.snapshot.params['surveyId'];
    this.questionId = this.route.snapshot.params['questionId'];

    this.loadQuestionsData();

    this.surveyServices.getAllClients((data) => {
      this.allClient = data;
    });

    switch (option) {

      case 'edit' :
        this.selfSurveyManager = true;
        this.onUploadAdsress = false;
        this.onPublishSurvey = false;
        this.onUpdateSurvey = true;
        break;

      case 'address' :
        this.selfSurveyManager = true;
        this.onUploadAdsress = true;
        this.onPublishSurvey = false;
        this.onUpdateSurvey = false;
        //setTimeout(function () {
          //self.loadSurveyClientList(self.surveyId);
        //}, 1000);
        break;

      case 'publish' :
        this.selfSurveyManager = true;
        this.onUploadAdsress = false;
        this.onPublishSurvey = true;
        this.onUpdateSurvey = false;
        setTimeout(function () {
          self.loadSurveyClientList(self.surveyId);
        }, 1000);
        break;

      case 'question' :
        this.onUpdateSurvey = false;
        this.questionManager(action);
        break;

      default:
        this.router.navigate(['/not-found'])
        break;
    }

  }

  loadQuestionsData() {

    this.surveyServices.getSurvey(this.surveyId, (data) => {
      if (data.surveyStatus!='deleted') {
        this.survey = data;
        this.surveyServices.getClientSurveyResponsesList(this.surveyId, (data) => {
          this.clientSurveyList = data;
          for (let previewSurvey of data) {
            if (this.userId==previewSurvey.clientId)
              this.previewToken = previewSurvey.tokenCode;
          }
        });
      } else {
        this.router.navigate(['/']);
      }
    });

    this.surveyServices.getQuestionsList(this.surveyId,(data) => {

      for (let question of data) {
        if (question.surveyQuestionStatus != 'deleted')
          this.questionsList.push(question);
      }

      if (this.questionsList.length!=0)
        this.isEmptyQuestionList=false;

      const surveyQuestionId = this.route.snapshot.params['questionId'];
      if (surveyQuestionId) {
        this.onEditeQuestionItem(surveyQuestionId);
      }

    });
  }

  fields() {
    if (this.previewText && this.previewText!="") {
      this.isEmptyQuestionField = false;
    } else {
      this.isEmptyQuestionField = true;
    }
  }

  onQuestionSubmit(questionForm: NgForm) {
    this.surveyServices.saveSurveyQuestion(questionForm, (data) => {
      let self = this;
      setTimeout(function () {
        self.questionsList.push(data);
      }, 1000)


      this.selectedQuestion = data;
      this.suggestedResponse = data.suggestedResponse;

      this.bxTitle = "Suggestion de reponse";
      this.bxContent = "Ajouter des suggestions de reponse";
      this.bxAction = "go";
      this.displayBox = true;
      this.affected = 'suggestion';

      questionForm.controls['question'].reset();
      questionForm.controls['surveysubject'].reset();

    });
  }

  onResponseSubmit(form: NgForm) {
    this.surveyServices.saveResponseSuggestion(form, (data: SurveyResponse) => {
      if (this.suggestedResponse==null) {
        this.suggestedResponse = [data];
      } else {
        this.suggestedResponse.push(data);
      }
      form.controls['responsesuggestion'].reset();
    });
  }

  onEditeQuestionItem(surveyQuestionId: number | undefined) {
    for (let question of this.questionsList) {
      if (question.surveyQuestionId==surveyQuestionId) {
        this.selectedQuestion = question;
        this.suggestedResponse = question.suggestedResponse;
        this.previewText = this.selectedQuestion.surveyQuestionContent;
        this.isQuestionSelected = true;
        this.fieldTitle = "Ajouter des suggestions";
        this.fields();
      }
    }
  }

  onCreateQuestion(surveyId: number | undefined) {
    this.selfSurveyManager = false;
    this.onUpdateSurvey = false;
    this.router.navigate(['/survey/'+ surveyId +'/question/new']);
  }

  questionManager(action: string | undefined) {

    switch (action) {

      case 'new':
        this.selfSurveyManager = false;
        break;

      case 'edit':
        this.selfSurveyManager = false;
        if (this.questionId==undefined) {
          this.router.navigate(['/survey/'+ this.surveyId +'/question/new']);
        }
        break;

      default:
        this.selfSurveyManager = true;
        break;
    }
  }

  onDeleteSurvey(surveyId: number | undefined) {
    this.bxTitle = 'Suppresion';
    this.bxContent = 'Voulez-vous supprimer ce survey ?'
    this.displayBox = true;
    this.bxAction = 'delete';
    this.affected = 'survey';
  }

  onEditSurvey(surveyId: number | undefined) {
    this.selfSurveyManager = true;
    this.onUploadAdsress = false;
    this.onPublishSurvey = false;
    this.onUpdateSurvey = true;
    this.router.navigate(['/survey/'+ surveyId +'/edit']);
  }

  onClicUploadAdsress(surveyId: number | undefined) {
    this.selfSurveyManager = true;
    this.onUploadAdsress = true;
    this.onPublishSurvey = false;
    this.onUpdateSurvey = false;
    this.loadSurveyClientList(surveyId);
    this.router.navigate(['/survey/'+ surveyId +'/address']);
  }

  onClicPublishSurvey(surveyId: number | undefined) {
    this.selfSurveyManager = true;
    this.onUploadAdsress = false;
    this.onPublishSurvey = true;
    this.onUpdateSurvey = false;
    this.loadSurveyClientList(surveyId);
    this.router.navigate(['/survey/'+ surveyId +'/publish']);
  }

  onSurveyUpdateSubmit(surveyForm: NgForm) {
    this.surveyServices.updateServey(this.surveyId, surveyForm, (data) => {
      this.survey = data;
      this.loadQuestionsData();
      this.onUpdateSurvey = false;
      this.router.navigate(['/survey/'+ this.surveyId +'/question']);
    });
  }

  onQuestionDelete() {
    this.bxTitle = 'Suppresion';
    this.bxContent = 'Voulez-vous supprimer cette question ?'
    this.displayBox = true;
    this.bxAction = 'delete';
    this.affected = 'question';
  }

  // @ts-ignore
  excelReader(e) {

    let fileReaded = e.target.files[0];
    let type = e.target.files[0].name.split('.').pop();
    this.clientRecord = [];

    const schema = {
      'Nom': {
        prop: 'name',
        type: String,
        required: false
      },
      'E-mail': {
        prop: 'email',
        type: String,
        required: false
      },
      'Mobile': {
        prop: 'mobile',
        type: String,
        required: false
      },
      'Pays': {
        prop: 'country',
        type: String,
        required: false
      },
      'Code': {
        prop: 'countryCode',
        type: String,
        required: false
      },
      'Ville': {
        prop: 'city',
        type: String,
        required: false
      },
      'Adresse': {
        prop: 'address',
        type: String,
        required: false
      },
      'Langue': {
        prop: 'language',
        type: String,
        required: false
      }

    }

    readXlsxFile(e.target.files[0], { schema }).then(({ rows, errors }) => {
      this.clientRecord = rows;
    })

  }

  pickupDate(token_date: NgForm) {
    let selectedDate = new Date(token_date.value['to']);
    let diff = selectedDate.getTime() - this.today.getTime();
    let days = Math.round(Number(diff/(1000 * 60 * 60 * 24)));
    this.expirationToken = days;
  }

  onUploadAddressList() {
    this.uploaded = true;
    for (let client of this.clientRecord) {
      this.surveyServices.saveClient(client, this.expirationToken, (data) => {
        this.clientList.push(data);
        this.allClient.push(data);
        //this.surveyServices.createSurveyClient(data.clientId, this.surveyId, this.expirationToken, (data2) => {
          //this.clientSurveyList.push(data2);
        //});
      });
    }
  }

  onGenerateClientLink(surveyId: number | undefined) {

    let self = this;

    for (let i=0; i<this.allClient.length; i++) {
      this.surveyServices.createSurveyClient(this.allClient[i].clientId, surveyId, this.expirationToken, (data) => {
        this.clientSurveyList.push(data);
      });

      if (i>=this.allClient.length -1) {
          setTimeout(function () {
            self.onClicPublishSurvey(surveyId);
          }, 2000)
      }
    }
  }

  loadSurveyClientList(surveyId: number | undefined) {
    this.surveyServices.getClientSurveyResponsesList(surveyId, (data: ClientSurvey[]) => {
      this.clientSurveyList = data;
      this.clientList = new Array<Client>();
      for (let clientSurvey of data) {
        for (let client of this.allClient) {
          if (clientSurvey.clientId==client.clientId)   //  && client.clientId!=this.userId
            this.clientList.push(client);
        }
      }

      console.log(this.clientList[11])
      console.log(this.clientSurveyList[11])
    });
  }

  onCancel() {
    this.displayBox = false;
    this.bxTitle = undefined;
    this.bxContent = undefined;
  }

  onConfirm() {

    if (this.bxAction=='delete') {

      switch (this.affected) {
        case 'survey' :
          this.surveyServices.deleteSurvey(this.surveyId, (data) => {
            this.router.navigate(['/survey/manager']);
          });
          break;

        case 'question':
          this.surveyServices.deleteSurveyQuestion(this.questionId, (data) => {
            this.router.navigate(['/survey/' + this.surveyId + '/question']);
          });
          break;
      }

    } else  if (this.bxAction=='go') {

      switch (this.affected) {
        case 'suggestion' :
          this.fieldTitle = "Ajouter des suggestions";
          this.previewText = this.selectedQuestion.surveyQuestionContent;
          this.isQuestionSelected = true;
          this.loadQuestionsData();
          this.router.navigate(['/survey/'+ this.selectedQuestion.surveyId + '/question/edit/'+this.selectedQuestion.surveyQuestionId]);
          break;

      }
    }

    this.displayBox = false;
    this.bxTitle = undefined;
    this.bxContent = undefined;
  }

  onPublishClientMessage(p: NgForm) {
    for (let i=0; i<this.clientSurveyList.length; i++) {
      this.surveyServices.publishClientSurveyMessage(p,
        this.clientSurveyList[i].tokenCode,
        this.clientList[i].clientCountry,
        this.clientList[i].clientLanguage, (data)=>{
          p.resetForm();
        });
    }
  }
}
