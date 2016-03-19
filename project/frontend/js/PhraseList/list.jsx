import keycode from 'keycode'
import React from 'react'
import TanokWrapper from 'tanok/component.js';
import classSet from "classnames";


class PhraseInput extends React.Component {
    render() {
        let {fieldContent, isActive} = this.props;

        return isActive ?
            <input
                onChange={this.working_on_phrase.bind(this)}
                defaultValue={fieldContent}
                onKeyPress={this.inputKeyPressHandler.bind(this)}
            /> : <div>{{fieldContent}}</div>
    }
}


class PhraseItem extends React.Component {

    working_on_phrase(event) {
        let {eventStream} = this.props;
        eventStream.send("working_on_phrase", {text: event.target.value});
    }

    edit_phrase() {
        let {eventStream, phraseId} = this.props;
        eventStream.send("edit_phrase", {phraseId: phraseId})
    }

    save_phrase() {
        let {eventStream} = this.props;
        eventStream.send("save_phrase")
    }

    remove_phrase() {
        let {eventStream} = this.props;
        eventStream.send('remove_phrase')
    }

    inputKeyPressHandler(e) {
        if (keycode(e.which) == 'enter') {
            this.save_phrase()
        }
    }

    render() {
        let {sourceText, sourceLanguage, isActive, translatedLanguage, translatedText, progressStatus} = this.props;
        let textElement, editElement;
        if (isActive) {
            editElement = (
                <td>
                    <input
                        className="btn btn-success"
                        type="button"
                        value="Save"
                        onClick={this.save_phrase.bind(this)}
                    />
                    <input
                        className="btn btn-danger"
                        type="button"
                        value="Delete"
                        onClick={this.remove_phrase.bind(this)}
                    />
                </td>
            )
        } else {
            editElement = (
                <td>
                    <input
                        className="btn btn-info"
                        type="button"
                        value="Edit"
                        onClick={this.edit_phrase.bind(this)}
                    />
                </td>
            )
        }

        return (
            <tr
                className={classSet({
                    "active": isActive
                })}>
                <td>{sourceLanguage}</td>
                <td>{textElement}</td>
                <td>{translatedLanguage}</td>
                <td>{translatedText}</td>

                <td>
                    <div className="progress">
                      <div className="progress-bar progress-bar-success progress-bar-striped"
                           role="progressbar"
                           style={{"width": progressStatus}}
                      >
                      </div>
                    </div>
                </td>

                {editElement}
            </tr>
        )
    }
}

class PhraseList extends React.Component {
    render() {
        return  (
            <table className="table table-hover">
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
                                isActive={phrase.phraseId == this.props.activePhrase}
                                {...phrase}
                            />
                        )
                    }
                </tbody>
            </table>
        )
    }
}

export let TPhraseList = TanokWrapper(PhraseList);