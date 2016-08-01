import * as l from 'lodash';
import * as Rx from 'rx';
import { TanokDispatcher, on } from 'tanok';
import { fetchPostJson } from '../utils';


function ajaxRemovePhrase(phraseId) {
  return () => {
    fetchPostJson('/dashboard/delete/', {
      phrase_id: phraseId,
    });
    return Rx.Observable.empty();
  };
}

function ajaxCreatePhraseEffect(language, { sourceText, translatedText }) {
  return (stream) => {
    fetchPostJson('/dashboard/create/', {
      language,
      source_text: sourceText,
      translated_text: translatedText,
    }).then((response) => {
      stream.send('savedNewPhrase', { phraseId: response.phrase_id });
    });
    return Rx.Observable.empty();
  };
}

function ajaxEditPhraseEffect(phrase) {
  return () => {
    fetchPostJson('/dashboard/edit/', {
      phrase_id: phrase.phraseId,
      source_text: phrase.sourceText,
      translated_text: phrase.translatedText,
    });
    return Rx.Observable.empty();
  };
}


export class PhraseListDispatcher extends TanokDispatcher {
  @on('removePhrase')
  removePhrase(_, state) {
    let effect;
    const phraseId = state.phrases[state.activePhrase].phraseId;
    const phraseIndex = state.activePhrase;
    state.activePhrase = null;
    l.pullAt(state.phrases, phraseIndex);
    if (phraseId === 0) {
      state.toggledAddNewPhrase = false;
    } else {
      effect = ajaxRemovePhrase(phraseId);
    }
    return [state, effect];
  }

  @on('editPhrase')
  editPhrase({ phraseId }, state) {
    state.activePhrase = l.findIndex(state.phrases, { phraseId });
    return [state];
  }

  @on('savePhrase')
  savePhrase(_, state) {
    let effect;
    const phrase = state.phrases[state.activePhrase];
    state.activePhrase = null;
    if (phrase.phraseId === 0) {
      effect = ajaxCreatePhraseEffect(
        state.language, phrase.sourceText, phrase.translatedText
      );
      state.toggledAddNewPhrase = false;
    } else {
      effect = ajaxEditPhraseEffect(phrase);
    }
    return [state, effect];
  }

  @on('toggledAddNewPhrase')
  toggledAddNewPhrase(_, state) {
    state.phrases.unshift({
      phraseId: 0,
      sourceText: '',
      translatedText: '',
      progressStatus: '0%',
    });
    state.activePhrase = 0;
    state.toggledAddNewPhrase = true;
    return [state];
  }

  @on('savedNewPhrase')
  savedNewPhrase({ phraseId }, state) {
    state.phrases[0].phraseId = phraseId;
    state.activePhrase = null;
    state.toggledAddNewPhrase = false;
    return [state];
  }

  @on('editedSourceText')
  editedSourceText({ text }, state) {
    state.phrases[state.activePhrase].sourceText = text;
    return [state];
  }
  @on('editedTranslatedText')
  editedTranslatedText({ text }, state) {
    state.phrases[state.activePhrase].translatedText = text;
    return [state];
  }
}
