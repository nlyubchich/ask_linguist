import $ from 'jquery';
import l from 'lodash';
import {actionIs} from 'tanok/helpers.js';
import * as Rx from 'rx';

let csrftoken = document.querySelector('meta[name=csrf-token]').getAttribute('content');

export let update = [
    ['init', (params, state) => {
        return [state];
    }],
    [[actionIs('remove_phrase')], (params, state) => {
        let phraseId = state.activePhrase;
        state.activePhrase = null;
        l.remove(state.phrases, (phrase) => phrase.id === phraseId);
        return [state, ajaxRemovePhrase.bind(null, phraseId)];
    }],
    [[actionIs('edit_phrase')], (params, state) => {
        state.activePhrase = params.payload.phraseId;
        return [state];
    }],
    [[actionIs('working_on_phrase')], (params, state) => {
        let {text} = params.payload;
        let phraseIndex = l.findIndex(state.phrases, (phrase) => phrase.id === state.activePhrase);
        state.phrases[phraseIndex].text = text;
        return [state];
    }],
    [[actionIs('save_phrase')], (params, state) => {
        let phraseId = state.activePhrase;
        state.activePhrase = null;
        return [state, ajaxEditPhrase.bind(null, phraseId)];
    }]
];

function ajaxRemovePhrase(phraseId) {
    return Rx.Observable.just(1).do(function () {
        $.ajax({
            url: '/dashboard/delete/',
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            data: {'phrase_id': phraseId}
        });
    });
}

function ajaxEditPhrase(phraseId, state) {
    return Rx.Observable.just(1).do(function () {
        let phrase = l.find(state.phrases, (phrase) => phrase.phraseId === phraseId);

        $.ajax({
            url: '/dashboard/edit/',
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            data: {'phrase_id': phraseId, 'source_text': phrase.sourceText}
        });
    });
}
