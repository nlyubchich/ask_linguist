import React from 'react';
import { tanokComponent } from 'tanok';
import * as l from 'lodash';


@tanokComponent
export default class Questionnaire extends React.Component {
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
