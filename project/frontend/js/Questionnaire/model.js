// import * as l from 'lodash';
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

export function init({ phrases }) {
  return {
    // asker: askerInit(),
    chooser: new ChooserModel(phrases),
  };
}
