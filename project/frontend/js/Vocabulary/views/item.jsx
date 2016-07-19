import keycode from 'keycode';
import React from 'react';
import tanokComponent from 'tanok/src/component.js';
import shallowCompare from 'react-addons-shallow-compare';


@tanokComponent
export default class PhraseItem extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
  editedSourceLanguage(e) {
    this.send(
      'editedSourceLanguage', { text: e.target.value }
    );
  }

  editedSourceText(e) {
    this.send(
      'editedSourceText', { text: e.target.value }
    );
  }

  editedTranslatedLanguage(e) {
    this.send(
      'editedTranslatedLanguage', { text: e.target.value }
    );
  }

  editedTranslatedText(e) {
    this.send(
      'editedTranslatedText', { text: e.target.value }
    );
  }

  editPhrase() {
    const { phraseId } = this.props;
    this.send('editPhrase', { phraseId });
  }

  savePhrase() {
    this.send('savePhrase');
  }

  removePhrase() {
    this.send('removePhrase');
  }

  inputKeyPressHandler(e) {
    if (keycode(e.which) === 'enter') {
      this.savePhrase();
    }
  }

  renderActive() {
    const {
      sourceLanguage, sourceText,
      translatedLanguage, translatedText,
      progressStatus,
    } = this.props;
    return (
      <tr className="b-vocabulary-table__row b-vocabulary-table__row--active">
        <td>
          <input
            className="b-vocabulary-table__input" size="10"
            placeholder="language"
            onChange={(e) => this.editedSourceLanguage(e)}
            value={sourceLanguage}
            onKeyPress={(e) => this.inputKeyPressHandler(e)}
          />
        </td>
        <td>
          <input
            className="b-vocabulary-table__input" size="20"
            placeholder="phrase"
            onChange={(e) => this.editedSourceText(e)}
            value={sourceText}
            onKeyPress={(e) => this.inputKeyPressHandler(e)}
          />
        </td>
        <td>
          <input
            className="b-vocabulary-table__input"
            size="10"
            placeholder="language"
            onChange={(e) => this.editedTranslatedLanguage(e)}
            value={translatedLanguage}
            onKeyPress={(e) => this.inputKeyPressHandler(e)}
          />
        </td>
        <td>
          <input
            className="b-vocabulary-table__input"
            size="20"
            placeholder="translation"
            onChange={(e) => this.editedTranslatedText(e)}
            value={translatedText}
            onKeyPress={(e) => this.inputKeyPressHandler(e)}
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
            onClick={() => this.savePhrase()}
          />
          <input
            className="b-vocabulary-column__actions-btn"
            type="button"
            value="Delete"
            onClick={() => this.removePhrase()}
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
    const {
      sourceLanguage, sourceText,
      translatedLanguage, translatedText,
      progressStatus,
    } = this.props;
    return (
      <tr className="b-vocabulary-table__row">
        <td>{sourceLanguage}</td>
        <td>{sourceText}</td>
        <td>{translatedLanguage}</td>
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
            onClick={() => this.editPhrase()}
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
  eventStream: React.PropTypes.object.isRequired,
  isActive: React.PropTypes.bool.isRequired,
  phraseId: React.PropTypes.number.isRequired,
  sourceLanguage: React.PropTypes.string.isRequired,
  sourceText: React.PropTypes.string.isRequired,
  translatedLanguage: React.PropTypes.string.isRequired,
  translatedText: React.PropTypes.string.isRequired,
  progressStatus: React.PropTypes.string.isRequired,
};
