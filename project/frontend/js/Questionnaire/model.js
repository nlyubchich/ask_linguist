import { AskerModel } from './askerComponent';
import { ChooserModel } from './chooserComponent';


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
