import tanok from 'tanok/tanok.js';
import { init, update, View } from './PhraseList';
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
  tanok(init(result), update, View, { container: div });
});
