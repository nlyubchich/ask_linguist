import { tanok } from 'tanok';
import { init, PhraseListDispatcher, PhraseList } from './Vocabulary';
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
  tanok(init(result), (new PhraseListDispatcher).collect(), PhraseList);
});
