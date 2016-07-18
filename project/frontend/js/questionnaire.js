import tanok from 'tanok/src/tanok.js';
import { init, update, View } from './Questionnaire';
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
      tanok(init(result), update, View, { container: div });
    });
