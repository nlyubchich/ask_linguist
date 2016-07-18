import l from 'lodash';
import { TanokDispatcher, on } from 'tanok/src/tanok.js';
import * as Rx from 'rx';
import { fetchPostJson } from '../utils';


function ajaxRemovePhrase(phraseId) {
  return Rx.Observable.just(1).do(() => {
    fetchPostJson('/dashboard/delete/', {
      phrase_id: phraseId,
    });
  });
}

function ajaxCreatePhrase(phrase, eventStream) {
  return Rx.Observable.just(1).do(() => {
    fetchPostJson('/dashboard/create/', {
      source_language: phrase.sourceLanguage,
      source_text: phrase.sourceText,
      translated_language: phrase.translatedLanguage,
      translated_text: phrase.translatedText,
    }).then((response) => {
      eventStream.send('savedNewPhrase', { phraseId: response.phrase_id });
    });
  });
}

function ajaxEditPhrase(phrase) {
  return Rx.Observable.just(1).do(() => {
    fetchPostJson('/dashboard/edit/', {
      phrase_id: phrase.phraseId,
      source_language: phrase.sourceLanguage,
      source_text: phrase.sourceText,
      translated_language: phrase.translatedLanguage,
      translated_text: phrase.translatedText,
    });
  });
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
      effect = ajaxRemovePhrase.bind(null, phraseId);
    }
    return [state, effect];
  }

  @on('editPhrase')
  editPhrase({ phraseId }, state) {
    state.activePhrase = l.findIndex(state.phrases, { phraseId });
    return [state];
  }

  @on('savePhrase')
  savePhrase(params, state) {
    let effect;
    const phrase = state.phrases[state.activePhrase];
    state.activePhrase = null;
    if (phrase.phraseId === 0) {
      effect = ajaxCreatePhrase.bind(null, phrase);
      state.toggledAddNewPhrase = false;
    } else {
      effect = ajaxEditPhrase.bind(null, phrase);
    }
    return [state, effect];
  }

  @on('toggledAddNewPhrase')
  toggledAddNewPhrase(params, state) {
    const lastPhrase = state.phrases[0];
    state.phrases.unshift({
      phraseId: 0,
      sourceLanguage: lastPhrase ? lastPhrase.sourceLanguage : '',
      sourceText: '',
      translatedLanguage: lastPhrase ? lastPhrase.translatedLanguage : '',
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

  // oh my...
  @on('editedSourceLanguage')
  editedSourceLanguage({ text }, state) {
    state.phrases[state.activePhrase].sourceLanguage = text;
    return [state];
  }
  @on('editedSourceText')
  editedSourceText({ text }, state) {
    state.phrases[state.activePhrase].sourceText = text;
    return [state];
  }
  @on('editedTranslatedLanguage')
  editedTranslatedLanguage({ text }, state) {
    state.phrases[state.activePhrase].translatedLanguage = text;
    return [state];
  }
  @on('editedTranslatedText')
  editedTranslatedText({ text }, state) {
    state.phrases[state.activePhrase].translatedText = text;
    return [state];
  }
}
