import _ from 'lodash';

class Model {
    constructor(initialData) {
        return {
            words: initialData.words,
            currentEl: _.sample(initialData.words),
            status: "",
            isFail: false
        }
    }
}

export function init(payload) {
    return new Model ({
        words: payload.words
    })
}