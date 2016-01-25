class Model {
    constructor(initialData) {
        return {
            words: initialData.words || [],
            activeWord: null
        }
    }
}

export function init(payload) {
    return new Model ({
        words: payload.words.map((word) => _.assign(word, {isEdit: false}))
    })

}