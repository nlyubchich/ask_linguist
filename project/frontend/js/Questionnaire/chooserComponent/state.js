import * as l from 'lodash';
import * as Rx from 'rx';
import { TanokDispatcher, on, rethrowFx } from 'tanok';


function checkChooserIsCorrectPhrase(i, translatedText, possibleAnswers, isFail) {
  return (stream) => {
    if (isFail) {
      stream.send('toggleChooserFail');
    } else if (possibleAnswers[i].trim() === translatedText.trim()) {
      stream.send('checkChooserIsOk');
    } else {
      stream.send('checkChooserIsNotOk');
    }
    return Rx.Observable.empty();
  };
}


function checkChooserIsFinished(phrases) {
  return (stream) => {
    if (l.isEmpty(phrases)) {
      stream.send('chooserFinished');
    } else {
      stream.send('chooserNextPhrase');
    }
    return Rx.Observable.empty();
  };
}

function speakSourceTextEffect() {
  return (stream) => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    if (l.isEmpty(voices)) {
      const oldCallback = synth.onvoiceschanged;
      synth.onvoiceschanged = () => {
        stream.send('speakSourceText');
        synth.onvoiceschanged = oldCallback;
        if (typeof oldCallback === 'function') {
          oldCallback();
        }
      };
    } else {
      stream.send('speakSourceText');
    }

    return Rx.Observable.empty();
  };
}

export class ChooserDispatcher extends TanokDispatcher {
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
    return [state, checkChooserIsCorrectPhrase(
      index, state.currentPhrase.translatedText, state.possibleAnswers, state.isFail)];
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
    return [state, rethrowFx('chooserNextPhrase')];
  }

  @on('chooserFinished')
  chooserFinished(_, state) {
    state.isDone = true;
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
  @on('trySpeakSourceText')
  trySpeakSourceText(_, state) {
    return [state, speakSourceTextEffect()];
  }

  @on('speakSourceText')
  speakSourceText(_, state) {
    const utterance = new SpeechSynthesisUtterance(
      state.currentPhrase.sourceText
    );
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(voice => voice.lang === 'fr-FR');
    window.speechSynthesis.speak(utterance);
    return [state];
  }
}
