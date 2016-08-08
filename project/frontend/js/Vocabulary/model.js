import * as l from 'lodash';

class Model {
  constructor(initialData) {
    return {
      language: initialData.language,
      phrases: initialData.phrases || [],
      activePhrase: null,
      toggledAddNewPhrase: false,
    };
  }
}

export function init(payload, language) {
  return new Model({
    language,
    phrases: payload.phrases.map((phrase) => l.assign(phrase, { isEdit: false })),
  });
}
