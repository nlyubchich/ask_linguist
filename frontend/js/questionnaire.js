require("domready")(function () {
    var React = require("react");
    var $ = require("npm-zepto");
    var _ = require("lodash");


    var Asker = React.createClass({
        displayName: "Asker",
        getInitialState: function () {
            return {words: this.props.initialWords.slice(), counter: 0}
        },
        checkWord: function () {
            console.log(React.findDOMNode(this.refs.guessInput).value);
            console.log(this.state.words[this.state.counter].target);

            if (React.findDOMNode(this.refs.guessInput).value === this.state.words[this.state.counter].target) {
                console.log("success")
            } else {
                console.log("fail")
            }
        },

        render: function () {
            return React.DOM.div(null,
                React.DOM.p(null, this.state.words[this.state.counter].source),
                React.DOM.input({type: "text", ref: "guessInput"}),
                React.DOM.button({onClick: this.checkWord}, "Click me")
            )
        }
    });


    $.get("/English-French/", function (result) {
            React.render(React.createElement(Asker, {
                initialWords: result.words
            }), document.getElementById("test"));
        }
    )


});
