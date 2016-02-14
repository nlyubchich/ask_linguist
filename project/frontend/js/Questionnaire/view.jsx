import React from "react";
import ReactDOM from 'react-dom';
import keycode from 'keycode';
import TanokWrapper from 'tanok/component.js';

class Asker extends React.Component {

    checkWord() {
        let text = ReactDOM.findDOMNode(this.refs.guessInput).value;
        this.send('check_word', {text})
    }

    inputKeyPressHandler(e) {
        if (keycode(e.which) == 'enter') {
            this.checkWord()
        }
    }

    render() {
        return (
            <div>
                <p>{"Remaining: " + this.props.words.length}</p>
                <p> {this.props.currentEl.source.join(", ")}</p>
                <input type="text" ref="guessInput" onKeyPress={this.inputKeyPressHandler.bind(this)} />
                <button onClick={this.checkWord.bind(this)}>Guess</button>
                <p>{this.props.status}</p>
            </div>
        )
    }
}

export let TAsker = TanokWrapper(Asker);