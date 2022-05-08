
export class Survey {
  surveyId: number | undefined;
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

