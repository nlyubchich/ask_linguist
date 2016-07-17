import * as l from 'lodash';
import { actionIs } from 'tanok/helpers.js';
import * as Rx from 'rx';
import { fetchGetJson } from '../utils';


function checkChooserIsCorrectPhrase(i) {
  return (state, eventStream) => Rx.Observable.just(1).do(() => {
    if (state.isFail) {
      eventStream.send('toggleChooserFail');
    } else if (state.possibleAnswers[i] === state.currentPhrase.sourceText) {
      eventStream.send('checkChooserIsOk');
    } else {
      eventStream.send('checkChooserIsNotOk');
    }
  });
}


function checkChooserIsFinished(state, eventStream) {
  return Rx.Observable.just(1).do(() => {
    if (l.isEmpty(state.phrases)) {
      eventStream.send('chooserFinished');
    } else {
      eventStream.send('chooserNextPhrase');
    }
  });
}


function chooserToggleNext(state, eventStream) {
  return Rx.Observable.just(1).do(() => eventStream.send('chooserNextPhrase'));
}

function ajaxFinishedQuestionnaire() {
  return Rx.Observable.just(1).do(() => fetchGetJson('/questionnaire/mark_done'));
}


function checkIsCorrectPhrase(state, eventStream) {
  return Rx.Observable.just(1).do(() => {
    if (state.isFail) {
      eventStream.send('toggleFail');
    } else if (state.enteredText === state.currentPhrase.translatedText) {
      eventStream.send('checkIsOk');
    } else {
      eventStream.send('checkIsNotOk');
    }
  });
}

function checkIsFinishedQuestionnaire(state, eventStream) {
  return Rx.Observable.just(1).do(() => {
    if (l.isEmpty(state.phrases)) {
      eventStream.send('questionnaireFinished');
    } else {
      eventStream.send('nextPhrase');
    }
  });
}


const askerUpdate = [
  ['init', (params, state) => [state]],
  [[actionIs('checkPhrase')], (params, state) => [state, checkIsCorrectPhrase]],
  [[actionIs('checkIsOk')], (params, state) => {
    l.pull(state.phrases, state.currentPhrase);
    state.enteredText = '';
    return [state, checkIsFinishedQuestionnaire];
  }],
  [[actionIs('nextPhrase')], (params, state) => {
    state.currentPhrase = l.sample(state.phrases);
    return [state];
  }],
  [[actionIs('questionnaireFinished')], (params, state) => {
    state.status = 'Finished!';
    return [state, ajaxFinishedQuestionnaire];
  }],
  [[actionIs('checkIsNotOk')], (params, state) => {
    state.isFail = true;
    state.status = state.currentPhrase.translatedText;
    return [state];
  }],
  [[actionIs('toggleFail')], (params, state) => {
    state.isFail = false;
    state.status = '';
    state.enteredText = '';
    state.currentPhrase = l.sample(state.phrases);
    return [state];
  }],
  [[actionIs('updateEnteredText')], ({ payload: { text } }, state) => {
    state.enteredText = text;
    return [state];
  }],
];


const chooserUpdate = [
  ['init', (params, state) => {
    const currentSource = state.currentPhrase.sourceText;
    state.possibleAnswers = [currentSource];
    state.possibleAnswers = l.shuffle(state.possibleAnswers.concat(
      l.sampleSize(l.without(state.allPhrases.map((phrase) => phrase.sourceText), currentSource), 3)
    ));
    return [state];
  }],
  [[actionIs('checkChooserPhrase')],
    ({ payload: { index } }, state) => [state, checkChooserIsCorrectPhrase(index)]],
  [[actionIs('checkChooserIsOk')], (params, state) => {
    l.pull(state.phrases, state.currentPhrase);
    return [state, checkChooserIsFinished];
  }],
  [[actionIs('checkChooserIsNotOk')], (params, state) => {
    state.isFail = true;
    return [state];
  }],
  [[actionIs('toggleChooserFail')], (params, state) => {
    state.isFail = false;
    state.status = '';
    return [state, chooserToggleNext];
  }],
  [[actionIs('chooserFinished')], (params, state) => {
    state.isChooser = false;
    state.phrases = state.allPhrases;
    state.currentPhrase = l.sample(state.phrases);
    return [state];
  }],
  [[actionIs('chooserNextPhrase')], (params, state) => {
    state.currentPhrase = l.sample(state.phrases);
    const currentSource = state.currentPhrase.sourceText;
    state.possibleAnswers = [currentSource];
    state.possibleAnswers = l.shuffle(state.possibleAnswers.concat(
      l.sampleSize(l.without(state.allPhrases.map((phrase) => phrase.sourceText), currentSource), 3)
    ));
    return [state];
  }],
];


export const update = l.concat(chooserUpdate, askerUpdate);
