import React from 'react';
import keycode from 'keycode';
import { tanokComponent } from 'tanok';
import shallowCompare from 'react-addons-shallow-compare';
import autobind from 'autobind-decorator';

const ENTER_KEY = 'enter';


@tanokComponent
export default class Asker extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  @autobind
  checkPhrase() {
    this.send('checkPhrase');
  }

  @autobind
  inputKeyPressHandler(event) {
    if (keycode(event.which) === ENTER_KEY) {
      this.checkPhrase();
    }
  }

  @autobind
  editedGuessInput(e) {
    this.send(
      'updateEnteredText', { text: e.target.value }
    );
  }

  render() {
    return (
      <div className="b-questionnaire-container">
        <p className="b-current-phrase"> {this.props.currentPhrase.translatedText}</p>
        <div>
          <p className="b-asker__correct-answer">{this.props.status}</p>
          <input
            className="b-asker__input"
            type="text"
            value={this.props.enteredText}
            onChange={this.editedGuessInput}
            onKeyPress={this.inputKeyPressHandler}
          />
        </div>
        <div>
          <button
            className="b-asker__check-btn"
            onClick={this.checkPhrase}
          >
            Check
          </button>
        </div>

        <p className="b-phrase-counter">
          {`${this.props.phrases.length} words left`}
        </p>
      </div>
    );
  }
}

Asker.propTypes = {
  eventStream: React.PropTypes.object.isRequired,
  phrases: React.PropTypes.array.isRequired,
  currentPhrase: React.PropTypes.object.isRequired,
  status: React.PropTypes.string.isRequired,
  enteredText: React.PropTypes.string.isRequired,
};
