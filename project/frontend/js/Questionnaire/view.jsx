import React from 'react';
import keycode from 'keycode';
import TanokWrapper from 'tanok/component.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const ENTER_KEY = 'enter';

class Asker extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    checkPhrase() {
        this.props.eventStream.send('checkPhrase');
    }
    inputKeyPressHandler(event) {
        if (keycode(event.which) === ENTER_KEY) {
            this.checkPhrase();
        }
    }
    editedGuessInput(event) {
        this.props.eventStream.send(
            'updateEnteredText', {text: event.target.value}
        );
    }

    render() {
        return (
            <div>
                <p>{'Remaining: ' + this.props.phrases.length}</p>
                <p> {this.props.currentPhrase.source}</p>
                <input
                    type='text'
                    value={this.props.enteredText}
                    onChange={this.editedGuessInput.bind(this)}
                    onKeyPress={this.inputKeyPressHandler.bind(this)}
                />
                <button onClick={this.checkPhrase.bind(this)}>Guess</button>
                <p>{this.props.status}</p>
            </div>
        );
    }
}

Asker.propTypes = {
    eventStream: React.PropTypes.object.isRequired,
    phrases: React.PropTypes.array.isRequired,
    currentPhrase: React.PropTypes.object.isRequired,
    status: React.PropTypes.string.isRequired,
    enteredText: React.PropTypes.string.isRequired
};


class Chooser extends React.Component {
    checkClick(index) {
        this.props.eventStream.send('checkChooserPhrase', {index});
    }

    render() {
        return (
            <div>
                <p>{'Remaining: ' + this.props.phrases.length}</p>
                <p> {this.props.currentPhrase.target}</p>
                <ul>
                    {this.props.possibleAnswers.map((answer, index) => {
                        return (
                            <li key={index} onClick={this.checkClick.bind(this, index)}>
                                {
                                    (this.props.isFail && this.props.currentPhrase.source === answer) ?
                                     'THIS!!! '+answer : answer
                                }
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

Chooser.propTypes = {
    eventStream: React.PropTypes.object.isRequired,
    phrases: React.PropTypes.array.isRequired,
    currentPhrase: React.PropTypes.object.isRequired,
    status: React.PropTypes.string.isRequired,
    possibleAnswers: React.PropTypes.array.isRequired,
    isFail: React.PropTypes.bool.isRequired,
};

class Questionnaire extends React.Component {
    render() {
        return this.props.isChooser ?
            <Chooser
                eventStream={this.props.eventStream}
                phrases={this.props.phrases}
                currentPhrase={this.props.currentPhrase}
                status={this.props.status}
                possibleAnswers={this.props.possibleAnswers}
                isFail={this.props.isFail}
            /> :
            <Asker
                eventStream={this.props.eventStream}
                phrases={this.props.phrases}
                currentPhrase={this.props.currentPhrase}
                status={this.props.status}
                enteredText={this.props.enteredText}
            />;
    }
}

Questionnaire.propTypes = {
    eventStream: React.PropTypes.object.isRequired,
    phrases: React.PropTypes.array.isRequired,
    currentPhrase: React.PropTypes.object.isRequired,
    status: React.PropTypes.string.isRequired,
    enteredText: React.PropTypes.string.isRequired,
    isChooser: React.PropTypes.bool.isRequired,
    possibleAnswers: React.PropTypes.array.isRequired
};

export let TQuestionnaire = new TanokWrapper(Questionnaire);
