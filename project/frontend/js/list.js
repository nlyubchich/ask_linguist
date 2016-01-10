import $ from 'jquery'
import tanok from 'tanok/tanok.js';
import {init, update, View} from './WordList';


$.get("/list", function (result) {
        console.log(result);
        let div  = document.getElementById("list");
        tanok(init(result), update, View, {container: div});
    }
);
