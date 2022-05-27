function diagramJsInit(uri) {

  baseUrl = uri;
  surveyId = 0;

  this.surveyDiagram();
  this.interactionDiagram();
  this.interactionWeeklyDiagram();
  //this.questionsDiagram();

  let interactionsurvey = document.querySelector('#interaction-survey');
  interactionsurvey ? interactionsurvey.addEventListener('change', this.interactionDiagram): null;

  let weeklysurvey = document.querySelector('#weekly-survey');
  weeklysurvey ? weeklysurvey.addEventListener('change', this.interactionWeeklyDiagram): null;

}

surveyDiagram = async function() {

  let surveysList = [];
  let surveyPublished = [];
  let surveyCompleted = [];

  let svRes = await fetch(baseUrl+'/surveys');
  if (svRes.ok) {
    let data = await svRes.json();
      if (data.statusCode==='SUCCESS') {
        let surveys = data.response;
        for (let survey of surveys) {
          if (survey.surveyStatus !== 'deleted') {
            surveysList.push(survey);
            if (survey.surveyStatus === 'published' || survey.surveyStatus === 'completed') {
              surveyPublished.push(survey);
              if (survey.surveyStatus==='completed') {
                surveyCompleted.push(survey);
              }
            }
          }
        }
      }
  } else {
    console.error('Une erreur s\'est produite');
  }

  surveychart = c3.generate({
    bindto: '#survey-chart',
    data: {
      columns: [
        ['Publié', ((surveyPublished.length * 100)/surveysList.length) ],
        ['Terminé', ((surveyCompleted.length * 100)/surveysList.length)]
      ],
      type: 'gauge'
    }
  });

}

interactionDiagram = async function () {

  let interactionsurvey = document.querySelector('#interaction-survey');
  surveyId = interactionsurvey ? interactionsurvey.value : 0;

  if (surveyId!=0) {
    questionsDiagram(surveyId);
  }

  let sending = [];
  let completedInteraction = [];
  let waitingInteraction = [];

  let clRes = await fetch(baseUrl + '/survey/'+ surveyId +'/clients');
  if (clRes.ok) {
    let data = await clRes.json();
    if (data.statusCode==='SUCCESS') {
      sending = data.response;
      for (let account of sending) {
        let responses = account.selectedResponses;
        if (responses.length!==0 && account.clientSurveyStatus==='completed') {
          completedInteraction.push(account);
        } else {
          waitingInteraction.push(account);
        }
      }
    }
  } else {
    console.error('Une erreur s\'est produite');
  }

  let title = "";
  if (sending.length > 1) {
    title = "Publier à "+ sending.length +" personnes";
  } else {
    title = "Publier à "+ sending.length +" personne";
  }

  interactionchart = c3.generate({
    bindto: '#interaction-chart',
    data: {
      columns: [
        ['En attente', waitingInteraction.length],
        ['Terminé', completedInteraction.length],
      ],
      type : 'donut'
    },
    donut: {
      title: title
    }
  });


  async function questionsDiagram(surveyId) {

    /*
    let surveyPublished = [];
    let surveyCompleted = [];

    let svRes = await fetch(baseUrl + '/surveys');
    if (svRes.ok) {
      let data = await svRes.json();
      if (data.statusCode === 'SUCCESS') {
        let surveys = data.response;
        for (let survey of surveys) {
          if (survey.surveyStatus !== 'deleted') {
            if (survey.surveyStatus === 'published' || survey.surveyStatus === 'completed') {
              surveyPublished.push(survey);
              if (survey.surveyStatus === 'completed') {
                surveyCompleted.push(survey);
              }
            }
          }
        }
      }
    } else {
      console.error('Une erreur s\'est produite');
    }
  */

    // for (let survey of surveyPublished) {

    let survey;
    let questioncharts = document.getElementById("survey-question-charts");

    let svRes = await fetch(baseUrl + '/survey/' + surveyId);
    if (svRes.ok) {
      let data = await svRes.json();
      if (data.statusCode === 'SUCCESS') {
        survey = data.response;
      }
    }

    let qRes = await fetch(baseUrl + '/survey/' + surveyId + '/responses');
    if (qRes.ok) {
      let data = await qRes.json();
      if (data.statusCode === 'SUCCESS') {

        let dtitle = document.createElement('h4');
        dtitle.style.cssText = "; text-decoration: underline; font-variant-caps: small-caps; " +
          " margin-top: 20px; margin-bottom: 20px;  color: #939393;"
        dtitle.textContent = survey.surveyName;
        questioncharts.innerHTML = "";
        questioncharts.append(dtitle);

        let published = data.response;
        let questions = published.questions;

        if (questions.length!==0) {

          let recaplink = document.createElement('a')
          recaplink.textContent = 'Afficher dans un tableau';
          recaplink.setAttribute('href', './#/dashboard/survey/' + survey.surveyId)
          //recaplink.setAttribute('routerLink', '/dashboard/survey/' + survey.surveyId)
          recaplink.className = 'btn btn-outline-secondary';
          recaplink.style.cssText = "; float: right"
          dtitle.append(recaplink);

          let dblocItems = document.createElement('div');
          dblocItems.style.cssText = "; display: flex; flex-direction: row; flex-wrap: wrap; justify-content: space-between;"

          for (let j=0; j<questions.length; j++) {

            let columns = [];
            let question = questions[j];

            if (question.surveyQuestionStatus === 'active' && question.surveyQuestionFieldType!=='input') {
              let ditem = document.createElement('div');
              ditem.style.cssText = "; background: #ffffff; box-shadow: 0px 1px 4px #cec6c6; margin: 10px 0; padding: 10px;"

              let ditemTitle = document.createElement('h6');
              ditemTitle.textContent = question.surveyQuestionContent;
              ditem.append(ditemTitle);

              let dchart = document.createElement('div');
              dchart.style.cssText = "; min-width: 240px"
              dchart.id = 'survey' + survey.surveyId + 'question' + j + 1;

              ditem.append(dchart);
              dblocItems.append(ditem);
              questioncharts.append(dblocItems);

              let suggestions = question.suggestions;
              let responses = question.responses;

              for (let i=0; i<suggestions.length; i++) {
                let count = 0;
                if (question.surveyQuestionFieldType!=='switch') {
                  for(let k=0; k<responses.length; k++) {
                    if (suggestions[i].surveyResponseId===responses[k].surveyResponseId) {
                      if (responses[k].surveyResponseDetails==='true')
                        count +=1;
                    }
                  }
                  columns.push([suggestions[i].surveyResponseValue, count]);
                } else {
                  let countTrue = 0;
                  let countFalse = 0;
                  for(let k=0; k<responses.length; k++) {
                    if (suggestions[i].surveyResponseId===responses[k].surveyResponseId) {
                      if (responses[k].surveyResponseDetails === 'true') {
                        countTrue += 1;
                      } else {
                        countFalse += 1;
                      }
                    }
                  }
                  columns.push(['Oui - ' + suggestions[i].surveyResponseValue, countTrue]);
                  columns.push(['Non - ' + suggestions[i].surveyResponseValue, countFalse]);
                }
              }

              c3.generate({
                bindto: dchart,
                data: {
                  columns: columns,
                  type: 'bar'
                }
              });

            }
          }
        } else {

          let dempty = document.createElement('div');
          dempty.textContent = 'Aucun contenu publié';
          dempty.style.cssText ="; color: #939393; text-align: center; border: 1px solid #e1e1e1; " +
            " border-radius: 2px; background: #fcfcfc; padding: 10px;"
          questioncharts.append(dempty);
        }
      }
    } else {
      console.error('Une erreur s\'est produite');
    }
    //}

  }


}

