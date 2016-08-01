import keycode from 'keycode';
import React from 'react';
import { tanokComponent } from 'tanok';
import shallowCompare from 'react-addons-shallow-compare';
import autobind from 'autobind-decorator';

@tanokComponent
export default class PhraseItem extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  @autobind
  editedSourceText(e) {
    this.send(
      'editedSourceText', { text: e.target.value }
    );
  }

  @autobind
  editedTranslatedText(e) {
    this.send(
      'editedTranslatedText', { text: e.target.value }
    );
  }

  @autobind
  editPhrase() {
    const { phraseId } = this.props;
    this.send('editPhrase', { phraseId });
  }

  @autobind
  savePhrase() {
    this.send('savePhrase');
  }

  @autobind
  removePhrase() {
    this.send('removePhrase');
  }

  @autobind
  inputKeyPressHandler(e) {
    if (keycode(e.which) === 'enter') {
      this.savePhrase();
    }
  }

  renderActive() {
    const { sourceText, translatedText, progressStatus } = this.props;
    return (
      <tr className="b-vocabulary-table__row b-vocabulary-table__row--active">
        <td>
          <input
            className="b-vocabulary-table__input" size="20"
            placeholder="phrase"
            onChange={this.editedSourceText}
            value={sourceText}
            onKeyPress={this.inputKeyPressHandler}
          />
        </td>
        <td>
          <input
            className="b-vocabulary-table__input"
            size="20"
            placeholder="translation"
            onChange={this.editedTranslatedText}
            value={translatedText}
            onKeyPress={this.inputKeyPressHandler}
          />
        </td>
        <td>
          <div className="b-vocabulary-column__status--bar">
            <div
              className="progress-level"
              style={{ width: progressStatus }}
            >
            </div>
          </div>
        </td>
        <td className="b-vocabulary-column__actions--active">
          <input
            className="b-vocabulary-column__actions-btn"
            type="button"
            value="Save"
            onClick={this.savePhrase}
          />
          <input
            className="b-vocabulary-column__actions-btn"
            type="button"
            value="Delete"
            onClick={this.removePhrase}
          />
          <input
            className="b-vocabulary-column__actions-btn"
            type="button"
            value="Cancel"
            onClick=""
          />
        </td>
      </tr>
    );
  }

  renderNotActive() {
    const { sourceText, translatedText, progressStatus } = this.props;
    return (
      <tr className="b-vocabulary-table__row">
        <td>{sourceText}</td>
        <td>{translatedText}</td>
        <td>
          <div className="b-vocabulary-column__status--bar">
            <div
              className="progress-level"
              // FIXME: progressStatus is null but should be 0
              style={{ width: progressStatus }}
            >
            </div>
          </div>
        </td>
        <td>
          <input
            className="b-vocabulary-column__actions-btn"
            type="button"
            value="Edit"
            onClick={this.editPhrase}
          />
        </td>
      </tr>
    );
  }

  render() {
    return this.props.isActive ? this.renderActive() : this.renderNotActive();
  }
}

PhraseItem.propTypes = {
  tanokStream: React.PropTypes.object.isRequired,
  isActive: React.PropTypes.bool.isRequired,
  phraseId: React.PropTypes.number.isRequired,
  sourceText: React.PropTypes.string.isRequired,
  translatedText: React.PropTypes.string.isRequired,
  progressStatus: React.PropTypes.string.isRequired,
};
