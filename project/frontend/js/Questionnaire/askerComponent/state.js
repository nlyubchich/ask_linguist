import * as l from 'lodash';
import { TanokDispatcher, on } from 'tanok';
import { fetchGetJson } from '../../utils';
import * as Rx from 'rx';


function ajaxFinishedQuestionnaire() {
  return Rx.Observable.just(1).do(() => fetchGetJson('/questionnaire/mark_done'));
}


function checkIsCorrectPhrase(isFail, enteredText, currentSourceText) {
  return (eventStream) => Rx.Observable.just(1).do(() => {
    if (isFail) {
      eventStream.send('toggleFail');
    } else if (enteredText === currentSourceText) {
      eventStream.send('checkIsOk');
    } else {
      eventStream.send('checkIsNotOk');
    }
  });
}

function checkIsFinishedQuestionnaire(phrases) {
  return (eventStream) => Rx.Observable.just(1).do(() => {
    if (l.isEmpty(phrases)) {
      eventStream.send('questionnaireFinished');
    } else {
      eventStream.send('nextPhrase');
    }
  });
}


export default class AskerDispatcher extends TanokDispatcher {
  @on('checkPhrase')
  checkPhrase(_, state) {
    return [
      state, checkIsCorrectPhrase(
        state.isFail, state.enteredText, state.currentPhrase.sourceText
      ),
    ];
  }

  @on('checkIsOk')
  checkIsOk(_, state) {
    l.pull(state.phrases, state.currentPhrase);
    state.enteredText = '';
    return [state, checkIsFinishedQuestionnaire(state.phrases)];
  }

  @on('nextPhrase')
  nextPhrase(_, state) {
    state.currentPhrase = l.sample(state.phrases);
    return [state];
  }

  @on('questionnaireFinished')
  questionnaireFinished(_, state) {
    state.status = 'Finished!';
    return [state, ajaxFinishedQuestionnaire];
  }

  @on('checkIsNotOk')
  checkIsNotOk(_, state) {
    state.isFail = true;
    state.status = state.currentPhrase.sourceText;
    return [state];
  }

  @on('toggleFail')
  toggleFail(_, state) {
    state.isFail = false;
    state.status = '';
    state.enteredText = '';
    state.currentPhrase = l.sample(state.phrases);
    return [state];
  }

  @on('updateEnteredText')
  updateEnteredText({ text }, state) {
    state.enteredText = text;
    return [state];
  }
}
