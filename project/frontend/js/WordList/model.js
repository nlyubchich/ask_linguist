export function init(payload) {
  return {
    words: payload.words.map((word) => _.assign(word, {isEdit: false}))
  }
}