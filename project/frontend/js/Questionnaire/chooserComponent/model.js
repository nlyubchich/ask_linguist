import * as l from 'lodash';

export class ChooserModel {
  constructor(phrases, language) {
    return {
      language,
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
