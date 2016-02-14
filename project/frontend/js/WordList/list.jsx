import keycode from 'keycode'
import React from 'react'
import TanokWrapper from 'tanok/component.js';
import classSet from "classnames";


class WordItem extends React.Component {

    working_on_word(event) {
        let {eventStream} = this.props;
        eventStream.send("working_on_word", {text: event.target.value});
    }

    edit_word() {
        let {eventStream, id} = this.props;
        eventStream.send("edit_word", {wordId: id})
    }

    save_word() {
        let {eventStream} = this.props;
        eventStream.send("save_word")
    }

    remove_word() {
        let {eventStream} = this.props;
        eventStream.send('remove_word')
    }

    inputKeyPressHandler(e) {
        if (keycode(e.which) == 'enter') {
            this.save_word()
        }
    }

    render() {
        let {id, text, language, isActive, translate} = this.props;
        let textElement, editElement;


        if (isActive) {
            textElement = <input
                onChange={this.working_on_word.bind(this)}
                defaultValue={text}
                onKeyPress={this.inputKeyPressHandler.bind(this)}
            />;
            editElement = (
                <td>
                    <input
                        className="btn btn-success"
                        type="button"
                        value="Save"
                        onClick={this.save_word.bind(this)}
                    />
                    <input
                        className="btn btn-danger"
                        type="button"
                        value="Delete"
                        onClick={this.remove_word.bind(this)}
                    />
                </td>
            )
        } else {
            textElement = text;
            editElement = (
                <td>
                    <input
                        className="btn btn-info"
                        type="button"
                        value="Edit"
                        onClick={this.edit_word.bind(this)}
                    />
                </td>
            )
        }

        return (
            <tr
                className={classSet({
                    "active": isActive
                })}>
                <td>{id}</td>
                <td>{language}</td>
                <td>{textElement}</td>
                <td>{translate.join(', ')}</td>
                {editElement}
            </tr>
        )
    }
}

class WordList extends React.Component {
    render() {
        return  (
            <table className="table table-hover">
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
                                key={word.id}
                                isActive={word.id == this.props.activeWord}
                                {...word}
                            />
                        )
                    }
                </tbody>
            </table>
        )
    }
}

export let TWordList = TanokWrapper(WordList);