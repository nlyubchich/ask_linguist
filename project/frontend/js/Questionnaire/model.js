import * as l from 'lodash';

class Model {
    constructor(initialData) {
        return {
            phrases: initialData.phrases,
            allPhrases: initialData.phrases.slice(),
            currentPhrase: l.sample(initialData.phrases),
            status: '',
            isFail: false,
            enteredText: '',
            isChooser: true,
            possibleAnswers: []
        };
    }
}

export function init(payload) {
    return new Model(payload);
}
