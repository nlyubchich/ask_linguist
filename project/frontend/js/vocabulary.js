import { tanok } from 'tanok';
import { init, PhraseListDispatcher, PhraseList } from './Vocabulary';
import { fetchGraphData } from './utils';


fetchGraphData(`
  [{
    :phrases [
      :phraseId 
      :sourceText 
      :translatedText 
      :dateCreated 
      :dateAvailable 
      :progressStatus
    ]
  }]
`).then((result) => {
  tanok(init(result), (new PhraseListDispatcher).collect(), PhraseList);
});
