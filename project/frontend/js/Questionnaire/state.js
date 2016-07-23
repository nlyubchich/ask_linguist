import { TanokDispatcher, on, subcomponentFx, effectWrapper } from 'tanok';
import { AskerDispatcher } from './askerComponent';
import { ChooserDispatcher } from './chooserComponent';


export class QuestionnaireDispatcher extends TanokDispatcher {
  @on('init')
  init(_, state) {
    return [state,
      subcomponentFx('asker', (new AskerDispatcher).collect()),
      subcomponentFx('chooser', (new ChooserDispatcher).collect()),
    ];
  }

  @on('asker')
  asker(payload, state) {
    const [newState, ...effects] = payload(state.asker);
    state.asker = newState;
    return [state, ...effects.map((e) => effectWrapper(e, 'asker'))];
  }

  @on('chooser')
  chooser(payload, state) {
    const [newState, ...effects] = payload(state.chooser);
    state.chooser = newState;
    return [state, ...effects.map((e) => effectWrapper(e, 'chooser'))];
  }
}
