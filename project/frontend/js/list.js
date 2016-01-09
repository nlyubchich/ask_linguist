import tanok from 'tanok/tanok.js';
import {init, update, View} from './WordList';

//let div = document.createElement('div');
//document.body.appendChild(div);

$.get("/list", function (result) {
        console.log(result);
        let div  = document.getElementById("list");
        tanok(init(result), update, View, {container: div});
        //ReactDOM.render(
        //    <WordList words={result.words}/>,
        //)
    }
);
