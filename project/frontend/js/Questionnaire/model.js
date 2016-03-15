import _ from 'lodash';

class Model {
    constructor(initialData) {
        return {
            phrases: initialData.phrases,
            currentPhrase: _.sample(initialData.phrases),
            status: "",
            isFail: false
        }
    }
}

export function init(payload) {
    return new Model (payload)
}