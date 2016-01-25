import $ from "jquery";
import _ from "lodash"
import {actionIs, filter, debounce} from 'tanok/helpers.js';

let csrftoken = document.querySelector('meta[name=csrf-token]').getAttribute('content');

export let update = [
    ['init', (params, state) => {
        return [state];
    }],
    [[actionIs('remove_word')], (params, state) => {
        let wordId = state.activeWord;
        state.activeWord = null;
        _.remove(state.words, (word) => word.id == wordId);
        return [state, ajaxRemoveWord.bind(null, wordId)]
    }],
    [[actionIs('edit_word')], (params, state) => {
        state.activeWord = params.payload.wordId;
        return [state]
    }],
    [[actionIs('working_on_word')], (params, state) => {
        let {text} = params.payload;
        let wordIndex = _.findIndex(state.words, (word) => word.id == state.activeWord);
        state.words[wordIndex].text = text;
        return [state]
    }],
    [[actionIs('save_word')], (params, state) => {
        let wordId = state.activeWord;
        state.activeWord = null;
        return [state, ajaxEditWord.bind(null, wordId)]
    }]
];

function ajaxRemoveWord(wordId) {
    return Rx.Observable.just(1).do(function () {
        $.ajax({
            url: '/delete/',
            type: 'POST',
            headers: {
                "X-CSRFToken": csrftoken
            },
            data: {"target_id": wordId}
        });
    })
}

function ajaxEditWord(wordId, state) {
    return Rx.Observable.just(1).do(function () {
        let word = _.find(state.words, (word) => word.id == wordId);

        $.ajax({
            url: '/edit/',
            type: 'POST',
            headers: {
                "X-CSRFToken": csrftoken
            },
            data: {"target_id": wordId, "text": word.text}
        });
    })
}
