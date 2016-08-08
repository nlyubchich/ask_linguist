import { AskerModel } from './askerComponent';
import { ChooserModel } from './chooserComponent';


export function init(payload, language) {
  const phrases = payload['phrases-for-test'];
  return {
    phrases,
    language,
    asker: new AskerModel(phrases, language),
    chooser: new ChooserModel(phrases, language),
    isChooser: true,
    isDone: false,
  };
}