interactionWeeklyDiagram = async function () {

  let date = new Date();
  let formattedDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();

  let weeklysurvey = await document.querySelector('#weekly-survey');
  let pickdate = weeklysurvey ? weeklysurvey.value : formattedDate;

  weeklydata = [
    ['x', 'Lundi', 'Mardi', 'Mercredi', 'jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
  ]

  let svRes = await fetch(baseUrl+'/surveys');
  if (svRes.ok) {
    let data = await svRes.json();
    if (data.statusCode==='SUCCESS') {
      let surveys = data.response;
      for (let survey of surveys) {
          if (survey.surveyStatus === 'published') {
              let weeklyres = await fetch(baseUrl + '/survey/'+ survey.surveyId +'/clients/weekly/'+pickdate+'');
              if (weeklyres.ok) {
                let data = await weeklyres.json();
                if (data.statusCode==='SUCCESS') {
                  let dailyData = data.response;
                  weeklydata.push([survey.surveyName,
                    dailyData.Monday ? dailyData.Monday.length: null,
                    dailyData.Tuesday ? dailyData.Tuesday.length: null,
                    dailyData.Wednesday ? dailyData.Wednesday.length: null,
                    dailyData.Thursday ? dailyData.Thursday.length: null,
                    dailyData.Friday ? dailyData.Friday.length: null,
                    dailyData.Saturday ? dailyData.Saturday.length: null,
                    dailyData.Sunday ? dailyData.Sunday.length: null
                  ])
                }
              } else {
                console.error('Une erreur s\'est produite');
              }
          }
      }
    }
  } else {
    console.error('Une erreur s\'est produite');
  }
  weeklychart = c3.generate({
    bindto: '#weekly-chart',
    data: {
      x : 'x',
      columns: weeklydata,
      type: 'spline'
    },
    axis: {
      x: {
        type: 'category' // this needed to load string x value
      }
    }
  });
}

