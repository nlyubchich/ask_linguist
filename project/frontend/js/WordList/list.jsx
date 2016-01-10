let _ = require("lodash");

import React from 'react'
import TanokWrapper from 'tanok/component.js';
import {actionIs, filter, debounce} from 'tanok/helpers.js';


class WordItem extends React.Component {
    render() {
        return <tr>
            <td>{this.props.id}</td>
            <td>English</td>
            <td>{this.props.text}</td>
            <td>
                <input
                    className="btn btn-default"
                    type="button"
                    value="Edit"
                    onClick={this.props.remove_word}
                />
                <input
                    className="btn btn-default"
                    type="button"
                    value="Delete"
                    onClick={this.props.remove_word}
                />
            </td>
        </tr>
    }
}

class WordList extends React.Component {

    remove_word(wordId) {
        this.send('remove_word', {wordId})
    }

    render() {
        return  (
            <table className="table table-striped">
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Language</th>
                        <th>Word</th>
                        <th>Actions</th>
                    </tr>
                    {
                        this.props.words.map(
                            (word, i) => <WordItem
                                remove_word={this.remove_word.bind(this, word.id)}
                                id={word.id}
                                text={word.text}
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