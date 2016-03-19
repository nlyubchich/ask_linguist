import * as l from 'lodash';

class Model {
    constructor(initialData) {
        return {
            phrases: initialData.phrases,
            currentPhrase: l.sample(initialData.phrases),
            status: '',
            isFail: false,
            enteredText: ''
        };
    }
}

export function init(payload) {
    return new Model(payload);
}
