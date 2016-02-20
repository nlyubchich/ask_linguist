import _ from "lodash";
import {actionIs} from "tanok/helpers.js";


export let update = [
    ['init', (params, state) => {
        return [state];
    }],
    [[actionIs('check_word')], ({payload}, state) => {
        return [state, checkIsCorrectWord(payload.text)];
    }],
    [[actionIs('check_is_ok')], (params, state) => {
        _.pull(state.words, state.currentEl);
        let nextElement = _.sample(state.words);
        if (nextElement) {
            state.currentEl = nextElement;
        } else {
            state.status = 'Finished!';
        }
        return [state]
    }],
    [[actionIs('check_is_not_ok')], (params, state) => {
        state.isFail = true;
        state.status = state.currentEl.target;
        return [state]
    }],
    [[actionIs('toggle_fail')], (params, state) => {
        state.isFail = false;
        state.status = "";
        state.currentEl = _.sample(state.words);
        return [state]
    }]
];

function checkIsCorrectWord(word) {
    return (state, eventStream) => Rx.Observable.just(1).do(
        () => {
            if (state.isFail) {
                eventStream.send('toggle_fail')
            } else {
                if (word === state.currentEl.target) {
                    eventStream.send('check_is_ok');
                } else {
                    eventStream.send('check_is_not_ok');
                }
            }
        }
    )
}