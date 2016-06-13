import keycode from 'keycode';
import React from 'react';
import TanokWrapper from 'tanok/component.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';


class PhraseItem extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    editedSourceLanguage(event) {
        this.props.eventStream.send(
            'editedSourceLanguage', {text: event.target.value}
        );
    }
    editedSourceText(event) {
        this.props.eventStream.send(
            'editedSourceText', {text: event.target.value}
        );
    }
    editedTranslatedLanguage(event) {
        this.props.eventStream.send(
            'editedTranslatedLanguage', {text: event.target.value}
        );
    }
    editedTranslatedText(event) {
        this.props.eventStream.send(
            'editedTranslatedText', {text: event.target.value}
        );
    }

    editPhrase() {
        let {eventStream, phraseId} = this.props;
        eventStream.send('editPhrase', {phraseId: phraseId});
    }

    savePhrase() {
        let {eventStream} = this.props;
        eventStream.send('savePhrase');
    }

    removePhrase() {
        let {eventStream} = this.props;
        eventStream.send('removePhrase');
    }

    inputKeyPressHandler(e) {
        if (keycode(e.which) === 'enter') {
            this.savePhrase();
        }
    }

    renderActive() {
        let {sourceLanguage, sourceText,
            translatedLanguage, translatedText,
            progressStatus} = this.props;
        return (
            <tr className='b-vocabulary-table__row active-row'>
                <td>
                    <input className='b-vocabulary-table__input' size='10' placeholder='language'
                        onChange={this.editedSourceLanguage.bind(this)}
                        value={sourceLanguage}
                        onKeyPress={this.inputKeyPressHandler.bind(this)}
                    />
                </td>
                <td>
                    <input className='b-vocabulary-table__input' size='20' placeholder='phrase'
                        onChange={this.editedSourceText.bind(this)}
                        value={sourceText}
                        onKeyPress={this.inputKeyPressHandler.bind(this)}
                    />
                </td>
                <td>
                    <input className='b-vocabulary-table__input' size='10' placeholder='language'
                        onChange={this.editedTranslatedLanguage.bind(this)}
                        value={translatedLanguage}
                        onKeyPress={this.inputKeyPressHandler.bind(this)}
                    />
                </td>
                <td>
                    <input className='b-vocabulary-table__input' size='20' placeholder='translation'
                        onChange={this.editedTranslatedText.bind(this)}
                        value={translatedText}
                        onKeyPress={this.inputKeyPressHandler.bind(this)}
                    />
                </td>
                <td>
                    <div className='b-vocabulary-column__status--bar'>
                      <div className='progress-level'
                           style={{'width': progressStatus}}
                      >
                      </div>
                    </div>
                </td>
                <td className='b-vocabulary-column__actions--active'>
                    <input
                        className='b-vocabulary-column__actions-btn'
                        type='button'
                        value='Save'
                        onClick={this.savePhrase.bind(this)}
                    />
                    <input
                        className='b-vocabulary-column__actions-btn'
                        type='button'
                        value='Delete'
                        onClick={this.removePhrase.bind(this)}
                    />
                    <input
                        className='b-vocabulary-column__actions-btn'
                        type='button'
                        value='Cancel'
                        onClick=''
                     />
                </td>
            </tr>
        );
    }

    renderNotActive() {
        let {sourceLanguage, sourceText,
            translatedLanguage, translatedText,
            progressStatus} = this.props;
        return (
            <tr className='b-vocabulary-table__row'>
                <td>{sourceLanguage}</td>
                <td>{sourceText}</td>
                <td>{translatedLanguage}</td>
                <td>{translatedText}</td>
                <td>
                    <div className='b-vocabulary-column__status--bar'>
                      <div className='progress-level'
                           // FIXME: progressStatus is null but should be 0
                           style={{'width': progressStatus}}
                      >
                      </div>
                    </div>
                </td>
                <td>
                    <input
                        className='b-vocabulary-column__actions-btn'
                        type='button'
                        value='Edit'
                        onClick={this.editPhrase.bind(this)}
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
    progressStatus: React.PropTypes.string.isRequired
};

class PhraseList extends React.Component {
    toggledAddNewPhrase() {
        this.send('toggledAddNewPhrase');
    }

    render() {
        return  (
            <div>
                <input
                    className='b-add-btn'
                    type='button'
                    value='Add a new phrase'
                    disabled={this.props.toggledAddNewPhrase}
                    onClick={this.toggledAddNewPhrase.bind(this)}
                />
                <input className='b-search-field' type='search' placeholder='Search' size='30'/>

                <table className='b-vocabulary-table'>
                    <tbody>
                         <tr className='b-vocabulary-table__head'>
                             <th className='b-vocabulary-column__lang'>Source language</th>
                             <th className='b-vocabulary-column__word'>Phrase</th>
                             <th className='b-vocabulary-column__lang'>Language translated to</th>
                             <th className='b-vocabulary-column__word'>Translation</th>
                             <th className='b-vocabulary-column__status'>Status</th>
                             <th className='b-vocabulary-column__actions'>Actions</th>
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
    toggledAddNewPhrase: React.PropTypes.function
};

export let TPhraseList = new TanokWrapper(PhraseList);
