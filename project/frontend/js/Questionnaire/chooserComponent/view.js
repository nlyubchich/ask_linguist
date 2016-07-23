import React from 'react';
import classNames from 'classnames';
import { tanokComponent } from 'tanok';
import autobind from 'autobind-decorator';


@tanokComponent
export default class Chooser extends React.Component {
  static propTypes = {
    eventStream: React.PropTypes.object.isRequired,
    phrases: React.PropTypes.array.isRequired,
    currentPhrase: React.PropTypes.object.isRequired,
    status: React.PropTypes.string.isRequired,
    possibleAnswers: React.PropTypes.array.isRequired,
    isFail: React.PropTypes.bool.isRequired,
  };

  @autobind
  checkClick(index) {
    this.send('checkChooserPhrase', { index });
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
                  onClick={this.checkClick}
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
