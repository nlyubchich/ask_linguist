import $ from "jquery";
import {actionIs, filter, debounce} from 'tanok/helpers.js';


let csrftoken = document.querySelector('meta[name=csrf-token]').getAttribute('content');

export let update = [
    ['init', (params, state) => {
        return [state];
    }],
    [[actionIs('remove_word')], (params, state) => {
        //state.count += 1;
        $.ajax({
            url: '/delete/',
            type: 'POST',
            headers: {
                "X-CSRFToken": csrftoken
            },
            data: {"target_id": params.payload.wordId}
        });
        return [state]
    }]
    //[[actionIs('dec')], (params, state) => {
    //  state.count -= 1;
    //  return [state, wowEffect]
    //}],
    //[[actionIs('wow'), debounce(1000)], (params, state) => {
    //  state.history.push(state.count);
    //  return [state]
    //}]
];

//function removeWord(wordId) {
//    "use strict";
//}