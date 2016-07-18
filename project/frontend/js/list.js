import tanok from 'tanok/src/tanok.js';
import { init, PhraseListDispatcher } from './PhraseList';
import View from './PhraseList/views/list.jsx';
import { fetchGraphData } from './utils';


fetchGraphData(`
    [{
        :phrases [
            :phraseId 
            :sourceLanguage 
            :sourceText 
            :translatedLanguage 
            :translatedText 
            :dateCreated 
            :dateAvailable 
            :progressStatus
        ]
    }]
`).then((result) => {
  const div = document.getElementById('list');
  tanok(init(result), (new PhraseListDispatcher).collect(), View, { container: div });
});
