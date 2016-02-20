import $ from 'jquery'
import tanok from 'tanok/tanok.js';
import {init, update, View} from './Questionnaire';


$.get("/English-French/", (result) => {
        let div  = document.getElementById("test");
        tanok(init(result), update, View, {container: div});
    }
);