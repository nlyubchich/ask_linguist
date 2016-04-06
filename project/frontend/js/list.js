import tanok from 'tanok/tanok.js';
import {init, update, View} from './PhraseList';
import {fetchGetJson} from './utils';


fetchGetJson('/dashboard/list')
    .then((result) => {
        let div = document.getElementById('list');
        tanok(init(result), update, View, {container: div});
    });
