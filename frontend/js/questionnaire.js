require("domready")(function () {
    var React = require("react");
    var $ = require("npm-zepto");
    var _ = require("lodash");


    var Asker = React.createClass({
        displayName: "Asker",

        changeCurrentWord: function () {
            this.setState({currentEl: _.sample(this.state.words)})
        },

        getInitialState: function () {
            var words = this.props.initialWords.slice();
            var currentElement = _.sample(words);
            return {words: words, currentEl: currentElement, status: "testing"}
        },

        checkWord: function () {
            if (React.findDOMNode(this.refs.guessInput).value === this.state.currentEl.target) {
                _.pull(this.state.words, this.state.currentEl);
                if (this.state.words.length !== 0){
                    this.changeCurrentWord();
                    console.log("success")
                } else {
                    this.setState({status: "Finished!"})
                }
            } else {
                this.changeCurrentWord();
                console.log("fail")
            }
        },
        
        inputKeyPress: function (e) {
            if (e.which == '13'){ // enter
                this.checkWord();
                React.findDOMNode(this.refs.guessInput).value = ""
            }
        },

        render: function () {
            return React.DOM.div(null,
                React.DOM.p(null, "Status "+this.state.status),
                React.DOM.p(null, this.state.currentEl.source.join(", ")),
                React.DOM.input({type: "text", ref: "guessInput", onKeyPress: this.inputKeyPress}),
                React.DOM.button({onClick: this.checkWord}, "Guess")
            )
        }
    });


    $.get("/English-French/", function (result) {
            React.render(React.createElement(Asker, {initialWords: result.words}),
                document.getElementById("test"));
        }
    );


});
