import { tanok } from 'tanok';
import { init, QuestionnaireDispatcher, Questionnaire } from './Questionnaire';
import { fetchGraphData } from './utils';


fetchGraphData(`
  [{
    (
      :phrases-for-test {
        :limit 3
      }
    ) [
      :sourceText
      :translatedText
    ]
  }]
`).then((result) => {
  tanok(init(result), (new QuestionnaireDispatcher).collect(), Questionnaire);
});
