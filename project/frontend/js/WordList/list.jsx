import keycode from 'keycode'
import React from 'react'
import TanokWrapper from 'tanok/component.js';
import {actionIs, filter, debounce} from 'tanok/helpers.js';


class WordItem extends React.Component {

    working_on_word(event) {
        let {eventStream, wordId} = this.props;
        eventStream.send(
            "working_on_word",
            {
                wordId,
                text: event.target.value
            }
        );
    }

    edit_word() {
        let {eventStream, wordId} = this.props;
        eventStream.send("edit_word", {wordId})
    }

    save_word() {
        let {eventStream, wordId} = this.props;
        eventStream.send("save_word", {wordId})
    }

    remove_word() {
        let {eventStream, wordId} = this.props;
        eventStream.send('remove_word', {wordId})
    }

    inputKeyPressHandler(e) {
        if (keycode(e.which) === 'enter') {
            this.save_word()
        }
    }

    render() {
        let {wordId, text, language, isEdit, translate} = this.props;
        let textElement, editElement;


        if (isEdit) {
            textElement = <input
                onChange={this.working_on_word.bind(this)}
                defaultValue={text}
                onKeyPress={this.inputKeyPressHandler.bind(this)}
            />;
            editElement = <input
                className="btn btn-success"
                type="button"
                value="Save"
                onClick={this.save_word.bind(this)}
            />
        } else {
            textElement = text;
            editElement = <input
                className="btn btn-info"
                type="button"
                value="Edit"
                onClick={this.edit_word.bind(this)}
            />
        }

        return <tr>
            <td>{wordId}</td>
            <td>{language}</td>
            <td>{textElement}</td>
            <td>{translate.join(', ')}</td>
            <td>
                {editElement}
                <input
                    className="btn btn-danger"
                    type="button"
                    value="Delete"
                    onClick={this.remove_word.bind(this)}
                />
            </td>
        </tr>
    }
}

class WordList extends React.Component {
    render() {
        return  (
            <table className="table table-striped">
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Language</th>
                        <th>Word</th>
                        <th>Translations</th>
                        <th>Actions</th>
                    </tr>
                    {
                        this.props.words.map(
                            (word, i) => <WordItem
                                eventStream={this.props.eventStream}
                                wordId={word.id}
                                text={word.text}
                                language={word.language}
                                isEdit={word.isEdit}
                                translate={word.translate}
                                key={i}
                            />
                        )
                    }
                </tbody>
            </table>
        )
    }
}

export let TWordList = TanokWrapper(WordList);