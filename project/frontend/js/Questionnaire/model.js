// import * as l from 'lodash';
import { AskerModel } from './askerComponent';
import { ChooserModel } from './chooserComponent';

// class Model {
//   constructor(initialData) {
//     const phrases = initialData['phrases-for-test'];
//     return {
//       phrases,
//       allPhrases: phrases.slice(),
//       currentPhrase: l.sample(phrases),
//       status: '',
//       isFail: false,
//       enteredText: '',
//       isChooser: true,
//       possibleAnswers: [],
//     };
//   }
// }

export function init(payload) {
  const phrases = payload['phrases-for-test'];
  return {
    phrases,
    asker: new AskerModel(phrases),
    chooser: new ChooserModel(phrases),
    isChooser: true,
    isDone: false,
  };
}
