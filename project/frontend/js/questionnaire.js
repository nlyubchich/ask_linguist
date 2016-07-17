import tanok from 'tanok/tanok.js';
import { init, update, View } from './Questionnaire';
import { fetchGetJson } from './utils';


fetchGetJson('/questionnaire/English-French/')
    .then((result) => {
      const div = document.getElementById('test');
      tanok(init(result), update, View, { container: div });
    });
