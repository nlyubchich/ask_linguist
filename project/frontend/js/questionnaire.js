import { tanok } from 'tanok';
import { init, update, Questionnaire } from './Questionnaire';
import { fetchGraphData } from './utils';


fetchGraphData(`
  [{
    (
      :phrases-for-test {
        :limit 50
      }
    ) [
      :sourceText
      :translatedText
    ]
  }]
`)
    .then((result) => {
      const div = document.getElementById('test');
      tanok(init(result), update, Questionnaire, { container: div });
    });
