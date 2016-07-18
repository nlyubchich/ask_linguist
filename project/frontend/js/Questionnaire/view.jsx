import React from 'react';
import keycode from 'keycode';
import TanokWrapper from 'tanok/src/component.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';
import * as l from 'lodash';

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

  editedGuessInput(e) {
    this.props.eventStream.send(
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
            onChange={(e) => this.editedGuessInput(e)}
            onKeyPress={(e) => this.inputKeyPressHandler(e)}
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


class Chooser extends React.Component {
  checkClick(index) {
    this.props.eventStream.send('checkChooserPhrase', { index });
  }

  render() {
    return (
      <div>
        <div className="b-questionnaire-container">
          <p
            className="b-current-phrase"
          > {this.props.currentPhrase.sourceText}</p>
          <ul className="b-chooser__answers-list">
            {this.props.possibleAnswers.map((answer, index) => {
              const isCorrectAnswer = this.props.currentPhrase.translatedText === answer;
              return (
                <li
                  className={classNames({
                    'b-chooser__answers-list__variant': true,
                    'b-chooser__correct-answer': isCorrectAnswer && this.props.isFail,
                  })}
                  key={index}
                  onClick={() => this.checkClick(index)}
                >
                  {answer}
                </li>
              );
            })}
          </ul>
          <p
            className="b-phrase-counter"
          >{`${this.props.phrases.length} words left`}</p>
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
    if (l.isEmpty(this.props.phrases)) {
      return (
        // TODO: Style it
        <div>There are no phrases for today. Well done!</div>
      );
    }

    return this.props.isChooser ? (
      <Chooser
        eventStream={this.props.eventStream}
        phrases={this.props.phrases}
        currentPhrase={this.props.currentPhrase}
        status={this.props.status}
        possibleAnswers={this.props.possibleAnswers}
        isFail={this.props.isFail}
      />
    ) : (
      <Asker
        eventStream={this.props.eventStream}
        phrases={this.props.phrases}
        currentPhrase={this.props.currentPhrase}
        status={this.props.status}
        enteredText={this.props.enteredText}
      />
    );
  }
}

Questionnaire.propTypes = {
  eventStream: React.PropTypes.object.isRequired,
  phrases: React.PropTypes.array.isRequired,
  currentPhrase: React.PropTypes.object.isRequired,
  status: React.PropTypes.string.isRequired,
  enteredText: React.PropTypes.string.isRequired,
  isChooser: React.PropTypes.bool.isRequired,
  isFail: React.PropTypes.bool.isRequired,
  possibleAnswers: React.PropTypes.array.isRequired,
};

export const TQuestionnaire = new TanokWrapper(Questionnaire);
