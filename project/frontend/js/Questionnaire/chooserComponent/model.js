import * as l from 'lodash';

export default class ChooserModel {
  constructor(phrases) {
    return {
      phrases,
      allPhrases: phrases.slice(),
      currentPhrase: l.sample(phrases),
      status: '',
      isFail: false,
      enteredText: '',
      isChooser: true,
      possibleAnswers: [],
    };
  }
}
