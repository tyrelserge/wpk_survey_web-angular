
export class Survey {
  surveyId: number | undefined;
  companyId: string | undefined;
  surveyName: string | undefined;
  surveySubject: string | undefined;
  surveyDescrib: string | undefined;
  surveyCreatedOn: string | undefined;
  surveyUpdatedOn: string | undefined;
  surveyStatus: string | undefined;
}

export class SurveyQuestion {
  surveyQuestionId: number | undefined;
  surveyId: number | undefined;
  surveyQuestionSubject: string | undefined;
  surveyQuestionContent: string | undefined;
  surveyQuestionFieldType: string | undefined;
  surveyQuestionDate: string | undefined;
  surveyQuestionStatus: string | undefined;
  suggestedResponse: SurveyResponse[] = new Array<SurveyResponse>();
}

export class SurveyResponse {
  surveyResponseId: number | undefined;
  surveyQuestionId: number | undefined;
  surveyResponseValue: string | undefined;
  surveyResponseDate: string | undefined;
  surveyResponseStatus: string | undefined;
}

export class GroupedResponses {
  surveyId: number | undefined;
  questions: Question[] = new Array<Question>();
}

export class Question {
  surveyQuestionId: number | undefined;
  surveyId: number | undefined;
  surveyQuestionSubject: string | undefined;
  surveyQuestionContent: string | undefined;
  surveyQuestionFieldType: string | undefined;
  surveyQuestionDate: string | undefined;
  surveyQuestionStatus: string | undefined;
  suggestions: SurveyResponse[] = new Array<SurveyResponse>();
  responses: SelectedResponses[] = new Array<SelectedResponses>()
}

export class SelectedResponses {
  surveyResponseId: number | undefined;
  surveyResponseDetails: string | undefined;
}

export class ShortUrl {
  shortCode: string | undefined;
  surveyId: number | undefined;
  domaine: string | undefined;
  fullUrl: string | undefined;
  createdOn: string | undefined;
}

