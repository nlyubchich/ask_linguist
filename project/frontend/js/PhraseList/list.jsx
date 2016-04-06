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
            <tr className='active'>
                <td>
                    <input
                        onChange={this.editedSourceLanguage.bind(this)}
                        value={sourceLanguage}
                        onKeyPress={this.inputKeyPressHandler.bind(this)}
                    />
                </td>
                <td>
                    <input
                        onChange={this.editedSourceText.bind(this)}
                        value={sourceText}
                        onKeyPress={this.inputKeyPressHandler.bind(this)}
                    />
                </td>
                <td>
                    <input
                        onChange={this.editedTranslatedLanguage.bind(this)}
                        value={translatedLanguage}
                        onKeyPress={this.inputKeyPressHandler.bind(this)}
                    />
                </td>
                <td>
                    <input
                        onChange={this.editedTranslatedText.bind(this)}
                        value={translatedText}
                        onKeyPress={this.inputKeyPressHandler.bind(this)}
                    />
                </td>
                <td>
                    <div className='progress'>
                      <div className='progress-bar progress-bar-success progress-bar-striped'
                           role='progressbar'
                           style={{'width': progressStatus}}
                      >
                      </div>
                    </div>
                </td>
                <td>
                    <input
                        className='btn btn-success'
                        type='button'
                        value='Save'
                        onClick={this.savePhrase.bind(this)}
                    />
                    <input
                        className='btn btn-danger'
                        type='button'
                        value='Delete'
                        onClick={this.removePhrase.bind(this)}
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
            <tr>
                <td>{sourceLanguage}</td>
                <td>{sourceText}</td>
                <td>{translatedLanguage}</td>
                <td>{translatedText}</td>
                <td>
                    <div className='progress'>
                      <div className='progress-bar progress-bar-success progress-bar-striped'
                           role='progressbar'
                           style={{'width': progressStatus}}
                      >
                      </div>
                    </div>
                </td>
                <td>
                    <input
                        className='btn btn-info'
                        type='button'
                        value='Edit'
                        onClick={this.editPhrase.bind(this)}
                    />
                </td>
            </tr>
        );
    }

    render() {
        return this.props.isActive ? this.renderActive() : this.renderNotActive()
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
                    className='btn btn-info'
                    type='button'
                    value='Add new phrase'
                    disabled={this.props.toggledAddNewPhrase}
                    onClick={this.toggledAddNewPhrase.bind(this)}
                />

                <table className='table table-hover'>
                    <tbody>
                        <tr>
                            <th>Source language</th>
                            <th>Source phrase</th>
                            <th>Language translated to</th>
                            <th>Translated phrase</th>
                            <th>Status</th>
                            <th>Actions</th>
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
    activePhrase: React.PropTypes.number
};

export let TPhraseList = new TanokWrapper(PhraseList);
