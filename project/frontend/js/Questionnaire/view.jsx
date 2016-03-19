import React from "react";
import ReactDOM from 'react-dom';
import keycode from 'keycode';
import TanokWrapper from 'tanok/component.js';

class Asker extends React.Component {

    checkPhrase() {
        let text = ReactDOM.findDOMNode(this.refs.guessInput).value;
        this.send('check_phrase', {text})
    }

    inputKeyPressHandler(e) {
        if (keycode(e.which) == 'enter') {
            this.checkPhrase()
        } else {
            
        }
    }

    render() {
        return (
            <div>
                <p>{"Remaining: " + this.props.phrases.length}</p>
                <p> {this.props.currentPhrase.source}</p>
                <input type="text" ref="guessInput" onKeyPress={this.inputKeyPressHandler.bind(this)} />
                <button onClick={this.checkPhrase.bind(this)}>Guess</button>
                <p>{this.props.status}</p>
            </div>
        )
    }
}

export let TAsker = TanokWrapper(Asker);