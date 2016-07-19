import React from 'react';
import tanokComponent from 'tanok/src/component.js';
import PhraseItem from './item.jsx';


@tanokComponent
export class PhraseList extends React.Component {
  toggledAddNewPhrase() {
    this.send('toggledAddNewPhrase');
  }

  render() {
    return (
      <div>
        <input
          className="b-add-btn"
          type="button"
          value="Add a new phrase"
          disabled={this.props.toggledAddNewPhrase}
          onClick={() => this.toggledAddNewPhrase()}
        />
        <input
          className="b-search-field"
          type="search"
          placeholder="Search"
          size="30"
        />

        <table className="b-vocabulary-table">
          <tbody>
            <tr className="b-vocabulary-table__head">
              <th className="b-vocabulary-column__lang">Source language</th>
              <th className="b-vocabulary-column__word">Phrase</th>
              <th className="b-vocabulary-column__lang">Language translated to</th>
              <th className="b-vocabulary-column__word">Translation</th>
              <th className="b-vocabulary-column__status">Status</th>
              <th className="b-vocabulary-column__actions">Actions</th>
            </tr>
            {
              this.props.phrases.map(
                (phrase, i) => <PhraseItem
                  eventStream={this.props.eventStream}
                  key={phrase.phraseId}
                  isActive={this.props.activePhrase === i}
                  {...phrase}
                />
              )
            }
          </tbody>
        </table>
      </div>
    );
  }
}

PhraseList.propTypes = {
  eventStream: React.PropTypes.object.isRequired,
  phrases: React.PropTypes.array.isRequired,
  activePhrase: React.PropTypes.number,
  toggledAddNewPhrase: React.PropTypes.bool,
};