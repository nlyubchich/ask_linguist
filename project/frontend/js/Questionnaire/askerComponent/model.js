import * as l from 'lodash';

export class AskerModel {
  constructor(phrases) {
    return {
      phrases: phrases.slice(),
      allPhrases: phrases.slice(),
      currentPhrase: l.sample(phrases),
      status: '',
      isFail: false,
      isDone: false,
      enteredText: '',
      isChooser: true,
      possibleAnswers: [],
    };
  }
}
