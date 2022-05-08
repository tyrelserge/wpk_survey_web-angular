import {SurveyResponse} from "./survey.model";

export class Staff {
  staffId: number | undefined;
  office: string | undefined;
  department: string | undefined;
  status: string | undefined;
  client: Client | undefined;
}

export class Client {

  clientId: number | undefined;
  clientName: string | undefined;
  clientEmail: string | undefined;
  clientPhone: string | undefined;
  clientCountry: string | undefined;
  clientCountryCode: string | undefined;
  clientCity: string | undefined;
  clientAddress: string | undefined;
  clientLanguage: string | undefined;
  registerDate: string | undefined;
  clientStatus: string | undefined;
  clientSurveys: ClientSurvey[] = new Array<ClientSurvey>();
}

export class ClientSurvey {
  tokenCode: string | undefined;
  surveyId: number | undefined;
  clientId: number | undefined;
  validityDate: string | undefined;
  updatedOn: string | undefined;
  clientSurveyStatus: string | undefined;
  selectedResponses: SelectedResponses[] = new Array<SelectedResponses>();
  //surveyResponses: SurveyResponse[] = new Array<SurveyResponse>();
}

class SelectedResponses {
  tokenCode: string | undefined;
  surveyQuestionId: number | undefined;
  surveyResponseId: number | undefined;
  selectedResponseDetails: string | undefined;
}
