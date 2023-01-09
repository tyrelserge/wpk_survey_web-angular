import {Survey, SurveyResponse} from "./survey.model";

export class Company {
  companyId: string | undefined;
  companyName: string | undefined;
  companyContact: string | undefined;
  companySite: string | undefined;
  companyDescrib: string | undefined;
  registerDate: string | undefined;
  imageFile: string | undefined;
  status: string | undefined;
  staff: Staff[] = new Array<Staff>();
  surveys: Survey[] = new Array<Survey>();
}

export class Staff {
  staffId: number | undefined;
  companyId: string | undefined;
  role: string | undefined;
  department: string | undefined;
  office: string | undefined;
  user: User | undefined;
  status: string | undefined;
}

export class User {
  userId: number | undefined;
  name: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  country: string | undefined;
  countryCode: string | undefined;
  city: string | undefined;
  address: string | undefined;
  language: string | undefined;
  registerDate: string | undefined;
}

export class Client {
  clientId: number | undefined;
  companyId: string | undefined;
  user: User | undefined;
  status: string | undefined;
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
}

export class SelectedResponses {
  tokenCode: string | undefined;
  surveyQuestionId: number | undefined;
  surveyResponseId: number | undefined;
  selectedResponseDetails: string | undefined;
}
