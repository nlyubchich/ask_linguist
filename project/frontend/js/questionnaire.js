import tanok from 'tanok/tanok.js';
import { init, update, View } from './Questionnaire';
import { fetchGraphData, fetchGetJson } from './utils';


// fetchGetJson('/questionnaire/English-French/')
//     .then((result) => {
//       const div = document.getElementById('test');
//       tanok(init(result), update, View, { container: div });
//     });


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
