import $ from 'jquery';
import l from 'lodash';
import {actionIs, debounce} from 'tanok/helpers.js';
import * as Rx from 'rx';

let csrftoken = document.querySelector('meta[name=csrf-token]').getAttribute('content');

export let update = [
    ['init', (params, state) => {
        return [state];
    }],
    [[actionIs('removePhrase')], (params, state) => {
        let phraseId = state.phrases[state.activePhrase].phraseId;
        let phraseIndex = state.activePhrase;
        state.activePhrase = null;
        l.pullAt(state.phrases, phraseIndex);
        let effect;
        if (phraseId === 0) {
            state.toggledAddNewPhrase = false;
        } else {
            effect = ajaxRemovePhrase.bind(null, phraseId)
        }
        return [state, effect];
    }],
    [[actionIs('editPhrase')], ({payload: {phraseId}}, state) => {
        state.activePhrase = l.findIndex(state.phrases, {phraseId});
        return [state];
    }],
    [[actionIs('savePhrase')], (params, state) => {
        let phraseId = state.phrases[state.activePhrase].phraseId;
        state.activePhrase = null;

        let effect;
        if (phraseId === 0) {
            effect = ajaxCreatePhrase;
            state.toggledAddNewPhrase = false;
        } else {
            effect = ajaxEditPhrase.bind(null, phraseId);
        }
        return [state, effect];
    }],

    [[actionIs('toggledAddNewPhrase')], (params, state) => {
        state.phrases.unshift({
            'phraseId': 0,
            'sourceLanguage': '',
            'sourceText': '',
            'translatedLanguage': '',
            'translatedText': ''
        });
        state.activePhrase = 0;
        state.toggledAddNewPhrase = true;
        return [state];
    }],

    [[actionIs('savedNewPhrase')], ({payload: {phraseId}}, state) => {
        state.phrases[0].phraseId = phraseId;
        state.activePhrase = null;
        state.toggledAddNewPhrase = false;
        return [state];
    }],

    // oh my...
    [[actionIs('editedSourceLanguage')], ({payload: {text}}, state) => {
        state.phrases[state.activePhrase].sourceLanguage = text;
        return [state];
    }],
    [[actionIs('editedSourceText')], ({payload: {text}}, state) => {
        state.phrases[state.activePhrase].sourceText = text;
        return [state];
    }],
    [[actionIs('editedTranslatedLanguage')], ({payload: {text}}, state) => {
        state.phrases[state.activePhrase].translatedLanguage = text;
        return [state];
    }],
    [[actionIs('editedTranslatedText')], ({payload: {text}}, state) => {
        state.phrases[state.activePhrase].translatedText = text;
        return [state];
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

function ajaxCreatePhrase(state, eventStream) {
    return Rx.Observable.just(1).do(function () {
        let phrase = l.find(state.phrases, (phrase) => phrase.phraseId === 0);

        $.ajax({
            url: '/dashboard/create/',
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            data: {
                'source_language': phrase.sourceLanguage,
                'source_text': phrase.sourceText,
                'translated_language': phrase.translatedLanguage,
                'translated_text': phrase.translatedText
            }
        }).done((response) => {
            eventStream.send('savedNewPhrase', {phraseId: response.phrase_id})
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
            data: {
                'phrase_id': phraseId,
                'source_language': phrase.sourceLanguage,
                'source_text': phrase.sourceText,
                'translated_language': phrase.translatedLanguage,
                'translated_text': phrase.translatedText
            }
        });
    });
}
