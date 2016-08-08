import { tanok } from 'tanok';
import { init, PhraseListDispatcher, PhraseList } from './Vocabulary';
import { fetchGraphData } from './utils';
import Baz from 'bazooka';

function initVocabulary(node) {
  const language = node.dataset.language;
  fetchGraphData(`
    [{
      ( 
        :phrases {
          :language ${language}
        } 
      ) [
        :phraseId 
        :sourceText 
        :translatedText 
        :dateCreated 
        :dateAvailable 
        :progressStatus
      ]
    }]
  `).then((result) => {
    tanok(
      init(result, language),
      (new PhraseListDispatcher).collect(),
      PhraseList,
      { container: node }
    );
  });
}

Baz.register({
  vocabulary: initVocabulary,
});

Baz.refresh();
