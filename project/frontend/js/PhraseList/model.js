import l from 'lodash';

class Model {
    constructor(initialData) {
        return {
            phrases: initialData.phrases || [],
            activePhrase: null
        };
    }
}

export function init(payload) {
    return new Model({
        phrases: payload.phrases.map((phrase) => l.assign(phrase, {isEdit: false}))
    });
}
