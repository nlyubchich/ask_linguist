import * as l from 'lodash';
import { TanokDispatcher, on } from 'tanok';
import { fetchGetJson } from '../../utils';
import * as Rx from 'rx';


function ajaxFinishedQuestionnaire() {
  return () => {
    fetchGetJson('/questionnaire/mark_done');
    return Rx.Observable.empty();
  };
}


function checkIsCorrectPhrase(isFail, enteredText, currentSourceText) {
  return (stream) => {
    if (isFail) {
      stream.send('toggleFail');
    } else if (enteredText === currentSourceText) {
      stream.send('checkIsOk');
    } else {
      stream.send('checkIsNotOk');
    }
    return Rx.Observable.empty();
  };
}

function checkIsFinishedQuestionnaire(phrases) {
  return (stream) => {
    if (l.isEmpty(phrases)) {
      stream.send('questionnaireFinished');
    } else {
      stream.send('nextPhrase');
    }
    return Rx.Observable.empty();
  };
}


export class AskerDispatcher extends TanokDispatcher {
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
    state.isDone = true;
    return [state, ajaxFinishedQuestionnaire()];
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
