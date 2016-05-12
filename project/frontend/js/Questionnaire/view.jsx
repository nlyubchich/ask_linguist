import React from 'react';
import keycode from 'keycode';
import TanokWrapper from 'tanok/component.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';

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
            <div className='questionnaire'>
                <p className='current-phrase'> {this.props.currentPhrase.source}</p>
                <div>
                    <p className='asker-correct-answer'>{this.props.status}</p>
                    <input className='asker-input'
                        type='text'
                        value={this.props.enteredText}
                        onChange={this.editedGuessInput.bind(this)}
                        onKeyPress={this.inputKeyPressHandler.bind(this)}
                    />
                </div>   
                <div>
                    <button className='check-btn' onClick={this.checkPhrase.bind(this)}>Check</button>
                </div>

                <p className='phrase-counter'>{this.props.phrases.length + ' words left'}</p>
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
                <div className='questionnaire'>
                    <p className='current-phrase'> {this.props.currentPhrase.target}</p>
                    <ul className='answers-list'>
                        {this.props.possibleAnswers.map((answer, index) => {
                            let isCorrectAnswer = this.props.currentPhrase.source === answer;
                            return (
                                <li
                                    className={classNames({
                                        'variants': true,
                                        'correct-answer': isCorrectAnswer && this.props.isFail ,
                                        
                                    })}
                                    key={index}
                                    onClick={this.checkClick.bind(this, index)}
                                >
                                    {answer}
                                </li>
                            );
                        })}
                    </ul>
                    <p className='phrase-counter'>{this.props.phrases.length + ' words left'}</p>
                </div>

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
            />:
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
