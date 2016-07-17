import l from 'lodash';
import { actionIs } from 'tanok/helpers.js';
import * as Rx from 'rx';
import { fetchPostJson } from '../utils';


function ajaxRemovePhrase(phraseId) {
  return Rx.Observable.just(1).do(() => {
    fetchPostJson('/dashboard/delete/', {
      phrase_id: phraseId,
    });
  });
}

function ajaxCreatePhrase(state, eventStream) {
  return Rx.Observable.just(1).do(() => {
    const phrase = l.find(state.phrases, (item) => item.phraseId === 0);

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

function ajaxEditPhrase(phraseId, state) {
  return Rx.Observable.just(1).do(() => {
    const phrase = l.find(state.phrases, (item) => item.phraseId === phraseId);

    fetchPostJson('/dashboard/edit/', {
      phrase_id: phraseId,
      source_language: phrase.sourceLanguage,
      source_text: phrase.sourceText,
      translated_language: phrase.translatedLanguage,
      translated_text: phrase.translatedText,
    });
  });
}


export const update = [
    ['init', (params, state) => [state]],
    [[actionIs('removePhrase')], (params, state) => {
      const phraseId = state.phrases[state.activePhrase].phraseId;
      const phraseIndex = state.activePhrase;
      state.activePhrase = null;
      l.pullAt(state.phrases, phraseIndex);
      let effect;
      if (phraseId === 0) {
        state.toggledAddNewPhrase = false;
      } else {
        effect = ajaxRemovePhrase.bind(null, phraseId);
      }
      return [state, effect];
    }],
    [[actionIs('editPhrase')], ({ payload: { phraseId } }, state) => {
      state.activePhrase = l.findIndex(state.phrases, { phraseId });
      return [state];
    }],
    [[actionIs('savePhrase')], (params, state) => {
      const phraseId = state.phrases[state.activePhrase].phraseId;
      state.activePhrase = null;

      let effect;
      if (phraseId === 0) {
        effect = ajaxCreatePhrase;
        state.toggledAddNewPhrase = false;
      } else {
        effect = ajaxEditPhrase.bind(null, phraseId);
      }
      return [state, effect];
    }],

    [[actionIs('toggledAddNewPhrase')], (params, state) => {
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
    }],

    [[actionIs('savedNewPhrase')], ({ payload: { phraseId } }, state) => {
      state.phrases[0].phraseId = phraseId;
      state.activePhrase = null;
      state.toggledAddNewPhrase = false;
      return [state];
    }],

    // oh my...
    [[actionIs('editedSourceLanguage')], ({ payload: { text } }, state) => {
      state.phrases[state.activePhrase].sourceLanguage = text;
      return [state];
    }],
    [[actionIs('editedSourceText')], ({ payload: { text } }, state) => {
      state.phrases[state.activePhrase].sourceText = text;
      return [state];
    }],
    [[actionIs('editedTranslatedLanguage')], ({ payload: { text } }, state) => {
      state.phrases[state.activePhrase].translatedLanguage = text;
      return [state];
    }],
    [[actionIs('editedTranslatedText')], ({ payload: { text } }, state) => {
      state.phrases[state.activePhrase].translatedText = text;
      return [state];
    }],
];
