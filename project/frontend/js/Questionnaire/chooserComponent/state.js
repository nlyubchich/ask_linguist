import * as l from 'lodash';
import * as Rx from 'rx';
import { TanokDispatcher, on } from 'tanok';


function checkChooserIsCorrectPhrase(i) {
  return (state, eventStream) => Rx.Observable.just(1).do(() => {
    if (state.isFail) {
      eventStream.send('toggleChooserFail');
    } else if (state.possibleAnswers[i] === state.currentPhrase.translatedText) {
      eventStream.send('checkChooserIsOk');
    } else {
      eventStream.send('checkChooserIsNotOk');
    }
  });
}


function checkChooserIsFinished(phrases) {
  return (eventStream) => Rx.Observable.just(1).do(() => {
    if (l.isEmpty(phrases)) {
      eventStream.send('chooserFinished');
    } else {
      eventStream.send('chooserNextPhrase');
    }
  });
}

function chooserToggleNext(eventStream) {
  return Rx.Observable.just(1).do(() => eventStream.send('chooserNextPhrase'));
}


export default class ChooserDispatcher extends TanokDispatcher {
  @on('init')
  init(_, state) {
    const currentTranslated = state.currentPhrase.translatedText;
    state.possibleAnswers = [currentTranslated];
    state.possibleAnswers = l.shuffle(state.possibleAnswers.concat(
      l.sampleSize(
        l.without(state.allPhrases.map((phrase) => phrase.translatedText), currentTranslated),
        3
      )
    ));
    return [state];
  }

  @on('checkChooserPhrase')
  checkChooserPhrase({ index }, state) {
    return [state, checkChooserIsCorrectPhrase(index)];
  }

  @on('checkChooserIsOk')
  checkChooserIsOk(_, state) {
    l.pull(state.phrases, state.currentPhrase);
    return [state, checkChooserIsFinished(state.phrases)];
  }

  @on('checkChooserIsNotOk')
  checkChooserIsNotOk(_, state) {
    state.isFail = true;
    return [state];
  }

  @on('toggleChooserFail')
  toggleChooserFail(_, state) {
    state.isFail = false;
    state.status = '';
    return [state, chooserToggleNext];
  }

  @on('chooserFinished')
  chooserFinished(_, state) {
    state.isChooser = false;
    state.phrases = state.allPhrases;
    state.currentPhrase = l.sample(state.phrases);
    return [state];
  }

  @on('chooserNextPhrase')
  chooserNextPhrase(_, state) {
    state.currentPhrase = l.sample(state.phrases);
    const currentTranslated = state.currentPhrase.translatedText;
    state.possibleAnswers = [currentTranslated];
    state.possibleAnswers = l.shuffle(state.possibleAnswers.concat(
      l.sampleSize(
        l.without(state.allPhrases.map((phrase) => phrase.translatedText), currentTranslated),
        3
      )
    ));
    return [state];
  }
}
