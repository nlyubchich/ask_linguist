var React = require("react");
var $ = require("jquery");
var _ = require("lodash");
let ReactDOM = require('react-dom');


var Asker = React.createClass({
    getSource: function (sourceList) {
        return sourceList.join(", ")
    },

    changeCurrentWord: function () {
        this.setState({currentEl: _.sample(this.state.words)})
    },

    getInitialState: function () {
        var words = this.props.initialWords.slice();
        var currentElement = _.sample(words);
        return {words: words, currentEl: currentElement, status: "", ifFail: false}
    },

    checkWord: function () {
        if (ReactDOM.findDOMNode(this.refs.guessInput).value === this.state.currentEl.target) {
            _.pull(this.state.words, this.state.currentEl);
            if (this.state.words.length !== 0){
                this.changeCurrentWord();
                console.log("success");
                ReactDOM.findDOMNode(this.refs.guessInput).value = ""
            } else {
                this.setState({status: "Finished!"})
            }
        } else {
            if (this.state.ifFail === true) {
                this.setState({status: "", ifFail: false});
                this.changeCurrentWord();
                ReactDOM.findDOMNode(this.refs.guessInput).value = ""
            } else {
                this.setState({status: this.state.currentEl.target, ifFail: true});
            }
            console.log("fail")
        }
    },

    inputKeyPress: function (e) {
        if (e.which == '13'){ // enter
            this.checkWord();
        }
    },

    render: function () {
        return (
            <div>
                <p>{"Remaining: "+this.state.words.length}</p>
                <p> {this.getSource(this.state.currentEl.source)}</p>
                <input type="text" ref="guessInput" onKeyPress={this.inputKeyPress} />
                <button onClick={this.checkWord}>"Guess"</button>
                <p>{this.state.status}</p>
            </div>
        )
    }
});


$.get("/English-French/", function (result) {
        ReactDOM.render(
            <Asker initialWords={result.words}/>,
            document.getElementById("test")
        );
    }
);