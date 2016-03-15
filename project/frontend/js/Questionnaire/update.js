import l from "lodash";
import {actionIs} from "tanok/helpers.js";
import $ from 'jquery';


export let update = [
    ['init', (params, state) => {
        return [state];
    }],
    [[actionIs('check_phrase')], ({payload}, state) => {
        return [state, checkIsCorrectPhrase(payload.text)];
    }],
    [[actionIs('check_is_ok')], (params, state) => {
        l.pull(state.phrases, state.currentPhrase);
        return [state, checkIsFinishedQuestionnaire]
    }],
    [[actionIs('nextPhrase')], (params, state) => {
        state.currentPhrase = l.sample(state.phrases);
        return [state]
    }],
    [[actionIs('questionnaireFinished')], (params, state) => {
        state.status = 'Finished!';
        return [state, ajaxFinishedQuestionnaire]
    }],
    [[actionIs('check_is_not_ok')], (params, state) => {
        state.isFail = true;
        state.status = state.currentPhrase.target;
        return [state]
    }],
    [[actionIs('toggle_fail')], (params, state) => {
        state.isFail = false;
        state.status = "";
        state.currentPhrase = l.sample(state.phrases);
        return [state]
    }]
];

function checkIsCorrectPhrase(phrase) {
    return (state, eventStream) => Rx.Observable.just(1).do(() => {
            if (state.isFail) {
                eventStream.send('toggle_fail')
            } else {
                if (phrase === state.currentPhrase.target) {
                    eventStream.send('check_is_ok');
                } else {
                    eventStream.send('check_is_not_ok');
                }
            }
        }
    )
}

function checkIsFinishedQuestionnaire(state, eventStream) {
    return Rx.Observable.just(1).do(() => {
            if (l.isEmpty(state.phrases)) {
                eventStream.send('questionnaireFinished')
            } else {
                eventStream.send('nextPhrase')
            }
        }
    )
}

function ajaxFinishedQuestionnaire() {
    return Rx.Observable.just(1).do(function () {
        $.ajax({
            url: '/questionnaire/mark_done'
        });
    })
}