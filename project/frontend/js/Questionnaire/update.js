import _ from "lodash";
import {actionIs} from 'tanok/helpers.js';

let csrftoken = document.querySelector('meta[name=csrf-token]').getAttribute('content');

export let update = [
    ['init', (params, state) => {
        return [state];
    }],
    [[actionIs('check_word')], ({payload}, state) => {
        let expected = state.currentEl.target;
        let actual = payload.text;

        if (actual === expected) {
            _.pull(state.words, state.currentEl);

            // TODO: to another func
            let nextElement = _.sample(state.words);
            if (nextElement) {
                state.currentEl = nextElement;
            } else {
                state.status = 'Finished!';
            }

        } else {
            if (state.isFail) {
                state.isFail = false;
                state.status = "";
                state.currentEl = _.sample(state.words);
            } else {
                state.isFail = true;
                state.status = expected;
            }
        }
        return [state]
    }]
];